#!/usr/bin/env node

/**
 * Script pour restaurer (réactiver) l'instance Supabase via API
 */

const https = require('https')

const PROJECT_REF = 'vvmahjuwrswdnaugsmcz'
const ACCESS_TOKEN = process.env.SUPABASE_ACCESS_TOKEN || 'sbp_f8ea2a65f7f2dadd56d99d2b325af0b517a2e8a2'

async function restoreProject() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.supabase.com',
      port: 443,
      path: `/v1/projects/${PROJECT_REF}/restore`,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    }

    console.log('🔄 Tentative de restauration du projet Supabase...')
    console.log(`📍 Projet: ${PROJECT_REF}`)

    const req = https.request(options, (res) => {
      let data = ''

      res.on('data', (chunk) => {
        data += chunk
      })

      res.on('end', () => {
        console.log(`📊 Status: ${res.statusCode}`)
        
        if (res.statusCode === 200 || res.statusCode === 201) {
          console.log('✅ Projet Supabase restauré avec succès!')
          console.log('⏳ Attendre 2-3 minutes pour que l\'instance soit complètement active')
          try {
            const response = JSON.parse(data)
            console.log('📦 Réponse:', JSON.stringify(response, null, 2))
          } catch (e) {
            console.log('📦 Réponse:', data)
          }
          resolve(data)
        } else if (res.statusCode === 401) {
          console.error('❌ Erreur d\'authentification')
          console.error('💡 Le SERVICE_ROLE_KEY n\'a peut-être pas les permissions nécessaires')
          console.error('💡 Utilisez plutôt le dashboard: https://supabase.com/dashboard/project/' + PROJECT_REF)
          reject(new Error('Authentification échouée'))
        } else if (res.statusCode === 404) {
          console.error('❌ Projet non trouvé ou endpoint invalide')
          console.error('💡 Vérifiez le PROJECT_REF:', PROJECT_REF)
          reject(new Error('Projet non trouvé'))
        } else {
          console.error(`❌ Erreur: ${res.statusCode}`)
          console.error('📦 Réponse:', data)
          console.error('💡 Utilisez le dashboard: https://supabase.com/dashboard/project/' + PROJECT_REF)
          reject(new Error(`Status ${res.statusCode}`))
        }
      })
    })

    req.on('error', (error) => {
      console.error('❌ Erreur réseau:', error.message)
      reject(error)
    })

    req.end()
  })
}

// Exécution
restoreProject()
  .then(() => {
    console.log('\n🎉 Restauration terminée!')
    console.log('🧪 Testez maintenant: node scripts/supabase-keep-alive.js')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n💡 SOLUTION ALTERNATIVE:')
    console.error('   1. Allez sur: https://supabase.com/dashboard/project/' + PROJECT_REF)
    console.error('   2. Cliquez sur le bouton "Resume" ou "Restore"')
    console.error('   3. Attendez 2-3 minutes')
    process.exit(1)
  })
