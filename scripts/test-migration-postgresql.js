#!/usr/bin/env node

/**
 * Script de test pour vérifier la migration PostgreSQL complète
 * Vérifie que toutes les tables, buckets, RLS, policies existent
 */

const { Client } = require('pg')

// Configuration - À adapter selon votre .env
const config = {
  host: process.env.PG_HOST || 'localhost',
  port: process.env.PG_PORT || 5432,
  database: process.env.PG_DATABASE || 'peva_greenhub',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD
}

const client = new Client(config)

const EXPECTED_TABLES = [
  // Tables principales (30)
  'pev_users', 'pev_profiles', 'pev_connections', 'pev_companies', 'pev_company_members',
  'pev_opportunities', 'pev_opportunity_applications', 'pev_events', 'pev_event_registrations',
  'pev_projects', 'pev_resources', 'pev_message_threads', 'pev_message_thread_participants',
  'pev_messages', 'pev_message_read_status', 'pev_forum_categories', 'pev_forum_topics',
  'pev_forum_posts', 'pev_groups', 'pev_group_members', 'pev_notifications', 'pev_favorites',
  'pev_audit_logs', 'pev_platform_stats', 'pev_sectors', 'pev_sdgs',
  
  // Storage & Auth (7)
  'pev_storage_buckets', 'pev_storage_objects', 'pev_file_uploads', 'pev_storage_quotas',
  'pev_auth_sessions', 'pev_auth_password_resets', 'pev_auth_email_verifications'
]

const EXPECTED_ENUMS = [
  'pev_user_role_global', 'pev_company_role', 'pev_opportunity_type', 'pev_content_status',
  'pev_connection_status', 'pev_event_type', 'pev_group_type', 'pev_group_member_role'
]

const EXPECTED_BUCKETS = [
  'avatars', 'logos', 'images', 'videos', 'documents', 'peva-public', 'pev-private'
]

const EXPECTED_RLS_TABLES = [
  'pev_profiles', 'pev_companies', 'pev_company_members', 
  'pev_messages', 'pev_opportunity_applications', 'pev_storage_objects'
]

const EXPECTED_TRIGGERS = [
  'pev_on_user_created', 'pev_profiles_updated_at', 'pev_companies_updated_at',
  'pev_opportunities_updated_at', 'pev_events_updated_at', 'pev_projects_updated_at'
]

const EXPECTED_FUNCTIONS = [
  'pev_is_company_member', 'pev_handle_new_user', 'pev_update_updated_at_column',
  'pev_increment_counter', 'pev_current_user_id'
]

async function checkTables() {
  console.log('\n📊 Vérification des tables...')
  
  const result = await client.query(`
    SELECT tablename 
    FROM pg_tables 
    WHERE schemaname = 'public' 
    AND tablename LIKE 'pev_%'
    ORDER BY tablename
  `)
  
  const existingTables = result.rows.map(r => r.tablename)
  const missing = EXPECTED_TABLES.filter(t => !existingTables.includes(t))
  
  console.log(`✅ Tables trouvées: ${existingTables.length}/${EXPECTED_TABLES.length}`)
  
  if (missing.length > 0) {
    console.log(`❌ Tables manquantes (${missing.length}):`)
    missing.forEach(t => console.log(`   - ${t}`))
    return false
  }
  
  return true
}

async function checkEnums() {
  console.log('\n📝 Vérification des ENUMs...')
  
  const result = await client.query(`
    SELECT t.typname
    FROM pg_type t
    JOIN pg_namespace n ON t.typnamespace = n.oid
    WHERE n.nspname = 'public'
    AND t.typname LIKE 'pev_%'
    AND t.typtype = 'e'
    ORDER BY t.typname
  `)
  
  const existingEnums = result.rows.map(r => r.typname)
  const missing = EXPECTED_ENUMS.filter(e => !existingEnums.includes(e))
  
  console.log(`✅ ENUMs trouvés: ${existingEnums.length}/${EXPECTED_ENUMS.length}`)
  
  if (missing.length > 0) {
    console.log(`❌ ENUMs manquants (${missing.length}):`)
    missing.forEach(e => console.log(`   - ${e}`))
    return false
  }
  
  return true
}

async function checkBuckets() {
  console.log('\n🗂️  Vérification des buckets...')
  
  const result = await client.query(`
    SELECT id, name, is_public 
    FROM pev_storage_buckets 
    ORDER BY id
  `)
  
  const existingBuckets = result.rows.map(r => r.id)
  const missing = EXPECTED_BUCKETS.filter(b => !existingBuckets.includes(b))
  
  console.log(`✅ Buckets trouvés: ${existingBuckets.length}/${EXPECTED_BUCKETS.length}`)
  
  if (missing.length > 0) {
    console.log(`❌ Buckets manquants (${missing.length}):`)
    missing.forEach(b => console.log(`   - ${b}`))
    return false
  }
  
  // Afficher détails
  result.rows.forEach(bucket => {
    const visibility = bucket.is_public ? '🌐 Public' : '🔒 Privé'
    console.log(`   ${visibility} - ${bucket.name}`)
  })
  
  return true
}

async function checkRLS() {
  console.log('\n🔒 Vérification RLS (Row Level Security)...')
  
  const result = await client.query(`
    SELECT c.relname
    FROM pg_class c
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE n.nspname = 'public'
    AND c.relname LIKE 'pev_%'
    AND c.relrowsecurity = true
    ORDER BY c.relname
  `)
  
  const tablesWithRLS = result.rows.map(r => r.relname)
  const missing = EXPECTED_RLS_TABLES.filter(t => !tablesWithRLS.includes(t))
  
  console.log(`✅ Tables avec RLS: ${tablesWithRLS.length}/${EXPECTED_RLS_TABLES.length}`)
  
  if (missing.length > 0) {
    console.log(`❌ RLS manquant sur (${missing.length}):`)
    missing.forEach(t => console.log(`   - ${t}`))
    return false
  }
  
  return true
}

async function checkPolicies() {
  console.log('\n🛡️  Vérification des Policies...')
  
  const result = await client.query(`
    SELECT COUNT(*) as count
    FROM pg_policies
    WHERE tablename LIKE 'pev_%'
  `)
  
  const policyCount = parseInt(result.rows[0].count)
  const expected = 18 // 7 tables + 11 storage
  
  console.log(`✅ Policies trouvées: ${policyCount}`)
  
  if (policyCount < expected) {
    console.log(`⚠️  Moins de policies que prévu (attendu: ~${expected})`)
    return false
  }
  
  return true
}

async function checkTriggers() {
  console.log('\n⚡ Vérification des Triggers...')
  
  const result = await client.query(`
    SELECT tgname
    FROM pg_trigger
    WHERE tgname LIKE 'pev_%'
    AND NOT tgisinternal
    ORDER BY tgname
  `)
  
  const existingTriggers = result.rows.map(r => r.tgname)
  const missing = EXPECTED_TRIGGERS.filter(t => !existingTriggers.includes(t))
  
  console.log(`✅ Triggers trouvés: ${existingTriggers.length}/${EXPECTED_TRIGGERS.length}`)
  
  if (missing.length > 0) {
    console.log(`❌ Triggers manquants (${missing.length}):`)
    missing.forEach(t => console.log(`   - ${t}`))
    return false
  }
  
  return true
}

async function checkFunctions() {
  console.log('\n🔧 Vérification des Fonctions...')
  
  const result = await client.query(`
    SELECT proname
    FROM pg_proc
    JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid
    WHERE pg_namespace.nspname = 'public'
    AND proname LIKE 'pev_%'
    ORDER BY proname
  `)
  
  const existingFunctions = result.rows.map(r => r.proname)
  const missing = EXPECTED_FUNCTIONS.filter(f => !existingFunctions.includes(f))
  
  console.log(`✅ Fonctions trouvées: ${existingFunctions.length}/${EXPECTED_FUNCTIONS.length}`)
  
  if (missing.length > 0) {
    console.log(`❌ Fonctions manquantes (${missing.length}):`)
    missing.forEach(f => console.log(`   - ${f}`))
    return false
  }
  
  return true
}

async function checkData() {
  console.log('\n📈 Vérification des données initiales...')
  
  // Vérifier secteurs
  const sectors = await client.query('SELECT COUNT(*) FROM pev_sectors')
  console.log(`✅ Secteurs: ${sectors.rows[0].count} (attendu: 8)`)
  
  // Vérifier stats
  const stats = await client.query('SELECT COUNT(*) FROM pev_platform_stats')
  console.log(`✅ Stats plateforme: ${stats.rows[0].count} (attendu: 4)`)
  
  // Vérifier ODD
  const sdgs = await client.query('SELECT COUNT(*) FROM pev_sdgs')
  console.log(`✅ ODD: ${sdgs.rows[0].count} (attendu: 7)`)
  
  return sectors.rows[0].count >= 8 && stats.rows[0].count >= 4
}

async function runTests() {
  try {
    console.log('🚀 Démarrage des tests de migration PostgreSQL...')
    console.log(`📍 Connexion: ${config.host}:${config.port}/${config.database}`)
    
    await client.connect()
    console.log('✅ Connexion établie\n')
    
    const results = {
      tables: await checkTables(),
      enums: await checkEnums(),
      buckets: await checkBuckets(),
      rls: await checkRLS(),
      policies: await checkPolicies(),
      triggers: await checkTriggers(),
      functions: await checkFunctions(),
      data: await checkData()
    }
    
    console.log('\n' + '='.repeat(50))
    console.log('📋 RÉSUMÉ DES TESTS')
    console.log('='.repeat(50))
    
    Object.entries(results).forEach(([test, passed]) => {
      const icon = passed ? '✅' : '❌'
      console.log(`${icon} ${test.toUpperCase()}: ${passed ? 'OK' : 'ÉCHEC'}`)
    })
    
    const allPassed = Object.values(results).every(r => r)
    
    console.log('\n' + '='.repeat(50))
    if (allPassed) {
      console.log('🎉 MIGRATION COMPLÈTE ET VALIDE!')
      console.log('✅ Toutes les vérifications sont passées')
    } else {
      console.log('❌ MIGRATION INCOMPLÈTE')
      console.log('⚠️  Certains éléments sont manquants')
      console.log('\n💡 Vérifiez les dumps suivants:')
      console.log('   1. POSTGRESQL_SELF_HOSTED_DUMP.sql')
      console.log('   2. POSTGRESQL_MIGRATION_AUTH_STORAGE.sql')
      console.log('   3. POSTGRESQL_BUCKETS_PEVA_ONLY.sql')
      console.log('   4. POSTGRESQL_RLS_POLICIES.sql')
    }
    console.log('='.repeat(50))
    
    process.exit(allPassed ? 0 : 1)
    
  } catch (error) {
    console.error('\n❌ Erreur lors des tests:', error.message)
    console.error(error.stack)
    process.exit(1)
  } finally {
    await client.end()
  }
}

runTests()
