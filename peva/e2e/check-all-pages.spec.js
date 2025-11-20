import { test, expect } from '@playwright/test';
import { waitForPageLoad, navigateToPage } from './test-helpers.js';

// Liste de toutes les pages à vérifier
const pagesToCheck = [
  { path: '/', name: 'Page d\'accueil' },
  { path: '/map', name: 'Carte Interactive' },
  { path: '/directory', name: 'Annuaire PEVA' },
  { path: '/opportunities', name: 'Opportunités' },
  { path: '/events', name: 'Événements' },
  { path: '/resources', name: 'Ressources' },
  { path: '/auth/login', name: 'Connexion' },
  { path: '/auth/register', name: 'Inscription' },
  { path: '/auth/reset-password', name: 'Mot de passe oublié' },
];

test.describe('Vérification de toutes les pages PEVA', () => {
  
  test('Toutes les pages se chargent sans erreur critique', async ({ page }) => {
    // Tracker les erreurs console
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Filtrer les erreurs non critiques
        if (!text.includes('OneSignal') && 
            !text.includes('favicon') && 
            !text.includes('404') &&
            !text.includes('vite-plugin-vue-inspector')) {
          errors.push({ page: page.url(), error: text });
        }
      }
    });

    // Vérifier chaque page
    for (const pageInfo of pagesToCheck) {
      console.log(`🔍 Vérification de ${pageInfo.name} (${pageInfo.path})`);
      
      try {
        await navigateToPage(page, pageInfo.path);
        
        // Vérifier qu'il n'y a pas d'erreur 404
        const title = await page.title();
        expect(title).not.toContain('404');
        
        // Vérifier que la page contient du contenu
        const body = await page.locator('body').textContent();
        expect(body.length).toBeGreaterThan(100);
        
        // Vérifier qu'il y a un h1
        const h1Count = await page.locator('h1').count();
        expect(h1Count).toBeGreaterThan(0);
        
        console.log(`✅ ${pageInfo.name} - OK`);
        
      } catch (error) {
        console.error(`❌ ${pageInfo.name} - Erreur:`, error.message);
        throw new Error(`Erreur sur ${pageInfo.name}: ${error.message}`);
      }
      
      // Attendre un peu entre les pages
      await page.waitForTimeout(500);
    }
    
    // Vérifier qu'il n'y a pas d'erreurs critiques
    if (errors.length > 0) {
      console.error('Erreurs critiques détectées:', errors);
      throw new Error(`${errors.length} erreurs critiques détectées dans la console`);
    }
    
    console.log('🎉 Toutes les pages ont été vérifiées avec succès !');
  });

  test('Navigation entre les pages principales fonctionne', async ({ page }) => {
    await navigateToPage(page, '/');
    
    // Tester la navigation via le menu
    const menuItems = [
      { menu: 'Découvrir', item: 'Carte Interactive', expectedUrl: '/map' },
      { menu: 'Découvrir', item: 'Annuaire PEVA', expectedUrl: '/directory' },
      { menu: 'Découvrir', item: 'Place de Marché', expectedUrl: '/opportunities' },
      { menu: 'Découvrir', item: 'Événements', expectedUrl: '/events' },
      { menu: 'Découvrir', item: 'Ressources & Connaissances', expectedUrl: '/resources' }
    ];
    
    for (const nav of menuItems) {
      console.log(`🔗 Test navigation: ${nav.menu} → ${nav.item}`);
      
      try {
        // Retourner à l'accueil
        await navigateToPage(page, '/');
        
        // Naviguer via le menu
        await page.hover(`text=${nav.menu}`);
        await page.getByRole('menuitem', { name: nav.item }).click();
        await waitForPageLoad(page);
        
        // Vérifier l'URL
        await expect(page).toHaveURL(new RegExp(nav.expectedUrl));
        
        console.log(`✅ Navigation vers ${nav.item} - OK`);
        
      } catch (error) {
        console.error(`❌ Navigation vers ${nav.item} - Erreur:`, error.message);
        throw new Error(`Erreur de navigation vers ${nav.item}: ${error.message}`);
      }
    }
    
    console.log('🎉 Toutes les navigations fonctionnent correctement !');
  });

  test('Vérification des éléments critiques sur chaque page', async ({ page }) => {
    const criticalElements = [
      { 
        path: '/', 
        elements: ['[data-testid="platform-stats"]', '[data-testid="hero-discover-btn"]'] 
      },
      { 
        path: '/map', 
        elements: ['[data-testid="company-counter"]', '[data-testid="map-filters"]'] 
      },
      { 
        path: '/directory', 
        elements: ['[data-testid="directory-filters"]', 'h1'] 
      },
      { 
        path: '/auth/login', 
        elements: ['[data-testid="login-title"]', '[data-testid="email-input"]'] 
      }
    ];
    
    for (const pageCheck of criticalElements) {
      console.log(`🔍 Vérification des éléments critiques sur ${pageCheck.path}`);
      
      await navigateToPage(page, pageCheck.path);
      
      for (const selector of pageCheck.elements) {
        try {
          await expect(page.locator(selector)).toBeVisible({ timeout: 10000 });
          console.log(`✅ Élément ${selector} trouvé`);
        } catch (error) {
          console.error(`❌ Élément ${selector} manquant sur ${pageCheck.path}`);
          throw new Error(`Élément critique manquant: ${selector} sur ${pageCheck.path}`);
        }
      }
    }
    
    console.log('🎉 Tous les éléments critiques sont présents !');
  });
});
