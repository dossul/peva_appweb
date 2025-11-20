<template>
  <AppCard class="notification-tester">
    <template #header>
      <div class="flex items-center gap-2">
        <v-icon color="orange">mdi-bell-ring</v-icon>
        <h3 class="text-lg font-semibold">Test des Notifications</h3>
      </div>
    </template>

    <div class="space-y-4">
      <p class="text-sm text-gray-600">
        Testez les différents types de notifications de la plateforme PEVA
      </p>

      <!-- Boutons de test -->
      <div class="grid grid-cols-2 gap-3">
        <AppButton 
          @click="testOpportunityNotification"
          variant="outline"
          size="sm"
          class="text-green-600 border-green-200 hover:bg-green-50"
        >
          <v-icon size="16" class="mr-1">mdi-leaf</v-icon>
          Opportunité
        </AppButton>

        <AppButton 
          @click="testProjectUpdateNotification"
          variant="outline"
          size="sm"
          class="text-blue-600 border-blue-200 hover:bg-blue-50"
        >
          <v-icon size="16" class="mr-1">mdi-chart-line</v-icon>
          Projet
        </AppButton>

        <AppButton 
          @click="testCommunityEventNotification"
          variant="outline"
          size="sm"
          class="text-purple-600 border-purple-200 hover:bg-purple-50"
        >
          <v-icon size="16" class="mr-1">mdi-account-group</v-icon>
          Événement
        </AppButton>

        <AppButton 
          @click="testMilestoneNotification"
          variant="outline"
          size="sm"
          class="text-orange-600 border-orange-200 hover:bg-orange-50"
        >
          <v-icon size="16" class="mr-1">mdi-target</v-icon>
          Objectif
        </AppButton>

        <AppButton 
          @click="testFundingNotification"
          variant="outline"
          size="sm"
          class="text-teal-600 border-teal-200 hover:bg-teal-50"
        >
          <v-icon size="16" class="mr-1">mdi-currency-usd</v-icon>
          Financement
        </AppButton>

        <AppButton 
          @click="testSystemNotification"
          variant="outline"
          size="sm"
          class="text-gray-600 border-gray-200 hover:bg-gray-50"
        >
          <v-icon size="16" class="mr-1">mdi-cog</v-icon>
          Système
        </AppButton>
      </div>

      <!-- Statistiques des notifications -->
      <div class="mt-4 p-3 bg-gray-50 rounded-lg">
        <div class="text-xs text-gray-500 mb-2">Statistiques de test</div>
        <div class="grid grid-cols-3 gap-2 text-center">
          <div>
            <div class="text-lg font-semibold text-green-600">{{ stats.sent }}</div>
            <div class="text-xs text-gray-500">Envoyées</div>
          </div>
          <div>
            <div class="text-lg font-semibold text-blue-600">{{ stats.clicked }}</div>
            <div class="text-xs text-gray-500">Cliquées</div>
          </div>
          <div>
            <div class="text-lg font-semibold text-orange-600">{{ stats.rate }}%</div>
            <div class="text-xs text-gray-500">Taux</div>
          </div>
        </div>
      </div>

      <!-- Actions rapides -->
      <div class="flex gap-2 pt-2 border-t">
        <AppButton 
          @click="requestPermission"
          variant="solid"
          size="sm"
          class="bg-green-600 hover:bg-green-700 text-white flex-1"
        >
          <v-icon size="16" class="mr-1">mdi-bell-check</v-icon>
          Activer Push
        </AppButton>
        
        <AppButton 
          @click="clearStats"
          variant="outline"
          size="sm"
          class="text-gray-600 border-gray-200"
        >
          <v-icon size="16">mdi-refresh</v-icon>
        </AppButton>
      </div>
    </div>
  </AppCard>
</template>

<script setup>
import { ref, computed } from 'vue'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'
import oneSignalService from '@/services/oneSignalService'

// Props
const props = defineProps({
  notificationManager: {
    type: Object,
    default: null
  }
})

// État réactif
const stats = ref({
  sent: 0,
  clicked: 0
})

// Computed
const rate = computed(() => {
  if (stats.value.sent === 0) return 0
  return Math.round((stats.value.clicked / stats.value.sent) * 100)
})

stats.value.rate = rate

// Méthodes de test
const addNotification = (notification) => {
  if (props.notificationManager) {
    props.notificationManager.addNotification(notification)
    stats.value.sent++
  }
}

const testOpportunityNotification = () => {
  addNotification({
    type: 'opportunity',
    title: '🌱 Nouvelle Opportunité Verte',
    message: 'Projet d\'agriculture durable recherche des investisseurs - Sénégal'
  })
  
  // Notification OneSignal
  oneSignalService.sendGreenEconomyNotification('new_opportunity', {
    sector: 'Agriculture Durable',
    location: 'Sénégal',
    investment: '500K€'
  })
}

const testProjectUpdateNotification = () => {
  addNotification({
    type: 'system',
    title: '📊 Mise à jour de Projet',
    message: 'Votre projet de reforestation au Mali a atteint 75% de completion'
  })
  
  oneSignalService.sendGreenEconomyNotification('project_update', {
    projectName: 'Reforestation Mali',
    progress: '75%',
    nextMilestone: 'Plantation finale'
  })
}

const testCommunityEventNotification = () => {
  addNotification({
    type: 'event',
    title: '🤝 Événement Communautaire',
    message: 'Sommet de l\'Économie Verte Africaine - 15 Mars 2024 à Dakar'
  })
  
  oneSignalService.sendGreenEconomyNotification('community_event', {
    eventName: 'Sommet Économie Verte Africaine',
    date: '15 Mars 2024',
    location: 'Dakar'
  })
}

const testMilestoneNotification = () => {
  addNotification({
    type: 'system',
    title: '🎯 Objectif Atteint!',
    message: 'Félicitations! Vous avez économisé 1 tonne de CO2 ce mois-ci'
  })
  
  oneSignalService.sendGreenEconomyNotification('impact_milestone', {
    milestone: '1 tonne CO2 économisée',
    period: 'ce mois',
    reward: 'Badge Éco-Héros'
  })
}

const testFundingNotification = () => {
  addNotification({
    type: 'system',
    title: '💰 Financement Disponible',
    message: 'Fonds Vert BAD: 100M€ pour projets énergies renouvelables'
  })
  
  oneSignalService.sendGreenEconomyNotification('funding_alert', {
    fundingName: 'Fonds Vert BAD',
    amount: '100M€',
    sector: 'Énergies Renouvelables'
  })
}

const testSystemNotification = () => {
  addNotification({
    type: 'system',
    title: '⚙️ Mise à jour Système',
    message: 'Nouvelles fonctionnalités disponibles dans votre dashboard'
  })
}

const requestPermission = async () => {
  try {
    await oneSignalService.requestPermission()
    addNotification({
      type: 'system',
      title: '✅ Notifications Activées',
      message: 'Vous recevrez maintenant les notifications push PEVA'
    })
  } catch (error) {
    console.error('Erreur permission:', error)
    addNotification({
      type: 'system',
      title: '❌ Erreur Permission',
      message: 'Impossible d\'activer les notifications push'
    })
  }
}

const clearStats = () => {
  stats.value.sent = 0
  stats.value.clicked = 0
}

// Simuler des clics pour la démo
setInterval(() => {
  if (stats.value.sent > 0 && Math.random() > 0.7) {
    stats.value.clicked++
  }
}, 5000)
</script>

<style scoped>
.notification-tester {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}
</style>