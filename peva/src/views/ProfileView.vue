<template>
  <div class="profile-view">
    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-center align-center" style="min-height: 400px;">
      <v-progress-circular indeterminate color="green" size="64" />
    </div>

    <!-- Contenu du profil -->
    <template v-else>
    <div class="profile-banner bg-green-darken-2 text-white py-12">
      <v-container>
        <div class="d-flex align-center">
          <!-- Avatar -->
          <div class="position-relative mr-6">
            <v-avatar size="120" class="profile-avatar">
              <v-img
                v-if="profileData.avatar_url"
                :src="profileData.avatar_url"
                :alt="fullName"
              />
              <div v-else class="d-flex align-center justify-center bg-white text-green-darken-2">
                <span class="text-h3 font-weight-bold">{{ initials }}</span>
              </div>
            </v-avatar>
            <v-btn
              icon="mdi-camera"
              size="small"
              color="white"
              class="position-absolute"
              style="bottom: 0; right: 0;"
              @click="uploadAvatar"
            />
          </div>
          
          <!-- Informations principales -->
          <div class="flex-grow-1">
            <h1 class="text-h3 font-weight-bold mb-2">{{ fullName }}</h1>
            <p class="text-h6 mb-2">{{ profileData.user_type }} • {{ profileData.sector }}</p>
            <div class="d-flex align-center mb-3">
              <v-icon class="mr-2">mdi-map-marker</v-icon>
              <span>{{ profileData.location }}</span>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="d-flex flex-column ga-2">
            <v-btn 
              color="white" 
              variant="flat" 
              prepend-icon="mdi-account-edit" 
              class="text-green-darken-2"
              @click="router.push('/settings')"
            >
              Modifier mon profil
            </v-btn>
            <v-btn 
              color="white" 
              variant="outlined" 
              prepend-icon="mdi-eye"
              @click="router.push(`/user/${authStore.user?.id}`)"
            >
              Voir mon profil public
            </v-btn>
          </div>
        </div>
        
        <!-- Statistiques -->
        <v-row class="mt-6">
          <v-col cols="4" class="text-center">
            <div class="text-h4 font-weight-bold">{{ stats.connections }}</div>
            <div class="text-body-2">Connexions</div>
          </v-col>
          <v-col cols="4" class="text-center">
            <div class="text-h4 font-weight-bold">{{ stats.opportunities }}</div>
            <div class="text-body-2">Opportunités</div>
          </v-col>
          <v-col cols="4" class="text-center">
            <div class="text-h4 font-weight-bold">{{ stats.profileViews }}</div>
            <div class="text-body-2">Vues profil</div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <v-container class="py-8">
      <v-row>
        <!-- Colonne principale -->
        <v-col cols="12" md="8">
          <!-- À propos -->
          <v-card class="mb-6" elevation="2">
            <v-card-title class="pa-4">
              <v-icon class="mr-2">mdi-account</v-icon>
              À propos
            </v-card-title>
            <v-card-text class="pa-4">
              <p class="text-body-1 mb-4">{{ profileData.bio }}</p>
              
              <!-- Secteurs d'expertise -->
              <div class="mb-4">
                <h3 class="text-h6 font-weight-bold mb-2">Secteurs d'expertise</h3>
                <div class="d-flex flex-wrap ga-2">
                  <v-chip
                    v-for="sector in expertiseSectors"
                    :key="sector.id"
                    :color="sector.color"
                    size="small"
                    :prepend-icon="sector.icon"
                  >
                    {{ sector.name }}
                  </v-chip>
                </div>
              </div>
              
              <!-- Liens -->
              <div>
                <h3 class="text-h6 font-weight-bold mb-2">Liens</h3>
                <div class="d-flex flex-column ga-2">
                  <div v-for="link in profileLinks" :key="link.type" class="d-flex align-center">
                    <v-icon :color="link.color" class="mr-2">{{ link.icon }}</v-icon>
                    <a :href="link.url" target="_blank" class="text-decoration-none">
                      {{ link.label }}
                    </a>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
          
          <!-- Activités récentes -->
          <v-card class="mb-6" elevation="2">
            <v-card-title class="pa-4">
              <v-icon class="mr-2">mdi-history</v-icon>
              Activités récentes
            </v-card-title>
            <v-list class="pa-0">
              <v-list-item
                v-for="activity in recentActivities"
                :key="activity.id"
                class="px-4 py-3"
              >
                <template v-slot:prepend>
                  <v-avatar :color="activity.color" size="32">
                    <v-icon color="white" size="16">{{ activity.icon }}</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-1">{{ activity.title }}</v-list-item-title>
                <v-list-item-subtitle class="text-body-2">{{ activity.time }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
          
          <!-- Opportunités créées -->
          <v-card elevation="2">
            <v-card-title class="pa-4 d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon class="mr-2">mdi-briefcase</v-icon>
                Opportunités créées
              </div>
              <v-btn variant="text" color="primary" size="small" @click="router.push('/my-opportunities')">
                Voir toutes
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-4">
              <div
                v-for="opportunity in createdOpportunities"
                :key="opportunity.id"
                class="d-flex align-center pa-3 mb-3 bg-grey-lighten-5 rounded cursor-pointer"
                style="cursor: pointer;"
                @click="router.push('/my-opportunities')"
              >
                <v-avatar :color="opportunity.color" size="32" class="mr-3">
                  <v-icon color="white" size="16">{{ opportunity.icon }}</v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <h4 class="text-body-1 font-weight-bold">{{ opportunity.title }}</h4>
                  <p class="text-body-2 text-grey-darken-1 ma-0">{{ opportunity.description }}</p>
                  <div class="d-flex align-center mt-1">
                    <v-chip size="x-small" :color="opportunity.typeColor" class="mr-2">
                      {{ opportunity.type }}
                    </v-chip>
                    <span class="text-caption">{{ opportunity.funding }} • {{ opportunity.applications }}</span>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <!-- Sidebar droite -->
        <v-col cols="12" md="4">
          <!-- Mes messages -->
          <v-card class="mb-4" elevation="2">
            <v-card-title class="pa-4">Messagerie</v-card-title>
            <v-card-text class="pa-4">
              <v-btn
                color="green-darken-2"
                variant="flat"
                block
                prepend-icon="mdi-email"
                class="mb-3"
                @click="router.push('/messages')"
              >
                Mes messages
              </v-btn>
              <v-btn
                color="blue"
                variant="outlined"
                block
                prepend-icon="mdi-account-group"
                @click="router.push('/connections')"
              >
                Gérer mes connexions
              </v-btn>
            </v-card-text>
          </v-card>
          
          <!-- Connexions -->
          <v-card class="mb-4" elevation="2">
            <v-card-title class="pa-4">Mes Connexions</v-card-title>
            <v-card-text class="pa-4">
              <div v-if="userConnections.length === 0" class="text-body-2 text-grey-darken-1">
                Aucune connexion pour le moment
              </div>
              <div 
                v-for="conn in userConnections" 
                :key="conn.id" 
                class="d-flex align-center mb-3 cursor-pointer"
                style="cursor: pointer;"
                @click="router.push(`/user/${conn.id}`)"
              >
                <v-avatar size="32" class="mr-3">
                  <v-img v-if="conn.avatar_url" :src="conn.avatar_url" />
                  <span v-else class="text-caption">{{ conn.name?.charAt(0) || '?' }}</span>
                </v-avatar>
                <div>
                  <div class="text-body-2 font-weight-bold">{{ conn.name || 'Utilisateur' }}</div>
                  <div class="text-caption text-grey-darken-1">{{ conn.user_type || 'Membre' }}</div>
                </div>
              </div>
              <v-btn variant="text" size="small" color="primary" @click="router.push('/connections')">
                Voir toutes les connexions
              </v-btn>
            </v-card-text>
          </v-card>
          
          <!-- Informations supplémentaires -->
          <v-card elevation="2">
            <v-card-title class="pa-4">Informations</v-card-title>
            <v-card-text class="pa-4">
              <div class="mb-3" v-if="profileData.organization">
                <div class="text-caption text-grey-darken-1">Organisation</div>
                <div class="text-body-2 font-weight-bold">{{ profileData.organization }}</div>
              </div>
              <div class="mb-3" v-if="profileData.sector">
                <div class="text-caption text-grey-darken-1">Secteur</div>
                <div class="text-body-2 font-weight-bold">{{ profileData.sector }}</div>
              </div>
              <div class="mb-3" v-if="profileData.location">
                <div class="text-caption text-grey-darken-1">Localisation</div>
                <div class="text-body-2 font-weight-bold">{{ profileData.location }}</div>
              </div>
              <div v-if="profileData.phone">
                <div class="text-caption text-grey-darken-1">Téléphone</div>
                <div class="text-body-2 font-weight-bold">{{ profileData.phone }}</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
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
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data - chargé depuis authStore
const loading = ref(true)
const profileData = ref({
  first_name: '',
  last_name: '',
  user_type: '',
  sector: '',
  location: '',
  bio: '',
  avatar_url: null,
  email: ''
})

const stats = ref({
  connections: 0,
  opportunities: 0,
  profileViews: 0
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Computed properties
const fullName = computed(() => {
  return `${profileData.value.first_name} ${profileData.value.last_name}`
})

const initials = computed(() => {
  return `${profileData.value.first_name?.[0] || ''}${profileData.value.last_name?.[0] || ''}`
})

// Données dynamiques depuis Supabase
const expertiseSectors = ref([])
const profileLinks = ref([])
const recentActivities = ref([])
const createdOpportunities = ref([])
const userConnections = ref([])

// Methods
const uploadAvatar = () => {
  showMessage('Fonctionnalité d\'upload à implémenter', 'info')
}

const sendMessage = () => {
  showMessage('Redirection vers la messagerie', 'info')
}

const openLinkedIn = () => {
  window.open('https://linkedin.com/in/aminakone', '_blank')
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
  loadProfile()
})

const loadProfile = async () => {
  loading.value = true
  try {
    const user = authStore.user
    const profile = user?.profile || {}
    
    profileData.value = {
      first_name: profile.first_name || user?.user_metadata?.first_name || '',
      last_name: profile.last_name || user?.user_metadata?.last_name || '',
      user_type: profile.user_type || user?.user_metadata?.user_type || 'Utilisateur',
      sector: profile.sector || profile.activity_sector || '',
      location: profile.location || profile.city || '',
      bio: profile.bio || profile.description || '',
      avatar_url: profile.avatar_url || null,
      email: profile.email || user?.email || '',
      phone: profile.phone || '',
      organization: profile.organization || '',
      website: profile.website || '',
      linkedin: profile.linkedin || ''
    }
    
    // Charger les statistiques et données dynamiques
    await Promise.all([
      loadStats(),
      loadOpportunities(),
      loadActivities(),
      loadConnections()
    ])
    
    // Charger les liens du profil depuis les données
    loadProfileLinks()
  } catch (error) {
    console.error('Erreur chargement profil:', error)
    showMessage('Erreur lors du chargement du profil', 'error')
  } finally {
    loading.value = false
  }
}

const loadOpportunities = async () => {
  const userId = authStore.user?.id
  if (!userId) return
  
  try {
    const { data, error } = await supabase
      .from('pev_opportunities')
      .select('id, title, description, type, status, funding_amount, currency, created_at')
      .eq('created_by', userId)
      .order('created_at', { ascending: false })
      .limit(5)
    
    if (!error && data) {
      createdOpportunities.value = data.map(opp => ({
        id: opp.id,
        title: opp.title,
        description: opp.description?.substring(0, 100) + '...' || '',
        type: opp.type || 'Opportunité',
        typeColor: getTypeColor(opp.type),
        color: getTypeColor(opp.type),
        icon: getTypeIcon(opp.type),
        funding: opp.funding_amount ? `${opp.funding_amount} ${opp.currency || 'FCFA'}` : null,
        status: opp.status
      }))
    }
  } catch (e) { console.warn('Erreur chargement opportunités:', e.message) }
}

const loadActivities = async () => {
  const userId = authStore.user?.id
  if (!userId) return
  
  const activities = []
  
  try {
    // Charger les dernières opportunités créées
    const { data: opps } = await supabase
      .from('pev_opportunities')
      .select('id, title, created_at')
      .eq('created_by', userId)
      .order('created_at', { ascending: false })
      .limit(3)
    
    if (opps) {
      opps.forEach(opp => {
        activities.push({
          id: `opp-${opp.id}`,
          title: `Opportunité publiée: ${opp.title}`,
          time: formatRelativeTime(opp.created_at),
          icon: 'mdi-briefcase-plus',
          color: 'blue'
        })
      })
    }
  } catch (e) { /* ignore */ }
  
  try {
    // Charger les événements - requête séparée sans jointure problématique
    const { data: participations } = await supabase
      .from('pev_event_participants')
      .select('event_id, registration_date')
      .eq('user_id', userId)
      .order('registration_date', { ascending: false })
      .limit(3)
    
    if (participations && participations.length > 0) {
      // Récupérer les titres des événements
      const eventIds = participations.map(p => p.event_id)
      const { data: eventsData } = await supabase
        .from('pev_events')
        .select('id, title')
        .in('id', eventIds)
      
      const eventsMap = {}
      if (eventsData) {
        eventsData.forEach(e => eventsMap[e.id] = e.title)
      }
      
      participations.forEach(p => {
        activities.push({
          id: `evt-${p.event_id}`,
          title: `Participation: ${eventsMap[p.event_id] || 'Événement'}`,
          time: formatRelativeTime(p.registration_date),
          icon: 'mdi-calendar-check',
          color: 'green'
        })
      })
    }
  } catch (e) { /* ignore */ }
  
  // Trier par date et limiter
  recentActivities.value = activities.slice(0, 5)
}

const loadConnections = async () => {
  const userId = authStore.user?.id
  if (!userId) return
  
  try {
    // Connexions où l'utilisateur est requester
    const { data: conn1 } = await supabase
      .from('pev_connections')
      .select('addressee_id, pev_profiles!pev_connections_addressee_id_fkey(first_name, last_name, avatar_url, user_type)')
      .eq('requester_id', userId)
      .eq('status', 'accepted')
      .limit(5)
    
    // Connexions où l'utilisateur est addressee
    const { data: conn2 } = await supabase
      .from('pev_connections')
      .select('requester_id, pev_profiles!pev_connections_requester_id_fkey(first_name, last_name, avatar_url, user_type)')
      .eq('addressee_id', userId)
      .eq('status', 'accepted')
      .limit(5)
    
    const connections = []
    
    if (conn1) {
      conn1.forEach(c => {
        if (c.pev_profiles) {
          connections.push({
            id: c.addressee_id,
            name: `${c.pev_profiles.first_name || ''} ${c.pev_profiles.last_name || ''}`.trim(),
            avatar_url: c.pev_profiles.avatar_url,
            user_type: c.pev_profiles.user_type || 'Utilisateur'
          })
        }
      })
    }
    
    if (conn2) {
      conn2.forEach(c => {
        if (c.pev_profiles) {
          connections.push({
            id: c.requester_id,
            name: `${c.pev_profiles.first_name || ''} ${c.pev_profiles.last_name || ''}`.trim(),
            avatar_url: c.pev_profiles.avatar_url,
            user_type: c.pev_profiles.user_type || 'Utilisateur'
          })
        }
      })
    }
    
    userConnections.value = connections.slice(0, 6)
  } catch (e) { console.warn('Erreur chargement connexions:', e.message) }
}

const loadProfileLinks = () => {
  const links = []
  
  if (profileData.value.website) {
    links.push({
      type: 'website',
      label: profileData.value.website.replace(/^https?:\/\//, ''),
      url: profileData.value.website,
      icon: 'mdi-web',
      color: 'blue'
    })
  }
  
  if (profileData.value.linkedin) {
    links.push({
      type: 'linkedin',
      label: profileData.value.linkedin.replace(/^https?:\/\//, ''),
      url: profileData.value.linkedin,
      icon: 'mdi-linkedin',
      color: 'blue'
    })
  }
  
  if (profileData.value.email) {
    links.push({
      type: 'email',
      label: profileData.value.email,
      url: `mailto:${profileData.value.email}`,
      icon: 'mdi-email',
      color: 'red'
    })
  }
  
  profileLinks.value = links
}

const getTypeColor = (type) => {
  const colors = {
    'Financement': 'blue',
    'Emploi': 'green',
    'Partenariat': 'purple',
    'Appel d\'offres': 'orange',
    'job': 'green',
    'funding': 'blue',
    'partnership': 'purple',
    'tender': 'orange'
  }
  return colors[type] || 'grey'
}

const getTypeIcon = (type) => {
  const icons = {
    'Financement': 'mdi-currency-eur',
    'Emploi': 'mdi-briefcase-account',
    'Partenariat': 'mdi-handshake',
    'Appel d\'offres': 'mdi-file-document',
    'job': 'mdi-briefcase-account',
    'funding': 'mdi-currency-eur',
    'partnership': 'mdi-handshake',
    'tender': 'mdi-file-document'
  }
  return icons[type] || 'mdi-briefcase'
}

const formatRelativeTime = (dateStr) => {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return "Aujourd'hui"
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return `Il y a ${diffDays} jours`
  if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaine(s)`
  return `Il y a ${Math.floor(diffDays / 30)} mois`
}

const loadStats = async () => {
  const userId = authStore.user?.id
  if (!userId) return
  
  let oppCount = 0
  let connCount = 0
  
  try {
    // Compter les opportunités créées
    const { count, error } = await supabase
      .from('pev_opportunities')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', userId)
    if (!error) oppCount = count || 0
  } catch (e) { /* table peut ne pas exister */ }
  
  try {
    // Compter les connexions (requester)
    const { count: c1 } = await supabase
      .from('pev_connections')
      .select('*', { count: 'exact', head: true })
      .eq('requester_id', userId)
      .eq('status', 'accepted')
    
    // Compter les connexions (addressee - pas receiver)
    const { count: c2 } = await supabase
      .from('pev_connections')
      .select('*', { count: 'exact', head: true })
      .eq('addressee_id', userId)
      .eq('status', 'accepted')
    
    connCount = (c1 || 0) + (c2 || 0)
  } catch (e) { /* table peut ne pas exister */ }
  
  // Vues profil depuis pev_profiles
  const profile = authStore.user?.profile
  
  stats.value = {
    connections: connCount,
    opportunities: oppCount,
    profileViews: profile?.views_count || 0
  }
}
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.profile-banner {
  background: linear-gradient(135deg, #2e7d32 0%, #388e3c 100%);
}

.profile-avatar {
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.v-card {
  border-radius: 12px !important;
}

.v-btn {
  border-radius: 8px !important;
}
</style>
