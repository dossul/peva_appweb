<script setup>
// App principal PEVA
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import AppHeader from '@/components/AppHeader.vue'
import NotificationManager from '@/components/NotificationManager.vue'

const route = useRoute()

// Pages qui n'ont pas besoin du header (comme les pages d'auth)
const hideHeaderRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password']
const showHeader = computed(() => !hideHeaderRoutes.includes(route.path))
</script>

<template>
  <v-app>
    <!-- Header global -->
    <AppHeader v-if="showHeader" />
    
    <v-main>
      <div class="tw-min-h-screen tw-bg-background">
        <router-view />
        
        <!-- Gestionnaire de notifications global - bouton flottant désactivé (OneSignal utilisé) -->
        <NotificationManager 
          :show-floating-button="false"
          :auto-show="false"
        />
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
/* Styles spécifiques à l'App si nécessaire */
</style>
