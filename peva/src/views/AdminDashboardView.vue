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
                <h1 class="text-h3 font-weight-bold mb-2">Administration PEVA</h1>
                <p class="text-h6 font-weight-regular ma-0">Tableau de bord administrateur - Gestion de la plateforme et modération</p>
              </div>
            </div>
          </div>
          <div class="d-flex align-center ga-3">
            <v-chip color="white" text-color="blue-darken-2" prepend-icon="mdi-clock">
              Dernière connexion: Aujourd'hui 09:15
            </v-chip>
            <v-btn color="white" variant="flat" prepend-icon="mdi-cog" class="text-blue-darken-2">
              Paramètres
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
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
                <div class="text-h4 font-weight-bold">23,456</div>
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
                <div class="text-h4 font-weight-bold">1,234</div>
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
                <div class="text-h4 font-weight-bold">89,567</div>
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
                <div class="text-h4 font-weight-bold">47</div>
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
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <!-- Statistiques de la Plateforme -->
      <div class="mt-8">
        <h2 class="text-h5 font-weight-bold mb-4">Statistiques de la Plateforme</h2>
        <v-row>
          <v-col cols="12" md="3">
            <div class="stats-item text-center pa-4">
              <div class="text-h4 font-weight-bold text-blue-darken-2">12,345</div>
              <div class="text-body-2">Posts forum</div>
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <div class="stats-item text-center pa-4">
              <div class="text-h4 font-weight-bold text-green-darken-2">1,567</div>
              <div class="text-body-2">Ressources</div>
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <div class="stats-item text-center pa-4">
              <div class="text-h4 font-weight-bold text-purple-darken-2">780</div>
              <div class="text-body-2">Événements</div>
            </div>
          </v-col>
          <v-col cols="12" md="3">
            <div class="stats-item text-center pa-4">
              <div class="text-h4 font-weight-bold text-orange-darken-2">2,345</div>
              <div class="text-body-2">Opportunités</div>
            </div>
          </v-col>
        </v-row>

        <!-- Détails par section -->
        <v-row class="mt-6">
          <v-col cols="12" md="4">
            <h3 class="text-h6 font-weight-bold mb-3">Utilisateurs</h3>
            <div class="d-flex justify-space-between mb-2">
              <span>Entrepreneurs</span>
              <span class="font-weight-bold">12,345</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span>Investisseurs</span>
              <span class="font-weight-bold">3,456</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span>Experts</span>
              <span class="font-weight-bold">2,789</span>
            </div>
            <div class="d-flex justify-space-between">
              <span>Organisations</span>
              <span class="font-weight-bold">1,234</span>
            </div>
          </v-col>
          
          <v-col cols="12" md="4">
            <h3 class="text-h6 font-weight-bold mb-3">Activité (7j)</h3>
            <div class="d-flex justify-space-between mb-2">
              <span>Connexions</span>
              <span class="font-weight-bold">15,678</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span>Messages</span>
              <span class="font-weight-bold">8,234</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span>Téléchargements</span>
              <span class="font-weight-bold">3,567</span>
            </div>
            <div class="d-flex justify-space-between">
              <span>Actions prises</span>
              <span class="font-weight-bold">234</span>
            </div>
          </v-col>
          
          <v-col cols="12" md="4">
            <h3 class="text-h6 font-weight-bold mb-3">Modération (30j)</h3>
            <div class="d-flex justify-space-between mb-2">
              <span>Signalements</span>
              <span class="font-weight-bold">234</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span>Actions prises</span>
              <span class="font-weight-bold">189</span>
            </div>
            <div class="d-flex justify-space-between mb-2">
              <span>Utilisateurs suspendus</span>
              <span class="font-weight-bold">12</span>
            </div>
            <div class="d-flex justify-space-between">
              <span>Contenu supprimé</span>
              <span class="font-weight-bold">67</span>
            </div>
          </v-col>
        </v-row>
      </div>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { adminService } from '@/services/adminService'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const pendingOpportunities = ref([])
const pendingActions = ref([])
const loading = ref(false)
const snackbar = ref({ show: false, message: '', color: 'success' })

const recentActivities = ref([
  {
    id: 1,
    title: 'Nouvelle inscription: Mani Diop (Entrepreneur)',
    description: 'Il y a 5 minutes',
    time: '09:15',
    icon: 'mdi-account-plus',
    color: 'green'
  },
  {
    id: 2,
    title: 'Signalement: Contenu inapproprié dans le forum',
    description: 'Signalé par 3 utilisateurs',
    time: '08:45',
    icon: 'mdi-flag',
    color: 'red'
  },
  {
    id: 3,
    title: 'Événement publié: "Workshop AgriTech Dakar"',
    description: 'Par Aminata Sow',
    time: '08:30',
    icon: 'mdi-calendar-plus',
    color: 'blue'
  },
  {
    id: 4,
    title: 'Nouveau groupe: "Water Tech Innovation"',
    description: 'Créé par Ibrahima Fall',
    time: '08:15',
    icon: 'mdi-account-group',
    color: 'purple'
  },
  {
    id: 5,
    title: 'Action modération: Utilisateur suspendu pour spam',
    description: 'Suspension de 7 jours appliquée',
    time: '07:50',
    icon: 'mdi-gavel',
    color: 'orange'
  }
])

const priorityReports = ref([
  {
    id: 1,
    content: 'Post du forum contient des propos offensants',
    reporter: 'Signalé par 3 utilisateurs',
    priority: 'Urgent',
    time: 'Il y a 15 min'
  },
  {
    id: 2,
    content: 'Utilisateur envoie des messages de spam',
    reporter: 'Signalé par Aminata S.',
    priority: 'Moyen',
    time: 'Il y a 2h'
  },
  {
    id: 3,
    content: 'Discussion non-conforme dans le groupe',
    reporter: 'Signalé par 2 utilisateurs',
    priority: 'Normal',
    time: 'Il y a 4h'
  }
])

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

// Initialize
onMounted(() => {
  loadPendingOpportunities()
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
