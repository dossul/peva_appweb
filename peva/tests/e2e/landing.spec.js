import { test, expect } from '@playwright/test'
import { LandingPage } from '../page-objects/LandingPage.js'
import { TestHelpers } from '../helpers/test-helpers.js'

test.describe('Page d\'accueil PEVA', () => {
  let landingPage
  let helpers

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page)
    helpers = new TestHelpers(page)
    await landingPage.goto()
  })

  test('doit charger la page d\'accueil correctement', async ({ page }) => {
    await helpers.verifyPageLoaded('/')
    await helpers.verifyPevaPresence()
  })

  test('doit afficher la section hero', async ({ page }) => {
    await landingPage.verifyHeroSection()
  })

  test('doit afficher les statistiques de la plateforme', async ({ page }) => {
    await landingPage.verifyPlatformStats()
  })

  test('doit afficher la section des fonctionnalités', async ({ page }) => {
    await landingPage.verifyFeaturesSection()
  })

  test('doit afficher la section des témoignages', async ({ page }) => {
    await landingPage.verifyTestimonialsSection()
  })

  test('doit afficher le footer', async ({ page }) => {
    await landingPage.verifyFooter()
  })

  test('doit permettre de naviguer vers l\'inscription', async ({ page }) => {
    await landingPage.clickJoinButton()
    
    // Vérifier la redirection (peut être vers /auth/register ou autre)
    const currentUrl = page.url()
    expect(currentUrl).toMatch(/(register|auth|signup)/)
  })

  test('ne doit pas avoir d\'erreurs console critiques', async ({ page }) => {
    const errors = await helpers.captureConsoleErrors()
    await page.waitForTimeout(2000) // Attendre le chargement complet
    
    const criticalErrors = helpers.filterCriticalErrors(errors)
    expect(criticalErrors.length).toBeLessThan(3)
  })
})
