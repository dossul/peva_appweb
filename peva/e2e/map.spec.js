import { test, expect } from '@playwright/test';
import { waitForPageLoad, navigateToPage, verifyPageLoaded, waitForElement } from './test-helpers.js';

test.describe('PEVA Interactive Map', () => {
  test('should load the map page successfully', async ({ page }) => {
    await navigateToPage(page, '/map', 'Carte Interactive PEVA');
    
    // Vérifier la présence des boutons de navigation
    await waitForElement(page, 'text=GRILLE');
    await waitForElement(page, 'text=LISTE');
    await waitForElement(page, 'text=CARTE');
  });

  test('should display map filters', async ({ page }) => {
    await navigateToPage(page, '/map');
    
    // Vérifier la présence de la sidebar de filtres avec data-testid
    await waitForElement(page, '[data-testid="map-filters"]');
    
    // Vérifier les filtres spécifiques
    await waitForElement(page, 'text=Secteur d\'activité');
    await waitForElement(page, 'text=Pays');
    await waitForElement(page, 'text=Taille d\'entreprise');
  });

  test('should have working navigation buttons', async ({ page }) => {
    await navigateToPage(page, '/map');
    
    // Tester le bouton GRILLE
    await waitForElement(page, 'text=GRILLE');
    await page.click('text=GRILLE');
    await verifyPageLoaded(page, '/directory', 'Annuaire PEVA');
    
    // Retourner à la carte
    await navigateToPage(page, '/map');
    
    // Tester le bouton LISTE
    await waitForElement(page, 'text=LISTE');
    await page.click('text=LISTE');
    await verifyPageLoaded(page, '/directory', 'Annuaire PEVA');
  });

  test('should display company counter', async ({ page }) => {
    await navigateToPage(page, '/map');
    
    // Vérifier la présence du compteur d'entreprises avec data-testid
    await waitForElement(page, '[data-testid="company-counter"]');
  });

  test('should have fullscreen functionality', async ({ page }) => {
    await page.goto('/map');
    
    // Vérifier la présence du bouton plein écran
    await expect(page.locator('text=Plein écran')).toBeVisible();
    
    // Note: Tester le plein écran nécessiterait des permissions spéciales
  });

  test('should reset filters', async ({ page }) => {
    await page.goto('/map');
    
    // Cliquer sur le bouton de réinitialisation des filtres
    await page.click('text=Réinitialiser');
    
    // Vérifier que les filtres sont remis à zéro
    // (Les sélecteurs devraient être vides ou à leur valeur par défaut)
  });

  test('should be responsive', async ({ page }) => {
    await page.goto('/map');
    
    // Tester sur mobile
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Vérifier que les éléments principaux sont toujours visibles
    await expect(page.locator('h1')).toBeVisible();
    
    // Sur mobile, le texte des boutons devrait être masqué
    await expect(page.locator('.d-sm-none')).toBeVisible();
  });

  test('should load map container', async ({ page }) => {
    await page.goto('/map');
    
    // Attendre que la carte se charge
    await page.waitForTimeout(2000);
    
    // Vérifier la présence du conteneur de carte
    await expect(page.locator('.map-container')).toBeVisible();
  });
});
