<template>
  <div class="notification-manager">
    <!-- Bouton d'abonnement flottant -->
    <v-btn
      v-if="!isSubscribed && showFloatingButton"
      class="notification-fab"
      color="primary"
      fab
      fixed
      bottom
      right
      @click="subscribeToNotifications"
      :loading="loading"
    >
      <v-icon>mdi-bell-outline</v-icon>
    </v-btn>

    <!-- Snackbar pour les messages -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
      top
    >
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="snackbar.show = false"
        >
          Fermer
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Dialog de gestion des notifications -->
    <v-dialog v-model="dialog" max-width="500">
      <v-card>
        <v-card-title class="headline">
          <v-icon left>mdi-bell</v-icon>
          Notifications Push
        </v-card-title>
        
        <v-card-text>
          <div class="text-center mb-4">
            <v-icon 
              :color="isSubscribed ? 'success' : 'grey'"
              size="64"
            >
              {{ isSubscribed ? 'mdi-bell-check' : 'mdi-bell-outline' }}
            </v-icon>
          </div>
          
          <p class="text-center">
            <strong>
              {{ isSubscribed ? 'Vous êtes abonné aux notifications' : 'Abonnez-vous aux notifications' }}
            </strong>
          </p>
          
          <p class="text-body-2 text-center grey--text">
            Recevez les dernières actualités sur l'économie verte en Afrique,
            les opportunités d'investissement et les événements importants.
          </p>
          
          <v-divider class="my-4"></v-divider>
          
          <div class="d-flex align-center justify-space-between">
            <span>Statut des notifications:</span>
            <v-chip 
              :color="isSubscribed ? 'success' : 'warning'"
              small
              text-color="white"
            >
              {{ isSubscribed ? 'Activées' : 'Désactivées' }}
            </v-chip>
          </div>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer></v-spacer>
          
          <v-btn
            v-if="isSubscribed"
            color="warning"
            text
            @click="sendTestNotification"
            :loading="testLoading"
          >
            <v-icon left>mdi-send</v-icon>
            Test
          </v-btn>
          
          <v-btn
            v-if="!isSubscribed"
            color="primary"
            @click="subscribeToNotifications"
            :loading="loading"
          >
            <v-icon left>mdi-bell-plus</v-icon>
            S'abonner
          </v-btn>
          
          <v-btn
            text
            @click="dialog = false"
          >
            Fermer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import oneSignalService from '@/services/oneSignalService'

// Props
const props = defineProps({
  showFloatingButton: {
    type: Boolean,
    default: true
  },
  autoShow: {
    type: Boolean,
    default: false
  }
})

// État réactif
const isSubscribed = ref(false)
const loading = ref(false)
const testLoading = ref(false)
const dialog = ref(false)
const snackbar = ref({
  show: false,
  message: '',
  color: 'info',
  timeout: 4000
})

// État des notifications (conservé pour compatibilité)
const notifications = ref([])
const showSettings = ref(false)

// Paramètres de notification
const settings = ref({
  pushEnabled: false,
  emailEnabled: true,
  soundEnabled: true,
  types: {
    events: true,
    opportunities: true,
    messages: true,
    system: true
  }
})

// Computed
const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length
})

const hasUnreadNotifications = computed(() => {
  return unreadCount.value > 0
})

// Méthodes
const getNotificationIcon = (type) => {
  const icons = {
    event: 'mdi-calendar',
    opportunity: 'mdi-briefcase',
    message: 'mdi-message',
    system: 'mdi-cog',
    default: 'mdi-information'
  }
  return icons[type] || icons.default
}

const getNotificationColor = (type) => {
  const colors = {
    event: 'purple',
    opportunity: 'green',
    message: 'blue',
    system: 'orange',
    default: 'grey'
  }
  return colors[type] || colors.default
}

const formatDate = (date) => {
  const now = new Date()
  const notifDate = new Date(date)
  const diffInHours = Math.floor((now - notifDate) / (1000 * 60 * 60))
  
  if (diffInHours < 1) {
    return 'À l\'instant'
  } else if (diffInHours < 24) {
    return `Il y a ${diffInHours}h`
  } else {
    return notifDate.toLocaleDateString('fr-FR')
  }
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

const removeNotification = (id) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const clearAll = () => {
  notifications.value = []
}

const togglePushNotifications = async () => {
  if (settings.value.pushEnabled) {
    const permission = await oneSignalService.requestPermission()
    if (!permission) {
      settings.value.pushEnabled = false
    }
  }
}

const saveSettings = () => {
  // Sauvegarder les paramètres dans le localStorage
  localStorage.setItem('notificationSettings', JSON.stringify(settings.value))
  showSettings.value = false
}

const loadSettings = () => {
  const saved = localStorage.getItem('notificationSettings')
  if (saved) {
    settings.value = { ...settings.value, ...JSON.parse(saved) }
  }
}

const addNotification = (notification) => {
  const newNotification = {
    id: Date.now() + Math.random(),
    ...notification,
    read: false,
    createdAt: new Date()
  }
  notifications.value.unshift(newNotification)
  
  // Limiter à 50 notifications
  if (notifications.value.length > 50) {
    notifications.value = notifications.value.slice(0, 50)
  }
}

// Nouvelles méthodes pour la gestion des notifications push
const subscribeToNotifications = async () => {
  loading.value = true
  try {
    const success = await oneSignalService.subscribe()
    if (success) {
      isSubscribed.value = true
      showSnackbar('Vous êtes maintenant abonné aux notifications!', 'success')
      dialog.value = false
    } else {
      showSnackbar('Erreur lors de l\'abonnement aux notifications', 'error')
    }
  } catch (error) {
    console.error('Erreur d\'abonnement:', error)
    showSnackbar('Erreur lors de l\'abonnement aux notifications', 'error')
  } finally {
    loading.value = false
  }
}

const sendTestNotification = async () => {
  testLoading.value = true
  try {
    await oneSignalService.sendTestNotification()
    showSnackbar('Notification de test envoyée!', 'success')
  } catch (error) {
    console.error('Erreur test notification:', error)
    showSnackbar('Erreur lors de l\'envoi du test', 'error')
  } finally {
    testLoading.value = false
  }
}

const showSnackbar = (message, color = 'info') => {
  snackbar.value = {
    show: true,
    message,
    color,
    timeout: 4000
  }
}

const checkSubscriptionStatus = async () => {
  try {
    isSubscribed.value = await oneSignalService.isSubscribed()
  } catch (error) {
    console.error('Erreur vérification statut:', error)
  }
}

// Initialisation
onMounted(async () => {
  loadSettings()
  
  // Initialiser OneSignal
  await oneSignalService.init()
  
  // Vérifier le statut d'abonnement
  await checkSubscriptionStatus()
  
  // Afficher automatiquement le dialog si demandé
  if (props.autoShow && !isSubscribed.value) {
    dialog.value = true
  }
  
  // Écouter les notifications OneSignal
  oneSignalService.onNotificationReceived((event) => {
    addNotification({
      title: event.notification.title,
      message: event.notification.body,
      type: event.notification.data?.type || 'system'
    })
  })
  
  // Ajouter quelques notifications de test
  addNotification({
    title: 'Bienvenue sur PEVA',
    message: 'Découvrez les opportunités de l\'économie verte en Afrique',
    type: 'system'
  })
})

// Exposer les méthodes pour utilisation externe
defineExpose({
  addNotification,
  subscribeToNotifications,
  sendTestNotification,
  showDialog: () => { dialog.value = true },
  checkSubscriptionStatus
})
</script>

<style scoped>
.notification-manager {
  position: relative;
}
</style>