import { test, expect } from '@playwright/test'

test.describe('PEVA Responsive Design', () => {
  test('should display content properly on mobile', async ({ page }) => {
    // Simuler un écran mobile
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Vérifier que la page se charge correctement
    await expect(page.locator('text=L\'Écosystème Digital')).toBeVisible()
    await expect(page.locator('text=Rejoindre PEVA')).toBeVisible()
  })

  test('should display content properly on tablet', async ({ page }) => {
    // Simuler un écran tablet
    await page.setViewportSize({ width: 768, height: 1024 })
    await page.goto('/')
    
    // Vérifier que la page se charge correctement
    await expect(page.locator('text=L\'Écosystème Digital')).toBeVisible()
    await expect(page.locator('[data-testid="platform-stats"]')).toBeVisible()
  })

  test('should display content properly on desktop', async ({ page }) => {
    // Simuler un écran desktop
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.goto('/')
    
    // Vérifier que tous les éléments sont visibles
    await expect(page.locator('text=L\'Écosystème Digital')).toBeVisible()
    await expect(page.locator('[data-testid="platform-stats"]')).toBeVisible()
    await expect(page.locator('[data-testid="features-section"]')).toBeVisible()
  })
})
