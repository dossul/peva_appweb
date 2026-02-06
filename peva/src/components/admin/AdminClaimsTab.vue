<template>
  <div class="admin-claims-tab pa-4">
    <!-- Stats rapides -->
    <v-row class="mb-4">
      <v-col cols="12" sm="4">
        <v-card color="orange-lighten-5" class="pa-3 text-center">
          <v-icon color="orange" size="28" class="mb-1">mdi-clock-outline</v-icon>
          <div class="text-h5 font-weight-bold text-orange">{{ stats.pending }}</div>
          <div class="text-caption">En attente</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="green-lighten-5" class="pa-3 text-center">
          <v-icon color="green" size="28" class="mb-1">mdi-check-circle</v-icon>
          <div class="text-h5 font-weight-bold text-green">{{ stats.approved }}</div>
          <div class="text-caption">Approuvés</div>
        </v-card>
      </v-col>
      <v-col cols="12" sm="4">
        <v-card color="red-lighten-5" class="pa-3 text-center">
          <v-icon color="red" size="28" class="mb-1">mdi-close-circle</v-icon>
          <div class="text-h5 font-weight-bold text-red">{{ stats.rejected }}</div>
          <div class="text-caption">Rejetés</div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filtres -->
    <div class="d-flex align-center ga-2 mb-4">
      <v-select
        v-model="statusFilter"
        :items="statusOptions"
        label="Statut"
        variant="outlined"
        density="compact"
        hide-details
        style="max-width: 200px"
      />
      <v-spacer />
      <v-btn icon="mdi-refresh" size="small" @click="loadClaims" :loading="loading" />
    </div>

    <!-- Liste des claims -->
    <v-card v-if="loading" class="pa-8 text-center">
      <v-progress-circular indeterminate color="teal" />
    </v-card>

    <div v-else-if="claims.length === 0" class="text-center py-8">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-hand-pointing-right</v-icon>
      <h3 class="text-h6 text-grey-darken-1">Aucune demande de réclamation</h3>
      <p class="text-body-2 text-grey">Les demandes apparaîtront ici</p>
    </div>

    <v-card v-for="claim in claims" :key="claim.id" class="mb-3" elevation="1">
      <v-card-text class="pa-4">
        <div class="d-flex align-start">
          <!-- Avatar utilisateur -->
          <v-avatar size="48" class="mr-4" color="teal-lighten-4">
            <v-img v-if="claim.user?.avatar_url" :src="claim.user.avatar_url" />
            <span v-else class="text-teal font-weight-bold">
              {{ getInitials(claim.user) }}
            </span>
          </v-avatar>

          <!-- Contenu -->
          <div class="flex-grow-1">
            <div class="d-flex align-center justify-space-between mb-2">
              <div>
                <h3 class="text-h6 font-weight-bold">{{ claim.company?.name }}</h3>
                <p class="text-body-2 text-grey-darken-1 ma-0">
                  Demandé par <strong>{{ claim.user?.first_name }} {{ claim.user?.last_name }}</strong>
                  ({{ claim.user?.email }})
                </p>
              </div>
              <v-chip :color="getStatusColor(claim.status)" size="small">
                {{ getStatusLabel(claim.status) }}
              </v-chip>
            </div>

            <!-- Infos entreprise -->
            <div class="d-flex align-center ga-4 mb-2">
              <span class="text-body-2">
                <v-icon size="14" class="mr-1">mdi-map-marker</v-icon>
                {{ claim.company?.city }}, {{ claim.company?.country }}
              </span>
              <span class="text-body-2">
                <v-icon size="14" class="mr-1">mdi-factory</v-icon>
                {{ claim.company?.industry }}
              </span>
            </div>

            <!-- Position et message -->
            <div v-if="claim.position_in_company" class="mb-2">
              <v-chip size="small" color="blue" variant="outlined">
                <v-icon size="14" start>mdi-briefcase</v-icon>
                {{ claim.position_in_company }}
              </v-chip>
            </div>

            <p v-if="claim.message" class="text-body-2 text-grey-darken-2 mb-2">
              "{{ claim.message }}"
            </p>

            <!-- Date -->
            <p class="text-caption text-grey">
              <v-icon size="12" class="mr-1">mdi-clock</v-icon>
              {{ formatDate(claim.created_at) }}
            </p>

            <!-- Actions (si pending) -->
            <div v-if="claim.status === 'pending'" class="d-flex ga-2 mt-3">
              <v-btn color="success" size="small" @click="approveClaim(claim)" :loading="processingId === claim.id">
                <v-icon start>mdi-check</v-icon>
                Approuver
              </v-btn>
              <v-btn color="error" size="small" variant="outlined" @click="openRejectDialog(claim)">
                <v-icon start>mdi-close</v-icon>
                Rejeter
              </v-btn>
            </div>

            <!-- Infos si traité -->
            <div v-else-if="claim.reviewed_at" class="mt-2">
              <v-alert density="compact" :type="claim.status === 'approved' ? 'success' : 'error'" variant="tonal">
                {{ claim.status === 'approved' ? 'Approuvé' : 'Rejeté' }} le {{ formatDate(claim.reviewed_at) }}
                <span v-if="claim.rejection_reason">: {{ claim.rejection_reason }}</span>
              </v-alert>
            </div>
          </div>
        </div>
      </v-card-text>
    </v-card>

    <!-- Dialog de rejet -->
    <v-dialog v-model="rejectDialog" max-width="500">
      <v-card>
        <v-card-title>Rejeter la demande</v-card-title>
        <v-card-text>
          <p class="mb-4">
            Demande de <strong>{{ claimToReject?.user?.first_name }} {{ claimToReject?.user?.last_name }}</strong>
            pour <strong>{{ claimToReject?.company?.name }}</strong>
          </p>
          <v-textarea
            v-model="rejectReason"
            label="Raison du rejet *"
            placeholder="Expliquez pourquoi cette demande est rejetée (minimum 10 caractères)..."
            variant="outlined"
            rows="4"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="rejectDialog = false">Annuler</v-btn>
          <v-btn
            color="error"
            @click="confirmReject"
            :loading="processingId === claimToReject?.id"
            :disabled="rejectReason.length < 10"
          >
            Confirmer le rejet
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
import { ref, onMounted, watch } from 'vue'
import { claimService } from '@/services/claimService'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// State
const loading = ref(true)
const claims = ref([])
const stats = ref({ pending: 0, approved: 0, rejected: 0 })
const statusFilter = ref('pending')
const processingId = ref(null)

const statusOptions = [
  { title: 'En attente', value: 'pending' },
  { title: 'Approuvés', value: 'approved' },
  { title: 'Rejetés', value: 'rejected' },
  { title: 'Tous', value: '' }
]

// Reject dialog
const rejectDialog = ref(false)
const claimToReject = ref(null)
const rejectReason = ref('')

// Snackbar
const showSnackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Methods
const loadClaims = async () => {
  loading.value = true
  try {
    const filters = statusFilter.value ? { status: statusFilter.value } : {}
    claims.value = await claimService.getAllClaims(filters)
    stats.value = await claimService.getClaimStats()
  } catch (error) {
    console.error('Erreur chargement claims:', error)
    showMessage('Erreur lors du chargement', 'error')
  } finally {
    loading.value = false
  }
}

const approveClaim = async (claim) => {
  processingId.value = claim.id
  try {
    const result = await claimService.approveClaim(claim.id, authStore.user.id)
    if (result.success) {
      showMessage(result.message, 'success')
      await loadClaims()
    } else {
      showMessage(result.error, 'error')
    }
  } catch (error) {
    showMessage(error.message, 'error')
  } finally {
    processingId.value = null
  }
}

const openRejectDialog = (claim) => {
  claimToReject.value = claim
  rejectReason.value = ''
  rejectDialog.value = true
}

const confirmReject = async () => {
  if (!claimToReject.value || rejectReason.value.length < 10) return

  processingId.value = claimToReject.value.id
  try {
    const result = await claimService.rejectClaim(
      claimToReject.value.id,
      authStore.user.id,
      rejectReason.value
    )
    if (result.success) {
      showMessage(result.message, 'success')
      rejectDialog.value = false
      await loadClaims()
    } else {
      showMessage(result.error, 'error')
    }
  } catch (error) {
    showMessage(error.message, 'error')
  } finally {
    processingId.value = null
  }
}

const getInitials = (user) => {
  if (!user) return '?'
  return `${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}`.toUpperCase()
}

const getStatusColor = (status) => {
  const colors = { pending: 'orange', approved: 'green', rejected: 'red' }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = { pending: 'En attente', approved: 'Approuvé', rejected: 'Rejeté' }
  return labels[status] || status
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const showMessage = (message, color) => {
  snackbarMessage.value = message
  snackbarColor.value = color
  showSnackbar.value = true
}

// Watchers
watch(statusFilter, () => loadClaims())

// Init
onMounted(() => loadClaims())
</script>

<style scoped>
.admin-claims-tab {
  min-height: 400px;
}
</style>
