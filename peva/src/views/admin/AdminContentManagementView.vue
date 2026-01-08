<template>
  <div class="admin-content-management">
    <!-- Header -->
    <div class="admin-header bg-green-darken-2 text-white py-6">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-btn icon="mdi-arrow-left" variant="text" class="mr-3" @click="$router.push('/admin/dashboard')" />
            <v-icon size="40" class="mr-4">mdi-file-document-multiple</v-icon>
            <div>
              <h1 class="text-h4 font-weight-bold mb-1">Gestion de Contenu</h1>
              <p class="text-subtitle-1 ma-0">Posts, ressources, événements, opportunités</p>
            </div>
          </div>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <!-- Statistiques rapides -->
      <v-row class="mb-6">
        <v-col cols="6" md="3">
          <v-card color="orange-lighten-5" class="pa-4 text-center">
            <div class="text-h4 font-weight-bold text-orange-darken-2">{{ stats.opportunities?.total || 0 }}</div>
            <div class="text-body-2 text-grey-darken-1">Opportunités</div>
            <div class="text-caption text-grey" v-if="stats.opportunities?.pending">{{ stats.opportunities.pending }} en attente</div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card color="green-lighten-5" class="pa-4 text-center">
            <div class="text-h4 font-weight-bold text-green-darken-2">{{ stats.resources?.total || 0 }}</div>
            <div class="text-body-2 text-grey-darken-1">Ressources</div>
            <div class="text-caption text-grey" v-if="stats.resources?.pending">{{ stats.resources.pending }} en attente</div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card color="purple-lighten-5" class="pa-4 text-center">
            <div class="text-h4 font-weight-bold text-purple-darken-2">{{ stats.events?.total || 0 }}</div>
            <div class="text-body-2 text-grey-darken-1">Événements</div>
            <div class="text-caption text-grey" v-if="stats.events?.pending">{{ stats.events.pending }} en attente</div>
          </v-card>
        </v-col>
        <v-col cols="6" md="3">
          <v-card color="blue-lighten-5" class="pa-4 text-center">
            <div class="text-h4 font-weight-bold text-blue-darken-2">{{ stats.forum_topics?.total || 0 }}</div>
            <div class="text-body-2 text-grey-darken-1">Sujets Forum</div>
            <div class="text-caption text-grey" v-if="stats.forum_topics?.pending">{{ stats.forum_topics.pending }} en attente</div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Tabs pour les types de contenu -->
      <v-tabs v-model="activeTab" color="green-darken-2" class="mb-6">
        <v-tab value="opportunities">
          <v-icon start>mdi-briefcase</v-icon>
          Opportunités
        </v-tab>
        <v-tab value="resources">
          <v-icon start>mdi-file-document</v-icon>
          Ressources
        </v-tab>
        <v-tab value="events">
          <v-icon start>mdi-calendar</v-icon>
          Événements
        </v-tab>
        <v-tab value="forum">
          <v-icon start>mdi-forum</v-icon>
          Forum
        </v-tab>
      </v-tabs>

      <!-- Filtres -->
      <v-card class="mb-6" elevation="2">
        <v-card-text class="d-flex align-center ga-4 flex-wrap">
          <v-btn-toggle v-model="filters.status" mandatory color="green-darken-2">
            <v-btn value="all">Tous</v-btn>
            <v-btn value="published">Publiés</v-btn>
            <v-btn value="pending">En attente</v-btn>
            <v-btn value="draft">Brouillons</v-btn>
            <v-btn value="rejected">Rejetés</v-btn>
          </v-btn-toggle>
          
          <v-text-field
            v-model="filters.search"
            placeholder="Rechercher..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            style="max-width: 300px"
            clearable
          />
          
          <v-spacer />
          
          <v-btn color="primary" variant="text" @click="loadContent" :loading="loading">
            <v-icon start>mdi-refresh</v-icon>
            Actualiser
          </v-btn>
        </v-card-text>
      </v-card>

      <!-- Loading -->
      <div v-if="loading" class="text-center py-12">
        <v-progress-circular indeterminate color="green-darken-2" size="64" />
        <p class="mt-4 text-grey">Chargement du contenu...</p>
      </div>

      <!-- Liste vide -->
      <v-card v-else-if="currentItems.length === 0" class="pa-12 text-center">
        <v-icon size="64" color="grey-lighten-1">mdi-folder-open-outline</v-icon>
        <h3 class="text-h6 mt-4 text-grey">Aucun contenu</h3>
        <p class="text-body-2 text-grey">Aucun élément ne correspond à vos critères.</p>
      </v-card>

      <!-- Table de contenu -->
      <v-card v-else elevation="2">
        <v-data-table
          :headers="currentHeaders"
          :items="currentItems"
          :items-per-page="10"
          class="elevation-0"
        >
          <template v-slot:item.title="{ item }">
            <div class="py-2">
              <div class="font-weight-bold">{{ item.title || 'Sans titre' }}</div>
              <div class="text-caption text-grey" v-if="item.description">
                {{ item.description?.substring(0, 80) }}...
              </div>
            </div>
          </template>

          <template v-slot:item.creator="{ item }">
            <div v-if="item.creator || item.author">
              {{ (item.creator || item.author)?.first_name }} {{ (item.creator || item.author)?.last_name }}
            </div>
            <span v-else class="text-grey">-</span>
          </template>

          <template v-slot:item.status="{ item }">
            <v-chip :color="getStatusColor(item.status)" size="small" variant="flat">
              {{ getStatusLabel(item.status) }}
            </v-chip>
          </template>

          <template v-slot:item.created_at="{ item }">
            {{ formatDate(item.created_at) }}
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex ga-1">
              <v-btn icon="mdi-eye" size="small" variant="text" @click="viewContent(item)" />
              <v-btn 
                v-if="item.status === 'pending' || item.status === 'in_review'"
                icon="mdi-check" 
                size="small" 
                variant="text" 
                color="success"
                @click="approveContent(item)"
              />
              <v-btn 
                v-if="item.status === 'pending' || item.status === 'in_review'"
                icon="mdi-close" 
                size="small" 
                variant="text" 
                color="error"
                @click="rejectContent(item)"
              />
              <v-btn icon="mdi-delete" size="small" variant="text" color="error" @click="confirmDelete(item)" />
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <!-- Dialog de confirmation suppression -->
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon color="error" class="mr-2">mdi-alert</v-icon>
          Confirmer la suppression
        </v-card-title>
        <v-card-text>
          <p>Êtes-vous sûr de vouloir supprimer <strong>"{{ itemToDelete?.title }}"</strong> ?</p>
          <p class="text-caption text-grey">Cette action est irréversible.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="error" @click="deleteContent" :loading="deleting">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de détails -->
    <v-dialog v-model="detailsDialog" max-width="700">
      <v-card v-if="selectedItem">
        <v-card-title class="d-flex align-center">
          {{ selectedItem.title }}
          <v-spacer />
          <v-chip :color="getStatusColor(selectedItem.status)" size="small">
            {{ getStatusLabel(selectedItem.status) }}
          </v-chip>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <p v-if="selectedItem.description" class="text-body-1 mb-4">{{ selectedItem.description }}</p>
          
          <v-row>
            <v-col cols="6">
              <strong>Créé par:</strong> 
              {{ (selectedItem.creator || selectedItem.author)?.first_name }} 
              {{ (selectedItem.creator || selectedItem.author)?.last_name }}
            </v-col>
            <v-col cols="6">
              <strong>Date:</strong> {{ formatDate(selectedItem.created_at) }}
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="detailsDialog = false">Fermer</v-btn>
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
import { ref, computed, onMounted, watch } from 'vue'
import { contentManagementService } from '@/services/admin/contentManagementService'

const loading = ref(true)
const activeTab = ref('opportunities')

const opportunities = ref([])
const resources = ref([])
const events = ref([])
const forumTopics = ref([])
const stats = ref({})

const filters = ref({
  status: 'all',
  search: ''
})

const deleteDialog = ref(false)
const detailsDialog = ref(false)
const itemToDelete = ref(null)
const selectedItem = ref(null)
const deleting = ref(false)

const showSnackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

const baseHeaders = [
  { title: 'Titre', key: 'title', sortable: true },
  { title: 'Auteur', key: 'creator', sortable: false },
  { title: 'Statut', key: 'status', sortable: true },
  { title: 'Date', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
]

const currentHeaders = computed(() => baseHeaders)

const currentItems = computed(() => {
  let items = []
  switch (activeTab.value) {
    case 'opportunities': items = opportunities.value; break
    case 'resources': items = resources.value; break
    case 'events': items = events.value; break
    case 'forum': items = forumTopics.value; break
  }

  // Filtrer par statut
  if (filters.value.status !== 'all') {
    const statusMap = {
      'pending': ['pending', 'in_review'],
      'published': ['published'],
      'draft': ['draft'],
      'rejected': ['rejected']
    }
    const allowedStatuses = statusMap[filters.value.status] || [filters.value.status]
    items = items.filter(i => allowedStatuses.includes(i.status))
  }

  // Filtrer par recherche
  if (filters.value.search) {
    const search = filters.value.search.toLowerCase()
    items = items.filter(i => i.title?.toLowerCase().includes(search))
  }

  return items
})

const getContentType = () => {
  const typeMap = {
    'opportunities': 'opportunity',
    'resources': 'resource',
    'events': 'event',
    'forum': 'forum_topic'
  }
  return typeMap[activeTab.value]
}

const loadContent = async () => {
  loading.value = true
  try {
    const [oppsResult, resourcesResult, eventsResult, topicsResult, statsResult] = await Promise.all([
      contentManagementService.getAllOpportunities(),
      contentManagementService.getAllResources(),
      contentManagementService.getAllEvents(),
      contentManagementService.getAllForumTopics(),
      contentManagementService.getContentStats()
    ])

    if (oppsResult.success) opportunities.value = oppsResult.data
    if (resourcesResult.success) resources.value = resourcesResult.data
    if (eventsResult.success) events.value = eventsResult.data
    if (topicsResult.success) forumTopics.value = topicsResult.data
    if (statsResult.success) stats.value = statsResult.data
  } catch (error) {
    console.error('Erreur chargement:', error)
    showMessage('Erreur lors du chargement', 'error')
  } finally {
    loading.value = false
  }
}

const viewContent = (item) => {
  selectedItem.value = item
  detailsDialog.value = true
}

const approveContent = async (item) => {
  try {
    const result = await contentManagementService.updateContentStatus(getContentType(), item.id, 'published')
    if (result.success) {
      showMessage('Contenu approuvé', 'success')
      loadContent()
    }
  } catch (error) {
    showMessage('Erreur lors de l\'approbation', 'error')
  }
}

const rejectContent = async (item) => {
  try {
    const result = await contentManagementService.updateContentStatus(getContentType(), item.id, 'rejected')
    if (result.success) {
      showMessage('Contenu rejeté', 'success')
      loadContent()
    }
  } catch (error) {
    showMessage('Erreur lors du rejet', 'error')
  }
}

const confirmDelete = (item) => {
  itemToDelete.value = item
  deleteDialog.value = true
}

const deleteContent = async () => {
  if (!itemToDelete.value) return
  
  deleting.value = true
  try {
    const result = await contentManagementService.deleteContent(getContentType(), itemToDelete.value.id)
    if (result.success) {
      showMessage('Contenu supprimé', 'success')
      deleteDialog.value = false
      loadContent()
    }
  } catch (error) {
    showMessage('Erreur lors de la suppression', 'error')
  } finally {
    deleting.value = false
  }
}

const getStatusColor = (status) => {
  const colors = {
    published: 'success',
    pending: 'warning',
    in_review: 'info',
    draft: 'grey',
    rejected: 'error'
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = {
    published: 'Publié',
    pending: 'En attente',
    in_review: 'En révision',
    draft: 'Brouillon',
    rejected: 'Rejeté'
  }
  return labels[status] || status
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const showMessage = (message, color = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  showSnackbar.value = true
}

watch(activeTab, () => {
  filters.value.status = 'all'
  filters.value.search = ''
})

onMounted(() => {
  loadContent()
})
</script>

<style scoped>
.admin-header {
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
}
</style>
