<template>
  <div class="admin-moderation">
    <!-- Header avec statistiques -->
    <div class="admin-header bg-red-lighten-1 text-white py-6">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">
              <v-icon size="32" class="mr-3">mdi-gavel</v-icon>
              Modération de Contenu
            </h1>
            <p class="text-h6 font-weight-regular ma-0">
              Validation et modération de tous les contenus de la plateforme
            </p>
          </div>
          <div class="d-flex align-center ga-3">
            <v-chip color="white" text-color="red-darken-2" prepend-icon="mdi-clock-alert">
              {{ stats.totals?.pending || 0 }} en attente
            </v-chip>
            <v-btn 
              color="white" 
              variant="flat" 
              prepend-icon="mdi-refresh" 
              class="text-red-darken-2"
              @click="loadAllStats"
              :loading="loadingStats"
            >
              Actualiser
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <!-- Statistiques rapides -->
      <v-row class="mb-6">
        <v-col cols="12" md="2">
          <v-card color="orange-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-briefcase</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.opportunities?.pending || 0 }}</div>
              <div class="text-body-2">Opportunités</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="2">
          <v-card color="green-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-file-document</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.resources?.pending || 0 }}</div>
              <div class="text-body-2">Ressources</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="2">
          <v-card color="blue-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-calendar</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.events?.pending || 0 }}</div>
              <div class="text-body-2">Événements</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="2">
          <v-card color="purple-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-domain</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.companies?.pending || 0 }}</div>
              <div class="text-body-2">Entreprises</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="2">
          <v-card color="teal-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-forum</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.forum?.pending || 0 }}</div>
              <div class="text-body-2">Forum</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="2">
          <v-card color="red-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-alert</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.totals?.pending || 0 }}</div>
              <div class="text-body-2">Total</div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Onglets par type de contenu -->
      <v-card elevation="2">
        <v-tabs v-model="activeTab" bg-color="grey-lighten-4">
          <v-tab value="opportunities">
            <v-icon class="mr-2">mdi-briefcase</v-icon>
            Opportunités
            <v-chip v-if="stats.opportunities?.pending" size="small" color="warning" class="ml-2">
              {{ stats.opportunities.pending }}
            </v-chip>
          </v-tab>
          <v-tab value="resources">
            <v-icon class="mr-2">mdi-file-document</v-icon>
            Ressources
            <v-chip v-if="stats.resources?.pending" size="small" color="warning" class="ml-2">
              {{ stats.resources.pending }}
            </v-chip>
          </v-tab>
          <v-tab value="events">
            <v-icon class="mr-2">mdi-calendar</v-icon>
            Événements
            <v-chip v-if="stats.events?.pending" size="small" color="warning" class="ml-2">
              {{ stats.events.pending }}
            </v-chip>
          </v-tab>
          <v-tab value="companies">
            <v-icon class="mr-2">mdi-domain</v-icon>
            Entreprises
            <v-chip v-if="stats.companies?.pending" size="small" color="warning" class="ml-2">
              {{ stats.companies.pending }}
            </v-chip>
          </v-tab>
          <v-tab value="forum">
            <v-icon class="mr-2">mdi-forum</v-icon>
            Forum
            <v-chip v-if="stats.forum?.pending" size="small" color="warning" class="ml-2">
              {{ stats.forum.pending }}
            </v-chip>
          </v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <!-- Onglet Opportunités -->
          <v-window-item value="opportunities">
            <ModerationTab
              content-type="opportunities"
              :loading="loading"
              @approve="handleApprove"
              @reject="handleReject"
              @view-details="viewDetails"
              @bulk-action="handleBulkAction"
            />
          </v-window-item>

          <!-- Onglet Ressources -->
          <v-window-item value="resources">
            <ModerationTab
              content-type="resources"
              :loading="loading"
              @approve="handleApprove"
              @reject="handleReject"
              @view-details="viewDetails"
              @bulk-action="handleBulkAction"
            />
          </v-window-item>

          <!-- Onglet Événements -->
          <v-window-item value="events">
            <ModerationTab
              content-type="events"
              :loading="loading"
              @approve="handleApprove"
              @reject="handleReject"
              @view-details="viewDetails"
              @bulk-action="handleBulkAction"
            />
          </v-window-item>

          <!-- Onglet Entreprises -->
          <v-window-item value="companies">
            <ModerationTab
              content-type="companies"
              :loading="loading"
              @approve="handleApprove"
              @reject="handleReject"
              @view-details="viewDetails"
              @bulk-action="handleBulkAction"
            />
          </v-window-item>

          <!-- Onglet Forum -->
          <v-window-item value="forum">
            <ModerationTab
              content-type="forum_topics"
              :loading="loading"
              @approve="handleApprove"
              @reject="handleReject"
              @view-details="viewDetails"
              @bulk-action="handleBulkAction"
            />
          </v-window-item>
        </v-window>
      </v-card>
    </v-container>

    <!-- Dialog détails du contenu -->
    <v-dialog v-model="detailsDialog" max-width="900" scrollable>
      <v-card v-if="selectedContent">
        <v-card-title class="d-flex align-center">
          <v-icon class="mr-2" :color="getContentTypeColor(selectedContentType)">
            {{ getContentTypeIcon(selectedContentType) }}
          </v-icon>
          {{ selectedContent.title || selectedContent.name }}
          <v-spacer />
          <v-btn icon="mdi-close" @click="detailsDialog = false" />
        </v-card-title>
        
        <v-card-text>
          <ContentDetails
            :content="selectedContent"
            :content-type="selectedContentType"
            :moderation-history="moderationHistory"
          />
        </v-card-text>
        
        <v-card-actions>
          <v-btn 
            color="error" 
            variant="outlined"
            @click="showDeleteDialog"
            :disabled="!selectedContent?.id"
          >
            <v-icon class="mr-2">mdi-delete</v-icon>
            Supprimer
          </v-btn>
          <v-spacer />
          <v-btn 
            color="error" 
            @click="showRejectDialog"
            :loading="moderating"
          >
            <v-icon class="mr-2">mdi-close</v-icon>
            Rejeter
          </v-btn>
          <v-btn 
            color="success" 
            @click="handleApprove(selectedContentType, selectedContent?.id)"
            :loading="moderating"
            :disabled="!selectedContent?.id"
          >
            <v-icon class="mr-2">mdi-check</v-icon>
            Approuver
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de rejet -->
    <v-dialog v-model="rejectDialog" max-width="500">
      <v-card>
        <v-card-title>Rejeter le contenu</v-card-title>
        <v-card-text>
          <p class="mb-4">
            Vous êtes sur le point de rejeter ce contenu. Veuillez indiquer la raison du rejet.
          </p>
          <v-textarea
            v-model="rejectReason"
            label="Raison du rejet"
            placeholder="Expliquez pourquoi ce contenu est rejeté..."
            variant="outlined"
            rows="4"
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="rejectDialog = false">Annuler</v-btn>
          <v-btn 
            color="error" 
            @click="confirmReject"
            :loading="moderating"
            :disabled="!rejectReason.trim()"
          >
            Confirmer le rejet
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de suppression -->
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-error">
          <v-icon class="mr-2">mdi-alert</v-icon>
          Confirmer la suppression
        </v-card-title>
        <v-card-text>
          <p class="mb-4">
            Êtes-vous sûr de vouloir supprimer définitivement ce contenu ?
            <strong>{{ selectedContent?.title || selectedContent?.name }}</strong>
          </p>
          <v-alert v-if="selectedContentType === 'events'" type="warning" density="compact" class="mb-3">
            Les participants inscrits seront notifiés par email.
          </v-alert>
          <v-alert v-if="selectedContentType === 'opportunities'" type="warning" density="compact" class="mb-3">
            Les candidats seront notifiés par email.
          </v-alert>
          <v-textarea
            v-model="deleteReason"
            label="Raison de la suppression"
            variant="outlined"
            rows="2"
            placeholder="Ex: Contenu inapproprié, Demande du créateur..."
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="error" variant="flat" @click="executeDeleteContent" :loading="deleting">
            Supprimer définitivement
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

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
import { ref, onMounted, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { moderationService } from '@/services/admin/moderationService'
import ModerationTab from '@/components/admin/ModerationTab.vue'
import ContentDetails from '@/components/admin/ContentDetails.vue'

const authStore = useAuthStore()

// État réactif
const activeTab = ref('opportunities')
const loading = ref(false)
const loadingStats = ref(false)
const moderating = ref(false)

const stats = ref({
  opportunities: { pending: 0, approved: 0, rejected: 0, total: 0 },
  resources: { pending: 0, published: 0, rejected: 0, total: 0 },
  events: { pending: 0, published: 0, rejected: 0, total: 0 },
  companies: { pending: 0, published: 0, rejected: 0, total: 0 },
  forum: { pending: 0, published: 0, total: 0 },
  totals: { pending: 0, approved: 0, rejected: 0 }
})

// Dialogs
const detailsDialog = ref(false)
const rejectDialog = ref(false)
const deleteDialog = ref(false)
const selectedContent = ref(null)
const selectedContentType = ref('')
const moderationHistory = ref([])
const rejectReason = ref('')
const deleteReason = ref('')
const deleting = ref(false)

// Snackbar
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Méthodes
const loadAllStats = async () => {
  loadingStats.value = true
  try {
    const result = await moderationService.getModerationStats()
    if (result.success) {
      stats.value = result.data
    } else {
      showMessage('Erreur lors du chargement des statistiques', 'error')
    }
  } catch (error) {
    showMessage('Erreur lors du chargement des statistiques', 'error')
  } finally {
    loadingStats.value = false
  }
}

const handleApprove = async (contentType, contentId) => {
  console.log('handleApprove called:', { contentType, contentId })
  moderating.value = true
  try {
    const result = await moderationService.approveContent(
      contentType,
      contentId,
      authStore.user.id,
      'Approuvé par l\'administrateur'
    )
    console.log('approveContent result:', result)
    
    if (result.success) {
      showMessage('Contenu approuvé avec succès', 'success')
      detailsDialog.value = false
      await loadAllStats()
    } else {
      showMessage('Erreur lors de l\'approbation: ' + (result.error || 'Erreur inconnue'), 'error')
    }
  } catch (error) {
    console.error('handleApprove error:', error)
    showMessage('Erreur lors de l\'approbation: ' + error.message, 'error')
  } finally {
    moderating.value = false
  }
}

const handleReject = async (contentType, contentId, reason) => {
  moderating.value = true
  try {
    const result = await moderationService.rejectContent(
      contentType,
      contentId,
      authStore.user.id,
      reason
    )
    
    if (result.success) {
      showMessage('Contenu rejeté', 'success')
      detailsDialog.value = false
      rejectDialog.value = false
      rejectReason.value = ''
      await loadAllStats()
    } else {
      showMessage('Erreur lors du rejet', 'error')
    }
  } catch (error) {
    showMessage('Erreur lors du rejet', 'error')
  } finally {
    moderating.value = false
  }
}

const viewDetails = async (contentType, content) => {
  try {
    selectedContentType.value = contentType
    selectedContent.value = content
    
    // Charger l'historique de modération
    const historyResult = await moderationService.getModerationHistory(contentType, content.id)
    if (historyResult.success) {
      moderationHistory.value = historyResult.data
    }
    
    detailsDialog.value = true
  } catch (error) {
    showMessage('Erreur lors du chargement des détails', 'error')
  }
}

const showRejectDialog = () => {
  rejectDialog.value = true
  rejectReason.value = ''
}

const showDeleteDialog = () => {
  deleteReason.value = ''
  deleteDialog.value = true
}

const executeDeleteContent = async () => {
  if (!selectedContent.value?.id) return
  
  deleting.value = true
  try {
    const result = await moderationService.deleteContent(
      selectedContentType.value,
      selectedContent.value.id,
      deleteReason.value || 'Supprimé par l\'administrateur'
    )
    
    if (result.success) {
      const msg = result.notifiedCount > 0 
        ? `Contenu supprimé. ${result.notifiedCount} personne(s) notifiée(s).`
        : 'Contenu supprimé'
      showMessage(msg, 'success')
      deleteDialog.value = false
      detailsDialog.value = false
      await loadAllStats()
    } else {
      showMessage('Erreur: ' + result.error, 'error')
    }
  } catch (error) {
    showMessage('Erreur: ' + error.message, 'error')
  } finally {
    deleting.value = false
  }
}

const confirmReject = () => {
  if (selectedContent.value && selectedContentType.value && rejectReason.value.trim()) {
    handleReject(selectedContentType.value, selectedContent.value.id, rejectReason.value)
  }
}

const handleBulkAction = async (contentType, contentIds, action, reason = '') => {
  moderating.value = true
  try {
    const result = await moderationService.bulkModerate(
      contentType,
      contentIds,
      action,
      authStore.user.id,
      reason
    )
    
    if (result.success) {
      const { success, errors } = result.data
      showMessage(`${success} éléments traités avec succès${errors > 0 ? `, ${errors} erreurs` : ''}`, 'success')
      await loadAllStats()
    } else {
      showMessage('Erreur lors de l\'opération en masse', 'error')
    }
  } catch (error) {
    showMessage('Erreur lors de l\'opération en masse', 'error')
  } finally {
    moderating.value = false
  }
}

// Utilitaires
const getContentTypeIcon = (contentType) => {
  const icons = {
    opportunities: 'mdi-briefcase',
    resources: 'mdi-file-document',
    events: 'mdi-calendar',
    companies: 'mdi-domain',
    forum_topics: 'mdi-forum',
    forum_posts: 'mdi-message'
  }
  return icons[contentType] || 'mdi-file'
}

const getContentTypeColor = (contentType) => {
  const colors = {
    opportunities: 'orange',
    resources: 'green',
    events: 'blue',
    companies: 'purple',
    forum_topics: 'teal',
    forum_posts: 'teal'
  }
  return colors[contentType] || 'grey'
}

const showMessage = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  }
}

// Initialisation
onMounted(async () => {
  await loadAllStats()
})
</script>

<style scoped>
.admin-moderation {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.admin-header {
  background: linear-gradient(135deg, #c62828 0%, #d32f2f 100%);
}

.v-card {
  border-radius: 12px !important;
}

.v-btn {
  border-radius: 8px !important;
}

.v-tabs {
  border-radius: 12px 12px 0 0 !important;
}
</style>
