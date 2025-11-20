<template>
  <div class="groups-view">
    <!-- Header Section avec bannière -->
    <div class="hero-banner bg-teal-darken-2 text-white py-12">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div>
            <div class="d-flex align-center mb-4">
              <v-icon size="48" class="mr-4">mdi-account-group</v-icon>
              <div>
                <h1 class="text-h3 font-weight-bold mb-2">Communautés PEVA</h1>
                <p class="text-h6 font-weight-regular ma-0">Rejoignez des groupes thématiques et connectez-vous avec des professionnels de votre secteur</p>
              </div>
            </div>
          </div>
          <v-btn
            v-if="authStore.isAuthenticated"
            color="white"
            variant="flat"
            size="large"
            prepend-icon="mdi-plus"
            @click="$router.push('/groups/create')"
            class="text-teal-darken-2"
          >
            Créer un Groupe
          </v-btn>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <!-- Statistiques -->
      <v-row class="mb-8">
        <v-col cols="12" md="3">
          <v-card color="blue-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="32" class="mr-3">mdi-account-group</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">127</div>
                <div class="text-body-2">Groupes actifs</div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="green-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="32" class="mr-3">mdi-account-multiple</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">12,456</div>
                <div class="text-body-2">Total membres</div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="purple-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="32" class="mr-3">mdi-message</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">896</div>
                <div class="text-body-2">Discussions cette semaine</div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="orange-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="32" class="mr-3">mdi-calendar</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">24</div>
                <div class="text-body-2">Événements programmés</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Navigation Tabs -->
      <v-card class="mb-6" elevation="2">
        <v-tabs v-model="activeTab" color="teal-darken-2" class="px-4">
          <v-tab value="all" prepend-icon="mdi-view-grid">
            Tous les Groupes
          </v-tab>
          <v-tab value="my" prepend-icon="mdi-account-group" v-if="authStore.isAuthenticated">
            Mes Groupes
          </v-tab>
          <v-tab value="recommended" prepend-icon="mdi-star">
            Recommandés
          </v-tab>
          <v-tab value="popular" prepend-icon="mdi-trending-up">
            Populaires
          </v-tab>
          <v-tab value="by-country" prepend-icon="mdi-map">
            Par Pays
          </v-tab>
        </v-tabs>
        
        <!-- Filtres et recherche -->
        <v-card-text class="pt-0">
          <v-row align="center">
            <v-col cols="12" md="6">
              <v-text-field
                v-model="searchQuery"
                placeholder="Rechercher un groupe..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                clearable
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="selectedCategory"
                :items="categories"
                label="Toutes catégories"
                variant="outlined"
                density="compact"
                clearable
                hide-details
              />
            </v-col>
            <v-col cols="12" md="3">
              <v-btn color="teal-darken-2" variant="flat" prepend-icon="mdi-filter">
                Filtrer
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Contenu des onglets -->
      <v-window v-model="activeTab">
        <!-- Groupes Recommandés -->
        <v-window-item value="recommended">
          <div class="mb-6">
            <div class="d-flex align-center justify-space-between mb-4">
              <h2 class="text-h5 font-weight-bold">
                <v-icon class="mr-2">mdi-star</v-icon>
                Groupes Recommandés pour Vous
              </h2>
              <v-btn variant="text" color="teal-darken-2" @click="seeAllRecommended">
                Voir tous →
              </v-btn>
            </div>
            
            <v-row>
              <v-col
                v-for="group in recommendedGroups"
                :key="group.id"
                cols="12"
                md="4"
              >
                <v-card class="group-card h-100" elevation="2" hover>
                  <div class="position-relative">
                    <v-img
                      :src="group.cover || '/api/placeholder/400/120'"
                      height="120"
                      cover
                    >
                      <div class="card-overlay">
                        <v-chip
                          :color="group.type === 'public' ? 'green' : 'orange'"
                          size="small"
                          class="ma-2"
                        >
                          {{ group.type === 'public' ? 'Public' : 'Privé' }}
                        </v-chip>
                      </div>
                    </v-img>
                    <v-avatar
                      :color="group.color"
                      size="48"
                      class="group-avatar"
                    >
                      <v-icon color="white">{{ group.icon }}</v-icon>
                    </v-avatar>
                  </div>
                  
                  <v-card-text class="pt-6">
                    <h3 class="text-h6 font-weight-bold mb-2">{{ group.name }}</h3>
                    <p class="text-body-2 text-grey-darken-1 mb-3">{{ group.description }}</p>
                    
                    <div class="d-flex align-center justify-space-between mb-3">
                      <div class="d-flex align-center">
                        <v-icon size="16" class="mr-1">mdi-account-group</v-icon>
                        <span class="text-body-2">{{ group.members }} membres</span>
                      </div>
                      <div class="d-flex align-center">
                        <v-icon size="16" class="mr-1">mdi-message</v-icon>
                        <span class="text-body-2">{{ group.posts }} posts/semaine</span>
                      </div>
                    </div>
                    
                    <v-chip
                      :color="group.categoryColor"
                      size="small"
                      class="mb-3"
                    >
                      {{ group.category }}
                    </v-chip>
                  </v-card-text>
                  
                  <v-card-actions class="pa-4 pt-0">
                    <v-btn
                      color="teal-darken-2"
                      variant="flat"
                      block
                      prepend-icon="mdi-account-plus"
                      @click="joinGroup(group)"
                    >
                      Rejoindre
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-window-item>

        <!-- Groupes Populaires -->
        <v-window-item value="popular">
          <div class="mb-6">
            <h2 class="text-h5 font-weight-bold mb-4">
              <v-icon class="mr-2">mdi-trending-up</v-icon>
              Groupes Populaires
            </h2>
            
            <v-row>
              <v-col
                v-for="group in popularGroups"
                :key="group.id"
                cols="12"
                md="6"
              >
                <v-card class="group-card-horizontal" elevation="2" hover>
                  <div class="d-flex">
                    <v-avatar
                      :color="group.color"
                      size="80"
                      class="ma-4"
                    >
                      <v-icon color="white" size="32">{{ group.icon }}</v-icon>
                    </v-avatar>
                    
                    <div class="flex-grow-1 pa-4">
                      <div class="d-flex align-center justify-space-between mb-2">
                        <h3 class="text-h6 font-weight-bold">{{ group.name }}</h3>
                        <v-chip
                          :color="group.type === 'public' ? 'green' : 'orange'"
                          size="small"
                        >
                          {{ group.type === 'public' ? 'Public' : 'Privé' }}
                        </v-chip>
                      </div>
                      
                      <p class="text-body-2 text-grey-darken-1 mb-2">{{ group.description }}</p>
                      
                      <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center ga-4">
                          <div class="d-flex align-center">
                            <v-icon size="16" class="mr-1">mdi-account-group</v-icon>
                            <span class="text-body-2">{{ group.members }}</span>
                          </div>
                          <div class="d-flex align-center">
                            <v-icon size="16" class="mr-1">mdi-message</v-icon>
                            <span class="text-body-2">{{ group.activity }}</span>
                          </div>
                        </div>
                        
                        <v-btn
                          color="teal-darken-2"
                          variant="flat"
                          size="small"
                          @click="joinGroup(group)"
                        >
                          Rejoindre
                        </v-btn>
                      </div>
                    </div>
                  </div>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-window-item>

        <!-- Groupes par Pays -->
        <v-window-item value="by-country">
          <div class="mb-6">
            <h2 class="text-h5 font-weight-bold mb-4">
              <v-icon class="mr-2">mdi-map</v-icon>
              Groupes par Pays
            </h2>
            
            <v-row>
              <v-col
                v-for="country in countriesWithGroups"
                :key="country.name"
                cols="12"
                md="3"
              >
                <v-card class="country-card text-center pa-4" elevation="2" hover>
                  <v-avatar size="64" class="mb-3" :color="country.color">
                    <span class="text-h4">{{ country.flag }}</span>
                  </v-avatar>
                  
                  <h3 class="text-h6 font-weight-bold mb-2">{{ country.name }}</h3>
                  
                  <div class="mb-3">
                    <div class="text-h6 font-weight-bold text-primary">{{ country.groupCount }}</div>
                    <div class="text-body-2 text-grey-darken-1">groupes actifs</div>
                  </div>
                  
                  <div class="mb-4">
                    <div class="text-body-1 font-weight-medium">{{ country.memberCount }}</div>
                    <div class="text-body-2 text-grey-darken-1">membres</div>
                  </div>
                  
                  <v-btn
                    :color="country.color"
                    variant="flat"
                    size="small"
                    block
                    @click="viewCountryGroups(country)"
                  >
                    Voir les groupes
                  </v-btn>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-window-item>
      </v-window>
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
const activeTab = ref('recommended')
const searchQuery = ref('')
const selectedCategory = ref(null)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Static data
const categories = [
  'Énergies Renouvelables',
  'Agriculture Durable',
  'Gestion des Déchets',
  'Transport Vert',
  'Construction Écologique',
  'Fintech Verte'
]

const recommendedGroups = ref([
  {
    id: 1,
    name: 'Énergie Solaire Afrique de l\'Ouest',
    description: 'Communauté dédiée au développement de l\'énergie solaire en Afrique de l\'Ouest. Partagez vos expériences, découvrez les innovations technologiques.',
    members: 1234,
    posts: 125,
    category: 'Énergies Renouvelables',
    categoryColor: 'green',
    type: 'public',
    color: 'blue',
    icon: 'mdi-solar-power',
    cover: null
  },
  {
    id: 2,
    name: 'Fintech Verte Afrique',
    description: 'Innovation financière pour l\'économie verte africaine. Blockchain, paiements verts, solutions fintech environnementales et nouvelles technologies.',
    members: 876,
    posts: 89,
    category: 'Fintech Verte',
    categoryColor: 'purple',
    type: 'public',
    color: 'teal',
    icon: 'mdi-leaf',
    cover: null
  },
  {
    id: 3,
    name: 'AgriTech & Innovation',
    description: 'Technologies agricoles durables et drones pour l\'agriculture. Techniques de pointe pour une agriculture respectueuse de l\'environnement.',
    members: 1104,
    posts: 234,
    category: 'Agriculture Durable',
    categoryColor: 'green',
    type: 'private',
    color: 'green',
    icon: 'mdi-sprout',
    cover: null
  }
])

const popularGroups = ref([
  {
    id: 4,
    name: 'Économie Circulaire Afrique',
    description: 'Communauté dédiée à l\'économie circulaire en Afrique',
    members: '1,567 membres',
    activity: 'Très actif',
    type: 'public',
    color: 'orange',
    icon: 'mdi-recycle'
  },
  {
    id: 5,
    name: 'Carbon Trading Africa',
    description: 'Marché du carbone et compensation carbone en Afrique',
    members: '234 membres',
    activity: 'Actif',
    type: 'private',
    color: 'red',
    icon: 'mdi-chart-line'
  }
])

const countriesWithGroups = ref([
  {
    name: 'Nigeria',
    flag: '🇳🇬',
    groupCount: 23,
    memberCount: '2,789 membres',
    color: 'green'
  },
  {
    name: 'Kenya',
    flag: '🇰🇪',
    groupCount: 18,
    memberCount: '2,098 membres',
    color: 'red'
  },
  {
    name: 'Maroc',
    flag: '🇲🇦',
    groupCount: 15,
    memberCount: '1,567 membres',
    color: 'red'
  },
  {
    name: 'Ghana',
    flag: '🇬🇭',
    groupCount: 12,
    memberCount: '1,234 membres',
    color: 'orange'
  }
])

// Methods
const joinGroup = (group) => {
  showMessage(`Demande d'adhésion envoyée pour "${group.name}"`, 'success')
}

const seeAllRecommended = () => {
  activeTab.value = 'all'
}

const viewCountryGroups = (country) => {
  showMessage(`Affichage des groupes pour ${country.name}`, 'info')
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
.groups-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.hero-banner {
  background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
}

.group-card {
  transition: transform 0.2s ease-in-out;
  border-radius: 12px !important;
}

.group-card:hover {
  transform: translateY(-4px);
}

.group-avatar {
  position: absolute;
  bottom: -24px;
  left: 16px;
  border: 3px solid white;
}

.card-overlay {
  position: absolute;
  top: 0;
  right: 0;
}

.group-card-horizontal {
  border-radius: 12px !important;
  transition: transform 0.2s ease-in-out;
}

.group-card-horizontal:hover {
  transform: translateY(-2px);
}

.country-card {
  border-radius: 12px !important;
  transition: transform 0.2s ease-in-out;
}

.country-card:hover {
  transform: translateY(-2px);
}

.v-btn {
  border-radius: 8px !important;
}

.v-tab {
  text-transform: none !important;
}
</style>
