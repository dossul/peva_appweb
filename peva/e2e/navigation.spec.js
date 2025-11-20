import { test, expect } from '@playwright/test';

test.describe('PEVA Navigation', () => {
  test('should navigate to directory page', async ({ page }) => {
    await page.goto('/');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Naviguer vers l'annuaire via le menu
    await page.hover('text=Découvrir');
    await page.getByRole('menuitem', { name: 'Annuaire PEVA' }).click();
    
    // Vérifier la redirection
    await expect(page).toHaveURL(/.*\/directory/);
    await expect(page.locator('h1')).toContainText('Annuaire PEVA');
  });

  test('should navigate to opportunities page', async ({ page }) => {
    await page.goto('/');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Naviguer vers les opportunités
    await page.hover('text=Découvrir');
    await page.getByRole('menuitem', { name: 'Place de Marché' }).click();
    
    // Vérifier la redirection
    await expect(page).toHaveURL(/.*\/opportunities/);
    await expect(page.locator('h1')).toContainText('Place de Marché');
  });

  test('should navigate to events page', async ({ page }) => {
    await page.goto('/');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Naviguer vers les événements
    await page.hover('text=Découvrir');
    await page.getByRole('menuitem', { name: 'Événements' }).click();
    
    // Vérifier la redirection
    await expect(page).toHaveURL(/.*\/events/);
    await expect(page.locator('h1')).toContainText('Événements');
  });

  test('should navigate to map page', async ({ page }) => {
    await page.goto('/');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Naviguer vers la carte
    await page.hover('text=Découvrir');
    await page.getByRole('menuitem', { name: 'Carte Interactive' }).click();
    
    // Vérifier la redirection
    await expect(page).toHaveURL(/.*\/map/);
    await expect(page.locator('h1')).toContainText('Carte Interactive');
  });

  test('should navigate to resources page', async ({ page }) => {
    await page.goto('/');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Naviguer vers les ressources
    await page.hover('text=Découvrir');
    await page.getByRole('menuitem', { name: 'Ressources & Connaissances' }).click();
    
    // Vérifier la redirection
    await expect(page).toHaveURL(/.*\/resources/);
    await expect(page.locator('h1')).toContainText('Bibliothèque de Ressources');
  });

  test('should handle companies redirect to directory', async ({ page }) => {
    // Tester la redirection /companies -> /directory
    await page.goto('/companies');
    
    // Vérifier que l'URL est redirigée vers /directory
    await expect(page).toHaveURL(/.*\/directory/);
    await expect(page.locator('h1')).toContainText('Annuaire PEVA');
  });

  test('should have working breadcrumb navigation', async ({ page }) => {
    await page.goto('/directory');
    
    // Attendre que la page soit chargée
    await page.waitForLoadState('networkidle');
    
    // Vérifier que le header est visible et fonctionnel
    await expect(page.locator('[data-test="logo"]')).toBeVisible();
    
    // Cliquer sur le logo pour retourner à l'accueil
    await page.click('[data-test="logo"]');
    await expect(page).toHaveURL('/');
  });

  test('should handle 404 pages correctly', async ({ page }) => {
    // Tester une page qui n'existe pas
    await page.goto('/page-inexistante');
    
    // Devrait rediriger vers la page d'accueil
    await expect(page).toHaveURL('/');
  });
});
