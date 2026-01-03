<template>
  <div class="analytics-view">
    <!-- Header -->
    <v-app-bar color="primary" dark>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Analytics & Statistiques</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="accent" @click="exportData">
        <v-icon left>mdi-download</v-icon>
        Exporter
      </v-btn>
    </v-app-bar>

    <v-container fluid class="pa-6">
      <!-- Filtres de période -->
      <v-row class="mb-6">
        <v-col cols="12" md="3">
          <v-select
            v-model="selectedPeriod"
            :items="periodOptions"
            label="Période"
            variant="outlined"
            @update:model-value="updateData"
          ></v-select>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="dateFrom"
            label="Date de début"
            type="date"
            variant="outlined"
            @change="updateData"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-text-field
            v-model="dateTo"
            label="Date de fin"
            type="date"
            variant="outlined"
            @change="updateData"
          ></v-text-field>
        </v-col>
        <v-col cols="12" md="3">
          <v-btn
            color="primary"
            block
            @click="refreshData"
          >
            <v-icon left>mdi-refresh</v-icon>
            Actualiser
          </v-btn>
        </v-col>
      </v-row>

      <!-- KPIs principaux -->
      <v-row class="mb-6">
        <v-col cols="12" md="3">
          <v-card color="primary" dark>
            <v-card-text>
              <div class="d-flex align-center">
                <div>
                  <div class="text-h4">{{ kpis.totalUsers }}</div>
                  <div>Utilisateurs totaux</div>
                  <div class="text-caption">
                    <v-icon size="small" :color="kpis.usersGrowth >= 0 ? 'success' : 'error'">
                      {{ kpis.usersGrowth >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
                    </v-icon>
                    {{ Math.abs(kpis.usersGrowth) }}% ce mois
                  </div>
                </div>
                <v-spacer></v-spacer>
                <v-icon size="48">mdi-account-group</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="success" dark>
            <v-card-text>
              <div class="d-flex align-center">
                <div>
                  <div class="text-h4">{{ kpis.activeUsers }}</div>
                  <div>Utilisateurs actifs</div>
                  <div class="text-caption">
                    <v-icon size="small" :color="kpis.activeGrowth >= 0 ? 'success' : 'error'">
                      {{ kpis.activeGrowth >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
                    </v-icon>
                    {{ Math.abs(kpis.activeGrowth) }}% ce mois
                  </div>
                </div>
                <v-spacer></v-spacer>
                <v-icon size="48">mdi-account-check</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="info" dark>
            <v-card-text>
              <div class="d-flex align-center">
                <div>
                  <div class="text-h4">{{ kpis.totalCompanies }}</div>
                  <div>Entreprises</div>
                  <div class="text-caption">
                    <v-icon size="small" :color="kpis.companiesGrowth >= 0 ? 'success' : 'error'">
                      {{ kpis.companiesGrowth >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
                    </v-icon>
                    {{ Math.abs(kpis.companiesGrowth) }}% ce mois
                  </div>
                </div>
                <v-spacer></v-spacer>
                <v-icon size="48">mdi-domain</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="warning" dark>
            <v-card-text>
              <div class="d-flex align-center">
                <div>
                  <div class="text-h4">{{ kpis.totalOpportunities }}</div>
                  <div>Opportunités</div>
                  <div class="text-caption">
                    <v-icon size="small" :color="kpis.opportunitiesGrowth >= 0 ? 'success' : 'error'">
                      {{ kpis.opportunitiesGrowth >= 0 ? 'mdi-trending-up' : 'mdi-trending-down' }}
                    </v-icon>
                    {{ Math.abs(kpis.opportunitiesGrowth) }}% ce mois
                  </div>
                </div>
                <v-spacer></v-spacer>
                <v-icon size="48">mdi-briefcase</v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Graphiques -->
      <v-row class="mb-6">
        <!-- Évolution des inscriptions -->
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>Évolution des inscriptions</v-card-title>
            <v-card-text>
              <div class="chart-container">
                <canvas ref="registrationsChart"></canvas>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Répartition par secteur -->
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Répartition par secteur</v-card-title>
            <v-card-text>
              <div class="chart-container">
                <canvas ref="sectorsChart"></canvas>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mb-6">
        <!-- Activité par région -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Activité par région</v-card-title>
            <v-card-text>
              <div class="chart-container">
                <canvas ref="regionsChart"></canvas>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Engagement utilisateurs -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Engagement utilisateurs</v-card-title>
            <v-card-text>
              <div class="chart-container">
                <canvas ref="engagementChart"></canvas>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Tableaux détaillés -->
      <v-row>
        <!-- Top entreprises -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Top Entreprises (Activité)</v-card-title>
            <v-data-table
              :headers="companiesHeaders"
              :items="topCompanies"
              :items-per-page="5"
              class="elevation-0"
            >
              <template v-slot:item.logo="{ item }">
                <v-avatar size="32">
                  <v-img :src="item.logo || '/default-company.png'"></v-img>
                </v-avatar>
              </template>
              <template v-slot:item.activity_score="{ item }">
                <v-progress-linear
                  :model-value="item.activity_score"
                  color="primary"
                  height="6"
                ></v-progress-linear>
              </template>
            </v-data-table>
          </v-card>
        </v-col>

        <!-- Utilisateurs les plus actifs -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title>Utilisateurs les plus actifs</v-card-title>
            <v-data-table
              :headers="usersHeaders"
              :items="topUsers"
              :items-per-page="5"
              class="elevation-0"
            >
              <template v-slot:item.avatar="{ item }">
                <v-avatar size="32">
                  <v-img :src="item.avatar || '/default-avatar.png'"></v-img>
                </v-avatar>
              </template>
              <template v-slot:item.activity_score="{ item }">
                <v-chip :color="getActivityColor(item.activity_score)" small>
                  {{ item.activity_score }}
                </v-chip>
              </template>
            </v-data-table>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'
import { analyticsService } from '@/services/admin/analyticsService'
import { supabase } from '@/lib/supabase'

export default {
  name: 'AnalyticsView',
  setup() {
    const selectedPeriod = ref('30d')
    const dateFrom = ref('')
    const dateTo = ref('')
    const loading = ref(false)
    
    const registrationsChart = ref(null)
    const sectorsChart = ref(null)
    const regionsChart = ref(null)
    const engagementChart = ref(null)

    const periodOptions = [
      { title: '7 derniers jours', value: '7d' },
      { title: '30 derniers jours', value: '30d' },
      { title: '3 derniers mois', value: '3m' },
      { title: '6 derniers mois', value: '6m' },
      { title: '1 an', value: '1y' },
      { title: 'Personnalisé', value: 'custom' }
    ]

    // KPIs initialisés à 0, seront chargés depuis Supabase
    const kpis = ref({
      totalUsers: 0,
      usersGrowth: 0,
      activeUsers: 0,
      activeGrowth: 0,
      totalCompanies: 0,
      companiesGrowth: 0,
      totalOpportunities: 0,
      opportunitiesGrowth: 0
    })

    const companiesHeaders = [
      { title: 'Logo', key: 'logo', sortable: false },
      { title: 'Entreprise', key: 'name' },
      { title: 'Secteur', key: 'sector' },
      { title: 'Activité', key: 'activity_score', sortable: false }
    ]

    const usersHeaders = [
      { title: 'Avatar', key: 'avatar', sortable: false },
      { title: 'Nom', key: 'name' },
      { title: 'Rôle', key: 'role' },
      { title: 'Score', key: 'activity_score' }
    ]

    // Données chargées depuis Supabase
    const topCompanies = ref([])
    const topUsers = ref([])

    // Charger les KPIs depuis Supabase
    const loadKPIs = async () => {
      try {
        const result = await analyticsService.getDashboardKPIs()
        if (result.success && result.data) {
          const data = result.data
          
          // Calculer le taux de croissance
          const calcGrowth = (newCount, total) => {
            if (total === 0) return 0
            return parseFloat(((newCount / total) * 100).toFixed(1))
          }
          
          kpis.value = {
            totalUsers: data.users?.total || 0,
            usersGrowth: calcGrowth(data.users?.new_this_month || 0, data.users?.total || 1),
            activeUsers: data.users?.onboarding_completed || 0,
            activeGrowth: calcGrowth(data.users?.new_this_week || 0, data.users?.total || 1),
            totalCompanies: data.companies?.total || 0,
            companiesGrowth: calcGrowth(data.companies?.new_this_month || 0, data.companies?.total || 1),
            totalOpportunities: data.opportunities?.total || 0,
            opportunitiesGrowth: calcGrowth(data.opportunities?.new_this_month || 0, data.opportunities?.total || 1)
          }
        }
      } catch (error) {
        console.error('Erreur chargement KPIs:', error)
      }
    }

    // Charger les top entreprises depuis Supabase
    const loadTopCompanies = async () => {
      try {
        const { data, error } = await supabase
          .from('pev_companies')
          .select('id, name, sector, logo_url, status')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(5)

        if (!error && data) {
          topCompanies.value = data.map((company, index) => ({
            name: company.name || 'Entreprise',
            sector: company.sector || 'Non spécifié',
            activity_score: 100 - (index * 10),
            logo: company.logo_url || null
          }))
        }
      } catch (error) {
        console.error('Erreur chargement entreprises:', error)
      }
    }

    // Charger les top utilisateurs depuis Supabase
    const loadTopUsers = async () => {
      try {
        const { data, error } = await supabase
          .from('pev_profiles')
          .select('id, first_name, last_name, role, avatar_url, user_type')
          .eq('onboarding_completed', true)
          .order('created_at', { ascending: false })
          .limit(5)

        if (!error && data) {
          topUsers.value = data.map((user, index) => ({
            name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Utilisateur',
            role: user.user_type || user.role || 'Utilisateur',
            activity_score: 100 - (index * 5),
            avatar: user.avatar_url || null
          }))
        }
      } catch (error) {
        console.error('Erreur chargement utilisateurs:', error)
      }
    }

    const initCharts = async () => {
      await nextTick()
      console.log('Initialisation des graphiques...')
    }

    const updateData = async () => {
      loading.value = true
      try {
        await Promise.all([
          loadKPIs(),
          loadTopCompanies(),
          loadTopUsers()
        ])
      } catch (error) {
        console.error('Erreur mise à jour données:', error)
      } finally {
        loading.value = false
      }
    }

    const refreshData = () => {
      updateData()
      initCharts()
    }

    const exportData = () => {
      console.log('Export des données analytics...')
    }

    const getActivityColor = (score) => {
      if (score >= 90) return 'success'
      if (score >= 70) return 'warning'
      return 'error'
    }

    onMounted(async () => {
      // Définir les dates par défaut
      const today = new Date()
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      
      dateTo.value = today.toISOString().split('T')[0]
      dateFrom.value = thirtyDaysAgo.toISOString().split('T')[0]
      
      // Charger les données depuis Supabase
      await updateData()
      initCharts()
    })

    return {
      selectedPeriod,
      dateFrom,
      dateTo,
      loading,
      registrationsChart,
      sectorsChart,
      regionsChart,
      engagementChart,
      periodOptions,
      kpis,
      companiesHeaders,
      usersHeaders,
      topCompanies,
      topUsers,
      updateData,
      refreshData,
      exportData,
      getActivityColor
    }
  }
}
</script>

<style scoped>
.analytics-view {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.chart-container {
  height: 300px;
  position: relative;
}

.chart-container canvas {
  max-height: 100%;
}
</style>
