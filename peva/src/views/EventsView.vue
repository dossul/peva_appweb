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
            <div class="text-h4 font-weight-bold text-blue-darken-2">24</div>
            <div class="text-body-2">Événements à venir</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="text-center pa-4" color="green-lighten-5">
            <v-icon size="32" color="green-darken-2" class="mb-2">mdi-account-group</v-icon>
            <div class="text-h4 font-weight-bold text-green-darken-2">1 247</div>
            <div class="text-body-2">Participants inscrits</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="text-center pa-4" color="purple-lighten-5">
            <v-icon size="32" color="purple-darken-2" class="mb-2">mdi-video</v-icon>
            <div class="text-h4 font-weight-bold text-purple-darken-2">8</div>
            <div class="text-body-2">Événements virtuels</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="text-center pa-4" color="orange-lighten-5">
            <v-icon size="32" color="orange-darken-2" class="mb-2">mdi-map-marker</v-icon>
            <div class="text-h4 font-weight-bold text-orange-darken-2">15</div>
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
                        <div v-for="event in date.events.slice(0, 2)" :key="event.id" class="calendar-event" :class="event.type">
                          {{ event.title }}
                        </div>
                        <div v-if="date.events.length > 2" class="more-events">
                          +{{ date.events.length - 2 }} autres
                        </div>
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
                        <v-btn
                          :color="getEventTypeColor(event.type)"
                          size="small"
                          variant="flat"
                          @click="registerForEvent(event)"
                        >
                          S'inscrire
                        </v-btn>
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

    <!-- Dialog Créer Événement -->
    <v-dialog v-model="createEventDialog" max-width="600">
      <v-card>
        <v-card-title class="pa-4">
          <v-icon class="mr-2">mdi-plus</v-icon>
          Créer un nouvel événement
        </v-card-title>
        <v-card-text class="pa-4">
          <v-text-field
            v-model="newEvent.title"
            label="Titre de l'événement *"
            variant="outlined"
            class="mb-4"
          />
          <v-select
            v-model="newEvent.type"
            :items="eventTypes.map(t => t.name)"
            label="Type d'événement *"
            variant="outlined"
            class="mb-4"
          />
          <v-textarea
            v-model="newEvent.description"
            label="Description *"
            variant="outlined"
            rows="3"
            class="mb-4"
          />
          <v-text-field
            v-model="newEvent.date"
            label="Date *"
            type="datetime-local"
            variant="outlined"
            class="mb-4"
          />
          <v-text-field
            v-model="newEvent.location"
            label="Lieu *"
            variant="outlined"
          />
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="createEventDialog = false">
            Annuler
          </v-btn>
          <v-btn color="purple-darken-1" variant="flat" @click="createEvent">
            Créer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const activeTab = ref('calendar')
const createEventDialog = ref(false)
const currentDate = ref(new Date())

const newEvent = ref({
  title: '',
  type: '',
  description: '',
  date: '',
  location: ''
})

// Mock data selon l'image 1
const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

const eventTypes = ref([
  { name: 'Valorisation des déchets', count: 7, color: 'green', icon: 'mdi-recycle' },
  { name: 'Bilan carbone', count: 12, color: 'blue', icon: 'mdi-leaf' },
  { name: 'Économie circulaire', count: 5, color: 'purple', icon: 'mdi-sync' },
  { name: 'Énergies renouvelables', count: 8, color: 'orange', icon: 'mdi-solar-power' },
  { name: 'Agriculture durable', count: 6, color: 'teal', icon: 'mdi-sprout' },
  { name: 'Transport vert', count: 4, color: 'indigo', icon: 'mdi-car-electric' }
])

const upcomingEvents = ref([
  {
    id: 1,
    title: 'Intelligence Artificielle et Économie Verte en Afrique',
    description: 'Une journée dédiée à l\'exploration des applications de l\'IA dans les secteurs verts en Afrique.',
    date: '25 Mars 2024',
    location: 'Abidjan, Côte d\'Ivoire',
    type: 'Conférences'
  },
  {
    id: 2,
    title: 'Workshop Pratique: Installation Solaire Résidentielle',
    description: 'Formation pratique pour apprendre les bases de l\'installation de panneaux solaires résidentiels.',
    date: '27 Mars 2024',
    location: 'Dakar, Sénégal',
    type: 'Workshops'
  }
])

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
  // Mock events for specific dates
  const mockEvents = {
    '2024-03-15': [
      { id: 1, title: 'Conférence IA', type: 'conference' },
      { id: 2, title: 'Workshop Solaire', type: 'workshop' }
    ],
    '2024-03-22': [
      { id: 3, title: 'Networking', type: 'networking' }
    ],
    '2024-03-29': [
      { id: 4, title: 'Formation', type: 'formation' }
    ]
  }
  
  const dateKey = date.toISOString().split('T')[0]
  return mockEvents[dateKey] || []
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

const registerForEvent = (event) => {
  console.log('S\'inscrire à l\'événement:', event.title)
  // TODO: Implémenter l'inscription
}

const filterByType = (type) => {
  console.log('Filtrer par type:', type)
  // TODO: Implémenter le filtrage
}

const createEvent = () => {
  if (newEvent.value.title && newEvent.value.type && newEvent.value.description) {
    console.log('Créer événement:', newEvent.value)
    createEventDialog.value = false
    newEvent.value = { title: '', type: '', description: '', date: '', location: '' }
  }
}

// Initialize
onMounted(() => {
  // TODO: Charger les événements depuis Supabase
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
}

.calendar-event.conference {
  background-color: #e3f2fd;
  color: #1976d2;
}

.calendar-event.workshop {
  background-color: #e8f5e8;
  color: #388e3c;
}

.calendar-event.networking {
  background-color: #f3e5f5;
  color: #7b1fa2;
}

.calendar-event.formation {
  background-color: #fff3e0;
  color: #f57c00;
}

.more-events {
  font-size: 10px;
  color: #666;
  font-style: italic;
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
