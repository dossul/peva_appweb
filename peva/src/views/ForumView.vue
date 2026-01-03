<template>
  <div class="forum-view">
    <!-- Header avec bannière -->
    <div class="hero-banner bg-purple-darken-1 text-white py-8">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon size="48" class="mr-4">mdi-forum</v-icon>
            <div>
              <h1 class="text-h3 font-weight-bold mb-2">Forum 2iEGreenHub</h1>
              <p class="text-h6 font-weight-regular ma-0">Échangez, partagez et débattez avec la communauté de l'économie verte</p>
            </div>
          </div>
          <v-btn
            color="white"
            variant="flat"
            size="large"
            prepend-icon="mdi-plus"
            class="text-purple-darken-1"
            @click="createTopicDialog = true"
          >
            Nouveau Sujet
          </v-btn>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <!-- Statistiques -->
      <v-row class="mb-8">
        <v-col cols="12" md="3">
          <v-card class="text-center pa-4" color="blue-lighten-5">
            <v-icon size="32" color="blue-darken-2" class="mb-2">mdi-forum</v-icon>
            <div class="text-h4 font-weight-bold text-blue-darken-2">{{ formatNumber(stats.discussions) }}</div>
            <div class="text-body-2">Discussions actives</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="text-center pa-4" color="green-lighten-5">
            <v-icon size="32" color="green-darken-2" class="mb-2">mdi-account-multiple</v-icon>
            <div class="text-h4 font-weight-bold text-green-darken-2">{{ formatNumber(stats.members) }}</div>
            <div class="text-body-2">Membres actifs</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="text-center pa-4" color="purple-lighten-5">
            <v-icon size="32" color="purple-darken-2" class="mb-2">mdi-message-reply</v-icon>
            <div class="text-h4 font-weight-bold text-purple-darken-2">{{ stats.repliesToday }}</div>
            <div class="text-body-2">Réponses aujourd'hui</div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card class="text-center pa-4" color="orange-lighten-5">
            <v-icon size="32" color="orange-darken-2" class="mb-2">mdi-trending-up</v-icon>
            <div class="text-h4 font-weight-bold text-orange-darken-2">{{ stats.trending }}</div>
            <div class="text-body-2">Sujets tendance</div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Barre de recherche -->
      <v-card class="mb-6" elevation="2">
        <v-card-text class="pa-4">
          <v-row align="center">
            <v-col cols="12" md="8">
              <v-text-field
                v-model="searchQuery"
                placeholder="Rechercher dans le forum..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                clearable
                hide-details
              />
            </v-col>
            <v-col cols="12" md="4">
              <v-select
                v-model="selectedCategory"
                :items="['Toutes catégories', ...categories.map(c => c.name)]"
                label="Plus récent"
                variant="outlined"
                density="compact"
                hide-details
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <v-row>
        <!-- Catégories du Forum -->
        <v-col cols="12" md="8">
          <v-card elevation="2">
            <v-card-title class="pa-4">
              <v-icon class="mr-2">mdi-view-grid</v-icon>
              Catégories du Forum
            </v-card-title>
            <v-card-text class="pa-0">
              <div
                v-for="category in categories"
                :key="category.id"
                class="category-item pa-4 border-b"
                @click="selectCategory(category)"
              >
                <div class="d-flex align-center">
                  <v-avatar :color="category.color" size="48" class="mr-4">
                    <v-icon color="white" size="24">{{ category.icon }}</v-icon>
                  </v-avatar>
                  
                  <div class="flex-grow-1">
                    <h3 class="text-h6 font-weight-bold mb-1">{{ category.name }}</h3>
                    <p class="text-body-2 text-grey-darken-1 mb-2">{{ category.description }}</p>
                    <div class="d-flex align-center ga-4">
                      <span class="text-body-2">{{ category.discussions }} discussions</span>
                      <span class="text-body-2">{{ category.messages }} messages</span>
                    </div>
                  </div>
                  
                  <div class="text-center">
                    <div class="text-h6 font-weight-bold">{{ category.discussions }}</div>
                    <div class="text-caption text-grey-darken-1">discussions</div>
                  </div>
                  
                  <div class="text-center ml-4">
                    <div class="text-h6 font-weight-bold">{{ category.messages }}</div>
                    <div class="text-caption text-grey-darken-1">messages</div>
                  </div>
                  
                  <v-btn
                    :color="category.color"
                    variant="flat"
                    size="small"
                    class="ml-4"
                  >
                    Explorez →
                  </v-btn>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Discussions Populaires -->
          <v-card class="mt-6" elevation="2">
            <v-card-title class="pa-4 d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon class="mr-2">mdi-star</v-icon>
                Discussions Populaires
              </div>
              <v-btn variant="text" color="purple-darken-1" size="small">
                Voir toutes
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-0">
              <div
                v-for="discussion in popularDiscussions"
                :key="discussion.id"
                class="discussion-item pa-4 border-b"
              >
                <div class="d-flex align-start">
                  <v-avatar :color="discussion.authorColor" size="32" class="mr-3">
                    <span class="text-white font-weight-bold">{{ discussion.authorInitials }}</span>
                  </v-avatar>
                  
                  <div class="flex-grow-1">
                    <div class="d-flex align-center mb-1">
                      <h4 class="text-body-1 font-weight-bold mr-2">{{ discussion.title }}</h4>
                      <v-icon v-if="discussion.isPinned" size="16" color="orange">mdi-pin</v-icon>
                    </div>
                    
                    <div class="d-flex align-center mb-2">
                      <span class="text-body-2 text-grey-darken-1 mr-2">Par {{ discussion.author }}</span>
                      <v-chip size="x-small" :color="discussion.categoryColor">
                        {{ discussion.category }}
                      </v-chip>
                      <span class="text-body-2 text-grey-darken-1 ml-2">{{ discussion.time }}</span>
                    </div>
                    
                    <div class="d-flex align-center">
                      <div class="d-flex align-center mr-4">
                        <v-icon size="16" class="mr-1">mdi-message</v-icon>
                        <span class="text-body-2">{{ discussion.replies }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <v-icon size="16" class="mr-1">mdi-eye</v-icon>
                        <span class="text-body-2">{{ discussion.views }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>

          <!-- Discussions Récentes -->
          <v-card class="mt-6" elevation="2">
            <v-card-title class="pa-4 d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon class="mr-2">mdi-clock</v-icon>
                Discussions Récentes
              </div>
              <v-btn variant="text" color="purple-darken-1" size="small">
                Voir toutes
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-0">
              <div
                v-for="discussion in recentDiscussions"
                :key="discussion.id"
                class="discussion-item pa-4 border-b"
              >
                <div class="d-flex align-start">
                  <v-avatar :color="discussion.authorColor" size="32" class="mr-3">
                    <span class="text-white font-weight-bold">{{ discussion.authorInitials }}</span>
                  </v-avatar>
                  
                  <div class="flex-grow-1">
                    <h4 class="text-body-1 font-weight-bold mb-1">{{ discussion.title }}</h4>
                    
                    <div class="d-flex align-center mb-2">
                      <span class="text-body-2 text-grey-darken-1 mr-2">Par {{ discussion.author }}</span>
                      <v-chip size="x-small" :color="discussion.categoryColor">
                        {{ discussion.category }}
                      </v-chip>
                      <span class="text-body-2 text-grey-darken-1 ml-2">{{ discussion.time }}</span>
                    </div>
                    
                    <div class="d-flex align-center">
                      <div class="d-flex align-center mr-4">
                        <v-icon size="16" class="mr-1">mdi-message</v-icon>
                        <span class="text-body-2">{{ discussion.replies }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <v-icon size="16" class="mr-1">mdi-eye</v-icon>
                        <span class="text-body-2">{{ discussion.views }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Sidebar droite -->
        <v-col cols="12" md="4">
          <!-- Membres Actifs de la Communauté -->
          <v-card class="mb-4" elevation="2">
            <v-card-title class="pa-4">
              <v-icon class="mr-2">mdi-account-group</v-icon>
              Membres Actifs de la Communauté
            </v-card-title>
            <v-card-text class="pa-4">
              <div
                v-for="member in activeMembers"
                :key="member.id"
                class="d-flex align-center mb-3"
              >
                <v-avatar :color="member.color" size="40" class="mr-3">
                  <span class="text-white font-weight-bold">{{ member.initials }}</span>
                </v-avatar>
                <div class="flex-grow-1">
                  <div class="text-body-1 font-weight-bold">{{ member.name }}</div>
                  <div class="text-body-2 text-grey-darken-1">{{ member.title }}</div>
                  <v-chip :color="member.statusColor" size="x-small" class="mt-1">
                    {{ member.status }}
                  </v-chip>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dialog Nouveau Sujet -->
    <v-dialog v-model="createTopicDialog" max-width="600">
      <v-card>
        <v-card-title class="pa-4">
          <v-icon class="mr-2">mdi-plus</v-icon>
          Créer un nouveau sujet
        </v-card-title>
        <v-card-text class="pa-4">
          <v-text-field
            v-model="newTopic.title"
            label="Titre du sujet *"
            variant="outlined"
            class="mb-4"
          />
          <v-select
            v-model="newTopic.category"
            :items="categories"
            item-title="name"
            item-value="id"
            label="Catégorie *"
            variant="outlined"
            class="mb-4"
          />
          <v-textarea
            v-model="newTopic.content"
            label="Contenu *"
            variant="outlined"
            rows="4"
          />
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="createTopicDialog = false">
            Annuler
          </v-btn>
          <v-btn color="purple-darken-1" variant="flat" @click="createTopic">
            Publier
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const searchQuery = ref('')
const selectedCategory = ref('Toutes catégories')
const createTopicDialog = ref(false)
const loading = ref(false)

const newTopic = ref({
  title: '',
  category: '',
  content: ''
})

// Stats depuis Supabase
const stats = ref({
  discussions: 0,
  members: 0,
  repliesToday: 0,
  trending: 0
})

// Données depuis Supabase
const categories = ref([])
const popularDiscussions = ref([])
const recentDiscussions = ref([])
const activeMembers = ref([])

// Catégories par défaut (utilisées si la table n'existe pas)
const defaultCategories = [
  { id: 1, name: 'Énergie Renouvelable', description: 'Solaire, éolien, hydroélectrique', color: 'orange', icon: 'mdi-solar-power' },
  { id: 2, name: 'Agriculture Durable', description: 'Permaculture, irrigation, sols', color: 'green', icon: 'mdi-leaf' },
  { id: 3, name: 'Finance Verte', description: 'Financement, investissement', color: 'blue', icon: 'mdi-currency-eur' },
  { id: 4, name: 'Transport Vert', description: 'Mobilité durable', color: 'purple', icon: 'mdi-car-electric' },
  { id: 5, name: 'Économie Circulaire', description: 'Recyclage, réutilisation', color: 'teal', icon: 'mdi-recycle' },
  { id: 6, name: 'Innovation & Tech', description: 'IoT, blockchain', color: 'pink', icon: 'mdi-lightbulb' }
]

// Charger les statistiques
const loadStats = async () => {
  try {
    // Compter les topics
    const { count: topicsCount } = await supabase
      .from('pev_forum_topics')
      .select('*', { count: 'exact', head: true })
    
    // Compter les membres actifs
    const { count: membersCount } = await supabase
      .from('pev_profiles')
      .select('*', { count: 'exact', head: true })
      .eq('onboarding_completed', true)
    
    // Compter les posts d'aujourd'hui
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const { count: postsToday } = await supabase
      .from('pev_forum_posts')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', today.toISOString())
    
    stats.value = {
      discussions: topicsCount || 0,
      members: membersCount || 0,
      repliesToday: postsToday || 0,
      trending: Math.min(topicsCount || 0, 10)
    }
  } catch (error) {
    console.log('Stats forum non disponibles')
  }
}

// Charger les catégories
const loadCategories = async () => {
  try {
    const { data, error } = await supabase
      .from('pev_forum_categories')
      .select('*')
      .order('name')
    
    if (!error && data && data.length > 0) {
      categories.value = data.map(cat => ({
        ...cat,
        discussions: 0,
        messages: 0
      }))
    } else {
      categories.value = defaultCategories.map(cat => ({ ...cat, discussions: 0, messages: 0 }))
    }
  } catch (error) {
    categories.value = defaultCategories.map(cat => ({ ...cat, discussions: 0, messages: 0 }))
  }
}

// Charger les discussions populaires
const loadPopularDiscussions = async () => {
  try {
    const { data, error } = await supabase
      .from('pev_forum_topics')
      .select(`
        id, title, views_count, created_at,
        pev_profiles:user_id(first_name, last_name)
      `)
      .order('views_count', { ascending: false })
      .limit(5)
    
    if (!error && data) {
      popularDiscussions.value = data.map(topic => ({
        id: topic.id,
        title: topic.title || 'Sans titre',
        author: topic.pev_profiles ? `${topic.pev_profiles.first_name || ''} ${topic.pev_profiles.last_name || ''}`.trim() : 'Anonyme',
        authorInitials: getInitials(topic.pev_profiles),
        authorColor: getRandomColor(),
        category: 'Forum',
        categoryColor: 'purple',
        time: formatTimeAgo(topic.created_at),
        replies: 0,
        views: topic.views_count || 0,
        isPinned: false
      }))
    }
  } catch (error) {
    console.log('Discussions populaires non disponibles')
  }
}

// Charger les discussions récentes
const loadRecentDiscussions = async () => {
  try {
    const { data, error } = await supabase
      .from('pev_forum_topics')
      .select(`
        id, title, views_count, created_at,
        pev_profiles:user_id(first_name, last_name)
      `)
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (!error && data) {
      recentDiscussions.value = data.map(topic => ({
        id: topic.id,
        title: topic.title || 'Sans titre',
        author: topic.pev_profiles ? `${topic.pev_profiles.first_name || ''} ${topic.pev_profiles.last_name || ''}`.trim() : 'Anonyme',
        authorInitials: getInitials(topic.pev_profiles),
        authorColor: getRandomColor(),
        category: 'Forum',
        categoryColor: 'green',
        time: formatTimeAgo(topic.created_at),
        replies: 0,
        views: topic.views_count || 0
      }))
    }
  } catch (error) {
    console.log('Discussions récentes non disponibles')
  }
}

// Charger les membres actifs
const loadActiveMembers = async () => {
  try {
    const { data, error } = await supabase
      .from('pev_profiles')
      .select('id, first_name, last_name, user_type, role')
      .eq('onboarding_completed', true)
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (!error && data) {
      activeMembers.value = data.map(member => ({
        id: member.id,
        name: `${member.first_name || ''} ${member.last_name || ''}`.trim() || 'Membre',
        title: member.user_type || 'Membre',
        initials: getInitials(member),
        color: getRandomColor(),
        status: member.role === 'admin' ? 'Modérateur' : 'Contributeur',
        statusColor: member.role === 'admin' ? 'purple' : 'blue'
      }))
    }
  } catch (error) {
    console.log('Membres actifs non disponibles')
  }
}

// Helpers
const getInitials = (profile) => {
  if (!profile) return '?'
  const first = (profile.first_name || '')[0] || ''
  const last = (profile.last_name || '')[0] || ''
  return (first + last).toUpperCase() || '?'
}

const getRandomColor = () => {
  const colors = ['green', 'blue', 'purple', 'orange', 'teal', 'pink', 'indigo']
  return colors[Math.floor(Math.random() * colors.length)]
}

const formatTimeAgo = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  if (diffMins < 1) return 'à l\'instant'
  if (diffMins < 60) return `il y a ${diffMins}min`
  if (diffHours < 24) return `il y a ${diffHours}h`
  if (diffDays < 7) return `il y a ${diffDays}j`
  return date.toLocaleDateString('fr-FR')
}

const formatNumber = (num) => {
  if (!num) return '0'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

// Methods
const selectCategory = (category) => {
  console.log('Sélection catégorie:', category.name)
}

const createTopic = () => {
  if (newTopic.value.title && newTopic.value.category && newTopic.value.content) {
    console.log('Création sujet:', newTopic.value)
    createTopicDialog.value = false
    newTopic.value = { title: '', category: '', content: '' }
  }
}

// Charger toutes les données
const loadAllData = async () => {
  loading.value = true
  try {
    await Promise.all([
      loadStats(),
      loadCategories(),
      loadPopularDiscussions(),
      loadRecentDiscussions(),
      loadActiveMembers()
    ])
  } catch (error) {
    console.error('Erreur chargement forum:', error)
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
.forum-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.hero-banner {
  background: linear-gradient(135deg, #6a1b9a 0%, #8e24aa 100%);
}

.category-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.category-item:hover {
  background-color: #f5f5f5;
}

.discussion-item {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.discussion-item:hover {
  background-color: #f9f9f9;
}

.border-b {
  border-bottom: 1px solid #e0e0e0;
}

.v-card {
  border-radius: 12px !important;
}

.v-btn {
  border-radius: 8px !important;
}
</style>
