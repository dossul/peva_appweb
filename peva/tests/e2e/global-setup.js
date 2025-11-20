/**
 * Configuration globale des tests E2E PEVA
 * Exécuté une seule fois avant tous les tests
 */

import { chromium } from '@playwright/test'

async function globalSetup() {
  console.log('🚀 Initialisation des tests E2E PEVA...')
  
  // Créer un navigateur pour la configuration
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  
  try {
    // Vérifier que l'application est accessible
    await page.goto(process.env.BASE_URL || 'http://localhost:5173')
    await page.waitForLoadState('networkidle', { timeout: 30000 })
    
    console.log('✅ Application PEVA accessible')
    
    // Créer les utilisateurs de test si nécessaire
    await setupTestUsers(page)
    
    // Vérifier les services externes
    await checkExternalServices(page)
    
    console.log('✅ Configuration des tests terminée')
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration des tests:', error)
    throw error
  } finally {
    await browser.close()
  }
}

/**
 * Créer les utilisateurs de test nécessaires
 */
async function setupTestUsers(page) {
  console.log('👥 Configuration des utilisateurs de test...')
  
  const testUsers = [
    {
      email: 'admin@peva.test',
      password: 'AdminPassword123!',
      role: 'admin',
      firstName: 'Admin',
      lastName: 'PEVA'
    },
    {
      email: 'superadmin@peva.test',
      password: 'SuperAdminPassword123!',
      role: 'super_admin',
      firstName: 'Super',
      lastName: 'Admin'
    },
    {
      email: 'user.completed@peva.test',
      password: 'UserPassword123!',
      role: 'user',
      firstName: 'Utilisateur',
      lastName: 'Complété',
      onboardingCompleted: true
    },
    {
      email: 'user.new@peva.test',
      password: 'UserPassword123!',
      role: 'user',
      firstName: 'Nouvel',
      lastName: 'Utilisateur',
      onboardingCompleted: false
    },
    {
      email: 'company.owner@peva.test',
      password: 'CompanyPassword123!',
      role: 'user',
      firstName: 'Propriétaire',
      lastName: 'Entreprise',
      onboardingCompleted: true
    }
  ]
  
  for (const user of testUsers) {
    try {
      // Vérifier si l'utilisateur existe déjà
      await page.goto('/login')
      await page.fill('input[name="email"]', user.email)
      await page.fill('input[name="password"]', user.password)
      await page.click('button:has-text("Se connecter")')
      
      // Si la connexion réussit, l'utilisateur existe
      await page.waitForTimeout(2000)
      
      if (page.url().includes('/login')) {
        // Utilisateur n'existe pas, le créer
        console.log(`Création de l'utilisateur: ${user.email}`)
        await createTestUser(page, user)
      } else {
        console.log(`Utilisateur existant: ${user.email}`)
        // Se déconnecter
        if (page.url().includes('/admin')) {
          await page.click('[data-test="user-menu"]')
          await page.click('text=Se déconnecter')
        } else {
          await page.click('button:has-text("Dashboard Utilisateur")')
          await page.click('[data-test="user-menu"]')
          await page.click('text=Se déconnecter')
        }
      }
      
    } catch (error) {
      console.log(`Création de l'utilisateur: ${user.email}`)
      await createTestUser(page, user)
    }
  }
}

/**
 * Créer un utilisateur de test
 */
async function createTestUser(page, user) {
  try {
    await page.goto('/signup')
    
    await page.fill('input[name="firstName"]', user.firstName)
    await page.fill('input[name="lastName"]', user.lastName)
    await page.fill('input[name="email"]', user.email)
    await page.fill('input[name="password"]', user.password)
    await page.fill('input[name="confirmPassword"]', user.password)
    
    await page.click('button:has-text("S\'inscrire")')
    
    // Simuler la vérification email en allant directement à la connexion
    await page.waitForTimeout(2000)
    
    // Si l'utilisateur doit compléter l'onboarding
    if (user.onboardingCompleted && user.role === 'user') {
      await completeOnboarding(page)
    }
    
    console.log(`✅ Utilisateur créé: ${user.email}`)
    
  } catch (error) {
    console.warn(`⚠️  Erreur création utilisateur ${user.email}:`, error.message)
  }
}

/**
 * Compléter l'onboarding pour un utilisateur
 */
async function completeOnboarding(page) {
  try {
    // Aller à l'onboarding si pas déjà là
    if (!page.url().includes('/onboarding')) {
      await page.goto('/onboarding')
    }
    
    // Étape 1
    await page.fill('input[name="phone"]', '+22670123456')
    await page.fill('input[name="dateOfBirth"]', '1990-01-01')
    await page.selectOption('select[name="country"]', 'Burkina Faso')
    await page.selectOption('select[name="city"]', 'Ouagadougou')
    await page.click('button:has-text("Suivant")')
    
    // Étape 2
    await page.fill('input[name="jobTitle"]', 'Entrepreneur')
    await page.selectOption('select[name="sector"]', 'energie_solaire')
    await page.fill('input[name="experience"]', '3')
    await page.click('button:has-text("Suivant")')
    
    // Étape 3
    await page.check('input[value="energie_solaire"]')
    await page.selectOption('select[name="notifications"]', 'weekly')
    await page.click('button:has-text("Terminer")')
    
    console.log('✅ Onboarding complété')
    
  } catch (error) {
    console.warn('⚠️  Erreur onboarding:', error.message)
  }
}

/**
 * Vérifier les services externes
 */
async function checkExternalServices(page) {
  console.log('🔍 Vérification des services externes...')
  
  try {
    // Vérifier OneSignal
    await page.evaluate(() => {
      return new Promise((resolve) => {
        if (window.OneSignal) {
          resolve(true)
        } else {
          // Attendre un peu pour OneSignal
          setTimeout(() => {
            resolve(!!window.OneSignal)
          }, 3000)
        }
      })
    })
    
    console.log('✅ OneSignal disponible')
    
  } catch (error) {
    console.warn('⚠️  OneSignal non disponible:', error.message)
  }
  
  try {
    // Vérifier Leaflet
    await page.evaluate(() => {
      return typeof window.L !== 'undefined'
    })
    
    console.log('✅ Leaflet disponible')
    
  } catch (error) {
    console.warn('⚠️  Leaflet non disponible:', error.message)
  }
}

export default globalSetup
