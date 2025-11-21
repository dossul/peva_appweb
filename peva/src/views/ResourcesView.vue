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
                <p class="text-h6 font-weight-regular ma-0">Découvrez notre collection de guides, rapports, outils et formations pour l'économie verte en Afrique</p>
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
      <!-- Statistiques des ressources -->
      <v-row class="mb-8">
        <v-col cols="12" md="3">
          <v-card color="blue-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="32" class="mr-3">mdi-book-open</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">156</div>
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
                <div class="text-h4 font-weight-bold">89</div>
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
                <div class="text-h4 font-weight-bold">67</div>
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
                <div class="text-h4 font-weight-bold">34</div>
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
          <v-btn variant="text" color="green-darken-2">Voir toutes →</v-btn>
        </div>
        
        <v-row>
          <v-col
            v-for="resource in popularResources"
            :key="resource.id"
            cols="12"
            md="4"
          >
            <v-card class="resource-card h-100" elevation="2" hover>
              <div class="position-relative">
                <v-img
                  :src="resource.thumbnail || '/api/placeholder/400/200'"
                  height="160"
                  cover
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
                      <span class="text-caption ml-1">{{ resource.rating }}</span>
                    </div>
                  </div>
                </v-img>
              </div>
              
              <v-card-text class="pa-4">
                <div class="d-flex align-center justify-space-between mb-2">
                  <v-chip size="small" :color="resource.categoryColor">
                    {{ resource.category }}
                  </v-chip>
                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-1">mdi-eye</v-icon>
                    <span class="text-caption">{{ resource.views }} vues</span>
                  </div>
                </div>
                
                <h3 class="text-h6 font-weight-bold mb-2">{{ resource.title }}</h3>
                <p class="text-body-2 text-grey-darken-1 mb-3">{{ resource.description }}</p>
                
                <div class="d-flex align-center justify-space-between mb-3">
                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-1">mdi-download</v-icon>
                    <span class="text-caption">{{ resource.downloads }} téléch.</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-1">mdi-account</v-icon>
                    <span class="text-caption">{{ resource.author }}</span>
                  </div>
                </div>
              </v-card-text>
              
              <v-card-actions class="pa-4 pt-0">
                <v-btn
                  color="green-darken-2"
                  variant="flat"
                  size="small"
                  prepend-icon="mdi-eye"
                  @click="viewResource(resource)"
                >
                  Consulter
                </v-btn>
                <v-spacer />
                <v-btn
                  variant="outlined"
                  size="small"
                  prepend-icon="mdi-download"
                  @click="downloadResource(resource)"
                >
                  {{ resource.price ? resource.price : 'Gratuit' }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </div>

      <!-- Sections par catégorie -->
      <div class="mb-8">
        <h2 class="text-h5 font-weight-bold mb-6">Explorer par Catégorie</h2>
        
        <v-row>
          <v-col cols="12" md="4">
            <v-card class="category-section" elevation="2">
              <v-card-title class="pa-4 bg-blue-lighten-5">
                <v-icon class="mr-2" color="blue-darken-2">mdi-book-open</v-icon>
                Guides Pratiques
                <v-spacer />
                <span class="text-body-2">156 ressources</span>
              </v-card-title>
              <v-card-text class="pa-4">
                <p class="text-body-2 mb-3">Des guides étape par étape pour vous accompagner dans vos projets d'économie verte.</p>
                <div class="d-flex flex-column ga-2">
                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-2">mdi-circle</v-icon>
                    <span class="text-body-2">Guide du Financement pour Startups Vertes</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-2">mdi-circle</v-icon>
                    <span class="text-body-2">Calculateur d'Empreinte Carbone</span>
                  </div>
                </div>
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
                <span class="text-body-2">89 ressources</span>
              </v-card-title>
              <v-card-text class="pa-4">
                <p class="text-body-2 mb-3">Analyses de marché, études sectorielles et recherches sur l'économie verte en Afrique.</p>
                <div class="d-flex flex-column ga-2">
                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-2">mdi-circle</v-icon>
                    <span class="text-body-2">État de l'Énergie Solaire en Afrique 2024</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-2">mdi-circle</v-icon>
                    <span class="text-body-2">Rapport sur l'Économie Verte</span>
                  </div>
                </div>
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
                <span class="text-body-2">34 ressources</span>
              </v-card-title>
              <v-card-text class="pa-4">
                <p class="text-body-2 mb-3">Cours en ligne, webinaires et programmes de formation certifiés.</p>
                <div class="d-flex flex-column ga-2">
                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-2">mdi-circle</v-icon>
                    <span class="text-body-2">Formation Leadership Vert</span>
                  </div>
                  <div class="d-flex align-center">
                    <v-icon size="16" class="mr-2">mdi-circle</v-icon>
                    <span class="text-body-2">Certification ESG</span>
                  </div>
                </div>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const searchQuery = ref('')
const selectedType = ref(null)
const selectedSector = ref(null)
const selectedLevel = ref(null)

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

// Static data
const resourceTypes = [
  'Guide',
  'Rapport',
  'Outil',
  'Formation'
]

const sectors = [
  'Énergies Renouvelables',
  'Agriculture Durable',
  'Gestion des Déchets',
  'Transport Vert',
  'Construction Écologique',
  'Fintech Verte'
]

const levels = [
  'Débutant',
  'Intermédiaire',
  'Avancé',
  'Expert'
]

const popularResources = ref([
  {
    id: 1,
    title: 'Guide du Financement pour Startups Vertes',
    description: 'Un guide complet pour comprendre les différentes options de financement disponibles pour les entreprises vertes en Afrique.',
    type: 'Guide',
    category: 'Financement',
    categoryColor: 'green',
    author: 'PEVA Team',
    rating: 4.8,
    views: '2.3k',
    downloads: 945,
    price: null,
    thumbnail: null
  },
  {
    id: 2,
    title: 'État de l\'Énergie Solaire en Afrique 2024',
    description: 'Rapport détaillé sur l\'évolution du marché de l\'énergie solaire avec projections et opportunités.',
    type: 'Rapport',
    category: 'Énergie',
    categoryColor: 'blue',
    author: 'Dr. Amina Kone',
    rating: 4.5,
    views: '1.8k',
    downloads: 567,
    price: null,
    thumbnail: null
  },
  {
    id: 3,
    title: 'Calculateur d\'Empreinte Carbone',
    description: 'Outil Excel pour calculer facilement l\'empreinte carbone de votre entreprise ou projet.',
    type: 'Outil',
    category: 'Environnement',
    categoryColor: 'orange',
    author: 'Green Analytics',
    rating: 4.7,
    views: '945',
    downloads: 234,
    price: null,
    thumbnail: null
  }
])

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
  showMessage(`Ouverture de "${resource.title}"`, 'info')
}

const downloadResource = (resource) => {
  showMessage(`Téléchargement de "${resource.title}" démarré`, 'success')
}

const getTypeColor = (type) => {
  const colors = {
    'Guide': 'blue',
    'Rapport': 'purple',
    'Outil': 'orange',
    'Formation': 'red'
  }
  return colors[type] || 'grey'
}

const showMessage = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  }
}

// Initialize
onMounted(() => {
  // TODO: Charger les données depuis Supabase
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
</style>
