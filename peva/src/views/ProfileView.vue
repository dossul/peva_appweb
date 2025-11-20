<template>
  <div class="profile-view">
    <!-- Bannière de profil -->
    <div class="profile-banner bg-green-darken-2 text-white py-12">
      <v-container>
        <div class="d-flex align-center">
          <!-- Avatar -->
          <div class="position-relative mr-6">
            <v-avatar size="120" class="profile-avatar">
              <v-img
                v-if="profileData.avatar_url"
                :src="profileData.avatar_url"
                :alt="fullName"
              />
              <div v-else class="d-flex align-center justify-center bg-white text-green-darken-2">
                <span class="text-h3 font-weight-bold">{{ initials }}</span>
              </div>
            </v-avatar>
            <v-btn
              icon="mdi-camera"
              size="small"
              color="white"
              class="position-absolute"
              style="bottom: 0; right: 0;"
              @click="uploadAvatar"
            />
          </div>
          
          <!-- Informations principales -->
          <div class="flex-grow-1">
            <h1 class="text-h3 font-weight-bold mb-2">{{ fullName }}</h1>
            <p class="text-h6 mb-2">{{ profileData.user_type }} • {{ profileData.sector }}</p>
            <div class="d-flex align-center mb-3">
              <v-icon class="mr-2">mdi-map-marker</v-icon>
              <span>{{ profileData.location }}</span>
            </div>
          </div>
          
          <!-- Actions -->
          <div class="d-flex flex-column ga-2">
            <v-btn color="white" variant="flat" prepend-icon="mdi-plus" class="text-green-darken-2">
              Se connecter
            </v-btn>
            <v-btn color="white" variant="outlined" prepend-icon="mdi-email">
              Envoyer un message
            </v-btn>
            <v-btn color="white" variant="outlined" prepend-icon="mdi-heart">
              Ajouter aux favoris
            </v-btn>
          </div>
        </div>
        
        <!-- Statistiques -->
        <v-row class="mt-6">
          <v-col cols="4" class="text-center">
            <div class="text-h4 font-weight-bold">247</div>
            <div class="text-body-2">Connexions</div>
          </v-col>
          <v-col cols="4" class="text-center">
            <div class="text-h4 font-weight-bold">12</div>
            <div class="text-body-2">Opportunités</div>
          </v-col>
          <v-col cols="4" class="text-center">
            <div class="text-h4 font-weight-bold">1.2k</div>
            <div class="text-body-2">Vues profil</div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <v-container class="py-8">
      <v-row>
        <!-- Colonne principale -->
        <v-col cols="12" md="8">
          <!-- À propos -->
          <v-card class="mb-6" elevation="2">
            <v-card-title class="pa-4">
              <v-icon class="mr-2">mdi-account</v-icon>
              À propos
            </v-card-title>
            <v-card-text class="pa-4">
              <p class="text-body-1 mb-4">{{ profileData.bio }}</p>
              
              <!-- Secteurs d'expertise -->
              <div class="mb-4">
                <h3 class="text-h6 font-weight-bold mb-2">Secteurs d'expertise</h3>
                <div class="d-flex flex-wrap ga-2">
                  <v-chip
                    v-for="sector in expertiseSectors"
                    :key="sector.id"
                    :color="sector.color"
                    size="small"
                    :prepend-icon="sector.icon"
                  >
                    {{ sector.name }}
                  </v-chip>
                </div>
              </div>
              
              <!-- Liens -->
              <div>
                <h3 class="text-h6 font-weight-bold mb-2">Liens</h3>
                <div class="d-flex flex-column ga-2">
                  <div v-for="link in profileLinks" :key="link.type" class="d-flex align-center">
                    <v-icon :color="link.color" class="mr-2">{{ link.icon }}</v-icon>
                    <a :href="link.url" target="_blank" class="text-decoration-none">
                      {{ link.label }}
                    </a>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
          
          <!-- Activités récentes -->
          <v-card class="mb-6" elevation="2">
            <v-card-title class="pa-4">
              <v-icon class="mr-2">mdi-history</v-icon>
              Activités récentes
            </v-card-title>
            <v-list class="pa-0">
              <v-list-item
                v-for="activity in recentActivities"
                :key="activity.id"
                class="px-4 py-3"
              >
                <template v-slot:prepend>
                  <v-avatar :color="activity.color" size="32">
                    <v-icon color="white" size="16">{{ activity.icon }}</v-icon>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-1">{{ activity.title }}</v-list-item-title>
                <v-list-item-subtitle class="text-body-2">{{ activity.time }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-card>
          
          <!-- Opportunités créées -->
          <v-card elevation="2">
            <v-card-title class="pa-4 d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon class="mr-2">mdi-briefcase</v-icon>
                Opportunités créées
              </div>
              <v-btn variant="text" color="primary" size="small">
                Voir toutes
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-4">
              <div
                v-for="opportunity in createdOpportunities"
                :key="opportunity.id"
                class="d-flex align-center pa-3 mb-3 bg-grey-lighten-5 rounded"
              >
                <v-avatar :color="opportunity.color" size="32" class="mr-3">
                  <v-icon color="white" size="16">{{ opportunity.icon }}</v-icon>
                </v-avatar>
                <div class="flex-grow-1">
                  <h4 class="text-body-1 font-weight-bold">{{ opportunity.title }}</h4>
                  <p class="text-body-2 text-grey-darken-1 ma-0">{{ opportunity.description }}</p>
                  <div class="d-flex align-center mt-1">
                    <v-chip size="x-small" :color="opportunity.typeColor" class="mr-2">
                      {{ opportunity.type }}
                    </v-chip>
                    <span class="text-caption">{{ opportunity.funding }} • {{ opportunity.applications }}</span>
                  </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        
        <!-- Sidebar droite -->
        <v-col cols="12" md="4">
          <!-- Contact rapide -->
          <v-card class="mb-4" elevation="2">
            <v-card-title class="pa-4">Contact</v-card-title>
            <v-card-text class="pa-4">
              <v-btn
                color="green-darken-2"
                variant="flat"
                block
                prepend-icon="mdi-email"
                class="mb-3"
                @click="sendMessage"
              >
                Envoyer un message
              </v-btn>
              <v-btn
                color="blue"
                variant="outlined"
                block
                prepend-icon="mdi-linkedin"
                @click="openLinkedIn"
              >
                Voir sur LinkedIn
              </v-btn>
            </v-card-text>
          </v-card>
          
          <!-- Connexions communes -->
          <v-card class="mb-4" elevation="2">
            <v-card-title class="pa-4">Connexions communes</v-card-title>
            <v-card-text class="pa-4">
              <div class="d-flex align-center mb-3">
                <v-avatar size="32" class="mr-3">
                  <v-img src="/api/placeholder/32/32" />
                </v-avatar>
                <div>
                  <div class="text-body-2 font-weight-bold">Marie Diallo</div>
                  <div class="text-caption text-grey-darken-1">Investisseuse</div>
                </div>
              </div>
              <div class="d-flex align-center mb-3">
                <v-avatar size="32" class="mr-3">
                  <v-img src="/api/placeholder/32/32" />
                </v-avatar>
                <div>
                  <div class="text-body-2 font-weight-bold">Ibrahim Sow</div>
                  <div class="text-caption text-grey-darken-1">Entrepreneur</div>
                </div>
              </div>
              <v-btn variant="text" size="small" color="primary">
                Voir toutes les connexions
              </v-btn>
            </v-card-text>
          </v-card>
          
          <!-- Recommandations -->
          <v-card elevation="2">
            <v-card-title class="pa-4">Recommandations</v-card-title>
            <v-card-text class="pa-4">
              <div class="mb-4">
                <div class="d-flex align-center mb-2">
                  <v-avatar size="24" class="mr-2">
                    <v-img src="/api/placeholder/24/24" />
                  </v-avatar>
                  <span class="text-body-2 font-weight-bold">Fatou Ba</span>
                </div>
                <p class="text-body-2 text-grey-darken-1 mb-0">
                  "Excellente collaboration sur le projet SolarTech. Très professionnelle et innovante."
                </p>
              </div>
              <v-btn variant="text" size="small" color="primary">
                Voir toutes les recommandations
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Success Snackbar -->
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const profileData = ref({
  first_name: 'Amina',
  last_name: 'Koné',
  user_type: 'Entrepreneur',
  sector: 'Énergie Solaire',
  location: 'Abidjan, Côte d\'Ivoire',
  bio: 'Entrepreneuse spécialisée dans l\'énergie solaire en Afrique de l\'Ouest. Fondatrice de SolarTech Innovations, une startup qui développe des solutions d\'énergie solaire abordables pour les communautés rurales. Passionnée par l\'impact social et environnemental des technologies vertes.',
  avatar_url: null
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Computed properties
const fullName = computed(() => {
  return `${profileData.value.first_name} ${profileData.value.last_name}`
})

const initials = computed(() => {
  return `${profileData.value.first_name?.[0] || ''}${profileData.value.last_name?.[0] || ''}`
})

// Static data
const expertiseSectors = ref([
  { id: 1, name: 'Énergie Solaire', color: 'orange', icon: 'mdi-solar-power' },
  { id: 2, name: 'Développement Durable', color: 'green', icon: 'mdi-leaf' },
  { id: 3, name: 'Innovation Tech', color: 'blue', icon: 'mdi-lightbulb' }
])

const profileLinks = ref([
  {
    type: 'website',
    label: 'solartech-innovations.com',
    url: 'https://solartech-innovations.com',
    icon: 'mdi-web',
    color: 'blue'
  },
  {
    type: 'linkedin',
    label: 'linkedin.com/in/aminakone',
    url: 'https://linkedin.com/in/aminakone',
    icon: 'mdi-linkedin',
    color: 'blue'
  },
  {
    type: 'email',
    label: 'amina.kone@example.com',
    url: 'mailto:amina.kone@example.com',
    icon: 'mdi-email',
    color: 'red'
  }
])

const recentActivities = ref([
  {
    id: 1,
    title: 'Opportunité publiée: Financement Série A - SolarTech Innovations',
    time: 'Il y a 2 jours',
    icon: 'mdi-briefcase-plus',
    color: 'blue'
  },
  {
    id: 2,
    title: 'Participation confirmée: Sommet de l\'Économie Verte Africaine 2025',
    time: 'Il y a 1 semaine',
    icon: 'mdi-calendar-check',
    color: 'green'
  },
  {
    id: 3,
    title: 'Nouveau membre: Entrepreneurs Verts Afrique',
    time: 'Il y a 2 semaines',
    icon: 'mdi-account-group',
    color: 'purple'
  }
])

const createdOpportunities = ref([
  {
    id: 1,
    title: 'Financement Série A - SolarTech Innovations',
    description: 'Recherche d\'investisseurs pour lever 2M€ pour accélérer le déploiement...',
    type: 'Financement',
    typeColor: 'blue',
    funding: '2M€',
    applications: '7 candidatures',
    icon: 'mdi-currency-eur',
    color: 'blue'
  }
])

// Methods
const uploadAvatar = () => {
  showMessage('Fonctionnalité d\'upload à implémenter', 'info')
}

const sendMessage = () => {
  showMessage('Redirection vers la messagerie', 'info')
}

const openLinkedIn = () => {
  window.open('https://linkedin.com/in/aminakone', '_blank')
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
  // TODO: Charger les données du profil depuis Supabase
})
</script>

<style scoped>
.profile-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.profile-banner {
  background: linear-gradient(135deg, #2e7d32 0%, #388e3c 100%);
}

.profile-avatar {
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}

.v-card {
  border-radius: 12px !important;
}

.v-btn {
  border-radius: 8px !important;
}
</style>
