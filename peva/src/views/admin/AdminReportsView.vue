<template>
  <div class="admin-reports">
    <!-- Header -->
    <div class="admin-header bg-red-darken-2 text-white py-6">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-btn icon="mdi-arrow-left" variant="text" class="mr-3" @click="$router.push('/admin/dashboard')" />
            <v-icon size="40" class="mr-4">mdi-flag</v-icon>
            <div>
              <h1 class="text-h4 font-weight-bold mb-1">Gestion des Signalements</h1>
              <p class="text-subtitle-1 ma-0">Traitement des signalements de contenu</p>
            </div>
          </div>
          <div class="d-flex align-center ga-3">
            <v-chip color="white" text-color="red-darken-2" v-if="stats.pending > 0">
              {{ stats.pending }} en attente
            </v-chip>
          </div>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <!-- Statistiques rapides -->
      <v-row class="mb-6">
        <v-col cols="6" md="3">
          <v-card color="orange-lighten-5" class="pa-4 text-center">
            <div class="text-h4 font-weight-bold text-orange-darken-2">{{ stats.pending }}</div>
            <div class="text-body-2 text-grey-darken-1">En attente</div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card color="blue-lighten-5" class="pa-4 text-center">
            <div class="text-h4 font-weight-bold text-blue-darken-2">{{ stats.reviewed }}</div>
            <div class="text-body-2 text-grey-darken-1">En cours</div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card color="green-lighten-5" class="pa-4 text-center">
            <div class="text-h4 font-weight-bold text-green-darken-2">{{ stats.resolved }}</div>
            <div class="text-body-2 text-grey-darken-1">Résolus</div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card color="grey-lighten-3" class="pa-4 text-center">
            <div class="text-h4 font-weight-bold text-grey-darken-2">{{ stats.dismissed }}</div>
            <div class="text-body-2 text-grey-darken-1">Rejetés</div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Priorités en attente -->
      <v-row class="mb-6" v-if="stats.byPriority?.critical > 0 || stats.byPriority?.high > 0">
        <v-col cols="12">
          <v-alert type="error" variant="tonal">
            <div class="d-flex align-center ga-4">
              <span v-if="stats.byPriority?.critical > 0">
                <v-chip color="red" size="small" class="mr-1">{{ stats.byPriority.critical }}</v-chip> critiques
              </span>
              <span v-if="stats.byPriority?.high > 0">
                <v-chip color="orange" size="small" class="mr-1">{{ stats.byPriority.high }}</v-chip> urgents
              </span>
              <span class="text-body-2">nécessitent une attention immédiate</span>
            </div>
          </v-alert>
        </v-col>
      </v-row>

      <!-- Filtres -->
      <v-card class="mb-6" elevation="2">
        <v-card-text class="d-flex align-center ga-4 flex-wrap">
          <v-btn-toggle v-model="filters.status" mandatory color="red-darken-2">
            <v-btn value="all">Tous</v-btn>
            <v-btn value="pending">En attente</v-btn>
            <v-btn value="reviewed">En cours</v-btn>
            <v-btn value="resolved">Résolus</v-btn>
            <v-btn value="dismissed">Rejetés</v-btn>
          </v-btn-toggle>
          
          <v-select
            v-model="filters.priority"
            :items="priorityOptions"
            label="Priorité"
            variant="outlined"
            density="compact"
            hide-details
            style="max-width: 150px"
          />
          
          <v-select
            v-model="filters.target_type"
            :items="targetTypeOptions"
            label="Type de contenu"
            variant="outlined"
            density="compact"
            hide-details
            style="max-width: 180px"
          />
          
          <v-spacer />
          
          <v-btn color="primary" variant="text" @click="loadReports" :loading="loading">
            <v-icon start>mdi-refresh</v-icon>
            Actualiser
          </v-btn>
        </v-card-text>
      </v-card>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <v-progress-circular indeterminate color="red-darken-2" size="64" />
        <p class="mt-4 text-grey">Chargement des signalements...</p>
      </div>

      <!-- Liste vide -->
      <v-card v-else-if="filteredReports.length === 0" class="pa-12 text-center">
        <v-icon size="64" color="grey-lighten-1">mdi-flag-checkered</v-icon>
        <h3 class="text-h6 mt-4 text-grey">Aucun signalement</h3>
        <p class="text-body-2 text-grey">
          {{ filters.status === 'all' ? 'Aucun signalement pour le moment.' : 'Aucun signalement avec ce statut.' }}
        </p>
      </v-card>

      <!-- Liste des signalements -->
      <v-card v-else elevation="2">
        <v-list lines="three">
          <template v-for="(report, index) in filteredReports" :key="report.id">
            <v-list-item @click="openReportDialog(report)">
              <template #prepend>
                <v-chip
                  :color="getPriorityColor(report.priority)"
                  size="small"
                  class="mr-3"
                  style="min-width: 70px"
                >
                  {{ getPriorityLabel(report.priority) }}
                </v-chip>
              </template>

              <v-list-item-title class="font-weight-bold">
                {{ report.content.substring(0, 100) }}{{ report.content.length > 100 ? '...' : '' }}
              </v-list-item-title>
              
              <v-list-item-subtitle>
                <div class="d-flex align-center ga-2 mt-1">
                  <v-chip size="x-small" variant="outlined">
                    {{ getTargetTypeLabel(report.target_type) }}
                  </v-chip>
                  <span class="text-caption">
                    Signalé par {{ report.reporter?.first_name }} {{ report.reporter?.last_name }}
                  </span>
                  <span class="text-caption text-grey">
                    • {{ formatDate(report.created_at) }}
                  </span>
                </div>
              </v-list-item-subtitle>

              <template #append>
                <div class="d-flex align-center ga-2">
                  <v-chip
                    :color="getStatusColor(report.status)"
                    size="small"
                    variant="flat"
                  >
                    {{ getStatusLabel(report.status) }}
                  </v-chip>
                  
                  <v-btn
                    v-if="report.status === 'pending'"
                    icon="mdi-gavel"
                    color="primary"
                    variant="tonal"
                    size="small"
                    @click.stop="openReportDialog(report)"
                  />
                </div>
              </template>
            </v-list-item>
            <v-divider v-if="index < filteredReports.length - 1" />
          </template>
        </v-list>
      </v-card>
    </v-container>

    <!-- Dialog de traitement -->
    <v-dialog v-model="reportDialog" max-width="800" persistent>
      <v-card v-if="selectedReport">
        <v-card-title class="d-flex align-center bg-red-lighten-5">
          <v-icon color="red-darken-2" class="mr-2">mdi-flag</v-icon>
          Traitement du signalement
          <v-spacer />
          <v-chip :color="getPriorityColor(selectedReport.priority)" size="small">
            {{ getPriorityLabel(selectedReport.priority) }}
          </v-chip>
        </v-card-title>
        
        <v-card-text class="pa-6">
          <!-- Informations du signalement -->
          <div class="mb-6">
            <h4 class="text-subtitle-1 font-weight-bold mb-2">Signalement</h4>
            <v-card variant="outlined" class="pa-4">
              <p class="text-body-1 mb-3">{{ selectedReport.content }}</p>
              <div class="d-flex align-center ga-3 text-caption text-grey">
                <span>
                  <v-icon size="14" class="mr-1">mdi-account</v-icon>
                  {{ selectedReport.reporter?.first_name }} {{ selectedReport.reporter?.last_name }}
                </span>
                <span>
                  <v-icon size="14" class="mr-1">mdi-clock</v-icon>
                  {{ formatDate(selectedReport.created_at) }}
                </span>
              </div>
            </v-card>
          </div>

          <!-- Contenu signalé -->
          <div class="mb-6">
            <h4 class="text-subtitle-1 font-weight-bold mb-2">
              Contenu signalé ({{ getTargetTypeLabel(selectedReport.target_type) }})
            </h4>
            <v-card variant="outlined" class="pa-4" v-if="reportedContent">
              <div v-if="selectedReport.target_type === 'user'">
                <div class="d-flex align-center ga-3">
                  <v-avatar size="48">
                    <v-img v-if="reportedContent.avatar_url" :src="reportedContent.avatar_url" />
                    <v-icon v-else>mdi-account</v-icon>
                  </v-avatar>
                  <div>
                    <div class="font-weight-bold">{{ reportedContent.first_name }} {{ reportedContent.last_name }}</div>
                    <div class="text-caption text-grey">{{ reportedContent.email }}</div>
                  </div>
                </div>
              </div>
              <div v-else>
                <h5 class="font-weight-bold mb-2">{{ reportedContent.title || reportedContent.name }}</h5>
                <p class="text-body-2 text-grey mb-2" v-if="reportedContent.description">
                  {{ reportedContent.description?.substring(0, 300) }}...
                </p>
                <div class="text-caption text-grey" v-if="reportedContent.creator || reportedContent.author">
                  Auteur: {{ (reportedContent.creator || reportedContent.author)?.first_name }}
                  {{ (reportedContent.creator || reportedContent.author)?.last_name }}
                  ({{ (reportedContent.creator || reportedContent.author)?.email }})
                </div>
              </div>
            </v-card>
            <v-skeleton-loader v-else type="article" />
          </div>

          <!-- Actions -->
          <div class="mb-4" v-if="selectedReport.status === 'pending' || selectedReport.status === 'reviewed'">
            <h4 class="text-subtitle-1 font-weight-bold mb-2">Action à prendre</h4>
            <v-radio-group v-model="selectedAction" inline>
              <v-radio label="Supprimer le contenu" value="delete" color="error" />
              <v-radio label="Avertir l'auteur" value="warn" color="warning" />
              <v-radio label="Rejeter le signalement" value="dismiss" color="grey" />
            </v-radio-group>
          </div>

          <!-- Notes admin -->
          <v-textarea
            v-model="adminNotes"
            label="Notes administrateur"
            placeholder="Expliquez votre décision..."
            variant="outlined"
            rows="3"
            :readonly="selectedReport.status === 'resolved' || selectedReport.status === 'dismissed'"
          />

          <!-- Notification -->
          <v-alert 
            v-if="selectedAction && selectedAction !== 'dismiss'" 
            type="info" 
            density="compact" 
            class="mt-3"
          >
            L'auteur du contenu recevra deux emails: un pour le signalement et un pour l'action prise.
          </v-alert>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn @click="closeReportDialog" :disabled="processing">
            {{ selectedReport.status === 'resolved' || selectedReport.status === 'dismissed' ? 'Fermer' : 'Annuler' }}
          </v-btn>
          <v-btn
            v-if="selectedReport.status === 'pending' || selectedReport.status === 'reviewed'"
            color="primary"
            variant="flat"
            @click="processReport"
            :loading="processing"
            :disabled="!selectedAction"
          >
            Appliquer l'action
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" timeout="4000">
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { reportsService } from '@/services/admin/reportsService'

const authStore = useAuthStore()

const loading = ref(true)
const reports = ref([])
const stats = ref({
  total: 0,
  pending: 0,
  reviewed: 0,
  resolved: 0,
  dismissed: 0,
  byPriority: {}
})

const filters = ref({
  status: 'pending',
  priority: 'all',
  target_type: 'all'
})

const priorityOptions = [
  { title: 'Toutes', value: 'all' },
  { title: 'Critique', value: 'critical' },
  { title: 'Haute', value: 'high' },
  { title: 'Moyenne', value: 'medium' },
  { title: 'Basse', value: 'low' }
]

const targetTypeOptions = [
  { title: 'Tous types', value: 'all' },
  { title: 'Opportunités', value: 'opportunity' },
  { title: 'Événements', value: 'event' },
  { title: 'Ressources', value: 'resource' },
  { title: 'Forum - Sujets', value: 'forum_topic' },
  { title: 'Forum - Posts', value: 'forum_post' },
  { title: 'Utilisateurs', value: 'user' },
  { title: 'Entreprises', value: 'company' }
]

const reportDialog = ref(false)
const selectedReport = ref(null)
const reportedContent = ref(null)
const selectedAction = ref(null)
const adminNotes = ref('')
const processing = ref(false)

const showSnackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

const filteredReports = computed(() => {
  return reports.value
})

const loadReports = async () => {
  loading.value = true
  try {
    const [reportsResult, statsResult] = await Promise.all([
      reportsService.getReports(filters.value),
      reportsService.getReportsStats()
    ])

    if (reportsResult.success) {
      reports.value = reportsResult.data
    }

    if (statsResult.success) {
      stats.value = statsResult.data
    }
  } catch (error) {
    console.error('Erreur chargement:', error)
    showMessage('Erreur lors du chargement', 'error')
  } finally {
    loading.value = false
  }
}

const openReportDialog = async (report) => {
  selectedReport.value = report
  selectedAction.value = null
  adminNotes.value = report.admin_notes || ''
  reportedContent.value = null
  reportDialog.value = true

  // Charger le contenu signalé
  const result = await reportsService.getReportedContent(report.target_type, report.target_id)
  if (result.success) {
    reportedContent.value = result.data
  }
}

const closeReportDialog = () => {
  reportDialog.value = false
  selectedReport.value = null
  reportedContent.value = null
  selectedAction.value = null
  adminNotes.value = ''
}

const processReport = async () => {
  if (!selectedReport.value || !selectedAction.value) return

  processing.value = true
  try {
    const result = await reportsService.resolveReport(
      selectedReport.value.id,
      selectedAction.value,
      adminNotes.value,
      authStore.user?.id
    )

    if (result.success) {
      showMessage(`Signalement traité: ${result.action}`, 'success')
      closeReportDialog()
      loadReports()
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('Erreur traitement:', error)
    showMessage('Erreur lors du traitement', 'error')
  } finally {
    processing.value = false
  }
}

const getPriorityColor = (priority) => {
  const colors = {
    critical: 'red',
    high: 'orange',
    medium: 'blue',
    low: 'grey'
  }
  return colors[priority] || 'grey'
}

const getPriorityLabel = (priority) => {
  const labels = {
    critical: 'Critique',
    high: 'Haute',
    medium: 'Moyenne',
    low: 'Basse'
  }
  return labels[priority] || priority
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'orange',
    reviewed: 'blue',
    resolved: 'success',
    dismissed: 'grey'
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    reviewed: 'En cours',
    resolved: 'Résolu',
    dismissed: 'Rejeté'
  }
  return labels[status] || status
}

const getTargetTypeLabel = (targetType) => {
  const labels = {
    opportunity: 'Opportunité',
    event: 'Événement',
    resource: 'Ressource',
    forum_topic: 'Sujet forum',
    forum_post: 'Post forum',
    user: 'Utilisateur',
    company: 'Entreprise',
    message: 'Message'
  }
  return labels[targetType] || targetType
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const showMessage = (message, color = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  showSnackbar.value = true
}

watch(filters, () => {
  loadReports()
}, { deep: true })

onMounted(() => {
  loadReports()
})
</script>

<style scoped>
.admin-header {
  background: linear-gradient(135deg, #c62828 0%, #ef5350 100%);
}
</style>
