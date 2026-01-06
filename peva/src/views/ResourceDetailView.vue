<template>
  <div class="resource-detail-view">
    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-center align-center" style="min-height: 400px;">
      <v-progress-circular indeterminate color="green" size="64" />
    </div>

    <!-- Error -->
    <v-container v-else-if="error" class="py-8">
      <v-alert type="error" variant="tonal">
        {{ error }}
      </v-alert>
      <v-btn color="green" class="mt-4" @click="router.push('/resources')">
        Retour aux ressources
      </v-btn>
    </v-container>

    <!-- Content -->
    <template v-else-if="resource">
      <!-- Hero Banner -->
      <div class="hero-banner bg-green-darken-2 text-white py-8">
        <v-container>
          <v-btn 
            variant="text" 
            color="white" 
            prepend-icon="mdi-arrow-left"
            @click="router.push('/resources')"
            class="mb-4"
          >
            Retour aux ressources
          </v-btn>
          
          <div class="d-flex align-center">
            <v-chip :color="getTypeColor(resource.type)" class="mr-3" size="large">
              {{ resource.type }}
            </v-chip>
            <v-chip v-if="resource.is_free" color="success" variant="flat" size="small">
              <v-icon start size="small">mdi-gift</v-icon>
              Gratuit
            </v-chip>
          </div>
          
          <h1 class="text-h3 font-weight-bold mt-4 mb-2">{{ resource.title }}</h1>
          
          <div class="d-flex align-center text-body-1 mt-4">
            <v-icon class="mr-2">mdi-account</v-icon>
            <span>{{ getAuthorName(resource) }}</span>
            <v-divider vertical class="mx-4" />
            <v-icon class="mr-2">mdi-calendar</v-icon>
            <span>{{ formatDate(resource.created_at) }}</span>
            <v-divider vertical class="mx-4" />
            <v-icon class="mr-2">mdi-eye</v-icon>
            <span>{{ resource.views_count || 0 }} vues</span>
          </div>
        </v-container>
      </div>

      <v-container class="py-8">
        <v-row>
          <!-- Main Content -->
          <v-col cols="12" md="8">
            <!-- Cover Image -->
            <v-card v-if="resource.cover_image_url" class="mb-6" elevation="2">
              <v-img 
                :src="resource.cover_image_url" 
                height="400" 
                cover
                class="rounded"
              />
            </v-card>

            <!-- Description -->
            <v-card class="mb-6" elevation="2">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-text</v-icon>
                Description
              </v-card-title>
              <v-card-text class="pa-4 pt-0">
                <p class="text-body-1" style="white-space: pre-line;">{{ resource.description || 'Aucune description disponible.' }}</p>
              </v-card-text>
            </v-card>

            <!-- Tags -->
            <v-card v-if="resource.tags && resource.tags.length" class="mb-6" elevation="2">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-tag-multiple</v-icon>
                Tags
              </v-card-title>
              <v-card-text class="pa-4 pt-0">
                <v-chip-group>
                  <v-chip v-for="tag in resource.tags" :key="tag" size="small">
                    {{ tag }}
                  </v-chip>
                </v-chip-group>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Sidebar -->
          <v-col cols="12" md="4">
            <!-- Download Card -->
            <v-card class="mb-6" elevation="3">
              <v-card-title class="pa-4 bg-green-darken-2 text-white">
                <v-icon class="mr-2">mdi-download</v-icon>
                Télécharger
              </v-card-title>
              <v-card-text class="pa-4">
                <v-btn
                  v-if="resource.media_url"
                  color="green-darken-2"
                  variant="flat"
                  size="large"
                  block
                  prepend-icon="mdi-download"
                  @click="handleDownload"
                >
                  Télécharger le fichier
                </v-btn>
                <v-alert v-else type="info" variant="tonal" class="mt-2">
                  Aucun fichier disponible
                </v-alert>
                
                <v-divider class="my-4" />
                
                <div class="d-flex align-center justify-space-between mb-2">
                  <span class="text-body-2">Téléchargement</span>
                  <v-chip :color="resource.allow_download ? 'success' : 'error'" size="x-small">
                    {{ resource.allow_download ? 'Autorisé' : 'Non autorisé' }}
                  </v-chip>
                </div>
                <div class="d-flex align-center justify-space-between">
                  <span class="text-body-2">Partage</span>
                  <v-chip :color="resource.allow_sharing ? 'success' : 'error'" size="x-small">
                    {{ resource.allow_sharing ? 'Autorisé' : 'Non autorisé' }}
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>

            <!-- Details Card -->
            <v-card elevation="2">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-information</v-icon>
                Détails
              </v-card-title>
              <v-card-text class="pa-4 pt-0">
                <v-list density="compact">
                  <v-list-item v-if="resource.type">
                    <template #prepend>
                      <v-icon>mdi-file-document</v-icon>
                    </template>
                    <v-list-item-title>Type</v-list-item-title>
                    <v-list-item-subtitle>{{ resource.type }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item v-if="resource.language">
                    <template #prepend>
                      <v-icon>mdi-translate</v-icon>
                    </template>
                    <v-list-item-title>Langue</v-list-item-title>
                    <v-list-item-subtitle>{{ resource.language }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item v-if="resource.difficulty_level">
                    <template #prepend>
                      <v-icon>mdi-signal</v-icon>
                    </template>
                    <v-list-item-title>Niveau</v-list-item-title>
                    <v-list-item-subtitle>{{ resource.difficulty_level }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item v-if="resource.sectors && resource.sectors.length">
                    <template #prepend>
                      <v-icon>mdi-folder</v-icon>
                    </template>
                    <v-list-item-title>Secteurs</v-list-item-title>
                    <v-list-item-subtitle>{{ resource.sectors.join(', ') }}</v-list-item-subtitle>
                  </v-list-item>
                  
                  <v-list-item v-if="resource.source">
                    <template #prepend>
                      <v-icon>mdi-link</v-icon>
                    </template>
                    <v-list-item-title>Lien externe</v-list-item-title>
                    <v-list-item-subtitle>
                      <a :href="resource.source" target="_blank">{{ resource.source }}</a>
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { resourcesService } from '@/services/resourcesService'

const route = useRoute()
const router = useRouter()

const resource = ref(null)
const loading = ref(true)
const error = ref(null)

const loadResource = async () => {
  try {
    loading.value = true
    error.value = null
    
    const resourceId = route.params.id
    if (!resourceId) {
      error.value = 'ID de ressource manquant'
      return
    }
    
    const result = await resourcesService.getResourceById(resourceId)
    
    if (result.success) {
      resource.value = result.data
    } else {
      error.value = result.error || 'Ressource non trouvée'
    }
  } catch (err) {
    console.error('Erreur chargement ressource:', err)
    error.value = 'Erreur lors du chargement de la ressource'
  } finally {
    loading.value = false
  }
}

const getTypeColor = (type) => {
  const colors = {
    'guide': 'blue',
    'rapport': 'purple',
    'tool': 'orange',
    'formation': 'red',
    'template': 'teal',
    'video': 'pink'
  }
  return colors[type?.toLowerCase()] || 'grey'
}

const getAuthorName = (resource) => {
  const profile = resource.pev_profiles || resource.profiles || resource.profile
  if (profile) {
    return profile.display_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Auteur inconnu'
  }
  return 'Auteur inconnu'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Date inconnue'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const handleDownload = async () => {
  if (resource.value?.id) {
    await resourcesService.incrementDownloads(resource.value.id)
    // Ouvrir le fichier
    if (resource.value.media_url) {
      window.open(resource.value.media_url, '_blank')
    }
  }
}

onMounted(() => {
  loadResource()
})
</script>

<style scoped>
.resource-detail-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.hero-banner {
  background: linear-gradient(135deg, #2e7d32 0%, #388e3c 100%);
}
</style>
