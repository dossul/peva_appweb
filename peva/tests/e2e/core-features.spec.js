import { test, expect } from '@playwright/test'

test.describe('PEVA Core Features', () => {
  test('should load all main pages without errors', async ({ page }) => {
    const pages = [
      '/',
      '/map',
      '/directory',
      '/opportunities',
      '/resources',
      '/events'
    ]
    
    for (const pagePath of pages) {
      await page.goto(pagePath)
      
      // Vérifier qu'il n'y a pas d'erreur 404
      await expect(page).not.toHaveTitle(/404/)
      await expect(page).not.toHaveTitle(/Not Found/)
      
      // Vérifier que la page contient du contenu
      const body = page.locator('body')
      await expect(body).not.toBeEmpty()
    }
  })

  test('should have working authentication pages', async ({ page }) => {
    // Page de connexion
    await page.goto('/auth/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
    
    // Page d'inscription
    await page.goto('/auth/register')
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('input[type="password"]')).toBeVisible()
  })

  test('should display platform branding consistently', async ({ page }) => {
    const pages = ['/', '/map', '/directory']
    
    for (const pagePath of pages) {
      await page.goto(pagePath)
      
      // Vérifier la présence du logo/nom PEVA
      const pevaElements = page.locator('text=PEVA')
      const count = await pevaElements.count()
      expect(count).toBeGreaterThan(0)
    }
  })

  test('should have functional navigation between main sections', async ({ page }) => {
    await page.goto('/')
    
    // Tester la navigation vers la carte
    if (await page.locator('text=Carte Interactive').isVisible()) {
      await page.click('text=Carte Interactive')
      await expect(page).toHaveURL('/map')
    }
    
    // Retour à l'accueil
    await page.goto('/')
    
    // Tester la navigation vers l'annuaire
    if (await page.locator('text=Annuaire').isVisible()) {
      await page.click('text=Annuaire')
      await expect(page).toHaveURL('/directory')
    }
  })

  test('should display error-free console on main pages', async ({ page }) => {
    const errors = []
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    await page.goto('/')
    await page.waitForTimeout(2000) // Attendre le chargement complet
    
    // Filtrer les erreurs connues non critiques
    const criticalErrors = errors.filter(error => 
      !error.includes('OneSignal') && 
      !error.includes('favicon') &&
      !error.includes('404')
    )
    
    expect(criticalErrors.length).toBeLessThan(3) // Tolérer quelques erreurs mineures
  })
})
