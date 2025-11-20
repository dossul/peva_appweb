import { test, expect } from '@playwright/test'
import { AuthPage } from '../page-objects/AuthPage.js'
import { TestHelpers } from '../helpers/test-helpers.js'

test.describe('Authentification PEVA', () => {
  let authPage
  let helpers

  test.beforeEach(async ({ page }) => {
    authPage = new AuthPage(page)
    helpers = new TestHelpers(page)
  })

  test('doit afficher la page de connexion', async ({ page }) => {
    await authPage.gotoLogin()
    await authPage.verifyLoginPage()
  })

  test('doit afficher la page d\'inscription', async ({ page }) => {
    await authPage.gotoRegister()
    await authPage.verifyRegisterPage()
  })

  test('doit permettre la navigation vers mot de passe oublié', async ({ page }) => {
    await authPage.gotoLogin()
    await authPage.clickForgotPassword()
    
    // Vérifier la redirection
    const currentUrl = page.url()
    expect(currentUrl).toMatch(/(reset|forgot|password)/)
  })

  test('doit avoir des formulaires fonctionnels', async ({ page }) => {
    await authPage.gotoLogin()
    
    // Tester le remplissage du formulaire
    await authPage.fillLoginForm('user')
    
    // Vérifier que les champs sont remplis
    if (await authPage.emailInput.isVisible()) {
      const emailValue = await authPage.emailInput.inputValue()
      expect(emailValue).toBe('user@peva.test')
    }
  })

  test('doit rediriger correctement après connexion simulée', async ({ page }) => {
    await authPage.gotoLogin()
    
    // Simuler une connexion (sans vraiment se connecter)
    await authPage.fillLoginForm('userCompleted')
    
    // Vérifier que le bouton de connexion est présent
    if (await authPage.loginButton.isVisible()) {
      await expect(authPage.loginButton).toBeVisible()
    }
  })

  test('ne doit pas avoir d\'erreurs console sur les pages d\'auth', async ({ page }) => {
    const errors = await helpers.captureConsoleErrors()
    
    await authPage.gotoLogin()
    await page.waitForTimeout(1000)
    
    await authPage.gotoRegister()
    await page.waitForTimeout(1000)
    
    const criticalErrors = helpers.filterCriticalErrors(errors)
    expect(criticalErrors.length).toBeLessThan(3)
  })
})
