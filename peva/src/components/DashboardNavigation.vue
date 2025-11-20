<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    clipped
    :mini-variant="miniVariant"
    :width="280"
    color="primary"
    dark
  >
    <!-- Header du drawer -->
    <v-list-item class="px-2">
      <v-list-item-avatar>
        <v-img src="/logo.png" alt="PEVA"></v-img>
      </v-list-item-avatar>
      <v-list-item-title class="text-h6">
        PEVA
      </v-list-item-title>
      <v-btn
        icon
        @click.stop="miniVariant = !miniVariant"
      >
        <v-icon>{{ miniVariant ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
      </v-btn>
    </v-list-item>

    <v-divider></v-divider>

    <!-- Menu principal -->
    <v-list nav dense>
      <!-- Dashboard Utilisateur -->
      <v-list-item
        :to="{ name: 'UserDashboard' }"
        exact
        color="white"
      >
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- Dashboard Admin (si admin) -->
      <v-list-item
        v-if="authStore.isAdmin"
        :to="{ name: 'AdminDashboard' }"
        exact
        color="white"
      >
        <v-list-item-icon>
          <v-icon>mdi-shield-crown</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Administration</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <v-divider class="my-2"></v-divider>

      <!-- Autres liens -->
      <v-list-item
        :to="{ name: 'Profile' }"
        exact
        color="white"
      >
        <v-list-item-icon>
          <v-icon>mdi-account</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Profil</v-list-item-title>
        </v-list-item-content>
      </v-list-item>

      <!-- Dashboard Original (temporaire) -->
      <v-list-item
        :to="{ name: 'Dashboard' }"
        exact
        color="white"
      >
        <v-list-item-icon>
          <v-icon>mdi-view-dashboard-outline</v-icon>
        </v-list-item-icon>
        <v-list-item-content>
          <v-list-item-title>Dashboard Original</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>

    <!-- Footer du drawer -->
    <template v-slot:append>
      <v-divider></v-divider>
      <v-list nav dense>
        <v-list-item @click="handleLogout">
          <v-list-item-icon>
            <v-icon>mdi-logout</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>Déconnexion</v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

// Props
const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  }
})

// Emits
const emit = defineEmits(['update:modelValue'])

// Stores et router
const authStore = useAuthStore()
const router = useRouter()

// État local
const drawer = ref(props.modelValue)
const miniVariant = ref(false)

// Watchers
watch(() => props.modelValue, (newVal) => {
  drawer.value = newVal
})

watch(drawer, (newVal) => {
  emit('update:modelValue', newVal)
})

// Méthodes
const handleLogout = async () => {
  try {
    await authStore.signOut()
    router.push({ name: 'Login' })
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}
</script>

<style scoped>
.v-navigation-drawer {
  border-right: 1px solid rgba(255, 255, 255, 0.12);
}

.v-list-item--active {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.v-list-item:hover {
  background-color: rgba(255, 255, 255, 0.05);
}
</style>