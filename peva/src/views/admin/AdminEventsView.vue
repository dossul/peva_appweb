<template>
  <div class="admin-events">
    <!-- Header -->
    <div class="admin-header bg-purple-darken-2 text-white py-6">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">
              <v-icon size="32" class="mr-3">mdi-calendar-multiple</v-icon>
              Gestion des Événements
            </h1>
            <p class="text-h6 font-weight-regular ma-0">
              Gérez les événements, catégories et participants
            </p>
          </div>
          <v-btn 
            color="white" 
            variant="flat" 
            prepend-icon="mdi-plus" 
            class="text-purple-darken-2"
            @click="openEventDialog()"
          >
            Nouvel Événement
          </v-btn>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <!-- Statistiques -->
      <v-row class="mb-6">
        <v-col cols="12" md="2">
          <v-card color="purple-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-calendar</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.total }}</div>
              <div class="text-body-2">Total événements</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="2">
          <v-card color="blue-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-calendar-check</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.upcoming }}</div>
              <div class="text-body-2">À venir</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="2">
          <v-card color="green-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-check-circle</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.published }}</div>
              <div class="text-body-2">Publiés</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="2">
          <v-card color="orange-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-account-group</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.participants }}</div>
              <div class="text-body-2">Participants</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="2">
          <v-card color="indigo-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-calendar-clock</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.thisMonth }}</div>
              <div class="text-body-2">Ce mois</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="2">
          <v-card color="red-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-file-document-edit</v-icon>
              <div class="text-h5 font-weight-bold">{{ draftCount }}</div>
              <div class="text-body-2">Brouillons</div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Onglets -->
      <v-card elevation="2">
        <v-tabs v-model="activeTab" bg-color="grey-lighten-4">
          <v-tab value="events">
            <v-icon class="mr-2">mdi-calendar</v-icon>
            Événements
          </v-tab>
          <v-tab value="categories">
            <v-icon class="mr-2">mdi-folder-multiple</v-icon>
            Catégories
          </v-tab>
          <v-tab value="participants">
            <v-icon class="mr-2">mdi-account-group</v-icon>
            Participants
          </v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <!-- Onglet Événements -->
          <v-window-item value="events">
            <v-card-text>
              <v-row class="mb-4">
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="eventSearch"
                    placeholder="Rechercher..."
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                    @update:model-value="loadEvents"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="eventStatusFilter"
                    :items="[
                      { title: 'Tous', value: null },
                      { title: 'Brouillon', value: 'draft' },
                      { title: 'Publié', value: 'published' },
                      { title: 'Annulé', value: 'cancelled' }
                    ]"
                    item-title="title"
                    item-value="value"
                    variant="outlined"
                    density="compact"
                    hide-details
                    @update:model-value="loadEvents"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="eventCategoryFilter"
                    :items="[{ name: 'Toutes catégories', id: null }, ...categories]"
                    item-title="name"
                    item-value="id"
                    variant="outlined"
                    density="compact"
                    hide-details
                    @update:model-value="loadEvents"
                  />
                </v-col>
              </v-row>

              <v-data-table
                :headers="eventHeaders"
                :items="events"
                :loading="loadingEvents"
                class="elevation-0"
              >
                <template v-slot:item.title="{ item }">
                  <div class="d-flex align-center">
                    <v-avatar :color="item.is_featured ? 'orange' : 'grey'" size="40" class="mr-3">
                      <v-icon color="white">{{ item.is_featured ? 'mdi-star' : 'mdi-calendar' }}</v-icon>
                    </v-avatar>
                    <div>
                      <div class="font-weight-bold">{{ item.title }}</div>
                      <div class="text-caption text-grey">{{ item.location || item.city }}</div>
                    </div>
                  </div>
                </template>
                
                <template v-slot:item.start_date="{ item }">
                  {{ formatDate(item.start_date) }}
                </template>
                
                <template v-slot:item.location_type="{ item }">
                  <v-chip :color="item.location_type === 'online' ? 'purple' : 'blue'" size="small">
                    {{ item.location_type === 'online' ? 'En ligne' : 'Présentiel' }}
                  </v-chip>
                </template>
                
                <template v-slot:item.status="{ item }">
                  <v-chip :color="getStatusColor(item.status)" size="small">
                    {{ getStatusLabel(item.status) }}
                  </v-chip>
                </template>
                
                <template v-slot:item.participants_count="{ item }">
                  <div class="d-flex align-center">
                    <v-icon size="14" class="mr-1">mdi-account-group</v-icon>
                    {{ item.participants_count || 0 }}
                    <span v-if="item.max_participants" class="text-caption text-grey ml-1">
                      / {{ item.max_participants }}
                    </span>
                  </div>
                </template>
                
                <template v-slot:item.actions="{ item }">
                  <v-btn icon size="small" @click="openEventDialog(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon size="small" @click="viewParticipants(item)">
                    <v-icon>mdi-account-multiple</v-icon>
                  </v-btn>
                  <v-btn 
                    icon 
                    size="small" 
                    :color="item.is_featured ? 'grey' : 'orange'"
                    @click="toggleFeatured(item)"
                  >
                    <v-icon>{{ item.is_featured ? 'mdi-star-off' : 'mdi-star' }}</v-icon>
                  </v-btn>
                  <v-btn icon size="small" color="error" @click="confirmDeleteEvent(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-window-item>

          <!-- Onglet Catégories -->
          <v-window-item value="categories">
            <v-card-text>
              <div class="d-flex justify-end mb-4">
                <v-btn color="purple-darken-2" variant="flat" prepend-icon="mdi-plus" @click="openCategoryDialog()">
                  Nouvelle Catégorie
                </v-btn>
              </div>

              <v-data-table
                :headers="categoryHeaders"
                :items="categories"
                :loading="loadingCategories"
                class="elevation-0"
              >
                <template v-slot:item.icon="{ item }">
                  <v-avatar :color="item.color || 'purple'" size="36">
                    <v-icon color="white">{{ item.icon || 'mdi-calendar' }}</v-icon>
                  </v-avatar>
                </template>
                
                <template v-slot:item.name="{ item }">
                  <div>
                    <div class="font-weight-bold">{{ item.name }}</div>
                    <div class="text-caption text-grey">{{ item.description }}</div>
                  </div>
                </template>
                
                <template v-slot:item.is_active="{ item }">
                  <v-chip :color="item.is_active ? 'success' : 'grey'" size="small">
                    {{ item.is_active ? 'Actif' : 'Inactif' }}
                  </v-chip>
                </template>
                
                <template v-slot:item.actions="{ item }">
                  <v-btn icon size="small" @click="openCategoryDialog(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon size="small" color="error" @click="confirmDeleteCategory(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-window-item>

          <!-- Onglet Participants -->
          <v-window-item value="participants">
            <v-card-text>
              <v-select
                v-model="selectedEventForParticipants"
                :items="events"
                item-title="title"
                item-value="id"
                label="Sélectionner un événement"
                variant="outlined"
                class="mb-4"
                @update:model-value="loadParticipants"
              />

              <v-data-table
                v-if="selectedEventForParticipants"
                :headers="participantHeaders"
                :items="participants"
                :loading="loadingParticipants"
                class="elevation-0"
              >
                <template v-slot:item.user="{ item }">
                  <div class="d-flex align-center">
                    <v-avatar size="32" class="mr-2" color="purple">
                      <span class="text-white">{{ getInitials(item.pev_profiles) }}</span>
                    </v-avatar>
                    <div>
                      <div class="font-weight-bold">
                        {{ item.pev_profiles?.first_name }} {{ item.pev_profiles?.last_name }}
                      </div>
                      <div class="text-caption text-grey">{{ item.pev_profiles?.email }}</div>
                    </div>
                  </div>
                </template>
                
                <template v-slot:item.status="{ item }">
                  <v-chip 
                    :color="item.status === 'registered' ? 'success' : item.status === 'pending' ? 'warning' : item.status === 'rejected' ? 'error' : 'grey'" 
                    size="small"
                  >
                    {{ item.status === 'registered' ? 'Inscrit' : item.status === 'pending' ? 'En attente' : item.status === 'rejected' ? 'Rejeté' : item.status }}
                  </v-chip>
                </template>
                
                <template v-slot:item.registration_date="{ item }">
                  {{ formatDate(item.registration_date) }}
                </template>
                
                <template v-slot:item.actions="{ item }">
                  <template v-if="item.status === 'pending'">
                    <v-btn icon size="small" color="success" @click="approveParticipant(item)" title="Approuver">
                      <v-icon>mdi-check-circle</v-icon>
                    </v-btn>
                    <v-btn icon size="small" color="error" @click="rejectParticipant(item)" title="Rejeter">
                      <v-icon>mdi-close-circle</v-icon>
                    </v-btn>
                  </template>
                  <template v-else-if="item.status === 'registered'">
                    <v-btn icon size="small" color="success" @click="markAttendance(item, true)" title="Marquer présent">
                      <v-icon>mdi-account-check</v-icon>
                    </v-btn>
                    <v-btn icon size="small" color="error" @click="removeParticipant(item)" title="Retirer">
                      <v-icon>mdi-account-remove</v-icon>
                    </v-btn>
                  </template>
                  <template v-else>
                    <v-btn icon size="small" disabled>
                      <v-icon>mdi-minus</v-icon>
                    </v-btn>
                  </template>
                </template>
              </v-data-table>
            </v-card-text>
          </v-window-item>
        </v-window>
      </v-card>
    </v-container>

    <!-- Dialog Événement -->
    <v-dialog v-model="eventDialog" max-width="900" scrollable>
      <v-card>
        <v-card-title>
          {{ editingEvent ? 'Modifier l\'événement' : 'Nouvel événement' }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="8">
              <v-text-field v-model="eventForm.title" label="Titre *" variant="outlined" />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="eventForm.category_id"
                :items="categories"
                item-title="name"
                item-value="id"
                label="Catégorie"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="eventForm.description" label="Description" variant="outlined" rows="3" />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="eventForm.event_type"
                :items="['conference', 'workshop', 'webinar', 'networking', 'formation']"
                label="Type d'événement"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="eventForm.location_type"
                :items="[
                  { title: 'Présentiel', value: 'physical' },
                  { title: 'En ligne', value: 'online' },
                  { title: 'Hybride', value: 'hybrid' }
                ]"
                item-title="title"
                item-value="value"
                label="Lieu"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="eventForm.status"
                :items="[
                  { title: 'Brouillon', value: 'draft' },
                  { title: 'Publié', value: 'published' },
                  { title: 'Annulé', value: 'cancelled' }
                ]"
                item-title="title"
                item-value="value"
                label="Statut"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="eventForm.start_date" label="Date début *" type="datetime-local" variant="outlined" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="eventForm.end_date" label="Date fin" type="datetime-local" variant="outlined" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="eventForm.location" label="Lieu" variant="outlined" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="eventForm.city" label="Ville" variant="outlined" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="eventForm.contact_email" label="Email contact" type="email" variant="outlined" />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field v-model="eventForm.max_participants" label="Participants max" type="number" variant="outlined" />
            </v-col>
            <v-col cols="12" md="6">
              <v-switch v-model="eventForm.is_free" label="Gratuit" color="success" />
            </v-col>
            <v-col cols="12" md="6">
              <v-switch v-model="eventForm.is_featured" label="Événement vedette" color="orange" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="eventDialog = false">Annuler</v-btn>
          <v-btn color="purple-darken-2" variant="flat" @click="saveEvent" :loading="saving" :disabled="!eventForm.title">
            {{ editingEvent ? 'Enregistrer' : 'Créer' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Catégorie -->
    <v-dialog v-model="categoryDialog" max-width="500">
      <v-card>
        <v-card-title>
          {{ editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="categoryForm.name" label="Nom *" variant="outlined" class="mb-4" />
          <v-textarea v-model="categoryForm.description" label="Description" variant="outlined" rows="2" class="mb-4" />
          <v-row>
            <v-col cols="6">
              <v-select v-model="categoryForm.icon" :items="iconOptions" label="Icône" variant="outlined">
                <template v-slot:selection="{ item }">
                  <v-icon class="mr-2">{{ item.value }}</v-icon>
                </template>
                <template v-slot:item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend><v-icon>{{ item.value }}</v-icon></template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-select v-model="categoryForm.color" :items="colorOptions" label="Couleur" variant="outlined">
                <template v-slot:selection="{ item }">
                  <v-avatar :color="item.value" size="20" class="mr-2" />
                </template>
                <template v-slot:item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend><v-avatar :color="item.value" size="24" /></template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
          </v-row>
          <v-switch v-model="categoryForm.is_active" label="Catégorie active" color="success" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="categoryDialog = false">Annuler</v-btn>
          <v-btn color="purple-darken-2" variant="flat" @click="saveCategory" :loading="saving" :disabled="!categoryForm.name">
            {{ editingCategory ? 'Enregistrer' : 'Créer' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Confirmation Suppression -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-error">Confirmer la suppression</v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer {{ deleteType === 'event' ? 'cet événement' : 'cette catégorie' }} ?
          <br><br>
          <strong>{{ deleteItem?.title || deleteItem?.name }}</strong>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDelete" :loading="deleting">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="4000">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Fermer</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { eventsService } from '@/services/admin/eventsService'

// État
const activeTab = ref('events')
const loadingEvents = ref(false)
const loadingCategories = ref(false)
const loadingParticipants = ref(false)
const saving = ref(false)
const deleting = ref(false)

// Données
const stats = ref({ total: 0, upcoming: 0, published: 0, participants: 0, thisMonth: 0 })
const events = ref([])
const categories = ref([])
const participants = ref([])
const selectedEventForParticipants = ref(null)

// Filtres
const eventSearch = ref('')
const eventStatusFilter = ref(null)
const eventCategoryFilter = ref(null)

// Dialogs
const eventDialog = ref(false)
const categoryDialog = ref(false)
const deleteDialog = ref(false)

// Edition
const editingEvent = ref(null)
const editingCategory = ref(null)
const deleteType = ref('')
const deleteItem = ref(null)

// Formulaires
const eventForm = ref({
  title: '', description: '', event_type: 'conference', location_type: 'physical',
  category_id: null, start_date: '', end_date: '', location: '', city: '',
  contact_email: '', max_participants: null, is_free: true, is_featured: false, status: 'draft'
})
const categoryForm = ref({
  name: '', description: '', icon: 'mdi-calendar', color: 'purple', is_active: true
})

// Snackbar
const snackbar = ref({ show: false, message: '', color: 'success' })

// Options
const iconOptions = [
  { title: 'Calendrier', value: 'mdi-calendar' },
  { title: 'Présentation', value: 'mdi-presentation' },
  { title: 'Outils', value: 'mdi-hammer-wrench' },
  { title: 'Vidéo', value: 'mdi-video' },
  { title: 'Groupe', value: 'mdi-account-group' },
  { title: 'Magasin', value: 'mdi-store' },
  { title: 'École', value: 'mdi-school' },
  { title: 'Terre', value: 'mdi-earth' }
]

const colorOptions = [
  { title: 'Bleu', value: 'blue' },
  { title: 'Vert', value: 'green' },
  { title: 'Violet', value: 'purple' },
  { title: 'Orange', value: 'orange' },
  { title: 'Rouge', value: 'red' },
  { title: 'Teal', value: 'teal' },
  { title: 'Indigo', value: 'indigo' }
]

// Headers
const eventHeaders = [
  { title: 'Événement', key: 'title' },
  { title: 'Date', key: 'start_date', width: 150 },
  { title: 'Type', key: 'location_type', width: 120 },
  { title: 'Statut', key: 'status', width: 100 },
  { title: 'Participants', key: 'participants_count', width: 120 },
  { title: 'Actions', key: 'actions', sortable: false, width: 180 }
]

const categoryHeaders = [
  { title: 'Icône', key: 'icon', sortable: false, width: 80 },
  { title: 'Catégorie', key: 'name' },
  { title: 'Ordre', key: 'display_order', width: 100 },
  { title: 'Statut', key: 'is_active', width: 100 },
  { title: 'Actions', key: 'actions', sortable: false, width: 120 }
]

const participantHeaders = [
  { title: 'Participant', key: 'user' },
  { title: 'Statut', key: 'status', width: 120 },
  { title: 'Inscription', key: 'registration_date', width: 150 },
  { title: 'Actions', key: 'actions', sortable: false, width: 120 }
]

// Computed
const draftCount = computed(() => events.value.filter(e => e.status === 'draft').length)

// Méthodes
const loadStats = async () => {
  const result = await eventsService.getEventsStats()
  if (result.success) stats.value = result.data
}

const loadEvents = async () => {
  loadingEvents.value = true
  const result = await eventsService.getEvents({
    search: eventSearch.value,
    status: eventStatusFilter.value,
    categoryId: eventCategoryFilter.value
  })
  if (result.success) events.value = result.data
  loadingEvents.value = false
}

const loadCategories = async () => {
  loadingCategories.value = true
  const result = await eventsService.getCategories()
  if (result.success) categories.value = result.data
  loadingCategories.value = false
}

const loadParticipants = async () => {
  if (!selectedEventForParticipants.value) return
  loadingParticipants.value = true
  const result = await eventsService.getEventParticipants(selectedEventForParticipants.value)
  if (result.success) participants.value = result.data
  loadingParticipants.value = false
}

const openEventDialog = (event = null) => {
  editingEvent.value = event
  if (event) {
    eventForm.value = { ...event, start_date: event.start_date?.substring(0, 16), end_date: event.end_date?.substring(0, 16) }
  } else {
    eventForm.value = {
      title: '', description: '', event_type: 'conference', location_type: 'physical',
      category_id: null, start_date: '', end_date: '', location: '', city: '',
      contact_email: '', max_participants: null, is_free: true, is_featured: false, status: 'draft'
    }
  }
  eventDialog.value = true
}

const openCategoryDialog = (category = null) => {
  editingCategory.value = category
  if (category) {
    categoryForm.value = { ...category }
  } else {
    categoryForm.value = { name: '', description: '', icon: 'mdi-calendar', color: 'purple', is_active: true }
  }
  categoryDialog.value = true
}

const saveEvent = async () => {
  saving.value = true
  let result
  if (editingEvent.value) {
    result = await eventsService.updateEvent(editingEvent.value.id, eventForm.value)
  } else {
    result = await eventsService.createEvent(eventForm.value)
  }
  if (result.success) {
    showMessage(editingEvent.value ? 'Événement modifié' : 'Événement créé', 'success')
    eventDialog.value = false
    loadEvents()
    loadStats()
  } else {
    showMessage(result.error || 'Erreur', 'error')
  }
  saving.value = false
}

const saveCategory = async () => {
  saving.value = true
  let result
  if (editingCategory.value) {
    result = await eventsService.updateCategory(editingCategory.value.id, categoryForm.value)
  } else {
    result = await eventsService.createCategory(categoryForm.value)
  }
  if (result.success) {
    showMessage(editingCategory.value ? 'Catégorie modifiée' : 'Catégorie créée', 'success')
    categoryDialog.value = false
    loadCategories()
  } else {
    showMessage(result.error || 'Erreur', 'error')
  }
  saving.value = false
}

const toggleFeatured = async (event) => {
  const result = await eventsService.toggleFeatured(event.id, !event.is_featured)
  if (result.success) {
    event.is_featured = !event.is_featured
    showMessage('Événement vedette mis à jour', 'success')
  }
}

const confirmDeleteEvent = (event) => {
  deleteType.value = 'event'
  deleteItem.value = event
  deleteDialog.value = true
}

const confirmDeleteCategory = (category) => {
  deleteType.value = 'category'
  deleteItem.value = category
  deleteDialog.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  let result
  if (deleteType.value === 'event') {
    result = await eventsService.deleteEvent(deleteItem.value.id)
    if (result.success) loadEvents()
  } else {
    result = await eventsService.deleteCategory(deleteItem.value.id)
    if (result.success) loadCategories()
  }
  if (result.success) {
    showMessage('Supprimé avec succès', 'success')
    loadStats()
  } else {
    showMessage(result.error || 'Erreur', 'error')
  }
  deleteDialog.value = false
  deleting.value = false
}

const viewParticipants = (event) => {
  selectedEventForParticipants.value = event.id
  activeTab.value = 'participants'
  loadParticipants()
}

const markAttendance = async (participant, attended) => {
  const result = await eventsService.markAttendance(participant.id, attended)
  if (result.success) {
    showMessage('Présence enregistrée', 'success')
    loadParticipants()
  }
}

const removeParticipant = async (participant) => {
  const result = await eventsService.removeParticipant(participant.id)
  if (result.success) {
    showMessage('Participant retiré', 'success')
    loadParticipants()
  }
}

const approveParticipant = async (participant) => {
  const result = await eventsService.approveParticipant(participant.id, selectedEventForParticipants.value)
  if (result.success) {
    showMessage('Participant approuvé - Email envoyé', 'success')
    loadParticipants()
    loadStats()
  } else {
    showMessage(result.error || 'Erreur lors de l\'approbation', 'error')
  }
}

const rejectParticipant = async (participant) => {
  const result = await eventsService.rejectParticipant(participant.id, selectedEventForParticipants.value)
  if (result.success) {
    showMessage('Participant rejeté - Email envoyé', 'info')
    loadParticipants()
  } else {
    showMessage(result.error || 'Erreur lors du rejet', 'error')
  }
}

const getInitials = (profile) => {
  if (!profile) return '?'
  return ((profile.first_name?.[0] || '') + (profile.last_name?.[0] || '')).toUpperCase() || '?'
}

const formatDate = (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-'

const getStatusColor = (status) => {
  const colors = { draft: 'grey', published: 'success', cancelled: 'error' }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = { draft: 'Brouillon', published: 'Publié', cancelled: 'Annulé' }
  return labels[status] || status
}

const showMessage = (message, color) => {
  snackbar.value = { show: true, message, color }
}

// Init
onMounted(() => {
  loadStats()
  loadEvents()
  loadCategories()
})
</script>

<style scoped>
.admin-events {
  min-height: 100vh;
  background-color: #f8f9fa;
}
.admin-header {
  background: linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%);
}
.v-card { border-radius: 12px !important; }
.v-btn { border-radius: 8px !important; }
</style>
