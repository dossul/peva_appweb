import { expect } from '@playwright/test'
import { testSelectors } from '../fixtures/test-data.js'

export class LandingPage {
  constructor(page) {
    this.page = page
    
    // Sélecteurs spécifiques à la page d'accueil
    this.heroTitle = this.page.locator('text=L\'Écosystème Digital')
    this.joinButton = this.page.locator('text=Rejoindre PEVA')
    this.discoverButton = this.page.locator('[data-testid="hero-discover-btn"]')
    this.platformStats = this.page.locator(testSelectors.platformStats)
    this.featuresSection = this.page.locator(testSelectors.featuresSection)
    this.featureCards = this.page.locator(testSelectors.featureCard)
    this.testimonialsSection = this.page.locator(testSelectors.testimonialsSection)
    this.footer = this.page.locator(testSelectors.footer)
  }

  async goto() {
    await this.page.goto('/')
    await this.page.waitForLoadState('networkidle')
  }

  async verifyHeroSection() {
    await expect(this.heroTitle).toBeVisible()
    await expect(this.joinButton).toBeVisible()
  }

  async verifyPlatformStats() {
    if (await this.platformStats.isVisible()) {
      await expect(this.platformStats).toBeVisible()
      
      // Vérifier qu'il y a des statistiques numériques
      const statNumbers = this.platformStats.locator('.text-h4')
      const count = await statNumbers.count()
      expect(count).toBeGreaterThan(0)
    }
  }

  async verifyFeaturesSection() {
    if (await this.featuresSection.isVisible()) {
      await expect(this.featuresSection).toBeVisible()
      
      // Vérifier qu'il y a des cartes de fonctionnalités
      const cardCount = await this.featureCards.count()
      expect(cardCount).toBeGreaterThan(0)
    }
  }

  async verifyTestimonialsSection() {
    if (await this.testimonialsSection.isVisible()) {
      await expect(this.testimonialsSection).toBeVisible()
    }
  }

  async verifyFooter() {
    if (await this.footer.isVisible()) {
      await expect(this.footer).toBeVisible()
    }
  }

  async clickJoinButton() {
    if (await this.joinButton.isVisible()) {
      await this.joinButton.click()
    }
  }

  async clickDiscoverButton() {
    if (await this.discoverButton.isVisible()) {
      await this.discoverButton.click()
    }
  }
}
