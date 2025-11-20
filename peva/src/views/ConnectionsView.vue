<template>
  <div class="connections-view">
    <!-- Header -->
    <div class="hero-banner text-white py-8">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon size="48" class="mr-4">mdi-account-network</v-icon>
            <div>
              <h1 class="text-h3 font-weight-bold mb-2">Mes Connexions</h1>
              <p class="text-h6 font-weight-regular ma-0">Gérez vos connexions professionnelles</p>
            </div>
          </div>
          <div class="d-flex align-center ga-2">
            <v-chip color="white" text-color="green" size="small">
              <v-icon start>mdi-check-circle</v-icon>
              {{ activeConnections.length }} connexions
            </v-chip>
            <v-chip color="white" text-color="orange" size="small">
              <v-icon start>mdi-clock</v-icon>
              {{ pendingRequests.length }} en attente
            </v-chip>
          </div>
        </div>
      </v-container>
    </div>

    <v-container class="py-6">
      <!-- Onglets -->
      <v-tabs v-model="activeTab" class="mb-6" color="green">
        <v-tab value="connections">
          <v-icon start>mdi-account-group</v-icon>
          Mes Connexions ({{ activeConnections.length }})
        </v-tab>
        <v-tab value="received">
          <v-icon start>mdi-inbox</v-icon>
          Demandes reçues ({{ receivedRequests.length }})
        </v-tab>
        <v-tab value="sent">
          <v-icon start>mdi-send</v-icon>
          Demandes envoyées ({{ sentRequests.length }})
        </v-tab>
      </v-tabs>

      <!-- Contenu des onglets -->
      <v-window v-model="activeTab">
        <!-- Onglet Connexions actives -->
        <v-window-item value="connections">
          <div v-if="activeConnections.length === 0" class="text-center py-12">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-account-network-outline</v-icon>
            <h3 class="text-h6 text-grey-darken-1 mb-2">Aucune connexion pour le moment</h3>
            <p class="text-body-2 text-grey-darken-1 mb-4">Commencez à vous connecter avec d'autres entreprises depuis la carte interactive</p>
            <v-btn color="green" variant="flat" @click="$router.push('/map')">
              <v-icon start>mdi-map</v-icon>
              Découvrir les entreprises
            </v-btn>
          </div>

          <v-row v-else>
            <v-col v-for="connection in activeConnections" :key="connection.id" cols="12" md="6" lg="4">
              <v-card elevation="2" class="connection-card">
                <v-card-text class="pa-4">
                  <div class="d-flex align-center mb-3">
                    <v-avatar :color="connection.avatarColor" size="48" class="mr-3">
                      <span class="text-white font-weight-bold">{{ connection.initials }}</span>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <h4 class="text-body-1 font-weight-bold">{{ connection.name }}</h4>
                      <p class="text-body-2 text-grey-darken-1 ma-0">{{ connection.location }}</p>
                      <p class="text-body-2 ma-0" :style="{ color: connection.sectorColor }">{{ connection.sector }}</p>
                    </div>
                    <v-menu>
                      <template v-slot:activator="{ props }">
                        <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props" />
                      </template>
                      <v-list>
                        <v-list-item @click="viewProfile(connection)">
                          <v-list-item-title>Voir le profil</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="sendMessage(connection)">
                          <v-list-item-title>Envoyer un message</v-list-item-title>
                        </v-list-item>
                        <v-list-item @click="removeConnection(connection)" class="text-red">
                          <v-list-item-title>Supprimer la connexion</v-list-item-title>
                        </v-list-item>
                      </v-list>
                    </v-menu>
                  </div>

                  <div class="mb-3">
                    <div class="d-flex justify-space-between text-body-2 mb-1">
                      <span>Employés:</span>
                      <span class="font-weight-medium">{{ connection.employees }}</span>
                    </div>
                    <div class="d-flex justify-space-between text-body-2 mb-1">
                      <span>Connecté depuis:</span>
                      <span class="font-weight-medium">{{ connection.connectedSince }}</span>
                    </div>
                  </div>

                  <div class="d-flex ga-2">
                    <v-btn size="small" variant="outlined" color="green" @click="sendMessage(connection)">
                      <v-icon start>mdi-message</v-icon>
                      Message
                    </v-btn>
                    <v-btn size="small" variant="outlined" @click="viewProfile(connection)">
                      <v-icon start>mdi-account</v-icon>
                      Profil
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>

        <!-- Onglet Demandes reçues -->
        <v-window-item value="received">
          <div v-if="receivedRequests.length === 0" class="text-center py-12">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-inbox-outline</v-icon>
            <h3 class="text-h6 text-grey-darken-1 mb-2">Aucune demande reçue</h3>
            <p class="text-body-2 text-grey-darken-1">Les demandes de connexion apparaîtront ici</p>
          </div>

          <v-row v-else>
            <v-col v-for="request in receivedRequests" :key="request.id" cols="12">
              <v-card elevation="2" class="request-card">
                <v-card-text class="pa-4">
                  <div class="d-flex align-center">
                    <v-avatar :color="request.avatarColor" size="48" class="mr-3">
                      <span class="text-white font-weight-bold">{{ request.initials }}</span>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <h4 class="text-body-1 font-weight-bold">{{ request.name }}</h4>
                      <p class="text-body-2 text-grey-darken-1 ma-0">{{ request.location }}</p>
                      <p class="text-body-2 ma-0" :style="{ color: request.sectorColor }">{{ request.sector }}</p>
                      <p class="text-caption text-grey-darken-1 mt-1">Demande reçue {{ request.timeAgo }}</p>
                    </div>
                    <div class="d-flex ga-2">
                      <v-btn color="green" variant="flat" size="small" @click="acceptRequest(request)">
                        <v-icon start>mdi-check</v-icon>
                        Accepter
                      </v-btn>
                      <v-btn color="red" variant="outlined" size="small" @click="rejectRequest(request)">
                        <v-icon start>mdi-close</v-icon>
                        Refuser
                      </v-btn>
                    </div>
                  </div>

                  <div v-if="request.message" class="mt-3 pa-3 bg-grey-lighten-4 rounded">
                    <p class="text-body-2 ma-0 font-italic">"{{ request.message }}"</p>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>

        <!-- Onglet Demandes envoyées -->
        <v-window-item value="sent">
          <div v-if="sentRequests.length === 0" class="text-center py-12">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-send-outline</v-icon>
            <h3 class="text-h6 text-grey-darken-1 mb-2">Aucune demande envoyée</h3>
            <p class="text-body-2 text-grey-darken-1">Vos demandes de connexion apparaîtront ici</p>
          </div>

          <v-row v-else>
            <v-col v-for="request in sentRequests" :key="request.id" cols="12">
              <v-card elevation="2" class="request-card">
                <v-card-text class="pa-4">
                  <div class="d-flex align-center">
                    <v-avatar :color="request.avatarColor" size="48" class="mr-3">
                      <span class="text-white font-weight-bold">{{ request.initials }}</span>
                    </v-avatar>
                    <div class="flex-grow-1">
                      <h4 class="text-body-1 font-weight-bold">{{ request.name }}</h4>
                      <p class="text-body-2 text-grey-darken-1 ma-0">{{ request.location }}</p>
                      <p class="text-body-2 ma-0" :style="{ color: request.sectorColor }">{{ request.sector }}</p>
                      <p class="text-caption text-grey-darken-1 mt-1">Demande envoyée {{ request.timeAgo }}</p>
                    </div>
                    <div>
                      <v-chip 
                        :color="getStatusColor(request.status)" 
                        size="small" 
                        variant="flat"
                      >
                        {{ getStatusText(request.status) }}
                      </v-chip>
                    </div>
                  </div>

                  <div v-if="request.message" class="mt-3 pa-3 bg-grey-lighten-4 rounded">
                    <p class="text-body-2 ma-0 font-italic">"{{ request.message }}"</p>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>
      </v-window>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { connectionService } from '@/services/connectionService'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const activeTab = ref('connections')
const connections = ref([])
const receivedRequests = ref([])
const sentRequests = ref([])

// Mock data pour les connexions actives
const mockConnections = [
  {
    id: 1,
    name: 'SolarTech Côte d\'Ivoire',
    initials: 'ST',
    avatarColor: 'green',
    location: 'Abidjan, Côte d\'Ivoire',
    sector: 'Énergies renouvelables',
    sectorColor: '#22c55e',
    employees: 45,
    connectedSince: '2 mois',
    status: 'active'
  },
  {
    id: 2,
    name: 'Green Farm Ghana',
    initials: 'GF',
    avatarColor: 'blue',
    location: 'Accra, Ghana',
    sector: 'Agriculture durable',
    sectorColor: '#10b981',
    employees: 120,
    connectedSince: '1 mois',
    status: 'active'
  }
]

// Mock data pour les demandes reçues
const mockReceivedRequests = [
  {
    id: 3,
    name: 'EcoTransport Sénégal',
    initials: 'ET',
    avatarColor: 'purple',
    location: 'Dakar, Sénégal',
    sector: 'Transport vert',
    sectorColor: '#3b82f6',
    message: 'Bonjour, je suis intéressé par vos activités et souhaiterais explorer des opportunités de collaboration.',
    timeAgo: 'il y a 2 heures',
    status: 'pending'
  }
]

// Mock data pour les demandes envoyées
const mockSentRequests = [
  {
    id: 4,
    name: 'CleanWater Nigeria',
    initials: 'CW',
    avatarColor: 'teal',
    location: 'Lagos, Nigeria',
    sector: 'Eau et assainissement',
    sectorColor: '#06b6d4',
    message: 'Nous aimerions discuter de partenariats potentiels dans le domaine de l\'eau.',
    timeAgo: 'il y a 1 jour',
    status: 'pending'
  },
  {
    id: 5,
    name: 'Atlas Green Morocco',
    initials: 'AG',
    avatarColor: 'orange',
    location: 'Casablanca, Maroc',
    sector: 'Énergies renouvelables',
    sectorColor: '#22c55e',
    message: 'Intéressé par vos solutions solaires.',
    timeAgo: 'il y a 3 jours',
    status: 'accepted'
  }
]

// Computed properties
const activeConnections = computed(() => {
  return connections.value.filter(c => c.status === 'active')
})

const pendingRequests = computed(() => {
  return [...receivedRequests.value, ...sentRequests.value.filter(r => r.status === 'pending')]
})

// Methods
const acceptRequest = async (request) => {
  try {
    await connectionService.acceptRequest(request.id)
    
    // Déplacer vers les connexions actives
    const newConnection = {
      ...request,
      status: 'active',
      connectedSince: 'maintenant'
    }
    connections.value.push(newConnection)
    
    // Supprimer des demandes reçues
    const index = receivedRequests.value.findIndex(r => r.id === request.id)
    if (index !== -1) {
      receivedRequests.value.splice(index, 1)
    }
    
    alert(`✅ Connexion acceptée avec ${request.name} !`)
  } catch (error) {
    console.error('Erreur lors de l\'acceptation:', error)
    alert('❌ Erreur lors de l\'acceptation de la demande.')
  }
}

const rejectRequest = async (request) => {
  try {
    await connectionService.rejectRequest(request.id)
    
    // Supprimer des demandes reçues
    const index = receivedRequests.value.findIndex(r => r.id === request.id)
    if (index !== -1) {
      receivedRequests.value.splice(index, 1)
    }
    
    alert(`Demande de ${request.name} refusée.`)
  } catch (error) {
    console.error('Erreur lors du refus:', error)
    alert('❌ Erreur lors du refus de la demande.')
  }
}

const removeConnection = async (connection) => {
  const confirmed = confirm(`Êtes-vous sûr de vouloir supprimer la connexion avec ${connection.name} ?`)
  if (!confirmed) return
  
  try {
    await connectionService.removeConnection(connection.id)
    
    // Supprimer des connexions
    const index = connections.value.findIndex(c => c.id === connection.id)
    if (index !== -1) {
      connections.value.splice(index, 1)
    }
    
    alert(`Connexion supprimée avec ${connection.name}.`)
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
    alert('❌ Erreur lors de la suppression de la connexion.')
  }
}

const sendMessage = (contact) => {
  router.push({
    name: 'Messages',
    query: {
      contact: contact.id,
      contactName: contact.name,
      contactType: 'company'
    }
  })
}

const viewProfile = (contact) => {
  // TODO: Rediriger vers le profil de l'entreprise
  alert(`Voir le profil de ${contact.name}`)
}

const getStatusColor = (status) => {
  const colors = {
    'pending': 'orange',
    'accepted': 'green',
    'rejected': 'red'
  }
  return colors[status] || 'grey'
}

const getStatusText = (status) => {
  const texts = {
    'pending': 'En attente',
    'accepted': 'Acceptée',
    'rejected': 'Refusée'
  }
  return texts[status] || 'Inconnu'
}

// Initialize
onMounted(async () => {
  // Charger les données mock
  connections.value = [...mockConnections]
  receivedRequests.value = [...mockReceivedRequests]
  sentRequests.value = [...mockSentRequests]
  
  // TODO: Charger les vraies données depuis l'API
  // try {
  //   const userId = authStore.user?.id
  //   if (userId) {
  //     connections.value = await connectionService.getConnections(userId)
  //     receivedRequests.value = await connectionService.getReceivedRequests(userId)
  //     sentRequests.value = await connectionService.getSentRequests(userId)
  //   }
  // } catch (error) {
  //   console.error('Erreur lors du chargement:', error)
  // }
})
</script>

<style scoped>
.connections-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.hero-banner {
  background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%);
}

.connection-card,
.request-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-radius: 12px !important;
}

.connection-card:hover,
.request-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.v-card {
  border-radius: 12px !important;
}

.v-btn {
  border-radius: 8px !important;
}

.v-tab {
  text-transform: none !important;
}
</style>
