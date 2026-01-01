<template>
  <div class="admin-events-manager">
    <!-- En-tête avec actions -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h5 font-weight-bold">Gestion des Événements</h2>
        <p class="text-body-2 text-grey-darken-1">{{ totalEvents }} événements organisés</p>
      </div>
      <div class="d-flex align-center ga-2">
        <v-btn color="green" prepend-icon="mdi-calendar-plus" @click="openCreateDialog">
          Nouvel événement
        </v-btn>
        <v-btn color="blue" prepend-icon="mdi-export" @click="exportEvents">
          Exporter
        </v-btn>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <v-card class="mb-6" elevation="2">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="searchQuery"
              label="Rechercher un événement"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filterType"
              :items="typeOptions"
              label="Type"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filterFormat"
              :items="formatOptions"
              label="Format"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filterStatus"
              :items="statusOptions"
              label="Statut"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filterPeriod"
              :items="periodOptions"
              label="Période"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="1">
            <v-btn color="grey" variant="outlined" block @click="resetFilters">
              Reset
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Tableau des événements -->
    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="filteredEvents"
        :loading="loading"
        :items-per-page="itemsPerPage"
        :search="searchQuery"
        class="elevation-0"
      >
        <!-- Événement -->
        <template #item.event="{ item }">
          <div class="py-2">
            <div class="font-weight-medium">{{ item.title }}</div>
            <div class="text-caption text-grey-darken-1 d-flex align-center">
              <v-chip
                :color="getTypeColor(item.type)"
                size="x-small"
                variant="flat"
                class="mr-2"
              >
                {{ getTypeLabel(item.type) }}
              </v-chip>
              {{ item.category }}
            </div>
          </div>
        </template>

        <!-- Date et heure -->
        <template #item.datetime="{ item }">
          <div class="text-body-2">
            <div class="font-weight-medium">{{ formatDate(item.start_date) }}</div>
            <div class="text-caption text-grey-darken-1">
              {{ formatTime(item.start_time) }}
              <span v-if="item.end_time">- {{ formatTime(item.end_time) }}</span>
            </div>
          </div>
        </template>

        <!-- Format -->
        <template #item.format="{ item }">
          <v-chip
            :color="getFormatColor(item.format)"
            size="small"
            variant="tonal"
          >
            <v-icon start size="16">{{ getFormatIcon(item.format) }}</v-icon>
            {{ getFormatLabel(item.format) }}
          </v-chip>
        </template>

        <!-- Lieu -->
        <template #item.location="{ item }">
          <div class="text-body-2">
            <div v-if="item.format === 'online'">
              <v-icon size="16" color="blue" class="mr-1">mdi-web</v-icon>
              En ligne
            </div>
            <div v-else-if="item.format === 'hybrid'">
              <div>{{ item.location || 'Lieu à définir' }}</div>
              <div class="text-caption text-grey">+ En ligne</div>
            </div>
            <div v-else>
              {{ item.location || 'Lieu à définir' }}
            </div>
          </div>
        </template>

        <!-- Organisateur -->
        <template #item.organizer="{ item }">
          <div v-if="item.organizer" class="d-flex align-center">
            <v-avatar size="24" class="mr-2">
              <v-img
                v-if="item.organizer.avatar_url"
                :src="item.organizer.avatar_url"
                :alt="item.organizer.first_name"
              />
              <v-icon v-else size="16">mdi-account</v-icon>
            </v-avatar>
            <div class="text-body-2">
              {{ item.organizer.first_name }} {{ item.organizer.last_name }}
            </div>
          </div>
          <div v-else class="text-caption text-grey">Non défini</div>
        </template>

        <!-- Participants -->
        <template #item.participants="{ item }">
          <div class="text-body-2">
            <div class="font-weight-medium">{{ item.participants_count || 0 }}</div>
            <div class="text-caption text-grey-darken-1">
              / {{ item.max_participants || '∞' }}
            </div>
          </div>
        </template>

        <!-- Statut -->
        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
            variant="tonal"
          >
            {{ getStatusLabel(item.status) }}
          </v-chip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex align-center ga-1">
            <v-tooltip text="Voir l'événement">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  @click="viewEvent(item)"
                />
              </template>
            </v-tooltip>
            <v-tooltip text="Modifier">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  color="blue"
                  @click="editEvent(item)"
                />
              </template>
            </v-tooltip>
            <v-tooltip text="Participants">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-account-group"
                  size="small"
                  variant="text"
                  color="green"
                  @click="viewParticipants(item)"
                />
              </template>
            </v-tooltip>
            <v-tooltip :text="item.status === 'published' ? 'Annuler' : 'Publier'">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="item.status === 'published' ? 'mdi-cancel' : 'mdi-publish'"
                  size="small"
                  variant="text"
                  :color="item.status === 'published' ? 'orange' : 'green'"
                  @click="toggleStatus(item)"
                />
              </template>
            </v-tooltip>
            <v-tooltip text="Supprimer">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="red"
                  @click="deleteEvent(item)"
                />
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de création/modification -->
    <v-dialog v-model="eventDialog" max-width="1000px" persistent>
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          {{ editingEvent ? 'Modifier l\'événement' : 'Nouvel événement' }}
        </v-card-title>
        
        <v-card-text>
          <v-form ref="eventForm" v-model="formValid">
            <v-row>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="eventFormData.title"
                  label="Titre de l'événement"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="eventFormData.type"
                  :items="typeList"
                  label="Type d'événement"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="eventFormData.description"
                  label="Description"
                  :rules="[rules.required]"
                  rows="4"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="eventFormData.category"
                  label="Catégorie"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="eventFormData.format"
                  :items="formatList"
                  label="Format"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="eventFormData.start_date"
                  label="Date de début"
                  type="date"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="eventFormData.start_time"
                  label="Heure de début"
                  type="time"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="eventFormData.end_time"
                  label="Heure de fin"
                  type="time"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="eventFormData.location"
                  label="Lieu"
                  :disabled="eventFormData.format === 'online'"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="eventFormData.max_participants"
                  label="Participants max"
                  type="number"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="eventFormData.registration_fee"
                  label="Frais d'inscription (XOF)"
                  type="number"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="eventFormData.contact_email"
                  label="Email de contact"
                  type="email"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="eventFormData.registration_url"
                  label="URL d'inscription"
                  type="url"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="closeEventDialog">
            Annuler
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="saving"
            :disabled="!formValid"
            @click="saveEvent"
          >
            {{ editingEvent ? 'Modifier' : 'Créer' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de confirmation de suppression -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">Confirmer la suppression</v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer l'événement 
          <strong>{{ eventToDelete?.title }}</strong> ?
          Cette action est irréversible.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="deleteDialog = false">
            Annuler
          </v-btn>
          <v-btn color="red" variant="flat" @click="confirmDelete">
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import dataService from '@/services/dataService'

// État réactif
const events = ref([])
const loading = ref(false)
const saving = ref(false)
const searchQuery = ref('')
const filterType = ref('all')
const filterFormat = ref('all')
const filterStatus = ref('all')
const filterPeriod = ref('all')
const itemsPerPage = ref(25)

// Dialogs
const eventDialog = ref(false)
const deleteDialog = ref(false)
const editingEvent = ref(null)
const eventToDelete = ref(null)
const formValid = ref(false)

// Données du formulaire
const eventFormData = ref({
  title: '',
  type: '',
  description: '',
  category: '',
  format: 'in_person',
  start_date: '',
  start_time: '',
  end_time: '',
  location: '',
  max_participants: null,
  registration_fee: 0,
  contact_email: '',
  registration_url: ''
})

// Options pour les filtres
const typeOptions = [
  { title: 'Tous les types', value: 'all' },
  { title: 'Conférence', value: 'conference' },
  { title: 'Atelier', value: 'workshop' },
  { title: 'Formation', value: 'training' },
  { title: 'Networking', value: 'networking' },
  { title: 'Webinaire', value: 'webinar' },
  { title: 'Salon', value: 'exhibition' }
]

const typeList = computed(() => 
  typeOptions.value.filter(item => item.value !== 'all')
)

const formatOptions = [
  { title: 'Tous les formats', value: 'all' },
  { title: 'Présentiel', value: 'in_person' },
  { title: 'En ligne', value: 'online' },
  { title: 'Hybride', value: 'hybrid' }
]

const formatList = computed(() => 
  formatOptions.value.filter(item => item.value !== 'all')
)

const statusOptions = [
  { title: 'Tous les statuts', value: 'all' },
  { title: 'Brouillon', value: 'draft' },
  { title: 'Publié', value: 'published' },
  { title: 'Annulé', value: 'cancelled' },
  { title: 'Terminé', value: 'completed' }
]

const periodOptions = [
  { title: 'Toutes les périodes', value: 'all' },
  { title: 'À venir', value: 'upcoming' },
  { title: 'En cours', value: 'ongoing' },
  { title: 'Passés', value: 'past' }
]

// En-têtes du tableau
const headers = [
  { title: 'Événement', key: 'event', sortable: false },
  { title: 'Date & Heure', key: 'datetime', sortable: false },
  { title: 'Format', key: 'format' },
  { title: 'Lieu', key: 'location', sortable: false },
  { title: 'Organisateur', key: 'organizer', sortable: false },
  { title: 'Participants', key: 'participants', sortable: false },
  { title: 'Statut', key: 'status' },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Règles de validation
const rules = {
  required: value => !!value || 'Ce champ est requis'
}

// Computed
const totalEvents = computed(() => events.value.length)

const filteredEvents = computed(() => {
  let filtered = events.value

  if (filterType.value !== 'all') {
    filtered = filtered.filter(event => event.type === filterType.value)
  }

  if (filterFormat.value !== 'all') {
    filtered = filtered.filter(event => event.format === filterFormat.value)
  }

  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(event => event.status === filterStatus.value)
  }

  if (filterPeriod.value !== 'all') {
    const now = new Date()
    filtered = filtered.filter(event => {
      const eventDate = new Date(event.start_date)
      switch (filterPeriod.value) {
        case 'upcoming':
          return eventDate > now
        case 'ongoing':
          return eventDate.toDateString() === now.toDateString()
        case 'past':
          return eventDate < now
        default:
          return true
      }
    })
  }

  return filtered
})

// Méthodes
const loadEvents = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('pev_events')
      .select(`
        *,
        organizer:pev_profiles(first_name, last_name, avatar_url)
      `)
      .order('start_date', { ascending: false })

    if (error) throw error
    events.value = data || []
  } catch (error) {
    console.error('Erreur lors du chargement des événements:', error)
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  filterType.value = 'all'
  filterFormat.value = 'all'
  filterStatus.value = 'all'
  filterPeriod.value = 'all'
}

const openCreateDialog = () => {
  editingEvent.value = null
  eventFormData.value = {
    title: '',
    type: '',
    description: '',
    category: '',
    format: 'in_person',
    start_date: '',
    start_time: '',
    end_time: '',
    location: '',
    max_participants: null,
    registration_fee: 0,
    contact_email: '',
    registration_url: ''
  }
  eventDialog.value = true
}

const editEvent = (event) => {
  editingEvent.value = event
  eventFormData.value = { ...event }
  eventDialog.value = true
}

const closeEventDialog = () => {
  eventDialog.value = false
  editingEvent.value = null
}

const saveEvent = async () => {
  if (!formValid.value) return

  saving.value = true
  try {
    if (editingEvent.value) {
      // Modification
      const { error } = await supabase
        .from('pev_events')
        .update(eventFormData.value)
        .eq('id', editingEvent.value.id)

      if (error) throw error
      
      // Mettre à jour localement
      const index = events.value.findIndex(e => e.id === editingEvent.value.id)
      if (index !== -1) {
        events.value[index] = { ...events.value[index], ...eventFormData.value }
      }
    } else {
      // Création
      const { data, error } = await dataService.createEvent(eventFormData.value)
      if (error) throw error
      
      events.value.unshift(data)
    }

    closeEventDialog()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    saving.value = false
  }
}

const viewEvent = (event) => {
  window.open(`/events/${event.id}`, '_blank')
}

const viewParticipants = (event) => {
  console.log('Voir participants:', event)
  // Implémenter la vue des participants
}

const toggleStatus = async (event) => {
  try {
    const newStatus = event.status === 'published' ? 'cancelled' : 'published'
    const { error } = await supabase
      .from('pev_events')
      .update({ status: newStatus })
      .eq('id', event.id)

    if (error) throw error

    event.status = newStatus
  } catch (error) {
    console.error('Erreur lors de la modification du statut:', error)
  }
}

const deleteEvent = (event) => {
  eventToDelete.value = event
  deleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    const { error } = await supabase
      .from('pev_events')
      .delete()
      .eq('id', eventToDelete.value.id)

    if (error) throw error

    const index = events.value.findIndex(e => e.id === eventToDelete.value.id)
    if (index !== -1) {
      events.value.splice(index, 1)
    }

    deleteDialog.value = false
    eventToDelete.value = null
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

const exportEvents = () => {
  const csvContent = "data:text/csv;charset=utf-8," 
    + "Titre,Type,Format,Date,Lieu,Statut\n"
    + events.value.map(event => 
        `"${event.title}","${event.type}","${event.format}","${formatDate(event.start_date)}","${event.location || ''}","${event.status}"`
      ).join("\n")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `evenements_peva_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Utilitaires
const getTypeColor = (type) => {
  const colors = {
    conference: 'blue',
    workshop: 'green',
    training: 'purple',
    networking: 'orange',
    webinar: 'teal',
    exhibition: 'red'
  }
  return colors[type] || 'grey'
}

const getTypeLabel = (type) => {
  const labels = {
    conference: 'Conférence',
    workshop: 'Atelier',
    training: 'Formation',
    networking: 'Networking',
    webinar: 'Webinaire',
    exhibition: 'Salon'
  }
  return labels[type] || type
}

const getFormatColor = (format) => {
  const colors = {
    in_person: 'green',
    online: 'blue',
    hybrid: 'purple'
  }
  return colors[format] || 'grey'
}

const getFormatIcon = (format) => {
  const icons = {
    in_person: 'mdi-map-marker',
    online: 'mdi-web',
    hybrid: 'mdi-earth'
  }
  return icons[format] || 'mdi-calendar'
}

const getFormatLabel = (format) => {
  const labels = {
    in_person: 'Présentiel',
    online: 'En ligne',
    hybrid: 'Hybride'
  }
  return labels[format] || format
}

const getStatusColor = (status) => {
  const colors = {
    draft: 'grey',
    published: 'green',
    cancelled: 'red',
    completed: 'blue'
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = {
    draft: 'Brouillon',
    published: 'Publié',
    cancelled: 'Annulé',
    completed: 'Terminé'
  }
  return labels[status] || status
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const formatTime = (timeString) => {
  return timeString ? timeString.substring(0, 5) : ''
}

// Lifecycle
onMounted(() => {
  loadEvents()
})
</script>

<style scoped>
.admin-events-manager {
  min-height: 100vh;
}
</style>
