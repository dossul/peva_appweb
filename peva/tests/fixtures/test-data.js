// Données de test cohérentes pour PEVA
export const testUsers = {
  admin: {
    email: 'admin@peva.test',
    password: 'AdminPassword123!',
    role: 'admin'
  },
  user: {
    email: 'user@peva.test', 
    password: 'UserPassword123!',
    role: 'user'
  },
  userCompleted: {
    email: 'user.completed@peva.test',
    password: 'UserPassword123!',
    role: 'user',
    onboardingCompleted: true
  }
}

export const testCompanies = [
  {
    id: 1,
    name: 'SolarTech CI',
    sector: 'Énergie Renouvelable',
    country: 'Côte d\'Ivoire',
    city: 'Abidjan',
    size: 'PME',
    employees: 45
  },
  {
    id: 2,
    name: 'Green Farm Ghana',
    sector: 'Agriculture Durable',
    country: 'Ghana',
    city: 'Accra',
    size: 'Moyenne',
    employees: 120
  }
]

export const testOpportunities = [
  {
    id: 1,
    title: 'Financement Énergie Solaire',
    type: 'Financement',
    sector: 'Énergie Renouvelable',
    amount: '500000',
    currency: 'EUR'
  },
  {
    id: 2,
    title: 'Développeur Frontend Vue.js',
    type: 'Emploi',
    sector: 'Technologie',
    location: 'Dakar, Sénégal'
  }
]

export const testSelectors = {
  // Navigation
  logo: '[data-test="logo"]',
  mainNav: '[data-test="main-nav"]',
  userMenu: '[data-test="user-menu"]',
  
  // Authentification
  loginForm: '[data-testid="login-form"]',
  registerForm: '[data-testid="register-form"]',
  emailInput: 'input[type="email"]',
  passwordInput: 'input[type="password"]',
  
  // Page d'accueil
  platformStats: '[data-testid="platform-stats"]',
  featuresSection: '[data-testid="features-section"]',
  featureCard: '[data-testid="feature-card"]',
  testimonialsSection: '[data-testid="testimonials-section"]',
  footer: '[data-test="footer"]',
  
  // Carte interactive
  mapFilters: '[data-testid="map-filters"]',
  companyCounter: '[data-testid="company-counter"]',
  
  // Annuaire
  directoryFilters: '[data-testid="directory-filters"]'
}

export const testRoutes = {
  home: '/',
  login: '/auth/login',
  register: '/auth/register',
  resetPassword: '/auth/reset-password',
  map: '/map',
  directory: '/directory',
  opportunities: '/opportunities',
  resources: '/resources',
  events: '/events',
  userDashboard: '/user-dashboard',
  adminDashboard: '/admin/dashboard'
}
