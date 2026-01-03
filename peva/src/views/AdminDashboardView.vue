<template>
  <div class="admin-dashboard">
    <!-- Header avec bannière professionnelle -->
    <div class="admin-header bg-blue-darken-2 text-white py-8">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div>
            <div class="d-flex align-center mb-4">
              <v-icon size="48" class="mr-4">mdi-shield-crown</v-icon>
              <div>
                <h1 class="text-h3 font-weight-bold mb-2">Administration 2iEGreenHub</h1>
                <p class="text-h6 font-weight-regular ma-0">Tableau de bord administrateur - Gestion de la plateforme et modération</p>
              </div>
            </div>
          </div>
          <div class="d-flex align-center ga-3">
            <v-chip color="white" text-color="blue-darken-2" prepend-icon="mdi-clock">
              Dernière connexion: {{ lastConnection }}
            </v-chip>
            <v-btn color="white" variant="flat" prepend-icon="mdi-cog" class="text-blue-darken-2">
              Paramètres
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <!-- Indicateur de chargement -->
      <v-progress-linear
        v-if="loading"
        indeterminate
        color="blue-darken-2"
        class="mb-4"
      />

      <!-- Actions Requises -->
      <v-alert
        v-if="pendingActions.length > 0"
        type="warning"
        variant="tonal"
        class="mb-6"
        prominent
      >
        <template v-slot:prepend>
          <v-icon>mdi-alert</v-icon>
        </template>
        <div class="d-flex align-center justify-space-between">
          <div>
            <h3 class="text-h6 font-weight-bold mb-1">Actions Requises</h3>
            <p class="ma-0">{{ pendingActions.length }} éléments nécessitent une révision</p>
          </div>
          <v-btn color="warning" variant="flat" @click="showPendingActions">
            Voir tout
          </v-btn>
        </div>
      </v-alert>

      <!-- Opportunités en attente -->
      <v-card class="mb-6" v-if="pendingOpportunities.length > 0">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" color="warning">mdi-clock-alert</v-icon>
          Opportunités en attente de modération
          <v-spacer />
          <v-chip color="warning" size="small">{{ pendingOpportunities.length }}</v-chip>
        </v-card-title>
        <v-card-text>
          <v-list>
            <v-list-item
              v-for="opportunity in pendingOpportunities.slice(0, 5)"
              :key="opportunity.id"
              class="px-0"
            >
              <template v-slot:prepend>
                <v-avatar color="blue-grey-lighten-2">
                  <v-icon>mdi-briefcase</v-icon>
                </v-avatar>
              </template>
              
              <v-list-item-title>{{ opportunity.title }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ opportunity.organization }} • {{ new Date(opportunity.created_at).toLocaleDateString('fr-FR') }}
              </v-list-item-subtitle>
              
              <template v-slot:append>
                <div class="d-flex ga-2">
                  <v-btn
                    color="success"
                    size="small"
                    variant="tonal"
                    @click="approveOpportunity(opportunity.id)"
                  >
                    Approuver
                  </v-btn>
                  <v-btn
                    color="error"
                    size="small"
                    variant="tonal"
                    @click="rejectOpportunity(opportunity.id)"
                  >
                    Rejeter
                  </v-btn>
                </div>
              </template>
            </v-list-item>
          </v-list>
          
          <v-btn
            v-if="pendingOpportunities.length > 5"
            variant="outlined"
            block
            class="mt-4"
            @click="showAllPending"
          >
            Voir toutes les {{ pendingOpportunities.length }} opportunités
          </v-btn>
        </v-card-text>
      </v-card>

      <!-- Statistiques principales -->
      <v-row class="mb-8">
        <v-col cols="12" md="3">
          <v-card color="blue-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="32" class="mr-3">mdi-account-group</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">{{ formatNumber(kpis.users?.total || 0) }}</div>
                <div class="text-body-2">Utilisateurs total</div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="green-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="32" class="mr-3">mdi-account-plus</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">{{ formatNumber(kpis.users?.new_this_month || 0) }}</div>
                <div class="text-body-2">Nouveaux Membres</div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="purple-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="32" class="mr-3">mdi-message</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">{{ formatNumber(engagementMetrics.messages_30d || 0) }}</div>
                <div class="text-body-2">Messages</div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="orange-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="32" class="mr-3">mdi-flag</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">{{ moderationStats.totals?.pending || 0 }}</div>
                <div class="text-body-2">En attente</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Actions Rapides -->
      <div class="mb-8">
        <h2 class="text-h5 font-weight-bold mb-4">Actions Rapides</h2>
        <v-row>
          <v-col cols="12" md="3">
            <v-card class="action-card text-center pa-6" elevation="2" hover @click="navigateTo('/admin/users')">
              <v-icon size="48" color="blue-darken-2" class="mb-3">mdi-account-group</v-icon>
              <h3 class="text-h6 font-weight-bold mb-2">Gestion Utilisateurs</h3>
              <p class="text-body-2 text-grey-darken-1">Membres, rôles, permissions</p>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card class="action-card text-center pa-6" elevation="2" hover @click="navigateTo('/admin/moderation')">
              <v-icon size="48" color="red-darken-2" class="mb-3">mdi-gavel</v-icon>
              <h3 class="text-h6 font-weight-bold mb-2">Modération</h3>
              <p class="text-body-2 text-grey-darken-1">Validation contenu, signalements</p>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card class="action-card text-center pa-6" elevation="2" hover @click="navigateTo('/admin/content')">
              <v-icon size="48" color="green-darken-2" class="mb-3">mdi-file-document</v-icon>
              <h3 class="text-h6 font-weight-bold mb-2">Gestion Contenu</h3>
              <p class="text-body-2 text-grey-darken-1">Posts, ressources, événements</p>
            </v-card>
          </v-col>
          <v-col cols="12" md="3">
            <v-card class="action-card text-center pa-6" elevation="2" hover @click="navigateTo('/admin/analytics')">
              <v-icon size="48" color="purple-darken-2" class="mb-3">mdi-chart-line</v-icon>
              <h3 class="text-h6 font-weight-bold mb-2">Analytics</h3>
              <p class="text-body-2 text-grey-darken-1">Statistiques, rapports</p>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <v-row>
        <!-- Activité Récente -->
        <v-col cols="12" lg="8">
          <v-card elevation="2">
            <v-card-title class="pa-4">
              <v-icon class="mr-2">mdi-history</v-icon>
              Activité Récente
              <v-spacer />
              <v-btn variant="text" color="primary" @click="seeAllActivity">
                Voir tout →
              </v-btn>
            </v-card-title>
            <v-divider />
            <v-list class="pa-0">
              <template v-if="recentActivities.length > 0">
                <v-list-item
                  v-for="activity in recentActivities"
                  :key="activity.id"
                  class="px-4 py-3"
                >
                  <template v-slot:prepend>
                    <v-avatar :color="activity.color" size="32">
                      <v-icon color="white" size="16">{{ activity.icon }}</v-icon>
                    </v-avatar>
                  </template>
                  <v-list-item-title class="text-body-1">{{ activity.title }}</v-list-item-title>
                  <v-list-item-subtitle class="text-body-2">{{ activity.description }}</v-list-item-subtitle>
                  <template v-slot:append>
                    <div class="text-caption text-grey-darken-1">{{ activity.time }}</div>
                  </template>
                </v-list-item>
              </template>
              <v-list-item v-else class="px-4 py-6 text-center">
                <v-list-item-title class="text-body-2 text-grey">Aucune activité récente</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <!-- Signalements Prioritaires -->
        <v-col cols="12" lg="4">
          <v-card elevation="2" class="mb-6">
            <v-card-title class="pa-4 bg-red-lighten-5">
              <v-icon class="mr-2" color="red-darken-2">mdi-flag</v-icon>
              Signalements Prioritaires
              <v-spacer />
              <v-btn variant="text" color="red-darken-2" @click="seeAllReports">
                Voir tout →
              </v-btn>
            </v-card-title>
            <v-divider />
            <v-list class="pa-0">
              <template v-if="priorityReports.length > 0">
                <v-list-item
                  v-for="report in priorityReports"
                  :key="report.id"
                  class="px-4 py-3"
                >
                  <template v-slot:prepend>
                    <v-chip
                      :color="report.priority === 'Urgent' ? 'red' : report.priority === 'Moyen' ? 'orange' : 'grey'"
                      size="small"
                      class="mr-3"
                    >
                      {{ report.priority }}
                    </v-chip>
                  </template>
                  <v-list-item-title class="text-body-2">{{ report.content }}</v-list-item-title>
                  <v-list-item-subtitle class="text-caption">{{ report.reporter }}</v-list-item-subtitle>
                  <template v-slot:append>
                    <div class="d-flex flex-column align-end">
                      <div class="text-caption">{{ report.time }}</div>
                      <v-btn size="x-small" color="red-darken-2" variant="flat" @click="handleReport(report)">
                        Traiter
                      </v-btn>
                    </div>
                  </template>
                </v-list-item>
              </template>
              <v-list-item v-else class="px-4 py-6 text-center">
                <v-list-item-title class="text-body-2 text-grey">Aucun signalement en attente</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <!-- Statistiques de la Plateforme -->
      <v-card elevation="2" class="mt-8 mb-8">
        <v-card-title class="pa-4 bg-grey-lighten-4">
          <v-icon class="mr-2" color="primary">mdi-chart-bar</v-icon>
          Statistiques de la Plateforme
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="6" sm="3">
              <v-card variant="tonal" color="blue" class="text-center pa-4">
                <v-icon size="32" color="blue-darken-2" class="mb-2">mdi-domain</v-icon>
                <div class="text-h4 font-weight-bold text-blue-darken-2">{{ formatNumber(kpis.companies?.total || 0) }}</div>
                <div class="text-body-2 text-grey-darken-1">Entreprises</div>
              </v-card>
            </v-col>
            <v-col cols="6" sm="3">
              <v-card variant="tonal" color="green" class="text-center pa-4">
                <v-icon size="32" color="green-darken-2" class="mb-2">mdi-file-document-multiple</v-icon>
                <div class="text-h4 font-weight-bold text-green-darken-2">{{ formatNumber(kpis.resources?.total || 0) }}</div>
                <div class="text-body-2 text-grey-darken-1">Ressources</div>
              </v-card>
            </v-col>
            <v-col cols="6" sm="3">
              <v-card variant="tonal" color="purple" class="text-center pa-4">
                <v-icon size="32" color="purple-darken-2" class="mb-2">mdi-calendar-star</v-icon>
                <div class="text-h4 font-weight-bold text-purple-darken-2">{{ formatNumber(kpis.events?.total || 0) }}</div>
                <div class="text-body-2 text-grey-darken-1">Événements</div>
              </v-card>
            </v-col>
            <v-col cols="6" sm="3">
              <v-card variant="tonal" color="orange" class="text-center pa-4">
                <v-icon size="32" color="orange-darken-2" class="mb-2">mdi-briefcase</v-icon>
                <div class="text-h4 font-weight-bold text-orange-darken-2">{{ formatNumber(kpis.opportunities?.total || 0) }}</div>
                <div class="text-body-2 text-grey-darken-1">Opportunités</div>
              </v-card>
            </v-col>
          </v-row>

          <v-divider class="my-6" />

          <!-- Détails par section -->
          <v-row>
            <v-col cols="12" md="4">
              <v-card variant="outlined" class="pa-4 h-100">
                <div class="d-flex align-center mb-4">
                  <v-icon color="blue-darken-2" class="mr-2">mdi-account-group</v-icon>
                  <h3 class="text-subtitle-1 font-weight-bold">Utilisateurs par rôle</h3>
                </div>
                <v-list density="compact" class="pa-0">
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon size="18" color="grey">mdi-account</v-icon>
                    </template>
                    <v-list-item-title>Utilisateurs</v-list-item-title>
                    <template v-slot:append>
                      <v-chip size="small" color="blue" variant="flat">{{ formatNumber(kpis.users?.by_role?.user || 0) }}</v-chip>
                    </template>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon size="18" color="grey">mdi-shield-account</v-icon>
                    </template>
                    <v-list-item-title>Modérateurs</v-list-item-title>
                    <template v-slot:append>
                      <v-chip size="small" color="orange" variant="flat">{{ formatNumber(kpis.users?.by_role?.moderator || 0) }}</v-chip>
                    </template>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon size="18" color="grey">mdi-shield-crown</v-icon>
                    </template>
                    <v-list-item-title>Administrateurs</v-list-item-title>
                    <template v-slot:append>
                      <v-chip size="small" color="red" variant="flat">{{ formatNumber(kpis.users?.by_role?.admin || 0) }}</v-chip>
                    </template>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon size="18" color="grey">mdi-check-decagram</v-icon>
                    </template>
                    <v-list-item-title>Vérifiés</v-list-item-title>
                    <template v-slot:append>
                      <v-chip size="small" color="green" variant="flat">{{ formatNumber(kpis.users?.verified || 0) }}</v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            
            <v-col cols="12" md="4">
              <v-card variant="outlined" class="pa-4 h-100">
                <div class="d-flex align-center mb-4">
                  <v-icon color="green-darken-2" class="mr-2">mdi-chart-line</v-icon>
                  <h3 class="text-subtitle-1 font-weight-bold">Activité (30j)</h3>
                </div>
                <v-list density="compact" class="pa-0">
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon size="18" color="grey">mdi-account-clock</v-icon>
                    </template>
                    <v-list-item-title>Utilisateurs actifs</v-list-item-title>
                    <template v-slot:append>
                      <v-chip size="small" color="green" variant="flat">{{ formatNumber(engagementMetrics.active_users_30d || 0) }}</v-chip>
                    </template>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon size="18" color="grey">mdi-link-variant</v-icon>
                    </template>
                    <v-list-item-title>Connexions</v-list-item-title>
                    <template v-slot:append>
                      <v-chip size="small" color="blue" variant="flat">{{ formatNumber(kpis.connections?.total || 0) }}</v-chip>
                    </template>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon size="18" color="grey">mdi-check-circle</v-icon>
                    </template>
                    <v-list-item-title>Connexions acceptées</v-list-item-title>
                    <template v-slot:append>
                      <v-chip size="small" color="teal" variant="flat">{{ formatNumber(kpis.connections?.by_status?.accepted || 0) }}</v-chip>
                    </template>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon size="18" color="grey">mdi-percent</v-icon>
                    </template>
                    <v-list-item-title>Taux engagement</v-list-item-title>
                    <template v-slot:append>
                      <v-chip size="small" color="purple" variant="flat">{{ engagementMetrics.user_engagement_rate || 0 }}%</v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
            
            <v-col cols="12" md="4">
              <v-card variant="outlined" class="pa-4 h-100">
                <div class="d-flex align-center mb-4">
                  <v-icon color="orange-darken-2" class="mr-2">mdi-shield-check</v-icon>
                  <h3 class="text-subtitle-1 font-weight-bold">Modération</h3>
                </div>
                <v-list density="compact" class="pa-0">
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon size="18" color="grey">mdi-briefcase-clock</v-icon>
                    </template>
                    <v-list-item-title>Opportunités</v-list-item-title>
                    <template v-slot:append>
                      <v-chip size="small" :color="moderationStats.opportunities?.pending > 0 ? 'warning' : 'grey'" variant="flat">{{ moderationStats.opportunities?.pending || 0 }}</v-chip>
                    </template>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon size="18" color="grey">mdi-file-clock</v-icon>
                    </template>
                    <v-list-item-title>Ressources</v-list-item-title>
                    <template v-slot:append>
                      <v-chip size="small" :color="moderationStats.resources?.pending > 0 ? 'warning' : 'grey'" variant="flat">{{ moderationStats.resources?.pending || 0 }}</v-chip>
                    </template>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon size="18" color="grey">mdi-calendar-clock</v-icon>
                    </template>
                    <v-list-item-title>Événements</v-list-item-title>
                    <template v-slot:append>
                      <v-chip size="small" :color="moderationStats.events?.pending > 0 ? 'warning' : 'grey'" variant="flat">{{ moderationStats.events?.pending || 0 }}</v-chip>
                    </template>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <template v-slot:prepend>
                      <v-icon size="18" color="grey">mdi-domain-plus</v-icon>
                    </template>
                    <v-list-item-title>Entreprises</v-list-item-title>
                    <template v-slot:append>
                      <v-chip size="small" :color="moderationStats.companies?.pending > 0 ? 'warning' : 'grey'" variant="flat">{{ moderationStats.companies?.pending || 0 }}</v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Success Snackbar -->
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { adminService } from '@/services/adminService'
import { analyticsService } from '@/services/admin/analyticsService'
import { moderationService } from '@/services/admin/moderationService'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const pendingOpportunities = ref([])
const pendingActions = ref([])
const loading = ref(true)
const snackbar = ref({ show: false, message: '', color: 'success' })

// KPIs depuis la BDD
const kpis = ref({
  users: { total: 0, new_this_week: 0, new_this_month: 0, verified: 0, by_role: {} },
  companies: { total: 0, new_this_week: 0 },
  opportunities: { total: 0, by_status: {} },
  events: { total: 0 },
  resources: { total: 0 },
  connections: { total: 0, by_status: { pending: 0 } }
})

// Statistiques de modération
const moderationStats = ref({
  totals: { pending: 0 }
})

// Métriques d'engagement
const engagementMetrics = ref({
  messages_30d: 0,
  active_users_30d: 0
})

// Activités récentes depuis la BDD
const recentActivities = ref([])

// Signalements prioritaires depuis la BDD
const priorityReports = ref([])

// Dernière connexion de l'admin
const lastConnection = computed(() => {
  const now = new Date()
  return `Aujourd'hui ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
})

// Methods
const navigateTo = (path) => {
  router.push(path)
}

const showPendingActions = () => {
  showMessage('Redirection vers les actions en attente', 'info')
}

const showReports = () => {
  showMessage('Redirection vers les signalements', 'info')
}

const seeAllActivity = () => {
  showMessage('Redirection vers l\'historique complet', 'info')
}

const seeAllReports = () => {
  showMessage('Redirection vers tous les signalements', 'info')
}

const handleReport = (report) => {
  showMessage(`Traitement du signalement: ${report.content}`, 'success')
}

// Fonctions admin pour les opportunités
const loadPendingOpportunities = async () => {
  loading.value = true
  try {
    const result = await adminService.getPendingOpportunities()
    if (result.success) {
      pendingOpportunities.value = result.data
    }
  } catch (error) {
    showMessage('Erreur lors du chargement', 'error')
  } finally {
    loading.value = false
  }
}

const approveOpportunity = async (opportunityId) => {
  try {
    const result = await adminService.approveOpportunity(opportunityId, authStore.user.id)
    if (result.success) {
      showMessage('Opportunité approuvée', 'success')
      loadPendingOpportunities()
    }
  } catch (error) {
    showMessage('Erreur lors de l\'approbation', 'error')
  }
}

const rejectOpportunity = async (opportunityId) => {
  try {
    const result = await adminService.rejectOpportunity(opportunityId, authStore.user.id)
    if (result.success) {
      showMessage('Opportunité rejetée', 'success')
      loadPendingOpportunities()
    }
  } catch (error) {
    showMessage('Erreur lors du rejet', 'error')
  }
}

const showAllPending = () => {
  router.push('/admin/opportunities')
}

const showMessage = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  }
}

// Charger les KPIs depuis la BDD
const loadKPIs = async () => {
  try {
    const result = await analyticsService.getDashboardKPIs()
    if (result.success && result.data) {
      kpis.value = result.data
    }
  } catch (error) {
    console.error('Erreur chargement KPIs:', error)
  }
}

// Charger les statistiques de modération
const loadModerationStats = async () => {
  try {
    const result = await moderationService.getModerationStats()
    if (result.success && result.data) {
      moderationStats.value = result.data
    }
  } catch (error) {
    console.error('Erreur chargement stats modération:', error)
  }
}

// Charger les métriques d'engagement
const loadEngagementMetrics = async () => {
  try {
    const result = await analyticsService.getEngagementMetrics()
    if (result.success && result.data) {
      engagementMetrics.value = result.data
    }
  } catch (error) {
    console.error('Erreur chargement métriques engagement:', error)
  }
}

// Charger l'activité récente depuis la BDD
const loadRecentActivities = async () => {
  try {
    // Charger les dernières inscriptions
    const { data: newUsers } = await supabase
      .from('pev_profiles')
      .select('id, first_name, last_name, user_type, created_at')
      .order('created_at', { ascending: false })
      .limit(3)

    // Charger les derniers événements créés
    const { data: newEvents } = await supabase
      .from('pev_events')
      .select('id, title, created_at, pev_profiles:created_by(first_name, last_name)')
      .order('created_at', { ascending: false })
      .limit(2)

    // Charger les dernières ressources
    const { data: newResources } = await supabase
      .from('pev_resources')
      .select('id, title, created_at, pev_profiles:created_by(first_name, last_name)')
      .order('created_at', { ascending: false })
      .limit(2)

    const activities = []

    // Ajouter les inscriptions
    newUsers?.forEach(user => {
      activities.push({
        id: `user-${user.id}`,
        title: `Nouvelle inscription: ${user.first_name || ''} ${user.last_name || ''} (${user.user_type || 'Utilisateur'})`,
        description: formatTimeAgo(user.created_at),
        time: new Date(user.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        icon: 'mdi-account-plus',
        color: 'green',
        created_at: user.created_at
      })
    })

    // Ajouter les événements
    newEvents?.forEach(event => {
      const creator = event.pev_profiles
      activities.push({
        id: `event-${event.id}`,
        title: `Événement créé: "${event.title}"`,
        description: creator ? `Par ${creator.first_name || ''} ${creator.last_name || ''}` : '',
        time: new Date(event.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        icon: 'mdi-calendar-plus',
        color: 'blue',
        created_at: event.created_at
      })
    })

    // Ajouter les ressources
    newResources?.forEach(resource => {
      const creator = resource.pev_profiles
      activities.push({
        id: `resource-${resource.id}`,
        title: `Ressource ajoutée: "${resource.title}"`,
        description: creator ? `Par ${creator.first_name || ''} ${creator.last_name || ''}` : '',
        time: new Date(resource.created_at).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
        icon: 'mdi-file-document',
        color: 'purple',
        created_at: resource.created_at
      })
    })

    // Trier par date et prendre les 5 plus récentes
    activities.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    recentActivities.value = activities.slice(0, 5)

  } catch (error) {
    console.error('Erreur chargement activités récentes:', error)
  }
}

// Charger les signalements (si table existe)
const loadPriorityReports = async () => {
  try {
    // Vérifier si une table de signalements existe
    const { data, error } = await supabase
      .from('pev_reports')
      .select('id, content, reporter_id, priority, created_at, pev_profiles:reporter_id(first_name, last_name)')
      .order('created_at', { ascending: false })
      .limit(5)

    if (!error && data) {
      priorityReports.value = data.map(report => ({
        id: report.id,
        content: report.content || 'Signalement',
        reporter: report.pev_profiles ? `Signalé par ${report.pev_profiles.first_name} ${report.pev_profiles.last_name}` : 'Anonyme',
        priority: report.priority || 'Normal',
        time: formatTimeAgo(report.created_at)
      }))
    }
  } catch (error) {
    // Table peut ne pas exister, ce n'est pas critique
    console.log('Table signalements non disponible')
  }
}

// Formater le temps relatif
const formatTimeAgo = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'À l\'instant'
  if (diffMins < 60) return `Il y a ${diffMins} min`
  if (diffHours < 24) return `Il y a ${diffHours}h`
  if (diffDays < 7) return `Il y a ${diffDays} jour${diffDays > 1 ? 's' : ''}`
  return date.toLocaleDateString('fr-FR')
}

// Formater les nombres
const formatNumber = (num) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num?.toString() || '0'
}

// Charger toutes les données
const loadAllData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadKPIs(),
      loadModerationStats(),
      loadEngagementMetrics(),
      loadPendingOpportunities(),
      loadRecentActivities(),
      loadPriorityReports()
    ])
  } catch (error) {
    console.error('Erreur chargement données:', error)
    showMessage('Erreur lors du chargement des données', 'error')
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  loadAllData()
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.admin-header {
  background: linear-gradient(135deg, #1565c0 0%, #1976d2 100%);
}

.action-card {
  border-radius: 12px !important;
  transition: transform 0.2s ease-in-out;
  cursor: pointer;
}

.action-card:hover {
  transform: translateY(-4px);
}

.stats-item {
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.v-btn {
  border-radius: 8px !important;
}

.v-card {
  border-radius: 12px !important;
}
</style>
