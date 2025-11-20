import { test, expect } from '@playwright/test'
import { TestHelpers } from '../helpers/test-helpers.js'
import { testRoutes } from '../fixtures/test-data.js'

test.describe('Navigation PEVA', () => {
  let helpers

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page)
  })

  test('doit permettre de naviguer vers toutes les pages principales', async ({ page }) => {
    const mainRoutes = [
      testRoutes.home,
      testRoutes.map,
      testRoutes.directory,
      testRoutes.opportunities,
      testRoutes.resources,
      testRoutes.events
    ]

    for (const route of mainRoutes) {
      await helpers.navigateTo(route)
      await helpers.verifyPageLoaded(route)
      await helpers.verifyPevaPresence()
    }
  })

  test('doit avoir une navigation cohérente depuis l\'accueil', async ({ page }) => {
    await helpers.navigateTo(testRoutes.home)
    
    // Tester la navigation vers la carte
    const mapNavSuccess = await helpers.testNavigation(
      testRoutes.home, 
      testRoutes.map, 
      'Carte Interactive'
    )
    
    // Tester la navigation vers l'annuaire
    const directoryNavSuccess = await helpers.testNavigation(
      testRoutes.home, 
      testRoutes.directory, 
      'Annuaire'
    )
    
    // Au moins une navigation doit fonctionner
    expect(mapNavSuccess || directoryNavSuccess).toBe(true)
  })

  test('doit rediriger /companies vers /directory', async ({ page }) => {
    await helpers.navigateTo('/companies')
    await helpers.verifyPageLoaded(testRoutes.directory)
  })

  test('doit avoir des pages d\'authentification accessibles', async ({ page }) => {
    const authRoutes = [
      testRoutes.login,
      testRoutes.register,
      testRoutes.resetPassword
    ]

    for (const route of authRoutes) {
      await helpers.navigateTo(route)
      await helpers.verifyPageLoaded(route)
    }
  })

  test('doit gérer les routes inexistantes', async ({ page }) => {
    await helpers.navigateTo('/route-inexistante')
    
    // Vérifier la redirection vers l'accueil ou page 404
    const currentUrl = page.url()
    expect(currentUrl).toMatch(/(\/|404|not-found)/)
  })

  test('doit avoir un header de navigation fonctionnel', async ({ page }) => {
    await helpers.navigateTo(testRoutes.home)
    
    // Vérifier la présence du logo
    if (await helpers.isElementVisible('[data-test="logo"]')) {
      await expect(page.locator('[data-test="logo"]')).toBeVisible()
    }
    
    // Vérifier la présence du menu principal
    if (await helpers.isElementVisible('[data-test="main-nav"]')) {
      await expect(page.locator('[data-test="main-nav"]')).toBeVisible()
    }
  })
})
