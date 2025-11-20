<template>
  <div class="notification-center">
    <!-- Bell Icon avec badge -->
    <div class="relative cursor-pointer" @click="toggleNotifications">
      <v-icon 
        :color="hasUnread ? 'orange' : 'grey'"
        size="24"
      >
        mdi-bell
      </v-icon>
      <div 
        v-if="unreadCount > 0" 
        class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center"
      >
        {{ unreadCount > 9 ? '9+' : unreadCount }}
      </div>
    </div>

    <!-- Panel des notifications -->
    <div 
      v-if="showNotifications" 
      class="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border z-50 max-h-96 overflow-hidden"
    >
      <!-- Header -->
      <div class="p-4 border-b bg-gradient-to-r from-green-50 to-blue-50">
        <div class="flex justify-between items-center">
          <h3 class="font-semibold text-gray-800">Notifications</h3>
          <div class="flex gap-2">
            <button 
              @click="markAllAsRead" 
              class="text-sm text-blue-600 hover:text-blue-800"
              v-if="hasUnread"
            >
              Tout marquer lu
            </button>
            <button 
              @click="requestNotificationPermission" 
              class="text-sm text-green-600 hover:text-green-800"
              v-if="!notificationPermission"
            >
              Activer
            </button>
          </div>
        </div>
      </div>

      <!-- Liste des notifications -->
      <div class="max-h-64 overflow-y-auto">
        <div v-if="notifications.length === 0" class="p-4 text-center text-gray-500">
          <v-icon class="mb-2" size="48" color="grey-lighten-2">mdi-bell-outline</v-icon>
          <p>Aucune notification</p>
        </div>
        
        <div 
          v-for="notification in notifications" 
          :key="notification.id"
          class="p-3 border-b hover:bg-gray-50 cursor-pointer transition-colors"
          :class="{ 'bg-blue-50': !notification.read }"
          @click="markAsRead(notification.id)"
        >
          <div class="flex items-start gap-3">
            <div class="flex-shrink-0">
              <v-icon :color="getNotificationColor(notification.type)" size="20">
                {{ getNotificationIcon(notification.type) }}
              </v-icon>
            </div>
            <div class="flex-1 min-w-0">
              <p class="font-medium text-sm text-gray-900 truncate">
                {{ notification.title }}
              </p>
              <p class="text-sm text-gray-600 mt-1">
                {{ notification.message }}
              </p>
              <p class="text-xs text-gray-400 mt-1">
                {{ formatTime(notification.createdAt) }}
              </p>
            </div>
            <div v-if="!notification.read" class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="p-3 border-t bg-gray-50">
        <button 
          @click="clearAllNotifications" 
          class="w-full text-sm text-red-600 hover:text-red-800 py-1"
        >
          Effacer toutes les notifications
        </button>
      </div>
    </div>

    <!-- Overlay pour fermer -->
    <div 
      v-if="showNotifications" 
      class="fixed inset-0 z-40" 
      @click="showNotifications = false"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import oneSignalService from '@/services/oneSignalService'

// État réactif
const showNotifications = ref(false)
const notificationPermission = ref(false)
const notifications = ref([
  {
    id: 1,
    type: 'new_opportunity',
    title: 'Nouvelle Opportunité Verte',
    message: 'Une opportunité dans l\'énergie solaire est disponible',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30) // 30 min ago
  },
  {
    id: 2,
    type: 'project_update',
    title: 'Mise à jour de Projet',
    message: 'Votre projet de reforestation a progressé de 25%',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2) // 2h ago
  },
  {
    id: 3,
    type: 'community_event',
    title: 'Événement Communautaire',
    message: 'Webinaire sur l\'agriculture durable demain à 14h',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24) // 1 day ago
  }
])

// Computed
const unreadCount = computed(() => 
  notifications.value.filter(n => !n.read).length
)

const hasUnread = computed(() => unreadCount.value > 0)

// Méthodes
const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
}

const markAsRead = (id) => {
  const notification = notifications.value.find(n => n.id === id)
  if (notification) {
    notification.read = true
  }
}

const markAllAsRead = () => {
  notifications.value.forEach(n => n.read = true)
}

const clearAllNotifications = () => {
  notifications.value = []
  showNotifications.value = false
}

const requestNotificationPermission = async () => {
  try {
    await oneSignalService.requestPermission()
    notificationPermission.value = true
    
    // Ajouter une notification de confirmation
    addNotification({
      type: 'system',
      title: 'Notifications Activées',
      message: 'Vous recevrez maintenant les notifications push'
    })
  } catch (error) {
    console.error('Erreur permission notifications:', error)
  }
}

const addNotification = (notificationData) => {
  const newNotification = {
    id: Date.now(),
    read: false,
    createdAt: new Date(),
    ...notificationData
  }
  notifications.value.unshift(newNotification)
  
  // Limiter à 50 notifications max
  if (notifications.value.length > 50) {
    notifications.value = notifications.value.slice(0, 50)
  }
}

const getNotificationIcon = (type) => {
  const icons = {
    'new_opportunity': 'mdi-leaf',
    'project_update': 'mdi-chart-line',
    'community_event': 'mdi-account-group',
    'impact_milestone': 'mdi-target',
    'funding_alert': 'mdi-currency-usd',
    'system': 'mdi-cog'
  }
  return icons[type] || 'mdi-information'
}

const getNotificationColor = (type) => {
  const colors = {
    'new_opportunity': 'green',
    'project_update': 'blue',
    'community_event': 'purple',
    'impact_milestone': 'orange',
    'funding_alert': 'teal',
    'system': 'grey'
  }
  return colors[type] || 'grey'
}

const formatTime = (date) => {
  const now = new Date()
  const diff = now - date
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (minutes < 1) return 'À l\'instant'
  if (minutes < 60) return `Il y a ${minutes}min`
  if (hours < 24) return `Il y a ${hours}h`
  if (days < 7) return `Il y a ${days}j`
  
  return date.toLocaleDateString('fr-FR')
}

// Gestion des clics extérieurs
const handleClickOutside = (event) => {
  if (!event.target.closest('.notification-center')) {
    showNotifications.value = false
  }
}

// Lifecycle
onMounted(async () => {
  // Initialiser OneSignal
  await oneSignalService.init()
  oneSignalService.setupEventListeners()
  
  // Vérifier la permission
  notificationPermission.value = Notification.permission === 'granted'
  
  // Écouter les clics extérieurs
  document.addEventListener('click', handleClickOutside)
  
  // Simuler des notifications périodiques pour la démo
  setTimeout(() => {
    addNotification({
      type: 'impact_milestone',
      title: 'Objectif Atteint! 🎯',
      message: 'Vous avez économisé 100kg de CO2 ce mois-ci'
    })
  }, 10000) // Après 10 secondes
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

// Exposer la méthode pour ajouter des notifications
defineExpose({
  addNotification
})
</script>

<style scoped>
.notification-center {
  position: relative;
}

/* Animation pour les nouvelles notifications */
.notification-enter-active {
  transition: all 0.3s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

/* Scrollbar personnalisée */
.max-h-64::-webkit-scrollbar {
  width: 4px;
}

.max-h-64::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.max-h-64::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.max-h-64::-webkit-scrollbar-thumb:hover {
  background: #a1a1a1;
}
</style>