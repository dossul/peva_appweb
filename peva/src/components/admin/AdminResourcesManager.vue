<template>
  <div class="admin-resources-manager">
    <!-- En-tête avec actions -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h5 font-weight-bold">Gestion des Ressources</h2>
        <p class="text-body-2 text-grey-darken-1">{{ totalResources }} ressources publiées</p>
      </div>
      <div class="d-flex align-center ga-2">
        <v-btn color="green" prepend-icon="mdi-book-plus" @click="openCreateDialog">
          Nouvelle ressource
        </v-btn>
        <v-btn color="blue" prepend-icon="mdi-export" @click="exportResources">
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
              label="Rechercher une ressource"
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
              v-model="filterCategory"
              :items="categoryOptions"
              label="Catégorie"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filterLevel"
              :items="levelOptions"
              label="Niveau"
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
          <v-col cols="12" md="1">
            <v-btn color="grey" variant="outlined" block @click="resetFilters">
              Reset
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Tableau des ressources -->
    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="filteredResources"
        :loading="loading"
        :items-per-page="itemsPerPage"
        :search="searchQuery"
        class="elevation-0"
      >
        <!-- Ressource -->
        <template #item.resource="{ item }">
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

        <!-- Niveau -->
        <template #item.level="{ item }">
          <v-chip
            :color="getLevelColor(item.level)"
            size="small"
            variant="tonal"
          >
            {{ getLevelLabel(item.level) }}
          </v-chip>
        </template>

        <!-- Format -->
        <template #item.format="{ item }">
          <div class="d-flex align-center">
            <v-icon :color="getFormatColor(item.format)" class="mr-1">
              {{ getFormatIcon(item.format) }}
            </v-icon>
            <span class="text-body-2">{{ getFormatLabel(item.format) }}</span>
          </div>
        </template>

        <!-- Auteur -->
        <template #item.author="{ item }">
          <div v-if="item.author" class="d-flex align-center">
            <v-avatar size="24" class="mr-2">
              <v-img
                v-if="item.author.avatar_url"
                :src="item.author.avatar_url"
                :alt="item.author.first_name"
              />
              <v-icon v-else size="16">mdi-account</v-icon>
            </v-avatar>
            <div class="text-body-2">
              {{ item.author.first_name }} {{ item.author.last_name }}
            </div>
          </div>
          <div v-else class="text-caption text-grey">Non défini</div>
        </template>

        <!-- Téléchargements -->
        <template #item.downloads="{ item }">
          <div class="text-body-2">
            <div class="font-weight-medium">{{ item.download_count || 0 }}</div>
            <div class="text-caption text-grey-darken-1">téléchargements</div>
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

        <!-- Date de publication -->
        <template #item.published_at="{ item }">
          <div class="text-body-2">
            {{ item.published_at ? formatDate(item.published_at) : 'Non publié' }}
          </div>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex align-center ga-1">
            <v-tooltip text="Voir la ressource">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  @click="viewResource(item)"
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
                  @click="editResource(item)"
                />
              </template>
            </v-tooltip>
            <v-tooltip text="Télécharger">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-download"
                  size="small"
                  variant="text"
                  color="green"
                  @click="downloadResource(item)"
                />
              </template>
            </v-tooltip>
            <v-tooltip :text="item.status === 'published' ? 'Dépublier' : 'Publier'">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="item.status === 'published' ? 'mdi-eye-off' : 'mdi-publish'"
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
                  @click="deleteResource(item)"
                />
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de création/modification -->
    <v-dialog v-model="resourceDialog" max-width="900px" persistent>
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          {{ editingResource ? 'Modifier la ressource' : 'Nouvelle ressource' }}
        </v-card-title>
        
        <v-card-text>
          <v-form ref="resourceForm" v-model="formValid">
            <v-row>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="resourceFormData.title"
                  label="Titre de la ressource"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="resourceFormData.type"
                  :items="typeList"
                  label="Type de ressource"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="resourceFormData.description"
                  label="Description"
                  :rules="[rules.required]"
                  rows="4"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="resourceFormData.category"
                  label="Catégorie"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="resourceFormData.level"
                  :items="levelList"
                  label="Niveau"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="resourceFormData.format"
                  :items="formatList"
                  label="Format"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="resourceFormData.language"
                  label="Langue"
                  value="Français"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="resourceFormData.file_url"
                  label="URL du fichier"
                  type="url"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="resourceFormData.external_url"
                  label="URL externe (optionnel)"
                  type="url"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="resourceFormData.file_size"
                  label="Taille du fichier (MB)"
                  type="number"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="resourceFormData.duration"
                  label="Durée (minutes)"
                  type="number"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="resourceFormData.tags"
                  label="Tags (séparés par des virgules)"
                  rows="2"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="closeResourceDialog">
            Annuler
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="saving"
            :disabled="!formValid"
            @click="saveResource"
          >
            {{ editingResource ? 'Modifier' : 'Créer' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de confirmation de suppression -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">Confirmer la suppression</v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer la ressource 
          <strong>{{ resourceToDelete?.title }}</strong> ?
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
const resources = ref([])
const loading = ref(false)
const saving = ref(false)
const searchQuery = ref('')
const filterType = ref('all')
const filterCategory = ref('all')
const filterLevel = ref('all')
const filterStatus = ref('all')
const itemsPerPage = ref(25)

// Dialogs
const resourceDialog = ref(false)
const deleteDialog = ref(false)
const editingResource = ref(null)
const resourceToDelete = ref(null)
const formValid = ref(false)

// Données du formulaire
const resourceFormData = ref({
  title: '',
  type: '',
  description: '',
  category: '',
  level: 'beginner',
  format: 'pdf',
  language: 'Français',
  file_url: '',
  external_url: '',
  file_size: null,
  duration: null,
  tags: ''
})

// Options pour les filtres
const typeOptions = [
  { title: 'Tous les types', value: 'all' },
  { title: 'Guide', value: 'guide' },
  { title: 'Rapport', value: 'report' },
  { title: 'Outil', value: 'tool' },
  { title: 'Formation', value: 'training' },
  { title: 'Étude de cas', value: 'case_study' },
  { title: 'Modèle', value: 'template' }
]

const typeList = computed(() => 
  typeOptions.value.filter(item => item.value !== 'all')
)

const categoryOptions = [
  { title: 'Toutes les catégories', value: 'all' },
  { title: 'Énergie Solaire', value: 'Énergie Solaire' },
  { title: 'Agriculture Durable', value: 'Agriculture Durable' },
  { title: 'Gestion de l\'Eau', value: 'Gestion de l\'Eau' },
  { title: 'Écotourisme', value: 'Écotourisme' },
  { title: 'Finance Verte', value: 'Finance Verte' }
]

const levelOptions = [
  { title: 'Tous les niveaux', value: 'all' },
  { title: 'Débutant', value: 'beginner' },
  { title: 'Intermédiaire', value: 'intermediate' },
  { title: 'Avancé', value: 'advanced' },
  { title: 'Expert', value: 'expert' }
]

const levelList = computed(() => 
  levelOptions.value.filter(item => item.value !== 'all')
)

const statusOptions = [
  { title: 'Tous les statuts', value: 'all' },
  { title: 'Brouillon', value: 'draft' },
  { title: 'En révision', value: 'review' },
  { title: 'Publié', value: 'published' },
  { title: 'Archivé', value: 'archived' }
]

const formatList = [
  { title: 'PDF', value: 'pdf' },
  { title: 'Vidéo', value: 'video' },
  { title: 'Audio', value: 'audio' },
  { title: 'Présentation', value: 'presentation' },
  { title: 'Document', value: 'document' },
  { title: 'Lien externe', value: 'link' }
]

// En-têtes du tableau
const headers = [
  { title: 'Ressource', key: 'resource', sortable: false },
  { title: 'Niveau', key: 'level' },
  { title: 'Format', key: 'format', sortable: false },
  { title: 'Auteur', key: 'author', sortable: false },
  { title: 'Téléchargements', key: 'downloads', sortable: false },
  { title: 'Statut', key: 'status' },
  { title: 'Publié le', key: 'published_at' },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Règles de validation
const rules = {
  required: value => !!value || 'Ce champ est requis'
}

// Computed
const totalResources = computed(() => resources.value.length)

const filteredResources = computed(() => {
  let filtered = resources.value

  if (filterType.value !== 'all') {
    filtered = filtered.filter(resource => resource.type === filterType.value)
  }

  if (filterCategory.value !== 'all') {
    filtered = filtered.filter(resource => resource.category === filterCategory.value)
  }

  if (filterLevel.value !== 'all') {
    filtered = filtered.filter(resource => resource.level === filterLevel.value)
  }

  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(resource => resource.status === filterStatus.value)
  }

  return filtered
})

// Méthodes
const loadResources = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('pev_resources')
      .select(`
        *,
        author:pev_profiles(first_name, last_name, avatar_url)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    resources.value = data || []
  } catch (error) {
    console.error('Erreur lors du chargement des ressources:', error)
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  filterType.value = 'all'
  filterCategory.value = 'all'
  filterLevel.value = 'all'
  filterStatus.value = 'all'
}

const openCreateDialog = () => {
  editingResource.value = null
  resourceFormData.value = {
    title: '',
    type: '',
    description: '',
    category: '',
    level: 'beginner',
    format: 'pdf',
    language: 'Français',
    file_url: '',
    external_url: '',
    file_size: null,
    duration: null,
    tags: ''
  }
  resourceDialog.value = true
}

const editResource = (resource) => {
  editingResource.value = resource
  resourceFormData.value = { ...resource }
  resourceDialog.value = true
}

const closeResourceDialog = () => {
  resourceDialog.value = false
  editingResource.value = null
}

const saveResource = async () => {
  if (!formValid.value) return

  saving.value = true
  try {
    if (editingResource.value) {
      // Modification
      const { error } = await supabase
        .from('pev_resources')
        .update(resourceFormData.value)
        .eq('id', editingResource.value.id)

      if (error) throw error
      
      // Mettre à jour localement
      const index = resources.value.findIndex(r => r.id === editingResource.value.id)
      if (index !== -1) {
        resources.value[index] = { ...resources.value[index], ...resourceFormData.value }
      }
    } else {
      // Création
      const { data, error } = await dataService.createResource(resourceFormData.value)
      if (error) throw error
      
      resources.value.unshift(data)
    }

    closeResourceDialog()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    saving.value = false
  }
}

const viewResource = (resource) => {
  window.open(`/resources/${resource.id}`, '_blank')
}

const downloadResource = (resource) => {
  if (resource.file_url) {
    window.open(resource.file_url, '_blank')
  }
}

const toggleStatus = async (resource) => {
  try {
    const newStatus = resource.status === 'published' ? 'draft' : 'published'
    const updateData = { status: newStatus }
    
    if (newStatus === 'published' && !resource.published_at) {
      updateData.published_at = new Date().toISOString()
    }

    const { error } = await supabase
      .from('pev_resources')
      .update(updateData)
      .eq('id', resource.id)

    if (error) throw error

    resource.status = newStatus
    if (updateData.published_at) {
      resource.published_at = updateData.published_at
    }
  } catch (error) {
    console.error('Erreur lors de la modification du statut:', error)
  }
}

const deleteResource = (resource) => {
  resourceToDelete.value = resource
  deleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    const { error } = await supabase
      .from('pev_resources')
      .delete()
      .eq('id', resourceToDelete.value.id)

    if (error) throw error

    const index = resources.value.findIndex(r => r.id === resourceToDelete.value.id)
    if (index !== -1) {
      resources.value.splice(index, 1)
    }

    deleteDialog.value = false
    resourceToDelete.value = null
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

const exportResources = () => {
  const csvContent = "data:text/csv;charset=utf-8," 
    + "Titre,Type,Catégorie,Niveau,Format,Statut,Téléchargements\n"
    + resources.value.map(resource => 
        `"${resource.title}","${resource.type}","${resource.category}","${resource.level}","${resource.format}","${resource.status}","${resource.download_count || 0}"`
      ).join("\n")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `ressources_peva_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Utilitaires
const getTypeColor = (type) => {
  const colors = {
    guide: 'blue',
    report: 'green',
    tool: 'purple',
    training: 'orange',
    case_study: 'teal',
    template: 'red'
  }
  return colors[type] || 'grey'
}

const getTypeLabel = (type) => {
  const labels = {
    guide: 'Guide',
    report: 'Rapport',
    tool: 'Outil',
    training: 'Formation',
    case_study: 'Étude de cas',
    template: 'Modèle'
  }
  return labels[type] || type
}

const getLevelColor = (level) => {
  const colors = {
    beginner: 'green',
    intermediate: 'blue',
    advanced: 'orange',
    expert: 'red'
  }
  return colors[level] || 'grey'
}

const getLevelLabel = (level) => {
  const labels = {
    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
    expert: 'Expert'
  }
  return labels[level] || level
}

const getFormatColor = (format) => {
  const colors = {
    pdf: 'red',
    video: 'blue',
    audio: 'green',
    presentation: 'orange',
    document: 'purple',
    link: 'teal'
  }
  return colors[format] || 'grey'
}

const getFormatIcon = (format) => {
  const icons = {
    pdf: 'mdi-file-pdf-box',
    video: 'mdi-video',
    audio: 'mdi-music',
    presentation: 'mdi-presentation',
    document: 'mdi-file-document',
    link: 'mdi-link'
  }
  return icons[format] || 'mdi-file'
}

const getFormatLabel = (format) => {
  const labels = {
    pdf: 'PDF',
    video: 'Vidéo',
    audio: 'Audio',
    presentation: 'Présentation',
    document: 'Document',
    link: 'Lien'
  }
  return labels[format] || format
}

const getStatusColor = (status) => {
  const colors = {
    draft: 'grey',
    review: 'orange',
    published: 'green',
    archived: 'blue'
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = {
    draft: 'Brouillon',
    review: 'En révision',
    published: 'Publié',
    archived: 'Archivé'
  }
  return labels[status] || status
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

// Lifecycle
onMounted(() => {
  loadResources()
})
</script>

<style scoped>
.admin-resources-manager {
  min-height: 100vh;
}
</style>
