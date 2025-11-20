import { chromium } from '@playwright/test'

async function globalSetup() {
  console.log('🚀 Configuration globale des tests PEVA...')
  
  const browser = await chromium.launch()
  const page = await browser.newPage()
  
  try {
    // Vérifier que le serveur de développement répond
    console.log('📡 Vérification du serveur de développement...')
    await page.goto('http://localhost:5173', { 
      waitUntil: 'networkidle',
      timeout: 30000 
    })
    
    // Vérifier que la page d'accueil se charge
    const title = await page.title()
    if (!title || title.includes('404')) {
      throw new Error('La page d\'accueil ne se charge pas correctement')
    }
    
    console.log('✅ Serveur de développement opérationnel')
    
    // Vérifier les pages critiques
    const criticalPages = [
      '/auth/login',
      '/auth/register', 
      '/map',
      '/directory'
    ]
    
    for (const route of criticalPages) {
      try {
        await page.goto(`http://localhost:5173${route}`, { 
          waitUntil: 'networkidle',
          timeout: 10000 
        })
        console.log(`✅ Page ${route} accessible`)
      } catch (error) {
        console.warn(`⚠️ Page ${route} non accessible: ${error.message}`)
      }
    }
    
    // Nettoyer les erreurs console connues
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text()
        if (!text.includes('OneSignal') && 
            !text.includes('favicon') && 
            !text.includes('404')) {
          console.warn(`Console error: ${text}`)
        }
      }
    })
    
    console.log('🎯 Configuration globale terminée avec succès')
    
  } catch (error) {
    console.error('❌ Erreur lors de la configuration globale:', error)
    throw error
  } finally {
    await browser.close()
  }
}

export default globalSetup
