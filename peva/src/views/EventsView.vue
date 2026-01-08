<template>
  <div class="events-view" data-testid="events-page">
    <!-- Header avec bannière -->
    <div class="hero-banner bg-purple-darken-1 text-white py-8">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon size="48" class="mr-4">mdi-calendar-multiple</v-icon>
            <div>
              <h1 class="text-h3 font-weight-bold mb-2">Événements 2iE GreenHub</h1>
              <p class="text-h6 font-weight-regular ma-0">Découvrez les événements de l'économie verte : valorisation des déchets, bilan carbone, économie circulaire</p>
            </div>
          </div>
          <v-btn
            color="white"
            variant="flat"
            size="large"
            prepend-icon="mdi-plus"
            class="text-purple-darken-1"
            @click="createEventDialog = true"
          >
            Créer un Événement
          </v-btn>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <!-- Statistiques -->
      <v-row class="mb-8">
        <v-col cols="12" md="3">
          <v-card class="text-center pa-4" color="blue-lighten-5">
            <v-icon size="32" color="blue-darken-2" class="mb-2">mdi-calendar-check</v-icon>
            <div class="text-h4 font-weight-bold text-blue-darken-2">{{ stats.upcoming }}</div>
            <div class="text-body-2">Événements à venir</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="text-center pa-4" color="green-lighten-5">
            <v-icon size="32" color="green-darken-2" class="mb-2">mdi-account-group</v-icon>
            <div class="text-h4 font-weight-bold text-green-darken-2">{{ stats.participants }}</div>
            <div class="text-body-2">Participants inscrits</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="text-center pa-4" color="purple-lighten-5">
            <v-icon size="32" color="purple-darken-2" class="mb-2">mdi-video</v-icon>
            <div class="text-h4 font-weight-bold text-purple-darken-2">{{ stats.virtual }}</div>
            <div class="text-body-2">Événements virtuels</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="text-center pa-4" color="orange-lighten-5">
            <v-icon size="32" color="orange-darken-2" class="mb-2">mdi-map-marker</v-icon>
            <div class="text-h4 font-weight-bold text-orange-darken-2">{{ stats.cities }}</div>
            <div class="text-body-2">Villes actives</div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Navigation par onglets -->
      <v-card class="mb-6" elevation="2">
        <v-tabs v-model="activeTab" color="purple-darken-1" align-tabs="start">
          <v-tab value="calendar">
            <v-icon class="mr-2">mdi-calendar</v-icon>
            Calendrier
          </v-tab>
          <v-tab value="list">
            <v-icon class="mr-2">mdi-format-list-bulleted</v-icon>
            Liste
          </v-tab>
          <v-tab value="map">
            <v-icon class="mr-2">mdi-map</v-icon>
            Carte
          </v-tab>
          <v-tab value="my-events">
            <v-icon class="mr-2">mdi-bookmark</v-icon>
            Mes Événements
          </v-tab>
          <v-tab value="history">
            <v-icon class="mr-2">mdi-history</v-icon>
            Historique
          </v-tab>
        </v-tabs>
      </v-card>

      <!-- Contenu des onglets -->
      <v-window v-model="activeTab">
        <!-- Vue Calendrier -->
        <v-window-item value="calendar">
          <v-row>
            <v-col cols="12" md="8">
              <v-card elevation="2">
                <v-card-title class="pa-4 d-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <v-btn icon variant="text" @click="previousMonth">
                      <v-icon>mdi-chevron-left</v-icon>
                    </v-btn>
                    <h3 class="text-h5 mx-4">{{ currentMonthYear }}</h3>
                    <v-btn icon variant="text" @click="nextMonth">
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                  </div>
                  <div class="d-flex align-center ga-2">
                    <v-btn size="small" color="purple-darken-1" variant="flat">Mois</v-btn>
                    <v-btn size="small" variant="outlined">Semaine</v-btn>
                    <v-btn size="small" variant="outlined">Jour</v-btn>
                  </div>
                </v-card-title>
                <v-card-text class="pa-0">
                  <!-- Calendrier simple -->
                  <div class="calendar-grid">
                    <div class="calendar-header">
                      <div v-for="day in weekDays" :key="day" class="calendar-day-header">
                        {{ day }}
                      </div>
                    </div>
                    <div class="calendar-body">
                      <div
                        v-for="date in calendarDates"
                        :key="date.date"
                        class="calendar-date"
                        :class="{ 'has-events': date.events.length > 0 }"
                      >
                        <div class="date-number">{{ date.day }}</div>
                        <div v-for="event in date.events.slice(0, 2)" :key="event.id" class="calendar-event" :class="event.type" @click="goToEvent(event.id)" style="cursor: pointer;">
                          {{ event.title }}
                        </div>
                        <div v-if="date.events.length > 2" class="more-events">
                          +{{ date.events.length - 2 }} autres
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Légende des types -->
                  <div class="mt-4 pa-3 bg-grey-lighten-4 rounded">
                    <div class="text-subtitle-2 mb-2 font-weight-bold">Légende des types</div>
                    <div class="d-flex flex-wrap ga-3">
                      <div class="d-flex align-center">
                        <div class="legend-dot" style="background: #7b1fa2;"></div>
                        <span class="text-body-2">Conférence</span>
                      </div>
                      <div class="d-flex align-center">
                        <div class="legend-dot" style="background: #1976d2;"></div>
                        <span class="text-body-2">Formation</span>
                      </div>
                      <div class="d-flex align-center">
                        <div class="legend-dot" style="background: #388e3c;"></div>
                        <span class="text-body-2">Webinaire</span>
                      </div>
                      <div class="d-flex align-center">
                        <div class="legend-dot" style="background: #f57c00;"></div>
                        <span class="text-body-2">Atelier</span>
                      </div>
                      <div class="d-flex align-center">
                        <div class="legend-dot" style="background: #d32f2f;"></div>
                        <span class="text-body-2">Networking</span>
                      </div>
                      <div class="d-flex align-center">
                        <div class="legend-dot" style="background: #00796b;"></div>
                        <span class="text-body-2">Salon</span>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
            
            <!-- Sidebar Prochains Événements -->
            <v-col cols="12" md="4">
              <v-card elevation="2">
                <v-card-title class="pa-4">
                  <v-icon class="mr-2">mdi-clock</v-icon>
                  Prochains Événements
                </v-card-title>
                <v-card-text class="pa-0">
                  <div
                    v-for="event in upcomingEvents"
                    :key="event.id"
                    class="event-item pa-4 border-b"
                    @click="goToEvent(event.id)"
                    style="cursor: pointer;"
                  >
                    <div class="d-flex align-start">
                      <v-avatar :color="getEventTypeColor(event.type)" size="40" class="mr-3">
                        <v-icon color="white" size="20">{{ getEventTypeIcon(event.type) }}</v-icon>
                      </v-avatar>
                      <div class="flex-grow-1">
                        <h4 class="text-body-1 font-weight-bold mb-1">{{ event.title }}</h4>
                        <div class="text-body-2 text-grey-darken-1 mb-2">{{ event.description }}</div>
                        <div class="d-flex align-center mb-2">
                          <v-icon size="16" class="mr-1">mdi-calendar</v-icon>
                          <span class="text-body-2">{{ event.date }}</span>
                        </div>
                        <div class="d-flex align-center mb-2">
                          <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
                          <span class="text-body-2">{{ event.location }}</span>
                        </div>
                        <div class="d-flex align-center ga-2">
                          <v-btn
                            :color="getEventTypeColor(event.type)"
                            size="small"
                            variant="flat"
                            @click.stop="registerForEvent(event)"
                          >
                            S'inscrire
                          </v-btn>
                          <v-btn
                            v-if="authStore.isAuthenticated && event.created_by !== authStore.user?.id"
                            icon
                            size="x-small"
                            variant="text"
                            color="grey"
                            @click.stop="openReportDialog(event)"
                          >
                            <v-icon size="16">mdi-flag-outline</v-icon>
                            <v-tooltip activator="parent" location="top">Signaler</v-tooltip>
                          </v-btn>
                        </div>
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>

              <!-- Types d'événements -->
              <v-card class="mt-4" elevation="2">
                <v-card-title class="pa-4">
                  Types d'Événements
                </v-card-title>
                <v-card-text class="pa-4">
                  <div
                    v-for="type in eventTypes"
                    :key="type.name"
                    class="d-flex align-center mb-3"
                  >
                    <v-avatar :color="type.color" size="32" class="mr-3">
                      <v-icon color="white" size="16">{{ type.icon }}</v-icon>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <div class="text-body-1 font-weight-bold">{{ type.name }}</div>
                      <div class="text-body-2 text-grey-darken-1">{{ type.count }} événements</div>
                    </div>
                    <v-btn
                      size="small"
                      variant="text"
                      @click="filterByType(type.name)"
                    >
                      Voir les {{ type.name.toLowerCase() }}
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-container>

    <!-- Dialog Créer Événement (Wizard) -->
    <v-dialog v-model="createEventDialog" max-width="650" persistent>
      <v-card>
        <v-card-title class="pa-4 bg-purple-darken-1 text-white">
          <v-icon class="mr-2">mdi-calendar-plus</v-icon>
          Créer un événement
          <v-chip class="ml-2" size="small" color="white" variant="flat">
            Étape {{ wizardStep }}/3
          </v-chip>
        </v-card-title>

        <!-- Stepper -->
        <v-stepper v-model="wizardStep" flat alt-labels class="elevation-0">
          <v-stepper-header>
            <v-stepper-item :complete="wizardStep > 1" :value="1" title="Événement" />
            <v-divider />
            <v-stepper-item :complete="wizardStep > 2" :value="2" title="Organisateur" />
            <v-divider />
            <v-stepper-item :value="3" title="Tarification" />
          </v-stepper-header>

          <v-stepper-window>
            <!-- Étape 1: Informations de base -->
            <v-stepper-window-item :value="1">
              <v-card-text class="pa-4">
                <v-alert type="info" variant="tonal" class="mb-4">
                  <strong>Informations de base</strong> - Tous les champs marqués * sont obligatoires
                </v-alert>
                <v-text-field
                  v-model="newEvent.title"
                  label="Titre de l'événement *"
                  variant="outlined"
                  class="mb-3"
                  :rules="[v => !!v || 'Titre requis']"
                />
                <v-select
                  v-model="newEvent.type"
                  :items="eventTypesList"
                  label="Type d'événement *"
                  variant="outlined"
                  class="mb-3"
                  :rules="[v => !!v || 'Type requis']"
                />
                <v-select
                  v-model="newEvent.category"
                  :items="sectorsList"
                  item-title="name"
                  item-value="name"
                  label="Catégorie (secteur) *"
                  variant="outlined"
                  class="mb-3"
                  :rules="[v => !!v || 'Catégorie requise']"
                />
                <v-textarea
                  v-model="newEvent.description"
                  label="Description *"
                  variant="outlined"
                  rows="3"
                  :rules="[v => !!v || 'Description requise']"
                />
              </v-card-text>
            </v-stepper-window-item>

            <!-- Étape 2: Date, Lieu et Organisateur -->
            <v-stepper-window-item :value="2">
              <v-card-text class="pa-4">
                <v-alert type="info" variant="tonal" class="mb-4">
                  <strong>Date, Lieu et Organisateur</strong> - Tous les champs marqués * sont obligatoires
                </v-alert>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="newEvent.date"
                      label="Date et heure *"
                      type="datetime-local"
                      variant="outlined"
                      :rules="[v => !!v || 'Date requise']"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="newEvent.location"
                      label="Lieu *"
                      variant="outlined"
                      prepend-inner-icon="mdi-map-marker"
                      :rules="[v => !!v || 'Lieu requis']"
                    />
                  </v-col>
                </v-row>
                <v-divider class="my-4" />
                <v-text-field
                  v-model="newEvent.organizer_name"
                  label="Nom de l'organisateur *"
                  variant="outlined"
                  prepend-inner-icon="mdi-account"
                  class="mb-3"
                  :rules="[v => !!v || 'Organisateur requis']"
                />
                <v-text-field
                  v-model="newEvent.organizer_email"
                  label="Email de contact *"
                  variant="outlined"
                  type="email"
                  prepend-inner-icon="mdi-email"
                  class="mb-3"
                  :rules="[v => !!v || 'Email requis']"
                />
                <v-text-field
                  v-model="newEvent.organizer_phone"
                  label="Téléphone (optionnel)"
                  variant="outlined"
                  prepend-inner-icon="mdi-phone"
                  class="mb-3"
                />
                <v-file-input
                  v-model="newEvent.image"
                  label="Visuel (optionnel)"
                  variant="outlined"
                  accept="image/*"
                  prepend-icon="mdi-image"
                  show-size
                  density="compact"
                  class="mb-3"
                />
                <v-file-input
                  v-model="newEvent.document"
                  label="Document joint (optionnel)"
                  variant="outlined"
                  accept=".pdf,.doc,.docx,.ppt,.pptx"
                  prepend-icon="mdi-file-document"
                  show-size
                  density="compact"
                />
              </v-card-text>
            </v-stepper-window-item>

            <!-- Étape 3: Tarification -->
            <v-stepper-window-item :value="3">
              <v-card-text class="pa-4">
                <v-alert type="info" variant="tonal" class="mb-4">
                  <strong>Tarification de l'événement</strong><br>
                  Définissez si l'événement est gratuit ou payant.
                </v-alert>
                
                <v-radio-group v-model="newEvent.is_free" class="mb-4">
                  <v-radio :value="true" color="green">
                    <template v-slot:label>
                      <div class="d-flex align-center">
                        <v-icon class="mr-2" color="green">mdi-gift</v-icon>
                        <span><strong>Gratuit</strong> - Inscription libre</span>
                      </div>
                    </template>
                  </v-radio>
                  <v-radio :value="false" color="orange">
                    <template v-slot:label>
                      <div class="d-flex align-center">
                        <v-icon class="mr-2" color="orange">mdi-cash</v-icon>
                        <span><strong>Payant</strong> - Frais d'inscription</span>
                      </div>
                    </template>
                  </v-radio>
                </v-radio-group>

                <v-expand-transition>
                  <div v-if="!newEvent.is_free">
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          v-model.number="newEvent.price"
                          label="Prix d'inscription *"
                          variant="outlined"
                          type="number"
                          min="0"
                          prepend-inner-icon="mdi-currency-usd"
                          suffix="FCFA"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model.number="newEvent.max_participants"
                          label="Places disponibles"
                          variant="outlined"
                          type="number"
                          min="1"
                          prepend-inner-icon="mdi-account-group"
                        />
                      </v-col>
                    </v-row>
                  </div>
                </v-expand-transition>

                <v-divider class="my-4" />
                
                <v-checkbox
                  v-model="newEvent.require_approval"
                  label="Approbation manuelle des inscriptions"
                  color="purple"
                  hide-details
                />
              </v-card-text>
            </v-stepper-window-item>
          </v-stepper-window>
        </v-stepper>

        <v-card-actions class="pa-4 bg-grey-lighten-4">
          <v-btn variant="text" @click="createEventDialog = false; wizardStep = 1">
            Annuler
          </v-btn>
          <v-spacer />
          <v-btn v-if="wizardStep > 1" variant="outlined" @click="wizardStep--">
            <v-icon left>mdi-arrow-left</v-icon> Précédent
          </v-btn>
          <v-btn 
            v-if="wizardStep < 3" 
            color="purple-darken-1" 
            variant="flat" 
            @click="wizardStep++"
            :disabled="!canProceed"
          >
            Suivant <v-icon right>mdi-arrow-right</v-icon>
          </v-btn>
          <v-btn 
            v-else 
            color="green-darken-1" 
            variant="flat" 
            :loading="isSubmitting" 
            @click="createEvent"
            :disabled="!canSubmit"
          >
            <v-icon left>mdi-check</v-icon> Soumettre
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de signalement -->
    <ReportContentDialog
      v-model="reportDialog"
      target-type="event"
      :target-id="eventToReport?.id || ''"
      :content-title="eventToReport?.title || ''"
      @reported="handleReported"
    />

    <!-- Snackbar notifications -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="4000">
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'
import { emailService } from '@/services/emailService'
import { eventsService } from '@/services/eventsService'
import dataService from '@/services/dataService'
import ReportContentDialog from '@/components/ReportContentDialog.vue'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const activeTab = ref('calendar')
const createEventDialog = ref(false)
const currentDate = ref(new Date())
const loading = ref(false)

// Signalement
const reportDialog = ref(false)
const eventToReport = ref(null)

const newEvent = ref({
  // Étape 1: Événement
  title: '',
  type: '',
  category: '',
  description: '',
  // Étape 2: Organisateur
  date: '',
  location: '',
  organizer_name: '',
  organizer_email: '',
  organizer_phone: '',
  image: null,
  document: null,
  // Étape 3: Tarification
  is_free: true,
  price: 0,
  max_participants: null,
  require_approval: false
})

const wizardStep = ref(1)
const snackbar = ref({ show: false, message: '', color: 'success' })
const isSubmitting = ref(false)

// Validation wizard - chaque étape valide uniquement ses propres champs
const canProceed = computed(() => {
  if (wizardStep.value === 1) {
    // Étape 1: Titre, Type, Catégorie, Description
    return newEvent.value.title && newEvent.value.type && newEvent.value.category && newEvent.value.description
  }
  if (wizardStep.value === 2) {
    // Étape 2: Date, Lieu, Organisateur
    return newEvent.value.date && newEvent.value.location && newEvent.value.organizer_name && newEvent.value.organizer_email
  }
  return true
})

const canSubmit = computed(() => {
  if (!newEvent.value.is_free && !newEvent.value.price) return false
  return canProceed.value
})

// Types d'événements statiques
const eventTypesList = [
  'Conférence',
  'Formation',
  'Webinaire',
  'Atelier',
  'Networking',
  'Salon/Exposition',
  'Séminaire',
  'Table ronde'
]

// Stats depuis Supabase
const stats = ref({
  upcoming: 0,
  participants: 0,
  virtual: 0,
  cities: 0
})

// Données depuis Supabase
const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']
const eventTypes = ref([])
const sectorsList = ref([])
const upcomingEvents = ref([])
const allEvents = ref([])

// Charger les secteurs (catégories thématiques)
const loadSectors = async () => {
  try {
    const sectors = await dataService.getSectors()
    sectorsList.value = sectors
  } catch (error) {
    console.log('Secteurs non disponibles')
  }
}

// Charger les statistiques
const loadStats = async () => {
  try {
    const { count: upcomingCount } = await supabase
      .from('pev_events')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'published')
      .gte('start_date', new Date().toISOString())

    const { count: participantsCount } = await supabase
      .from('pev_event_participants')
      .select('*', { count: 'exact', head: true })

    const { count: virtualCount } = await supabase
      .from('pev_events')
      .select('*', { count: 'exact', head: true })
      .eq('location_type', 'online')
      .eq('status', 'published')

    const { data: citiesData } = await supabase
      .from('pev_events')
      .select('city')
      .eq('status', 'published')
      .not('city', 'is', null)

    const uniqueCities = new Set(citiesData?.map(e => e.city) || [])

    stats.value = {
      upcoming: upcomingCount || 0,
      participants: participantsCount || 0,
      virtual: virtualCount || 0,
      cities: uniqueCities.size
    }
  } catch (error) {
    console.log('Stats événements non disponibles')
  }
}

// Charger les catégories
const loadCategories = async () => {
  try {
    const { data } = await supabase
      .from('pev_event_categories')
      .select('*')
      .order('display_order')

    if (data && data.length > 0) {
      // Compter les événements par catégorie
      const categoriesWithCount = await Promise.all(data.map(async (cat) => {
        const { count } = await supabase
          .from('pev_events')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', cat.id)
          .eq('status', 'published')

        return {
          name: cat.name,
          count: count || 0,
          color: cat.color,
          icon: cat.icon
        }
      }))

      eventTypes.value = categoriesWithCount
    }
  } catch (error) {
    console.log('Catégories non disponibles')
  }
}

// Charger les événements à venir
const loadUpcomingEvents = async () => {
  try {
    const { data } = await supabase
      .from('pev_events')
      .select('*')
      .eq('status', 'published')
      .gte('start_date', new Date().toISOString())
      .order('start_date')
      .limit(5)

    if (data && data.length > 0) {
      upcomingEvents.value = data.map(e => ({
        id: e.id,
        title: e.title,
        description: e.description,
        date: new Date(e.start_date).toLocaleDateString('fr-FR', { 
          day: 'numeric', 
          month: 'long', 
          year: 'numeric' 
        }),
        location: e.location || e.city || 'En ligne',
        type: e.type || e.event_type || 'Événement',
        category_id: e.category_id
      }))
    }
  } catch (error) {
    console.log('Événements à venir non disponibles')
  }
}

// Charger tous les événements pour le calendrier
const loadAllEvents = async () => {
  try {
    const { data } = await supabase
      .from('pev_events')
      .select('*')
      .eq('status', 'published')

    if (data) {
      allEvents.value = data
    }
  } catch (error) {
    console.log('Événements non disponibles')
  }
}

// Computed
const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
})

const calendarDates = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  
  const dates = []
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(year, month, day)
    const events = getEventsForDate(date)
    dates.push({
      date: date.toISOString().split('T')[0],
      day: day,
      events: events
    })
  }
  return dates
})

// Methods
const getEventsForDate = (date) => {
  const dateKey = date.toISOString().split('T')[0]
  return allEvents.value.filter(event => {
    const eventDate = new Date(event.start_date).toISOString().split('T')[0]
    return eventDate === dateKey
  }).map(event => ({
    id: event.id,
    title: event.title,
    type: getTypeClass(event.event_type)
  }))
}

const getTypeClass = (type) => {
  if (!type) return 'default'
  const typeLower = type.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  
  if (typeLower.includes('conference') || typeLower.includes('conf')) return 'conference'
  if (typeLower.includes('formation')) return 'formation'
  if (typeLower.includes('webinaire') || typeLower.includes('webinar')) return 'webinar'
  if (typeLower.includes('atelier') || typeLower.includes('workshop')) return 'workshop'
  if (typeLower.includes('networking') || typeLower.includes('reseau')) return 'networking'
  if (typeLower.includes('salon') || typeLower.includes('exposition')) return 'salon'
  if (typeLower.includes('seminaire') || typeLower.includes('seminar')) return 'seminar'
  if (typeLower.includes('table') || typeLower.includes('ronde')) return 'roundtable'
  
  return 'default'
}

const getEventTypeColor = (type) => {
  const colors = {
    'Conférences': 'blue',
    'Workshops': 'green',
    'Networking': 'purple',
    'Formations': 'orange'
  }
  return colors[type] || 'grey'
}

const getEventTypeIcon = (type) => {
  const icons = {
    'Conférences': 'mdi-microphone',
    'Workshops': 'mdi-tools',
    'Networking': 'mdi-account-group',
    'Formations': 'mdi-school'
  }
  return icons[type] || 'mdi-calendar'
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}

const openReportDialog = (event) => {
  eventToReport.value = event
  reportDialog.value = true
}

const handleReported = () => {
  snackbar.value = { show: true, message: 'Signalement envoyé. Notre équipe l\'examinera rapidement.', color: 'success' }
}

const registerForEvent = async (event) => {
  if (!authStore.isAuthenticated) {
    router.push('/auth/login')
    return
  }

  try {
    const userId = authStore.user?.id
    
    // Vérifier si déjà inscrit
    const { data: existing } = await supabase
      .from('pev_event_participants')
      .select('id')
      .eq('event_id', event.id)
      .eq('user_id', userId)
      .single()

    if (existing) {
      alert('Vous êtes déjà inscrit à cet événement')
      return
    }

    // Inscrire l'utilisateur
    const { error } = await supabase
      .from('pev_event_participants')
      .insert({
        event_id: event.id,
        user_id: userId,
        status: 'registered'
      })

    if (error) throw error

    // Envoyer email de confirmation
    try {
      const userEmail = authStore.user?.email
      const userName = authStore.user?.profile?.first_name || 'Utilisateur'
      
      await emailService.sendTemplateEmail('event_registration', userEmail, {
        recipient_name: userName,
        event_title: event.title,
        event_date: new Date(event.start_date || event.date).toLocaleDateString('fr-FR', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        event_location: event.location || event.address || 'En ligne',
        action_url: `${window.location.origin}/events/${event.id}`
      })
    } catch (emailError) {
      console.warn('Erreur envoi email inscription:', emailError)
    }

    alert('Inscription confirmée ! Un email de confirmation vous a été envoyé.')
    await loadStats()
  } catch (error) {
    console.error('Erreur inscription:', error)
    alert('Erreur lors de l\'inscription')
  }
}

const filterByType = (type) => {
  console.log('Filtrer par type:', type)
  // TODO: Implémenter le filtrage
}

const goToEvent = (eventId) => {
  router.push(`/events/${eventId}`)
}

const createEvent = async () => {
  if (!authStore.isAuthenticated) {
    snackbar.value = { show: true, message: 'Vous devez être connecté', color: 'error' }
    return
  }

  isSubmitting.value = true
  try {
    const payload = {
      title: newEvent.value.title,
      description: newEvent.value.description,
      event_type: newEvent.value.type,
      category: newEvent.value.category,
      start_date: newEvent.value.date || new Date().toISOString(),
      location: newEvent.value.location || 'Non spécifié',
      location_type: 'physical',
      created_by: authStore.user?.id,
      // Organisateur
      organizer_name: newEvent.value.organizer_name,
      contact_email: newEvent.value.organizer_email,
      contact_phone: newEvent.value.organizer_phone || null,
      organizer_website: newEvent.value.organizer_website || null,
      // Tarification
      is_free: newEvent.value.is_free,
      price: newEvent.value.is_free ? 0 : newEvent.value.price,
      max_participants: newEvent.value.max_participants || null,
      require_approval: newEvent.value.require_approval
    }

    // Récupérer les fichiers si présents
    const imageFile = newEvent.value.image?.[0] || newEvent.value.image || null
    const documentFile = newEvent.value.document?.[0] || newEvent.value.document || null

    const result = await eventsService.createEvent(payload, imageFile, documentFile)

    if (result.success) {
      snackbar.value = { show: true, message: 'Événement soumis pour modération !', color: 'success' }
      createEventDialog.value = false
      wizardStep.value = 1
      // Réinitialiser le formulaire
      newEvent.value = {
        title: '', type: '', category: '', description: '', date: '', location: '',
        organizer_name: '', organizer_email: '', organizer_phone: '',
        image: null, document: null,
        is_free: true, price: 0, max_participants: null, require_approval: false
      }
    } else {
      snackbar.value = { show: true, message: result.error || 'Erreur création', color: 'error' }
    }
  } catch (error) {
    console.error('Erreur:', error)
    snackbar.value = { show: true, message: error.message, color: 'error' }
  } finally {
    isSubmitting.value = false
  }
}

// Initialize
onMounted(async () => {
  loading.value = true
  await Promise.all([
    loadStats(),
    loadCategories(),
    loadSectors(),
    loadUpcomingEvents(),
    loadAllEvents()
  ])
  loading.value = false
})
</script>

<style scoped>
.events-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.hero-banner {
  background: linear-gradient(135deg, #7b1fa2 0%, #9c27b0 100%);
}

.calendar-grid {
  width: 100%;
}

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  background-color: #f5f5f5;
}

.calendar-day-header {
  padding: 12px;
  text-align: center;
  font-weight: bold;
  border-right: 1px solid #e0e0e0;
}

.calendar-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
}

.calendar-date {
  min-height: 120px;
  padding: 8px;
  border: 1px solid #e0e0e0;
  background-color: white;
}

.calendar-date.has-events {
  background-color: #f9f9f9;
}

.date-number {
  font-weight: bold;
  margin-bottom: 4px;
}

.calendar-event {
  font-size: 10px;
  padding: 2px 4px;
  margin: 1px 0;
  border-radius: 3px;
  background-color: #e3f2fd;
  color: #1976d2;
  cursor: pointer;
  position: relative;
  z-index: 1;
  transition: transform 0.1s, box-shadow 0.1s;
}

.calendar-event:hover {
  transform: scale(1.02);
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.calendar-event.conference {
  background-color: #f3e5f5 !important;
  color: #7b1fa2 !important;
}

.calendar-event.workshop,
.calendar-event.atelier {
  background-color: #fff3e0 !important;
  color: #f57c00 !important;
}

.calendar-event.networking {
  background-color: #fce4ec !important;
  color: #e91e63 !important;
}

.calendar-event.formation {
  background-color: #e8f5e9 !important;
  color: #388e3c !important;
}

.calendar-event.webinar,
.calendar-event.webinaire {
  background-color: #e3f2fd !important;
  color: #1976d2 !important;
}

.calendar-event.salon {
  background-color: #e0f2f1 !important;
  color: #00897b !important;
}

.calendar-event.seminar,
.calendar-event.seminaire {
  background-color: #ede7f6 !important;
  color: #673ab7 !important;
}

.calendar-event.roundtable {
  background-color: #efebe9 !important;
  color: #6d4c41 !important;
}

.calendar-event.default {
  background-color: #e0e0e0 !important;
  color: #424242 !important;
}

.more-events {
  font-size: 10px;
  color: #666;
  font-style: italic;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  margin-right: 6px;
}

.event-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.event-item:hover {
  background-color: #f9f9f9;
}

.border-b {
  border-bottom: 1px solid #e0e0e0;
}

.v-card {
  border-radius: 12px !important;
}

.v-btn {
  border-radius: 8px !important;
}
</style>
