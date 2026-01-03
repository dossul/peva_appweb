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
                <h1 class="text-h3 font-weight-bold mb-2">Communautés 2iEGreenHub</h1>
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
                <div class="text-h4 font-weight-bold">{{ formatNumber(stats.groups) }}</div>
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
                <div class="text-h4 font-weight-bold">{{ formatNumber(stats.members) }}</div>
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
                <div class="text-h4 font-weight-bold">{{ stats.discussions }}</div>
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
                <div class="text-h4 font-weight-bold">{{ stats.events }}</div>
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
import { supabase } from '@/lib/supabase'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const activeTab = ref('recommended')
const searchQuery = ref('')
const selectedCategory = ref(null)
const loading = ref(false)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Stats depuis Supabase
const stats = ref({
  groups: 0,
  members: 0,
  discussions: 0,
  events: 0
})

// Données depuis Supabase
const categories = ref([])
const recommendedGroups = ref([])
const popularGroups = ref([])
const countriesWithGroups = ref([])

// Charger les statistiques
const loadStats = async () => {
  try {
    const { count: groupsCount } = await supabase
      .from('pev_groups')
      .select('*', { count: 'exact', head: true })
      .eq('is_active', true)

    const { count: membersCount } = await supabase
      .from('pev_group_members')
      .select('*', { count: 'exact', head: true })

    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
    const { count: discussionsCount } = await supabase
      .from('pev_group_posts')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', oneWeekAgo.toISOString())

    // Charger les événements (optionnel si la table existe)
    let eventsCount = 0
    try {
      const { count } = await supabase
        .from('pev_events')
        .select('*', { count: 'exact', head: true })
        .gte('start_date', new Date().toISOString())
      eventsCount = count || 0
    } catch {
      // Table pev_events n'existe pas encore - pas grave
    }

    stats.value = {
      groups: groupsCount || 0,
      members: membersCount || 0,
      discussions: discussionsCount || 0,
      events: eventsCount
    }
  } catch (error) {
    console.log('Stats groupes non disponibles')
  }
}

// Charger les catégories
const loadCategories = async () => {
  try {
    const { data } = await supabase
      .from('pev_group_categories')
      .select('name')
      .order('name')

    if (data && data.length > 0) {
      categories.value = data.map(c => c.name)
    } else {
      categories.value = [
        'Énergies Renouvelables',
        'Agriculture Durable',
        'Gestion des Déchets',
        'Transport Vert',
        'Construction Écologique',
        'Fintech Verte'
      ]
    }
  } catch (error) {
    categories.value = ['Énergies Renouvelables', 'Agriculture Durable']
  }
}

// Charger les groupes recommandés
const loadRecommendedGroups = async () => {
  try {
    const { data } = await supabase
      .from('pev_groups')
      .select('*')
      .eq('is_active', true)
      .order('members_count', { ascending: false })
      .limit(6)

    if (data && data.length > 0) {
      recommendedGroups.value = data.map(g => ({
        id: g.id,
        name: g.name,
        description: g.description || '',
        members: g.members_count || 0,
        posts: g.posts_count || 0,
        category: g.category || 'Général',
        categoryColor: g.category_color || 'teal',
        type: g.is_public ? 'public' : 'private',
        color: g.color || 'teal',
        icon: g.icon || 'mdi-account-group',
        cover: g.cover_url
      }))
    }
  } catch (error) {
    console.log('Groupes recommandés non disponibles')
  }
}

// Charger les groupes populaires
const loadPopularGroups = async () => {
  try {
    const { data } = await supabase
      .from('pev_groups')
      .select('*')
      .eq('is_active', true)
      .order('members_count', { ascending: false })
      .limit(4)

    if (data && data.length > 0) {
      popularGroups.value = data.map(g => ({
        id: g.id,
        name: g.name,
        description: g.description || '',
        members: `${g.members_count || 0} membres`,
        activity: g.posts_count > 50 ? 'Très actif' : 'Actif',
        type: g.is_public ? 'public' : 'private',
        color: g.color || 'teal',
        icon: g.icon || 'mdi-account-group'
      }))
    }
  } catch (error) {
    console.log('Groupes populaires non disponibles')
  }
}

// Charger les groupes par pays
const loadCountriesWithGroups = async () => {
  try {
    const { data } = await supabase
      .from('pev_countries')
      .select('id, name, flag, code')
      .order('name')
      .limit(8)

    if (data && data.length > 0) {
      const countriesData = await Promise.all(data.map(async (country) => {
        const { count: groupCount } = await supabase
          .from('pev_groups')
          .select('*', { count: 'exact', head: true })
          .eq('country_id', country.id)
          .eq('is_active', true)

        return {
          id: country.id,
          name: country.name,
          flag: country.flag || '🌍',
          groupCount: groupCount || 0,
          memberCount: '0 membres',
          color: 'teal'
        }
      }))

      countriesWithGroups.value = countriesData.filter(c => c.groupCount > 0)
    }
  } catch (error) {
    console.log('Pays avec groupes non disponibles')
  }
}

// Helpers
const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 1000) return (num / 1000).toFixed(1).replace('.', ',') + 'K'
  return num.toString()
}

// Methods
const joinGroup = async (group) => {
  if (!authStore.isAuthenticated) {
    showMessage('Connectez-vous pour rejoindre un groupe', 'warning')
    return
  }

  try {
    const { error } = await supabase
      .from('pev_group_members')
      .insert({
        group_id: group.id,
        user_id: authStore.user?.id,
        status: group.type === 'public' ? 'approved' : 'pending',
        joined_at: new Date().toISOString()
      })

    if (error) throw error
    showMessage(
      group.type === 'public' 
        ? `Vous avez rejoint "${group.name}"` 
        : `Demande d'adhésion envoyée pour "${group.name}"`,
      'success'
    )
  } catch (error) {
    showMessage('Erreur lors de l\'adhésion', 'error')
  }
}

const seeAllRecommended = () => {
  activeTab.value = 'all'
}

const viewCountryGroups = (country) => {
  showMessage(`Affichage des groupes pour ${country.name}`, 'info')
}

const showMessage = (message, color = 'success') => {
  snackbar.value = { show: true, message, color }
}

// Charger toutes les données
const loadAllData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadStats(),
      loadCategories(),
      loadRecommendedGroups(),
      loadPopularGroups(),
      loadCountriesWithGroups()
    ])
  } catch (error) {
    console.error('Erreur chargement groupes:', error)
  } finally {
    loading.value = false
  }
}

// Initialize
onMounted(() => {
  loadAllData()
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
