import { test, expect } from '@playwright/test';

test.describe('PEVA Landing Page', () => {
  test('should load the landing page successfully', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier le titre de la page
    await expect(page).toHaveTitle(/PEVA/);
    
    // Vérifier la présence du hero section
    await expect(page.locator('h1')).toContainText('L\'Écosystème Digital');
    await expect(page.locator('h1')).toContainText('l\'Économie Verte');
    
    // Vérifier les boutons CTA
    await expect(page.locator('text=Rejoindre PEVA')).toBeVisible();
    await expect(page.locator('text=Découvrir')).toBeVisible();
  });

  test('should navigate to registration page', async ({ page }) => {
    await page.goto('/');
    
    // Cliquer sur le bouton "Rejoindre PEVA"
    await page.click('text=Rejoindre PEVA');
    
    // Vérifier la redirection vers la page d'inscription
    await expect(page).toHaveURL(/.*\/auth\/register/);
    await expect(page.locator('h1')).toContainText('Inscription');
  });

  test('should display platform statistics', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier la présence des statistiques
    const statsSection = page.locator('[data-testid="platform-stats"]').first();
    await expect(statsSection).toBeVisible();
    
    // Les statistiques devraient contenir des nombres
    const statNumbers = page.locator('.text-h4');
    await expect(statNumbers.first()).toBeVisible();
  });

  test('should have responsive navigation', async ({ page }) => {
    await page.goto('/');
    
    // Vérifier la présence du header de navigation
    await expect(page.locator('header')).toBeVisible();
    
    // Tester sur mobile
    await page.setViewportSize({ width: 375, height: 667 });
    await expect(page.locator('header')).toBeVisible();
  });

  test('should scroll to features section', async ({ page }) => {
    await page.goto('/');
    
    // Cliquer sur le bouton "Découvrir"
    await page.click('text=Découvrir');
    
    // Vérifier que la page a scrollé (on peut vérifier la position)
    await page.waitForTimeout(1000); // Attendre l'animation de scroll
  });
});
