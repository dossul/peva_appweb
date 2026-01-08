<template>
  <div class="moderation-tab pa-4">
    <!-- Actions en masse -->
    <div class="d-flex align-center justify-space-between mb-4">
      <div class="d-flex align-center ga-2">
        <v-checkbox
          v-model="selectAll"
          @update:model-value="toggleSelectAll"
          :indeterminate="selectedItems.length > 0 && selectedItems.length < items.length"
          hide-details
        />
        <span class="text-body-2">
          {{ selectedItems.length > 0 ? `${selectedItems.length} sélectionné(s)` : 'Tout sélectionner' }}
        </span>
        
        <v-btn
          v-if="selectedItems.length > 0"
          color="success"
          size="small"
          variant="tonal"
          @click="bulkApprove"
          :loading="loading"
        >
          <v-icon class="mr-1">mdi-check</v-icon>
          Approuver ({{ selectedItems.length }})
        </v-btn>
        
        <v-btn
          v-if="selectedItems.length > 0"
          color="error"
          size="small"
          variant="tonal"
          @click="bulkReject"
          :loading="loading"
        >
          <v-icon class="mr-1">mdi-close</v-icon>
          Rejeter ({{ selectedItems.length }})
        </v-btn>
      </div>
      
      <div class="d-flex align-center ga-2">
        <v-chip size="small" color="primary">
          {{ pagination.total }} éléments
        </v-chip>
        <v-btn
          icon="mdi-refresh"
          size="small"
          @click="loadContent"
          :loading="loading"
        />
      </div>
    </div>

    <!-- Liste du contenu -->
    <div v-if="items.length > 0">
      <v-card
        v-for="item in items"
        :key="item.id"
        class="mb-3"
        elevation="1"
        :class="{ 'selected-item': selectedItems.includes(item.id) }"
      >
        <v-card-text class="pa-4">
          <div class="d-flex">
            <!-- Checkbox de sélection -->
            <v-checkbox
              :model-value="selectedItems.includes(item.id)"
              @update:model-value="toggleItem(item.id)"
              hide-details
              class="mr-3"
            />
            
            <!-- Avatar/Image -->
            <div class="mr-4">
              <v-avatar size="60" rounded="lg">
                <v-img 
                  v-if="getItemImage(item)" 
                  :src="getItemImage(item)"
                  :alt="getItemTitle(item)"
                />
                <v-icon v-else :color="getContentTypeColor(contentType)" size="32">
                  {{ getContentTypeIcon(contentType) }}
                </v-icon>
              </v-avatar>
            </div>
            
            <!-- Contenu principal -->
            <div class="flex-grow-1">
              <div class="d-flex align-center justify-space-between mb-2">
                <h3 class="text-h6 font-weight-bold">{{ getItemTitle(item) }}</h3>
                <div class="d-flex align-center ga-2">
                  <v-chip
                    :color="getStatusColor(item)"
                    size="small"
                    variant="flat"
                  >
                    {{ getStatusLabel(item) }}
                  </v-chip>
                  <v-chip
                    :color="getContentTypeColor(contentType)"
                    size="small"
                    variant="outlined"
                  >
                    {{ getContentTypeLabel(contentType) }}
                  </v-chip>
                </div>
              </div>
              
              <p class="text-body-2 text-grey-darken-1 mb-3">
                {{ getItemDescription(item) }}
              </p>
              
              <!-- Métadonnées -->
              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center ga-4">
                  <div class="d-flex align-center">
                    <v-avatar size="24" class="mr-2">
                      <v-img 
                        v-if="getAuthorAvatar(item)" 
                        :src="getAuthorAvatar(item)"
                      />
                      <v-icon v-else size="16">mdi-account</v-icon>
                    </v-avatar>
                    <span class="text-body-2">{{ getAuthorName(item) }}</span>
                  </div>
                  
                  <div class="text-body-2 text-grey-darken-1">
                    <v-icon size="16" class="mr-1">mdi-clock</v-icon>
                    {{ formatDate(item.created_at) }}
                  </div>
                  
                  <div v-if="getItemLocation(item)" class="text-body-2 text-grey-darken-1">
                    <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
                    {{ getItemLocation(item) }}
                  </div>
                </div>
                
                <!-- Actions -->
                <div class="d-flex ga-1">
                  <v-btn
                    icon="mdi-eye"
                    size="small"
                    variant="text"
                    @click="$emit('view-details', contentType, item)"
                  />
                  <v-btn
                    icon="mdi-check"
                    size="small"
                    variant="text"
                    color="success"
                    @click="$emit('approve', contentType, item.id)"
                    :loading="loading"
                  />
                  <v-btn
                    icon="mdi-close"
                    size="small"
                    variant="text"
                    color="error"
                    @click="showRejectDialog(item)"
                  />
                  <v-btn
                    icon="mdi-delete"
                    size="small"
                    variant="text"
                    color="error"
                    @click="showDeleteDialog(item)"
                  />
                </div>
              </div>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
    
    <!-- État vide -->
    <div v-else-if="!loading" class="text-center py-8">
      <v-icon size="64" color="grey-lighten-1" class="mb-4">
        {{ getContentTypeIcon(contentType) }}
      </v-icon>
      <h3 class="text-h6 text-grey-darken-1 mb-2">Aucun contenu en attente</h3>
      <p class="text-body-2 text-grey-darken-1">
        Tous les {{ getContentTypeLabel(contentType).toLowerCase() }} ont été modérés.
      </p>
    </div>
    
    <!-- Loading -->
    <div v-if="loading" class="text-center py-8">
      <v-progress-circular indeterminate color="primary" size="48" />
      <p class="text-body-2 text-grey-darken-1 mt-4">Chargement...</p>
    </div>

    <!-- Pagination -->
    <div v-if="pagination.totalPages > 1" class="d-flex justify-center mt-6">
      <v-pagination
        v-model="pagination.page"
        :length="pagination.totalPages"
        @update:model-value="onPageChange"
        :disabled="loading"
      />
    </div>

    <!-- Dialog de rejet individuel -->
    <v-dialog v-model="rejectDialog" max-width="500">
      <v-card v-if="itemToReject">
        <v-card-title>Rejeter le contenu</v-card-title>
        <v-card-text>
          <p class="mb-4">
            <strong>{{ getItemTitle(itemToReject) }}</strong>
          </p>
          <v-textarea
            v-model="rejectReason"
            label="Raison du rejet"
            placeholder="Expliquez pourquoi ce contenu est rejeté..."
            variant="outlined"
            rows="4"
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="rejectDialog = false">Annuler</v-btn>
          <v-btn 
            color="error" 
            @click="confirmReject"
            :loading="loading"
            :disabled="!rejectReason.trim()"
          >
            Confirmer le rejet
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de suppression individuel -->
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card v-if="itemToDelete">
        <v-card-title class="text-error">
          <v-icon class="mr-2">mdi-alert</v-icon>
          Supprimer définitivement
        </v-card-title>
        <v-card-text>
          <p class="mb-3">
            <strong>{{ getItemTitle(itemToDelete) }}</strong>
          </p>
          <v-alert v-if="contentType === 'events'" type="warning" density="compact" class="mb-3">
            Les participants seront notifiés par email.
          </v-alert>
          <v-alert v-if="contentType === 'opportunities'" type="warning" density="compact" class="mb-3">
            Les candidats seront notifiés par email.
          </v-alert>
          <v-textarea
            v-model="deleteReason"
            label="Raison de la suppression"
            variant="outlined"
            rows="2"
            placeholder="Ex: Contenu inapproprié..."
          />
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

    <!-- Dialog de rejet en masse -->
    <v-dialog v-model="bulkRejectDialog" max-width="500">
      <v-card>
        <v-card-title>Rejeter {{ selectedItems.length }} éléments</v-card-title>
        <v-card-text>
          <p class="mb-4">
            Vous êtes sur le point de rejeter {{ selectedItems.length }} éléments sélectionnés.
          </p>
          <v-textarea
            v-model="bulkRejectReason"
            label="Raison du rejet"
            placeholder="Expliquez pourquoi ces contenus sont rejetés..."
            variant="outlined"
            rows="4"
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="bulkRejectDialog = false">Annuler</v-btn>
          <v-btn 
            color="error" 
            @click="confirmBulkReject"
            :loading="loading"
            :disabled="!bulkRejectReason.trim()"
          >
            Rejeter {{ selectedItems.length }} éléments
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { moderationService } from '@/services/admin/moderationService'

const props = defineProps({
  contentType: {
    type: String,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['approve', 'reject', 'delete', 'view-details', 'bulk-action'])

// État réactif
const items = ref([])
const selectedItems = ref([])
const selectAll = ref(false)
const loading = ref(false)

const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
})

// Dialogs
const rejectDialog = ref(false)
const bulkRejectDialog = ref(false)
const deleteDialog = ref(false)
const itemToReject = ref(null)
const itemToDelete = ref(null)
const rejectReason = ref('')
const bulkRejectReason = ref('')
const deleteReason = ref('')
const deleting = ref(false)

// Méthodes
const loadContent = async () => {
  loading.value = true
  try {
    const result = await moderationService.getPendingContent(props.contentType, {
      page: pagination.value.page,
      limit: pagination.value.limit
    })
    
    if (result.success) {
      items.value = result.data
      pagination.value = result.pagination
    }
  } catch (error) {
    console.error('Erreur lors du chargement:', error)
  } finally {
    loading.value = false
  }
}

const toggleSelectAll = (value) => {
  if (value) {
    selectedItems.value = items.value.map(item => item.id)
  } else {
    selectedItems.value = []
  }
}

const toggleItem = (itemId) => {
  const index = selectedItems.value.indexOf(itemId)
  if (index > -1) {
    selectedItems.value.splice(index, 1)
  } else {
    selectedItems.value.push(itemId)
  }
}

const bulkApprove = () => {
  emit('bulk-action', props.contentType, selectedItems.value, 'approve')
  selectedItems.value = []
  selectAll.value = false
}

const bulkReject = () => {
  bulkRejectDialog.value = true
  bulkRejectReason.value = ''
}

const confirmBulkReject = () => {
  emit('bulk-action', props.contentType, selectedItems.value, 'reject', bulkRejectReason.value)
  selectedItems.value = []
  selectAll.value = false
  bulkRejectDialog.value = false
}

const showRejectDialog = (item) => {
  itemToReject.value = item
  rejectReason.value = ''
  rejectDialog.value = true
}

const confirmReject = () => {
  if (itemToReject.value && rejectReason.value.trim()) {
    emit('reject', props.contentType, itemToReject.value.id, rejectReason.value)
    rejectDialog.value = false
  }
}

const showDeleteDialog = (item) => {
  itemToDelete.value = item
  deleteReason.value = ''
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (!itemToDelete.value) return
  
  deleting.value = true
  try {
    const result = await moderationService.deleteContent(
      props.contentType,
      itemToDelete.value.id,
      deleteReason.value || 'Supprimé par l\'administrateur'
    )
    
    if (result.success) {
      items.value = items.value.filter(i => i.id !== itemToDelete.value.id)
      emit('delete', props.contentType, itemToDelete.value.id, result.notifiedCount)
    }
  } catch (error) {
    console.error('Erreur suppression:', error)
  } finally {
    deleting.value = false
    deleteDialog.value = false
    itemToDelete.value = null
  }
}

const onPageChange = (page) => {
  pagination.value.page = page
  loadContent()
}

// Utilitaires pour différents types de contenu
const getItemTitle = (item) => {
  return item.title || item.name || 'Sans titre'
}

const getItemDescription = (item) => {
  const desc = item.description || item.mission || item.content || ''
  return desc.length > 150 ? desc.substring(0, 150) + '...' : desc
}

const getItemImage = (item) => {
  return item.image_url || item.cover_image_url || item.logo_url || item.avatar_url || null
}

const getItemLocation = (item) => {
  if (item.location) return item.location
  if (item.country && item.city) return `${item.city}, ${item.country}`
  if (item.country) return item.country
  return null
}

const getAuthorName = (item) => {
  const profile = item.pev_profiles || item.profiles || item.profile
  if (profile) {
    return profile.display_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email
  }
  return 'Utilisateur inconnu'
}

const getAuthorAvatar = (item) => {
  const profile = item.pev_profiles || item.profiles || item.profile
  return profile?.avatar_url || null
}

const getStatusLabel = (item) => {
  const status = item.moderation_status || item.status
  const labels = {
    pending: 'En attente',
    in_review: 'En révision',
    approved: 'Approuvé',
    published: 'Publié',
    rejected: 'Rejeté',
    draft: 'Brouillon'
  }
  return labels[status] || status
}

const getStatusColor = (item) => {
  const status = item.moderation_status || item.status
  const colors = {
    pending: 'warning',
    in_review: 'info',
    approved: 'success',
    published: 'success',
    rejected: 'error',
    draft: 'grey'
  }
  return colors[status] || 'grey'
}

const getContentTypeLabel = (type) => {
  const labels = {
    opportunities: 'Opportunités',
    resources: 'Ressources',
    events: 'Événements',
    companies: 'Entreprises',
    forum_topics: 'Sujets Forum',
    forum_posts: 'Posts Forum'
  }
  return labels[type] || type
}

const getContentTypeIcon = (type) => {
  const icons = {
    opportunities: 'mdi-briefcase',
    resources: 'mdi-file-document',
    events: 'mdi-calendar',
    companies: 'mdi-domain',
    forum_topics: 'mdi-forum',
    forum_posts: 'mdi-message'
  }
  return icons[type] || 'mdi-file'
}

const getContentTypeColor = (type) => {
  const colors = {
    opportunities: 'orange',
    resources: 'green',
    events: 'blue',
    companies: 'purple',
    forum_topics: 'teal',
    forum_posts: 'teal'
  }
  return colors[type] || 'grey'
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// Watchers
watch(() => selectedItems.value.length, (newLength) => {
  if (newLength === 0) {
    selectAll.value = false
  } else if (newLength === items.value.length) {
    selectAll.value = true
  }
})

// Initialisation
onMounted(() => {
  loadContent()
})

// Recharger quand le type de contenu change
watch(() => props.contentType, () => {
  selectedItems.value = []
  selectAll.value = false
  pagination.value.page = 1
  loadContent()
})
</script>

<style scoped>
.moderation-tab {
  min-height: 400px;
}

.selected-item {
  border: 2px solid #1976d2 !important;
  background-color: #e3f2fd;
}

.v-card {
  transition: all 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15) !important;
}
</style>
