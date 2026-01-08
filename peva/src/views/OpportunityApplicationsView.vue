<template>
  <div class="opportunity-applications-view">
    <!-- Header -->
    <div class="hero-banner bg-orange-darken-2 text-white py-6">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-btn icon="mdi-arrow-left" variant="text" class="mr-3" @click="$router.back()" />
            <v-icon size="40" class="mr-4">mdi-account-group</v-icon>
            <div>
              <h1 class="text-h4 font-weight-bold mb-1">Candidatures reçues</h1>
              <p class="text-subtitle-1 ma-0" v-if="opportunity">{{ opportunity.title }}</p>
            </div>
          </div>
          <div class="d-flex align-center ga-3">
            <v-chip color="white" text-color="orange-darken-2">
              {{ applications.length }} candidature{{ applications.length > 1 ? 's' : '' }}
            </v-chip>
          </div>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <v-progress-circular indeterminate color="orange-darken-2" size="64" />
        <p class="mt-4 text-grey">Chargement des candidatures...</p>
      </div>

      <!-- Erreur d'accès -->
      <v-alert v-else-if="accessDenied" type="error" class="mb-6">
        <v-alert-title>Accès refusé</v-alert-title>
        Vous n'êtes pas autorisé à voir les candidatures pour cette opportunité.
      </v-alert>

      <!-- Contenu principal -->
      <template v-else>
        <!-- Statistiques rapides -->
        <v-row class="mb-6">
          <v-col cols="6" md="3">
            <v-card color="blue-lighten-5" class="pa-4 text-center">
              <div class="text-h4 font-weight-bold text-blue-darken-2">{{ stats.total }}</div>
              <div class="text-body-2 text-grey-darken-1">Total</div>
            </v-card>
          </v-col>
          <v-col cols="6" md="3">
            <v-card color="orange-lighten-5" class="pa-4 text-center">
              <div class="text-h4 font-weight-bold text-orange-darken-2">{{ stats.pending }}</div>
              <div class="text-body-2 text-grey-darken-1">En attente</div>
            </v-card>
          </v-col>
          <v-col cols="6" md="3">
            <v-card color="green-lighten-5" class="pa-4 text-center">
              <div class="text-h4 font-weight-bold text-green-darken-2">{{ stats.accepted }}</div>
              <div class="text-body-2 text-grey-darken-1">Acceptées</div>
            </v-card>
          </v-col>
          <v-col cols="6" md="3">
            <v-card color="red-lighten-5" class="pa-4 text-center">
              <div class="text-h4 font-weight-bold text-red-darken-2">{{ stats.rejected }}</div>
              <div class="text-body-2 text-grey-darken-1">Refusées</div>
            </v-card>
          </v-col>
        </v-row>

        <!-- Filtres -->
        <v-card class="mb-6" elevation="2">
          <v-card-text class="d-flex align-center ga-4 flex-wrap">
            <v-btn-toggle v-model="statusFilter" mandatory color="orange-darken-2">
              <v-btn value="all">Toutes</v-btn>
              <v-btn value="pending">En attente</v-btn>
              <v-btn value="accepted">Acceptées</v-btn>
              <v-btn value="rejected">Refusées</v-btn>
            </v-btn-toggle>
            <v-spacer />
            <v-text-field
              v-model="searchQuery"
              placeholder="Rechercher un candidat..."
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              style="max-width: 300px"
            />
          </v-card-text>
        </v-card>

        <!-- Liste vide -->
        <v-card v-if="filteredApplications.length === 0" class="pa-12 text-center">
          <v-icon size="64" color="grey-lighten-1">mdi-inbox-outline</v-icon>
          <h3 class="text-h6 mt-4 text-grey">Aucune candidature</h3>
          <p class="text-body-2 text-grey">
            {{ statusFilter === 'all' ? 'Aucune candidature reçue pour le moment.' : 'Aucune candidature avec ce statut.' }}
          </p>
        </v-card>

        <!-- Liste des candidatures -->
        <v-card v-else elevation="2">
          <v-list lines="three">
            <template v-for="(application, index) in filteredApplications" :key="application.id">
              <v-list-item>
                <template #prepend>
                  <v-avatar size="50" :color="getAvatarColor(application.user?.first_name)">
                    <v-img v-if="application.user?.avatar_url" :src="application.user.avatar_url" />
                    <span v-else class="text-h6 text-white">
                      {{ getInitials(application.user) }}
                    </span>
                  </v-avatar>
                </template>

                <v-list-item-title class="font-weight-bold">
                  {{ application.user?.first_name }} {{ application.user?.last_name }}
                </v-list-item-title>
                
                <v-list-item-subtitle>
                  <div class="d-flex align-center ga-2 mt-1">
                    <v-icon size="14">mdi-email</v-icon>
                    {{ application.user?.email }}
                  </div>
                  <div class="mt-1 text-grey-darken-1">
                    Candidature reçue le {{ formatDate(application.created_at) }}
                  </div>
                  <!-- Documents joints -->
                  <div v-if="application.resume_url || application.portfolio_url" class="d-flex align-center ga-2 mt-2">
                    <v-btn
                      v-if="application.resume_url"
                      size="x-small"
                      variant="tonal"
                      color="primary"
                      :href="application.resume_url"
                      target="_blank"
                    >
                      <v-icon start size="14">mdi-file-document</v-icon>
                      CV
                    </v-btn>
                    <v-btn
                      v-if="application.portfolio_url"
                      size="x-small"
                      variant="tonal"
                      color="secondary"
                      :href="application.portfolio_url"
                      target="_blank"
                    >
                      <v-icon start size="14">mdi-folder-open</v-icon>
                      Portfolio
                    </v-btn>
                  </div>
                  <!-- Lettre de motivation -->
                  <div v-if="application.cover_letter" class="mt-2">
                    <v-btn
                      size="x-small"
                      variant="text"
                      color="info"
                      @click="viewCoverLetter(application)"
                    >
                      <v-icon start size="14">mdi-text-box</v-icon>
                      Voir la lettre de motivation
                    </v-btn>
                  </div>
                </v-list-item-subtitle>

                <template #append>
                  <div class="d-flex align-center ga-2">
                    <v-chip
                      :color="getStatusColor(application.status)"
                      size="small"
                      class="mr-2"
                    >
                      {{ getStatusLabel(application.status) }}
                    </v-chip>

                    <v-btn
                      v-if="application.status === 'pending'"
                      icon="mdi-check"
                      color="success"
                      variant="tonal"
                      size="small"
                      @click="acceptApplication(application)"
                      :loading="processingId === application.id"
                    />
                    <v-btn
                      v-if="application.status === 'pending'"
                      icon="mdi-close"
                      color="error"
                      variant="tonal"
                      size="small"
                      @click="openRejectDialog(application)"
                      :loading="processingId === application.id"
                    />
                    <v-btn
                      icon="mdi-eye"
                      variant="tonal"
                      size="small"
                      @click="viewProfile(application.user)"
                    />
                    <v-btn
                      icon="mdi-message"
                      variant="tonal"
                      size="small"
                      @click="contactApplicant(application.user)"
                    />
                  </div>
                </template>
              </v-list-item>
              <v-divider v-if="index < filteredApplications.length - 1" />
            </template>
          </v-list>
        </v-card>
      </template>
    </v-container>

    <!-- Dialog de rejet -->
    <v-dialog v-model="rejectDialog" max-width="500">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon color="error" class="mr-2">mdi-close-circle</v-icon>
          Refuser la candidature
        </v-card-title>
        <v-card-text>
          <p class="mb-4">
            Vous êtes sur le point de refuser la candidature de 
            <strong>{{ selectedApplication?.user?.first_name }} {{ selectedApplication?.user?.last_name }}</strong>.
          </p>
          <v-textarea
            v-model="rejectReason"
            label="Motif du refus (optionnel)"
            placeholder="Expliquez brièvement pourquoi cette candidature n'a pas été retenue..."
            variant="outlined"
            rows="3"
          />
          <v-alert type="info" density="compact" class="mt-3">
            Un email sera envoyé au candidat pour l'informer de votre décision.
          </v-alert>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="rejectDialog = false">Annuler</v-btn>
          <v-btn color="error" @click="rejectApplication" :loading="processingId === selectedApplication?.id">
            Refuser
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog lettre de motivation -->
    <v-dialog v-model="coverLetterDialog" max-width="600">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon color="info" class="mr-2">mdi-text-box</v-icon>
          Lettre de motivation
        </v-card-title>
        <v-card-subtitle v-if="selectedApplication">
          {{ selectedApplication.user?.first_name }} {{ selectedApplication.user?.last_name }}
        </v-card-subtitle>
        <v-card-text>
          <div class="pa-3 bg-grey-lighten-4 rounded" style="white-space: pre-wrap;">
            {{ selectedApplication?.cover_letter || 'Aucune lettre de motivation fournie.' }}
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="coverLetterDialog = false">Fermer</v-btn>
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'
import { emailService } from '@/services/emailService'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const opportunityId = computed(() => route.params.id)

const loading = ref(true)
const accessDenied = ref(false)
const opportunity = ref(null)
const applications = ref([])
const processingId = ref(null)
const statusFilter = ref('all')
const searchQuery = ref('')
const rejectDialog = ref(false)
const selectedApplication = ref(null)
const rejectReason = ref('')
const coverLetterDialog = ref(false)
const showSnackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

const viewCoverLetter = (application) => {
  selectedApplication.value = application
  coverLetterDialog.value = true
}

const stats = computed(() => ({
  total: applications.value.length,
  pending: applications.value.filter(a => a.status === 'pending').length,
  accepted: applications.value.filter(a => a.status === 'accepted').length,
  rejected: applications.value.filter(a => a.status === 'rejected').length
}))

const filteredApplications = computed(() => {
  let filtered = [...applications.value]

  if (statusFilter.value !== 'all') {
    filtered = filtered.filter(a => a.status === statusFilter.value)
  }

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(a =>
      a.user?.first_name?.toLowerCase().includes(query) ||
      a.user?.last_name?.toLowerCase().includes(query) ||
      a.user?.email?.toLowerCase().includes(query)
    )
  }

  return filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const loadData = async () => {
  loading.value = true
  accessDenied.value = false

  try {
    // Charger l'opportunité
    const { data: opp, error: oppError } = await supabase
      .from('pev_opportunities')
      .select('*')
      .eq('id', opportunityId.value)
      .single()

    if (oppError) throw oppError

    // Vérifier que l'utilisateur est le créateur ou admin
    const isCreator = opp.created_by === authStore.user?.id
    const isAdmin = ['admin', 'super_admin', 'moderator'].includes(authStore.user?.profile?.role)

    if (!isCreator && !isAdmin) {
      accessDenied.value = true
      loading.value = false
      return
    }

    opportunity.value = opp

    // Charger les candidatures
    const { data: apps, error: appsError } = await supabase
      .from('pev_opportunity_applications')
      .select(`
        *,
        user:user_id(id, first_name, last_name, email, avatar_url)
      `)
      .eq('opportunity_id', opportunityId.value)
      .order('created_at', { ascending: false })

    if (appsError) throw appsError

    applications.value = apps || []
  } catch (error) {
    console.error('Erreur chargement:', error)
    showMessage('Erreur lors du chargement des données', 'error')
  } finally {
    loading.value = false
  }
}

const acceptApplication = async (application) => {
  processingId.value = application.id

  try {
    const { error } = await supabase
      .from('pev_opportunity_applications')
      .update({
        status: 'accepted',
        reviewed_by: authStore.user?.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', application.id)

    if (error) throw error

    // Mettre à jour localement
    const index = applications.value.findIndex(a => a.id === application.id)
    if (index !== -1) {
      applications.value[index].status = 'accepted'
    }

    // Envoyer email au candidat
    try {
      await emailService.sendTemplateEmail('application_accepted', application.user.email, {
        recipient_name: `${application.user.first_name} ${application.user.last_name}`,
        opportunity_title: opportunity.value.title,
        company_name: opportunity.value.company || 'PEVA',
        action_url: `${window.location.origin}/opportunities/${opportunityId.value}`
      })
    } catch (emailError) {
      console.warn('Erreur envoi email:', emailError)
    }

    showMessage('Candidature acceptée ! Le candidat a été notifié par email.', 'success')
  } catch (error) {
    console.error('Erreur acceptation:', error)
    showMessage('Erreur lors de l\'acceptation', 'error')
  } finally {
    processingId.value = null
  }
}

const openRejectDialog = (application) => {
  selectedApplication.value = application
  rejectReason.value = ''
  rejectDialog.value = true
}

const rejectApplication = async () => {
  if (!selectedApplication.value) return

  processingId.value = selectedApplication.value.id

  try {
    const { error } = await supabase
      .from('pev_opportunity_applications')
      .update({
        status: 'rejected',
        rejection_reason: rejectReason.value,
        reviewed_by: authStore.user?.id,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', selectedApplication.value.id)

    if (error) throw error

    // Mettre à jour localement
    const index = applications.value.findIndex(a => a.id === selectedApplication.value.id)
    if (index !== -1) {
      applications.value[index].status = 'rejected'
    }

    // Envoyer email au candidat
    try {
      await emailService.sendTemplateEmail('application_rejected', selectedApplication.value.user.email, {
        recipient_name: `${selectedApplication.value.user.first_name} ${selectedApplication.value.user.last_name}`,
        opportunity_title: opportunity.value.title,
        action_url: `${window.location.origin}/opportunities`
      })
    } catch (emailError) {
      console.warn('Erreur envoi email:', emailError)
    }

    rejectDialog.value = false
    showMessage('Candidature refusée. Le candidat a été notifié par email.', 'info')
  } catch (error) {
    console.error('Erreur refus:', error)
    showMessage('Erreur lors du refus', 'error')
  } finally {
    processingId.value = null
  }
}

const viewProfile = (user) => {
  if (user?.id) {
    router.push(`/profile/${user.id}`)
  }
}

const contactApplicant = (user) => {
  if (user?.id) {
    router.push(`/messages?to=${user.id}`)
  }
}

const getInitials = (user) => {
  if (!user) return '?'
  return `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase() || '?'
}

const getAvatarColor = (name) => {
  const colors = ['blue', 'green', 'purple', 'orange', 'teal', 'pink', 'indigo']
  const index = (name?.charCodeAt(0) || 0) % colors.length
  return colors[index]
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'orange',
    accepted: 'success',
    rejected: 'error',
    reviewed: 'info',
    withdrawn: 'grey'
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    accepted: 'Acceptée',
    rejected: 'Refusée',
    reviewed: 'Examinée',
    withdrawn: 'Retirée'
  }
  return labels[status] || status
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
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

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/auth/login')
    return
  }
  loadData()
})
</script>

<style scoped>
.hero-banner {
  background: linear-gradient(135deg, #e65100 0%, #ff9800 100%);
}
</style>
