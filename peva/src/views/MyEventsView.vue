<template>
  <v-container class="py-8">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Mes Événements</h1>
        <p class="text-grey-darken-1">Gérez vos brouillons et événements publiés</p>
      </div>
      <v-btn
        color="purple-darken-2"
        prepend-icon="mdi-plus"
        to="/events/create"
      >
        Nouvel événement
      </v-btn>
    </div>

    <!-- Tabs pour filtrer par statut -->
    <v-tabs v-model="activeTab" color="purple-darken-2" class="mb-6">
      <v-tab value="all">
        <v-icon start>mdi-view-list</v-icon>
        Tous ({{ events.length }})
      </v-tab>
      <v-tab value="draft">
        <v-icon start>mdi-file-edit</v-icon>
        Brouillons ({{ drafts.length }})
      </v-tab>
      <v-tab value="in_review">
        <v-icon start>mdi-clock-outline</v-icon>
        En attente ({{ inReview.length }})
      </v-tab>
      <v-tab value="published">
        <v-icon start>mdi-check-circle</v-icon>
        Publiés ({{ published.length }})
      </v-tab>
    </v-tabs>

    <!-- Loading -->
    <v-progress-linear v-if="loading" indeterminate color="purple-darken-2" class="mb-4" />

    <!-- Liste vide -->
    <v-card v-if="!loading && filteredEvents.length === 0" class="pa-8 text-center">
      <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-calendar-blank</v-icon>
      <h3 class="text-h6 mb-2">Aucun événement</h3>
      <p class="text-grey-darken-1 mb-4">
        {{ activeTab === 'draft' ? 'Vous n\'avez pas de brouillon en cours.' : 'Commencez par créer votre premier événement.' }}
      </p>
      <v-btn color="purple-darken-2" to="/events/create">
        Créer un événement
      </v-btn>
    </v-card>

    <!-- Liste des événements -->
    <v-row v-else>
      <v-col
        v-for="event in filteredEvents"
        :key="event.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="h-100" :class="{ 'border-warning': event.status === 'draft' }">
          <!-- Image de couverture si disponible -->
          <v-img 
            v-if="event.image_url" 
            :src="event.image_url" 
            height="120" 
            cover
          />
          <div v-else class="event-placeholder d-flex align-center justify-center" style="height: 120px; background: linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%);">
            <v-icon color="white" size="48">mdi-calendar</v-icon>
          </div>
          
          <!-- Status badge -->
          <div class="pa-3 pb-0">
            <v-chip
              :color="getStatusColor(event.status)"
              size="small"
              label
            >
              <v-icon start size="small">{{ getStatusIcon(event.status) }}</v-icon>
              {{ getStatusLabel(event.status) }}
            </v-chip>
            <v-chip
              v-if="event.is_free"
              color="success"
              size="small"
              label
              class="ml-2"
            >
              <v-icon start size="small">mdi-gift</v-icon>
              Gratuit
            </v-chip>
            <v-chip
              v-else
              color="orange"
              size="small"
              label
              class="ml-2"
            >
              {{ event.price || 0 }} FCFA
            </v-chip>
          </div>

          <v-card-title class="text-h6">
            {{ event.title || 'Sans titre' }}
          </v-card-title>

          <v-card-subtitle>
            <v-icon size="small" class="mr-1">mdi-calendar</v-icon>
            {{ formatDate(event.start_date) }}
            <span class="ml-3">
              <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
              {{ event.location || 'Non défini' }}
            </span>
          </v-card-subtitle>

          <v-card-text class="text-body-2">
            {{ truncateText(event.description, 100) }}
          </v-card-text>

          <!-- Stats -->
          <v-card-text class="pt-0">
            <div class="d-flex ga-4 text-grey-darken-1">
              <span><v-icon size="small">mdi-eye</v-icon> {{ event.views_count || 0 }}</span>
              <span><v-icon size="small">mdi-account-group</v-icon> {{ event.participants_count || 0 }}</span>
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <v-btn
              v-if="event.status === 'draft'"
              color="purple-darken-2"
              variant="text"
              size="small"
              :to="`/events/edit/${event.id}`"
            >
              <v-icon start>mdi-pencil</v-icon>
              Continuer
            </v-btn>
            <v-btn
              v-else
              color="purple-darken-2"
              variant="text"
              size="small"
              :to="`/events/${event.id}`"
            >
              <v-icon start>mdi-eye</v-icon>
              Voir
            </v-btn>
            <v-spacer />
            <v-btn
              color="error"
              variant="text"
              size="small"
              @click="confirmDelete(event)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog de confirmation de suppression -->
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon color="error" class="mr-2">mdi-alert</v-icon>
          Confirmer la suppression
        </v-card-title>
        <v-card-text>
          <p class="mb-3">
            Êtes-vous sûr de vouloir supprimer <strong>"{{ eventToDelete?.title }}"</strong> ?
          </p>
          <v-alert 
            v-if="eventToDelete?.status === 'published'" 
            type="warning" 
            density="compact" 
            class="mb-3"
          >
            Cet événement est publié. Les participants inscrits seront notifiés par email.
          </v-alert>
          <v-textarea
            v-model="deleteReason"
            label="Raison de la suppression (optionnel)"
            variant="outlined"
            rows="2"
            density="compact"
            placeholder="Ex: Événement reporté, Annulation..."
          />
          <p class="text-caption text-grey">Cette action est irréversible.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="error" variant="flat" :loading="deleting" @click="deleteEvent">
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { eventsService } from '@/services/eventsService'

const authStore = useAuthStore()

const loading = ref(true)
const activeTab = ref('all')
const events = ref([])
const deleteDialog = ref(false)
const eventToDelete = ref(null)
const deleting = ref(false)
const deleteReason = ref('')
const snackbar = ref({ show: false, message: '', color: 'success' })

// Filtres
const drafts = computed(() => events.value.filter(e => e.status === 'draft'))
const inReview = computed(() => events.value.filter(e => e.status === 'in_review'))
const published = computed(() => events.value.filter(e => e.status === 'published'))

const filteredEvents = computed(() => {
  switch (activeTab.value) {
    case 'draft': return drafts.value
    case 'in_review': return inReview.value
    case 'published': return published.value
    default: return events.value
  }
})

// Charger les événements de l'utilisateur
const loadMyEvents = async () => {
  loading.value = true
  try {
    const result = await eventsService.getUserEvents(authStore.user?.id)
    if (result.success) {
      events.value = result.data || []
    }
  } catch (error) {
    console.error('Erreur chargement événements:', error)
  } finally {
    loading.value = false
  }
}

// Helpers
const getStatusColor = (status) => {
  const colors = { draft: 'warning', in_review: 'info', published: 'success', rejected: 'error' }
  return colors[status] || 'grey'
}

const getStatusIcon = (status) => {
  const icons = { draft: 'mdi-file-edit', in_review: 'mdi-clock-outline', published: 'mdi-check-circle', rejected: 'mdi-close-circle' }
  return icons[status] || 'mdi-help-circle'
}

const getStatusLabel = (status) => {
  const labels = { draft: 'Brouillon', in_review: 'En attente', published: 'Publié', rejected: 'Rejeté' }
  return labels[status] || status
}

const formatDate = (dateString) => {
  if (!dateString) return 'Date non définie'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const truncateText = (text, length) => {
  if (!text) return ''
  return text.length > length ? text.substring(0, length) + '...' : text
}

// Suppression
const confirmDelete = (event) => {
  eventToDelete.value = event
  deleteDialog.value = true
}

const deleteEvent = async () => {
  if (!eventToDelete.value) return
  deleting.value = true
  try {
    const result = await eventsService.deleteEvent(
      eventToDelete.value.id,
      authStore.user?.id,
      deleteReason.value || 'Événement annulé par l\'organisateur'
    )
    if (result.success) {
      events.value = events.value.filter(e => e.id !== eventToDelete.value.id)
      const msg = result.notifiedCount > 0 
        ? `Événement supprimé. ${result.notifiedCount} participant(s) notifié(s).`
        : 'Événement supprimé'
      snackbar.value = { show: true, message: msg, color: 'success' }
    } else {
      snackbar.value = { show: true, message: result.error || 'Erreur suppression', color: 'error' }
    }
  } catch (error) {
    snackbar.value = { show: true, message: error.message, color: 'error' }
  } finally {
    deleting.value = false
    deleteDialog.value = false
    eventToDelete.value = null
    deleteReason.value = ''
  }
}

onMounted(loadMyEvents)
</script>

<style scoped>
.border-warning {
  border: 2px solid #fb8c00 !important;
}
</style>
