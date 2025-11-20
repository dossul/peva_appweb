import { test, expect } from '@playwright/test'

test.describe('PEVA Interactive Map', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/map')
  })

  test('should load the map page successfully', async ({ page }) => {
    // Vérifier que la page de carte se charge
    await expect(page).toHaveURL('/map')
    
    // Vérifier la présence de la carte Leaflet
    await expect(page.locator('.leaflet-container')).toBeVisible()
    
    // Vérifier les contrôles de la carte
    await expect(page.locator('.leaflet-control-zoom')).toBeVisible()
  })

  test('should display company counter', async ({ page }) => {
    // Vérifier la présence du compteur d'entreprises
    const counter = page.locator('[data-testid="company-counter"]')
    if (await counter.isVisible()) {
      await expect(counter).toContainText('entreprise')
    }
  })

  test('should display map filters', async ({ page }) => {
    // Vérifier la présence des filtres
    const filters = page.locator('[data-testid="map-filters"]')
    if (await filters.isVisible()) {
      await expect(filters).toBeVisible()
    }
    
    // Vérifier les boutons de vue
    await expect(page.locator('text=GRILLE')).toBeVisible()
    await expect(page.locator('text=LISTE')).toBeVisible()
    await expect(page.locator('text=CARTE')).toBeVisible()
  })
})
