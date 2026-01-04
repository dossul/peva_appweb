<template>
  <div>
    <!-- Header principal -->
    <v-app-bar 
      color="white" 
      elevation="1" 
      height="64"
      app
      style="z-index: 2000;"
    >
      <v-container class="d-flex align-center justify-space-between pa-0">
        <!-- Logo 2iE GreenHub -->
        <div class="d-flex align-center" @click="$router.push('/')" style="cursor: pointer;" data-test="logo">
          <img 
            src="@/assets/images/logos/logo_2ie_greenhub.png" 
            alt="2iE GreenHub" 
            style="height: 50px; width: auto;"
            class="logo-greenhub"
          />
        </div>

        <!-- Menu principal -->
        <div class="d-flex align-center" data-test="main-nav">
          <!-- Tableau de Bord -->
          <v-menu offset-y v-if="authStore.isAuthenticated">
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                class="mx-1"
                :class="{ 'text-green-darken-2': isActiveMenu('dashboard') }"
              >
                <v-icon start>mdi-view-dashboard</v-icon>
                Tableau de Bord
                <v-icon end>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="navigateTo('/')">
                <v-list-item-title>Accueil</v-list-item-title>
              </v-list-item>
              <v-list-item @click="navigateTo(authStore.isAdmin ? '/admin/dashboard' : '/user-dashboard')">
                <v-list-item-title>{{ authStore.isAdmin ? 'Dashboard Admin' : 'Mon Dashboard' }}</v-list-item-title>
              </v-list-item>
              <v-list-item @click="navigateTo('/analytics')" v-if="authStore.isAdmin">
                <v-list-item-title>Analytics</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- Découvrir -->
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                class="mx-1"
                :class="{ 'text-green-darken-2': isActiveMenu('discover') }"
              >
                <v-icon start>mdi-compass</v-icon>
                Découvrir
                <v-icon end>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="navigateTo('/map')">
                <template v-slot:prepend>
                  <v-icon>mdi-map-marker-radius</v-icon>
                </template>
                <v-list-item-title>Carte Interactive</v-list-item-title>
                <v-list-item-subtitle>Localisation des entreprises</v-list-item-subtitle>
              </v-list-item>
              <v-list-item @click="navigateTo('/directory')">
                <template v-slot:prepend>
                  <v-icon>mdi-map-search</v-icon>
                </template>
                <v-list-item-title>Annuaire 2iE GreenHub</v-list-item-title>
                <v-list-item-subtitle>Profils des acteurs</v-list-item-subtitle>
              </v-list-item>
              <v-list-item @click="navigateTo('/opportunities')">
                <template v-slot:prepend>
                  <v-icon>mdi-briefcase</v-icon>
                </template>
                <v-list-item-title>Place de Marché</v-list-item-title>
                <v-list-item-subtitle>Opportunités & partenariats</v-list-item-subtitle>
              </v-list-item>
              <v-list-item @click="navigateTo('/resources')">
                <template v-slot:prepend>
                  <v-icon>mdi-library</v-icon>
                </template>
                <v-list-item-title>Ressources & Connaissances</v-list-item-title>
                <v-list-item-subtitle>Guides, rapports, outils</v-list-item-subtitle>
              </v-list-item>
              <v-list-item @click="navigateTo('/events')">
                <template v-slot:prepend>
                  <v-icon>mdi-calendar-star</v-icon>
                </template>
                <v-list-item-title>Événements</v-list-item-title>
                <v-list-item-subtitle>Conférences, workshops, networking</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- Communauté -->
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                class="mx-1"
                :class="{ 'text-green-darken-2': isActiveMenu('community') }"
              >
                <v-icon start>mdi-account-group</v-icon>
                Communauté
                <v-icon end>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="navigateTo('/forum')" :disabled="!authStore.isAuthenticated">
                <template v-slot:prepend>
                  <v-icon>mdi-forum</v-icon>
                </template>
                <v-list-item-title>Forum de Discussions</v-list-item-title>
                <v-list-item-subtitle>Échanges thématiques</v-list-item-subtitle>
              </v-list-item>
              <v-list-item @click="navigateTo('/groups')" :disabled="!authStore.isAuthenticated">
                <template v-slot:prepend>
                  <v-icon>mdi-account-group</v-icon>
                </template>
                <v-list-item-title>Groupes & Réseaux</v-list-item-title>
                <v-list-item-subtitle>Communautés spécialisées</v-list-item-subtitle>
              </v-list-item>
              <v-list-item @click="navigateTo('/messages')" :disabled="!authStore.isAuthenticated">
                <template v-slot:prepend>
                  <v-icon>mdi-message</v-icon>
                </template>
                <v-list-item-title>Messagerie</v-list-item-title>
                <v-list-item-subtitle>Messages privés</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- Services -->
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn
                v-bind="props"
                variant="text"
                class="mx-1"
                :class="{ 'text-green-darken-2': isActiveMenu('services') }"
              >
                <v-icon start>mdi-cog</v-icon>
                Services
                <v-icon end>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="navigateTo('/opportunities/create')" :disabled="!authStore.isAuthenticated">
                <template v-slot:prepend>
                  <v-icon>mdi-briefcase-plus</v-icon>
                </template>
                <v-list-item-title>Publier une Opportunité</v-list-item-title>
                <v-list-item-subtitle>Financement, emploi, partenariat</v-list-item-subtitle>
              </v-list-item>
              <v-list-item @click="navigateTo('/my-opportunities')" :disabled="!authStore.isAuthenticated">
                <template v-slot:prepend>
                  <v-icon>mdi-briefcase-edit</v-icon>
                </template>
                <v-list-item-title>Mes Opportunités</v-list-item-title>
                <v-list-item-subtitle>Brouillons et opportunités publiées</v-list-item-subtitle>
              </v-list-item>
              <v-list-item @click="navigateTo('/resources/submit')" :disabled="!authStore.isAuthenticated">
                <template v-slot:prepend>
                  <v-icon>mdi-file-plus</v-icon>
                </template>
                <v-list-item-title>Partager une Ressource</v-list-item-title>
                <v-list-item-subtitle>Guides, rapports, outils</v-list-item-subtitle>
              </v-list-item>
              <v-list-item @click="navigateTo('/events/create')" :disabled="!authStore.isAuthenticated">
                <template v-slot:prepend>
                  <v-icon>mdi-calendar-plus</v-icon>
                </template>
                <v-list-item-title>Organiser un Événement</v-list-item-title>
                <v-list-item-subtitle>Conférences, formations</v-list-item-subtitle>
              </v-list-item>
              <v-list-item @click="navigateTo('/groups/create')" :disabled="!authStore.isAuthenticated">
                <template v-slot:prepend>
                  <v-icon>mdi-account-group-outline</v-icon>
                </template>
                <v-list-item-title>Créer un Groupe</v-list-item-title>
                <v-list-item-subtitle>Communauté thématique</v-list-item-subtitle>
              </v-list-item>
              <v-divider />
              <v-list-item @click="navigateTo('/company/management')" :disabled="!authStore.isAuthenticated">
                <template v-slot:prepend>
                  <v-icon>mdi-domain</v-icon>
                </template>
                <v-list-item-title>Gestion Entreprise</v-list-item-title>
                <v-list-item-subtitle>Profil et rapports RSE</v-list-item-subtitle>
              </v-list-item>
              <v-list-item @click="navigateTo('/social-share')" :disabled="!authStore.isAuthenticated">
                <template v-slot:prepend>
                  <v-icon>mdi-share-variant</v-icon>
                </template>
                <v-list-item-title>Partage Réseaux Sociaux</v-list-item-title>
                <v-list-item-subtitle>Importer contenu depuis LinkedIn, Twitter...</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>

        <!-- Barre de recherche -->
        <div class="flex-grow-1 mx-8" style="max-width: 400px;" v-if="authStore.isAuthenticated">
          <v-text-field
            v-model="searchQuery"
            placeholder="Rechercher entreprises..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            density="compact"
            hide-details
            @keyup.enter="performSearch"
          ></v-text-field>
        </div>

        <!-- Actions utilisateur -->
        <div class="d-flex align-center">
          <!-- Notifications -->
          <v-menu offset-y v-if="authStore.isAuthenticated">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" icon variant="text">
                <v-badge :content="notificationCount" :model-value="notificationCount > 0" color="error">
                  <v-icon>mdi-bell</v-icon>
                </v-badge>
              </v-btn>
            </template>
            <v-card min-width="300">
              <v-card-title>Notifications</v-card-title>
              <v-list>
                <v-list-item v-for="notification in notifications" :key="notification.id">
                  <v-list-item-title>{{ notification.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ notification.message }}</v-list-item-subtitle>
                </v-list-item>
                <v-list-item v-if="notifications.length === 0">
                  <v-list-item-title class="text-center text-grey">Aucune notification</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>

          <!-- Menu utilisateur -->
          <v-menu offset-y v-if="authStore.isAuthenticated">
            <template v-slot:activator="{ props }">
              <v-btn v-bind="props" variant="text" class="ml-2" data-test="user-menu">
                <v-avatar size="32" class="mr-2">
                  <v-img v-if="authStore.user?.avatar" :src="authStore.user.avatar"></v-img>
                  <v-icon v-else>mdi-account</v-icon>
                </v-avatar>
                <span class="text-body-2">{{ authStore.user?.profile?.full_name || 'Utilisateur' }}</span>
                <v-icon end>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item @click="navigateTo('/profile')">
                <template v-slot:prepend>
                  <v-icon>mdi-account</v-icon>
                </template>
                <v-list-item-title>Mon Profil</v-list-item-title>
              </v-list-item>
              <v-list-item @click="navigateTo(authStore.isAdmin ? '/admin/dashboard' : '/user-dashboard')">
                <template v-slot:prepend>
                  <v-icon>{{ authStore.isAdmin ? 'mdi-shield-crown' : 'mdi-view-dashboard' }}</v-icon>
                </template>
                <v-list-item-title>{{ authStore.isAdmin ? 'Administration' : 'Mon Dashboard' }}</v-list-item-title>
              </v-list-item>
              <v-divider></v-divider>
              <v-list-item @click="handleLogout">
                <template v-slot:prepend>
                  <v-icon>mdi-logout</v-icon>
                </template>
                <v-list-item-title>Se déconnecter</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <!-- Boutons connexion/inscription -->
          <div v-else class="d-flex align-center">
            <v-btn variant="text" @click="navigateTo('/auth/login')" class="mr-2">
              Se connecter
            </v-btn>
            <v-btn color="green-darken-2" variant="flat" @click="navigateTo('/auth/register')">
              Rejoindre la communauté
            </v-btn>
          </div>
        </div>
      </v-container>
    </v-app-bar>

    <!-- Barre de navigation secondaire (breadcrumb) -->
    <v-container v-if="showBreadcrumb" class="py-2">
      <v-breadcrumbs :items="breadcrumbItems" class="pa-0">
        <template v-slot:divider>
          <v-icon>mdi-chevron-right</v-icon>
        </template>
      </v-breadcrumbs>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// État réactif
const searchQuery = ref('')
const notifications = ref([])
const notificationCount = computed(() => notifications.value.length)

// Navigation
const navigateTo = (path) => {
  if (path.startsWith('/') && (path.includes('create') || path.includes('submit') || path.includes('forum') || path.includes('groups') || path.includes('messages') || path.includes('social-share'))) {
    if (!authStore.isAuthenticated) {
      router.push('/auth/login')
      return
    }
  }
  router.push(path)
}

// Vérifier si un menu est actif
const isActiveMenu = (menuType) => {
  const path = route.path
  switch (menuType) {
    case 'dashboard':
      return path.includes('dashboard') || path.includes('analytics')
    case 'discover':
      return path.includes('directory') || path.includes('companies') || path.includes('opportunities') || path.includes('resources') || path.includes('events')
    case 'community':
      return path.includes('forum') || path.includes('groups') || path.includes('messages')
    case 'services':
      return path.includes('create') || path.includes('submit') || path.includes('social-share')
    default:
      return false
  }
}

// Breadcrumb
const showBreadcrumb = computed(() => {
  return route.path !== '/'
})

const breadcrumbItems = computed(() => {
  const items = [{ title: 'Accueil', to: '/' }]
  const pathSegments = route.path.split('/').filter(segment => segment)
  
  let currentPath = ''
  pathSegments.forEach(segment => {
    currentPath += `/${segment}`
    const title = getBreadcrumbTitle(segment, currentPath)
    if (title) {
      items.push({ title, to: currentPath })
    }
  })
  
  return items
})

const getBreadcrumbTitle = (segment, path) => {
  const titles = {
    'companies': 'Entreprises',
    'opportunities': 'Opportunités',
    'events': 'Événements',
    'directory': 'Annuaire',
    'resources': 'Ressources',
    'forum': 'Forum',
    'groups': 'Groupes',
    'messages': 'Messagerie',
    'profile': 'Profil',
    'dashboard': 'Dashboard',
    'admin': 'Administration',
    'user-dashboard': 'Dashboard Utilisateur',
    'admin-dashboard': 'Dashboard Admin',
    'create': 'Créer',
    'submit': 'Soumettre',
    'social-share': 'Réseaux Sociaux',
    'analytics': 'Analytics'
  }
  return titles[segment] || segment.charAt(0).toUpperCase() + segment.slice(1)
}

// Recherche
const performSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({
      path: '/companies',
      query: { search: searchQuery.value.trim() }
    })
  }
}

// Déconnexion
const handleLogout = async () => {
  try {
    console.log('Déconnexion en cours...')
    await authStore.signOut()
    console.log('Déconnexion réussie')
    // Rediriger vers la page d'accueil (landing page)
    await router.push('/auth/login')
  } catch (error) {
    console.error('Erreur lors de la déconnexion:', error)
    alert('Erreur lors de la déconnexion. Veuillez réessayer.')
  }
}

// Charger les notifications
const loadNotifications = async () => {
  if (authStore.isAuthenticated) {
    // Ici vous pourriez charger les vraies notifications depuis l'API
    notifications.value = [
      {
        id: 1,
        title: 'Nouvelle opportunité',
        message: 'Une nouvelle opportunité de financement est disponible'
      }
    ]
  }
}

onMounted(() => {
  loadNotifications()
})
</script>

<style scoped>
.v-btn {
  text-transform: none !important;
}

.v-list-item--disabled {
  opacity: 0.6;
}

.v-breadcrumbs {
  padding: 0;
}
</style>
