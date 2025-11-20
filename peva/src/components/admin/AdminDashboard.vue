<template>
  <div class="admin-dashboard">
    <!-- Statistiques principales -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card color="blue-darken-2" class="text-white pa-4" elevation="3">
          <div class="d-flex align-center">
            <v-icon size="32" class="mr-3">mdi-account-group</v-icon>
            <div>
              <div class="text-h4 font-weight-bold">{{ stats.totalUsers }}</div>
              <div class="text-body-2">Utilisateurs total</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="green-darken-2" class="text-white pa-4" elevation="3">
          <div class="d-flex align-center">
            <v-icon size="32" class="mr-3">mdi-domain</v-icon>
            <div>
              <div class="text-h4 font-weight-bold">{{ stats.totalCompanies }}</div>
              <div class="text-body-2">Entreprises</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="purple-darken-2" class="text-white pa-4" elevation="3">
          <div class="d-flex align-center">
            <v-icon size="32" class="mr-3">mdi-briefcase</v-icon>
            <div>
              <div class="text-h4 font-weight-bold">{{ stats.totalOpportunities }}</div>
              <div class="text-body-2">Opportunités</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="orange-darken-2" class="text-white pa-4" elevation="3">
          <div class="d-flex align-center">
            <v-icon size="32" class="mr-3">mdi-calendar</v-icon>
            <div>
              <div class="text-h4 font-weight-bold">{{ stats.totalEvents }}</div>
              <div class="text-body-2">Événements</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Alertes et actions requises -->
    <v-row class="mb-6">
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon color="warning" class="mr-2">mdi-alert</v-icon>
            Actions Requises
          </v-card-title>
          <v-card-text>
            <div v-if="pendingActions.length === 0" class="text-center text-grey py-4">
              <v-icon size="48" color="grey-lighten-2">mdi-check-circle</v-icon>
              <p class="text-body-2 mt-2">Aucune action requise</p>
            </div>
            <v-list v-else density="compact">
              <v-list-item
                v-for="action in pendingActions.slice(0, 5)"
                :key="action.id"
                :prepend-icon="getActionIcon(action.type)"
                :title="action.title"
                :subtitle="action.description"
                @click="handleAction(action)"
              >
                <template #append>
                  <v-chip
                    :color="getActionColor(action.priority)"
                    size="small"
                    variant="flat"
                  >
                    {{ action.priority }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
            <v-btn
              v-if="pendingActions.length > 5"
              color="warning"
              variant="text"
              block
              class="mt-2"
              @click="showAllActions"
            >
              Voir tout ({{ pendingActions.length }})
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon color="error" class="mr-2">mdi-flag</v-icon>
            Signalements
          </v-card-title>
          <v-card-text>
            <div v-if="reports.length === 0" class="text-center text-grey py-4">
              <v-icon size="48" color="grey-lighten-2">mdi-shield-check</v-icon>
              <p class="text-body-2 mt-2">Aucun signalement</p>
            </div>
            <v-list v-else density="compact">
              <v-list-item
                v-for="report in reports.slice(0, 5)"
                :key="report.id"
                :prepend-icon="getReportIcon(report.type)"
                :title="report.title"
                :subtitle="report.description"
                @click="handleReport(report)"
              >
                <template #append>
                  <v-chip
                    :color="getReportColor(report.severity)"
                    size="small"
                    variant="flat"
                  >
                    {{ report.severity }}
                  </v-chip>
                </template>
              </v-list-item>
            </v-list>
            <v-btn
              v-if="reports.length > 5"
              color="error"
              variant="text"
              block
              class="mt-2"
              @click="showAllReports"
            >
              Voir tout ({{ reports.length }})
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Activité récente -->
    <v-row class="mb-6">
      <v-col cols="12" md="8">
        <v-card elevation="2">
          <v-card-title>Activité Récente</v-card-title>
          <v-card-text>
            <v-timeline density="compact" side="end">
              <v-timeline-item
                v-for="activity in recentActivity"
                :key="activity.id"
                :dot-color="getActivityColor(activity.type)"
                size="small"
              >
                <template #icon>
                  <v-icon size="16">{{ getActivityIcon(activity.type) }}</v-icon>
                </template>
                <div class="d-flex justify-space-between align-center">
                  <div>
                    <div class="font-weight-medium">{{ activity.title }}</div>
                    <div class="text-caption text-grey-darken-1">{{ activity.description }}</div>
                  </div>
                  <div class="text-caption text-grey">
                    {{ formatTimeAgo(activity.created_at) }}
                  </div>
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card elevation="2" class="mb-4">
          <v-card-title>Croissance Mensuelle</v-card-title>
          <v-card-text>
            <div class="d-flex align-center justify-space-between mb-3">
              <div>
                <div class="text-h6 font-weight-bold text-green">+{{ growth.users }}%</div>
                <div class="text-caption">Nouveaux utilisateurs</div>
              </div>
              <v-icon color="green">mdi-trending-up</v-icon>
            </div>
            <div class="d-flex align-center justify-space-between mb-3">
              <div>
                <div class="text-h6 font-weight-bold text-blue">+{{ growth.companies }}%</div>
                <div class="text-caption">Nouvelles entreprises</div>
              </div>
              <v-icon color="blue">mdi-trending-up</v-icon>
            </div>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-h6 font-weight-bold text-purple">+{{ growth.opportunities }}%</div>
                <div class="text-caption">Nouvelles opportunités</div>
              </div>
              <v-icon color="purple">mdi-trending-up</v-icon>
            </div>
          </v-card-text>
        </v-card>

        <v-card elevation="2">
          <v-card-title>Actions Rapides</v-card-title>
          <v-card-text>
            <v-btn
              color="blue"
              variant="outlined"
              block
              class="mb-2"
              prepend-icon="mdi-account-plus"
              @click="createUser"
            >
              Créer un utilisateur
            </v-btn>
            <v-btn
              color="green"
              variant="outlined"
              block
              class="mb-2"
              prepend-icon="mdi-domain-plus"
              @click="createCompany"
            >
              Ajouter une entreprise
            </v-btn>
            <v-btn
              color="purple"
              variant="outlined"
              block
              class="mb-2"
              prepend-icon="mdi-briefcase-plus"
              @click="createOpportunity"
            >
              Créer une opportunité
            </v-btn>
            <v-btn
              color="orange"
              variant="outlined"
              block
              prepend-icon="mdi-calendar-plus"
              @click="createEvent"
            >
              Organiser un événement
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Graphiques et métriques -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Répartition par Secteur</v-card-title>
          <v-card-text>
            <div class="text-center py-8">
              <v-icon size="64" color="grey-lighten-2">mdi-chart-pie</v-icon>
              <p class="text-body-2 text-grey mt-2">Graphique à implémenter</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title>Évolution des Inscriptions</v-card-title>
          <v-card-text>
            <div class="text-center py-8">
              <v-icon size="64" color="grey-lighten-2">mdi-chart-line</v-icon>
              <p class="text-body-2 text-grey mt-2">Graphique à implémenter</p>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

// État réactif
const stats = ref({
  totalUsers: 0,
  totalCompanies: 0,
  totalOpportunities: 0,
  totalEvents: 0
})

const growth = ref({
  users: 12,
  companies: 8,
  opportunities: 15
})

const pendingActions = ref([
  {
    id: 1,
    type: 'review',
    title: 'Entreprise en attente de validation',
    description: 'SOLEKTRA International demande une validation',
    priority: 'high'
  },
  {
    id: 2,
    type: 'user',
    title: 'Utilisateur signalé',
    description: 'Comportement inapproprié rapporté',
    priority: 'medium'
  }
])

const reports = ref([
  {
    id: 1,
    type: 'spam',
    title: 'Contenu spam détecté',
    description: 'Opportunité suspecte signalée',
    severity: 'high'
  }
])

const recentActivity = ref([
  {
    id: 1,
    type: 'user_registered',
    title: 'Nouvel utilisateur inscrit',
    description: 'Marie Ouedraogo a rejoint la plateforme',
    created_at: new Date(Date.now() - 1000 * 60 * 30) // 30 minutes ago
  },
  {
    id: 2,
    type: 'company_created',
    title: 'Nouvelle entreprise ajoutée',
    description: 'BIO SAHEL a été créée',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2 hours ago
  },
  {
    id: 3,
    type: 'opportunity_published',
    title: 'Opportunité publiée',
    description: 'Financement pour projet solaire',
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 hours ago
  }
])

// Méthodes
const loadStats = async () => {
  try {
    // Charger les statistiques depuis Supabase
    const [usersCount, companiesCount, opportunitiesCount, eventsCount] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('companies').select('*', { count: 'exact', head: true }),
      supabase.from('opportunities').select('*', { count: 'exact', head: true }),
      supabase.from('events').select('*', { count: 'exact', head: true })
    ])

    stats.value = {
      totalUsers: usersCount.count || 0,
      totalCompanies: companiesCount.count || 0,
      totalOpportunities: opportunitiesCount.count || 0,
      totalEvents: eventsCount.count || 0
    }
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  }
}

const getActionIcon = (type) => {
  const icons = {
    review: 'mdi-eye-check',
    user: 'mdi-account-alert',
    content: 'mdi-file-alert',
    system: 'mdi-cog-alert'
  }
  return icons[type] || 'mdi-alert'
}

const getActionColor = (priority) => {
  const colors = {
    high: 'red',
    medium: 'orange',
    low: 'blue'
  }
  return colors[priority] || 'grey'
}

const getReportIcon = (type) => {
  const icons = {
    spam: 'mdi-email-alert',
    inappropriate: 'mdi-account-alert',
    fake: 'mdi-shield-alert',
    other: 'mdi-flag'
  }
  return icons[type] || 'mdi-flag'
}

const getReportColor = (severity) => {
  const colors = {
    high: 'red',
    medium: 'orange',
    low: 'yellow'
  }
  return colors[severity] || 'grey'
}

const getActivityIcon = (type) => {
  const icons = {
    user_registered: 'mdi-account-plus',
    company_created: 'mdi-domain-plus',
    opportunity_published: 'mdi-briefcase-plus',
    event_created: 'mdi-calendar-plus'
  }
  return icons[type] || 'mdi-information'
}

const getActivityColor = (type) => {
  const colors = {
    user_registered: 'blue',
    company_created: 'green',
    opportunity_published: 'purple',
    event_created: 'orange'
  }
  return colors[type] || 'grey'
}

const formatTimeAgo = (date) => {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 60) {
    return `il y a ${minutes} min`
  } else if (hours < 24) {
    return `il y a ${hours}h`
  } else {
    return `il y a ${days}j`
  }
}

const handleAction = (action) => {
  console.log('Gérer l\'action:', action)
  // Implémenter la logique de gestion des actions
}

const handleReport = (report) => {
  console.log('Gérer le signalement:', report)
  // Implémenter la logique de gestion des signalements
}

const showAllActions = () => {
  // Naviguer vers la vue complète des actions
}

const showAllReports = () => {
  // Naviguer vers la vue complète des signalements
}

// Actions rapides
const createUser = () => {
  // Émettre un événement pour ouvrir le dialog de création d'utilisateur
  console.log('Créer un utilisateur')
}

const createCompany = () => {
  console.log('Créer une entreprise')
}

const createOpportunity = () => {
  console.log('Créer une opportunité')
}

const createEvent = () => {
  console.log('Créer un événement')
}

// Lifecycle
onMounted(() => {
  loadStats()
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
}
</style>
