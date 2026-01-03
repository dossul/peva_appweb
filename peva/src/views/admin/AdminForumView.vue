<template>
  <div class="admin-forum">
    <!-- Header -->
    <div class="admin-header bg-purple-darken-2 text-white py-6">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">
              <v-icon size="32" class="mr-3">mdi-forum</v-icon>
              Gestion du Forum
            </h1>
            <p class="text-h6 font-weight-regular ma-0">
              Gérez les catégories, topics et discussions du forum
            </p>
          </div>
          <div class="d-flex align-center ga-3">
            <v-btn 
              color="white" 
              variant="flat" 
              prepend-icon="mdi-plus" 
              class="text-purple-darken-2"
              @click="openCategoryDialog()"
            >
              Nouvelle Catégorie
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <!-- Statistiques -->
      <v-row class="mb-6">
        <v-col cols="12" md="3">
          <v-card color="purple-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-folder-multiple</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.categories }}</div>
              <div class="text-body-2">Catégories</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="blue-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-forum</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.topics }}</div>
              <div class="text-body-2">Discussions</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="green-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-message</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.posts }}</div>
              <div class="text-body-2">Messages</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="orange-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-clock</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.postsToday }}</div>
              <div class="text-body-2">Aujourd'hui</div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Onglets -->
      <v-card elevation="2">
        <v-tabs v-model="activeTab" bg-color="grey-lighten-4">
          <v-tab value="categories">
            <v-icon class="mr-2">mdi-folder-multiple</v-icon>
            Catégories
          </v-tab>
          <v-tab value="topics">
            <v-icon class="mr-2">mdi-forum</v-icon>
            Discussions
          </v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <!-- Onglet Catégories -->
          <v-window-item value="categories">
            <v-card-text>
              <v-data-table
                :headers="categoryHeaders"
                :items="categories"
                :loading="loading"
                class="elevation-0"
              >
                <template v-slot:item.icon="{ item }">
                  <v-avatar :color="item.color || 'primary'" size="36">
                    <v-icon color="white">{{ item.icon || 'mdi-folder' }}</v-icon>
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

          <!-- Onglet Discussions -->
          <v-window-item value="topics">
            <v-card-text>
              <v-row class="mb-4">
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="topicSearch"
                    placeholder="Rechercher..."
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                    @update:model-value="loadTopics"
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="topicCategoryFilter"
                    :items="[{ id: null, name: 'Toutes catégories' }, ...categories]"
                    item-title="name"
                    item-value="id"
                    variant="outlined"
                    density="compact"
                    hide-details
                    @update:model-value="loadTopics"
                  />
                </v-col>
              </v-row>

              <v-data-table
                :headers="topicHeaders"
                :items="topics"
                :loading="loadingTopics"
                class="elevation-0"
              >
                <template v-slot:item.title="{ item }">
                  <div>
                    <div class="d-flex align-center">
                      <v-icon v-if="item.is_pinned" size="16" color="orange" class="mr-1">mdi-pin</v-icon>
                      <span class="font-weight-bold">{{ item.title }}</span>
                    </div>
                    <div class="text-caption text-grey">
                      Par {{ item.pev_profiles?.first_name }} {{ item.pev_profiles?.last_name }}
                    </div>
                  </div>
                </template>
                
                <template v-slot:item.category="{ item }">
                  <v-chip 
                    v-if="item.pev_forum_categories" 
                    :color="item.pev_forum_categories.color || 'primary'" 
                    size="small"
                  >
                    <v-icon size="14" class="mr-1">{{ item.pev_forum_categories.icon }}</v-icon>
                    {{ item.pev_forum_categories.name }}
                  </v-chip>
                </template>
                
                <template v-slot:item.status="{ item }">
                  <v-chip :color="getStatusColor(item.status)" size="small">
                    {{ getStatusLabel(item.status) }}
                  </v-chip>
                </template>
                
                <template v-slot:item.views_count="{ item }">
                  <div class="d-flex align-center">
                    <v-icon size="14" class="mr-1">mdi-eye</v-icon>
                    {{ item.views_count || 0 }}
                  </div>
                </template>
                
                <template v-slot:item.created_at="{ item }">
                  {{ formatDate(item.created_at) }}
                </template>
                
                <template v-slot:item.actions="{ item }">
                  <v-btn 
                    icon 
                    size="small" 
                    :color="item.is_pinned ? 'orange' : 'grey'"
                    @click="togglePin(item)"
                  >
                    <v-icon>mdi-pin</v-icon>
                  </v-btn>
                  <v-btn icon size="small" color="error" @click="confirmDeleteTopic(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-window-item>
        </v-window>
      </v-card>
    </v-container>

    <!-- Dialog Catégorie -->
    <v-dialog v-model="categoryDialog" max-width="600">
      <v-card>
        <v-card-title>
          {{ editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="categoryForm.name"
            label="Nom *"
            variant="outlined"
            class="mb-4"
            :rules="[v => !!v || 'Requis']"
          />
          
          <v-textarea
            v-model="categoryForm.description"
            label="Description"
            variant="outlined"
            rows="2"
            class="mb-4"
          />
          
          <v-row>
            <v-col cols="6">
              <v-select
                v-model="categoryForm.icon"
                :items="iconOptions"
                label="Icône *"
                variant="outlined"
              >
                <template v-slot:selection="{ item }">
                  <v-icon class="mr-2">{{ item.value }}</v-icon>
                  {{ item.title }}
                </template>
                <template v-slot:item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-icon>{{ item.value }}</v-icon>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="categoryForm.color"
                :items="colorOptions"
                label="Couleur *"
                variant="outlined"
              >
                <template v-slot:selection="{ item }">
                  <v-avatar :color="item.value" size="20" class="mr-2" />
                  {{ item.title }}
                </template>
                <template v-slot:item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-avatar :color="item.value" size="24" />
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="6">
              <v-text-field
                v-model.number="categoryForm.display_order"
                label="Ordre d'affichage"
                type="number"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-switch
                v-model="categoryForm.is_active"
                label="Catégorie active"
                color="success"
              />
            </v-col>
          </v-row>
          
          <!-- Prévisualisation -->
          <div class="mt-4 pa-4 bg-grey-lighten-4 rounded">
            <div class="text-caption mb-2">Prévisualisation :</div>
            <div class="d-flex align-center">
              <v-avatar :color="categoryForm.color || 'primary'" size="48" class="mr-4">
                <v-icon color="white" size="24">{{ categoryForm.icon || 'mdi-folder' }}</v-icon>
              </v-avatar>
              <div>
                <div class="font-weight-bold">{{ categoryForm.name || 'Nom de la catégorie' }}</div>
                <div class="text-body-2 text-grey">{{ categoryForm.description || 'Description...' }}</div>
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="categoryDialog = false">Annuler</v-btn>
          <v-btn 
            color="purple-darken-2" 
            variant="flat" 
            @click="saveCategory"
            :loading="saving"
            :disabled="!categoryForm.name"
          >
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
          Êtes-vous sûr de vouloir supprimer {{ deleteType === 'category' ? 'cette catégorie' : 'cette discussion' }} ?
          <br><br>
          <strong>{{ deleteItem?.name || deleteItem?.title }}</strong>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDelete" :loading="deleting">
            Supprimer
          </v-btn>
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
import { ref, onMounted } from 'vue'
import { forumService } from '@/services/admin/forumService'

// État
const activeTab = ref('categories')
const loading = ref(false)
const loadingTopics = ref(false)
const saving = ref(false)
const deleting = ref(false)

// Données
const stats = ref({ categories: 0, topics: 0, posts: 0, postsToday: 0 })
const categories = ref([])
const topics = ref([])

// Filtres topics
const topicSearch = ref('')
const topicCategoryFilter = ref(null)

// Dialog catégorie
const categoryDialog = ref(false)
const editingCategory = ref(null)
const categoryForm = ref({
  name: '',
  description: '',
  icon: 'mdi-folder',
  color: 'primary',
  display_order: 0,
  is_active: true
})

// Dialog suppression
const deleteDialog = ref(false)
const deleteType = ref('')
const deleteItem = ref(null)

// Snackbar
const snackbar = ref({ show: false, message: '', color: 'success' })

// Options
const iconOptions = [
  { title: 'Énergie', value: 'mdi-solar-power' },
  { title: 'Agriculture', value: 'mdi-leaf' },
  { title: 'Finance', value: 'mdi-currency-eur' },
  { title: 'Transport', value: 'mdi-car-electric' },
  { title: 'Recyclage', value: 'mdi-recycle' },
  { title: 'Innovation', value: 'mdi-lightbulb' },
  { title: 'Eau', value: 'mdi-water' },
  { title: 'Bâtiment', value: 'mdi-home-city' },
  { title: 'Industrie', value: 'mdi-factory' },
  { title: 'Général', value: 'mdi-folder' },
  { title: 'Question', value: 'mdi-help-circle' },
  { title: 'Annonce', value: 'mdi-bullhorn' }
]

const colorOptions = [
  { title: 'Orange', value: 'orange' },
  { title: 'Vert', value: 'green' },
  { title: 'Bleu', value: 'blue' },
  { title: 'Violet', value: 'purple' },
  { title: 'Teal', value: 'teal' },
  { title: 'Rose', value: 'pink' },
  { title: 'Indigo', value: 'indigo' },
  { title: 'Rouge', value: 'red' },
  { title: 'Cyan', value: 'cyan' },
  { title: 'Ambre', value: 'amber' }
]

// Headers tableaux
const categoryHeaders = [
  { title: 'Icône', key: 'icon', sortable: false, width: 80 },
  { title: 'Catégorie', key: 'name' },
  { title: 'Ordre', key: 'display_order', width: 100 },
  { title: 'Statut', key: 'is_active', width: 100 },
  { title: 'Actions', key: 'actions', sortable: false, width: 120 }
]

const topicHeaders = [
  { title: 'Titre', key: 'title' },
  { title: 'Catégorie', key: 'category', width: 150 },
  { title: 'Statut', key: 'status', width: 100 },
  { title: 'Vues', key: 'views_count', width: 80 },
  { title: 'Date', key: 'created_at', width: 120 },
  { title: 'Actions', key: 'actions', sortable: false, width: 120 }
]

// Méthodes
const loadStats = async () => {
  const result = await forumService.getForumStats()
  if (result.success) stats.value = result.data
}

const loadCategories = async () => {
  loading.value = true
  const result = await forumService.getCategories()
  if (result.success) categories.value = result.data
  loading.value = false
}

const loadTopics = async () => {
  loadingTopics.value = true
  const result = await forumService.getTopics({
    search: topicSearch.value,
    categoryId: topicCategoryFilter.value
  })
  if (result.success) topics.value = result.data
  loadingTopics.value = false
}

const openCategoryDialog = (category = null) => {
  editingCategory.value = category
  if (category) {
    categoryForm.value = { ...category }
  } else {
    categoryForm.value = {
      name: '',
      description: '',
      icon: 'mdi-folder',
      color: 'primary',
      display_order: categories.value.length,
      is_active: true
    }
  }
  categoryDialog.value = true
}

const saveCategory = async () => {
  saving.value = true
  let result
  
  if (editingCategory.value) {
    result = await forumService.updateCategory(editingCategory.value.id, categoryForm.value)
  } else {
    result = await forumService.createCategory(categoryForm.value)
  }
  
  if (result.success) {
    showMessage(editingCategory.value ? 'Catégorie modifiée' : 'Catégorie créée', 'success')
    categoryDialog.value = false
    loadCategories()
    loadStats()
  } else {
    showMessage(result.error || 'Erreur', 'error')
  }
  saving.value = false
}

const confirmDeleteCategory = (category) => {
  deleteType.value = 'category'
  deleteItem.value = category
  deleteDialog.value = true
}

const confirmDeleteTopic = (topic) => {
  deleteType.value = 'topic'
  deleteItem.value = topic
  deleteDialog.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  let result
  
  if (deleteType.value === 'category') {
    result = await forumService.deleteCategory(deleteItem.value.id)
    if (result.success) loadCategories()
  } else {
    result = await forumService.deleteTopic(deleteItem.value.id)
    if (result.success) loadTopics()
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

const togglePin = async (topic) => {
  const result = await forumService.togglePinTopic(topic.id, !topic.is_pinned)
  if (result.success) {
    topic.is_pinned = !topic.is_pinned
    showMessage(topic.is_pinned ? 'Topic épinglé' : 'Topic désépinglé', 'success')
  }
}

const getStatusColor = (status) => {
  const colors = { published: 'success', pending: 'warning', rejected: 'error', draft: 'grey' }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = { published: 'Publié', pending: 'En attente', rejected: 'Rejeté', draft: 'Brouillon' }
  return labels[status] || status
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR')
}

const showMessage = (message, color) => {
  snackbar.value = { show: true, message, color }
}

// Init
onMounted(() => {
  loadStats()
  loadCategories()
  loadTopics()
})
</script>

<style scoped>
.admin-forum {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.admin-header {
  background: linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%);
}

.v-card {
  border-radius: 12px !important;
}

.v-btn {
  border-radius: 8px !important;
}
</style>
