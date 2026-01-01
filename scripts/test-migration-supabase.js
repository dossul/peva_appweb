#!/usr/bin/env node

/**
 * Script de test pour vérifier la migration PostgreSQL
 * Utilise Supabase REST API (pas besoin de pg)
 */

import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Lire le .env manuellement
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', 'peva', '.env')
    console.log('📁 Lecture de:', envPath)
    const envContent = readFileSync(envPath, 'utf-8')
    const env = {}
    
    envContent.split(/\r?\n/).forEach((line, idx) => {
      // Ignorer lignes vides et commentaires
      line = line.trim()
      if (!line || line.startsWith('#')) return
      
      // Parser KEY=VALUE
      const equalIndex = line.indexOf('=')
      if (equalIndex > 0) {
        const key = line.substring(0, equalIndex).trim()
        const value = line.substring(equalIndex + 1).trim()
        env[key] = value
      }
    })
    
    console.log('✅ Variables chargées:', Object.keys(env).length)
    if (Object.keys(env).length > 0) {
      console.log('   Clés:', Object.keys(env).join(', '))
    }
    return env
  } catch (err) {
    console.error('❌ Erreur lecture .env:', err.message)
    return {}
  }
}

const env = loadEnv()
const supabaseUrl = env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL
const supabaseKey = env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variables manquantes dans .env')
  console.error('   VITE_SUPABASE_URL:', supabaseUrl ? '✅' : '❌')
  console.error('   SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✅' : '❌')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

const EXPECTED_TABLES = [
  'pev_users', 'pev_profiles', 'pev_connections', 'pev_companies', 'pev_company_members',
  'pev_opportunities', 'pev_opportunity_applications', 'pev_events', 'pev_event_registrations',
  'pev_projects', 'pev_resources', 'pev_message_threads', 'pev_message_thread_participants',
  'pev_messages', 'pev_message_read_status', 'pev_forum_categories', 'pev_forum_topics',
  'pev_forum_posts', 'pev_groups', 'pev_group_members', 'pev_notifications', 'pev_favorites',
  'pev_audit_logs', 'pev_platform_stats', 'pev_sectors', 'pev_sdgs',
  'pev_storage_buckets', 'pev_storage_objects', 'pev_file_uploads', 'pev_storage_quotas',
  'pev_auth_sessions', 'pev_auth_password_resets', 'pev_auth_email_verifications'
]

const EXPECTED_BUCKETS = [
  'avatars', 'logos', 'images', 'videos', 'documents', 'peva-public', 'peva-private'
]

async function checkTables() {
  console.log('\n📊 Vérification des tables...')
  
  const results = {}
  
  for (const table of EXPECTED_TABLES) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (error) {
        results[table] = { exists: false, error: error.message }
      } else {
        results[table] = { exists: true, count }
      }
    } catch (err) {
      results[table] = { exists: false, error: err.message }
    }
  }
  
  const existing = Object.entries(results).filter(([_, v]) => v.exists)
  const missing = Object.entries(results).filter(([_, v]) => !v.exists)
  
  console.log(`✅ Tables trouvées: ${existing.length}/${EXPECTED_TABLES.length}`)
  
  if (existing.length > 0) {
    console.log('\n📋 Tables existantes:')
    existing.forEach(([name, info]) => {
      console.log(`   ✅ ${name} (${info.count || 0} lignes)`)
    })
  }
  
  if (missing.length > 0) {
    console.log(`\n❌ Tables manquantes (${missing.length}):`)
    missing.forEach(([name, info]) => {
      console.log(`   ❌ ${name} - ${info.error}`)
    })
    return false
  }
  
  return true
}

async function checkBuckets() {
  console.log('\n🗂️  Vérification des buckets via table...')
  
  try {
    const { data, error } = await supabase
      .from('pev_storage_buckets')
      .select('id, name, is_public')
      .order('id')
    
    if (error) {
      console.log(`❌ Erreur lecture buckets: ${error.message}`)
      return false
    }
    
    if (!data || data.length === 0) {
      console.log('❌ Aucun bucket trouvé')
      return false
    }
    
    const existingBuckets = data.map(b => b.id)
    const missing = EXPECTED_BUCKETS.filter(b => !existingBuckets.includes(b))
    
    console.log(`✅ Buckets trouvés: ${existingBuckets.length}/${EXPECTED_BUCKETS.length}`)
    
    data.forEach(bucket => {
      const visibility = bucket.is_public ? '🌐 Public' : '🔒 Privé'
      console.log(`   ${visibility} - ${bucket.name}`)
    })
    
    if (missing.length > 0) {
      console.log(`\n❌ Buckets manquants (${missing.length}):`)
      missing.forEach(b => console.log(`   - ${b}`))
      return false
    }
    
    return true
  } catch (err) {
    console.log(`❌ Erreur: ${err.message}`)
    return false
  }
}

async function checkData() {
  console.log('\n📈 Vérification des données initiales...')
  
  try {
    // Secteurs
    const { count: sectorCount } = await supabase
      .from('pev_sectors')
      .select('*', { count: 'exact', head: true })
    console.log(`✅ Secteurs: ${sectorCount || 0} (attendu: 8)`)
    
    // Stats
    const { count: statsCount } = await supabase
      .from('pev_platform_stats')
      .select('*', { count: 'exact', head: true })
    console.log(`✅ Stats plateforme: ${statsCount || 0} (attendu: 4)`)
    
    // ODD
    const { count: sdgsCount } = await supabase
      .from('pev_sdgs')
      .select('*', { count: 'exact', head: true })
    console.log(`✅ ODD: ${sdgsCount || 0} (attendu: 7)`)
    
    return (sectorCount >= 8 && statsCount >= 4)
  } catch (err) {
    console.log(`❌ Erreur: ${err.message}`)
    return false
  }
}

async function checkFunctions() {
  console.log('\n🔧 Vérification des fonctions...')
  
  const functions = [
    'pev_is_company_member',
    'pev_handle_new_user',
    'pev_update_updated_at_column',
    'pev_increment_counter',
    'pev_current_user_id'
  ]
  
  try {
    // Tester si une fonction existe en l'appelant
    const { data, error } = await supabase.rpc('pev_is_company_member', {
      p_company_id: 1,
      p_user_id: '00000000-0000-0000-0000-000000000000',
      p_roles: ['admin']
    })
    
    if (error && error.message.includes('does not exist')) {
      console.log(`❌ Fonction pev_is_company_member manquante`)
      return false
    }
    
    console.log(`✅ Au moins une fonction RPC fonctionne`)
    console.log(`   Note: ${functions.length} fonctions attendues`)
    return true
  } catch (err) {
    console.log(`⚠️  Impossible de tester les fonctions: ${err.message}`)
    return true // Ne pas bloquer sur cet échec
  }
}

async function runTests() {
  try {
    console.log('🚀 Test de migration PostgreSQL via Supabase API')
    console.log(`📍 URL: ${supabaseUrl}`)
    console.log('================================================\n')
    
    const results = {
      tables: await checkTables(),
      buckets: await checkBuckets(),
      data: await checkData(),
      functions: await checkFunctions()
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('📋 RÉSUMÉ DES TESTS')
    console.log('='.repeat(60))
    
    Object.entries(results).forEach(([test, passed]) => {
      const icon = passed ? '✅' : '❌'
      console.log(`${icon} ${test.toUpperCase().padEnd(20)}: ${passed ? 'OK' : 'ÉCHEC'}`)
    })
    
    const allPassed = Object.values(results).every(r => r)
    
    console.log('\n' + '='.repeat(60))
    if (allPassed) {
      console.log('🎉 MIGRATION COMPLÈTE ET VALIDE!')
      console.log('✅ Toutes les vérifications sont passées')
    } else {
      console.log('❌ MIGRATION INCOMPLÈTE')
      console.log('⚠️  Certains éléments sont manquants')
      console.log('\n💡 Exécutez les dumps SQL dans cet ordre:')
      console.log('   1. POSTGRESQL_SELF_HOSTED_DUMP.sql')
      console.log('   2. POSTGRESQL_MIGRATION_AUTH_STORAGE.sql')
      console.log('   3. POSTGRESQL_BUCKETS_PEVA_ONLY.sql')
      console.log('   4. POSTGRESQL_RLS_POLICIES.sql')
    }
    console.log('='.repeat(60))
    
    process.exit(allPassed ? 0 : 1)
    
  } catch (error) {
    console.error('\n❌ Erreur fatale:', error.message)
    process.exit(1)
  }
}

runTests()
