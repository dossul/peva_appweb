import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

// Vues d'authentification
const LoginView = () => import('@/views/auth/LoginView.vue')
const RegisterView = () => import('@/views/auth/RegisterView.vue')
const ResetPasswordView = () => import('@/views/auth/ResetPasswordView.vue')
const ResetPasswordConfirmView = () => import('@/views/auth/ResetPasswordConfirmView.vue')
const EmailConfirmationView = () => import('@/views/auth/EmailConfirmationView.vue')

// Vues principales
const LandingView = () => import('@/views/LandingView.vue')
const DashboardViewClean = () => import('@/views/DashboardViewClean.vue')
const UserDashboard = () => import('@/views/UserDashboard.vue')
const OpportunitiesView = () => import('@/views/OpportunitiesView.vue')
const EventsView = () => import('@/views/EventsView.vue')
const DirectoryView = () => import('@/views/DirectoryView.vue')
const ResourcesView = () => import('@/views/ResourcesView.vue')
const ForumView = () => import('@/views/ForumView.vue')
const GroupsView = () => import('@/views/GroupsView.vue')
const MessagesView = () => import('@/views/MessagesView.vue')
const AnalyticsView = () => import('@/views/AnalyticsView.vue')
const SocialShareView = () => import('@/views/SocialShareView.vue')
const ApiDocsView = () => import('@/views/ApiDocsView.vue')

// Vues de création de contenu et nouvelles vues
const CreateOpportunityView = () => import('@/views/CreateOpportunityView.vue')
const CreateEventView = () => import('@/views/CreateEventView.vue')
const SubmitResourceView = () => import('@/views/SubmitResourceView.vue')
const TestimonialSubmitView = () => import('@/views/TestimonialSubmitView.vue')
const CreateGroupView = () => import('@/views/CreateGroupView.vue')
const CompanyManagementView = () => import('@/views/CompanyManagementView.vue')
const RSEDashboard = () => import('@/views/RSEDashboard.vue')
const RSEReportForm = () => import('@/views/RSEReportForm.vue')
const AdminDashboardView = () => import('@/views/AdminDashboardView.vue')
const AdminUsersView = () => import('@/views/admin/AdminUsersView.vue')
const AdminModerationView = () => import('@/views/admin/AdminModerationView.vue')
const AdminAnalyticsView = () => import('@/views/admin/AdminAnalyticsView.vue')
const AdminCountriesView = () => import('@/views/admin/AdminCountriesView.vue')
const AdminForumView = () => import('@/views/admin/AdminForumView.vue')
const AdminGroupsView = () => import('@/views/admin/AdminGroupsView.vue')
const AdminEventsView = () => import('@/views/admin/AdminEventsView.vue')
const AdminEmailTemplatesView = () => import('@/views/admin/AdminEmailTemplatesView.vue')
const AdminSocialView = () => import('@/views/admin/AdminSocialView.vue')
const AdminReportsView = () => import('@/views/admin/AdminReportsView.vue')
const AdminContentManagementView = () => import('@/views/admin/AdminContentManagementView.vue')

const OnboardingView = () => import('@/views/OnboardingView.vue')
const ProfileView = () => import('@/views/ProfileView.vue')
const MapView = () => import('@/views/MapView.vue')
const ConnectionsView = () => import('@/views/ConnectionsView.vue')
const OpportunityApplicationsView = () => import('@/views/OpportunityApplicationsView.vue')
const MyOpportunitiesView = () => import('@/views/MyOpportunitiesView.vue')
const MyResourcesView = () => import('@/views/MyResourcesView.vue')
const MyEventsView = () => import('@/views/MyEventsView.vue')

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Landing',
      component: LandingView,
      meta: {
        requiresGuest: true,
        title: '2iE GreenHub - Plateforme Économie Verte Africaine'
      }
    },
    {
      path: '/auth/login',
      name: 'Login',
      component: LoginView,
      meta: { 
        requiresGuest: true,
        title: 'Connexion - 2iE GreenHub'
      }
    },
    {
      path: '/auth/register',
      name: 'Register',
      component: RegisterView,
      meta: { 
        requiresGuest: true,
        title: 'Inscription - 2iE GreenHub'
      }
    },
    {
      path: '/auth/reset-password',
      name: 'ResetPassword',
      component: ResetPasswordView,
      meta: { 
        requiresGuest: true,
        title: 'Réinitialiser le mot de passe - 2iE GreenHub'
      }
    },
    {
      path: '/auth/reset-password/confirm',
      name: 'ResetPasswordConfirm',
      component: ResetPasswordConfirmView,
      meta: { 
        requiresGuest: true,
        title: 'Nouveau mot de passe - 2iE GreenHub'
      }
    },
    {
      path: '/auth/email-confirmation',
      name: 'EmailConfirmation',
      component: EmailConfirmationView,
      meta: { 
        requiresGuest: true,
        title: 'Confirmation email - 2iE GreenHub'
      }
    },
    {
      path: '/onboarding',
      name: 'Onboarding',
      component: OnboardingView,
      meta: { 
        requiresAuth: true,
        requiresEmailVerification: true,
        title: 'Bienvenue - 2iE GreenHub'
      }
    },
    {
      path: '/dashboard',
      name: 'Dashboard',
      beforeEnter: async (to, from, next) => {
        const authStore = useAuthStore()
        
        // S'assurer que le store est initialisé
        if (!authStore.initialized) {
          await authStore.initialize()
        }
        
        // Éviter la redirection infinie
        if (from.path === '/admin/dashboard' || from.path === '/') {
          return next(false) // Annuler la navigation
        }
        
        // Redirection intelligente selon le rôle
        if (authStore.isAdmin) {
          next('/admin/dashboard')
        } else {
          next('/') // Rediriger les utilisateurs simples vers la page d'accueil
        }
      }
    },
    {
      path: '/dashboard-clean',
      name: 'DashboardClean',
      component: DashboardViewClean,
      meta: { 
        requiresAuth: true,
        requiresEmailVerification: true,
        requiresOnboarding: true,
        title: 'Tableau de bord épuré - 2iE GreenHub'
      }
    },
    {
      path: '/user-dashboard',
      name: 'UserDashboard',
      component: UserDashboard,
      meta: { 
        requiresAuth: true,
        requiresEmailVerification: true,
        title: 'Dashboard Utilisateur - 2iE GreenHub'
      }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: ProfileView,
      meta: { 
        requiresAuth: true,
        requiresEmailVerification: true,
        requiresOnboarding: true,
        title: 'Mon profil - 2iE GreenHub'
      }
    },
    {
      path: '/user/:id',
      name: 'UserProfile',
      component: () => import('@/views/UserProfileView.vue'),
      meta: { 
        requiresAuth: true,
        title: 'Profil Utilisateur - 2iE GreenHub'
      }
    },
    {
      path: '/companies',
      redirect: '/directory'
    },
    {
      path: '/opportunities',
      name: 'Opportunities',
      component: OpportunitiesView,
      meta: { 
        title: 'Opportunités Vertes - 2iE GreenHub'
      }
    },
    {
      path: '/events',
      name: 'Events',
      component: EventsView,
      meta: { 
        title: 'Événements Verts - 2iE GreenHub'
      }
    },
    {
      path: '/events/:id',
      name: 'EventDetail',
      component: () => import('@/views/EventDetailView.vue'),
      meta: { 
        title: 'Détail Événement - 2iE GreenHub'
      }
    },
    {
      path: '/directory',
      name: 'Directory',
      component: DirectoryView,
      meta: { 
        title: 'Annuaire 2iE GreenHub'
      }
    },
    {
      path: '/map',
      name: 'Map',
      component: MapView,
      meta: { 
        title: 'Cartographie Interactive - 2iE GreenHub'
      }
    },
    {
      path: '/resources',
      name: 'Resources',
      component: ResourcesView,
      meta: { 
        title: 'Ressources & Connaissances - 2iE GreenHub'
      }
    },
    {
      path: '/resources/:id',
      name: 'ResourceDetail',
      component: () => import('@/views/ResourceDetailView.vue'),
      meta: { 
        title: 'Détail Ressource - 2iE GreenHub'
      }
    },
    {
      path: '/forum',
      name: 'Forum',
      component: ForumView,
      meta: { 
        requiresAuth: true,
        title: 'Forum de Discussions - 2iE GreenHub'
      }
    },
    {
      path: '/groups',
      name: 'Groups',
      component: GroupsView,
      meta: { 
        requiresAuth: true,
        title: 'Groupes & Réseaux - 2iE GreenHub'
      }
    },
    {
      path: '/messages',
      name: 'Messages',
      component: MessagesView,
      meta: { 
        requiresAuth: true,
        title: 'Messagerie - 2iE GreenHub'
      }
    },
    {
      path: '/connections',
      name: 'Connections',
      component: ConnectionsView,
      meta: { 
        requiresAuth: true,
        title: 'Mes Connexions - 2iE GreenHub'
      }
    },
    {
      path: '/analytics',
      name: 'Analytics',
      component: AnalyticsView,
      meta: { 
        requiresAuth: true,
        requiresAdmin: true,
        title: 'Analytics - 2iE GreenHub'
      }
    },
    {
      path: '/social-share',
      name: 'SocialShare',
      component: SocialShareView,
      meta: { 
        requiresAuth: true,
        title: 'Partage Réseaux Sociaux - 2iE GreenHub'
      }
    },
    {
      path: '/api/docs',
      name: 'ApiDocs',
      component: ApiDocsView,
      meta: { 
        title: 'API & Développeurs - 2iE GreenHub'
      }
    },
    // Routes de création de contenu
    {
      path: '/opportunities/create',
      name: 'CreateOpportunity',
      component: CreateOpportunityView,
      meta: { 
        requiresAuth: true,
        title: 'Publier une Opportunité - 2iE GreenHub'
      }
    },
    {
      path: '/opportunities/edit/:id',
      name: 'EditOpportunity',
      component: CreateOpportunityView,
      meta: { 
        requiresAuth: true,
        title: 'Modifier une Opportunité - 2iE GreenHub'
      }
    },
    {
      path: '/opportunities/:id/applications',
      name: 'OpportunityApplications',
      component: OpportunityApplicationsView,
      meta: { 
        requiresAuth: true,
        title: 'Candidatures - 2iE GreenHub'
      }
    },
    {
      path: '/my-opportunities',
      name: 'MyOpportunities',
      component: MyOpportunitiesView,
      meta: { 
        requiresAuth: true,
        title: 'Mes Opportunités - 2iE GreenHub'
      }
    },
    {
      path: '/my-resources',
      name: 'MyResources',
      component: MyResourcesView,
      meta: { 
        requiresAuth: true,
        title: 'Mes Ressources - 2iE GreenHub'
      }
    },
    {
      path: '/my-events',
      name: 'MyEvents',
      component: MyEventsView,
      meta: { 
        requiresAuth: true,
        title: 'Mes Événements - 2iE GreenHub'
      }
    },
    {
      path: '/resources/submit',
      name: 'SubmitResource',
      component: SubmitResourceView,
      meta: { 
        requiresAuth: true,
        title: 'Proposer une Ressource - 2iE GreenHub'
      }
    },
    {
      path: '/resources/edit/:id',
      name: 'EditResource',
      component: SubmitResourceView,
      meta: { 
        requiresAuth: true,
        title: 'Modifier ma Ressource - 2iE GreenHub'
      }
    },
    {
      path: '/testimonials/submit',
      name: 'SubmitTestimonial',
      component: TestimonialSubmitView,
      meta: { 
        requiresAuth: true,
        title: 'Partager mon Témoignage - 2iE GreenHub'
      }
    },
    {
      path: '/events/create',
      name: 'CreateEvent',
      component: CreateEventView,
      meta: { 
        requiresAuth: true,
        title: 'Créer un Événement - 2iE GreenHub'
      }
    },
    {
      path: '/groups/create',
      name: 'CreateGroup',
      component: CreateGroupView,
      meta: { 
        requiresAuth: true,
        title: 'Créer un Groupe - 2iE GreenHub'
      }
    },
    // Nouvelles routes professionnelles
    {
      path: '/company/management',
      name: 'CompanyManagement',
      component: CompanyManagementView,
      meta: { 
        requiresAuth: true,
        title: 'Gestion Entreprise - 2iE GreenHub'
      }
    },
    {
      path: '/company/:companyId/rse',
      name: 'RSEDashboard',
      component: RSEDashboard,
      props: (route) => ({
        companyId: parseInt(route.params.companyId),
        companyName: route.query.name || 'Entreprise'
      }),
      meta: { 
        requiresAuth: true,
        title: 'Tableau de Bord RSE - 2iE GreenHub'
      }
    },
    {
      path: '/company/:companyId/rse/new',
      name: 'RSEReportForm',
      component: RSEReportForm,
      props: (route) => ({
        companyId: parseInt(route.params.companyId),
        reportId: route.params.reportId ? parseInt(route.params.reportId) : null
      }),
      meta: { 
        requiresAuth: true,
        title: 'Rapport RSE - 2iE GreenHub'
      }
    },
    {
      path: '/company/:companyId/rse/:reportId/edit',
      name: 'RSEReportEdit',
      component: RSEReportForm,
      props: (route) => ({
        companyId: parseInt(route.params.companyId),
        reportId: parseInt(route.params.reportId)
      }),
      meta: { 
        requiresAuth: true,
        title: 'Modifier Rapport RSE - 2iE GreenHub'
      }
    },
    {
      path: '/admin/dashboard',
      name: 'AdminDashboard',
      component: AdminDashboardView,
      meta: { 
        requiresAuth: true,
        requiresAdmin: true,
        title: 'Administration 2iE GreenHub'
      }
    },
    {
      path: '/admin/users',
      name: 'AdminUsers',
      component: AdminUsersView,
      meta: { 
        requiresAuth: true,
        requiresAdmin: true,
        title: 'Gestion Utilisateurs - 2iE GreenHub'
      }
    },
    {
      path: '/admin/moderation',
      name: 'AdminModeration',
      component: AdminModerationView,
      meta: { 
        requiresAuth: true,
        requiresAdmin: true,
        title: 'Modération Contenu - 2iE GreenHub'
      }
    },
    {
      path: '/admin/analytics',
      name: 'AdminAnalytics',
      component: AdminAnalyticsView,
      meta: { 
        requiresAuth: true,
        requiresAdmin: true,
        title: 'Analytics & Rapports - 2iE GreenHub'
      }
    },
    {
      path: '/admin/countries',
      name: 'AdminCountries',
      component: AdminCountriesView,
      meta: { 
        requiresAuth: true,
        requiresAdmin: true,
        title: 'Gestion des Pays - 2iE GreenHub'
      }
    },
    {
      path: '/admin/forum',
      name: 'AdminForum',
      component: AdminForumView,
      meta: { 
        requiresAuth: true,
        requiresAdmin: true,
        title: 'Gestion du Forum - 2iE GreenHub'
      }
    },
    {
      path: '/admin/groups',
      name: 'AdminGroups',
      component: AdminGroupsView,
      meta: { 
        requiresAuth: true,
        requiresAdmin: true,
        title: 'Gestion des Communautés - 2iE GreenHub'
      }
    },
    {
      path: '/admin/events',
      name: 'AdminEvents',
      component: AdminEventsView,
      meta: { 
        requiresAuth: true,
        requiresAdmin: true,
        title: 'Gestion des Événements'
      }
    },
    {
      path: '/admin/email-templates',
      name: 'AdminEmailTemplates',
      component: AdminEmailTemplatesView,
      meta: { 
        requiresAuth: true,
        requiresAdmin: true,
        title: 'Templates Emails - 2iE GreenHub'
      }
    },
    {
      path: '/admin/social',
      name: 'AdminSocial',
      component: AdminSocialView,
      meta: { 
        requiresAuth: true,
        requiresAdmin: true,
        title: 'Gestion Réseaux Sociaux - 2iE GreenHub'
      }
    },
    {
      path: '/admin/reports',
      name: 'AdminReports',
      component: AdminReportsView,
      meta: { 
        requiresAuth: true,
        requiresAdmin: true,
        title: 'Signalements - 2iE GreenHub'
      }
    },
    {
      path: '/admin/content',
      name: 'AdminContent',
      component: AdminContentManagementView,
      meta: { 
        requiresAuth: true,
        requiresAdmin: true,
        title: 'Gestion de Contenu - 2iE GreenHub'
      }
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/'
    }
  ]
})

// Gardes de navigation
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  
  // Initialiser l'authentification si ce n'est pas déjà fait
  if (!authStore.initialized) {
    try {
      await authStore.initialize()
    } catch (error) {
      console.error('Erreur lors de l\'initialisation de l\'auth:', error)
    }
  }

  // Définir le titre de la page
  if (to.meta.title) {
    document.title = to.meta.title
  }

  // Vérifier si la route nécessite d'être invité (non connecté)
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    // Éviter la redirection infinie
    if (to.path === '/' || to.path === '/admin/dashboard') {
      return next()
    }
    
    // Redirection intelligente selon le rôle
    if (authStore.isAdmin) {
      return next('/admin/dashboard')
    } else {
      return next('/') // Page d'accueil pour les utilisateurs simples
    }
  }

  // Vérifier si la route nécessite une authentification
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next('/auth/login')
  }

  // Si l'utilisateur est connecté, effectuer des vérifications supplémentaires
  if (authStore.isAuthenticated) {
    // Les admins sont exemptés des contraintes d'email et d'onboarding
    const isAdmin = authStore.isAdmin
    
    // Vérifier la vérification de l'email (sauf pour les admins)
    if (to.meta.requiresEmailVerification && !authStore.isEmailVerified && !isAdmin) {
      // Rediriger vers une page de vérification d'email (à créer)
      console.warn('Email non vérifié')
      // Pour l'instant, on laisse passer mais on pourrait rediriger
    }

    // Vérifier si l'onboarding est requis (sauf pour les admins)
    if (to.meta.requiresOnboarding && !authStore.hasCompletedOnboarding && !isAdmin) {
      if (to.name !== 'Onboarding') {
        return next('/onboarding')
      }
    }

    // Vérifier les droits admin
    if (to.meta.requiresAdmin && !authStore.isAdmin) {
      return next('/')
    }

    // Si l'utilisateur a terminé l'onboarding et essaie d'accéder à l'onboarding
    if (to.name === 'Onboarding' && authStore.hasCompletedOnboarding) {
      // Redirection intelligente selon le rôle
      if (authStore.isAdmin) {
        return next('/admin/dashboard')
      } else {
        return next('/') // Page d'accueil pour les utilisateurs simples
      }
    }
  }

  next()
})

export default router
