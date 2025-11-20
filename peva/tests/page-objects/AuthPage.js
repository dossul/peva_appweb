import { expect } from '@playwright/test'
import { testSelectors, testUsers } from '../fixtures/test-data.js'

export class AuthPage {
  constructor(page) {
    this.page = page
    
    // Sélecteurs d'authentification
    this.loginForm = this.page.locator(testSelectors.loginForm)
    this.registerForm = this.page.locator(testSelectors.registerForm)
    this.emailInput = this.page.locator(testSelectors.emailInput)
    this.passwordInput = this.page.locator(testSelectors.passwordInput)
    this.loginButton = this.page.locator('button:has-text("Se connecter")')
    this.registerButton = this.page.locator('button:has-text("S\'inscrire")')
    this.forgotPasswordLink = this.page.locator('text=Mot de passe oublié')
  }

  async gotoLogin() {
    await this.page.goto('/auth/login')
    await this.page.waitForLoadState('networkidle')
  }

  async gotoRegister() {
    await this.page.goto('/auth/register')
    await this.page.waitForLoadState('networkidle')
  }

  async gotoResetPassword() {
    await this.page.goto('/auth/reset-password')
    await this.page.waitForLoadState('networkidle')
  }

  async verifyLoginPage() {
    await expect(this.page).toHaveURL('/auth/login')
    
    if (await this.emailInput.isVisible()) {
      await expect(this.emailInput).toBeVisible()
    }
    
    if (await this.passwordInput.isVisible()) {
      await expect(this.passwordInput).toBeVisible()
    }
  }

  async verifyRegisterPage() {
    await expect(this.page).toHaveURL('/auth/register')
    
    if (await this.emailInput.isVisible()) {
      await expect(this.emailInput).toBeVisible()
    }
    
    if (await this.passwordInput.isVisible()) {
      await expect(this.passwordInput).toBeVisible()
    }
  }

  async fillLoginForm(userType = 'user') {
    const user = testUsers[userType]
    
    if (await this.emailInput.isVisible()) {
      await this.emailInput.fill(user.email)
    }
    
    if (await this.passwordInput.isVisible()) {
      await this.passwordInput.fill(user.password)
    }
  }

  async submitLogin() {
    if (await this.loginButton.isVisible()) {
      await this.loginButton.click()
      await this.page.waitForLoadState('networkidle')
    }
  }

  async login(userType = 'user') {
    await this.gotoLogin()
    await this.fillLoginForm(userType)
    await this.submitLogin()
  }

  async verifyLoginSuccess(userType = 'user') {
    const user = testUsers[userType]
    
    if (user.role === 'admin') {
      await expect(this.page).toHaveURL('/admin/dashboard')
    } else if (user.onboardingCompleted) {
      await expect(this.page).toHaveURL('/')
    } else {
      await expect(this.page).toHaveURL('/onboarding')
    }
  }

  async clickForgotPassword() {
    if (await this.forgotPasswordLink.isVisible()) {
      await this.forgotPasswordLink.click()
    }
  }
}
