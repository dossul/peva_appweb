<template>
  <div class="map-view">
    <!-- Header avec bannière -->
    <div class="hero-banner text-white py-8">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon size="48" class="mr-4">mdi-map-marker-radius</v-icon>
            <div>
              <h1 class="text-h3 font-weight-bold mb-2">Carte Interactive PEVA</h1>
              <p class="text-h6 font-weight-regular ma-0">Entreprises de l'économie verte en Afrique</p>
            </div>
          </div>
          <div class="d-flex align-center ga-2">
            <v-chip color="white" text-color="green" size="small" data-testid="company-counter">
              <v-icon start>mdi-domain</v-icon>
              {{ filteredCompanies.length }} entreprises
            </v-chip>
            
            <!-- Boutons de navigation entre vues -->
            <div class="d-flex align-center ga-1">
              <v-btn 
                color="white" 
                variant="outlined" 
                size="small" 
                @click="$router.push('/directory')"
                class="text-peva-green"
              >
                <v-icon>mdi-view-grid</v-icon>
                <span class="d-none d-sm-inline ml-1">GRILLE</span>
              </v-btn>
              <v-btn 
                color="white" 
                variant="outlined" 
                size="small" 
                @click="$router.push('/directory')"
                class="text-peva-green"
              >
                <v-icon>mdi-view-list</v-icon>
                <span class="d-none d-sm-inline ml-1">LISTE</span>
              </v-btn>
              <v-btn 
                color="white" 
                variant="flat" 
                size="small" 
                class="text-peva-green"
                disabled
              >
                <v-icon>mdi-map</v-icon>
                <span class="d-none d-sm-inline ml-1">CARTE</span>
              </v-btn>
            </div>
            
            <v-btn color="white" variant="flat" size="small" prepend-icon="mdi-fullscreen" class="text-peva-green" @click="toggleFullscreen">
              <span class="d-none d-sm-inline">Plein écran</span>
              <v-icon class="d-sm-none">mdi-fullscreen</v-icon>
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>

    <v-container fluid class="pa-0">
      <div class="map-container">
        <!-- Sidebar Filtres -->
        <div class="filters-sidebar" data-testid="map-filters">
          <v-card class="pa-4" elevation="3">
            <div class="d-flex align-center justify-space-between mb-4">
              <div class="d-flex align-center">
                <v-icon class="mr-2" color="peva-green">mdi-filter</v-icon>
                <h3 class="text-h6 font-weight-bold">Filtres</h3>
              </div>
              <div class="d-flex align-center ga-2">
                <v-badge 
                  v-if="hasActiveFilters"
                  :content="activeFiltersCount"
                  color="peva-green"
                  inline
                >
                  <v-icon size="small" color="peva-green">mdi-filter-check</v-icon>
                </v-badge>
                <v-btn variant="text" color="orange-darken-1" size="small" @click="resetFilters" :disabled="!hasActiveFilters">
                  Réinitialiser
                </v-btn>
              </div>
            </div>

            <!-- Secteur d'activité -->
            <div class="mb-4">
              <h4 class="text-body-1 font-weight-bold mb-2">Secteur d'activité</h4>
              <v-select
                v-model="selectedSector"
                :items="sectors"
                label="Tous les secteurs"
                variant="outlined"
                density="compact"
                hide-details
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

            <!-- Type d'entreprise -->
            <div class="mb-4">
              <h4 class="text-body-1 font-weight-bold mb-2">Taille d'entreprise</h4>
              <v-checkbox
                v-for="size in companySizes"
                :key="size.value"
                v-model="selectedSizes"
                :value="size.value"
                :label="size.label"
                density="compact"
                hide-details
                class="mb-1"
                @update:model-value="applyFilters"
              />
            </div>

            <!-- Recherche -->
            <div class="mb-4">
              <h4 class="text-body-1 font-weight-bold mb-2">Recherche</h4>
              <v-text-field
                v-model="searchQuery"
                label="Nom de l'entreprise..."
                variant="outlined"
                density="compact"
                hide-details
                prepend-inner-icon="mdi-magnify"
                @input="applyFilters"
              />
            </div>
          </v-card>

          <!-- Légendes -->
          <v-card class="pa-4 mt-4" elevation="3">
            <h3 class="text-h6 font-weight-bold mb-3">
              <v-icon class="mr-2">mdi-information</v-icon>
              Légendes
            </h3>

            <div class="mb-3">
              <h4 class="text-body-2 font-weight-bold mb-2">Secteurs d'activité</h4>
              <div v-for="sector in sectorLegends" :key="sector.name" class="d-flex align-center mb-1">
                <div class="legend-dot" :style="{ backgroundColor: sector.color }"></div>
                <span class="text-body-2 ml-2">{{ sector.name }}</span>
              </div>
            </div>

            <div class="mb-3">
              <h4 class="text-body-2 font-weight-bold mb-2">Taille des marqueurs</h4>
              <div class="d-flex align-center mb-1">
                <div class="legend-marker small"></div>
                <span class="text-body-2 ml-2">PME (1-50 employés)</span>
              </div>
              <div class="d-flex align-center mb-1">
                <div class="legend-marker medium"></div>
                <span class="text-body-2 ml-2">Moyenne (51-200)</span>
              </div>
              <div class="d-flex align-center">
                <div class="legend-marker large"></div>
                <span class="text-body-2 ml-2">Grande (200+ employés)</span>
              </div>
            </div>
          </v-card>
        </div>

        <!-- Carte Leaflet -->
        <div class="main-map">
          <!-- Indicateur de chargement -->
          <div v-if="loading" class="loading-overlay">
            <v-progress-circular
              indeterminate
              color="peva-green"
              size="64"
            />
            <div class="text-h6 mt-4">Chargement des entreprises...</div>
          </div>
          
          <div id="leaflet-map" style="height: 600px; width: 100%;"></div>
          
          <!-- Contrôles de la carte -->
          <div class="map-controls">
            <v-card class="pa-3" elevation="2">
              <div class="d-flex align-center justify-space-between mb-2">
                <h4 class="text-body-1 font-weight-bold">
                  <v-icon class="mr-2">mdi-map</v-icon>
                  Contrôles
                </h4>
                <v-btn-toggle v-model="mapLayer" mandatory variant="outlined" density="compact">
                  <v-btn value="street" size="small">Rue</v-btn>
                  <v-btn value="satellite" size="small">Satellite</v-btn>
                </v-btn-toggle>
              </div>
              
              <div class="d-flex align-center justify-space-between">
                <div class="text-body-2">
                  <strong>{{ filteredCompanies.length }}</strong> entreprises visibles
                </div>
                <v-btn size="small" variant="outlined" color="peva-green" @click="centerMapOnAfrica">
                  <v-icon start>mdi-crosshairs-gps</v-icon>
                  Centrer Afrique
                </v-btn>
              </div>
            </v-card>
          </div>
        </div>
      </div>
    </v-container>

    <!-- Dialog détails acteur -->
    <v-dialog v-model="showActorDialog" max-width="600">
      <v-card v-if="selectedActor">
        <v-card-title class="pa-4 d-flex align-center">
          <v-avatar :color="selectedActor.color" size="40" class="mr-3">
            <v-icon color="white">{{ selectedActor.icon }}</v-icon>
          </v-avatar>
          <div>
            <h3 class="text-h6 font-weight-bold">{{ selectedActor.name }}</h3>
            <div class="text-body-2 text-grey-darken-1">{{ selectedActor.city }}, {{ selectedActor.country }}</div>
          </div>
        </v-card-title>
        
        <v-card-text class="pa-4">
          <div class="mb-4">
            <h4 class="text-body-1 font-weight-bold mb-2">
              <v-icon class="mr-2">mdi-information</v-icon>
              Informations Générales
            </h4>
            <div class="info-grid">
              <div><strong>Secteur:</strong> {{ selectedActor.sector }}</div>
              <div><strong>Type:</strong> {{ selectedActor.type }}</div>
              <div><strong>Employés:</strong> {{ selectedActor.employees }}</div>
              <div><strong>Fondée en:</strong> {{ selectedActor.founded }}</div>
              <div><strong>Chiffre d'affaires:</strong> {{ selectedActor.revenue }}</div>
            </div>
          </div>

          <div class="mb-4">
            <h4 class="text-body-1 font-weight-bold mb-2">
              <v-icon class="mr-2">mdi-text</v-icon>
              Description
            </h4>
            <p class="text-body-2">{{ selectedActor.description }}</p>
          </div>

          <div class="mb-4">
            <h4 class="text-body-1 font-weight-bold mb-2">
              <v-icon class="mr-2">mdi-check-circle</v-icon>
              Projets Principaux
            </h4>
            <v-chip
              v-for="project in selectedActor.projects"
              :key="project"
              size="small"
              class="mr-1 mb-1"
              color="green"
            >
              {{ project }}
            </v-chip>
          </div>

          <div>
            <h4 class="text-body-1 font-weight-bold mb-2">
              <v-icon class="mr-2">mdi-phone</v-icon>
              Contact
            </h4>
            <div class="d-flex align-center mb-2">
              <v-icon size="16" class="mr-2">mdi-web</v-icon>
              <a :href="selectedActor.website" target="_blank" class="text-blue">{{ selectedActor.website }}</a>
            </div>
            <div class="d-flex align-center mb-2">
              <v-icon size="16" class="mr-2">mdi-phone</v-icon>
              <span>{{ selectedActor.phone }}</span>
            </div>
            <div class="d-flex align-center">
              <v-icon size="16" class="mr-2">mdi-email</v-icon>
              <span>{{ selectedActor.email }}</span>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="showActorDialog = false">
            Fermer
          </v-btn>
          <v-btn color="peva-green" variant="flat">
            Contacter
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog demande de connexion -->
    <v-dialog v-model="showConnectionDialog" max-width="500">
      <v-card v-if="selectedCompanyForConnection">
        <v-card-title class="pa-4 d-flex align-center">
          <v-icon color="green" size="32" class="mr-3">mdi-handshake</v-icon>
          <div>
            <h3 class="text-h6 font-weight-bold">Demande de Connexion</h3>
            <div class="text-body-2 text-grey-darken-1">{{ selectedCompanyForConnection.name }}</div>
          </div>
        </v-card-title>
        
        <v-card-text class="pa-4">
          <div class="mb-4">
            <div class="d-flex align-center mb-3">
              <v-avatar :color="getSectorColor(selectedCompanyForConnection.sector.name)" size="40" class="mr-3">
                <span class="text-white font-weight-bold">{{ selectedCompanyForConnection.name.charAt(0) }}</span>
              </v-avatar>
              <div>
                <h4 class="text-body-1 font-weight-bold">{{ selectedCompanyForConnection.name }}</h4>
                <p class="text-body-2 text-grey-darken-1 ma-0">{{ selectedCompanyForConnection.city }}, {{ selectedCompanyForConnection.country }}</p>
                <p class="text-body-2 ma-0" :style="{ color: getSectorColor(selectedCompanyForConnection.sector.name) }">{{ selectedCompanyForConnection.sector.name }}</p>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <h4 class="text-body-1 font-weight-bold mb-2">
              <v-icon class="mr-2">mdi-message-text</v-icon>
              Message de présentation (optionnel)
            </h4>
            <v-textarea
              v-model="connectionMessage"
              label="Présentez-vous et expliquez pourquoi vous souhaitez vous connecter..."
              variant="outlined"
              rows="4"
              hide-details
              :placeholder="`Bonjour,\n\nJe suis intéressé(e) par vos activités dans le domaine ${selectedCompanyForConnection.sector.name.toLowerCase()} et souhaiterais explorer des opportunités de collaboration.\n\nCordialement`"
            />
          </div>

          <v-alert type="info" variant="tonal" class="mb-4">
            <div class="text-body-2">
              <strong>🤝 Qu'est-ce qu'une connexion ?</strong><br>
              Une connexion vous permet d'établir un lien professionnel avec cette entreprise pour :
              <ul class="mt-2 ml-4">
                <li>Échanger des messages privés</li>
                <li>Partager des opportunités d'affaires</li>
                <li>Collaborer sur des projets</li>
                <li>Accéder à leur réseau étendu</li>
              </ul>
            </div>
          </v-alert>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="cancelConnection">
            Annuler
          </v-btn>
          <v-btn color="green" variant="flat" @click="sendConnectionRequest">
            <v-icon start>mdi-send</v-icon>
            Envoyer la demande
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar pour utilisateurs non connectés -->
    <v-snackbar
      v-model="showSnackbar"
      :timeout="4000"
      color="orange-darken-1"
      location="top"
    >
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="$router.push('/auth/login')"
        >
          Se connecter
        </v-btn>
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
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { connectionService } from '@/services/connectionService'
import { viewsService } from '@/services/viewsService'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const selectedSector = ref('')
const selectedCountry = ref('')
const selectedSizes = ref([])
const searchQuery = ref('')
const showActorDialog = ref(false)
const selectedActor = ref(null)
const mapLayer = ref('street')
const showConnectionDialog = ref(false)
const selectedCompanyForConnection = ref(null)
const connectionMessage = ref('')

// Données de la BDD
const companiesFromDB = ref([])
const loading = ref(false)

// Snackbar pour utilisateurs non connectés
const showSnackbar = ref(false)
const snackbarMessage = ref('')

// Leaflet map instance
let map = null
let markersLayer = null

// Données dynamiques basées sur les entreprises réelles (BDD ou mock)
const allCompanies = computed(() => {
  return companiesFromDB.value.length > 0 ? companiesFromDB.value : companies.value
})

const sectors = computed(() => {
  const uniqueSectors = [...new Set(allCompanies.value
    .map(c => c.sector?.name || c.sector)
    .filter(sector => sector))]
  return ['Tous les secteurs', ...uniqueSectors.sort()]
})

const countries = computed(() => {
  const uniqueCountries = [...new Set(allCompanies.value
    .map(c => c.country)
    .filter(country => country))]
  return ['Tous les pays', ...uniqueCountries.sort()]
})

const companySizes = computed(() => {
  const sizes = {}
  allCompanies.value.forEach(company => {
    const size = company.size || 'pme'
    if (!sizes[size]) {
      sizes[size] = 0
    }
    sizes[size]++
  })
  
  const sizeLabels = {
    pme: 'PME (1-50 employés)',
    moyenne: 'Moyenne (51-200)',
    grande: 'Grande (200+)'
  }
  
  return Object.entries(sizes).map(([value, count]) => ({
    value,
    label: `${sizeLabels[value]} (${count})`
  }))
})

// Gestion des filtres actifs
const hasActiveFilters = computed(() => {
  return (selectedSector.value !== '' && selectedSector.value !== 'Tous les secteurs') ||
         (selectedCountry.value !== '' && selectedCountry.value !== 'Tous les pays') ||
         selectedSizes.value.length > 0 ||
         searchQuery.value !== ''
})

const activeFiltersCount = computed(() => {
  let count = 0
  if (selectedSector.value !== '' && selectedSector.value !== 'Tous les secteurs') count++
  if (selectedCountry.value !== '' && selectedCountry.value !== 'Tous les pays') count++
  if (selectedSizes.value.length > 0) count++
  if (searchQuery.value !== '') count++
  return count
})

const sectorLegends = [
  { name: 'Énergies renouvelables', color: '#22c55e' },
  { name: 'Agriculture durable', color: '#10b981' },
  { name: 'Transport vert', color: '#3b82f6' },
  { name: 'Construction écologique', color: '#ec4899' },
  { name: 'Gestion des déchets', color: '#8b5cf6' },
  { name: 'Eau et assainissement', color: '#06b6d4' }
]

// Données des entreprises avec coordonnées GPS réelles
const companies = ref([
  {
    id: 1,
    name: 'SolarTech Côte d\'Ivoire',
    sector: { name: 'Énergies renouvelables' },
    country: 'Côte d\'Ivoire',
    city: 'Abidjan',
    coordinates: { lat: 5.3600, lng: -4.0083 },
    employees: 45,
    size: 'pme',
    description: 'Installation et maintenance de panneaux solaires pour l\'Afrique de l\'Ouest',
    website: 'www.solartech-ci.com',
    email: 'contact@solartech-ci.com',
    phone: '+225 20 30 40 50',
    founded: 2018,
    revenue: '2.5M €'
  },
  {
    id: 2,
    name: 'Green Farm Ghana',
    sector: { name: 'Agriculture durable' },
    country: 'Ghana',
    city: 'Accra',
    coordinates: { lat: 5.6037, lng: -0.1870 },
    employees: 120,
    size: 'moyenne',
    description: 'Agriculture biologique et distribution de produits locaux',
    website: 'www.greenfarm-gh.com',
    email: 'info@greenfarm-gh.com',
    phone: '+233 30 276 8900',
    founded: 2015,
    revenue: '5.8M €'
  },
  {
    id: 3,
    name: 'EcoTransport Sénégal',
    sector: { name: 'Transport vert' },
    country: 'Sénégal',
    city: 'Dakar',
    coordinates: { lat: 14.7167, lng: -17.4677 },
    employees: 78,
    size: 'moyenne',
    description: 'Transport urbain électrique et solutions de mobilité durable',
    website: 'www.ecotransport-sn.com',
    email: 'contact@ecotransport-sn.com',
    phone: '+221 33 889 62 00',
    founded: 2019,
    revenue: '3.2M €'
  },
  {
    id: 4,
    name: 'WasteToEnergy Mali',
    sector: { name: 'Gestion des déchets' },
    country: 'Mali',
    city: 'Bamako',
    coordinates: { lat: 12.6392, lng: -8.0029 },
    employees: 35,
    size: 'pme',
    description: 'Transformation des déchets organiques en énergie renouvelable',
    website: 'www.wastetoenergy-ml.com',
    email: 'info@wastetoenergy-ml.com',
    phone: '+223 20 22 45 67',
    founded: 2020,
    revenue: '1.8M €'
  },
  {
    id: 5,
    name: 'CleanWater Nigeria',
    sector: { name: 'Eau et assainissement' },
    country: 'Nigeria',
    city: 'Lagos',
    coordinates: { lat: 6.5244, lng: 3.3792 },
    employees: 250,
    size: 'grande',
    description: 'Purification d\'eau et systèmes d\'assainissement urbain',
    website: 'www.cleanwater-ng.com',
    email: 'contact@cleanwater-ng.com',
    phone: '+234 1 271 0001',
    founded: 2012,
    revenue: '12.5M €'
  },
  {
    id: 6,
    name: 'EcoBuild Kenya',
    sector: { name: 'Construction écologique' },
    country: 'Kenya',
    city: 'Nairobi',
    coordinates: { lat: -1.2921, lng: 36.8219 },
    employees: 95,
    size: 'moyenne',
    description: 'Matériaux de construction écologiques et bâtiments durables',
    website: 'www.ecobuild-ke.com',
    email: 'info@ecobuild-ke.com',
    phone: '+254 20 271 0001',
    founded: 2016,
    revenue: '4.7M €'
  },
  {
    id: 7,
    name: 'Renewable Energy SA',
    sector: { name: 'Énergies renouvelables' },
    country: 'Afrique du Sud',
    city: 'Le Cap',
    coordinates: { lat: -33.9249, lng: 18.4241 },
    employees: 180,
    size: 'moyenne',
    description: 'Parcs éoliens et solaires pour l\'Afrique australe',
    website: 'www.renewable-sa.com',
    email: 'contact@renewable-sa.com',
    phone: '+27 21 418 3000',
    founded: 2010,
    revenue: '8.9M €'
  },
  {
    id: 8,
    name: 'Atlas Green Morocco',
    sector: { name: 'Énergies renouvelables' },
    country: 'Maroc',
    city: 'Casablanca',
    coordinates: { lat: 33.5731, lng: -7.5898 },
    employees: 65,
    size: 'moyenne',
    description: 'Solutions solaires pour l\'industrie et les particuliers',
    website: 'www.atlasgreen-ma.com',
    email: 'info@atlasgreen-ma.com',
    phone: '+212 522 48 70 00',
    founded: 2017,
    revenue: '3.8M €'
  },
  {
    id: 9,
    name: 'Nile Solar Egypt',
    sector: { name: 'Énergies renouvelables' },
    country: 'Égypte',
    city: 'Le Caire',
    coordinates: { lat: 30.0444, lng: 31.2357 },
    employees: 140,
    size: 'moyenne',
    description: 'Centrale solaire et distribution d\'énergie verte',
    website: 'www.nilesolar-eg.com',
    email: 'contact@nilesolar-eg.com',
    phone: '+20 2 2735 0000',
    founded: 2014,
    revenue: '6.2M €'
  },
  {
    id: 10,
    name: 'BioFarm Burkina',
    sector: { name: 'Agriculture durable' },
    country: 'Burkina Faso',
    city: 'Ouagadougou',
    coordinates: { lat: 12.3714, lng: -1.5197 },
    employees: 28,
    size: 'pme',
    description: 'Agriculture biologique et formation des agriculteurs',
    website: 'www.biofarm-bf.com',
    email: 'info@biofarm-bf.com',
    phone: '+226 25 30 60 00',
    founded: 2019,
    revenue: '1.2M €'
  }
])

// Computed properties
const filteredCompanies = computed(() => {
  let filtered = allCompanies.value

  if (selectedSector.value && selectedSector.value !== 'Tous les secteurs') {
    filtered = filtered.filter(company => {
      const sectorName = company.sector?.name || company.sector
      return sectorName === selectedSector.value
    })
  }

  if (selectedCountry.value && selectedCountry.value !== 'Tous les pays') {
    filtered = filtered.filter(company => 
      company.country === selectedCountry.value
    )
  }

  if (selectedSizes.value.length > 0) {
    filtered = filtered.filter(company => 
      selectedSizes.value.includes(company.size || 'pme')
    )
  }

  if (searchQuery.value) {
    filtered = filtered.filter(company =>
      company.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return filtered
})

// Methods
const loadCompanies = async () => {
  try {
    loading.value = true
    
    // Charger toutes les entreprises depuis la BDD
    const data = await viewsService.getCompanies({
      // Ne pas filtrer par statut pour l'instant
      // status: 'published' // Utiliser si nécessaire avec la bonne valeur d'enum
    })
    
    // Transformer les données de la BDD au format attendu pour la carte
    companiesFromDB.value = data.map(company => ({
      ...company,
      // S'assurer que les propriétés nécessaires existent
      sector: { name: company.activity_sector || company.industry || 'Autre' },
      country: company.country || 'Non spécifié',
      city: company.city || company.headquarters || 'Non spécifié',
      size: company.size || (company.employees > 200 ? 'grande' : company.employees > 50 ? 'moyenne' : 'pme'),
      coordinates: {
        lat: parseFloat(company.latitude) || 0,
        lng: parseFloat(company.longitude) || 0
      },
      employees: company.employees || 0,
      description: company.description || company.bio || 'Description non disponible',
      website: company.website || `www.${company.name?.toLowerCase().replace(/\s+/g, '')}.com`,
      email: company.email || `contact@${company.name?.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: company.phone || '+000 00 00 00 00',
      founded: company.founded_year || company.created_at ? new Date(company.created_at).getFullYear() : 2020,
      revenue: company.revenue || 'Non communiqué'
    }))
    
    console.log('Entreprises chargées depuis la BDD:', companiesFromDB.value.length)
    
    // Debug : afficher la répartition des secteurs
    if (companiesFromDB.value.length > 0) {
      const sectorCount = {}
      companiesFromDB.value.forEach(c => {
        const sector = c.sector?.name || c.sector || 'Autre'
        sectorCount[sector] = (sectorCount[sector] || 0) + 1
      })
      console.log('Répartition des secteurs:', sectorCount)
    }
  } catch (error) {
    console.error('Erreur lors du chargement des entreprises:', error)
    // En cas d'erreur, garder les données mock
    companiesFromDB.value = []
  } finally {
    loading.value = false
    console.log('✅ Chargement terminé, loading =', loading.value)
  }
}

const initializeMap = async () => {
  await nextTick()
  
  try {
    console.log('🗺️ Initialisation simple de la carte...')
    
    // Carte simple centrée sur l'Afrique de l'Ouest
    map = L.map('leaflet-map', {
      center: [12.3714, -1.5197],
      zoom: 7,
      zoomControl: true
    })
    
    // Tuiles OpenStreetMap simples
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18
    }).addTo(map)
    
    // Groupe de marqueurs
    markersLayer = L.layerGroup().addTo(map)
    
    console.log('✅ Carte initialisée avec succès')
    
    // Redimensionner après un court délai
    setTimeout(() => {
      if (map) {
        map.invalidateSize()
        updateMarkers()
        console.log('✅ Carte redimensionnée et marqueurs ajoutés')
      }
    }, 1000)
    
    return { updateMapLayer: () => {} }
    
  } catch (error) {
    console.error('❌ Erreur initialisation carte:', error)
    return { updateMapLayer: () => {} }
  }
}

const updateMarkers = () => {
  if (!markersLayer) return

  // Vider les marqueurs existants
  markersLayer.clearLayers()

  // Ajouter les marqueurs filtrés
  filteredCompanies.value.forEach(company => {
    const color = getSectorColor(company.sector.name)
    const size = getMarkerSize(company.size)

    // Créer un marqueur personnalisé
    const marker = L.circleMarker([company.coordinates.lat, company.coordinates.lng], {
      radius: size,
      fillColor: color,
      color: '#fff',
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    })

    // Popup avec vue rapide de la structure et boutons d'action
    const popupContent = `
      <div class="company-popup" style="min-width: 280px; font-family: 'Roboto', sans-serif;">
        <!-- En-tête avec logo/icône -->
        <div style="display: flex; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 2px solid ${color};">
          <div style="width: 40px; height: 40px; background: ${color}; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
            <span style="color: white; font-weight: bold; font-size: 16px;">${company.name.charAt(0)}</span>
          </div>
          <div>
            <h4 style="margin: 0; color: ${color}; font-size: 16px; font-weight: 600;">${company.name}</h4>
            <p style="margin: 0; color: #666; font-size: 12px;">${company.city}, ${company.country}</p>
          </div>
        </div>
        
        <!-- Informations rapides -->
        <div style="margin-bottom: 12px;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 13px; color: #666;">Secteur:</span>
            <span style="font-size: 13px; font-weight: 500; color: ${color};">${company.sector.name}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 13px; color: #666;">Employés:</span>
            <span style="font-size: 13px; font-weight: 500;">${company.employees}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 13px; color: #666;">Fondée en:</span>
            <span style="font-size: 13px; font-weight: 500;">${company.founded}</span>
          </div>
          <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
            <span style="font-size: 13px; color: #666;">CA:</span>
            <span style="font-size: 13px; font-weight: 500; color: #22c55e;">${company.revenue}</span>
          </div>
        </div>
        
        <!-- Description courte -->
        <div style="margin-bottom: 12px;">
          <p style="margin: 0; font-size: 12px; color: #555; line-height: 1.4; font-style: italic;">
            "${company.description.length > 80 ? company.description.substring(0, 80) + '...' : company.description}"
          </p>
        </div>
        
        <!-- Boutons d'action -->
        <div style="display: flex; flex-direction: column; gap: 6px;">
          <button onclick="window.showCompanyDetails(${company.id})" 
                  style="background: ${color}; color: white; border: none; padding: 8px 12px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; transition: all 0.2s ease; width: 100%;">
            📋 Voir la fiche complète
          </button>
          <div style="display: flex; gap: 6px;">
            <button onclick="window.contactCompany(${company.id})" 
                    style="background: #3b82f6; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; flex: 1; transition: all 0.2s ease;">
              📞 Contacter
            </button>
            <button onclick="window.connectToCompany(${company.id})" 
                    style="background: #10b981; color: white; border: none; padding: 6px 12px; border-radius: 6px; cursor: pointer; font-size: 12px; font-weight: 500; flex: 1; transition: all 0.2s ease;">
              🤝 Se connecter
            </button>
          </div>
        </div>
      </div>
    `

    marker.bindPopup(popupContent)
    marker.addTo(markersLayer)
  })
  
  // Centrer automatiquement sur les entreprises
  if (markersLayer.getLayers().length > 0) {
    setTimeout(() => {
      try {
        const group = new L.featureGroup(markersLayer.getLayers())
        if (group.getBounds().isValid()) {
          map.fitBounds(group.getBounds(), { padding: [50, 50], maxZoom: 10 })
        } else {
          map.setView([12.3714, -1.5197], 7) // Burkina Faso
        }
      } catch (error) {
        map.setView([12.3714, -1.5197], 7)
      }
    }, 100)
  }
}

const getSectorColor = (sectorName) => {
  const colors = {
    // Secteurs standards
    'Énergies renouvelables': '#22c55e',
    'Énergies Renouvelables': '#22c55e',
    'Énergie Solaire': '#22c55e',
    'Agriculture durable': '#10b981',
    'Agriculture Durable': '#10b981',
    'Transport vert': '#3b82f6',
    'Transport Écologique': '#3b82f6',
    'Construction écologique': '#ec4899',
    'Gestion des déchets': '#8b5cf6',
    'Gestion des Déchets': '#8b5cf6',
    'Eau et assainissement': '#06b6d4',
    'Gestion de l\'Eau': '#06b6d4',
    // Secteurs de votre BDD
    'Élevage Durable': '#16a34a',
    'Artisanat Vert': '#059669',
    'Mines Responsables': '#7c3aed',
    'Écotourisme': '#0891b2'
  }
  return colors[sectorName] || '#22c55e' // Vert par défaut au lieu de gris
}

const getMarkerSize = (size) => {
  const sizes = {
    'pme': 8,
    'moyenne': 12,
    'grande': 16
  }
  return sizes[size] || 8
}

const resetFilters = () => {
  selectedSector.value = ''
  selectedCountry.value = ''
  selectedSizes.value = []
  searchQuery.value = ''
  applyFilters()
}

const applyFilters = () => {
  if (map) {
    updateMarkers()
  }
}

const centerMapOnAfrica = () => {
  if (map) {
    map.setView([0, 20], 4)
  }
}

const toggleFullscreen = () => {
  const mapContainer = document.getElementById('leaflet-map')
  if (mapContainer.requestFullscreen) {
    mapContainer.requestFullscreen()
  }
}

// Fonctions globales pour les actions des popups
window.showCompanyDetails = (companyId) => {
  const company = allCompanies.value.find(c => c.id === companyId)
  if (company) {
    selectedActor.value = {
      ...company,
      city: company.city,
      sector: company.sector?.name || company.sector,
      type: 'Entreprise',
      projects: ['Énergie Solaire', 'Formation Technique', 'Développement Durable'],
      color: getSectorColor(company.sector?.name || company.sector)
    }
    showActorDialog.value = true
  }
}

window.contactCompany = (companyId) => {
  // Vérifier si l'utilisateur est connecté
  if (!authStore.isAuthenticated) {
    snackbarMessage.value = "Vous devez être connecté pour contacter une entreprise"
    showSnackbar.value = true
    return
  }

  const company = allCompanies.value.find(c => c.id === companyId)
  if (company) {
    // Rediriger vers la vue Messages avec un nouveau message pré-rempli
    router.push({ 
      name: 'Messages', 
      query: { 
        contact: companyId,
        contactName: company.name,
        contactType: 'company',
        subject: `Demande de contact - ${company.name}`
      } 
    })
  }
}

window.connectToCompany = (companyId) => {
  // Vérifier si l'utilisateur est authentifié
  if (!authStore.isAuthenticated) {
    snackbarMessage.value = "Vous devez être connecté pour envoyer une demande de connexion"
    showSnackbar.value = true
    return
  }
  
  const company = allCompanies.value.find(c => c.id === companyId)
  if (company) {
    selectedCompanyForConnection.value = company
    connectionMessage.value = `Bonjour,

Je suis intéressé(e) par vos activités dans le domaine ${(company.sector?.name || company.sector).toLowerCase()} et souhaiterais explorer des opportunités de collaboration.

Cordialement`
    showConnectionDialog.value = true
  }
}

// Méthodes pour le dialog de connexion
const cancelConnection = () => {
  showConnectionDialog.value = false
  selectedCompanyForConnection.value = null
  connectionMessage.value = ''
}

const sendConnectionRequest = async () => {
  if (!selectedCompanyForConnection.value) return
  
  // Vérification de sécurité supplémentaire
  if (!authStore.isAuthenticated) {
    alert('🔒 Vous devez être connecté pour envoyer une demande de connexion.')
    return
  }
  
  try {
    // Utiliser le service de connexions
    await connectionService.sendRequest({
      targetCompanyId: selectedCompanyForConnection.value.id,
      message: connectionMessage.value,
      requesterId: authStore.user?.id || 'current-user-id' // TODO: Utiliser l'ID réel de l'utilisateur
    })
    
    // Notification de succès avec toast Vuetify
    const successMessage = `✅ Demande de connexion envoyée à ${selectedCompanyForConnection.value.name} !

📬 Ils recevront une notification et pourront accepter votre demande.
💬 ${connectionMessage.value ? 'Votre message a été inclus.' : 'Aucun message personnalisé.'}

👀 Vous pouvez suivre le statut dans votre tableau de bord.`

    // Utiliser une notification plus moderne
    if (window.Notification && Notification.permission === 'granted') {
      new Notification('Demande envoyée', {
        body: `Demande de connexion envoyée à ${selectedCompanyForConnection.value.name}`,
        icon: '/favicon.ico'
      })
    }
    
    alert(successMessage)
    
    // Fermer le dialog
    cancelConnection()
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la demande:', error)
    alert('❌ Erreur lors de l\'envoi de la demande. Veuillez réessayer.')
  }
}

// Watcher pour les changements de couche de carte
let updateMapLayerFn = null

onMounted(async () => {
  // Charger les entreprises depuis la BDD d'abord
  await loadCompanies()
  
  // Puis initialiser la carte avec les données chargées
  const { updateMapLayer } = await initializeMap()
  updateMapLayerFn = updateMapLayer
  
  // Watcher pour le changement de couche
  watch(mapLayer, () => {
    if (updateMapLayerFn) {
      updateMapLayerFn()
    }
  })
  
  // Watcher pour les filtres - mettre à jour les marqueurs
  watch([selectedSector, selectedCountry, selectedSizes, searchQuery], () => {
    updateMarkers()
  }, { deep: true })
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
  // Nettoyer les fonctions globales
  if (window.showCompanyDetails) {
    delete window.showCompanyDetails
  }
  if (window.contactCompany) {
    delete window.contactCompany
  }
  if (window.connectToCompany) {
    delete window.connectToCompany
  }
})
</script>

<style scoped>
.map-view {
  min-height: calc(100vh - 64px); /* Soustraire la hauteur du header */
  background-color: #f8f9fa;
  padding-top: 0; /* Assurer qu'il n'y a pas de padding qui masque le header */
}

.hero-banner {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

.text-peva-green {
  color: #22c55e !important;
}

.map-container {
  display: flex;
  height: calc(100vh - 264px); /* Ajuster pour header (64px) + hero banner (~200px) */
  position: relative;
}

.filters-sidebar {
  width: 320px;
  padding: 16px;
  background-color: white;
  border-right: 1px solid #e5e7eb;
  overflow-y: auto;
  z-index: 1000;
}

.main-map {
  flex: 1;
  position: relative;
}

.leaflet-container {
  width: 100%;
  height: 100%;
  z-index: 1;
}

.map-controls {
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 1000;
  min-width: 280px;
}

.legend-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  display: inline-block;
}

.legend-marker {
  border-radius: 50%;
  display: inline-block;
  border: 2px solid #fff;
}

.legend-marker.small {
  width: 8px;
  height: 8px;
  background-color: #22c55e;
}

.legend-marker.medium {
  width: 12px;
  height: 12px;
  background-color: #3b82f6;
}

.legend-marker.large {
  width: 16px;
  height: 16px;
  background-color: #8b5cf6;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.v-card {
  border-radius: 12px !important;
}

.v-btn {
  border-radius: 8px !important;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.9);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 2000;
}

.map-wrapper {
  position: relative;
}

#leaflet-map {
  height: 600px !important;
  width: 100% !important;
  z-index: 1;
}

/* Styles pour les popups Leaflet */
:deep(.leaflet-popup) {
  margin-bottom: 20px;
}

:deep(.leaflet-popup-content-wrapper) {
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

:deep(.leaflet-popup-content) {
  margin: 0;
  padding: 16px;
  font-family: 'Roboto', sans-serif;
  min-width: 280px;
  max-width: 320px;
}

:deep(.leaflet-popup-tip) {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

:deep(.company-popup h4) {
  font-weight: 600;
  margin: 0;
  color: #1f2937;
}

:deep(.company-popup p) {
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
}

:deep(.company-popup button) {
  font-size: 12px;
  font-weight: 500;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

:deep(.company-popup button:hover) {
  opacity: 0.9;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

:deep(.company-popup button:active) {
  transform: translateY(0);
}

/* Animation d'apparition des popups */
:deep(.leaflet-popup) {
  animation: popupFadeIn 0.3s ease-out;
}

@keyframes popupFadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

/* Responsive */
@media (max-width: 768px) {
  .map-container {
    flex-direction: column;
    height: auto;
  }
  
  .filters-sidebar {
    width: 100%;
    max-height: 300px;
  }
  
  .main-map {
    height: 500px;
  }
  
  .map-controls {
    position: relative;
    top: 10px;
    right: 10px;
    margin: 10px;
  }
}
</style>
