<template>
  <div class="admin-analytics">
    <!-- Header avec KPIs principaux -->
    <div class="admin-header bg-indigo-darken-2 text-white py-6">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">
              <v-icon size="32" class="mr-3">mdi-chart-line</v-icon>
              Analytics & Rapports
            </h1>
            <p class="text-h6 font-weight-regular ma-0">
              Métriques détaillées et analyse de performance de la plateforme
            </p>
          </div>
          <div class="d-flex align-center ga-3">
            <v-select
              v-model="selectedPeriod"
              :items="periodOptions"
              label="Période"
              variant="outlined"
              density="compact"
              hide-details
              class="period-selector"
              @update:model-value="loadAnalytics"
            />
            <v-btn 
              color="white" 
              variant="flat" 
              prepend-icon="mdi-download" 
              class="text-indigo-darken-2"
              @click="exportReport"
              :loading="exporting"
            >
              Exporter
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <!-- KPIs principaux -->
      <v-row class="mb-8">
        <v-col cols="12" md="3">
          <v-card color="blue-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="40" class="mr-4">mdi-account-group</v-icon>
              <div class="flex-grow-1">
                <div class="text-h4 font-weight-bold">{{ kpis.users?.total || 0 }}</div>
                <div class="text-body-2 mb-1">Utilisateurs totaux</div>
                <div class="d-flex align-center">
                  <v-icon size="16" class="mr-1" :color="getGrowthColor(kpis.users?.new_this_week)">
                    {{ getGrowthIcon(kpis.users?.new_this_week) }}
                  </v-icon>
                  <span class="text-caption">+{{ kpis.users?.new_this_week || 0 }} cette semaine</span>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="3">
          <v-card color="green-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="40" class="mr-4">mdi-briefcase</v-icon>
              <div class="flex-grow-1">
                <div class="text-h4 font-weight-bold">{{ kpis.opportunities?.total || 0 }}</div>
                <div class="text-body-2 mb-1">Opportunités</div>
                <div class="d-flex align-center">
                  <v-icon size="16" class="mr-1" :color="getGrowthColor(kpis.opportunities?.new_this_week)">
                    {{ getGrowthIcon(kpis.opportunities?.new_this_week) }}
                  </v-icon>
                  <span class="text-caption">+{{ kpis.opportunities?.new_this_week || 0 }} cette semaine</span>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="3">
          <v-card color="purple-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="40" class="mr-4">mdi-domain</v-icon>
              <div class="flex-grow-1">
                <div class="text-h4 font-weight-bold">{{ kpis.companies?.total || 0 }}</div>
                <div class="text-body-2 mb-1">Entreprises</div>
                <div class="d-flex align-center">
                  <v-icon size="16" class="mr-1" :color="getGrowthColor(kpis.companies?.new_this_week)">
                    {{ getGrowthIcon(kpis.companies?.new_this_week) }}
                  </v-icon>
                  <span class="text-caption">+{{ kpis.companies?.new_this_week || 0 }} cette semaine</span>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
        
        <v-col cols="12" md="3">
          <v-card color="orange-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="40" class="mr-4">mdi-eye</v-icon>
              <div class="flex-grow-1">
                <div class="text-h4 font-weight-bold">{{ formatNumber(engagement.total_opportunity_views) }}</div>
                <div class="text-body-2 mb-1">Vues totales</div>
                <div class="d-flex align-center">
                  <v-icon size="16" class="mr-1" color="white">mdi-trending-up</v-icon>
                  <span class="text-caption">{{ engagement.avg_views_per_opportunity }} moy/opportunité</span>
                </div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Graphiques principaux -->
      <v-row class="mb-6">
        <!-- Croissance des utilisateurs -->
        <v-col cols="12" md="8">
          <v-card elevation="2">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-chart-line</v-icon>
              Croissance des Utilisateurs
              <v-spacer />
              <v-btn-toggle v-model="userGrowthPeriod" mandatory size="small">
                <v-btn value="7d" size="small">7j</v-btn>
                <v-btn value="30d" size="small">30j</v-btn>
                <v-btn value="90d" size="small">90j</v-btn>
              </v-btn-toggle>
            </v-card-title>
            <v-card-text>
              <div class="chart-container" style="height: 300px;">
                <canvas ref="userGrowthChart"></canvas>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <!-- Répartition par rôles -->
        <v-col cols="12" md="4">
          <v-card elevation="2">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-pie-chart</v-icon>
              Répartition des Rôles
            </v-card-title>
            <v-card-text>
              <div class="chart-container" style="height: 300px;">
                <canvas ref="rolesChart"></canvas>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Métriques d'engagement et contenu -->
      <v-row class="mb-6">
        <!-- Métriques d'engagement -->
        <v-col cols="12" md="6">
          <v-card elevation="2">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-heart-pulse</v-icon>
              Engagement Utilisateurs
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="6">
                  <div class="text-center pa-4">
                    <div class="text-h3 font-weight-bold text-success">{{ engagement.active_users_30d }}</div>
                    <div class="text-body-2 text-grey-darken-1">Utilisateurs actifs (30j)</div>
                    <v-progress-linear
                      :model-value="parseFloat(engagement.user_engagement_rate)"
                      color="success"
                      height="6"
                      class="mt-2"
                    />
                    <div class="text-caption mt-1">{{ engagement.user_engagement_rate }}% d'engagement</div>
                  </div>
                </v-col>
                <v-col cols="6">
                  <div class="text-center pa-4">
                    <div class="text-h3 font-weight-bold text-info">{{ engagement.active_connections }}</div>
                    <div class="text-body-2 text-grey-darken-1">Connexions actives</div>
                    <div class="text-h5 font-weight-bold text-warning mt-3">{{ engagement.messages_30d }}</div>
                    <div class="text-body-2 text-grey-darken-1">Messages (30j)</div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
        
        <!-- Statuts de modération -->
        <v-col cols="12" md="6">
          <v-card elevation="2">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-gavel</v-icon>
              État de la Modération
            </v-card-title>
            <v-card-text>
              <div class="moderation-stats">
                <div class="d-flex align-center justify-space-between mb-3">
                  <span>Opportunités brouillons</span>
                  <v-chip color="warning" size="small">
                    {{ kpis.opportunities?.by_status?.draft || 0 }}
                  </v-chip>
                </div>
                <div class="d-flex align-center justify-space-between mb-3">
                  <span>Entreprises à vérifier</span>
                  <v-chip color="info" size="small">
                    {{ kpis.companies?.by_status?.in_review || 0 }}
                  </v-chip>
                </div>
                <div class="d-flex align-center justify-space-between mb-3">
                  <span>Événements en révision</span>
                  <v-chip color="purple" size="small">
                    {{ kpis.events?.by_status?.in_review || 0 }}
                  </v-chip>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <span>Ressources en attente</span>
                  <v-chip color="teal" size="small">
                    {{ kpis.resources?.by_status?.in_review || 0 }}
                  </v-chip>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Distribution géographique et contenu -->
      <v-row class="mb-6">
        <!-- Top pays -->
        <v-col cols="12" md="6">
          <v-card elevation="2">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-earth</v-icon>
              Distribution Géographique
            </v-card-title>
            <v-card-text>
              <v-tabs v-model="geoTab" density="compact">
                <v-tab value="users">Utilisateurs</v-tab>
                <v-tab value="companies">Entreprises</v-tab>
                <v-tab value="opportunities">Opportunités</v-tab>
              </v-tabs>
              
              <v-window v-model="geoTab" class="mt-4">
                <v-window-item value="users">
                  <div v-for="(count, country) in getTopCountries(geographic.users)" :key="country" class="d-flex align-center justify-space-between mb-2">
                    <span>{{ country }}</span>
                    <v-chip size="small" color="blue">{{ count }}</v-chip>
                  </div>
                </v-window-item>
                <v-window-item value="companies">
                  <div v-for="(count, country) in getTopCountries(geographic.companies)" :key="country" class="d-flex align-center justify-space-between mb-2">
                    <span>{{ country }}</span>
                    <v-chip size="small" color="purple">{{ count }}</v-chip>
                  </div>
                </v-window-item>
                <v-window-item value="opportunities">
                  <div v-for="(count, country) in getTopCountries(geographic.opportunities)" :key="country" class="d-flex align-center justify-space-between mb-2">
                    <span>{{ country }}</span>
                    <v-chip size="small" color="green">{{ count }}</v-chip>
                  </div>
                </v-window-item>
              </v-window>
            </v-card-text>
          </v-card>
        </v-col>
        
        <!-- Statistiques de contenu -->
        <v-col cols="12" md="6">
          <v-card elevation="2">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-file-chart</v-icon>
              Performance du Contenu
            </v-card-title>
            <v-card-text>
              <div class="content-stats">
                <div class="stat-item mb-4">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <span class="font-weight-medium">Opportunités</span>
                    <span class="text-h6">{{ kpis.opportunities?.total || 0 }}</span>
                  </div>
                  <v-progress-linear
                    :model-value="getModerationProgress('opportunities')"
                    color="green"
                    height="8"
                    rounded
                  />
                  <div class="text-caption mt-1 text-grey-darken-1">
                    {{ kpis.opportunities?.by_status?.published || 0 }} publiées / 
                    {{ kpis.opportunities?.by_status?.draft || 0 }} brouillons
                  </div>
                </div>
                
                <div class="stat-item mb-4">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <span class="font-weight-medium">Entreprises</span>
                    <span class="text-h6">{{ kpis.companies?.total || 0 }}</span>
                  </div>
                  <v-progress-linear
                    :model-value="getVerificationProgress('companies')"
                    color="purple"
                    height="8"
                    rounded
                  />
                  <div class="text-caption mt-1 text-grey-darken-1">
                    {{ kpis.companies?.verified || 0 }} vérifiées / 
                    {{ kpis.companies?.by_status?.in_review || 0 }} en révision
                  </div>
                </div>
                
                <div class="stat-item">
                  <div class="d-flex align-center justify-space-between mb-2">
                    <span class="font-weight-medium">Événements</span>
                    <span class="text-h6">{{ kpis.events?.total || 0 }}</span>
                  </div>
                  <v-progress-linear
                    :model-value="getPublicationProgress('events')"
                    color="blue"
                    height="8"
                    rounded
                  />
                  <div class="text-caption mt-1 text-grey-darken-1">
                    {{ kpis.events?.by_status?.published || 0 }} publiés / 
                    {{ kpis.events?.by_status?.in_review || 0 }} en révision
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Actions rapides -->
      <v-row>
        <v-col cols="12">
          <v-card elevation="2">
            <v-card-title class="d-flex align-center">
              <v-icon class="mr-2">mdi-lightning-bolt</v-icon>
              Actions Rapides
            </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" md="3">
                  <v-btn
                    block
                    color="primary"
                    variant="tonal"
                    prepend-icon="mdi-file-export"
                    @click="exportDetailedReport"
                    :loading="exporting"
                  >
                    Rapport Détaillé
                  </v-btn>
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn
                    block
                    color="success"
                    variant="tonal"
                    prepend-icon="mdi-gavel"
                    @click="$router.push('/admin/moderation')"
                  >
                    Modération
                  </v-btn>
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn
                    block
                    color="info"
                    variant="tonal"
                    prepend-icon="mdi-account-group"
                    @click="$router.push('/admin/users')"
                  >
                    Gestion Utilisateurs
                  </v-btn>
                </v-col>
                <v-col cols="12" md="3">
                  <v-btn
                    block
                    color="warning"
                    variant="tonal"
                    prepend-icon="mdi-refresh"
                    @click="loadAnalytics"
                    :loading="loading"
                  >
                    Actualiser
                  </v-btn>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Snackbar pour les notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="4000"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">
          Fermer
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { analyticsService } from '@/services/admin/analyticsService'
import Chart from 'chart.js/auto'

const router = useRouter()

// État réactif
const loading = ref(false)
const exporting = ref(false)
const selectedPeriod = ref('30d')
const userGrowthPeriod = ref('30d')
const geoTab = ref('users')

// Données
const kpis = ref({})
const engagement = ref({})
const geographic = ref({ users: {}, companies: {}, opportunities: {} })
const userGrowthData = ref(null)

// Charts
const userGrowthChart = ref(null)
const rolesChart = ref(null)
let userGrowthChartInstance = null
let rolesChartInstance = null

// Options
const periodOptions = [
  { title: '7 jours', value: '7d' },
  { title: '30 jours', value: '30d' },
  { title: '90 jours', value: '90d' },
  { title: '1 an', value: '1y' }
]

// Snackbar
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Méthodes
const loadAnalytics = async () => {
  loading.value = true
  try {
    const [kpisResult, engagementResult, geoResult, growthResult] = await Promise.all([
      analyticsService.getDashboardKPIs(),
      analyticsService.getEngagementMetrics(),
      analyticsService.getGeographicDistribution(),
      analyticsService.getUserGrowthStats(userGrowthPeriod.value)
    ])

    if (kpisResult.success) kpis.value = kpisResult.data
    if (engagementResult.success) engagement.value = engagementResult.data
    if (geoResult.success) geographic.value = geoResult.data
    if (growthResult.success) userGrowthData.value = growthResult.data

    await nextTick()
    updateCharts()
  } catch (error) {
    showMessage('Erreur lors du chargement des analytics', 'error')
  } finally {
    loading.value = false
  }
}

const updateCharts = () => {
  updateUserGrowthChart()
  updateRolesChart()
}

const updateUserGrowthChart = () => {
  if (!userGrowthChart.value || !userGrowthData.value) return

  const ctx = userGrowthChart.value.getContext('2d')
  
  if (userGrowthChartInstance) {
    userGrowthChartInstance.destroy()
  }

  const labels = userGrowthData.value.daily_stats?.map(d => 
    new Date(d.date).toLocaleDateString('fr-FR', { month: 'short', day: 'numeric' })
  ) || []

  const data = userGrowthData.value.daily_stats?.map(d => d.total) || []

  userGrowthChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels,
      datasets: [{
        label: 'Nouveaux utilisateurs',
        data,
        borderColor: '#1976d2',
        backgroundColor: 'rgba(25, 118, 210, 0.1)',
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  })
}

const updateRolesChart = () => {
  if (!rolesChart.value || !kpis.value.users?.by_role) return

  const ctx = rolesChart.value.getContext('2d')
  
  if (rolesChartInstance) {
    rolesChartInstance.destroy()
  }

  const roleData = kpis.value.users.by_role
  const labels = ['Utilisateurs', 'Modérateurs', 'Admins', 'Super Admins']
  const data = [roleData.user, roleData.moderator, roleData.admin, roleData.super_admin]
  const colors = ['#2196f3', '#ff9800', '#f44336', '#9c27b0']

  rolesChartInstance = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{
        data,
        backgroundColor: colors,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    }
  })
}

const exportReport = async () => {
  exporting.value = true
  try {
    const result = await analyticsService.generateReport({
      startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      endDate: new Date().toISOString()
    })
    
    if (result.success) {
      // Créer et télécharger le fichier JSON
      const blob = new Blob([JSON.stringify(result.data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `rapport-analytics-${new Date().toISOString().split('T')[0]}.json`
      a.click()
      URL.revokeObjectURL(url)
      
      showMessage('Rapport exporté avec succès', 'success')
    } else {
      showMessage('Erreur lors de l\'export', 'error')
    }
  } catch (error) {
    showMessage('Erreur lors de l\'export', 'error')
  } finally {
    exporting.value = false
  }
}

const exportDetailedReport = () => {
  // Implémenter l'export détaillé (PDF, Excel, etc.)
  showMessage('Export détaillé en cours de développement', 'info')
}

// Utilitaires
const formatNumber = (num) => {
  if (!num) return '0'
  return new Intl.NumberFormat('fr-FR').format(num)
}

const getGrowthIcon = (value) => {
  return value > 0 ? 'mdi-trending-up' : value < 0 ? 'mdi-trending-down' : 'mdi-minus'
}

const getGrowthColor = (value) => {
  return value > 0 ? 'success' : value < 0 ? 'error' : 'grey'
}

const getTopCountries = (countryData, limit = 5) => {
  if (!countryData) return {}
  
  const entries = Object.entries(countryData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, limit)
  
  return Object.fromEntries(entries)
}

const getModerationProgress = (type) => {
  const data = kpis.value[type]
  if (!data || !data.by_status) return 0
  
  const total = data.total || 1
  const published = data.by_status.published || 0
  return (published / total) * 100
}

const getVerificationProgress = (type) => {
  const data = kpis.value[type]
  if (!data) return 0
  
  const total = data.total || 1
  const verified = data.verified || 0
  return (verified / total) * 100
}

const getPublicationProgress = (type) => {
  const data = kpis.value[type]
  if (!data || !data.by_status) return 0
  
  const total = data.total || 1
  const published = data.by_status.published || 0
  return (published / total) * 100
}

const showMessage = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  }
}

// Watchers
watch(userGrowthPeriod, async () => {
  const result = await analyticsService.getUserGrowthStats(userGrowthPeriod.value)
  if (result.success) {
    userGrowthData.value = result.data
    await nextTick()
    updateUserGrowthChart()
  }
})

// Initialisation
onMounted(() => {
  loadAnalytics()
})
</script>

<style scoped>
.admin-analytics {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.admin-header {
  background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%);
}

.period-selector {
  min-width: 120px;
}

.period-selector :deep(.v-field) {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.period-selector :deep(.v-field__input) {
  color: white;
}

.chart-container {
  position: relative;
}

.moderation-stats .v-chip {
  font-weight: bold;
}

.content-stats .stat-item {
  border-bottom: 1px solid #e0e0e0;
  padding-bottom: 16px;
}

.content-stats .stat-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.v-card {
  border-radius: 12px !important;
}

.v-btn {
  border-radius: 8px !important;
}
</style>
