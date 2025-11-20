<template>
  <v-app>
    <!-- Navigation Drawer -->
    <v-navigation-drawer
      v-model="drawer"
      :rail="rail"
      permanent
      @click="rail = false"
    >
      <v-list-item
        prepend-avatar="/api/placeholder/40/40"
        :title="user?.name || 'Utilisateur'"
        :subtitle="user?.email || 'email@example.com'"
        nav
      >
        <template #append>
          <v-btn
            variant="text"
            icon="mdi-chevron-left"
            @click.stop="rail = !rail"
          ></v-btn>
        </template>
      </v-list-item>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item
          v-for="item in menuItems"
          :key="item.title"
          :prepend-icon="item.icon"
          :title="item.title"
          :value="item.value"
          :to="item.route"
          color="primary"
        ></v-list-item>
      </v-list>

      <template #append>
        <div class="pa-2">
          <v-btn
            block
            color="error"
            variant="outlined"
            prepend-icon="mdi-logout"
            @click="logout"
          >
            Déconnexion
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <!-- App Bar -->
    <v-app-bar
      :order="-1"
      color="primary"
      density="compact"
    >
      <v-app-bar-nav-icon
        variant="text"
        @click.stop="rail = !rail"
      ></v-app-bar-nav-icon>

      <v-app-bar-title>PEVA - Économie Verte</v-app-bar-title>

      <v-spacer></v-spacer>

      <!-- Notifications -->
      <v-btn icon="mdi-bell" variant="text">
        <v-icon>mdi-bell</v-icon>
        <v-badge
          v-if="notifications > 0"
          :content="notifications"
          color="error"
          floating
        ></v-badge>
      </v-btn>

      <!-- User Menu -->
      <v-menu>
        <template #activator="{ props }">
          <v-btn
            v-bind="props"
            icon
            variant="text"
          >
            <v-avatar size="32">
              <v-img :src="user?.avatar || '/api/placeholder/32/32'" alt="Avatar"></v-img>
            </v-avatar>
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="navigateTo('/profile')">
            <v-list-item-title>Mon Profil</v-list-item-title>
          </v-list-item>
          <v-list-item @click="navigateTo('/settings')">
            <v-list-item-title>Paramètres</v-list-item-title>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="logout">
            <v-list-item-title>Déconnexion</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container fluid class="pa-6">
        <!-- Welcome Section -->
        <div class="welcome-section mb-6">
          <v-row align="center">
            <v-col>
              <h1 class="text-h4 font-weight-bold text-primary mb-2">
                Bienvenue, {{ user?.name || 'Utilisateur' }} !
              </h1>
              <p class="text-body-1 text-grey-darken-1 ma-0">
                Découvrez les opportunités de l'économie verte en Afrique
              </p>
            </v-col>
            <v-col cols="auto">
              <v-btn
                color="primary"
                variant="elevated"
                size="large"
                prepend-icon="mdi-plus"
                @click="navigateTo('/opportunities/create')"
              >
                Publier une Opportunité
              </v-btn>
            </v-col>
          </v-row>
        </div>

        <!-- Quick Stats -->
        <v-row class="mb-6">
          <v-col
            v-for="stat in quickStats"
            :key="stat.id"
            cols="12"
            sm="6"
            md="3"
          >
            <v-card class="text-center pa-4 h-100 stat-card">
              <v-avatar :color="stat.color + '-lighten-4'" size="56" class="mb-3">
                <v-icon :color="stat.color" size="28">{{ stat.icon }}</v-icon>
              </v-avatar>
              <div class="text-h4 font-weight-bold text-grey-darken-3 mb-1">{{ stat.value }}</div>
              <div class="text-body-2 text-grey-darken-1">{{ stat.label }}</div>
            </v-card>
          </v-col>
        </v-row>

        <v-row>
          <!-- Main Column -->
          <v-col cols="12" lg="8">
            <!-- Recent Opportunities -->
            <v-card class="mb-6">
              <v-card-title class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-icon class="mr-2" color="green-darken-2">mdi-briefcase</v-icon>
                  Opportunités Récentes
                </div>
                <v-btn size="small" variant="text" color="primary" @click="navigateTo('/opportunities')">
                  Voir toutes
                </v-btn>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col
                    v-for="opportunity in recentOpportunities"
                    :key="opportunity.id"
                    cols="12"
                    md="6"
                  >
                    <v-card variant="outlined" class="opportunity-card h-100">
                      <v-card-text>
                        <div class="d-flex align-center justify-space-between mb-2">
                          <v-chip :color="opportunity.category.color" size="small">
                            {{ opportunity.category.name }}
                          </v-chip>
                          <span class="text-caption text-grey-darken-1">{{ opportunity.date }}</span>
                        </div>
                        <h4 class="text-subtitle-1 font-weight-medium mb-2">{{ opportunity.title }}</h4>
                        <p class="text-body-2 text-grey-darken-1 mb-3">{{ opportunity.description }}</p>
                        <div class="d-flex align-center justify-space-between">
                          <div class="d-flex align-center">
                            <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
                            <span class="text-caption">{{ opportunity.location }}</span>
                          </div>
                          <v-btn size="small" color="primary" variant="outlined">
                            Voir détails
                          </v-btn>
                        </div>
                      </v-card-text>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Connection Requests Status -->
            <v-card class="mb-6">
              <v-card-title class="d-flex align-center justify-space-between">
                <div class="d-flex align-center">
                  <v-icon class="mr-2" color="green-darken-2">mdi-account-network</v-icon>
                  Mes Demandes de Connexion
                </div>
                <v-btn size="small" variant="text" color="primary" @click="navigateTo('/connections')">
                  Voir toutes
                </v-btn>
              </v-card-title>
              <v-card-text>
                <!-- Statistiques rapides -->
                <v-row class="mb-4">
                  <v-col cols="4" class="text-center">
                    <div class="text-h6 font-weight-bold text-green">{{ connectionStats.active }}</div>
                    <div class="text-caption text-grey-darken-1">Connexions</div>
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <div class="text-h6 font-weight-bold text-orange">{{ connectionStats.pending }}</div>
                    <div class="text-caption text-grey-darken-1">En attente</div>
                  </v-col>
                  <v-col cols="4" class="text-center">
                    <div class="text-h6 font-weight-bold text-blue">{{ connectionStats.received }}</div>
                    <div class="text-caption text-grey-darken-1">Reçues</div>
                  </v-col>
                </v-row>

                <!-- Demandes récentes -->
                <div class="mb-3">
                  <h4 class="text-body-1 font-weight-medium mb-2">Demandes récentes</h4>
                </div>
                
                <v-list density="compact" class="pa-0">
                  <v-list-item
                    v-for="request in recentConnectionRequests"
                    :key="request.id"
                    class="px-0"
                    @click="navigateTo('/connections')"
                  >
                    <template #prepend>
                      <v-avatar :color="request.avatarColor" size="32">
                        <span class="text-white text-caption font-weight-bold">{{ request.initials }}</span>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="text-body-2 font-weight-medium">{{ request.name }}</v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      {{ request.type === 'sent' ? 'Demande envoyée' : 'Demande reçue' }} {{ request.timeAgo }}
                    </v-list-item-subtitle>
                    <template #append>
                      <div class="d-flex align-center ga-1">
                        <v-chip :color="getConnectionStatusColor(request.status)" size="x-small" variant="flat">
                          {{ getConnectionStatusText(request.status) }}
                        </v-chip>
                        <v-btn 
                          v-if="request.type === 'received' && request.status === 'pending'"
                          icon="mdi-check" 
                          size="x-small" 
                          color="green" 
                          variant="text"
                          @click.stop="quickAcceptConnection(request)"
                        />
                      </div>
                    </template>
                  </v-list-item>
                </v-list>

                <!-- Actions rapides -->
                <div class="d-flex ga-2 mt-3">
                  <v-btn size="small" color="green" variant="outlined" @click="navigateTo('/map')">
                    <v-icon start>mdi-map</v-icon>
                    Découvrir
                  </v-btn>
                  <v-btn size="small" color="blue" variant="outlined" @click="navigateTo('/connections')">
                    <v-icon start>mdi-cog</v-icon>
                    Gérer
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>

            <!-- Learning Resources -->
            <v-card>
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="purple-darken-2">mdi-school</v-icon>
                Ressources d'Apprentissage
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col
                    v-for="resource in learningResources"
                    :key="resource.id"
                    cols="12"
                    md="4"
                  >
                    <v-card variant="outlined" class="text-center pa-4 resource-card h-100">
                      <v-avatar :color="resource.color + '-lighten-4'" size="48" class="mb-3">
                        <v-icon :color="resource.color" size="24">{{ resource.icon }}</v-icon>
                      </v-avatar>
                      <div class="font-weight-medium text-grey-darken-3 mb-2">{{ resource.title }}</div>
                      <div class="text-caption text-grey-darken-1 mb-3">{{ resource.description }}</div>
                      <v-btn size="small" :color="resource.color" variant="outlined" block>
                        Accéder
                      </v-btn>
                    </v-card>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Sidebar -->
          <v-col cols="12" lg="4">
            <!-- Profile Completion -->
            <v-card class="mb-6">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="orange-darken-2">mdi-account-check</v-icon>
                Complétez votre Profil
              </v-card-title>
              <v-card-text>
                <div class="text-center mb-4">
                  <v-progress-circular
                    :model-value="profileCompletion"
                    size="80"
                    width="8"
                    color="orange-darken-2"
                  >
                    {{ profileCompletion }}%
                  </v-progress-circular>
                </div>
                <v-list density="compact" class="pa-0">
                  <v-list-item
                    v-for="step in profileSteps"
                    :key="step.id"
                    class="px-0"
                  >
                    <template #prepend>
                      <v-icon :color="step.completed ? 'green' : 'grey'" size="20">
                        {{ step.completed ? 'mdi-check-circle' : 'mdi-circle-outline' }}
                      </v-icon>
                    </template>
                    <v-list-item-title class="text-body-2">{{ step.title }}</v-list-item-title>
                  </v-list-item>
                </v-list>
                <v-btn color="orange-darken-2" variant="outlined" block class="mt-3" @click="navigateTo('/profile')">
                  Compléter le profil
                </v-btn>
              </v-card-text>
            </v-card>

            <!-- Quick Actions -->
            <v-card class="mb-6">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="teal-darken-2">mdi-lightning-bolt</v-icon>
                Actions Rapides
              </v-card-title>
              <v-card-text>
                <div class="d-flex flex-column ga-2">
                  <v-btn
                    v-for="action in quickActions"
                    :key="action.id"
                    :color="action.color"
                    variant="outlined"
                    size="small"
                    block
                    @click="navigateTo(action.route)"
                  >
                    <v-icon start>{{ action.icon }}</v-icon>
                    {{ action.title }}
                  </v-btn>
                </div>
              </v-card-text>
            </v-card>

            <!-- Network Activity -->
            <v-card>
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="indigo-darken-2">mdi-account-group</v-icon>
                Activité du Réseau
              </v-card-title>
              <v-card-text>
                <v-list density="compact" class="pa-0">
                  <v-list-item
                    v-for="activity in networkActivity"
                    :key="activity.id"
                    class="px-0"
                  >
                    <template #prepend>
                      <v-avatar size="32">
                        <v-img :src="activity.avatar" alt="Avatar"></v-img>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="text-body-2 font-weight-medium">{{ activity.user }}</v-list-item-title>
                    <v-list-item-subtitle class="text-caption">{{ activity.action }}</v-list-item-subtitle>
                    <template #append>
                      <span class="text-caption text-grey-darken-1">{{ activity.time }}</span>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { connectionService } from '@/services/connectionService'

const authStore = useAuthStore()
const router = useRouter()
const user = computed(() => authStore.user)

// Navigation state
const drawer = ref(true)
const rail = ref(false)
const notifications = ref(3)

// Menu items
const menuItems = ref([
  {
    title: 'Tableau de Bord',
    icon: 'mdi-view-dashboard',
    value: 'dashboard',
    route: '/dashboard'
  },
  {
    title: 'Opportunités',
    icon: 'mdi-briefcase',
    value: 'opportunities',
    route: '/opportunities'
  },
  {
    title: 'Mes Candidatures',
    icon: 'mdi-file-document',
    value: 'applications',
    route: '/applications'
  },
  {
    title: 'Mes Connexions',
    icon: 'mdi-account-network',
    value: 'connections',
    route: '/connections'
  },
  {
    title: 'Formations',
    icon: 'mdi-school',
    value: 'learning',
    route: '/learning'
  },
  {
    title: 'Messages',
    icon: 'mdi-message',
    value: 'messages',
    route: '/messages'
  },
  {
    title: 'Mon Profil',
    icon: 'mdi-account',
    value: 'profile',
    route: '/profile'
  }
])

// Quick stats
const quickStats = ref([
  {
    id: 1,
    label: 'Opportunités Vues',
    value: '24',
    icon: 'mdi-eye',
    color: 'blue'
  },
  {
    id: 2,
    label: 'Candidatures',
    value: '8',
    icon: 'mdi-send',
    color: 'green'
  },
  {
    id: 3,
    label: 'Connexions',
    value: '156',
    icon: 'mdi-account-group',
    color: 'purple'
  },
  {
    id: 4,
    label: 'Formations',
    value: '3',
    icon: 'mdi-school',
    color: 'orange'
  }
])

// Recent opportunities
const recentOpportunities = ref([
  {
    id: 1,
    title: 'Développeur Frontend Vue.js',
    description: 'Rejoignez notre équipe pour développer des solutions d\'énergie renouvelable',
    category: { name: 'Tech', color: 'blue' },
    location: 'Dakar, Sénégal',
    date: '2024-01-15'
  },
  {
    id: 2,
    title: 'Consultant en Énergie Solaire',
    description: 'Expertise technique pour projets solaires en Afrique de l\'Ouest',
    category: { name: 'Énergie', color: 'green' },
    location: 'Abidjan, Côte d\'Ivoire',
    date: '2024-01-14'
  },
  {
    id: 3,
    title: 'Responsable Marketing Digital',
    description: 'Promouvoir les solutions d\'économie verte auprès des entreprises',
    category: { name: 'Marketing', color: 'purple' },
    location: 'Lagos, Nigeria',
    date: '2024-01-13'
  },
  {
    id: 4,
    title: 'Ingénieur Environnemental',
    description: 'Évaluation d\'impact environnemental pour projets verts',
    category: { name: 'Environnement', color: 'teal' },
    location: 'Accra, Ghana',
    date: '2024-01-12'
  }
])

// My applications
const myApplications = ref([
  {
    id: 1,
    title: 'Développeur Full Stack',
    date: '2024-01-10',
    status: { text: 'En cours', color: 'orange', icon: 'mdi-clock' }
  },
  {
    id: 2,
    title: 'Chef de Projet Énergie',
    date: '2024-01-08',
    status: { text: 'Acceptée', color: 'green', icon: 'mdi-check-circle' }
  },
  {
    id: 3,
    title: 'Analyste Données',
    date: '2024-01-05',
    status: { text: 'Refusée', color: 'red', icon: 'mdi-close-circle' }
  }
])

// Learning resources
const learningResources = ref([
  {
    id: 1,
    title: 'Énergie Solaire',
    description: 'Cours complet sur les technologies solaires',
    icon: 'mdi-solar-power',
    color: 'orange'
  },
  {
    id: 2,
    title: 'Développement Durable',
    description: 'Principes de l\'économie verte',
    icon: 'mdi-leaf',
    color: 'green'
  },
  {
    id: 3,
    title: 'Financement Vert',
    description: 'Mécanismes de financement des projets verts',
    icon: 'mdi-currency-usd',
    color: 'blue'
  }
])

// Profile completion
const profileCompletion = ref(75)
const profileSteps = ref([
  { id: 1, title: 'Photo de profil', completed: true },
  { id: 2, title: 'Informations personnelles', completed: true },
  { id: 3, title: 'Expérience professionnelle', completed: true },
  { id: 4, title: 'Compétences', completed: false },
  { id: 5, title: 'Certifications', completed: false }
])

// Quick actions
const quickActions = ref([
  {
    id: 1,
    title: 'Rechercher Opportunités',
    icon: 'mdi-magnify',
    color: 'primary',
    route: '/opportunities/search'
  },
  {
    id: 2,
    title: 'Publier Opportunité',
    icon: 'mdi-plus',
    color: 'green',
    route: '/opportunities/create'
  },
  {
    id: 3,
    title: 'Rejoindre Réseau',
    icon: 'mdi-account-plus',
    color: 'blue',
    route: '/network/join'
  },
  {
    id: 4,
    title: 'Suivre Formation',
    icon: 'mdi-school',
    color: 'purple',
    route: '/learning/courses'
  }
])

// Network activity
const networkActivity = ref([
  {
    id: 1,
    user: 'Marie Diallo',
    action: 'a publié une nouvelle opportunité',
    avatar: '/api/placeholder/32/32',
    time: '2h'
  },
  {
    id: 2,
    user: 'Ahmed Kone',
    action: 'a rejoint le réseau',
    avatar: '/api/placeholder/32/32',
    time: '4h'
  },
  {
    id: 3,
    user: 'Fatou Sow',
    action: 'a terminé une formation',
    avatar: '/api/placeholder/32/32',
    time: '1j'
  },
  {
    id: 4,
    user: 'Ibrahim Diop',
    action: 'a partagé un article',
    avatar: '/api/placeholder/32/32',
    time: '2j'
  }
])

// Connection requests data
const connectionStats = ref({
  active: 12,
  pending: 3,
  received: 2
})

const recentConnectionRequests = ref([
  {
    id: 1,
    name: 'SolarTech Côte d\'Ivoire',
    initials: 'ST',
    avatarColor: 'green',
    type: 'sent',
    status: 'pending',
    timeAgo: 'il y a 2h',
    message: 'Intéressé par vos solutions solaires'
  },
  {
    id: 2,
    name: 'EcoTransport Sénégal',
    initials: 'ET',
    avatarColor: 'blue',
    type: 'received',
    status: 'pending',
    timeAgo: 'il y a 4h',
    message: 'Souhaite explorer des partenariats'
  },
  {
    id: 3,
    name: 'Green Farm Ghana',
    initials: 'GF',
    avatarColor: 'teal',
    type: 'sent',
    status: 'accepted',
    timeAgo: 'il y a 1j',
    message: 'Collaboration en agriculture durable'
  },
  {
    id: 4,
    name: 'CleanWater Nigeria',
    initials: 'CW',
    avatarColor: 'purple',
    type: 'received',
    status: 'pending',
    timeAgo: 'il y a 2j',
    message: 'Partenariat dans le domaine de l\'eau'
  }
])

// Methods
const navigateTo = (route) => {
  router.push(route)
}

const logout = async () => {
  try {
    await authStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}

// Connection methods
const getConnectionStatusColor = (status) => {
  const colors = {
    'pending': 'orange',
    'accepted': 'green',
    'rejected': 'red'
  }
  return colors[status] || 'grey'
}

const getConnectionStatusText = (status) => {
  const texts = {
    'pending': 'En attente',
    'accepted': 'Acceptée',
    'rejected': 'Refusée'
  }
  return texts[status] || 'Inconnu'
}

const quickAcceptConnection = async (request) => {
  try {
    await connectionService.acceptRequest(request.id)
    
    // Mettre à jour le statut localement
    request.status = 'accepted'
    
    // Mettre à jour les statistiques
    connectionStats.value.received--
    connectionStats.value.active++
    
    // Notification de succès
    notifications.value++
    
    // TODO: Afficher un toast de succès
    console.log(`Connexion acceptée avec ${request.name}`)
    
  } catch (error) {
    console.error('Erreur lors de l\'acceptation:', error)
    // TODO: Afficher un toast d'erreur
  }
}

const loadConnectionData = async () => {
  try {
    // TODO: Charger les vraies données depuis l'API
    // const userId = authStore.user?.id
    // if (userId) {
    //   const connections = await connectionService.getConnections(userId)
    //   const received = await connectionService.getReceivedRequests(userId)
    //   const sent = await connectionService.getSentRequests(userId)
    //   
    //   connectionStats.value = {
    //     active: connections.length,
    //     pending: sent.filter(r => r.status === 'pending').length,
    //     received: received.filter(r => r.status === 'pending').length
    //   }
    //   
    //   // Combiner et trier les demandes récentes
    //   const allRequests = [
    //     ...received.map(r => ({ ...r, type: 'received' })),
    //     ...sent.map(r => ({ ...r, type: 'sent' }))
    //   ]
    //   recentConnectionRequests.value = allRequests
    //     .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    //     .slice(0, 4)
    // }
    
    console.log('Données de connexion chargées (mock)')
  } catch (error) {
    console.error('Erreur lors du chargement des connexions:', error)
  }
}

onMounted(async () => {
  console.log('Dashboard utilisateur chargé')
  await loadConnectionData()
})
</script>

<style scoped>
.welcome-section {
  background: linear-gradient(135deg, var(--v-theme-primary-lighten-4), var(--v-theme-secondary-lighten-4));
  border-radius: 12px;
  padding: 24px;
}

.stat-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.opportunity-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.opportunity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.resource-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
}

.resource-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.v-navigation-drawer {
  border-right: 1px solid rgba(0, 0, 0, 0.12);
}

.v-app-bar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
</style>