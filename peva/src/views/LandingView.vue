<template>
  <div>
      <!-- Hero Section -->
      <section class="hero-section bg-gradient-to-br from-green-50 to-blue-50 py-16">
        <v-container>
          <v-row align="center" class="min-h-screen-75">
            <v-col cols="12" md="6">
              <div class="text-center text-md-left">
                <h1 class="text-h2 font-weight-bold text-grey-darken-3 mb-6">
                  L'Écosystème Digital de
                  <span class="text-green-darken-2">l'Économie Verte</span>
                </h1>
                <p class="text-h6 text-grey-darken-1 mb-8 font-weight-regular">
                  Connectez-vous aux opportunités, entreprises et innovations
                  qui façonnent l'avenir durable
                </p>
                
                <!-- CTA Buttons -->
                <div class="d-flex flex-column flex-sm-row ga-4 justify-center justify-md-start">
                  <v-btn
                    size="x-large"
                    color="green-darken-2"
                    variant="flat"
                    class="px-8"
                    @click="$router.push('/auth/register')"
                  >
                    <v-icon start>mdi-account-plus</v-icon>
                    Rejoindre 2iE GreenHub
                  </v-btn>
                  <v-btn
                    size="x-large"
                    variant="outlined"
                    color="green-darken-2"
                    class="px-8"
                    data-testid="hero-discover-btn"
                    @click="scrollToFeatures"
                  >
                    <v-icon start>mdi-play-circle-outline</v-icon>
                    Découvrir
                  </v-btn>
                </div>

                <!-- Stats -->
                <div class="mt-12" data-testid="platform-stats">
                  <v-row>
                    <v-col 
                      v-for="stat in platformStats.slice(0, 3)" 
                      :key="stat.key" 
                      cols="4"
                    >
                      <div class="text-center">
                        <h3 class="text-h4 font-weight-bold text-green-darken-2">
                          {{ stat.formatted_value }}
                        </h3>
                        <p class="text-body-2 text-grey-darken-1">{{ stat.label }}</p>
                      </div>
                    </v-col>
                  </v-row>
                </div>
              </div>
            </v-col>
            
            <v-col cols="12" md="6">
              <div class="text-center">
                <!-- Carrousel avec slides -->
                <v-carousel
                  v-model="currentSlide"
                  height="400"
                  hide-delimiters
                  show-arrows="hover"
                  cycle
                  interval="4000"
                  class="rounded-lg elevation-8"
                >
                  <!-- Slide 1: Image principale -->
                  <v-carousel-item>
                    <div class="slide-image-container">
                      <img 
                        :src="homeImage" 
                        alt="Plateforme 2iE GreenHub"
                        class="slide-image"
                      />
                    </div>
                  </v-carousel-item>

                  <!-- Slide 2: Fonctionnalités Réseau -->
                  <v-carousel-item>
                    <div class="slide-content bg-gradient-to-br from-green-400 to-green-600 d-flex flex-column align-center justify-center pa-8">
                      <v-icon size="80" color="white" class="mb-4 pulse-animation">mdi-account-group</v-icon>
                      <h3 class="text-h5 font-weight-bold text-white mb-3 text-center">
                        Réseau Professionnel
                      </h3>
                      <p class="text-body-1 text-white text-center mb-4 opacity-90">
                        Connectez-vous avec +2,500 professionnels de l'économie verte
                      </p>
                      <div class="d-flex flex-wrap justify-center ga-2">
                        <v-chip size="small" color="white" variant="flat" text-color="green">
                          <v-icon start size="16">mdi-handshake</v-icon>
                          Partenariats
                        </v-chip>
                        <v-chip size="small" color="white" variant="flat" text-color="green">
                          <v-icon start size="16">mdi-message</v-icon>
                          Messagerie
                        </v-chip>
                      </div>
                    </div>
                  </v-carousel-item>

                  <!-- Slide 3: Opportunités -->
                  <v-carousel-item>
                    <div class="slide-content bg-gradient-to-br from-blue-400 to-blue-600 d-flex flex-column align-center justify-center pa-8">
                      <v-icon size="80" color="white" class="mb-4 pulse-animation">mdi-briefcase</v-icon>
                      <h3 class="text-h5 font-weight-bold text-white mb-3 text-center">
                        Opportunités d'Affaires
                      </h3>
                      <p class="text-body-1 text-white text-center mb-4 opacity-90">
                        +850 opportunités actives dans 15 pays africains
                      </p>
                      <div class="d-flex flex-wrap justify-center ga-2">
                        <v-chip size="small" color="white" variant="flat" text-color="blue">
                          <v-icon start size="16">mdi-currency-usd</v-icon>
                          Financement
                        </v-chip>
                        <v-chip size="small" color="white" variant="flat" text-color="blue">
                          <v-icon start size="16">mdi-account-tie</v-icon>
                          Emploi
                        </v-chip>
                      </div>
                    </div>
                  </v-carousel-item>

                  <!-- Slide 4: Événements -->
                  <v-carousel-item>
                    <div class="slide-content bg-gradient-to-br from-purple-400 to-purple-600 d-flex flex-column align-center justify-center pa-8">
                      <v-icon size="80" color="white" class="mb-4 pulse-animation">mdi-calendar-star</v-icon>
                      <h3 class="text-h5 font-weight-bold text-white mb-3 text-center">
                        Événements & Formations
                      </h3>
                      <p class="text-body-1 text-white text-center mb-4 opacity-90">
                        24 événements à venir dans 8 villes africaines
                      </p>
                      <div class="d-flex flex-wrap justify-center ga-2">
                        <v-chip size="small" color="white" variant="flat" text-color="purple">
                          <v-icon start size="16">mdi-school</v-icon>
                          Formation
                        </v-chip>
                        <v-chip size="small" color="white" variant="flat" text-color="purple">
                          <v-icon start size="16">mdi-video</v-icon>
                          Webinaires
                        </v-chip>
                      </div>
                    </div>
                  </v-carousel-item>

                  <!-- Slide 5: Ressources -->
                  <v-carousel-item>
                    <div class="slide-content bg-gradient-to-br from-orange-400 to-orange-600 d-flex flex-column align-center justify-center pa-8">
                      <v-icon size="80" color="white" class="mb-4 pulse-animation">mdi-library</v-icon>
                      <h3 class="text-h5 font-weight-bold text-white mb-3 text-center">
                        Bibliothèque de Ressources
                      </h3>
                      <p class="text-body-1 text-white text-center mb-4 opacity-90">
                        +300 guides, rapports et outils pour l'économie verte
                      </p>
                      <div class="d-flex flex-wrap justify-center ga-2">
                        <v-chip size="small" color="white" variant="flat" text-color="orange">
                          <v-icon start size="16">mdi-file-document</v-icon>
                          Guides
                        </v-chip>
                        <v-chip size="small" color="white" variant="flat" text-color="orange">
                          <v-icon start size="16">mdi-chart-line</v-icon>
                          Analyses
                        </v-chip>
                      </div>
                    </div>
                  </v-carousel-item>
                </v-carousel>

                <!-- Indicateurs de slides personnalisés -->
                <div class="slide-indicators mt-4 d-flex justify-center ga-2">
                  <v-btn
                    v-for="(slide, index) in slideIndicators"
                    :key="index"
                    :color="currentSlide === index ? slide.color : 'grey-lighten-2'"
                    :variant="currentSlide === index ? 'flat' : 'outlined'"
                    size="small"
                    icon
                    @click="currentSlide = index"
                  >
                    <v-icon size="16">{{ slide.icon }}</v-icon>
                  </v-btn>
                </div>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Features Section -->
      <section ref="featuresSection" class="py-16 bg-white" data-testid="features-section">
        <v-container>
          <div class="text-center mb-12">
            <h2 class="text-h3 font-weight-bold text-grey-darken-3 mb-4">
              Pourquoi choisir 2iE GreenHub ?
            </h2>
            <p class="text-h6 text-grey-darken-1 font-weight-regular">
              Une plateforme complète pour l'écosystème de l'économie verte africaine
            </p>
          </div>

          <v-row>
            <v-col cols="12" md="4" v-for="(feature, index) in features" :key="index">
              <v-card 
                class="pa-6 text-center h-100 cursor-pointer" 
                elevation="2" 
                hover
                data-testid="feature-card"
                @click="navigateToFeature(feature)"
              >
                <v-avatar size="80" :color="feature.color" class="mb-4">
                  <v-icon size="40" color="white">{{ feature.icon }}</v-icon>
                </v-avatar>
                <h3 class="text-h5 font-weight-bold mb-3">{{ feature.title }}</h3>
                <p class="text-body-1 text-grey-darken-1">{{ feature.description }}</p>
                
                <!-- Indicateur d'authentification requise -->
                <v-chip 
                  v-if="feature.requiresAuth && !authStore.isAuthenticated" 
                  size="small" 
                  color="warning"
                  variant="outlined"
                  class="mt-2"
                >
                  <v-icon size="16" class="mr-1">mdi-lock</v-icon>
                  Connexion requise
                </v-chip>
                
                <!-- Indicateur admin seulement -->
                <v-chip 
                  v-if="feature.adminOnly" 
                  size="small" 
                  color="error"
                  variant="outlined"
                  class="mt-2"
                >
                  <v-icon size="16" class="mr-1">mdi-shield-account</v-icon>
                  Admin uniquement
                </v-chip>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Sectors Section -->
      <section class="py-16 bg-grey-lighten-5">
        <v-container>
          <div class="text-center mb-12">
            <h2 class="text-h3 font-weight-bold text-grey-darken-3 mb-4">
              Secteurs d'Activité
            </h2>
            <p class="text-h6 text-grey-darken-1 font-weight-regular">
              Explorez les opportunités dans tous les secteurs de l'économie verte
            </p>
          </div>

          <v-row>
            <v-col cols="6" md="3" v-for="(sector, index) in sectors" :key="index">
              <v-card class="pa-4 text-center" elevation="1" hover>
                <v-icon size="48" :color="sector.color" class="mb-3">{{ sector.icon }}</v-icon>
                <h4 class="text-h6 font-weight-medium">{{ sector.name }}</h4>
              </v-card>
            </v-col>
          </v-row>
          
          <!-- Navigation complète des modules -->
          <div class="text-center mt-8">
            <v-row>
              <v-col cols="12" md="6" lg="4" v-for="module in platformModules" :key="module.name">
                <v-card 
                  class="pa-4 text-center h-100 cursor-pointer module-card" 
                  elevation="2" 
                  hover
                  @click="navigateToModule(module)"
                >
                  <v-avatar :color="module.color" size="64" class="mb-3">
                    <v-icon size="32" color="white">{{ module.icon }}</v-icon>
                  </v-avatar>
                  <h4 class="text-h6 font-weight-bold mb-2">{{ module.name }}</h4>
                  <p class="text-body-2 text-grey-darken-1 mb-3">{{ module.description }}</p>
                  <v-chip 
                    v-if="module.requiresAuth" 
                    size="small" 
                    :color="authStore.isAuthenticated ? 'success' : 'warning'"
                    variant="outlined"
                  >
                    {{ authStore.isAuthenticated ? 'Accessible' : 'Connexion requise' }}
                  </v-chip>
                  <v-chip 
                    v-if="module.adminOnly" 
                    size="small" 
                    color="error"
                    variant="outlined"
                    class="ml-1"
                  >
                    Admin uniquement
                  </v-chip>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-container>
      </section>

      <!-- Actions de création de contenu -->
      <section class="py-16 bg-blue-grey-lighten-5" v-if="authStore.isAuthenticated">
        <v-container>
          <div class="text-center mb-12">
            <h2 class="text-h3 font-weight-bold text-grey-darken-3 mb-4">
              Contribuez à l'écosystème
            </h2>
            <p class="text-h6 text-grey-darken-1 font-weight-regular">
              Partagez vos opportunités, ressources et événements avec la communauté
            </p>
          </div>

          <v-row justify="center">
            <v-col cols="12" md="4" v-for="action in creationActions" :key="action.name">
              <v-card 
                class="pa-6 text-center h-100 cursor-pointer creation-card" 
                elevation="3" 
                hover
                @click="$router.push(action.route)"
              >
                <v-avatar :color="action.color" size="72" class="mb-4">
                  <v-icon size="36" color="white">{{ action.icon }}</v-icon>
                </v-avatar>
                <h4 class="text-h5 font-weight-bold mb-3">{{ action.name }}</h4>
                <p class="text-body-1 text-grey-darken-1 mb-4">{{ action.description }}</p>
                <v-btn 
                  :color="action.color" 
                  variant="outlined" 
                  block
                >
                  {{ action.buttonText }}
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- Testimonials Section -->
      <section class="py-16 bg-grey-lighten-4" data-testid="testimonials-section">
        <v-container>
          <div class="text-center mb-12">
            <h2 class="text-h3 font-weight-bold text-grey-darken-3 mb-4">
              Ils nous font confiance
            </h2>
            <p class="text-h6 text-grey-darken-1 font-weight-regular">
              Découvrez les témoignages de nos membres actifs
            </p>
          </div>

          <v-row>
            <v-col cols="12" md="4" v-for="testimonial in testimonials" :key="testimonial.id">
              <v-card class="pa-6 h-100" elevation="2">
                <div class="d-flex align-center mb-4">
                  <v-avatar :color="testimonial.color" size="48" class="mr-3">
                    <span class="text-white font-weight-bold">{{ testimonial.initials }}</span>
                  </v-avatar>
                  <div>
                    <h4 class="text-h6 font-weight-bold">{{ testimonial.name }}</h4>
                    <p class="text-body-2 text-grey-darken-1 ma-0">{{ testimonial.title }}</p>
                  </div>
                </div>
                <p class="text-body-1 mb-4">"{{ testimonial.quote }}"</p>
                <div class="d-flex">
                  <v-icon v-for="i in 5" :key="i" 
                    :color="i <= testimonial.rating ? 'amber' : 'grey-lighten-2'" 
                    size="16"
                  >
                    mdi-star
                  </v-icon>
                </div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </section>

      <!-- CTA Section -->
      <section class="py-16 bg-green-darken-2">
        <v-container>
          <div class="text-center text-white">
            <h2 class="text-h3 font-weight-bold mb-4">
              Prêt à rejoindre l'écosystème ?
            </h2>
            <p class="text-h6 mb-8 font-weight-regular">
              Créez votre compte gratuitement et commencez à explorer les opportunités
            </p>
            <v-btn
              size="x-large"
              color="white"
              variant="flat"
              class="px-12"
              @click="$router.push('/auth/register')"
            >
              <v-icon start>mdi-rocket-launch</v-icon>
              Commencer maintenant
            </v-btn>
          </div>
        </v-container>
      </section>

    <!-- Footer -->
    <v-footer class="bg-grey-darken-4 text-white pa-8" data-test="footer">
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <div class="d-flex align-center mb-4">
              <img 
                src="@/assets/images/logos/logo_2ie_greenhub.png" 
                alt="2iE GreenHub" 
                style="height: 60px; width: auto;"
                class="logo-greenhub"
              />
            </div>
            <p class="text-body-2 mt-4">
              La plateforme digitale stratégique pour l'écosystème de l'économie verte.
            </p>
          </v-col>
          
          <v-col cols="12" md="4">
            <h4 class="text-h6 font-weight-bold mb-4">Liens rapides</h4>
            <div class="d-flex flex-column ga-2">
              <a href="#" class="text-decoration-none text-grey-lighten-1 hover:text-white">À propos</a>
              <a href="#" class="text-decoration-none text-grey-lighten-1 hover:text-white">Opportunités</a>
              <a href="#" class="text-decoration-none text-grey-lighten-1 hover:text-white">Entreprises</a>
              <a href="#" class="text-decoration-none text-grey-lighten-1 hover:text-white">Événements</a>
            </div>
          </v-col>
          
          <v-col cols="12" md="4">
            <h4 class="text-h6 font-weight-bold mb-4">Contact</h4>
            <div class="d-flex flex-column ga-2">
              <p class="text-body-2 ma-0">
                <v-icon size="16" class="mr-2">mdi-email</v-icon>
                contact@2ie-greenhub.org
              </p>
              <p class="text-body-2 ma-0">
                <v-icon size="16" class="mr-2">mdi-phone</v-icon>
                +226 25 49 28 00
              </p>
            </div>
          </v-col>
        </v-row>
        
        <v-divider class="my-6 border-grey-darken-2"></v-divider>
        
        <div class="text-center">
          <p class="text-body-2 text-grey-lighten-1 ma-0">
            © 2024 2iE GreenHub - Entreprises de l'économie verte. Tous droits réservés.
          </p>
        </div>
      </v-container>
    </v-footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import dataService from '@/services/dataService'
import homeImage from '@/assets/images/illustrations/home_image.png'

const router = useRouter()
const authStore = useAuthStore()
const featuresSection = ref(null)

// Données réactives
const platformStats = ref([])
const sectors = ref([])
const loading = ref(true)
const currentSlide = ref(0)

// Indicateurs de slides avec couleurs et icônes
const slideIndicators = ref([
  { icon: 'mdi-home', color: 'green-darken-2' },
  { icon: 'mdi-account-group', color: 'green' },
  { icon: 'mdi-briefcase', color: 'blue' },
  { icon: 'mdi-calendar-star', color: 'purple' },
  { icon: 'mdi-library', color: 'orange' }
])

// Fonction de déconnexion
const handleLogout = async () => {
  try {
    await authStore.signOut()
    router.push('/')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
  }
}

// Charger les données depuis Supabase
const loadData = async () => {
  try {
    loading.value = true
    
    // Charger les statistiques et secteurs en parallèle
    const [statsData, sectorsData] = await Promise.all([
      dataService.getPlatformStats(),
      dataService.getSectors()
    ])
    
    platformStats.value = statsData
    sectors.value = sectorsData
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
  } finally {
    loading.value = false
  }
}

// Fonction pour faire défiler vers les fonctionnalités
const scrollToFeatures = () => {
  if (featuresSection.value) {
    featuresSection.value.scrollIntoView({ behavior: 'smooth' })
  }
}

// Charger les données au montage du composant
onMounted(() => {
  loadData()
})

// Fonction de navigation vers les features avec vérification d'authentification
const navigateToFeature = (feature) => {
  // Vérifier si l'utilisateur est connecté pour les features qui le requièrent
  if (feature.requiresAuth && !authStore.isAuthenticated) {
    router.push('/auth/login')
    return
  }
  
  // Vérifier si l'utilisateur est admin pour les features admin uniquement
  if (feature.adminOnly && !authStore.isAdmin) {
    // Rediriger vers la page d'accueil avec un message
    console.warn('Accès refusé : droits administrateur requis')
    return
  }
  
  // Navigation normale
  if (feature.route) {
    router.push(feature.route)
  }
}

// Fonction de navigation vers les modules avec vérification d'authentification
const navigateToModule = (module) => {
  // Vérifier si l'utilisateur est connecté pour les modules qui le requièrent
  if (module.requiresAuth && !authStore.isAuthenticated) {
    router.push('/auth/login')
    return
  }
  
  // Vérifier si l'utilisateur est admin pour les modules admin uniquement
  if (module.adminOnly && !authStore.isAdmin) {
    // Rediriger vers la page d'accueil avec un message
    console.warn('Accès refusé : droits administrateur requis')
    return
  }
  
  // Navigation normale
  if (module.route) {
    router.push(module.route)
  }
}

// Features principales (ne changent pas souvent)
const features = ref([
  {
    icon: 'mdi-briefcase-search',
    title: 'Opportunités',
    description: 'Découvrez des milliers d\'opportunités d\'emploi, de financement et de partenariat dans l\'économie verte.',
    color: 'green',
    route: '/opportunities',
    requiresAuth: false,
    adminOnly: false
  },
  {
    icon: 'mdi-calendar-star',
    title: 'Événements',
    description: 'Participez à des conférences, ateliers et événements de networking dans votre région.',
    color: 'purple',
    route: '/events',
    requiresAuth: false,
    adminOnly: false
  },
  {
    icon: 'mdi-account-group',
    title: 'Communauté',
    description: 'Rejoignez une communauté dynamique d\'entrepreneurs et d\'innovateurs verts.',
    color: 'indigo',
    route: '/directory',
    requiresAuth: true,
    adminOnly: false
  },
  {
    icon: 'mdi-chart-line',
    title: 'Suivi d\'Impact',
    description: 'Mesurez et partagez l\'impact environnemental de vos projets et initiatives.',
    color: 'red',
    route: '/companies',
    requiresAuth: true,
    adminOnly: false
  },
  {
    icon: 'mdi-map-marker-radius',
    title: 'Géolocalisation',
    description: 'Trouvez des opportunités et partenaires près de chez vous grâce à notre carte interactive.',
    color: 'teal',
    route: '/companies',
    requiresAuth: false,
    adminOnly: false
  }
])

// Modules complets de la plateforme
const platformModules = ref([
  {
    name: 'Tableau de Bord',
    description: 'Dashboard centralisé avec vos activités et statistiques',
    icon: 'mdi-view-dashboard',
    color: 'primary',
    route: '/user-dashboard',
    requiresAuth: true,
    adminOnly: false
  },
  {
    name: 'Annuaire & Cartographie',
    description: 'Acteurs de l\'écosystème avec recherche multicritères et carte dynamique',
    icon: 'mdi-map-search',
    color: 'blue',
    route: '/directory',
    requiresAuth: false,
    adminOnly: false
  },
  {
    name: 'Entreprises & RSE',
    description: 'Profils d\'entreprises et rapports RSE détaillés',
    icon: 'mdi-domain',
    color: 'green',
    route: '/companies',
    requiresAuth: false,
    adminOnly: false
  },
  {
    name: 'Place de Marché',
    description: 'Opportunités de financement, emploi et partenariats',
    icon: 'mdi-briefcase',
    color: 'orange',
    route: '/opportunities',
    requiresAuth: false,
    adminOnly: false
  },
  {
    name: 'Ressources & Connaissances',
    description: 'Médiathèque avec guides, rapports et outils',
    icon: 'mdi-library',
    color: 'purple',
    route: '/resources',
    requiresAuth: false,
    adminOnly: false
  },
  {
    name: 'Événements',
    description: 'Conférences, workshops et networking',
    icon: 'mdi-calendar-star',
    color: 'indigo',
    route: '/events',
    requiresAuth: false,
    adminOnly: false
  },
  {
    name: 'Forum de Discussions',
    description: 'Échanges thématiques entre membres',
    icon: 'mdi-forum',
    color: 'teal',
    route: '/forum',
    requiresAuth: true,
    adminOnly: false
  },
  {
    name: 'Groupes & Réseaux',
    description: 'Communautés spécialisées publiques et privées',
    icon: 'mdi-account-group',
    color: 'cyan',
    route: '/groups',
    requiresAuth: true,
    adminOnly: false
  },
  {
    name: 'Messagerie',
    description: 'Messages privés entre membres',
    icon: 'mdi-message',
    color: 'pink',
    route: '/messages',
    requiresAuth: true,
    adminOnly: false
  },
  {
    name: 'Partage Réseaux Sociaux',
    description: 'Import et partage de contenu depuis LinkedIn, Twitter...',
    icon: 'mdi-share-variant',
    color: 'blue-grey',
    route: '/social-share',
    requiresAuth: true,
    adminOnly: false
  },
  {
    name: 'Analytics',
    description: 'Statistiques, KPIs et tableaux de bord avancés',
    icon: 'mdi-chart-line',
    color: 'red',
    route: '/analytics',
    requiresAuth: true,
    adminOnly: true
  }
])

// Témoignages
const testimonials = ref([
  {
    id: 1,
    name: 'Aminata Traoré',
    title: 'Directrice, EcoSolar Burkina',
    quote: '2iE GreenHub nous a permis de trouver des partenaires stratégiques et de lever 500k€ pour notre expansion.',
    rating: 5,
    initials: 'AT',
    color: 'green'
  },
  {
    id: 2,
    name: 'Jean-Baptiste Kouassi',
    title: 'Fondateur, AgriTech Côte d\'Ivoire',
    quote: 'La plateforme a révolutionné notre approche du networking. Nous avons doublé notre réseau en 6 mois.',
    rating: 5,
    initials: 'JK',
    color: 'blue'
  },
  {
    id: 3,
    name: 'Fatou Diallo',
    title: 'Investisseuse, Green Fund Sénégal',
    quote: 'Un outil indispensable pour identifier les meilleures opportunités d\'investissement en Afrique.',
    rating: 5,
    initials: 'FD',
    color: 'purple'
  }
])

// Actions de création de contenu
const creationActions = ref([
  {
    name: 'Publier une Opportunité',
    description: 'Partagez des opportunités de financement, emploi ou partenariat',
    icon: 'mdi-briefcase-plus',
    color: 'success',
    route: '/opportunities/create',
    buttonText: 'Créer une opportunité'
  },
  {
    name: 'Partager une Ressource',
    description: 'Ajoutez des guides, rapports ou outils à la médiathèque',
    icon: 'mdi-file-plus',
    color: 'info',
    route: '/resources/submit',
    buttonText: 'Ajouter une ressource'
  },
  {
    name: 'Organiser un Événement',
    description: 'Créez des conférences, formations ou événements de networking',
    icon: 'mdi-calendar-plus',
    color: 'warning',
    route: '/events/create',
    buttonText: 'Créer un événement'
  }
])

</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 50%, #f0f9ff 100%);
}

.min-h-screen-75 {
  min-height: 75vh;
}

.border-b {
  border-bottom: 1px solid rgba(0, 0, 0, 0.12) !important;
}

.v-card {
  border-radius: 12px !important;
  transition: transform 0.2s ease-in-out;
}

/* Placeholder styles */
.bg-gradient-to-br {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.from-green-50 {
  --tw-gradient-from: #f0fdf4;
}

.to-green-100 {
  --tw-gradient-to: #dcfce7;
}

.max-w-sm {
  max-width: 24rem;
}

/* Animation pour le logo */
.pulse-animation {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

.logo-container {
  position: relative;
}

.logo-container::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 120px;
  height: 120px;
  background: radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: glow 3s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    box-shadow: 0 0 20px rgba(34, 197, 94, 0.2);
  }
  to {
    box-shadow: 0 0 30px rgba(34, 197, 94, 0.4);
  }
}

.v-card:hover {
  transform: translateY(-4px);
}

.cursor-pointer {
  cursor: pointer;
}

.module-card {
  transition: all 0.3s ease;
  border-radius: 16px !important;
}

.module-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
}

.creation-card {
  transition: all 0.3s ease;
  border-radius: 20px !important;
  border: 2px solid transparent;
}

.creation-card:hover {
  transform: translateY(-10px) scale(1.02);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2) !important;
  border-color: rgba(76, 175, 80, 0.3);
}

.v-btn {
  border-radius: 8px !important;
}

a:hover {
  color: white !important;
}

/* Styles pour le carrousel et les slides */
.slide-content {
  height: 400px;
  width: 100%;
}

.slide-image-container {
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 12px;
}

.slide-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.slide-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, transparent 100%);
  width: 100%;
}

.slide-indicators .v-btn {
  transition: all 0.3s ease;
}

.slide-indicators .v-btn:hover {
  transform: scale(1.1);
}

/* Gradients pour les slides */
.bg-gradient-to-br.from-green-400.to-green-600 {
  background: linear-gradient(135deg, #4ade80 0%, #16a34a 100%);
}

.bg-gradient-to-br.from-blue-400.to-blue-600 {
  background: linear-gradient(135deg, #60a5fa 0%, #2563eb 100%);
}

.bg-gradient-to-br.from-purple-400.to-purple-600 {
  background: linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%);
}

.bg-gradient-to-br.from-orange-400.to-orange-600 {
  background: linear-gradient(135deg, #fb923c 0%, #ea580c 100%);
}

/* Animation améliorée pour les icônes des slides */
.slide-content .pulse-animation {
  animation: slideIconPulse 3s ease-in-out infinite;
}

@keyframes slideIconPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.9;
    transform: scale(1.1);
  }
}

/* Responsive pour les slides */
@media (max-width: 768px) {
  .slide-content {
    height: 300px;
    padding: 1.5rem !important;
  }
  
  .slide-content .v-icon {
    font-size: 60px !important;
  }
  
  .slide-content h3 {
    font-size: 1.25rem !important;
  }
  
  .slide-content p {
    font-size: 0.875rem !important;
  }
}
</style>