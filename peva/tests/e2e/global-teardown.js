/**
 * Nettoyage global après tous les tests E2E PEVA
 * Exécuté une seule fois après tous les tests
 */

import { chromium } from '@playwright/test'

async function globalTeardown() {
  console.log('🧹 Nettoyage après les tests E2E PEVA...')
  
  const browser = await chromium.launch()
  const context = await browser.newContext()
  const page = await context.newPage()
  
  try {
    // Nettoyer les données de test si nécessaire
    await cleanupTestData(page)
    
    // Générer un rapport de synthèse
    await generateTestSummary()
    
    console.log('✅ Nettoyage terminé')
    
  } catch (error) {
    console.error('❌ Erreur lors du nettoyage:', error)
  } finally {
    await browser.close()
  }
}

/**
 * Nettoyer les données de test
 */
async function cleanupTestData(page) {
  console.log('🗑️  Nettoyage des données de test...')
  
  try {
    // Se connecter en tant qu'admin pour nettoyer
    await page.goto('/login')
    await page.fill('input[name="email"]', 'admin@peva.test')
    await page.fill('input[name="password"]', 'AdminPassword123!')
    await page.click('button:has-text("Se connecter")')
    
    if (page.url().includes('/admin')) {
      // Nettoyer les opportunités de test
      await cleanupTestOpportunities(page)
      
      // Nettoyer les ressources de test
      await cleanupTestResources(page)
      
      // Nettoyer les événements de test
      await cleanupTestEvents(page)
      
      console.log('✅ Données de test nettoyées')
    }
    
  } catch (error) {
    console.warn('⚠️  Erreur nettoyage données:', error.message)
  }
}

/**
 * Nettoyer les opportunités de test
 */
async function cleanupTestOpportunities(page) {
  try {
    await page.goto('/admin/dashboard')
    await page.click('text=Opportunités')
    
    // Supprimer les opportunités contenant "Test" dans le titre
    const testOpportunities = page.locator('[data-test="opportunity-row"]:has-text("Test")')
    const count = await testOpportunities.count()
    
    for (let i = 0; i < count; i++) {
      try {
        await testOpportunities.nth(0).locator('button[title="Supprimer"]').click()
        await page.click('button:has-text("Supprimer")')
        await page.waitForTimeout(500)
      } catch (error) {
        // Ignorer les erreurs de suppression
      }
    }
    
    console.log(`🗑️  ${count} opportunités de test supprimées`)
    
  } catch (error) {
    console.warn('⚠️  Erreur nettoyage opportunités:', error.message)
  }
}

/**
 * Nettoyer les ressources de test
 */
async function cleanupTestResources(page) {
  try {
    await page.goto('/admin/dashboard')
    await page.click('text=Ressources')
    
    // Supprimer les ressources contenant "Test" dans le titre
    const testResources = page.locator('[data-test="resource-row"]:has-text("Test")')
    const count = await testResources.count()
    
    for (let i = 0; i < count; i++) {
      try {
        await testResources.nth(0).locator('button[title="Supprimer"]').click()
        await page.click('button:has-text("Supprimer")')
        await page.waitForTimeout(500)
      } catch (error) {
        // Ignorer les erreurs de suppression
      }
    }
    
    console.log(`🗑️  ${count} ressources de test supprimées`)
    
  } catch (error) {
    console.warn('⚠️  Erreur nettoyage ressources:', error.message)
  }
}

/**
 * Nettoyer les événements de test
 */
async function cleanupTestEvents(page) {
  try {
    await page.goto('/admin/dashboard')
    await page.click('text=Événements')
    
    // Supprimer les événements contenant "Test" dans le titre
    const testEvents = page.locator('[data-test="event-row"]:has-text("Test")')
    const count = await testEvents.count()
    
    for (let i = 0; i < count; i++) {
      try {
        await testEvents.nth(0).locator('button[title="Supprimer"]').click()
        await page.click('button:has-text("Supprimer")')
        await page.waitForTimeout(500)
      } catch (error) {
        // Ignorer les erreurs de suppression
      }
    }
    
    console.log(`🗑️  ${count} événements de test supprimés`)
    
  } catch (error) {
    console.warn('⚠️  Erreur nettoyage événements:', error.message)
  }
}

/**
 * Générer un rapport de synthèse
 */
async function generateTestSummary() {
  console.log('📊 Génération du rapport de synthèse...')
  
  try {
    const fs = require('fs')
    const path = require('path')
    
    // Lire les résultats des tests
    const resultsPath = path.join(process.cwd(), 'test-results', 'results.json')
    
    if (fs.existsSync(resultsPath)) {
      const results = JSON.parse(fs.readFileSync(resultsPath, 'utf8'))
      
      const summary = {
        timestamp: new Date().toISOString(),
        total: results.stats?.total || 0,
        passed: results.stats?.passed || 0,
        failed: results.stats?.failed || 0,
        skipped: results.stats?.skipped || 0,
        duration: results.stats?.duration || 0,
        suites: results.suites?.map(suite => ({
          title: suite.title,
          tests: suite.tests?.length || 0,
          passed: suite.tests?.filter(t => t.outcome === 'passed').length || 0,
          failed: suite.tests?.filter(t => t.outcome === 'failed').length || 0
        })) || []
      }
      
      // Sauvegarder le résumé
      const summaryPath = path.join(process.cwd(), 'test-results', 'summary.json')
      fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2))
      
      // Afficher le résumé dans la console
      console.log('\n📋 RÉSUMÉ DES TESTS E2E PEVA')
      console.log('=====================================')
      console.log(`📅 Date: ${new Date(summary.timestamp).toLocaleString('fr-FR')}`)
      console.log(`⏱️  Durée: ${Math.round(summary.duration / 1000)}s`)
      console.log(`📊 Total: ${summary.total} tests`)
      console.log(`✅ Réussis: ${summary.passed}`)
      console.log(`❌ Échoués: ${summary.failed}`)
      console.log(`⏭️  Ignorés: ${summary.skipped}`)
      console.log(`📈 Taux de réussite: ${Math.round((summary.passed / summary.total) * 100)}%`)
      
      if (summary.suites.length > 0) {
        console.log('\n📁 DÉTAIL PAR SUITE:')
        summary.suites.forEach(suite => {
          console.log(`  ${suite.title}: ${suite.passed}/${suite.tests} réussis`)
        })
      }
      
      console.log('=====================================\n')
      
    } else {
      console.warn('⚠️  Fichier de résultats non trouvé')
    }
    
  } catch (error) {
    console.warn('⚠️  Erreur génération rapport:', error.message)
  }
}

export default globalTeardown
