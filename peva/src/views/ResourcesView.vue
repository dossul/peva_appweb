<template>
  <div class="resources-view" data-testid="resources-page">
    <!-- Header Section avec bannière -->
    <div class="hero-banner bg-green-darken-2 text-white py-12">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div>
            <div class="d-flex align-center mb-4">
              <v-icon size="48" class="mr-4">mdi-library</v-icon>
              <div>
                <h1 class="text-h3 font-weight-bold mb-2">Bibliothèque de Ressources</h1>
                <p class="text-h6 font-weight-regular ma-0">Découvrez notre collection de guides, rapports, outils, tutoriels vidéo et formations pour l'économie verte</p>
              </div>
            </div>
          </div>
          <v-btn
            v-if="authStore.isAuthenticated"
            color="white"
            variant="flat"
            size="large"
            prepend-icon="mdi-plus"
            @click="$router.push('/resources/submit')"
            class="text-green-darken-2"
          >
            Proposer une Ressource
          </v-btn>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <!-- Statistiques des ressources (données réelles de la BDD) -->
      <v-row class="mb-8">
        <v-col cols="12" md="3">
          <v-card color="blue-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="32" class="mr-3">mdi-book-open</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">{{ stats.guides }}</div>
                <div class="text-body-2">Guides</div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="purple-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="32" class="mr-3">mdi-chart-line</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">{{ stats.rapports }}</div>
                <div class="text-body-2">Rapports</div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="orange-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="32" class="mr-3">mdi-tools</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">{{ stats.outils }}</div>
                <div class="text-body-2">Outils</div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="red-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="32" class="mr-3">mdi-school</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">{{ stats.formations }}</div>
                <div class="text-body-2">Formations</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filtres de recherche -->
      <v-card class="mb-6" elevation="2">
        <v-card-title class="pa-4">
          <v-icon class="mr-2">mdi-filter</v-icon>
          Filtrer les Ressources
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="3">
              <v-text-field
                v-model="searchQuery"
                placeholder="Mots-clés, titre, auteur..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                clearable
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedType"
                :items="resourceTypes"
                label="Tous les types"
                variant="outlined"
                density="compact"
                clearable
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedSector"
                :items="sectors"
                label="Tous secteurs"
                variant="outlined"
                density="compact"
                clearable
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedLevel"
                :items="levels"
                label="Tous niveaux"
                variant="outlined"
                density="compact"
                clearable
                hide-details
              />
            </v-col>
          </v-row>
          
          <v-row class="mt-4">
            <v-col cols="12" md="6">
              <div class="d-flex align-center ga-2">
                <v-checkbox v-model="filters.freeOnly" label="Gratuit uniquement" density="compact" hide-details />
                <v-checkbox v-model="filters.certifiedOnly" label="Certifié PEVA" density="compact" hide-details />
                <v-checkbox v-model="filters.newOnly" label="Nouveautés (30j)" density="compact" hide-details />
              </div>
            </v-col>
            <v-col cols="12" md="6" class="text-right">
              <v-btn color="grey" variant="outlined" @click="resetFilters" class="mr-2">
                Réinitialiser
              </v-btn>
              <v-btn color="green-darken-2" variant="flat" prepend-icon="mdi-filter">
                Filtrer
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Ressources Populaires -->
      <div class="mb-8">
        <div class="d-flex align-center justify-space-between mb-4">
          <h2 class="text-h5 font-weight-bold">Ressources Populaires</h2>
          <v-btn v-if="resources.length > 0" variant="text" color="green-darken-2">Voir toutes →</v-btn>
        </div>
        
        <!-- Message si aucune ressource -->
        <v-alert
          v-if="!loading && popularResources.length === 0"
          type="info"
          variant="tonal"
          class="mb-4"
        >
          <v-alert-title>Aucune ressource disponible</v-alert-title>
          La bibliothèque de ressources est actuellement vide. Soyez le premier à proposer une ressource !
        </v-alert>
        
        <v-row v-if="popularResources.length > 0">
          <v-col
            v-for="resource in popularResources"
            :key="resource.id"
            cols="12"
            md="4"
          >
            <v-card 
              class="resource-card h-100 cursor-pointer" 
              elevation="2" 
              hover
              @click="router.push(`/resources/${resource.id}`)"
            >
              <div class="position-relative">
                <v-img
                  :src="resource.cover_image_url || getDefaultCover(resource.type)"
                  height="160"
                  cover
                  :class="{ 'bg-grey-lighten-3': !resource.cover_image_url }"
                >
                  <div class="resource-overlay">
                    <v-chip
                      :color="getTypeColor(resource.type)"
                      size="small"
                      class="ma-2"
                    >
                      {{ resource.type }}
                    </v-chip>
                    <div class="rating-badge">
                      <v-icon size="16" color="yellow">mdi-star</v-icon>
                    </div>
                  </div>
                </v-img>
              </div>
              
              <v-card-text class="pa-4">
                <div class="d-flex align-center justify-space-between mb-2">
                  <v-chip size="small" :color="getTypeColor(resource.type)">
                    {{ resource.sectors?.[0] || resource.type }}
                  </v-chip>
                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-1">mdi-eye</v-icon>
                    <span class="text-caption">{{ resource.views_count || 0 }} vues</span>
                  </div>
                </div>
                
                <h3 class="text-h6 font-weight-bold mb-2">{{ resource.title }}</h3>
                <p class="text-body-2 text-grey-darken-1 mb-3">{{ truncateText(resource.description, 100) }}</p>
                
                <div class="d-flex align-center justify-space-between mb-3">
                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-1">mdi-download</v-icon>
                    <span class="text-caption">{{ resource.downloads_count || 0 }} téléch.</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-1">mdi-account</v-icon>
                    <span class="text-caption">{{ getAuthorName(resource) }}</span>
                  </div>
                </div>
              </v-card-text>
              
              <v-card-actions class="pa-4 pt-0" @click.stop>
                <v-btn
                  color="green-darken-2"
                  variant="flat"
                  size="small"
                  prepend-icon="mdi-eye"
                  @click="router.push(`/resources/${resource.id}`)"
                >
                  Consulter
                </v-btn>
                <v-btn
                  v-if="authStore.isAuthenticated && resource.created_by !== authStore.user?.id"
                  icon
                  size="x-small"
                  variant="text"
                  color="grey"
                  @click.stop="openReportDialog(resource)"
                >
                  <v-icon size="16">mdi-flag-outline</v-icon>
                  <v-tooltip activator="parent" location="top">Signaler</v-tooltip>
                </v-btn>
                <v-spacer />
                <v-btn
                  v-if="resource.media_url"
                  variant="outlined"
                  size="small"
                  prepend-icon="mdi-download"
                  @click.stop="handleDownload(resource)"
                >
                  {{ resource.is_free ? 'Gratuit' : 'Télécharger' }}
                </v-btn>
                <v-chip v-else size="small" color="success" variant="outlined">
                  <v-icon start size="small">mdi-download</v-icon>
                  Gratuit
                </v-chip>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- Sections par catégorie (données réelles) -->
      <div v-if="resources.length > 0" class="mb-8">
        <h2 class="text-h5 font-weight-bold mb-6">Explorer par Catégorie</h2>
        
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="category-section" elevation="2">
              <v-card-title class="pa-4 bg-blue-lighten-5">
                <v-icon class="mr-2" color="blue-darken-2">mdi-book-open</v-icon>
                Guides Pratiques
                <v-spacer />
                <span class="text-body-2">{{ stats.guides }} ressources</span>
              </v-card-title>
              <v-card-text class="pa-4">
                <p class="text-body-2 mb-3">Des guides étape par étape pour vous accompagner dans vos projets d'économie verte.</p>
              </v-card-text>
              <v-card-actions class="pa-4 pt-0">
                <v-btn color="blue-darken-2" variant="flat" size="small" block>
                  Explorer les guides →
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-card class="category-section" elevation="2">
              <v-card-title class="pa-4 bg-purple-lighten-5">
                <v-icon class="mr-2" color="purple-darken-2">mdi-chart-line</v-icon>
                Rapports & Études
                <v-spacer />
                <span class="text-body-2">{{ stats.rapports }} ressources</span>
              </v-card-title>
              <v-card-text class="pa-4">
                <p class="text-body-2 mb-3">Analyses de marché, études sectorielles et recherches sur l'économie verte en Afrique.</p>
              </v-card-text>
              <v-card-actions class="pa-4 pt-0">
                <v-btn color="purple-darken-2" variant="flat" size="small" block>
                  Consulter les rapports →
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
          
          <v-col cols="12" md="4">
            <v-card class="category-section" elevation="2">
              <v-card-title class="pa-4 bg-red-lighten-5">
                <v-icon class="mr-2" color="red-darken-2">mdi-school</v-icon>
                Formations
                <v-spacer />
                <span class="text-body-2">{{ stats.formations }} ressources</span>
              </v-card-title>
              <v-card-text class="pa-4">
                <p class="text-body-2 mb-3">Cours en ligne, webinaires et programmes de formation certifiés.</p>
              </v-card-text>
              <v-card-actions class="pa-4 pt-0">
                <v-btn color="red-darken-2" variant="flat" size="small" block>
                  Voir les formations →
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>

    <!-- Success Snackbar -->
    <!-- Dialog de signalement -->
    <ReportContentDialog
      v-model="reportDialog"
      target-type="resource"
      :target-id="resourceToReport?.id || ''"
      :content-title="resourceToReport?.title || ''"
      @reported="handleReported"
    />

    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="4000"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">
          Fermer
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { viewsService } from '@/services/viewsService'
import { resourcesService } from '@/services/resourcesService'
import ReportContentDialog from '@/components/ReportContentDialog.vue'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const searchQuery = ref('')
const selectedType = ref(null)
const selectedSector = ref(null)
const selectedLevel = ref(null)
const loading = ref(false)

// Signalement
const reportDialog = ref(false)
const resourceToReport = ref(null)
const resources = ref([])

const filters = ref({
  freeOnly: false,
  certifiedOnly: false,
  newOnly: false
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Statistiques calculées depuis les vraies données
const stats = computed(() => {
  const guides = resources.value.filter(r => r.type === 'guide' || r.type === 'Guide').length
  const rapports = resources.value.filter(r => r.type === 'rapport' || r.type === 'Rapport').length
  const outils = resources.value.filter(r => r.type === 'outil' || r.type === 'Outil').length
  const formations = resources.value.filter(r => r.type === 'formation' || r.type === 'Formation').length
  return { guides, rapports, outils, formations }
})

// Static data
const resourceTypes = [
  'Guide',
  'Rapport',
  'Outil',
  'Formation'
]

const sectors = [
  'Agriculture Durable',
  'Agroalimentaire',
  'Bilan carbone',
  'Construction Écologique',
  'Économie circulaire',
  'Éco-matériaux',
  'Écotourisme',
  'Énergies Renouvelables',
  'Gestion des Déchets',
  'RSE/ESG',
  'Transport Vert',
  'Valorisation des déchets',
  'Autres'
].sort((a, b) => {
  // Garder "Autres" à la fin
  if (a === 'Autres') return 1
  if (b === 'Autres') return -1
  return a.localeCompare(b, 'fr')
})

const levels = [
  'Débutant',
  'Intermédiaire',
  'Avancé',
  'Expert'
]

// Ressources populaires - chargées depuis la BDD
const popularResources = ref([])

// Methods
const resetFilters = () => {
  searchQuery.value = ''
  selectedType.value = null
  selectedSector.value = null
  selectedLevel.value = null
  filters.value = {
    freeOnly: false,
    certifiedOnly: false,
    newOnly: false
  }
}

const viewResource = (resource) => {
  router.push(`/resources/${resource.id}`)
}

const downloadResource = (resource) => {
  showMessage(`Téléchargement de "${resource.title}" démarré`, 'success')
}

const handleDownload = async (resource) => {
  // Incrémenter le compteur
  const result = await resourcesService.incrementDownloads(resource.id)
  if (result.success) {
    resource.downloads_count = (resource.downloads_count || 0) + 1
  }
  // Ouvrir le fichier
  if (resource.media_url) {
    window.open(resource.media_url, '_blank')
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

const getDefaultCover = (type) => {
  const colors = {
    'guide': '#1976D2',
    'rapport': '#7B1FA2',
    'tool': '#F57C00',
    'formation': '#D32F2F',
    'template': '#00897B',
    'video': '#C2185B'
  }
  const labels = {
    'guide': 'Guide',
    'rapport': 'Rapport',
    'tool': 'Outil',
    'formation': 'Formation',
    'template': 'Template',
    'video': 'Vidéo'
  }
  const color = colors[type?.toLowerCase()] || '#757575'
  const label = labels[type?.toLowerCase()] || 'Ressource'
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="400" height="200"><rect fill="${color}" width="400" height="200"/><text fill="white" font-family="Arial" font-size="24" x="200" y="110" text-anchor="middle">${label}</text></svg>`)}`
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const getAuthorName = (resource) => {
  const profile = resource.pev_profiles || resource.profiles || resource.profile
  if (profile) {
    return profile.display_name || `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Auteur'
  }
  return 'Auteur'
}

const showMessage = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  }
}

const openReportDialog = (resource) => {
  resourceToReport.value = resource
  reportDialog.value = true
}

const handleReported = () => {
  snackbar.value = { show: true, message: 'Signalement envoyé. Notre équipe l\'examinera rapidement.', color: 'success' }
}

// Charger les ressources depuis la BDD
const loadResources = async () => {
  try {
    loading.value = true
    const data = await viewsService.getResources()
    resources.value = data || []
    
    // Mettre à jour popularResources avec les vraies données
    if (resources.value.length > 0) {
      popularResources.value = resources.value.slice(0, 3).map(r => ({
        ...r,
        categoryColor: getTypeColor(r.type),
        views: r.views_count || 0,
        downloads: r.downloads_count || 0
      }))
    } else {
      popularResources.value = []
    }
  } catch (error) {
    console.error('Erreur lors du chargement des ressources:', error)
    resources.value = []
    popularResources.value = []
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  loadResources()
})
</script>

<style scoped>
.resources-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.hero-banner {
  background: linear-gradient(135deg, #2e7d32 0%, #388e3c 100%);
}

.resource-card {
  transition: transform 0.2s ease-in-out;
  border-radius: 12px !important;
}

.resource-card:hover {
  transform: translateY(-4px);
}

.resource-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.1), transparent);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.rating-badge {
  background: rgba(0,0,0,0.7);
  border-radius: 12px;
  padding: 4px 8px;
  margin: 8px;
  display: flex;
  align-items: center;
}

.category-section {
  border-radius: 12px !important;
  transition: transform 0.2s ease-in-out;
}

.category-section:hover {
  transform: translateY(-2px);
}

.v-btn {
  border-radius: 8px !important;
}

.cursor-pointer {
  cursor: pointer;
}
</style>
