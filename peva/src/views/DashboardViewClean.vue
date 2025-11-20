<template>
  <v-app>
    <!-- Navigation Bar -->
    <v-app-bar
      :elevation="0"
      color="white"
      class="border-b"
      height="72"
    >
      <v-container class="d-flex align-center justify-space-between pa-0">
        <!-- Logo & Title -->
        <div class="d-flex align-center">
          <v-icon color="green-darken-2" size="32" class="mr-3">
            mdi-leaf
          </v-icon>
          <div>
            <h2 class="text-h6 font-weight-bold text-grey-darken-3">PEVA</h2>
            <p class="text-caption text-grey-darken-1 ma-0">Économie Verte Africaine</p>
          </div>
        </div>

        <!-- Actions -->
        <div class="d-flex align-center ga-4">
          <!-- Notifications -->
          <NotificationManager ref="notificationManager" />
          
          <!-- User Menu -->
          <v-menu>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                icon
                variant="text"
                class="ml-2"
              >
                <v-avatar size="40" color="green-lighten-4">
                  <v-icon color="green-darken-2">mdi-account</v-icon>
                </v-avatar>
              </v-btn>
            </template>
            <v-list>
              <v-list-item>
                <v-list-item-title>Mon Profil</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-title>Paramètres</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item @click="handleLogout">
                <v-list-item-title>Déconnexion</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-container>
    </v-app-bar>

    <!-- Main Content -->
    <v-main class="bg-grey-lighten-5">
      <v-container class="pa-6">
        <!-- Welcome Section -->
        <div class="mb-8">
          <h1 class="text-h4 font-weight-bold text-grey-darken-3 mb-2">
            Tableau de Bord
          </h1>
          <p class="text-body-1 text-grey-darken-1">
            Bienvenue sur votre plateforme de l'économie verte africaine
          </p>
        </div>

        <!-- Quick Stats -->
        <v-row class="mb-8">
          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4 text-center" elevation="1">
              <v-icon color="blue" size="40" class="mb-3">mdi-briefcase-outline</v-icon>
              <h3 class="text-h6 font-weight-bold mb-1">156</h3>
              <p class="text-body-2 text-grey-darken-1 ma-0">Opportunités</p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4 text-center" elevation="1">
              <v-icon color="green" size="40" class="mb-3">mdi-domain</v-icon>
              <h3 class="text-h6 font-weight-bold mb-1">89</h3>
              <p class="text-body-2 text-grey-darken-1 ma-0">Entreprises</p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4 text-center" elevation="1">
              <v-icon color="purple" size="40" class="mb-3">mdi-calendar-outline</v-icon>
              <h3 class="text-h6 font-weight-bold mb-1">23</h3>
              <p class="text-body-2 text-grey-darken-1 ma-0">Événements</p>
            </v-card>
          </v-col>
          <v-col cols="12" sm="6" md="3">
            <v-card class="pa-4 text-center" elevation="1">
              <v-icon color="orange" size="40" class="mb-3">mdi-account-group-outline</v-icon>
              <h3 class="text-h6 font-weight-bold mb-1">342</h3>
              <p class="text-body-2 text-grey-darken-1 ma-0">Membres</p>
            </v-card>
          </v-col>
        </v-row>

        <!-- Main Content Grid -->
        <v-row>
          <!-- Left Column -->
          <v-col cols="12" lg="8">
            <!-- Recent Opportunities -->
            <v-card class="mb-6" elevation="1">
              <v-card-title class="d-flex align-center justify-space-between pa-6 pb-4">
                <div class="d-flex align-center">
                  <v-icon color="blue" class="mr-3">mdi-briefcase-outline</v-icon>
                  <span class="text-h6 font-weight-bold">Opportunités Récentes</span>
                </div>
                <v-btn variant="text" color="blue" size="small" @click="handleViewAllOpportunities">
                  Voir tout
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="pa-0">
                <v-list lines="two">
                  <v-list-item
                    v-for="(opportunity, index) in recentOpportunities"
                    :key="index"
                    class="px-6 py-4"
                  >
                    <template v-slot:prepend>
                      <v-avatar :color="opportunity.color" class="mr-4">
                        <v-icon color="white">{{ opportunity.icon }}</v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="font-weight-medium mb-1">
                      {{ opportunity.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-grey-darken-1">
                      {{ opportunity.company }} • {{ opportunity.location }}
                    </v-list-item-subtitle>
                    <template v-slot:append>
                      <v-chip
                        :color="opportunity.type === 'Financement' ? 'green' : opportunity.type === 'Emploi' ? 'blue' : 'purple'"
                        variant="tonal"
                        size="small"
                      >
                        {{ opportunity.type }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <!-- Upcoming Events -->
            <v-card elevation="1">
              <v-card-title class="d-flex align-center justify-space-between pa-6 pb-4">
                <div class="d-flex align-center">
                  <v-icon color="purple" class="mr-3">mdi-calendar-outline</v-icon>
                  <span class="text-h6 font-weight-bold">Événements à Venir</span>
                </div>
                <v-btn variant="text" color="purple" size="small" @click="handleViewCalendar">
                  Calendrier
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="pa-0">
                <v-list>
                  <v-list-item
                    v-for="(event, index) in upcomingEvents"
                    :key="index"
                    class="px-6 py-4"
                  >
                    <template v-slot:prepend>
                      <div class="text-center mr-4">
                        <div class="text-h6 font-weight-bold text-purple">{{ event.day }}</div>
                        <div class="text-caption text-grey-darken-1">{{ event.month }}</div>
                      </div>
                    </template>
                    <v-list-item-title class="font-weight-medium mb-1">
                      {{ event.title }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-grey-darken-1">
                      {{ event.time }} • {{ event.location }}
                    </v-list-item-subtitle>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Right Column -->
          <v-col cols="12" lg="4">
            <!-- Quick Actions -->
            <v-card class="mb-6" elevation="1">
              <v-card-title class="pa-6 pb-4">
                <div class="d-flex align-center">
                  <v-icon color="green" class="mr-3">mdi-lightning-bolt-outline</v-icon>
                  <span class="text-h6 font-weight-bold">Actions Rapides</span>
                </div>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="pa-6">
                <v-list class="pa-0">
                  <v-list-item class="px-0 mb-3">
                    <v-btn
                      block
                      color="blue"
                      variant="tonal"
                      size="large"
                      class="justify-start"
                      @click="handlePublishOpportunity"
                    >
                      <v-icon start>mdi-plus</v-icon>
                      Publier une Opportunité
                    </v-btn>
                  </v-list-item>
                  <v-list-item class="px-0 mb-3">
                    <v-btn
                      block
                      color="green"
                      variant="tonal"
                      size="large"
                      class="justify-start"
                      @click="handleAddCompany"
                    >
                      <v-icon start>mdi-domain-plus</v-icon>
                      Ajouter une Entreprise
                    </v-btn>
                  </v-list-item>
                  <v-list-item class="px-0 mb-3">
                    <v-btn
                      block
                      color="purple"
                      variant="tonal"
                      size="large"
                      class="justify-start"
                      @click="handleCreateEvent"
                    >
                      <v-icon start>mdi-calendar-plus</v-icon>
                      Créer un Événement
                    </v-btn>
                  </v-list-item>
                  <v-list-item class="px-0">
                    <v-btn
                      block
                      color="orange"
                      variant="tonal"
                      size="large"
                      class="justify-start"
                      @click="handleJoinForum"
                    >
                      <v-icon start>mdi-forum-outline</v-icon>
                      Rejoindre le Forum
                    </v-btn>
                  </v-list-item>
                </v-list>
              </v-card-text>
            </v-card>

            <!-- Notification Tester -->
            <NotificationTester :notification-manager="notificationManager" />

            <!-- Recent Activity -->
            <v-card elevation="1">
              <v-card-title class="pa-6 pb-4">
                <div class="d-flex align-center">
                  <v-icon color="orange" class="mr-3">mdi-pulse</v-icon>
                  <span class="text-h6 font-weight-bold">Activité Récente</span>
                </div>
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text class="pa-0">
                <v-list>
                  <v-list-item
                    v-for="(activity, index) in recentActivity"
                    :key="index"
                    class="px-6 py-3"
                  >
                    <template v-slot:prepend>
                      <v-avatar size="32" :color="activity.color" class="mr-3">
                        <v-icon color="white" size="16">{{ activity.icon }}</v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="text-body-2 font-weight-medium">
                      {{ activity.text }}
                    </v-list-item-title>
                    <v-list-item-subtitle class="text-caption">
                      {{ activity.time }}
                    </v-list-item-subtitle>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import NotificationManager from '@/components/NotificationManager.vue'
import NotificationTester from '@/components/NotificationTester.vue'
import oneSignalService from '@/services/oneSignalService'

const router = useRouter()
const authStore = useAuthStore()
const notificationManager = ref(null)

// Sample data
const recentOpportunities = ref([
  {
    title: 'Développeur Full-Stack Énergie Solaire',
    company: 'SolarTech Africa',
    location: 'Dakar, Sénégal',
    type: 'Emploi',
    icon: 'mdi-code-tags',
    color: 'blue'
  },
  {
    title: 'Financement Projet Éolien 2M€',
    company: 'Green Fund International',
    location: 'Casablanca, Maroc',
    type: 'Financement',
    icon: 'mdi-currency-eur',
    color: 'green'
  },
  {
    title: 'Partenariat Agriculture Durable',
    company: 'EcoFarm Solutions',
    location: 'Abidjan, Côte d\'Ivoire',
    type: 'Partenariat',
    icon: 'mdi-handshake',
    color: 'purple'
  }
])

const upcomingEvents = ref([
  {
    title: 'Sommet de l\'Énergie Verte Africaine',
    time: '09:00 - 17:00',
    location: 'Lagos, Nigeria',
    day: '15',
    month: 'FÉV'
  },
  {
    title: 'Atelier Innovation Climatique',
    time: '14:00 - 16:00',
    location: 'En ligne',
    day: '22',
    month: 'FÉV'
  },
  {
    title: 'Forum des Startups Vertes',
    time: '10:00 - 18:00',
    location: 'Nairobi, Kenya',
    day: '28',
    month: 'FÉV'
  }
])

const recentActivity = ref([
  {
    text: 'Nouvelle opportunité publiée',
    time: 'Il y a 2 heures',
    icon: 'mdi-briefcase',
    color: 'blue'
  },
  {
    text: 'Entreprise certifiée RSE',
    time: 'Il y a 4 heures',
    icon: 'mdi-certificate',
    color: 'green'
  },
  {
    text: 'Événement créé',
    time: 'Il y a 1 jour',
    icon: 'mdi-calendar',
    color: 'purple'
  },
  {
    text: 'Nouveau membre inscrit',
    time: 'Il y a 2 jours',
    icon: 'mdi-account-plus',
    color: 'orange'
  }
])

const handleLogout = async () => {
  try {
    await authStore.signOut()
    router.push('/auth/login')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}

// Méthodes de vérification d'authentification
const checkAuthenticationForAction = (actionName) => {
  if (!authStore.isAuthenticated) {
    showErrorNotification(`🔒 Vous devez être connecté pour ${actionName}.`)
    return false
  }
  return true
}

const handlePublishOpportunity = () => {
  if (!checkAuthenticationForAction('publier une opportunité')) return
  
  // Rediriger vers la création d'opportunité
  router.push('/create-opportunity')
  showInfoNotification('Redirection vers la création d\'opportunité...')
}

const handleAddCompany = () => {
  if (!checkAuthenticationForAction('ajouter une entreprise')) return
  
  // Rediriger vers l'ajout d'entreprise
  router.push('/companies/create')
  showInfoNotification('Redirection vers l\'ajout d\'entreprise...')
}

const handleCreateEvent = () => {
  if (!checkAuthenticationForAction('créer un événement')) return
  
  // Rediriger vers la création d'événement
  router.push('/create-event')
  showInfoNotification('Redirection vers la création d\'événement...')
}

const handleJoinForum = () => {
  if (!checkAuthenticationForAction('rejoindre le forum')) return
  
  // Rediriger vers le forum
  router.push('/forum')
  showInfoNotification('Redirection vers le forum...')
}

const handleViewAllOpportunities = () => {
  if (!checkAuthenticationForAction('voir toutes les opportunités')) return
  
  // Rediriger vers la liste des opportunités
  router.push('/opportunities')
  showInfoNotification('Redirection vers les opportunités...')
}

const handleViewCalendar = () => {
  if (!checkAuthenticationForAction('voir le calendrier')) return
  
  // Rediriger vers le calendrier des événements
  router.push('/events')
  showInfoNotification('Redirection vers le calendrier...')
}

// Notification methods
const showSuccessNotification = (message) => {
  if (notificationManager.value) {
    notificationManager.value.addNotification({
      type: 'system',
      title: 'Succès',
      message: message || 'Opération réussie !'
    })
  }
}

const showErrorNotification = (message) => {
  if (notificationManager.value) {
    notificationManager.value.addNotification({
      type: 'system',
      title: 'Erreur',
      message: message || 'Une erreur est survenue.'
    })
  }
}

const showInfoNotification = (message) => {
  if (notificationManager.value) {
    notificationManager.value.addNotification({
      type: 'system',
      title: 'Information',
      message: message || 'Nouvelle information disponible.'
    })
  }
}

onMounted(async () => {
  try {
    // Vérifier l'authentification
    if (!authStore.initialized) {
      await authStore.initialize()
    }
    
    // Rediriger si l'utilisateur n'est pas connecté
    if (!authStore.isAuthenticated) {
      showErrorNotification('🔒 Vous devez être connecté pour accéder au tableau de bord.')
      router.push('/auth/login')
      return
    }
    
    // Vérifier si l'onboarding est complété pour les utilisateurs simples
    if (!authStore.isAdmin && !authStore.hasCompletedOnboarding) {
      showInfoNotification('Veuillez compléter votre onboarding.')
      router.push('/onboarding')
      return
    }
    
    // Initialize OneSignal
    await oneSignalService.initialize()
    
    // Set user tags for segmentation
    await oneSignalService.setUserTags({
      user_type: 'dashboard_user',
      sector: 'green_economy',
      region: 'africa',
      language: 'fr'
    })
    
    // Welcome notification
    setTimeout(() => {
      showSuccessNotification('Bienvenue sur votre tableau de bord PEVA !')
    }, 1000)
    
    // Demo notifications
    setTimeout(() => {
      showInfoNotification('Nouvelle opportunité de financement disponible')
    }, 5000)
    
    setTimeout(() => {
      showInfoNotification('Événement "Sommet Énergie Verte" dans 3 jours')
    }, 10000)
    
  } catch (error) {
    console.error('Erreur lors de l\'initialisation:', error)
    showErrorNotification('Erreur lors de l\'initialisation des notifications')
  }
})
</script>

<style scoped>
.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
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