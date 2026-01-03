<template>
  <v-app>
    <!-- App Bar -->
    <v-app-bar color="white" elevation="1" app>
      <v-container fluid class="d-flex align-center">
        <div class="d-flex align-center">
          <v-avatar color="gradient" size="40" class="mr-3">
            <v-icon color="white">mdi-leaf</v-icon>
          </v-avatar>
          <div>
            <h1 class="text-h6 font-weight-bold text-green-darken-2">
              PEVA - Écosystème Vert Africain
            </h1>
            <p class="text-caption text-grey-darken-1 ma-0">
              Plateforme Digitale Stratégique pour l'Économie Verte
            </p>
          </div>
        </div>
        
        <v-spacer></v-spacer>
        
        <div class="d-flex align-center ga-3">
          <!-- Notifications -->
          <NotificationManager ref="notificationManager" />
          
          <!-- User Info -->
          <v-chip color="green-lighten-4" class="mr-2">
            <v-icon start>mdi-account</v-icon>
            {{ user?.email || 'Utilisateur' }}
          </v-chip>
          
          <!-- Logout Button -->
          <v-btn 
            @click="handleLogout" 
            color="red-darken-1" 
            variant="outlined"
            size="small"
          >
            <v-icon start>mdi-logout</v-icon>
            Déconnexion
          </v-btn>
        </div>
      </v-container>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <!-- Navigation vers les nouveaux dashboards -->
      <v-container fluid class="py-4">
        <v-alert
          type="info"
          variant="tonal"
          class="mb-4"
        >
          <v-row align="center">
            <v-col>
              <div class="text-subtitle-1 font-weight-medium mb-2">
                🎉 Nouveaux Dashboards Disponibles !
              </div>
              <div class="text-body-2">
                Découvrez nos nouveaux dashboards modernes avec une meilleure expérience utilisateur.
              </div>
            </v-col>
            <v-col cols="auto">
              <div class="d-flex ga-2">
                <v-btn
                  color="primary"
                  variant="elevated"
                  :to="{ name: 'UserDashboard' }"
                  prepend-icon="mdi-view-dashboard"
                >
                  Dashboard Utilisateur
                </v-btn>
                <v-btn
                  v-if="authStore.isAdmin"
                  color="red-darken-2"
                  variant="elevated"
                  :to="{ name: 'AdminDashboard' }"
                  prepend-icon="mdi-shield-crown"
                >
                  Dashboard Admin
                </v-btn>
              </div>
            </v-col>
          </v-row>
        </v-alert>
      </v-container>

      <v-container fluid class="pa-6">
        <!-- Hero Section -->
        <v-card class="mb-6" color="gradient-to-r from-green-600 to-blue-600" dark>
          <v-card-text class="pa-6">
            <div class="d-flex align-center justify-space-between">
              <div>
                <h2 class="text-h4 font-weight-bold mb-2">
                  <v-icon class="mr-2">mdi-earth</v-icon>
                  Tableau de Bord PEVA
                </h2>
                <p class="text-h6 opacity-90">
                  Plateforme digitale pour l'écosystème de l'économie verte en Afrique
                </p>
              </div>
              <div class="text-center">
                <v-chip color="white" text-color="green-darken-2" class="mb-2">
                  <v-icon start>mdi-clock</v-icon>
                  Dernière connexion: {{ new Date().toLocaleDateString('fr-FR') }}
                </v-chip>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- Statistiques Principales -->
        <v-row class="mb-6">
          <v-col 
            v-for="stat in mainStats" 
            :key="stat.id"
            cols="12" sm="6" md="3"
          >
            <v-card class="text-center pa-4" :color="stat.color" elevation="2">
              <v-avatar :color="stat.avatarColor" size="60" class="mb-3">
                <v-icon size="30" color="white">{{ stat.icon }}</v-icon>
              </v-avatar>
              <h3 class="text-h4 font-weight-bold mb-1">{{ stat.value }}</h3>
              <p class="text-subtitle-1 mb-2">{{ stat.label }}</p>
              <v-chip :color="stat.trendColor" size="small">
                <v-icon start size="16">{{ stat.trendIcon }}</v-icon>
                {{ stat.trend }}
              </v-chip>
            </v-card>
          </v-col>
        </v-row>

        <!-- Sections Principales -->
        <v-row class="mb-6">
          <!-- Annuaire des Entreprises -->
          <v-col cols="12" md="6">
            <v-card class="h-100">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="blue-darken-2">mdi-office-building</v-icon>
                Annuaire des Entreprises
              </v-card-title>
              <v-card-subtitle>
                Découvrez les entreprises de l'économie verte en Afrique
              </v-card-subtitle>
              <v-card-text>
                <div class="d-flex align-center justify-space-between mb-4">
                  <v-chip color="blue-lighten-4" text-color="blue-darken-2">
                    <v-icon start>mdi-domain</v-icon>
                    {{ dashboardData.companies.length }} entreprises
                  </v-chip>
                  <v-chip color="green-lighten-4" text-color="green-darken-2">
                    <v-icon start>mdi-trending-up</v-icon>
                    +12 ce mois
                  </v-chip>
                </div>
                <v-list density="compact">
                  <v-list-item 
                    v-for="company in dashboardData.companies.slice(0, 3)" 
                    :key="company.name"
                    class="px-0"
                  >
                    <template v-slot:prepend>
                      <v-avatar :color="company.color" size="32">
                        <v-icon color="white" size="16">{{ company.icon }}</v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="text-subtitle-2">{{ company.name }}</v-list-item-title>
                    <v-list-item-subtitle>{{ company.sector }}</v-list-item-subtitle>
                    <template v-slot:append>
                      <v-chip size="x-small" :color="company.status === 'verified' ? 'success' : 'warning'">
                        {{ company.status === 'verified' ? 'Vérifiée' : 'En attente' }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-btn color="blue-darken-2" variant="text" append-icon="mdi-arrow-right">
                  Voir toutes les entreprises
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <!-- Événements -->
          <v-col cols="12" md="6">
            <v-card class="h-100">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="purple-darken-2">mdi-calendar-multiple</v-icon>
                Événements
              </v-card-title>
              <v-card-subtitle>
                Conférences, ateliers et formations à venir
              </v-card-subtitle>
              <v-card-text>
                <div class="d-flex align-center justify-space-between mb-4">
                  <v-chip color="purple-lighten-4" text-color="purple-darken-2">
                    <v-icon start>mdi-calendar</v-icon>
                    {{ dashboardData.events.length }} événements
                  </v-chip>
                  <v-chip color="orange-lighten-4" text-color="orange-darken-2">
                    <v-icon start>mdi-clock</v-icon>
                    3 cette semaine
                  </v-chip>
                </div>
                <v-list density="compact">
                  <v-list-item 
                    v-for="event in dashboardData.events.slice(0, 3)" 
                    :key="event.title"
                    class="px-0"
                  >
                    <template v-slot:prepend>
                      <v-avatar :color="event.color" size="32">
                        <v-icon color="white" size="16">{{ event.icon }}</v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="text-subtitle-2">{{ event.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ event.date }} - {{ event.location }}</v-list-item-subtitle>
                    <template v-slot:append>
                      <v-chip size="x-small" :color="event.type === 'conference' ? 'info' : 'success'">
                        {{ event.type === 'conference' ? 'Conférence' : 'Atelier' }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-btn color="purple-darken-2" variant="text" append-icon="mdi-arrow-right">
                  Voir tous les événements
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Forum et Opportunités -->
        <v-row class="mb-6">
          <!-- Forum -->
          <v-col cols="12" md="6">
            <v-card class="h-100">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="teal-darken-2">mdi-forum</v-icon>
                Forum Communautaire
              </v-card-title>
              <v-card-subtitle>
                Discussions et échanges entre membres
              </v-card-subtitle>
              <v-card-text>
                <div class="d-flex align-center justify-space-between mb-4">
                  <v-chip color="teal-lighten-4" text-color="teal-darken-2">
                    <v-icon start>mdi-message-text</v-icon>
                    {{ forumTopics.length }} sujets actifs
                  </v-chip>
                  <v-chip color="indigo-lighten-4" text-color="indigo-darken-2">
                    <v-icon start>mdi-account-group</v-icon>
                    1,247 membres
                  </v-chip>
                </div>
                <v-list density="compact">
                  <v-list-item 
                    v-for="topic in forumTopics.slice(0, 3)" 
                    :key="topic.id"
                    class="px-0"
                  >
                    <template v-slot:prepend>
                      <v-avatar :color="topic.color" size="32">
                        <v-icon color="white" size="16">{{ topic.icon }}</v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="text-subtitle-2">{{ topic.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ topic.author }} - {{ topic.replies }} réponses</v-list-item-subtitle>
                    <template v-slot:append>
                      <v-chip size="x-small" :color="topic.status === 'hot' ? 'red' : 'grey'">
                        {{ topic.status === 'hot' ? 'Populaire' : 'Normal' }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-btn color="teal-darken-2" variant="text" append-icon="mdi-arrow-right">
                  Accéder au forum
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>

          <!-- Opportunités -->
          <v-col cols="12" md="6">
            <v-card class="h-100">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="amber-darken-2">mdi-briefcase-variant</v-icon>
                Opportunités
              </v-card-title>
              <v-card-subtitle>
                Emplois, stages et partenariats disponibles
              </v-card-subtitle>
              <v-card-text>
                <div class="d-flex align-center justify-space-between mb-4">
                  <v-chip color="amber-lighten-4" text-color="amber-darken-2">
                    <v-icon start>mdi-briefcase</v-icon>
                    {{ opportunities.length }} opportunités
                  </v-chip>
                  <v-chip color="green-lighten-4" text-color="green-darken-2">
                    <v-icon start>mdi-new-box</v-icon>
                    5 nouvelles
                  </v-chip>
                </div>
                <v-list density="compact">
                  <v-list-item 
                    v-for="opportunity in opportunities.slice(0, 3)" 
                    :key="opportunity.id"
                    class="px-0"
                  >
                    <template v-slot:prepend>
                      <v-avatar :color="opportunity.color" size="32">
                        <v-icon color="white" size="16">{{ opportunity.icon }}</v-icon>
                      </v-avatar>
                    </template>
                    <v-list-item-title class="text-subtitle-2">{{ opportunity.title }}</v-list-item-title>
                    <v-list-item-subtitle>{{ opportunity.company }} - {{ opportunity.location }}</v-list-item-subtitle>
                    <template v-slot:append>
                      <v-chip size="x-small" :color="opportunity.type === 'job' ? 'success' : 'info'">
                        {{ opportunity.type === 'job' ? 'Emploi' : 'Stage' }}
                      </v-chip>
                    </template>
                  </v-list-item>
                </v-list>
              </v-card-text>
              <v-card-actions>
                <v-btn color="amber-darken-2" variant="text" append-icon="mdi-arrow-right">
                  Voir toutes les opportunités
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
            
        <!-- Impact Environnemental et ODD -->
        <v-row class="mb-6">
          <!-- Impact Environnemental -->
          <v-col cols="12" md="8">
            <v-card class="h-100">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="green-darken-2">mdi-earth</v-icon>
                Impact Environnemental
              </v-card-title>
              <v-card-subtitle>
                Métriques de durabilité et contribution écologique
              </v-card-subtitle>
              <v-card-text>
                <v-row>
                  <v-col cols="12" sm="4">
                    <div class="text-center pa-4" style="background: linear-gradient(135deg, #e8f5e8 0%, #c8e6c9 100%); border-radius: 12px;">
                      <v-icon color="success" size="40" class="mb-2">mdi-tree</v-icon>
                      <p class="text-h5 font-weight-bold text-green-darken-2">2,847</p>
                      <p class="text-caption text-green-darken-1">Arbres plantés</p>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="text-center pa-4" style="background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%); border-radius: 12px;">
                      <v-icon color="info" size="40" class="mb-2">mdi-water</v-icon>
                      <p class="text-h5 font-weight-bold text-blue-darken-2">15.2M</p>
                      <p class="text-caption text-blue-darken-1">Litres économisés</p>
                    </div>
                  </v-col>
                  <v-col cols="12" sm="4">
                    <div class="text-center pa-4" style="background: linear-gradient(135deg, #fff3e0 0%, #ffcc02 100%); border-radius: 12px;">
                      <v-icon color="warning" size="40" class="mb-2">mdi-flash</v-icon>
                      <p class="text-h5 font-weight-bold text-orange-darken-2">847 kWh</p>
                      <p class="text-caption text-orange-darken-1">Énergie renouvelable</p>
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Objectifs ODD -->
          <v-col cols="12" md="4">
            <v-card class="h-100">
              <v-card-title class="d-flex align-center">
                <v-icon class="mr-2" color="indigo-darken-2">mdi-target</v-icon>
                Objectifs ODD
              </v-card-title>
              <v-card-subtitle>
                Objectifs de Développement Durable
              </v-card-subtitle>
              <v-card-text>
                <div class="space-y-4">
                  <div 
                    v-for="goal in sdgGoals" 
                    :key="goal.id"
                    class="mb-4"
                  >
                    <div class="d-flex align-center justify-space-between mb-2">
                      <div class="d-flex align-center">
                        <v-icon :color="goal.color" size="20" class="mr-2">{{ goal.icon }}</v-icon>
                        <span class="text-subtitle-2 font-weight-medium">{{ goal.name }}</span>
                      </div>
                      <span class="text-caption font-weight-bold">{{ goal.progress }}%</span>
                    </div>
                    <v-progress-linear 
                      :model-value="goal.progress" 
                      :color="goal.color"
                      height="8"
                      rounded
                    ></v-progress-linear>
                  </div>
                </div>
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
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import NotificationManager from '@/components/NotificationManager.vue'


import oneSignalService from '@/services/oneSignalService'

const authStore = useAuthStore()
const router = useRouter()
const user = computed(() => authStore.user)
const notificationManager = ref(null)

// Gestion de la déconnexion
const handleLogout = async () => {
  try {
    await authStore.signOut()
    router.push({ name: 'Login' })
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}

// Méthodes pour déclencher des notifications
const showSuccessNotification = (message) => {
  if (notificationManager.value) {
    notificationManager.value.addNotification({
      type: 'success',
      title: 'Succès',
      message,
      duration: 5000
    })
  }
}

const showErrorNotification = (message) => {
  if (notificationManager.value) {
    notificationManager.value.addNotification({
      type: 'error',
      title: 'Erreur',
      message,
      duration: 7000
    })
  }
}

const showInfoNotification = (message) => {
  if (notificationManager.value) {
    notificationManager.value.addNotification({
      type: 'info',
      title: 'Information',
      message,
      duration: 4000
    })
  }
}

// Données du dashboard - chargées depuis la BDD
const dashboardData = ref({
  stats: { projects: { value: '0', trend: '' }, members: { value: '0', trend: '' }, partnerships: { value: '0', trend: '' }, impact: { value: '0', trend: '' } },
  companies: [],
  events: []
})

// Données des statistiques principales - chargées depuis la BDD
const mainStats = ref([])

// Données du forum - chargées depuis la BDD
const forumTopics = ref([])

// Données des opportunités - chargées depuis la BDD
const opportunities = ref([])

// Données des objectifs ODD - chargées depuis la BDD
const sdgGoals = ref([])

// Fonctions utilitaires
const navigateTo = (route) => {
  // Navigation vers les différentes sections
  console.log('Navigation vers:', route)
}

const handleAction = (action) => {
  // Gestion des actions rapides
  console.log('Action:', action)
}

// Initialisation
onMounted(async () => {
  // TODO: Charger les données réelles depuis Supabase
  console.log('Dashboard PEVA initialisé')
  
  // Initialiser OneSignal
  try {
    await oneSignalService.init()
    
    // Configurer les tags utilisateur pour OneSignal
    if (user.value) {
      await oneSignalService.setUserTags({
        user_id: user.value.id,
        email: user.value.email,
        platform: 'web',
        language: 'fr',
        user_type: 'green_economy_participant'
      })
    }
    
    // Notification de bienvenue après 3 secondes
    setTimeout(() => {
      oneSignalService.sendGreenEconomyNotification('impact_milestone', {
        milestone: 'Connexion au dashboard PEVA',
        details: 'Bienvenue dans votre espace économie verte'
      })
    }, 3000)
    
    // Simulation de notifications périodiques pour la démo
    setTimeout(() => {
      if (notificationManager.value) {
        notificationManager.value.addNotification({
          type: 'opportunity',
          title: '🌱 Nouvelle Opportunité',
          message: 'Un projet d\'énergie solaire recherche des partenaires'
        })
      }
    }, 15000) // Après 15 secondes
    
    setTimeout(() => {
      if (notificationManager.value) {
        notificationManager.value.addNotification({
          type: 'system',
          title: '💰 Financement Disponible',
          message: 'Nouveau fonds vert de 50M€ ouvert aux candidatures'
        })
      }
    }, 30000) // Après 30 secondes
    
  } catch (error) {
    console.error('Erreur initialisation OneSignal:', error)
  }
})
</script>