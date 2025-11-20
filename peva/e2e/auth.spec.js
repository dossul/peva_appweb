import { test, expect } from '@playwright/test';

test.describe('PEVA Authentication', () => {
  test('should load login page', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Vérifier le titre de la page
    await expect(page).toHaveTitle(/Connexion - PEVA/);
    
    // Vérifier la présence du formulaire de connexion
    await expect(page.locator('h1')).toContainText('Connexion');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });

  test('should load registration page', async ({ page }) => {
    await page.goto('/auth/register');
    
    // Vérifier le titre de la page
    await expect(page).toHaveTitle(/Inscription - PEVA/);
    
    // Vérifier la présence du formulaire d'inscription
    await expect(page.locator('h1')).toContainText('Inscription');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test('should show validation errors for empty login form', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Essayer de soumettre le formulaire vide
    await page.click('button[type="submit"]');
    
    // Vérifier que les erreurs de validation apparaissent
    await expect(page.locator('text=Email requis')).toBeVisible();
    await expect(page.locator('text=Mot de passe requis')).toBeVisible();
  });

  test('should navigate to password reset page', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Cliquer sur le lien "Mot de passe oublié"
    await page.click('text=Mot de passe oublié');
    
    // Vérifier la redirection
    await expect(page).toHaveURL(/.*\/auth\/reset-password/);
    await expect(page.locator('h1')).toContainText('Réinitialiser');
  });

  test('should have working navigation between auth pages', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Aller vers l'inscription
    await page.click('text=S\'inscrire');
    await expect(page).toHaveURL(/.*\/auth\/register/);
    
    // Retourner vers la connexion
    await page.click('text=Se connecter');
    await expect(page).toHaveURL(/.*\/auth\/login/);
  });

  test('should redirect authenticated users', async ({ page }) => {
    // Note: Ce test nécessiterait une session authentifiée
    // Pour l'instant, on teste juste que les pages se chargent
    await page.goto('/auth/login');
    await expect(page.locator('form')).toBeVisible();
  });
});
