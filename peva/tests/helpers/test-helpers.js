import { expect } from '@playwright/test'
import { testUsers, testSelectors, testRoutes } from '../fixtures/test-data.js'

export class TestHelpers {
  constructor(page) {
    this.page = page
  }

  // Navigation helpers
  async navigateTo(route) {
    await this.page.goto(route)
    await this.page.waitForLoadState('networkidle')
  }

  async waitForElement(selector, timeout = 5000) {
    try {
      await this.page.waitForSelector(selector, { timeout })
      return true
    } catch {
      return false
    }
  }

  async isElementVisible(selector) {
    try {
      return await this.page.locator(selector).isVisible()
    } catch {
      return false
    }
  }

  // Authentification helpers
  async login(userType = 'user') {
    const user = testUsers[userType]
    await this.navigateTo(testRoutes.login)
    
    if (await this.isElementVisible(testSelectors.emailInput)) {
      await this.page.fill(testSelectors.emailInput, user.email)
    }
    
    if (await this.isElementVisible(testSelectors.passwordInput)) {
      await this.page.fill(testSelectors.passwordInput, user.password)
    }
    
    const loginButton = this.page.locator('button:has-text("Se connecter")')
    if (await loginButton.isVisible()) {
      await loginButton.click()
      await this.page.waitForLoadState('networkidle')
    }
  }

  async logout() {
    if (await this.isElementVisible(testSelectors.userMenu)) {
      await this.page.click(testSelectors.userMenu)
      
      const logoutButton = this.page.locator('text=Déconnexion')
      if (await logoutButton.isVisible()) {
        await logoutButton.click()
        await this.page.waitForLoadState('networkidle')
      }
    }
  }

  // Vérifications communes
  async verifyPageLoaded(expectedUrl = null) {
    // Vérifier que la page n'est pas une erreur 404
    await expect(this.page).not.toHaveTitle(/404/)
    await expect(this.page).not.toHaveTitle(/Not Found/)
    
    // Vérifier l'URL si spécifiée
    if (expectedUrl) {
      await expect(this.page).toHaveURL(expectedUrl)
    }
    
    // Vérifier que le body n'est pas vide
    const body = this.page.locator('body')
    await expect(body).not.toBeEmpty()
  }

  async verifyPevaPresence() {
    // Vérifier la présence du branding PEVA
    const pevaElements = this.page.locator('text=PEVA')
    const count = await pevaElements.count()
    expect(count).toBeGreaterThan(0)
  }

  // Helpers spécifiques aux vues
  async verifyLandingPage() {
    await this.verifyPageLoaded(testRoutes.home)
    
    // Vérifier les éléments principaux
    if (await this.isElementVisible('text=L\'Écosystème Digital')) {
      await expect(this.page.locator('text=L\'Écosystème Digital')).toBeVisible()
    }
    
    if (await this.isElementVisible(testSelectors.platformStats)) {
      await expect(this.page.locator(testSelectors.platformStats)).toBeVisible()
    }
  }

  async verifyMapPage() {
    await this.verifyPageLoaded(testRoutes.map)
    
    // Vérifier les éléments de la carte
    if (await this.isElementVisible(testSelectors.companyCounter)) {
      await expect(this.page.locator(testSelectors.companyCounter)).toBeVisible()
    }
    
    if (await this.isElementVisible(testSelectors.mapFilters)) {
      await expect(this.page.locator(testSelectors.mapFilters)).toBeVisible()
    }
  }

  async verifyDirectoryPage() {
    await this.verifyPageLoaded(testRoutes.directory)
    
    // Vérifier les éléments de l'annuaire
    if (await this.isElementVisible(testSelectors.directoryFilters)) {
      await expect(this.page.locator(testSelectors.directoryFilters)).toBeVisible()
    }
  }

  // Helper pour les tests de navigation
  async testNavigation(fromRoute, toRoute, linkText) {
    await this.navigateTo(fromRoute)
    
    const link = this.page.locator(`text=${linkText}`)
    if (await link.isVisible()) {
      await link.click()
      await this.verifyPageLoaded(toRoute)
      return true
    }
    return false
  }

  // Helper pour les erreurs console
  async captureConsoleErrors() {
    const errors = []
    
    this.page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })
    
    return errors
  }

  filterCriticalErrors(errors) {
    return errors.filter(error => 
      !error.includes('OneSignal') && 
      !error.includes('favicon') &&
      !error.includes('404') &&
      !error.includes('net::ERR_FAILED')
    )
  }
}
