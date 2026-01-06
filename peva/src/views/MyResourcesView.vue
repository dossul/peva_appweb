<template>
  <v-container class="py-8">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Mes Ressources</h1>
        <p class="text-grey-darken-1">Gérez vos brouillons et ressources publiées</p>
      </div>
      <v-btn
        color="teal-darken-2"
        prepend-icon="mdi-plus"
        to="/resources/submit"
      >
        Nouvelle ressource
      </v-btn>
    </div>

    <!-- Tabs pour filtrer par statut -->
    <v-tabs v-model="activeTab" color="teal-darken-2" class="mb-6">
      <v-tab value="all">
        <v-icon start>mdi-view-list</v-icon>
        Toutes ({{ resources.length }})
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
        Publiées ({{ published.length }})
      </v-tab>
    </v-tabs>

    <!-- Loading -->
    <v-progress-linear v-if="loading" indeterminate color="teal-darken-2" class="mb-4" />

    <!-- Liste vide -->
    <v-card v-if="!loading && filteredResources.length === 0" class="pa-8 text-center">
      <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-file-document-outline</v-icon>
      <h3 class="text-h6 mb-2">Aucune ressource</h3>
      <p class="text-grey-darken-1 mb-4">
        {{ activeTab === 'draft' ? 'Vous n\'avez pas de brouillon en cours.' : 'Commencez par partager votre première ressource.' }}
      </p>
      <v-btn color="teal-darken-2" to="/resources/submit">
        Partager une ressource
      </v-btn>
    </v-card>

    <!-- Liste des ressources -->
    <v-row v-else>
      <v-col
        v-for="resource in filteredResources"
        :key="resource.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="h-100" :class="{ 'border-warning': resource.status === 'draft' }">
          <!-- Status badge -->
          <div class="pa-3 pb-0">
            <v-chip
              :color="getStatusColor(resource.status)"
              size="small"
              label
            >
              <v-icon start size="small">{{ getStatusIcon(resource.status) }}</v-icon>
              {{ getStatusLabel(resource.status) }}
            </v-chip>
            <v-chip
              v-if="resource.is_free"
              color="success"
              size="small"
              label
              class="ml-2"
            >
              <v-icon start size="small">mdi-gift</v-icon>
              Gratuit
            </v-chip>
          </div>

          <v-card-title class="text-h6">
            {{ resource.title || 'Sans titre' }}
          </v-card-title>

          <v-card-subtitle>
            <v-icon size="small" class="mr-1">mdi-tag</v-icon>
            {{ getTypeLabel(resource.type) || 'Non défini' }}
            <span v-if="resource.sectors && resource.sectors.length > 0" class="ml-3">
              <v-icon size="small" class="mr-1">mdi-folder</v-icon>
              {{ resource.sectors[0] }}
            </span>
          </v-card-subtitle>

          <v-card-text>
            <p class="text-body-2 text-grey-darken-1 mb-2" style="min-height: 40px;">
              {{ truncateText(resource.description, 100) }}
            </p>
            
            <!-- Dates -->
            <div class="d-flex flex-wrap ga-2 text-caption text-grey">
              <span>
                <v-icon size="x-small">mdi-update</v-icon>
                Modifié: {{ formatDate(resource.updated_at) }}
              </span>
            </div>

            <!-- Tags -->
            <div v-if="resource.tags && resource.tags.length > 0" class="mt-2">
              <v-chip 
                v-for="tag in resource.tags.slice(0, 3)" 
                :key="tag" 
                size="x-small" 
                color="blue-grey" 
                variant="tonal"
                class="mr-1"
              >
                {{ tag }}
              </v-chip>
            </div>

            <!-- Fichier joint -->
            <div v-if="resource.media_url" class="mt-2">
              <v-chip size="x-small" color="info" variant="tonal">
                <v-icon start size="x-small">mdi-paperclip</v-icon>
                Fichier joint
              </v-chip>
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <!-- Brouillon: Continuer / Supprimer -->
            <template v-if="resource.status === 'draft'">
              <v-btn
                color="teal-darken-2"
                variant="text"
                :to="`/resources/edit/${resource.id}`"
              >
                <v-icon start>mdi-pencil</v-icon>
                Continuer
              </v-btn>
              <v-spacer />
              <v-btn
                color="error"
                variant="text"
                @click="confirmDelete(resource)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>

            <!-- En attente de modération: Voir -->
            <template v-else-if="resource.status === 'in_review'">
              <v-btn
                color="teal-darken-2"
                variant="text"
                @click="viewDetails(resource)"
              >
                <v-icon start>mdi-eye</v-icon>
                Voir
              </v-btn>
              <v-spacer />
              <v-chip size="small" color="orange" variant="tonal">
                En modération
              </v-chip>
            </template>

            <!-- Publiée: Voir / Stats -->
            <template v-else>
              <v-btn
                color="teal-darken-2"
                variant="text"
                @click="viewDetails(resource)"
              >
                <v-icon start>mdi-eye</v-icon>
                Voir
              </v-btn>
              <v-spacer />
              <span class="text-caption text-grey">
                <v-icon size="small">mdi-eye</v-icon>
                {{ resource.views_count || 0 }}
                <v-icon size="small" class="ml-2">mdi-download</v-icon>
                {{ resource.downloads_count || 0 }}
              </span>
            </template>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog de confirmation de suppression -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon color="error" class="mr-2">mdi-alert</v-icon>
          Supprimer ce brouillon ?
        </v-card-title>
        <v-card-text>
          Cette action est irréversible. Le brouillon "{{ resourceToDelete?.title }}" sera définitivement supprimé.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="error" variant="flat" @click="deleteDraft" :loading="deleting">
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de détails -->
    <v-dialog v-model="detailsDialog" max-width="700">
      <v-card v-if="selectedResource">
        <v-card-title class="d-flex align-center">
          {{ selectedResource.title }}
          <v-spacer />
          <v-btn icon variant="text" @click="detailsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <v-chip :color="getStatusColor(selectedResource.status)" size="small" class="mb-4">
            {{ getStatusLabel(selectedResource.status) }}
          </v-chip>

          <h4 class="mb-2">Description</h4>
          <p class="text-body-2 mb-4">{{ selectedResource.description || 'Aucune description' }}</p>

          <v-row>
            <v-col cols="6">
              <strong>Type:</strong> {{ getTypeLabel(selectedResource.type) }}
            </v-col>
            <v-col cols="6">
              <strong>Langue:</strong> {{ selectedResource.language || 'Non spécifié' }}
            </v-col>
            <v-col cols="6" v-if="selectedResource.difficulty_level">
              <strong>Niveau:</strong> {{ selectedResource.difficulty_level }}
            </v-col>
            <v-col cols="6">
              <strong>Gratuit:</strong> {{ selectedResource.is_free ? 'Oui' : 'Non' }}
            </v-col>
            <v-col cols="6">
              <strong>Téléchargement:</strong> {{ selectedResource.allow_download ? 'Autorisé' : 'Non autorisé' }}
            </v-col>
            <v-col cols="6">
              <strong>Partage:</strong> {{ selectedResource.allow_sharing ? 'Autorisé' : 'Non autorisé' }}
            </v-col>
          </v-row>

          <!-- Secteurs -->
          <div v-if="selectedResource.sectors && selectedResource.sectors.length > 0" class="mt-4">
            <h4 class="mb-2">Secteurs</h4>
            <v-chip v-for="sector in selectedResource.sectors" :key="sector" size="small" class="mr-1 mb-1">{{ sector }}</v-chip>
          </div>

          <!-- Tags -->
          <div v-if="selectedResource.tags && selectedResource.tags.length > 0" class="mt-4">
            <h4 class="mb-2">Tags</h4>
            <v-chip v-for="tag in selectedResource.tags" :key="tag" size="small" color="blue-grey" variant="tonal" class="mr-1 mb-1">{{ tag }}</v-chip>
          </div>

          <!-- Fichier joint -->
          <div v-if="selectedResource.media_url" class="mt-4">
            <h4 class="mb-2">Fichier</h4>
            <v-btn
              :href="selectedResource.media_url"
              target="_blank"
              color="teal-darken-2"
              variant="outlined"
              prepend-icon="mdi-download"
            >
              Télécharger le fichier
            </v-btn>
          </div>

          <!-- Lien externe -->
          <div v-if="selectedResource.source" class="mt-4">
            <h4 class="mb-2">Lien externe</h4>
            <v-btn
              :href="selectedResource.source"
              target="_blank"
              color="primary"
              variant="outlined"
              prepend-icon="mdi-open-in-new"
            >
              Ouvrir le lien
            </v-btn>
          </div>

          <!-- Statistiques -->
          <div class="mt-4">
            <h4 class="mb-2">Statistiques</h4>
            <v-row>
              <v-col cols="6">
                <v-card variant="tonal" class="pa-3 text-center">
                  <v-icon size="24" color="primary">mdi-eye</v-icon>
                  <div class="text-h6">{{ selectedResource.views_count || 0 }}</div>
                  <div class="text-caption">Vues</div>
                </v-card>
              </v-col>
              <v-col cols="6">
                <v-card variant="tonal" class="pa-3 text-center">
                  <v-icon size="24" color="success">mdi-download</v-icon>
                  <div class="text-h6">{{ selectedResource.downloads_count || 0 }}</div>
                  <div class="text-caption">Téléchargements</div>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-card-text>
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
import { resourcesService } from '@/services/resourcesService'

const authStore = useAuthStore()

// State
const loading = ref(true)
const resources = ref([])
const activeTab = ref('all')
const deleteDialog = ref(false)
const detailsDialog = ref(false)
const resourceToDelete = ref(null)
const selectedResource = ref(null)
const deleting = ref(false)
const snackbar = ref({ show: false, message: '', color: 'success' })

// Computed
const drafts = computed(() => resources.value.filter(r => r.status === 'draft'))
const inReview = computed(() => resources.value.filter(r => r.status === 'in_review'))
const published = computed(() => resources.value.filter(r => r.status === 'published'))

const filteredResources = computed(() => {
  switch (activeTab.value) {
    case 'draft': return drafts.value
    case 'in_review': return inReview.value
    case 'published': return published.value
    default: return resources.value
  }
})

// Methods
const loadResources = async () => {
  loading.value = true
  try {
    const result = await resourcesService.getUserResources(authStore.user?.id)
    if (result.success) {
      resources.value = result.data
    }
  } catch (error) {
    console.error('Erreur chargement:', error)
    showMessage('Erreur lors du chargement', 'error')
  } finally {
    loading.value = false
  }
}

const confirmDelete = (resource) => {
  resourceToDelete.value = resource
  deleteDialog.value = true
}

const deleteDraft = async () => {
  if (!resourceToDelete.value) return
  
  deleting.value = true
  try {
    const result = await resourcesService.deleteDraft(
      resourceToDelete.value.id,
      authStore.user?.id
    )
    
    if (result.success) {
      resources.value = resources.value.filter(r => r.id !== resourceToDelete.value.id)
      showMessage('Brouillon supprimé', 'success')
    } else {
      showMessage('Erreur: ' + result.error, 'error')
    }
  } catch (error) {
    showMessage('Erreur lors de la suppression', 'error')
  } finally {
    deleting.value = false
    deleteDialog.value = false
    resourceToDelete.value = null
  }
}

const viewDetails = (resource) => {
  selectedResource.value = resource
  detailsDialog.value = true
}

const showMessage = (message, color = 'success') => {
  snackbar.value = { show: true, message, color }
}

// Helpers
const getStatusColor = (status) => {
  const colors = {
    draft: 'grey',
    in_review: 'orange',
    published: 'success',
    rejected: 'error'
  }
  return colors[status] || 'grey'
}

const getStatusIcon = (status) => {
  const icons = {
    draft: 'mdi-file-edit',
    in_review: 'mdi-clock-outline',
    published: 'mdi-check-circle',
    rejected: 'mdi-close-circle'
  }
  return icons[status] || 'mdi-help-circle'
}

const getStatusLabel = (status) => {
  const labels = {
    draft: 'Brouillon',
    in_review: 'En modération',
    published: 'Publiée',
    rejected: 'Refusée'
  }
  return labels[status] || status
}

const getTypeLabel = (type) => {
  const labels = {
    guide: 'Guide pratique',
    report: 'Rapport / Étude',
    tool: 'Outil / Template',
    training: 'Formation / Cours',
    article: 'Article / Publication',
    video: 'Vidéo',
    infographic: 'Infographie',
    other: 'Autre'
  }
  return labels[type] || type
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const formatDate = (date) => {
  if (!date) return null
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

// Lifecycle
onMounted(() => {
  loadResources()
})
</script>

<style scoped>
.border-warning {
  border-left: 4px solid #FFC107 !important;
}
</style>
