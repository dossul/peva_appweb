<template>
  <div class="content-details">
    <!-- En-tête avec informations principales -->
    <div class="mb-6">
      <div class="d-flex align-center mb-4">
        <v-avatar size="80" class="mr-4" rounded="lg">
          <v-img 
            v-if="getContentImage()" 
            :src="getContentImage()"
            :alt="getContentTitle()"
          />
          <v-icon v-else :color="getContentTypeColor()" size="40">
            {{ getContentTypeIcon() }}
          </v-icon>
        </v-avatar>
        <div class="flex-grow-1">
          <h2 class="text-h5 font-weight-bold mb-2">{{ getContentTitle() }}</h2>
          <div class="d-flex align-center ga-2 mb-2">
            <v-chip
              :color="getContentTypeColor()"
              size="small"
              variant="flat"
            >
              {{ getContentTypeLabel() }}
            </v-chip>
            <v-chip
              :color="getStatusColor()"
              size="small"
              variant="outlined"
            >
              {{ getStatusLabel() }}
            </v-chip>
          </div>
          <div class="d-flex align-center text-body-2 text-grey-darken-1">
            <v-icon size="16" class="mr-1">mdi-clock</v-icon>
            Créé le {{ formatDate(content.created_at) }}
            <span v-if="content.updated_at !== content.created_at" class="ml-4">
              <v-icon size="16" class="mr-1">mdi-pencil</v-icon>
              Modifié le {{ formatDate(content.updated_at) }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Contenu principal -->
    <v-row>
      <v-col cols="12" md="8">
        <!-- Description/Contenu -->
        <div class="mb-6">
          <h3 class="text-h6 font-weight-bold mb-3">
            {{ contentType === 'companies' ? 'Description de l\'entreprise' : 'Description' }}
          </h3>
          <div class="content-text">
            {{ getContentDescription() }}
          </div>
        </div>

        <!-- Détails spécifiques par type -->
        <div v-if="contentType === 'opportunities'" class="mb-6">
          <h3 class="text-h6 font-weight-bold mb-3">Détails de l'opportunité</h3>
          <v-row>
            <v-col cols="6">
              <div class="detail-item">
                <strong>Type:</strong> {{ content.type }}
              </div>
              <div class="detail-item">
                <strong>Catégorie:</strong> {{ content.category || 'Non spécifiée' }}
              </div>
              <div class="detail-item">
                <strong>Localisation:</strong> {{ content.location || 'Non spécifiée' }}
              </div>
              <div class="detail-item">
                <strong>Pays:</strong> {{ content.country || 'Non spécifié' }}
              </div>
            </v-col>
            <v-col cols="6">
              <div class="detail-item">
                <strong>Télétravail:</strong> {{ content.is_remote ? 'Oui' : 'Non' }}
              </div>
              <div class="detail-item" v-if="content.salary_min || content.salary_max">
                <strong>Salaire:</strong> 
                {{ formatSalary(content.salary_min, content.salary_max, content.currency) }}
              </div>
              <div class="detail-item" v-if="content.deadline">
                <strong>Date limite:</strong> {{ formatDate(content.deadline) }}
              </div>
              <div class="detail-item">
                <strong>Vues:</strong> {{ content.views_count || 0 }}
              </div>
            </v-col>
          </v-row>
          
          <div v-if="content.requirements" class="mt-4">
            <h4 class="text-subtitle-1 font-weight-bold mb-2">Exigences</h4>
            <p>{{ content.requirements }}</p>
          </div>
        </div>

        <div v-else-if="contentType === 'events'" class="mb-6">
          <h3 class="text-h6 font-weight-bold mb-3">Détails de l'événement</h3>
          <v-row>
            <v-col cols="6">
              <div class="detail-item">
                <strong>Type:</strong> {{ content.type }}
              </div>
              <div class="detail-item">
                <strong>Date de début:</strong> {{ formatDate(content.start_at) }}
              </div>
              <div class="detail-item" v-if="content.end_at">
                <strong>Date de fin:</strong> {{ formatDate(content.end_at) }}
              </div>
              <div class="detail-item">
                <strong>Format:</strong> {{ content.is_online ? 'En ligne' : 'Présentiel' }}
              </div>
            </v-col>
            <v-col cols="6">
              <div class="detail-item" v-if="content.location">
                <strong>Lieu:</strong> {{ content.location }}
              </div>
              <div class="detail-item" v-if="content.capacity">
                <strong>Capacité:</strong> {{ content.capacity }} participants
              </div>
              <div class="detail-item" v-if="content.registration_url">
                <strong>Inscription:</strong> 
                <a :href="content.registration_url" target="_blank">Lien d'inscription</a>
              </div>
            </v-col>
          </v-row>
        </div>

        <div v-else-if="contentType === 'companies'" class="mb-6">
          <h3 class="text-h6 font-weight-bold mb-3">Informations de l'entreprise</h3>
          <v-row>
            <v-col cols="6">
              <div class="detail-item">
                <strong>Secteur:</strong> {{ content.industry || 'Non spécifié' }}
              </div>
              <div class="detail-item">
                <strong>Taille:</strong> {{ content.size || 'Non spécifiée' }}
              </div>
              <div class="detail-item" v-if="content.founded_year">
                <strong>Année de création:</strong> {{ content.founded_year }}
              </div>
              <div class="detail-item" v-if="content.employees">
                <strong>Employés:</strong> {{ content.employees }}
              </div>
            </v-col>
            <v-col cols="6">
              <div class="detail-item">
                <strong>Siège social:</strong> {{ content.headquarters || 'Non spécifié' }}
              </div>
              <div class="detail-item">
                <strong>Pays:</strong> {{ content.country || 'Non spécifié' }}
              </div>
              <div class="detail-item" v-if="content.website">
                <strong>Site web:</strong> 
                <a :href="content.website" target="_blank">{{ content.website }}</a>
              </div>
              <div class="detail-item" v-if="content.email">
                <strong>Email:</strong> {{ content.email }}
              </div>
            </v-col>
          </v-row>
          
          <div v-if="content.mission" class="mt-4">
            <h4 class="text-subtitle-1 font-weight-bold mb-2">Mission</h4>
            <p>{{ content.mission }}</p>
          </div>
        </div>

        <div v-else-if="contentType === 'resources'" class="mb-6">
          <h3 class="text-h6 font-weight-bold mb-3">Détails de la ressource</h3>
          <v-row>
            <v-col cols="6">
              <div class="detail-item">
                <strong>Type:</strong> {{ content.type }}
              </div>
              <div class="detail-item" v-if="content.language">
                <strong>Langue:</strong> {{ content.language }}
              </div>
              <div class="detail-item" v-if="content.source">
                <strong>Source:</strong> {{ content.source }}
              </div>
            </v-col>
            <v-col cols="6">
              <div class="detail-item" v-if="content.media_url">
                <strong>URL média:</strong> 
                <a :href="content.media_url" target="_blank">Voir la ressource</a>
              </div>
            </v-col>
          </v-row>
          
          <div v-if="content.tags && content.tags.length" class="mt-4">
            <h4 class="text-subtitle-1 font-weight-bold mb-2">Tags</h4>
            <v-chip-group>
              <v-chip 
                v-for="tag in content.tags" 
                :key="tag"
                size="small"
              >
                {{ tag }}
              </v-chip>
            </v-chip-group>
          </div>
        </div>

        <!-- Pièces jointes -->
        <div v-if="hasAttachments()" class="mb-6">
          <h3 class="text-h6 font-weight-bold mb-3">Pièces jointes</h3>
          <v-list density="compact">
            <v-list-item
              v-for="attachment in getAttachments()"
              :key="attachment.filename || attachment.title"
              class="px-0"
            >
              <template v-slot:prepend>
                <v-icon>{{ getFileIcon(attachment) }}</v-icon>
              </template>
              <v-list-item-title>{{ attachment.title || attachment.filename }}</v-list-item-title>
              <v-list-item-subtitle v-if="attachment.size">
                {{ formatFileSize(attachment.size) }}
              </v-list-item-subtitle>
              <template v-slot:append>
                <v-btn
                  icon="mdi-download"
                  size="small"
                  variant="text"
                  @click="downloadAttachment(attachment)"
                />
              </template>
            </v-list-item>
          </v-list>
        </div>
      </v-col>

      <!-- Sidebar avec informations supplémentaires -->
      <v-col cols="12" md="4">
        <!-- Informations sur l'auteur -->
        <v-card class="mb-4" elevation="1">
          <v-card-title class="text-subtitle-1">Auteur</v-card-title>
          <v-card-text>
            <div class="d-flex align-center mb-3">
              <v-avatar size="40" class="mr-3">
                <v-img 
                  v-if="getAuthorAvatar()" 
                  :src="getAuthorAvatar()"
                />
                <v-icon v-else>mdi-account</v-icon>
              </v-avatar>
              <div>
                <div class="font-weight-medium">{{ getAuthorName() }}</div>
                <div class="text-caption text-grey-darken-1">{{ getAuthorEmail() }}</div>
              </div>
            </div>
            <div v-if="getAuthorOrganization()" class="text-body-2">
              <strong>Organisation:</strong> {{ getAuthorOrganization() }}
            </div>
          </v-card-text>
        </v-card>

        <!-- Informations de modération -->
        <v-card v-if="hasModerationInfo()" class="mb-4" elevation="1">
          <v-card-title class="text-subtitle-1">Modération</v-card-title>
          <v-card-text>
            <div v-if="content.moderation_status" class="mb-2">
              <strong>Statut:</strong> {{ getStatusLabel() }}
            </div>
            <div v-if="content.moderated_at" class="mb-2">
              <strong>Modéré le:</strong> {{ formatDate(content.moderated_at) }}
            </div>
            <div v-if="content.moderation_notes" class="mb-2">
              <strong>Notes:</strong> {{ content.moderation_notes }}
            </div>
          </v-card-text>
        </v-card>

        <!-- Historique de modération -->
        <v-card v-if="moderationHistory && moderationHistory.length" elevation="1">
          <v-card-title class="text-subtitle-1">Historique</v-card-title>
          <v-card-text>
            <v-timeline density="compact" side="end">
              <v-timeline-item
                v-for="entry in moderationHistory"
                :key="entry.id"
                :dot-color="getActionColor(entry.action)"
                size="small"
              >
                <div class="text-body-2">
                  <strong>{{ getActionLabel(entry.action) }}</strong>
                </div>
                <div class="text-caption text-grey-darken-1">
                  Par {{ getModeratorName(entry) }}
                </div>
                <div class="text-caption text-grey-darken-1">
                  {{ formatDate(entry.created_at) }}
                </div>
                <div v-if="entry.payload?.reason || entry.payload?.notes" class="text-caption mt-1">
                  {{ entry.payload.reason || entry.payload.notes }}
                </div>
              </v-timeline-item>
            </v-timeline>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  content: {
    type: Object,
    required: true
  },
  contentType: {
    type: String,
    required: true
  },
  moderationHistory: {
    type: Array,
    default: () => []
  }
})

// Méthodes utilitaires
const getContentTitle = () => {
  return props.content.title || props.content.name || 'Sans titre'
}

const getContentDescription = () => {
  return props.content.description || props.content.mission || props.content.content || 'Aucune description'
}

const getContentImage = () => {
  return props.content.cover_image_url || props.content.logo_url || props.content.avatar_url || null
}

const getContentTypeLabel = () => {
  const labels = {
    opportunities: 'Opportunité',
    resources: 'Ressource',
    events: 'Événement',
    companies: 'Entreprise',
    forum_topics: 'Sujet Forum',
    forum_posts: 'Post Forum'
  }
  return labels[props.contentType] || props.contentType
}

const getContentTypeIcon = () => {
  const icons = {
    opportunities: 'mdi-briefcase',
    resources: 'mdi-file-document',
    events: 'mdi-calendar',
    companies: 'mdi-domain',
    forum_topics: 'mdi-forum',
    forum_posts: 'mdi-message'
  }
  return icons[props.contentType] || 'mdi-file'
}

const getContentTypeColor = () => {
  const colors = {
    opportunities: 'orange',
    resources: 'green',
    events: 'blue',
    companies: 'purple',
    forum_topics: 'teal',
    forum_posts: 'teal'
  }
  return colors[props.contentType] || 'grey'
}

const getStatusLabel = () => {
  const status = props.content.moderation_status || props.content.status
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

const getStatusColor = () => {
  const status = props.content.moderation_status || props.content.status
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

const getAuthorName = () => {
  const profile = props.content.profiles || props.content.profile
  if (profile) {
    return profile.display_name || `${profile.first_name} ${profile.last_name}`
  }
  return 'Utilisateur inconnu'
}

const getAuthorEmail = () => {
  const profile = props.content.profiles || props.content.profile
  return profile?.email || ''
}

const getAuthorAvatar = () => {
  const profile = props.content.profiles || props.content.profile
  return profile?.avatar_url || null
}

const getAuthorOrganization = () => {
  const profile = props.content.profiles || props.content.profile
  return profile?.organization || ''
}

const hasModerationInfo = () => {
  return props.content.moderation_status || props.content.moderated_at || props.content.moderation_notes
}

const hasAttachments = () => {
  const attachments = getAttachments()
  return attachments && attachments.length > 0
}

const getAttachments = () => {
  return props.content.attachments || []
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

const formatSalary = (min, max, currency = 'EUR') => {
  if (min && max) {
    return `${min} - ${max} ${currency}`
  } else if (min) {
    return `À partir de ${min} ${currency}`
  } else if (max) {
    return `Jusqu'à ${max} ${currency}`
  }
  return 'Non spécifié'
}

const formatFileSize = (bytes) => {
  if (!bytes) return ''
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${sizes[i]}`
}

const getFileIcon = (attachment) => {
  const type = attachment.type || attachment.filename?.split('.').pop()?.toLowerCase()
  const icons = {
    pdf: 'mdi-file-pdf-box',
    doc: 'mdi-file-word-box',
    docx: 'mdi-file-word-box',
    xls: 'mdi-file-excel-box',
    xlsx: 'mdi-file-excel-box',
    ppt: 'mdi-file-powerpoint-box',
    pptx: 'mdi-file-powerpoint-box',
    jpg: 'mdi-file-image',
    jpeg: 'mdi-file-image',
    png: 'mdi-file-image',
    gif: 'mdi-file-image'
  }
  return icons[type] || 'mdi-file'
}

const downloadAttachment = (attachment) => {
  // Implémenter le téléchargement
  console.log('Télécharger:', attachment)
}

const getActionLabel = (action) => {
  const labels = {
    approve_opportunities: 'Opportunité approuvée',
    reject_opportunities: 'Opportunité rejetée',
    approve_resources: 'Ressource approuvée',
    reject_resources: 'Ressource rejetée',
    approve_events: 'Événement approuvé',
    reject_events: 'Événement rejeté',
    approve_companies: 'Entreprise approuvée',
    reject_companies: 'Entreprise rejetée'
  }
  return labels[action] || action
}

const getActionColor = (action) => {
  if (action.includes('approve')) return 'success'
  if (action.includes('reject')) return 'error'
  return 'info'
}

const getModeratorName = (entry) => {
  const profile = entry.profiles || entry.profile
  if (profile) {
    return profile.display_name || `${profile.first_name} ${profile.last_name}`
  }
  return 'Modérateur'
}
</script>

<style scoped>
.content-details {
  max-height: 80vh;
  overflow-y: auto;
}

.content-text {
  white-space: pre-wrap;
  line-height: 1.6;
}

.detail-item {
  margin-bottom: 8px;
  padding: 4px 0;
}

.detail-item strong {
  color: #424242;
  margin-right: 8px;
}

.v-card {
  border-radius: 8px !important;
}
</style>
