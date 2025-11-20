<template>
  <v-app>
    <!-- Navigation drawer -->
    <DashboardNavigation v-model="drawer" />

    <!-- App bar -->
    <v-app-bar
      app
      clipped-left
      color="white"
      elevation="1"
      height="64"
    >
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      
      <v-toolbar-title class="text-h6 font-weight-medium text-primary">
        {{ pageTitle }}
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Notifications -->
      <v-btn icon>
        <v-badge
          :content="notificationCount"
          :value="notificationCount > 0"
          color="error"
          overlap
        >
          <v-icon>mdi-bell</v-icon>
        </v-badge>
      </v-btn>

      <!-- Menu utilisateur -->
      <v-menu offset-y>
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            icon
            v-bind="attrs"
            v-on="on"
          >
            <v-avatar size="32">
              <v-img
                v-if="authStore.userProfile.avatar_url"
                :src="authStore.userProfile.avatar_url"
                :alt="authStore.userProfile.full_name || 'Avatar'"
              ></v-img>
              <v-icon v-else>mdi-account-circle</v-icon>
            </v-avatar>
          </v-btn>
        </template>
        
        <v-list>
          <v-list-item>
            <v-list-item-content>
              <v-list-item-title class="font-weight-medium">
                {{ authStore.userProfile.full_name || 'Utilisateur' }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ authStore.user?.email }}
              </v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          
          <v-divider></v-divider>
          
          <v-list-item :to="{ name: 'Profile' }">
            <v-list-item-icon>
              <v-icon>mdi-account</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Mon profil</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
          
          <v-list-item @click="handleLogout">
            <v-list-item-icon>
              <v-icon>mdi-logout</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>Déconnexion</v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <!-- Contenu principal -->
    <v-main>
      <v-container fluid class="pa-0">
        <slot></slot>
      </v-container>
    </v-main>

    <!-- Notification Manager -->
    <NotificationManager ref="notificationManager" />
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import DashboardNavigation from '@/components/DashboardNavigation.vue'
import NotificationManager from '@/components/NotificationManager.vue'

// Stores et router
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// État local
const drawer = ref(true)
const notificationManager = ref(null)
const notificationCount = ref(0)

// Computed
const pageTitle = computed(() => {
  const titles = {
    'UserDashboard': 'Dashboard Utilisateur',
    'AdminDashboard': 'Dashboard Administrateur',
    'Profile': 'Mon Profil',
    'Dashboard': 'Tableau de bord'
  }
  return titles[route.name] || 'PEVA'
})

// Méthodes
const handleLogout = async () => {
  try {
    await authStore.signOut()
    router.push({ name: 'Login' })
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    if (notificationManager.value) {
      notificationManager.value.showError('Erreur lors de la déconnexion')
    }
  }
}

// Lifecycle
onMounted(() => {
  // Initialiser les notifications si nécessaire
  // notificationCount.value = ...
})
</script>

<style scoped>
.v-app-bar {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}

.v-main {
  background-color: #f5f5f5;
}
</style>