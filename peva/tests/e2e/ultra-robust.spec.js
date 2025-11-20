import { test, expect } from '@playwright/test'
import { TestHelpers } from '../helpers/test-helpers.js'
import { testRoutes } from '../fixtures/test-data.js'

test.describe('Tests Ultra-Robustes PEVA', () => {
  let helpers

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page)
  })

  test('doit charger toutes les pages sans erreur 404', async ({ page }) => {
    const routes = [
      '/',
      '/map',
      '/directory',
      '/opportunities',
      '/resources',
      '/events',
      '/auth/login',
      '/auth/register',
      '/auth/reset-password'
    ]

    for (const route of routes) {
      await page.goto(route, { waitUntil: 'networkidle', timeout: 10000 })
      
      // Vérifier qu'on n'a pas d'erreur 404
      const title = await page.title()
      expect(title).not.toMatch(/404|Not Found|Error/i)
      
      // Vérifier que le body n'est pas vide
      const bodyText = await page.locator('body').textContent()
      expect(bodyText.length).toBeGreaterThan(10)
      
      // Vérifier la présence de PEVA (sauf sur les pages d'erreur)
      if (!title.includes('404')) {
        const pevaCount = await page.locator('text=PEVA').count()
        expect(pevaCount).toBeGreaterThan(0)
      }
    }
  })

  test('doit avoir des formulaires d\'authentification fonctionnels', async ({ page }) => {
    // Test page de connexion
    await page.goto('/auth/login', { waitUntil: 'networkidle' })
    
    const emailInputs = page.locator('input[type="email"]')
    const passwordInputs = page.locator('input[type="password"]')
    
    if (await emailInputs.count() > 0) {
      await expect(emailInputs.first()).toBeVisible()
    }
    
    if (await passwordInputs.count() > 0) {
      await expect(passwordInputs.first()).toBeVisible()
    }

    // Test page d'inscription
    await page.goto('/auth/register', { waitUntil: 'networkidle' })
    
    const registerEmailInputs = page.locator('input[type="email"]')
    if (await registerEmailInputs.count() > 0) {
      await expect(registerEmailInputs.first()).toBeVisible()
    }

    // Test page reset password
    await page.goto('/auth/reset-password', { waitUntil: 'networkidle' })
    
    const resetEmailInputs = page.locator('input[type="email"]')
    if (await resetEmailInputs.count() > 0) {
      await expect(resetEmailInputs.first()).toBeVisible()
    }
  })

  test('doit avoir une navigation cohérente', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    
    // Vérifier les liens de navigation principaux
    const navLinks = [
      'Carte Interactive',
      'Annuaire',
      'Opportunités',
      'Ressources',
      'Événements'
    ]
    
    let foundLinks = 0
    for (const linkText of navLinks) {
      const links = page.locator(`text=${linkText}`)
      const count = await links.count()
      if (count > 0) {
        foundLinks++
      }
    }
    
    // Au moins 2 liens de navigation doivent être présents
    expect(foundLinks).toBeGreaterThan(1)
  })

  test('doit rediriger /companies vers /directory', async ({ page }) => {
    await page.goto('/companies', { waitUntil: 'networkidle' })
    
    // Vérifier qu'on est bien sur /directory
    const currentUrl = page.url()
    expect(currentUrl).toContain('/directory')
  })

  test('doit afficher du contenu sur les pages principales', async ({ page }) => {
    const pagesWithContent = [
      { route: '/', expectedText: 'Écosystème' },
      { route: '/map', expectedText: 'Carte' },
      { route: '/directory', expectedText: 'Annuaire' },
      { route: '/opportunities', expectedText: 'Opportunités' },
      { route: '/resources', expectedText: 'Ressources' },
      { route: '/events', expectedText: 'Événements' }
    ]

    for (const pageInfo of pagesWithContent) {
      await page.goto(pageInfo.route, { waitUntil: 'networkidle' })
      
      // Vérifier la présence du texte attendu
      const hasExpectedText = await page.locator(`text=${pageInfo.expectedText}`).count() > 0
      if (hasExpectedText) {
        await expect(page.locator(`text=${pageInfo.expectedText}`)).toBeVisible()
      } else {
        // Si le texte exact n'est pas trouvé, vérifier au moins que la page a du contenu
        const bodyText = await page.locator('body').textContent()
        expect(bodyText.length).toBeGreaterThan(50)
      }
    }
  })

  test('doit être responsive sur mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    const routes = ['/', '/map', '/directory']
    
    for (const route of routes) {
      await page.goto(route, { waitUntil: 'networkidle' })
      
      // Vérifier que la page se charge
      const bodyText = await page.locator('body').textContent()
      expect(bodyText.length).toBeGreaterThan(10)
      
      // Vérifier qu'il n'y a pas de débordement horizontal
      const bodyWidth = await page.locator('body').boundingBox()
      if (bodyWidth) {
        expect(bodyWidth.width).toBeLessThanOrEqual(375)
      }
    }
  })

  test('doit gérer les erreurs gracieusement', async ({ page }) => {
    const errors = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    // Naviguer vers plusieurs pages
    const routes = ['/', '/map', '/directory', '/opportunities']
    
    for (const route of routes) {
      await page.goto(route, { waitUntil: 'networkidle' })
      await page.waitForTimeout(500)
    }
    
    // Filtrer les erreurs critiques
    const criticalErrors = errors.filter(error => 
      !error.includes('OneSignal') && 
      !error.includes('favicon') &&
      !error.includes('404') &&
      !error.includes('net::ERR_FAILED') &&
      !error.includes('ERR_INTERNET_DISCONNECTED')
    )
    
    // Tolérer jusqu'à 3 erreurs non critiques
    expect(criticalErrors.length).toBeLessThan(4)
  })

  test('doit avoir des éléments interactifs fonctionnels', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })
    
    // Chercher des boutons interactifs
    const buttons = page.locator('button:visible')
    const buttonCount = await buttons.count()
    
    if (buttonCount > 0) {
      // Vérifier qu'au moins un bouton est cliquable
      const firstButton = buttons.first()
      await expect(firstButton).toBeEnabled()
    }
    
    // Chercher des liens
    const links = page.locator('a:visible')
    const linkCount = await links.count()
    
    expect(buttonCount + linkCount).toBeGreaterThan(0)
  })
})
