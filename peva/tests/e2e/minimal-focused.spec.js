import { test, expect } from '@playwright/test'

test.describe('Tests Minimalistes PEVA - Exactement ce qui existe', () => {
  
  test('Page d\'accueil se charge', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=PEVA')).toBeVisible()
  })

  test('Page de connexion se charge', async ({ page }) => {
    await page.goto('/auth/login')
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

  test('Page d\'inscription se charge', async ({ page }) => {
    await page.goto('/auth/register')  
    await expect(page.locator('input[type="email"]')).toBeVisible()
  })

  test('Carte interactive se charge', async ({ page }) => {
    await page.goto('/map')
    await expect(page.locator('text=Carte')).toBeVisible()
  })

  test('Annuaire se charge', async ({ page }) => {
    await page.goto('/directory')
    await expect(page.locator('text=Annuaire')).toBeVisible()
  })

  test('Redirection /companies vers /directory', async ({ page }) => {
    await page.goto('/companies')
    expect(page.url()).toContain('/directory')
  })

  test('Opportunités se charge', async ({ page }) => {
    await page.goto('/opportunities')
    await expect(page.locator('text=Opportunités')).toBeVisible()
  })

  test('Ressources se charge', async ({ page }) => {
    await page.goto('/resources')
    await expect(page.locator('text=Ressources')).toBeVisible()
  })

  test('Événements se charge', async ({ page }) => {
    await page.goto('/events')
    await expect(page.locator('text=Événements')).toBeVisible()
  })
})
