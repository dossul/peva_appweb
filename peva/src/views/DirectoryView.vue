<template>
  <div class="directory-view">
    <!-- Header avec bannière -->
    <div class="hero-banner text-white py-8">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon size="48" class="mr-4">mdi-account-group</v-icon>
            <div>
              <h1 class="text-h3 font-weight-bold mb-2">Annuaire 2iE Green Hub</h1>
              <p class="text-h6 font-weight-regular ma-0">Découvrez les acteurs de l'économie verte</p>
            </div>
          </div>
          <div class="d-flex align-center ga-1">
            <v-btn 
              color="white" 
              :variant="viewMode === 'grid' ? 'flat' : 'outlined'" 
              size="small" 
              @click="viewMode = 'grid'"
              class="text-peva-green"
            >
              <v-icon>mdi-view-grid</v-icon>
              <span class="d-none d-sm-inline ml-1">GRILLE</span>
            </v-btn>
            <v-btn 
              color="white" 
              :variant="viewMode === 'list' ? 'flat' : 'outlined'" 
              size="small" 
              @click="viewMode = 'list'"
              class="text-peva-green"
            >
              <v-icon>mdi-view-list</v-icon>
              <span class="d-none d-sm-inline ml-1">LISTE</span>
            </v-btn>
            <v-btn 
              color="white" 
              variant="outlined" 
              size="small" 
              @click="$router.push('/map')"
              class="text-peva-green"
            >
              <v-icon>mdi-map</v-icon>
              <span class="d-none d-sm-inline ml-1">CARTE</span>
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>
    <v-container class="py-8">
      <v-row>
        <!-- Sidebar avec filtres -->
        <v-col cols="12" md="3">
          <v-card class="filters-card" elevation="2">
            <v-card-title class="d-flex align-center justify-space-between pa-4 pb-2">
              <div class="d-flex align-center">
                <v-icon class="mr-2" color="peva-green">mdi-filter</v-icon>
                Filtres
              </div>
              <v-badge 
                v-if="hasActiveFilters"
                :content="activeFiltersCount"
                color="peva-green"
                inline
              >
                <v-icon size="small" color="peva-green">mdi-filter-check</v-icon>
              </v-badge>
            </v-card-title>
            <v-card-text class="pa-4">
              <!-- Recherche -->
              <div class="mb-4">
                <v-text-field
                  v-model="searchQuery"
                  placeholder="ex: Fatoumata Traoré, SolarBu..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                  @input="applyFilters"
                />
              </div>

              <!-- Type de profil -->
              <div class="mb-4">
                <h4 class="text-body-1 font-weight-bold mb-2">Type de profil</h4>
                <v-checkbox
                  v-for="type in profileTypes"
                  :key="type.value"
                  v-model="selectedTypes"
                  :value="type.value"
                  :label="type.label"
                  density="compact"
                  hide-details
                  class="mb-1"
                  @update:model-value="applyFilters"
                />
              </div>

              <!-- Pays -->
              <div class="mb-4">
                <h4 class="text-body-1 font-weight-bold mb-2">Pays</h4>
                <v-select
                  v-model="selectedCountry"
                  :items="countries"
                  label="Tous les pays"
                  variant="outlined"
                  density="compact"
                  hide-details
                  @update:model-value="applyFilters"
                />
              </div>

              <!-- Secteurs -->
              <div class="mb-4">
                <h4 class="text-body-1 font-weight-bold mb-2">Secteurs d'expertise</h4>
                <v-checkbox
                  v-for="sector in sectors"
                  :key="sector"
                  v-model="selectedSectors"
                  :value="sector"
                  :label="sector"
                  density="compact"
                  hide-details
                  class="mb-1"
                  @update:model-value="applyFilters"
                />
              </div>

              <!-- Filtres actifs -->
              <div v-if="hasActiveFilters" class="mb-4">
                <h4 class="text-body-2 font-weight-bold mb-2 text-grey-darken-1">Filtres actifs</h4>
                <div class="d-flex flex-wrap ga-1">
                  <v-chip
                    v-if="searchQuery"
                    size="small"
                    closable
                    color="peva-green"
                    variant="outlined"
                    @click:close="searchQuery = ''"
                  >
                    <v-icon start size="small">mdi-magnify</v-icon>
                    "{{ searchQuery }}"
                  </v-chip>
                  
                  <v-chip
                    v-for="type in selectedTypes"
                    :key="type"
                    size="small"
                    closable
                    color="blue"
                    variant="outlined"
                    @click:close="selectedTypes = selectedTypes.filter(t => t !== type)"
                  >
                    <v-icon start size="small">mdi-account</v-icon>
                    {{ profileTypes.find(pt => pt.value === type)?.label.split(' (')[0] }}
                  </v-chip>
                  
                  <v-chip
                    v-if="selectedCountry && selectedCountry !== 'Tous les pays'"
                    size="small"
                    closable
                    color="orange"
                    variant="outlined"
                    @click:close="selectedCountry = ''"
                  >
                    <v-icon start size="small">mdi-map-marker</v-icon>
                    {{ selectedCountry }}
                  </v-chip>
                  
                  <v-chip
                    v-for="sector in selectedSectors"
                    :key="sector"
                    size="small"
                    closable
                    color="purple"
                    variant="outlined"
                    @click:close="selectedSectors = selectedSectors.filter(s => s !== sector)"
                  >
                    <v-icon start size="small">mdi-briefcase</v-icon>
                    {{ sector }}
                  </v-chip>
                  
                  <v-chip
                    v-if="sortBy !== 'Trier par pertinence'"
                    size="small"
                    closable
                    color="teal"
                    variant="outlined"
                    @click:close="sortBy = 'Trier par pertinence'"
                  >
                    <v-icon start size="small">mdi-sort</v-icon>
                    {{ sortBy }}
                  </v-chip>
                </div>
              </div>

              <!-- Actions des filtres -->
              <div class="d-flex flex-column ga-2">
                <v-btn
                  color="peva-green"
                  variant="flat"
                  prepend-icon="mdi-filter-check"
                  @click="applyFilters"
                  block
                  size="default"
                  class="text-none"
                >
                  Appliquer les filtres
                </v-btn>
                
                <v-btn
                  color="orange-darken-1"
                  variant="outlined"
                  prepend-icon="mdi-filter-remove"
                  @click="resetFilters"
                  block
                  size="small"
                  class="text-none"
                  :disabled="!hasActiveFilters"
                >
                  Réinitialiser tout
                </v-btn>
                
                <!-- Indicateur de filtres actifs -->
                <div v-if="hasActiveFilters" class="text-caption text-center text-grey-darken-1 mt-1">
                  <v-icon size="small" class="mr-1">mdi-filter</v-icon>
                  {{ activeFiltersCount }} filtre{{ activeFiltersCount > 1 ? 's' : '' }} actif{{ activeFiltersCount > 1 ? 's' : '' }}
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Contenu principal -->
        <v-col cols="12" md="9">
          <!-- Barre d'info et tri -->
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="text-body-1">
              <strong>{{ filteredProfiles.length }}</strong> profils trouvés
            </div>
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              label="Trier par pertinence"
              variant="outlined"
              density="compact"
              hide-details
              style="max-width: 200px;"
              @update:model-value="applySorting"
            />
          </div>

          <!-- Vue Grille -->
          <div v-if="viewMode === 'grid'" class="profiles-grid">
            <v-row>
              <v-col
                v-for="profile in paginatedProfiles"
                :key="profile.id"
                cols="12"
                sm="6"
                md="4"
              >
                <v-card class="profile-card" elevation="2" hover>
                  <v-card-text class="pa-4 text-center">
                    <v-avatar size="80" class="mb-3" :color="profile.avatar_url ? undefined : 'teal'">
                      <v-img v-if="profile.avatar_url" :src="profile.avatar_url" />
                      <span v-else class="text-h4 text-white">{{ profile.initials }}</span>
                    </v-avatar>
                    
                    <h3 class="text-h6 font-weight-bold mb-1">{{ profile.full_name }}</h3>
                    <div class="text-body-2 text-grey-darken-1 mb-2">{{ profile.title }}</div>
                    <div class="text-body-2 mb-3">{{ profile.location }}</div>
                    
                    <div class="d-flex justify-center ga-2 mb-3">
                      <v-chip
                        v-for="sector in profile.sectors?.slice(0, 2)"
                        :key="sector"
                        size="small"
                        color="peva-green"
                      >
                        {{ sector }}
                      </v-chip>
                    </div>

                    <div class="d-flex justify-center ga-2">
                      <v-btn size="small" color="peva-green" variant="flat" @click="handleConnect(profile)">
                        Connecter
                      </v-btn>
                      <v-btn size="small" variant="outlined" @click="handleMessage(profile)">
                        Message
                      </v-btn>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- Vue Liste -->
          <div v-else class="profiles-list">
            <v-card
              v-for="profile in paginatedProfiles"
              :key="profile.id"
              class="mb-3 profile-card"
              elevation="2"
              hover
            >
              <v-card-text class="pa-4">
                <div class="d-flex align-start">
                  <v-avatar size="60" class="mr-4" :color="profile.avatar_url ? undefined : 'teal'">
                    <v-img v-if="profile.avatar_url" :src="profile.avatar_url" />
                    <span v-else class="text-h6 text-white">{{ profile.initials }}</span>
                  </v-avatar>
                  
                  <div class="flex-grow-1">
                    <div class="d-flex align-center justify-space-between mb-2">
                      <h3 class="text-h6 font-weight-bold">{{ profile.full_name }}</h3>
                      <div class="d-flex ga-2">
                        <v-btn size="small" color="peva-green" variant="flat" @click="handleConnect(profile)">
                          Connecter
                        </v-btn>
                        <v-btn size="small" variant="outlined" @click="handleMessage(profile)">
                          Message
                        </v-btn>
                      </div>
                    </div>
                    
                    <div class="text-body-1 mb-2">{{ profile.title }}</div>
                    <div class="text-body-2 text-grey-darken-1 mb-2">{{ profile.location }}</div>
                    <p class="text-body-2 mb-3">{{ profile.bio }}</p>
                    
                    <div class="d-flex align-center flex-wrap ga-2">
                      <v-chip
                        v-for="sector in profile.sectors"
                        :key="sector"
                        size="small"
                        color="peva-green"
                      >
                        {{ sector }}
                      </v-chip>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <!-- Pagination -->
          <div class="d-flex align-center justify-space-between mt-6">
            <div class="text-body-2">
              Affichage de {{ startIndex }} à {{ endIndex }} sur {{ filteredProfiles.length }} résultats
            </div>
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              :total-visible="5"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Snackbar pour les notifications -->
    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      :timeout="4000"
      location="top"
    >
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="showSnackbar = false"
        >
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

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const viewMode = ref('grid')
const searchQuery = ref('')
const selectedTypes = ref([])
const selectedCountry = ref('')
const selectedSectors = ref([])
const sortBy = ref('Trier par pertinence')
const currentPage = ref(1)
const itemsPerPage = 12
const profiles = ref([])
const loading = ref(false)

// Snackbar pour les notifications
const showSnackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Mock profiles data - étendu pour avoir plus de diversité
const mockProfiles = [
  {
    id: 1,
    first_name: 'Fatoumata',
    last_name: 'Traoré',
    full_name: 'Fatoumata Traoré',
    initials: 'FT',
    title: 'Entrepreneure',
    location: 'Ouagadougou, Burkina Faso',
    bio: 'Fondatrice de SolarBurkina, spécialisée dans les solutions d\'énergie solaire pour les communautés rurales.',
    sectors: ['Énergie Renouvelable', 'Innovation'],
    profile_type: 'entrepreneur',
    country: 'Burkina Faso',
    avatar_url: null,
    created_at: '2023-01-15',
    last_activity: '2024-01-20',
    activity_score: 95
  },
  {
    id: 2,
    first_name: 'Kwame',
    last_name: 'Asante',
    full_name: 'Kwame Asante',
    initials: 'KA',
    title: 'Développeur Full-Stack',
    location: 'Accra, Ghana',
    bio: 'Développeur passionné par l\'impact environnemental, créateur d\'applications pour l\'agriculture durable.',
    sectors: ['Tech for Good', 'Agriculture Durable'],
    profile_type: 'expert',
    country: 'Ghana',
    avatar_url: null,
    created_at: '2023-06-10',
    last_activity: '2024-01-25',
    activity_score: 88
  },
  {
    id: 3,
    first_name: 'Aminata',
    last_name: 'Diallo',
    full_name: 'Aminata Diallo',
    initials: 'AD',
    title: 'Investisseuse Impact',
    location: 'Dakar, Sénégal',
    bio: 'Directrice d\'investissement chez Green Capital Africa, spécialisée dans le financement de projets verts.',
    sectors: ['Finance Verte', 'Impact Investing'],
    profile_type: 'investor',
    country: 'Sénégal',
    avatar_url: null,
    created_at: '2022-11-20',
    last_activity: '2024-01-28',
    activity_score: 92
  },
  {
    id: 4,
    first_name: 'Jean-Baptiste',
    last_name: 'Kouassi',
    full_name: 'Jean-Baptiste Kouassi',
    initials: 'JK',
    title: 'Consultant Transport Durable',
    location: 'Abidjan, Côte d\'Ivoire',
    bio: 'Expert en mobilité urbaine durable et transport électrique en Afrique de l\'Ouest.',
    sectors: ['Transport Vert', 'Mobilité Urbaine'],
    profile_type: 'expert',
    country: 'Côte d\'Ivoire',
    avatar_url: null,
    created_at: '2023-03-08',
    last_activity: '2024-01-15',
    activity_score: 76
  },
  {
    id: 5,
    first_name: 'Mariam',
    last_name: 'Keita',
    full_name: 'Mariam Keita',
    initials: 'MK',
    title: 'Directrice RH Green Jobs',
    location: 'Bamako, Mali',
    bio: 'Spécialiste du recrutement dans les métiers verts et de la transition écologique.',
    sectors: ['Emplois Verts', 'Formation'],
    profile_type: 'recruiter',
    country: 'Mali',
    avatar_url: null,
    created_at: '2023-09-12',
    last_activity: '2024-01-22',
    activity_score: 84
  },
  {
    id: 6,
    first_name: 'ONG EcoAfrique',
    last_name: '',
    full_name: 'ONG EcoAfrique',
    initials: 'EA',
    title: 'Organisation Environnementale',
    location: 'Niamey, Niger',
    bio: 'Organisation dédiée à la protection de l\'environnement et au développement durable au Sahel.',
    sectors: ['Environnement', 'Développement Durable'],
    profile_type: 'organization',
    country: 'Niger',
    avatar_url: null,
    created_at: '2022-08-05',
    last_activity: '2024-01-18',
    activity_score: 79
  }
]

// Données dynamiques basées sur les profils réels (BDD ou mock)
const allProfiles = computed(() => {
  // Utiliser les données de la BDD si disponibles, sinon les données mock
  return profiles.value.length > 0 ? profiles.value : mockProfiles
})

const profileTypes = computed(() => {
  const types = {}
  allProfiles.value.forEach(profile => {
    const profileType = profile.profile_type || 'user'
    if (!types[profileType]) {
      types[profileType] = 0
    }
    types[profileType]++
  })
  
  const typeLabels = {
    ptf: 'Partenaires techniques et financiers (PTF)',
    company: 'Entreprises',
    investor: 'Investisseur/banque',
    learner: 'Apprenant',
    research: 'Institution de recherche/Université',
    expert: 'Expert',
    user: 'Utilisateur',
    admin: 'Administrateur'
  }
  
  return Object.entries(types)
    .filter(([value]) => typeLabels[value]) // Filtrer les types non reconnus
    .map(([value, count]) => ({
      value,
      label: `${typeLabels[value]} (${count})`
    }))
    .sort((a, b) => b.label.split('(')[1].replace(')', '') - a.label.split('(')[1].replace(')', '')) // Trier par nombre décroissant
})

const countries = computed(() => {
  const uniqueCountries = [...new Set(allProfiles.value
    .map(p => p.country)
    .filter(country => country && country !== 'Non spécifié'))]
  return ['Tous les pays', ...uniqueCountries.sort()]
})

const sectors = computed(() => {
  // Secteurs d'expertise ciblés
  const targetedSectors = [
    'Agroalimentaire',
    'Bilan carbone',
    'Communication d\'impact',
    'Éco-matériaux',
    'Écotourisme',
    'Équipementiers',
    'Gestion des déchets',
    'RSE/ESG',
    'Transformation agroalimentaire',
    'Autres'
  ]
  
  // Ajouter les secteurs existants des profils
  const allSectors = allProfiles.value
    .flatMap(p => Array.isArray(p.sectors) ? p.sectors : [])
    .filter(sector => sector && sector.trim() !== '')
  
  const uniqueSectors = [...new Set([...targetedSectors, ...allSectors])]
  
  // Trier par ordre alphabétique, mais garder "Autres" à la fin
  return uniqueSectors.sort((a, b) => {
    if (a === 'Autres') return 1
    if (b === 'Autres') return -1
    return a.localeCompare(b, 'fr')
  })
})

// Gestion des filtres actifs
const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' ||
         selectedTypes.value.length > 0 ||
         (selectedCountry.value !== '' && selectedCountry.value !== 'Tous les pays') ||
         selectedSectors.value.length > 0 ||
         sortBy.value !== 'Trier par pertinence'
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (searchQuery.value !== '') count++
  if (selectedTypes.value.length > 0) count++
  if (selectedCountry.value !== '' && selectedCountry.value !== 'Tous les pays') count++
  if (selectedSectors.value.length > 0) count++
  if (sortBy.value !== 'Trier par pertinence') count++
  return count
})

const sortOptions = ['Trier par pertinence', 'Plus récent', 'Alphabétique', 'Plus actif']

// Computed
const filteredProfiles = computed(() => {
  let filtered = allProfiles.value

  // Appliquer les filtres
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(profile => 
      profile.full_name.toLowerCase().includes(query) ||
      profile.bio?.toLowerCase().includes(query)
    )
  }

  if (selectedTypes.value.length > 0) {
    filtered = filtered.filter(profile => 
      selectedTypes.value.includes(profile.profile_type)
    )
  }

  if (selectedCountry.value && selectedCountry.value !== 'Tous les pays') {
    filtered = filtered.filter(profile => 
      profile.country === selectedCountry.value
    )
  }

  if (selectedSectors.value.length > 0) {
    filtered = filtered.filter(profile => 
      selectedSectors.value.some(sector => 
        profile.sectors?.includes(sector)
      )
    )
  }

  // Appliquer le tri
  return sortProfiles(filtered)
})

// Fonction de tri
const sortProfiles = (profiles) => {
  const sorted = [...profiles]
  
  switch (sortBy.value) {
    case 'Plus récent':
      return sorted.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    
    case 'Alphabétique':
      return sorted.sort((a, b) => a.full_name.localeCompare(b.full_name))
    
    case 'Plus actif':
      return sorted.sort((a, b) => b.activity_score - a.activity_score)
    
    case 'Trier par pertinence':
    default:
      // Tri par pertinence : combinaison de score d'activité et date de dernière activité
      return sorted.sort((a, b) => {
        const scoreA = a.activity_score + (new Date(a.last_activity).getTime() / 1000000000)
        const scoreB = b.activity_score + (new Date(b.last_activity).getTime() / 1000000000)
        return scoreB - scoreA
      })
  }
}

const totalPages = computed(() => Math.ceil(filteredProfiles.value.length / itemsPerPage))

const paginatedProfiles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredProfiles.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, filteredProfiles.value.length))

// Methods
const loadProfiles = async () => {
  try {
    loading.value = true
    
    // Charger tous les profils sans filtres pour avoir les compteurs corrects
    const allData = await viewsService.getProfiles({
      // Ne pas filtrer par statut pour éviter les erreurs d'enum
    })
    
    // Transformer les données de la BDD au format attendu
    profiles.value = allData.map(profile => ({
      ...profile,
      full_name: `${profile.first_name} ${profile.last_name}`,
      initials: `${profile.first_name?.[0] || ''}${profile.last_name?.[0] || ''}`.toUpperCase(),
      location: `${profile.city || ''}, ${profile.country || ''}`.trim().replace(/^,\s*/, ''),
      // S'assurer que les propriétés nécessaires existent
      profile_type: profile.user_type || profile.profile_type || profile.type || 'user',
      country: profile.country || 'Non spécifié',
      sectors: profile.sectors || [],
      created_at: profile.created_at || new Date().toISOString(),
      last_activity: profile.last_activity || profile.updated_at || new Date().toISOString(),
      activity_score: profile.activity_score || 50 // Score par défaut
    }))
    
    console.log('Profils chargés depuis la BDD:', profiles.value.length)
    
    // Debug : afficher la répartition des types
    if (profiles.value.length > 0) {
      const typeCount = {}
      profiles.value.forEach(p => {
        typeCount[p.profile_type] = (typeCount[p.profile_type] || 0) + 1
      })
      console.log('Répartition des types de profils:', typeCount)
    }
  } catch (error) {
    console.error('Erreur lors du chargement des profils:', error)
    // En cas d'erreur, garder les données mock
    profiles.value = []
  } finally {
    loading.value = false
  }
}

const applyFilters = () => {
  currentPage.value = 1
  // Pas besoin de loadProfiles() car les filtres sont computed
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedTypes.value = []
  selectedCountry.value = ''
  selectedSectors.value = []
  sortBy.value = 'Trier par pertinence'
  currentPage.value = 1
  showNotification('Filtres réinitialisés', 'info')
}

const applySorting = () => {
  currentPage.value = 1
  showNotification(`Tri appliqué : ${sortBy.value}`, 'success')
}

// Méthodes de notification
const showNotification = (message, color = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  showSnackbar.value = true
}

// Méthodes de vérification d'authentification
const checkAuthenticationForAction = (actionName) => {
  if (!authStore.isAuthenticated) {
    showNotification(`🔒 Vous devez être connecté pour ${actionName}.`, 'error')
    return false
  }
  return true
}

const handleConnect = (profile) => {
  if (!checkAuthenticationForAction('envoyer une demande de connexion')) return
  
  // Logique de connexion - rediriger vers une vue de demande de connexion ou ouvrir un dialog
  console.log('Demande de connexion pour:', profile.full_name)
  showNotification(`✅ Demande de connexion envoyée à ${profile.full_name}`, 'success')
}

const handleMessage = (profile) => {
  if (!checkAuthenticationForAction('envoyer un message')) return
  
  // Rediriger vers la vue Messages avec le profil pré-sélectionné
  router.push({ 
    name: 'Messages', 
    query: { 
      contact: profile.id,
      contactName: profile.full_name,
      contactType: 'profile',
      subject: `Message à ${profile.full_name}`
    } 
  })
  showNotification(`💬 Redirection vers la messagerie avec ${profile.full_name}`, 'info')
}

// Initialize
onMounted(() => {
  loadProfiles()
})
</script>

<style scoped>
.directory-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.hero-banner {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

.text-peva-green {
  color: #22c55e !important;
}

.sticky-filters {
  position: sticky;
  top: 20px;
}

.profiles-grid .profile-card,
.profiles-list .profile-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.profiles-grid .profile-card:hover,
.profiles-list .profile-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
}

.v-card {
  border-radius: 12px !important;
}

.v-btn {
  border-radius: 8px !important;
}

.v-chip {
  border-radius: 6px !important;
}
</style>
