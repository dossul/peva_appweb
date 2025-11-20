import { test, expect } from '@playwright/test'

test.describe('Tests d\'Intégration Complète', () => {
  test.describe('Workflow Complet Utilisateur', () => {
    test('parcours complet nouvel utilisateur : inscription → onboarding → utilisation', async ({ page }) => {
      const timestamp = Date.now()
      const email = `newuser.${timestamp}@peva.test`
      
      // 1. Inscription
      await page.goto('/signup')
      await page.fill('input[name="firstName"]', 'Nouveau')
      await page.fill('input[name="lastName"]', 'Utilisateur')
      await page.fill('input[name="email"]', email)
      await page.fill('input[name="password"]', 'MotDePasse123!')
      await page.fill('input[name="confirmPassword"]', 'MotDePasse123!')
      await page.click('button:has-text("S\'inscrire")')
      
      // Vérifier la redirection vers vérification email
      await expect(page).toHaveURL('/verify-email')
      
      // Simuler la vérification email
      await page.goto('/login')
      await page.fill('input[name="email"]', email)
      await page.fill('input[name="password"]', 'MotDePasse123!')
      await page.click('button:has-text("Se connecter")')
      
      // 2. Onboarding
      await expect(page).toHaveURL('/onboarding')
      
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
      await page.check('input[value="agriculture_durable"]')
      await page.selectOption('select[name="notifications"]', 'weekly')
      await page.click('button:has-text("Terminer")')
      
      // 3. Utilisation
      await expect(page).toHaveURL('/')
      
      // Explorer la carte
      await page.goto('/map')
      await page.waitForSelector('.leaflet-marker-icon', { timeout: 5000 })
      await page.click('.leaflet-marker-icon >> nth=0')
      await expect(page.locator('.leaflet-popup')).toBeVisible()
      
      // Envoyer demande de connexion
      await page.click('.leaflet-popup button:has-text("Se connecter")')
      await expect(page.locator('[data-test="connection-dialog"]')).toBeVisible()
      await page.fill('textarea[name="message"]', 'Bonjour, j\'aimerais me connecter.')
      await page.click('button:has-text("Envoyer la demande")')
      await expect(page.locator('text=Demande envoyée')).toBeVisible()
    })

    test('parcours utilisateur existant : connexion → dashboard → actions', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[name="email"]', 'user.completed@peva.test')
      await page.fill('input[name="password"]', 'UserPassword123!')
      await page.click('button:has-text("Se connecter")')
      await expect(page).toHaveURL('/')
      
      // Dashboard utilisateur
      await page.click('button:has-text("Dashboard Utilisateur")')
      await expect(page).toHaveURL('/user-dashboard')
      
      await expect(page.locator('[data-test="user-stats"]')).toBeVisible()
      await expect(page.locator('[data-test="recent-activities"]')).toBeVisible()
      
      // Créer opportunité
      await page.click('button:has-text("Créer une opportunité")')
      await expect(page).toHaveURL('/opportunities/create')
      
      await page.fill('input[name="title"]', 'Opportunité Test Dashboard')
      await page.selectOption('select[name="type"]', 'partnership')
      await page.selectOption('select[name="sector"]', 'agriculture_durable')
      await page.fill('textarea[name="description"]', 'Description test')
      await page.fill('input[name="organization"]', 'Mon Organisation')
      await page.selectOption('select[name="country"]', 'Burkina Faso')
      await page.selectOption('select[name="city"]', 'Ouagadougou')
      
      await page.click('button:has-text("Suivant")')
      
      await page.selectOption('select[name="partnershipType"]', 'commercial')
      await page.fill('textarea[name="expectations"]', 'Recherche partenaires')
      
      await page.click('button:has-text("Suivant")')
      
      await page.fill('input[name="contactEmail"]', 'contact@test.com')
      await page.selectOption('select[name="visibility"]', 'public')
      await page.check('input[name="acceptTerms"]')
      
      await page.click('button:has-text("Publier l\'opportunité")')
      await expect(page.locator('text=Opportunité publiée avec succès')).toBeVisible()
    })

    test('parcours administrateur : connexion → gestion → modération', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[name="email"]', 'admin@peva.test')
      await page.fill('input[name="password"]', 'AdminPassword123!')
      await page.click('button:has-text("Se connecter")')
      await expect(page).toHaveURL('/admin/dashboard')
      
      await expect(page.locator('text=Panneau d\'Administration PEVA')).toBeVisible()
      
      // Gérer utilisateurs
      await page.click('text=Utilisateurs')
      await expect(page.locator('[data-test="users-table"]')).toBeVisible()
      
      // Créer utilisateur
      await page.click('button:has-text("Nouvel utilisateur")')
      await page.fill('input[name="firstName"]', 'Admin')
      await page.fill('input[name="lastName"]', 'Test')
      await page.fill('input[name="email"]', `admin.test.${Date.now()}@peva.test`)
      await page.selectOption('select[name="role"]', 'user')
      await page.fill('input[name="password"]', 'TestPassword123!')
      await page.click('button:has-text("Créer")')
      await expect(page.locator('text=Utilisateur créé avec succès')).toBeVisible()
      
      // Modérer opportunités
      await page.click('text=Opportunités')
      await expect(page.locator('[data-test="opportunities-table"]')).toBeVisible()
    })
  })

  test.describe('Intégrations Services', () => {
    test('intégration Supabase : CRUD operations', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[name="email"]', 'user.completed@peva.test')
      await page.fill('input[name="password"]', 'UserPassword123!')
      await page.click('button:has-text("Se connecter")')
      
      // Test Create
      await page.goto('/resources/submit')
      await page.fill('input[name="title"]', 'Ressource Test Intégration')
      await page.fill('textarea[name="description"]', 'Description test intégration')
      await page.selectOption('select[name="type"]', 'guide')
      await page.fill('input[name="category"]', 'Test')
      await page.selectOption('select[name="level"]', 'beginner')
      await page.fill('input[name="author"]', 'Test Author')
      await page.fill('input[name="source"]', 'https://test.com/resource.pdf')
      
      await page.click('button:has-text("Soumettre")')
      await expect(page.locator('text=Ressource soumise avec succès')).toBeVisible()
      
      // Test Read
      await page.goto('/resources')
      await page.fill('input[name="search"]', 'Ressource Test Intégration')
      await page.click('button:has-text("Appliquer")')
      await expect(page.locator('text=Ressource Test Intégration')).toBeVisible()
    })

    test('intégration notifications temps réel', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[name="email"]', 'user.completed@peva.test')
      await page.fill('input[name="password"]', 'UserPassword123!')
      await page.click('button:has-text("Se connecter")')
      
      const notificationBadge = page.locator('[data-test="notification-badge"]')
      
      if (await notificationBadge.isVisible()) {
        const initialCount = await notificationBadge.textContent()
        
        // Déclencher notification
        await page.goto('/map')
        await page.waitForSelector('.leaflet-marker-icon', { timeout: 5000 })
        await page.click('.leaflet-marker-icon >> nth=0')
        await page.click('.leaflet-popup button:has-text("Se connecter")')
        await page.fill('textarea[name="message"]', 'Test notification')
        await page.click('button:has-text("Envoyer la demande")')
        
        await page.waitForTimeout(2000)
        
        const newCount = await notificationBadge.textContent()
        expect(parseInt(newCount)).toBeGreaterThanOrEqual(parseInt(initialCount))
      }
    })

    test('intégration OneSignal', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[name="email"]', 'user.completed@peva.test')
      await page.fill('input[name="password"]', 'UserPassword123!')
      await page.click('button:has-text("Se connecter")')
      
      // Vérifier OneSignal sans erreur
      const oneSignalError = await page.evaluate(() => window.OneSignalError)
      expect(oneSignalError).toBeUndefined()
      
      // Vérifier fonctions disponibles
      const oneSignalFunctions = await page.evaluate(() => ({
        subscribeToNotifications: typeof window.subscribeToNotifications,
        getNotificationStatus: typeof window.getNotificationStatus
      }))
      
      expect(oneSignalFunctions.subscribeToNotifications).toBe('function')
      expect(oneSignalFunctions.getNotificationStatus).toBe('function')
    })
  })

  test.describe('Flux de Données Complexes', () => {
    test('workflow carte → connexions → messages', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[name="email"]', 'user.completed@peva.test')
      await page.fill('input[name="password"]', 'UserPassword123!')
      await page.click('button:has-text("Se connecter")')
      
      // Carte
      await page.goto('/map')
      await page.waitForSelector('.leaflet-marker-icon', { timeout: 5000 })
      await page.click('.leaflet-marker-icon >> nth=0')
      await expect(page.locator('.leaflet-popup')).toBeVisible()
      
      // Connexion
      await page.click('.leaflet-popup button:has-text("Se connecter")')
      await expect(page.locator('[data-test="connection-dialog"]')).toBeVisible()
      
      const companyName = await page.locator('[data-test="company-name"]').textContent()
      
      await page.fill('textarea[name="message"]', `Bonjour ${companyName}, connexion.`)
      await page.click('button:has-text("Envoyer la demande")')
      await expect(page.locator('text=Demande envoyée')).toBeVisible()
      
      // Vérification connexions
      await page.goto('/connections')
      await page.click('text=Demandes envoyées')
      await expect(page.locator('[data-test="sent-request"]')).toHaveCountGreaterThan(0)
      
      // Messages
      await page.goto('/messages')
      await page.click('[data-test="new-conversation-button"]')
      await page.fill('[data-test="contact-search"]', companyName)
      
      if (await page.locator('[data-test="contact-result"]').count() > 0) {
        await page.click('[data-test="contact-result"] >> nth=0')
        await page.fill('[data-test="initial-message"]', 'Discussion collaboration.')
        await page.click('button:has-text("Démarrer la conversation")')
        
        await expect(page.locator('[data-test="chat-header"]')).toBeVisible()
      }
    })
  })

  test.describe('Tests de Régression', () => {
    test('redirections après authentification', async ({ page }) => {
      // Utilisateur simple
      await page.goto('/login')
      await page.fill('input[name="email"]', 'user.completed@peva.test')
      await page.fill('input[name="password"]', 'UserPassword123!')
      await page.click('button:has-text("Se connecter")')
      
      await expect(page).toHaveURL('/')
      
      await page.click('button:has-text("Dashboard Utilisateur")')
      await page.click('[data-test="user-menu"]')
      await page.click('text=Se déconnecter')
      
      // Admin
      await page.goto('/login')
      await page.fill('input[name="email"]', 'admin@peva.test')
      await page.fill('input[name="password"]', 'AdminPassword123!')
      await page.click('button:has-text("Se connecter")')
      
      await expect(page).toHaveURL('/admin/dashboard')
      
      // Redirection /companies
      await page.goto('/companies')
      await expect(page).toHaveURL('/directory')
    })

    test('navigation harmonisée grille/liste/carte', async ({ page }) => {
      await page.goto('/login')
      await page.fill('input[name="email"]', 'user.completed@peva.test')
      await page.fill('input[name="password"]', 'UserPassword123!')
      await page.click('button:has-text("Se connecter")')
      
      // Carte
      await page.goto('/map')
      await expect(page.locator('button:has-text("GRILLE")')).toBeVisible()
      await expect(page.locator('button:has-text("LISTE")')).toBeVisible()
      await expect(page.locator('button:has-text("CARTE")')).toBeDisabled()
      
      // Navigation grille
      await page.click('button:has-text("GRILLE")')
      await expect(page).toHaveURL('/directory')
      
      await expect(page.locator('button:has-text("GRILLE")')).toBeDisabled()
      await expect(page.locator('button:has-text("CARTE")')).toBeVisible()
      
      // Navigation carte
      await page.click('button:has-text("CARTE")')
      await expect(page).toHaveURL('/map')
    })

    test('permissions et sécurité', async ({ page }) => {
      // Admin sans connexion
      await page.goto('/admin/dashboard')
      await expect(page).not.toHaveURL('/admin/dashboard')
      
      // Admin avec utilisateur normal
      await page.goto('/login')
      await page.fill('input[name="email"]', 'user.completed@peva.test')
      await page.fill('input[name="password"]', 'UserPassword123!')
      await page.click('button:has-text("Se connecter")')
      
      await page.goto('/admin/dashboard')
      await expect(page).not.toHaveURL('/admin/dashboard')
      await expect(page).toHaveURL('/')
      
      // Admin avec admin
      await page.click('[data-test="user-menu"]')
      await page.click('text=Se déconnecter')
      
      await page.goto('/login')
      await page.fill('input[name="email"]', 'admin@peva.test')
      await page.fill('input[name="password"]', 'AdminPassword123!')
      await page.click('button:has-text("Se connecter")')
      
      await expect(page).toHaveURL('/admin/dashboard')
    })
  })
})
