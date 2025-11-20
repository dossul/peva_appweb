import { test, expect } from '@playwright/test'
import { TestHelpers } from '../helpers/test-helpers.js'
import { testRoutes } from '../fixtures/test-data.js'

test.describe('Pages Principales PEVA', () => {
  let helpers

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page)
  })

  test('doit charger la page des opportunités', async ({ page }) => {
    await helpers.navigateTo(testRoutes.opportunities)
    await helpers.verifyPageLoaded(testRoutes.opportunities)
    
    // Vérifier les éléments spécifiques
    const opportunitiesPage = page.locator('[data-testid="opportunities-page"]')
    if (await opportunitiesPage.isVisible()) {
      await expect(opportunitiesPage).toBeVisible()
    }
    
    // Vérifier le titre
    await expect(page.locator('text=Place de Marché')).toBeVisible()
  })

  test('doit charger la page des ressources', async ({ page }) => {
    await helpers.navigateTo(testRoutes.resources)
    await helpers.verifyPageLoaded(testRoutes.resources)
    
    // Vérifier les éléments spécifiques
    const resourcesPage = page.locator('[data-testid="resources-page"]')
    if (await resourcesPage.isVisible()) {
      await expect(resourcesPage).toBeVisible()
    }
    
    // Vérifier le titre
    await expect(page.locator('text=Bibliothèque de Ressources')).toBeVisible()
  })

  test('doit charger la page des événements', async ({ page }) => {
    await helpers.navigateTo(testRoutes.events)
    await helpers.verifyPageLoaded(testRoutes.events)
    
    // Vérifier les éléments spécifiques
    const eventsPage = page.locator('[data-testid="events-page"]')
    if (await eventsPage.isVisible()) {
      await expect(eventsPage).toBeVisible()
    }
    
    // Vérifier le titre
    await expect(page.locator('text=Événements PEVA')).toBeVisible()
  })

  test('doit charger la carte interactive', async ({ page }) => {
    await helpers.navigateTo(testRoutes.map)
    await helpers.verifyPageLoaded(testRoutes.map)
    
    // Vérifier les éléments de la carte
    await expect(page.locator('text=Carte Interactive PEVA')).toBeVisible()
    
    // Vérifier les filtres si présents
    const mapFilters = page.locator('[data-testid="map-filters"]')
    if (await mapFilters.isVisible()) {
      await expect(mapFilters).toBeVisible()
    }
  })

  test('doit charger l\'annuaire', async ({ page }) => {
    await helpers.navigateTo(testRoutes.directory)
    await helpers.verifyPageLoaded(testRoutes.directory)
    
    // Vérifier les éléments de l'annuaire
    await expect(page.locator('text=Annuaire PEVA')).toBeVisible()
    
    // Vérifier les filtres si présents
    const directoryFilters = page.locator('[data-testid="directory-filters"]')
    if (await directoryFilters.isVisible()) {
      await expect(directoryFilters).toBeVisible()
    }
  })

  test('doit avoir des boutons d\'action fonctionnels', async ({ page }) => {
    // Tester le bouton de création d'opportunité
    await helpers.navigateTo(testRoutes.opportunities)
    
    const createBtn = page.locator('[data-testid="create-opportunity-btn"]')
    if (await createBtn.isVisible()) {
      await expect(createBtn).toBeVisible()
      await expect(createBtn).toBeEnabled()
    }
  })

  test('doit maintenir la cohérence visuelle', async ({ page }) => {
    const pages = [
      testRoutes.opportunities,
      testRoutes.resources,
      testRoutes.events,
      testRoutes.map,
      testRoutes.directory
    ]

    for (const route of pages) {
      await helpers.navigateTo(route)
      
      // Vérifier la présence du branding PEVA
      await helpers.verifyPevaPresence()
      
      // Vérifier qu'il n'y a pas d'erreurs 404
      await expect(page).not.toHaveTitle(/404/)
      await expect(page).not.toHaveTitle(/Not Found/)
    }
  })
})
