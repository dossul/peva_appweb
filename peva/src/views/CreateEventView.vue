<template>
  <div class="create-event-view">
    <!-- Header avec bannière -->
    <div class="hero-banner bg-purple-darken-2 text-white py-8">
      <v-container>
        <div class="d-flex align-center">
          <v-icon size="48" class="mr-4">mdi-calendar-plus</v-icon>
          <div>
            <h1 class="text-h3 font-weight-bold mb-2">Créer un Événement</h1>
            <p class="text-h6 font-weight-regular ma-0">Organisez des conférences, formations, webinaires et événements de networking</p>
          </div>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <v-form ref="eventForm" v-model="formValid">
        <v-row>
          <!-- Formulaire principal -->
          <v-col cols="12" md="8">
            <!-- Informations de base -->
            <v-card class="mb-6" elevation="2">
              <v-card-title class="pa-4 bg-green-lighten-5">
                <v-icon class="mr-2" color="green-darken-2">mdi-information</v-icon>
                Informations de Base
              </v-card-title>
              <v-card-text class="pa-6">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="eventData.title"
                      label="Titre de l'événement *"
                      variant="outlined"
                      :rules="[rules.required]"
                      placeholder="Ex: Sommet de l'Innovation Verte Africaine 2025"
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-textarea
                      v-model="eventData.description"
                      label="Description *"
                      variant="outlined"
                      :rules="[rules.required]"
                      rows="4"
                      placeholder="Décrivez votre événement, son contenu et sa valeur ajoutée..."
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-file-input
                      v-model="eventData.image"
                      label="Visuel de l'événement (optionnel)"
                      variant="outlined"
                      accept="image/*"
                      prepend-icon="mdi-image"
                      show-size
                    />
                  </v-col>

                  <v-col cols="12" md="6">
                    <v-file-input
                      v-model="eventData.document"
                      label="Document joint (optionnel)"
                      variant="outlined"
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      prepend-icon="mdi-file-document"
                      show-size
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="eventData.type"
                      :items="eventTypes"
                      label="Type d'événement *"
                      variant="outlined"
                      :rules="[rules.required]"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="eventData.category"
                      :items="categories"
                      item-title="name"
                      item-value="id"
                      label="Catégorie *"
                      variant="outlined"
                      :rules="[rules.required]"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Date et Heure -->
            <v-card class="mb-6" elevation="2">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-calendar-clock</v-icon>
                Date & Heure
              </v-card-title>
              <v-card-text class="pa-6">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="eventData.start_date"
                      label="Date de début *"
                      type="date"
                      variant="outlined"
                      :rules="[rules.required]"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="eventData.start_time"
                      label="Heure de début *"
                      type="time"
                      variant="outlined"
                      :rules="[rules.required]"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="eventData.end_date"
                      label="Date de fin"
                      type="date"
                      variant="outlined"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="eventData.end_time"
                      label="Heure de fin"
                      type="time"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Lieu -->
            <v-card class="mb-6" elevation="2">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-map-marker</v-icon>
                Lieu
              </v-card-title>
              <v-card-text class="pa-6">
                <v-row>
                  <v-col cols="12">
                    <v-radio-group v-model="eventData.location_type" inline>
                      <v-radio label="Présentiel" value="physical" />
                      <v-radio label="En ligne" value="online" />
                      <v-radio label="Hybride" value="hybrid" />
                    </v-radio-group>
                  </v-col>
                  
                  <v-col cols="12" v-if="eventData.location_type !== 'online'">
                    <v-text-field
                      v-model="eventData.venue"
                      label="Lieu de l'événement"
                      variant="outlined"
                      placeholder="Ex: Centre de Conférences d'Abidjan"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6" v-if="eventData.location_type !== 'online'">
                    <v-text-field
                      v-model="eventData.address"
                      label="Adresse complète"
                      variant="outlined"
                      placeholder="Rue, ville, pays"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6" v-if="eventData.location_type !== 'physical'">
                    <v-text-field
                      v-model="eventData.online_link"
                      label="Lien de connexion"
                      variant="outlined"
                      placeholder="https://zoom.us/j/..."
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Tarification -->
            <v-card class="mb-6" elevation="2">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-currency-eur</v-icon>
                Tarification
              </v-card-title>
              <v-card-text class="pa-6">
                <v-row>
                  <v-col cols="12">
                    <v-radio-group v-model="eventData.is_free" inline>
                      <v-radio label="Gratuit" :value="true" />
                      <v-radio label="Payant" :value="false" />
                    </v-radio-group>
                  </v-col>
                  
                  <v-col cols="12" md="6" v-if="!eventData.is_free">
                    <v-text-field
                      v-model="eventData.price"
                      label="Prix (FCFA)"
                      type="number"
                      variant="outlined"
                      placeholder="0"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="eventData.max_participants"
                      label="Nombre maximum de participants"
                      type="number"
                      variant="outlined"
                      placeholder="100"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Contact -->
            <v-card class="mb-6" elevation="2">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-account-circle</v-icon>
                Contact
              </v-card-title>
              <v-card-text class="pa-6">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="eventData.contact_email"
                      label="Email de contact *"
                      type="email"
                      variant="outlined"
                      :rules="[rules.required, rules.email]"
                      placeholder="contact@example.com"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="eventData.contact_phone"
                      label="Téléphone (optionnel)"
                      variant="outlined"
                      placeholder="+225 XX XX XX XX"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Options de publication -->
            <v-card class="mb-6" elevation="2">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-cog</v-icon>
                Options de Publication
              </v-card-title>
              <v-card-text class="pa-6">
                <v-row>
                  <v-col cols="12">
                    <v-checkbox
                      v-model="eventData.require_approval"
                      label="Nécessite une approbation pour participer"
                      hide-details
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-checkbox
                      v-model="eventData.send_notifications"
                      label="Envoyer des notifications par email"
                      hide-details
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-checkbox
                      v-model="eventData.auto_share_social"
                      label="Partager automatiquement sur les réseaux sociaux"
                      hide-details
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Actions -->
            <div class="d-flex justify-space-between">
              <v-btn
                variant="outlined"
                prepend-icon="mdi-content-save"
                @click="saveDraft"
              >
                Enregistrer en brouillon
              </v-btn>
              
              <div class="d-flex ga-2">
                <v-btn
                  variant="outlined"
                  prepend-icon="mdi-arrow-left"
                  @click="goBack"
                >
                  Annuler
                </v-btn>
                
                <v-btn
                  color="green-darken-2"
                  variant="flat"
                  prepend-icon="mdi-calendar-plus"
                  :disabled="!formValid"
                  @click="publishEvent"
                >
                  Publier l'événement
                </v-btn>
              </div>
            </div>
          </v-col>

          <!-- Sidebar droite -->
          <v-col cols="12" md="4">
            <!-- Aperçu -->
            <v-card class="mb-4" elevation="2">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-eye</v-icon>
                Aperçu
              </v-card-title>
              <v-card-text class="pa-4">
                <div class="event-preview">
                  <div class="preview-image bg-grey-lighten-3 rounded mb-3 d-flex align-center justify-center" style="height: 120px;">
                    <v-icon size="48" color="grey">mdi-image</v-icon>
                  </div>
                  
                  <h3 class="text-h6 font-weight-bold mb-2">
                    {{ eventData.title || 'Titre de l\'événement' }}
                  </h3>
                  
                  <div class="d-flex align-center mb-2">
                    <v-icon size="16" class="mr-2">mdi-calendar</v-icon>
                    <span class="text-body-2">
                      {{ formatDate(eventData.start_date) || 'Date à définir' }}
                    </span>
                  </div>
                  
                  <div class="d-flex align-center mb-2">
                    <v-icon size="16" class="mr-2">mdi-clock</v-icon>
                    <span class="text-body-2">
                      {{ eventData.start_time || 'Heure à définir' }}
                    </span>
                  </div>
                  
                  <div class="d-flex align-center mb-2">
                    <v-icon size="16" class="mr-2">mdi-map-marker</v-icon>
                    <span class="text-body-2">
                      {{ getLocationText() }}
                    </span>
                  </div>
                  
                  <div class="d-flex align-center mb-3">
                    <v-icon size="16" class="mr-2">mdi-currency-eur</v-icon>
                    <span class="text-body-2">
                      {{ eventData.is_free ? 'Gratuit' : `${eventData.price || 0}€` }}
                    </span>
                  </div>
                  
                  <v-chip
                    :color="getTypeColor(eventData.type)"
                    size="small"
                    class="mb-2"
                  >
                    {{ eventData.type || 'Type' }}
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>

            <!-- Conseils -->
            <v-card class="mb-4" elevation="2">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-lightbulb</v-icon>
                Conseils
              </v-card-title>
              <v-card-text class="pa-4">
                <div class="d-flex flex-column ga-3">
                  <div class="d-flex align-start">
                    <v-icon color="green" size="16" class="mr-2 mt-1">mdi-check</v-icon>
                    <span class="text-body-2">Utilisez un titre accrocheur et descriptif</span>
                  </div>
                  <div class="d-flex align-start">
                    <v-icon color="green" size="16" class="mr-2 mt-1">mdi-check</v-icon>
                    <span class="text-body-2">Précisez clairement la valeur ajoutée</span>
                  </div>
                  <div class="d-flex align-start">
                    <v-icon color="green" size="16" class="mr-2 mt-1">mdi-check</v-icon>
                    <span class="text-body-2">Ajoutez des informations de contact fiables</span>
                  </div>
                  <div class="d-flex align-start">
                    <v-icon color="green" size="16" class="mr-2 mt-1">mdi-check</v-icon>
                    <span class="text-body-2">Définissez un nombre de participants réaliste</span>
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- Statistiques -->
            <v-card elevation="2">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-chart-line</v-icon>
                Vos événements
              </v-card-title>
              <v-card-text class="pa-4">
                <v-row>
                  <v-col cols="6" class="text-center">
                    <div class="text-h4 font-weight-bold text-blue-darken-2">{{ userStats.eventsCount }}</div>
                    <div class="text-body-2">Événements créés</div>
                  </v-col>
                  <v-col cols="6" class="text-center">
                    <div class="text-h4 font-weight-bold text-green-darken-2">{{ userStats.participantsTotal }}</div>
                    <div class="text-body-2">Participants totaux</div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { eventsService } from '@/services/eventsService'
import dataService from '@/services/dataService'

const router = useRouter()
const authStore = useAuthStore()
const isSubmitting = ref(false)

// Reactive data
const formValid = ref(false)
const eventForm = ref(null)

const eventData = ref({
  title: '',
  description: '',
  type: '',
  category: '',
  start_date: '',
  start_time: '',
  end_date: '',
  end_time: '',
  location_type: 'physical',
  venue: '',
  address: '',
  online_link: '',
  is_free: true,
  price: 0,
  max_participants: 100,
  contact_email: '',
  contact_phone: '',
  require_approval: false,
  send_notifications: true,
  auto_share_social: false,
  image: null,
  document: null
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Stats utilisateur depuis BDD
const userStats = ref({
  eventsCount: 0,
  participantsTotal: 0
})

// Data chargée depuis BDD
const eventTypes = [
  'Conférence',
  'Formation',
  'Webinaire',
  'Atelier',
  'Networking',
  'Salon/Exposition',
  'Séminaire',
  'Table ronde'
]

const categories = ref([])

// Validation rules
const rules = {
  required: value => !!value || 'Ce champ est requis',
  email: value => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Email invalide'
  }
}

// Methods
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const getLocationText = () => {
  if (eventData.value.location_type === 'online') {
    return 'En ligne'
  } else if (eventData.value.location_type === 'hybrid') {
    return 'Hybride (présentiel + en ligne)'
  } else {
    return eventData.value.venue || 'Lieu à définir'
  }
}

const getTypeColor = (type) => {
  const colors = {
    'Conférence': 'blue',
    'Formation': 'green',
    'Webinaire': 'purple',
    'Atelier': 'orange',
    'Networking': 'pink',
    'Salon/Exposition': 'teal',
    'Séminaire': 'indigo',
    'Table ronde': 'brown'
  }
  return colors[type] || 'grey'
}

const saveDraft = async () => {
  isSubmitting.value = true
  try {
    const payload = {
      title: eventData.value.title,
      description: eventData.value.description,
      event_type: eventData.value.type,
      category_id: eventData.value.category,
      start_date: eventData.value.start_date ? `${eventData.value.start_date}T${eventData.value.start_time || '00:00'}:00` : null,
      end_date: eventData.value.end_date ? `${eventData.value.end_date}T${eventData.value.end_time || '23:59'}:00` : null,
      location_type: eventData.value.location_type,
      location: eventData.value.venue || eventData.value.address || (eventData.value.location_type === 'online' ? 'En ligne' : ''),
      address: eventData.value.address,
      online_link: eventData.value.online_link,
      is_free: eventData.value.is_free,
      price: eventData.value.is_free ? 0 : eventData.value.price,
      max_participants: eventData.value.max_participants,
      contact_email: eventData.value.contact_email,
      contact_phone: eventData.value.contact_phone,
      created_by: authStore.user?.id
    }
    const result = await eventsService.saveDraft(payload)
    if (result.success) {
      showMessage('Brouillon sauvegardé !', 'success')
    } else {
      showMessage(result.error || 'Erreur sauvegarde', 'error')
    }
  } catch (error) {
    showMessage('Erreur: ' + error.message, 'error')
  } finally {
    isSubmitting.value = false
  }
}

const publishEvent = async () => {
  if (!formValid.value) {
    showMessage('Veuillez remplir tous les champs obligatoires', 'error')
    return
  }
  
  isSubmitting.value = true
  
  try {
    const payload = {
      title: eventData.value.title,
      description: eventData.value.description,
      event_type: eventData.value.type,
      category_id: eventData.value.category,
      start_date: eventData.value.start_date ? `${eventData.value.start_date}T${eventData.value.start_time || '00:00'}:00` : null,
      end_date: eventData.value.end_date ? `${eventData.value.end_date}T${eventData.value.end_time || '23:59'}:00` : null,
      location_type: eventData.value.location_type,
      location: eventData.value.venue || eventData.value.address || (eventData.value.location_type === 'online' ? 'En ligne' : ''),
      address: eventData.value.address,
      online_link: eventData.value.online_link,
      is_free: eventData.value.is_free,
      price: eventData.value.is_free ? 0 : eventData.value.price,
      max_participants: eventData.value.max_participants,
      contact_email: eventData.value.contact_email,
      contact_phone: eventData.value.contact_phone,
      created_by: authStore.user?.id
    }
    
    // Récupérer les fichiers si présents
    const imageFile = eventData.value.image?.[0] || eventData.value.image || null
    const documentFile = eventData.value.document?.[0] || eventData.value.document || null
    
    const result = await eventsService.createEvent(payload, imageFile, documentFile)
    
    if (!result.success) throw new Error(result.error)
    
    showMessage('Événement soumis ! Il sera visible après validation.', 'success')
    setTimeout(() => router.push('/events'), 3000)
  } catch (error) {
    console.error('Erreur création événement:', error)
    showMessage('Erreur: ' + error.message, 'error')
  } finally {
    isSubmitting.value = false
  }
}

const goBack = () => {
  router.go(-1)
}

const showMessage = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  }
}

// Charger les secteurs (catégories thématiques) depuis pev_sectors
const loadCategories = async () => {
  try {
    const sectors = await dataService.getSectors()
    categories.value = sectors.map(s => ({ id: s.id, name: s.name }))
  } catch (error) {
    console.log('Secteurs non disponibles')
  }
}

// Charger les stats utilisateur depuis BDD
const loadUserStats = async () => {
  if (!authStore.user?.id) return
  
  const result = await eventsService.getUserEvents(authStore.user.id)
  if (result.success && result.data) {
    userStats.value.eventsCount = result.data.length
    userStats.value.participantsTotal = result.data.reduce((sum, e) => sum + (e.participants_count || 0), 0)
  }
}

onMounted(() => {
  loadCategories()
  loadUserStats()
  if (authStore.user?.email) {
    eventData.value.contact_email = authStore.user.email
  }
})
</script>

<style scoped>
.create-event-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.hero-banner {
  background: linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%);
}

.event-preview {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.preview-image {
  border: 2px dashed #ccc;
}

.v-card {
  border-radius: 12px !important;
}

.v-btn {
  border-radius: 8px !important;
}
</style>
