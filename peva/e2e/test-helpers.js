// Helpers communs pour les tests E2E PEVA
import { expect } from '@playwright/test';

/**
 * Attendre que la page soit complètement chargée
 */
export async function waitForPageLoad(page, timeout = 15000) {
  await page.waitForLoadState('networkidle', { timeout });
  // Attendre que les éléments critiques soient présents
  await page.waitForSelector('body', { timeout });
}

/**
 * Navigation sécurisée vers une page
 */
export async function navigateToPage(page, url, expectedTitle = null) {
  await page.goto(url);
  await waitForPageLoad(page);
  
  if (expectedTitle) {
    await expect(page.locator('h1')).toContainText(expectedTitle, { timeout: 10000 });
  }
}

/**
 * Navigation via menu déroulant
 */
export async function navigateViaMenu(page, menuText, itemText) {
  await waitForPageLoad(page);
  await page.hover(`text=${menuText}`, { timeout: 10000 });
  await page.getByRole('menuitem', { name: itemText }).click({ timeout: 10000 });
  await waitForPageLoad(page);
}

/**
 * Remplir un formulaire de façon robuste
 */
export async function fillFormField(page, selector, value) {
  await page.waitForSelector(selector, { timeout: 10000 });
  await page.fill(selector, value);
  // Vérifier que la valeur a été saisie
  await expect(page.locator(selector)).toHaveValue(value);
}

/**
 * Cliquer sur un élément de façon robuste
 */
export async function clickElement(page, selector) {
  await page.waitForSelector(selector, { timeout: 10000 });
  await page.click(selector);
}

/**
 * Vérifier qu'une page est chargée correctement
 */
export async function verifyPageLoaded(page, url, title) {
  await expect(page).toHaveURL(new RegExp(url), { timeout: 15000 });
  if (title) {
    await expect(page.locator('h1')).toContainText(title, { timeout: 10000 });
  }
}

/**
 * Attendre qu'un élément soit visible
 */
export async function waitForElement(page, selector, timeout = 10000) {
  await page.waitForSelector(selector, { state: 'visible', timeout });
}

/**
 * Vérifier l'absence d'erreurs critiques dans la console
 */
export function setupConsoleErrorTracking(page) {
  const errors = [];
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      const text = msg.text();
      // Ignorer les erreurs non critiques connues
      if (!text.includes('OneSignal') && 
          !text.includes('favicon') && 
          !text.includes('404')) {
        errors.push(text);
      }
    }
  });
  
  return errors;
}
