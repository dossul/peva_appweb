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

export default {
  name: 'AnalyticsView',
  setup() {
    const selectedPeriod = ref('30d')
    const dateFrom = ref('')
    const dateTo = ref('')
    
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

    const kpis = ref({
      totalUsers: 2847,
      usersGrowth: 12.5,
      activeUsers: 1456,
      activeGrowth: 8.3,
      totalCompanies: 342,
      companiesGrowth: 15.2,
      totalOpportunities: 189,
      opportunitiesGrowth: -2.1
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

    const topCompanies = ref([
      {
        name: 'EcoTech Solutions',
        sector: 'Technologies Propres',
        activity_score: 95,
        logo: 'https://via.placeholder.com/32'
      },
      {
        name: 'Green Energy Africa',
        sector: 'Énergies Renouvelables',
        activity_score: 88,
        logo: 'https://via.placeholder.com/32'
      },
      {
        name: 'Sustainable Farms',
        sector: 'Agriculture Durable',
        activity_score: 82,
        logo: 'https://via.placeholder.com/32'
      }
    ])

    const topUsers = ref([
      {
        name: 'Dr. Amina Kone',
        role: 'Expert',
        activity_score: 98,
        avatar: 'https://via.placeholder.com/32'
      },
      {
        name: 'Prof. Jean Ouedraogo',
        role: 'Chercheur',
        activity_score: 94,
        avatar: 'https://via.placeholder.com/32'
      },
      {
        name: 'Sarah Diallo',
        role: 'Consultant',
        activity_score: 89,
        avatar: 'https://via.placeholder.com/32'
      }
    ])

    const initCharts = async () => {
      await nextTick()
      
      // Ici vous pourriez utiliser Chart.js ou une autre bibliothèque
      // Pour la démo, on simule juste les graphiques
      console.log('Initialisation des graphiques...')
      
      // Exemple avec Chart.js (à installer: npm install chart.js)
      /*
      if (registrationsChart.value) {
        new Chart(registrationsChart.value, {
          type: 'line',
          data: {
            labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun'],
            datasets: [{
              label: 'Inscriptions',
              data: [65, 78, 90, 81, 95, 102],
              borderColor: 'rgb(75, 192, 192)',
              tension: 0.1
            }]
          }
        })
      }
      */
    }

    const updateData = () => {
      console.log('Mise à jour des données pour la période:', selectedPeriod.value)
      // Ici vous feriez un appel API pour récupérer les nouvelles données
    }

    const refreshData = () => {
      console.log('Actualisation des données...')
      updateData()
      initCharts()
    }

    const exportData = () => {
      console.log('Export des données analytics...')
      // Ici vous pourriez générer un fichier Excel ou CSV
    }

    const getActivityColor = (score) => {
      if (score >= 90) return 'success'
      if (score >= 70) return 'warning'
      return 'error'
    }

    onMounted(() => {
      // Définir les dates par défaut
      const today = new Date()
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      
      dateTo.value = today.toISOString().split('T')[0]
      dateFrom.value = thirtyDaysAgo.toISOString().split('T')[0]
      
      initCharts()
    })

    return {
      selectedPeriod,
      dateFrom,
      dateTo,
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
