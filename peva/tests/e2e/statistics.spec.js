import { test, expect } from '@playwright/test'

test.describe('PEVA Platform Statistics', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display platform statistics section', async ({ page }) => {
    // Vérifier la présence de la section des statistiques
    const statsSection = page.locator('[data-testid="platform-stats"]')
    await expect(statsSection).toBeVisible()
    
    // Vérifier qu'il y a des statistiques affichées
    const statNumbers = statsSection.locator('.text-h4')
    const count = await statNumbers.count()
    expect(count).toBeGreaterThan(0)
  })

  test('should display numerical values in statistics', async ({ page }) => {
    const statsSection = page.locator('[data-testid="platform-stats"]')
    await expect(statsSection).toBeVisible()
    
    // Vérifier que les statistiques contiennent des nombres
    const statNumbers = statsSection.locator('.text-h4')
    const firstStat = statNumbers.first()
    
    if (await firstStat.isVisible()) {
      const text = await firstStat.textContent()
      // Vérifier qu'il y a au moins un chiffre dans le texte
      expect(text).toMatch(/\d+/)
    }
  })

  test('should have proper labels for statistics', async ({ page }) => {
    const statsSection = page.locator('[data-testid="platform-stats"]')
    await expect(statsSection).toBeVisible()
    
    // Vérifier la présence de labels
    const labels = statsSection.locator('.text-body-2')
    const labelCount = await labels.count()
    expect(labelCount).toBeGreaterThan(0)
  })
})
