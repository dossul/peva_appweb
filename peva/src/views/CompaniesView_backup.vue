<template>
  <v-app>
    <!-- Navigation Header -->
    <v-app-bar color="white" elevation="1" app>
      <v-container class="d-flex align-center justify-space-between pa-0">
        <!-- Logo & Title -->
        <div class="d-flex align-center">
          <div class="d-flex align-center justify-center rounded-circle elevation-4 mr-3" style="height: 48px; width: 48px; background: linear-gradient(135deg, #4ade80 0%, #10b981 100%);">
            <v-icon color="white" size="24">mdi-leaf</v-icon>
          </div>
          <div>
            <h2 class="text-h6 font-weight-bold text-grey-darken-3">PEVA</h2>
            <p class="text-caption text-grey-darken-1 ma-0">Annuaire des Entreprises</p>
          </div>
        </div>

        <!-- Navigation Actions -->
        <div class="d-flex align-center ga-4">
          <v-btn variant="text" @click="$router.push('/')">
            <v-icon start>mdi-home</v-icon>
            Accueil
          </v-btn>
          
          <template v-if="authStore.isAuthenticated">
            <v-btn
              v-if="!authStore.isAdmin"
              color="green-darken-2"
              variant="flat"
              prepend-icon="mdi-view-dashboard"
              @click="$router.push('/user-dashboard')"
            >
              Dashboard
            </v-btn>
            
            <v-btn
              v-if="authStore.isAdmin"
              color="orange-darken-2"
              variant="flat"
              prepend-icon="mdi-shield-crown"
              @click="$router.push('/admin/dashboard')"
            >
              Admin
            </v-btn>
            
            <v-btn
              variant="outlined"
              color="grey-darken-2"
              prepend-icon="mdi-logout"
              @click="handleLogout"
            >
              Se déconnecter
            </v-btn>
          </template>
          
          <template v-else>
            <v-btn variant="text" color="green-darken-2" @click="$router.push('/auth/login')">
              Se connecter
            </v-btn>
            <v-btn color="green-darken-2" variant="flat" @click="$router.push('/auth/register')">
              S'inscrire
            </v-btn>
          </template>
        </div>
      </v-container>
    </v-app-bar>

    <!-- Main Content -->
    <v-main>
      <v-container class="py-8">
        <!-- Header Section -->
        <div class="text-center mb-8">
          <h1 class="text-h3 font-weight-bold text-grey-darken-3 mb-4">
            Annuaire des Entreprises Vertes
          </h1>
          <p class="text-h6 text-grey-darken-1 font-weight-regular">
            Découvrez les entreprises qui façonnent l'économie verte en Afrique
          </p>
        </div>

        <!-- Add Company Button -->
        <div class="text-center mb-6" v-if="authStore.isAuthenticated">
          <v-btn
            color="green-darken-2"
            variant="flat"
            size="large"
            prepend-icon="mdi-plus"
            @click="showCreateDialog = true"
            class="mb-6"
          >
            Ajouter une Entreprise
          </v-btn>
        </div>

        <!-- Companies Grid -->
        <v-row v-if="!loading">
          <v-col
            v-for="company in companies"
            :key="company.id"
            cols="12"
            md="6"
            lg="4"
          >
            <v-card class="h-100" elevation="2" hover>
              <!-- Company Logo -->
              <div class="pa-4 text-center">
                <v-avatar size="80" class="mb-3">
                  <v-img
                    v-if="company.logo_url"
                    :src="company.logo_url"
                    :alt="company.name"
                  />
                  <v-icon v-else size="40" color="green-darken-2">mdi-domain</v-icon>
                </v-avatar>
                
                <!-- Verified Badge -->
                <v-chip
                  v-if="company.is_verified"
                  color="green"
                  size="small"
                  prepend-icon="mdi-check-circle"
                  class="mb-2"
                >
                  Vérifiée
                </v-chip>
              </div>

              <v-card-title class="text-center">
                {{ company.name }}
              </v-card-title>

              <v-card-subtitle class="text-center">
                <div class="d-flex align-center justify-center mt-1 text-caption text-grey-darken-1">
                  <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
                  {{ company.location }}, {{ company.country }}
                </div>
              </v-card-subtitle>

              <v-card-text>
                <p class="text-body-2 mb-3">
                  {{ company.description.substring(0, 120) }}{{ company.description.length > 120 ? '...' : '' }}
                </p>
                
                <v-chip
                  v-if="company.sector"
                  color="blue-grey"
                  size="small"
                  class="mr-2"
                >
                  {{ company.sector.name || company.sector }}
                </v-chip>
                
                <v-chip
                  v-if="company.size"
                  color="purple"
                  size="small"
                  class="mb-2"
                >
                  {{ company.size }}
                </v-chip>
              </v-card-text>

              <v-card-actions class="pa-4">
                <v-btn
                  variant="outlined"
                  color="green-darken-2"
                  block
                  @click="viewCompany(company)"
                >
                  <v-icon start>mdi-eye</v-icon>
                  Voir Détails
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <v-progress-circular indeterminate color="green-darken-2" size="64" />
          <p class="text-h6 mt-4">Chargement des entreprises...</p>
        </div>

        <!-- Empty State -->
        <div v-if="!loading && companies.length === 0" class="text-center py-12">
          <v-icon size="120" color="grey-lighten-2">mdi-domain-off</v-icon>
          <h3 class="text-h5 font-weight-bold mt-4 mb-2">Aucune entreprise trouvée</h3>
          <p class="text-body-1 text-grey-darken-1">
            Commencez par ajouter votre première entreprise !
          </p>
        </div>
      </v-container>
    </v-main>

    <!-- Snackbar for notifications -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="4000"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">
          Fermer
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const companies = ref([
  {
    id: 1,
    name: 'EcoTech Ghana',
    description: 'Solutions d\'énergie renouvelable pour l\'Afrique de l\'Ouest. Spécialisée dans l\'installation de panneaux solaires.',
    location: 'Accra',
    country: 'Ghana',
    size: 'PME',
    sector: { id: 1, name: 'Énergies Renouvelables' },
    logo_url: null,
    is_verified: true,
    website: 'https://ecotech-ghana.com'
  },
  {
    id: 2,
    name: 'AgriVert Sénégal',
    description: 'Agriculture durable et solutions d\'irrigation intelligente pour les petits exploitants agricoles.',
    location: 'Dakar',
    country: 'Sénégal',
    size: 'Startup',
    sector: { id: 2, name: 'Agriculture Durable' },
    logo_url: null,
    is_verified: false,
    website: 'https://agrivert.sn'
  }
])

const loading = ref(false)
const showCreateDialog = ref(false)

// Snackbar
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Methods
const handleLogout = async () => {
  try {
    await authStore.signOut()
    router.push('/')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}

const viewCompany = (company) => {
  showMessage(`Détails de ${company.name} - Fonctionnalité en cours de développement`, 'info')
}

const showMessage = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  }
}

// Initialize
onMounted(() => {
  // Load companies from API
})
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.v-card {
  border-radius: 12px !important;
  transition: transform 0.2s ease-in-out;
}

.v-card:hover {
  transform: translateY(-2px);
}

.v-btn {
  border-radius: 8px !important;
}
</style>
