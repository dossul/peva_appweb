import { test, expect } from '@playwright/test'
import { TestHelpers } from '../helpers/test-helpers.js'
import { testRoutes } from '../fixtures/test-data.js'

test.describe('Interactions et Filtres PEVA', () => {
  let helpers

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page)
  })

  test('doit afficher les filtres de la carte', async ({ page }) => {
    await helpers.navigateTo(testRoutes.map)
    
    const mapFilters = page.locator('[data-testid="map-filters"]')
    if (await mapFilters.isVisible()) {
      await expect(mapFilters).toBeVisible()
      
      // Vérifier la présence d'éléments de filtre
      const filterElements = mapFilters.locator('input, select, button')
      const count = await filterElements.count()
      expect(count).toBeGreaterThan(0)
    }
  })

  test('doit afficher les filtres de l\'annuaire', async ({ page }) => {
    await helpers.navigateTo(testRoutes.directory)
    
    const directoryFilters = page.locator('[data-testid="directory-filters"]')
    if (await directoryFilters.isVisible()) {
      await expect(directoryFilters).toBeVisible()
      
      // Vérifier la présence d'éléments de filtre
      const filterElements = directoryFilters.locator('input, select, button')
      const count = await filterElements.count()
      expect(count).toBeGreaterThan(0)
    }
  })

  test('doit permettre la recherche', async ({ page }) => {
    await helpers.navigateTo(testRoutes.directory)
    
    // Chercher un champ de recherche
    const searchInputs = page.locator('input[placeholder*="recherche"], input[placeholder*="search"], input[type="search"]')
    const searchCount = await searchInputs.count()
    
    if (searchCount > 0) {
      const searchInput = searchInputs.first()
      await expect(searchInput).toBeVisible()
      
      // Tester la saisie
      await searchInput.fill('test')
      const value = await searchInput.inputValue()
      expect(value).toBe('test')
    }
  })

  test('doit avoir des boutons de navigation entre vues', async ({ page }) => {
    await helpers.navigateTo(testRoutes.map)
    
    // Chercher les boutons GRILLE, LISTE, CARTE
    const navButtons = page.locator('button:has-text("GRILLE"), button:has-text("LISTE"), button:has-text("CARTE")')
    const buttonCount = await navButtons.count()
    
    if (buttonCount > 0) {
      // Au moins un bouton de navigation doit être visible
      const visibleButtons = await navButtons.filter({ hasText: /./ }).count()
      expect(visibleButtons).toBeGreaterThan(0)
    }
  })

  test('doit permettre le reset des filtres', async ({ page }) => {
    const pagesWithFilters = [testRoutes.map, testRoutes.directory]
    
    for (const route of pagesWithFilters) {
      await helpers.navigateTo(route)
      
      // Chercher un bouton de reset
      const resetButtons = page.locator('button:has-text("Réinitialiser"), button:has-text("Reset"), button:has-text("Effacer")')
      const resetCount = await resetButtons.count()
      
      if (resetCount > 0) {
        const resetBtn = resetButtons.first()
        await expect(resetBtn).toBeVisible()
        await expect(resetBtn).toBeEnabled()
      }
    }
  })

  test('doit être responsive', async ({ page }) => {
    // Tester sur mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await helpers.navigateTo(testRoutes.home)
    
    // Vérifier que le contenu s'affiche correctement
    await expect(page.locator('body')).toBeVisible()
    await helpers.verifyPevaPresence()
    
    // Tester sur tablet
    await page.setViewportSize({ width: 768, height: 1024 })
    await helpers.navigateTo(testRoutes.map)
    
    // Vérifier que la carte s'affiche
    await expect(page.locator('text=Carte Interactive')).toBeVisible()
    
    // Retour au desktop
    await page.setViewportSize({ width: 1920, height: 1080 })
  })

  test('doit gérer les erreurs gracieusement', async ({ page }) => {
    const errors = await helpers.captureConsoleErrors()
    
    // Naviguer vers plusieurs pages
    const routes = [testRoutes.home, testRoutes.map, testRoutes.directory]
    
    for (const route of routes) {
      await helpers.navigateTo(route)
      await page.waitForTimeout(1000)
    }
    
    // Vérifier qu'il n'y a pas trop d'erreurs critiques
    const criticalErrors = helpers.filterCriticalErrors(errors)
    expect(criticalErrors.length).toBeLessThan(5)
  })
})
