<template>
  <div class="event-detail-view">
    <div v-if="loading" class="d-flex justify-center align-center" style="min-height: 400px;">
      <v-progress-circular indeterminate color="purple" size="64" />
    </div>

    <v-container v-else-if="error" class="py-8">
      <v-alert type="error" variant="tonal">{{ error }}</v-alert>
      <v-btn class="mt-4" @click="$router.push('/events')">Retour aux événements</v-btn>
    </v-container>

    <template v-else-if="event">
      <div class="hero-banner text-white py-12" :style="bannerStyle">
        <v-container>
          <v-btn variant="text" color="white" class="mb-4" prepend-icon="mdi-arrow-left" @click="$router.push('/events')">
            Retour aux événements
          </v-btn>
          <v-chip v-if="event.pev_event_categories" :color="event.pev_event_categories.color" class="mb-4">
            <v-icon start size="16">{{ event.pev_event_categories.icon }}</v-icon>
            {{ event.pev_event_categories.name }}
          </v-chip>
          <h1 class="text-h3 font-weight-bold mb-4">{{ event.title }}</h1>
          <div class="d-flex flex-wrap ga-4 mb-4">
            <div class="d-flex align-center"><v-icon class="mr-2">mdi-calendar</v-icon>{{ formatDate(event.start_date) }}</div>
            <div class="d-flex align-center"><v-icon class="mr-2">mdi-clock</v-icon>{{ formatTime(event.start_date) }}</div>
            <div class="d-flex align-center"><v-icon class="mr-2">mdi-map-marker</v-icon>{{ event.location || event.city || 'En ligne' }}</div>
          </div>
          <div class="d-flex align-center ga-4">
            <v-chip color="white" variant="flat" class="text-purple-darken-2"><v-icon start>mdi-eye</v-icon>{{ event.views_count || 0 }} vues</v-chip>
            <v-chip color="white" variant="flat" class="text-purple-darken-2"><v-icon start>mdi-account-group</v-icon>{{ event.participants_count || 0 }} participants</v-chip>
            <v-chip v-if="event.is_free" color="success" variant="flat">Gratuit</v-chip>
            <v-chip v-else color="orange" variant="flat">{{ event.price || 0 }} FCFA</v-chip>
          </div>
        </v-container>
      </div>

      <v-container class="py-8">
        <v-row>
          <v-col cols="12" md="8">
            <v-card class="mb-6" elevation="2">
              <v-card-title class="pa-4"><v-icon class="mr-2">mdi-text</v-icon>Description</v-card-title>
              <v-card-text class="pa-4">
                <div class="text-body-1" style="white-space: pre-wrap;">{{ event.description }}</div>
              </v-card-text>
            </v-card>

            <v-card class="mb-6" elevation="2">
              <v-card-title class="pa-4"><v-icon class="mr-2">mdi-information</v-icon>Informations pratiques</v-card-title>
              <v-card-text class="pa-4">
                <v-list>
                  <v-list-item v-if="event.start_date">
                    <template v-slot:prepend><v-icon color="purple">mdi-calendar-start</v-icon></template>
                    <v-list-item-title>Date de début</v-list-item-title>
                    <v-list-item-subtitle>{{ formatFullDate(event.start_date) }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item v-if="event.end_date">
                    <template v-slot:prepend><v-icon color="purple">mdi-calendar-end</v-icon></template>
                    <v-list-item-title>Date de fin</v-list-item-title>
                    <v-list-item-subtitle>{{ formatFullDate(event.end_date) }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item>
                    <template v-slot:prepend><v-icon color="blue">mdi-map-marker</v-icon></template>
                    <v-list-item-title>Lieu</v-list-item-title>
                    <v-list-item-subtitle>{{ getLocationTypeLabel(event.location_type) }} {{ event.location ? '- ' + event.location : '' }}</v-list-item-subtitle>
                  </v-list-item>
                  <v-list-item v-if="event.max_participants">
                    <template v-slot:prepend><v-icon color="teal">mdi-account-multiple</v-icon></template>
                    <v-list-item-title>Places disponibles</v-list-item-title>
                    <v-list-item-subtitle>{{ event.max_participants - (event.participants_count || 0) }} / {{ event.max_participants }}</v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <!-- Document joint -->
            <v-card v-if="event.document_url" class="mb-6" elevation="2">
              <v-card-title class="pa-4"><v-icon class="mr-2">mdi-file-document</v-icon>Document joint</v-card-title>
              <v-card-text class="pa-4">
                <v-btn
                  color="purple-darken-1"
                  variant="outlined"
                  :href="event.document_url"
                  target="_blank"
                  prepend-icon="mdi-download"
                >
                  Télécharger le document
                </v-btn>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="4">
            <v-card class="mb-4" elevation="2">
              <v-card-title class="pa-4 bg-purple-lighten-5"><v-icon class="mr-2" color="purple">mdi-ticket</v-icon>Inscription</v-card-title>
              <v-card-text class="pa-4">
                <div class="text-center mb-4">
                  <div class="text-h4 font-weight-bold" :class="event.is_free ? 'text-success' : 'text-orange'">
                    {{ event.is_free ? 'Gratuit' : `${event.price || 0} FCFA` }}
                  </div>
                </div>
                <v-alert v-if="isOwnEvent" type="info" variant="tonal" density="compact" class="mb-3">
                  <v-icon start>mdi-account-star</v-icon>
                  Vous êtes l'organisateur de cet événement
                </v-alert>
                <v-btn v-if="!isRegistered && !isOwnEvent" color="purple-darken-1" variant="flat" size="large" block :loading="registering" :disabled="isEventFull" @click="handleRegister">
                  <v-icon start>mdi-check</v-icon>S'inscrire
                </v-btn>
                <v-btn v-else-if="isRegistered && !isOwnEvent" color="red" variant="outlined" size="large" block :loading="registering" @click="handleCancelRegistration">
                  <v-icon start>mdi-close</v-icon>Annuler inscription
                </v-btn>
                <v-alert v-if="isEventFull && !isOwnEvent" type="warning" variant="tonal" class="mt-4" density="compact">Événement complet</v-alert>
                <v-alert v-if="isRegistered && !isOwnEvent" type="success" variant="tonal" class="mt-4" density="compact">Vous êtes inscrit</v-alert>
              </v-card-text>
            </v-card>

            <v-card class="mb-4" elevation="2">
              <v-card-title class="pa-4"><v-icon class="mr-2">mdi-account</v-icon>Organisateur</v-card-title>
              <v-card-text class="pa-4">
                <div v-if="event.organizer_name" class="font-weight-bold mb-2">{{ event.organizer_name }}</div>
                <div v-if="event.contact_email" class="d-flex align-center mb-2">
                  <v-icon size="16" class="mr-2">mdi-email</v-icon>
                  <a :href="`mailto:${event.contact_email}`">{{ event.contact_email }}</a>
                </div>
                <div v-if="event.contact_phone" class="d-flex align-center">
                  <v-icon size="16" class="mr-2">mdi-phone</v-icon>{{ event.contact_phone }}
                </div>
              </v-card-text>
            </v-card>

            <v-card elevation="2">
              <v-card-title class="pa-4"><v-icon class="mr-2">mdi-share-variant</v-icon>Partager</v-card-title>
              <v-card-text class="pa-4">
                <div class="d-flex ga-2">
                  <v-btn icon variant="tonal" color="blue" @click="share('facebook')"><v-icon>mdi-facebook</v-icon></v-btn>
                  <v-btn icon variant="tonal" color="light-blue" @click="share('twitter')"><v-icon>mdi-twitter</v-icon></v-btn>
                  <v-btn icon variant="tonal" color="green" @click="share('whatsapp')"><v-icon>mdi-whatsapp</v-icon></v-btn>
                  <v-btn icon variant="tonal" @click="copyLink"><v-icon>mdi-link</v-icon></v-btn>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">{{ snackbar.message }}</v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { eventsService } from '@/services/eventsService'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref(null)
const event = ref(null)
const isRegistered = ref(false)
const registering = ref(false)
const snackbar = ref({ show: false, message: '', color: 'success' })

const bannerStyle = computed(() => {
  if (event.value?.image_url) {
    return { backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${event.value.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center' }
  }
  return { background: 'linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%)' }
})

const isEventFull = computed(() => {
  if (!event.value?.max_participants) return false
  return (event.value.participants_count || 0) >= event.value.max_participants
})

const isOwnEvent = computed(() => {
  return event.value?.created_by === authStore.user?.id
})

const loadEvent = async () => {
  loading.value = true
  error.value = null
  try {
    const result = await eventsService.getEventById(route.params.id)
    if (result.success) {
      event.value = result.data
      if (authStore.user?.id) {
        const regResult = await eventsService.isUserRegistered(route.params.id, authStore.user.id)
        isRegistered.value = regResult.registered
      }
    } else {
      error.value = result.error || 'Événement non trouvé'
    }
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const handleRegister = async () => {
  if (!authStore.isAuthenticated) {
    router.push('/auth/login')
    return
  }
  registering.value = true
  const result = await eventsService.registerForEvent(route.params.id, authStore.user.id)
  registering.value = false
  if (result.success) {
    if (result.requiresApproval) {
      // Demande en attente d'approbation
      showSnackbar('Votre demande a été soumise et est en attente d\'approbation', 'info')
    } else {
      // Inscription directe
      isRegistered.value = true
      event.value.participants_count = (event.value.participants_count || 0) + 1
      showSnackbar('Inscription confirmée !', 'success')
    }
  } else {
    showSnackbar(result.error || 'Erreur lors de l\'inscription', 'error')
  }
}

const handleCancelRegistration = async () => {
  registering.value = true
  const result = await eventsService.cancelRegistration(route.params.id, authStore.user.id)
  registering.value = false
  if (result.success) {
    isRegistered.value = false
    event.value.participants_count = Math.max(0, (event.value.participants_count || 1) - 1)
    showSnackbar('Inscription annulée', 'info')
  } else {
    showSnackbar(result.error || 'Erreur', 'error')
  }
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
}

const formatTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const formatFullDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

const getLocationTypeLabel = (type) => {
  const labels = { physical: 'Présentiel', online: 'En ligne', hybrid: 'Hybride' }
  return labels[type] || type
}

const share = (platform) => {
  const url = encodeURIComponent(window.location.href)
  const text = encodeURIComponent(event.value?.title || '')
  const urls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?url=${url}&text=${text}`,
    whatsapp: `https://wa.me/?text=${text}%20${url}`
  }
  if (urls[platform]) window.open(urls[platform], '_blank')
}

const copyLink = async () => {
  await navigator.clipboard.writeText(window.location.href)
  showSnackbar('Lien copié !', 'success')
}

const showSnackbar = (message, color) => {
  snackbar.value = { show: true, message, color }
}

onMounted(loadEvent)
</script>

<style scoped>
.event-detail-view { min-height: 100vh; background-color: #f8f9fa; }
.hero-banner { background-size: cover; background-position: center; }
.v-card { border-radius: 12px !important; }
</style>
