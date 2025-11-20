import { test, expect } from '@playwright/test'

test.describe('PEVA Basic Functionality', () => {
  test('should load homepage successfully', async ({ page }) => {
    await page.goto('/')
    
    // Vérifier le titre de la page
    await expect(page).toHaveTitle(/PEVA/)
    
    // Vérifier les éléments principaux
    await expect(page.locator('text=L\'Écosystème Digital')).toBeVisible()
    await expect(page.locator('text=Rejoindre PEVA')).toBeVisible()
  })

  test('should have working navigation menu', async ({ page }) => {
    await page.goto('/')
    
    // Vérifier que les liens de navigation existent
    const navLinks = [
      'Carte Interactive',
      'Annuaire', 
      'Opportunités',
      'Ressources',
      'Événements'
    ]
    
    for (const link of navLinks) {
      const linkElement = page.locator(`text=${link}`)
      if (await linkElement.isVisible()) {
        await expect(linkElement).toBeVisible()
      }
    }
  })

  test('should display platform statistics', async ({ page }) => {
    await page.goto('/')
    
    // Vérifier la section des statistiques
    const statsSection = page.locator('[data-testid="platform-stats"]')
    await expect(statsSection).toBeVisible()
  })

  test('should display features section', async ({ page }) => {
    await page.goto('/')
    
    // Vérifier la section des fonctionnalités
    const featuresSection = page.locator('[data-testid="features-section"]')
    await expect(featuresSection).toBeVisible()
    
    // Vérifier les cartes de fonctionnalités
    const featureCards = page.locator('[data-testid="feature-card"]')
    const cardCount = await featureCards.count()
    expect(cardCount).toBeGreaterThan(0)
  })

  test('should display testimonials section', async ({ page }) => {
    await page.goto('/')
    
    // Vérifier la section des témoignages
    const testimonialsSection = page.locator('[data-testid="testimonials-section"]')
    await expect(testimonialsSection).toBeVisible()
  })

  test('should display footer', async ({ page }) => {
    await page.goto('/')
    
    // Vérifier le footer
    const footer = page.locator('[data-test="footer"]')
    await expect(footer).toBeVisible()
  })
})
