#!/usr/bin/env node

/**
 * Script d'exploration complète de la base Supabase
 * Liste TOUTES les tables et leur contenu
 */

import { createClient } from '@supabase/supabase-js'

// Credentials fournis par l'utilisateur
const SUPABASE_URL = 'https://supabase.benga.live'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzUwNTUwNDAwLCJleHAiOjE5MDgzMTY4MDB9.v_Okk2VYUgZGcM6JZl-fndj-iXR_vWxtOOxDz4jyh1A'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Liste de toutes les tables potentielles
const ALL_POSSIBLE_TABLES = [
  // Sans préfixe
  'users', 'profiles', 'connections', 'companies', 'company_members',
  'opportunities', 'opportunity_applications', 'events', 'event_registrations',
  'projects', 'resources', 'message_threads', 'message_thread_participants',
  'messages', 'message_read_status', 'forum_categories', 'forum_topics',
  'forum_posts', 'groups', 'group_members', 'notifications', 'favorites',
  'audit_logs', 'platform_stats', 'sectors', 'sdgs',
  'storage_buckets', 'storage_objects', 'file_uploads', 'storage_quotas',
  'auth_sessions', 'auth_password_resets', 'auth_email_verifications',
  
  // Avec préfixe pev_
  'pev_users', 'pev_profiles', 'pev_connections', 'pev_companies', 'pev_company_members',
  'pev_opportunities', 'pev_opportunity_applications', 'pev_events', 'pev_event_registrations',
  'pev_projects', 'pev_resources', 'pev_message_threads', 'pev_message_thread_participants',
  'pev_messages', 'pev_message_read_status', 'pev_forum_categories', 'pev_forum_topics',
  'pev_forum_posts', 'pev_groups', 'pev_group_members', 'pev_notifications', 'pev_favorites',
  'pev_audit_logs', 'pev_platform_stats', 'pev_sectors', 'pev_sdgs',
  'pev_storage_buckets', 'pev_storage_objects', 'pev_file_uploads', 'pev_storage_quotas',
  'pev_auth_sessions', 'pev_auth_password_resets', 'pev_auth_email_verifications'
]

async function exploreTables() {
  console.log('🔍 EXPLORATION COMPLÈTE DE LA BASE SUPABASE')
  console.log('=' .repeat(70))
  console.log(`📍 URL: ${SUPABASE_URL}`)
  console.log('=' .repeat(70))
  console.log('')
  
  const foundTables = []
  const missingTables = []
  
  console.log('🔎 Recherche de toutes les tables...\n')
  
  for (const tableName of ALL_POSSIBLE_TABLES) {
    try {
      const { count, error, data } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: false })
        .limit(5)
      
      if (error) {
        if (!error.message.includes('does not exist') && 
            !error.message.includes('relation') &&
            !error.message.includes('not found')) {
          console.log(`⚠️  ${tableName.padEnd(35)} - Erreur: ${error.message.substring(0, 50)}`)
        }
        missingTables.push(tableName)
      } else {
        foundTables.push({ name: tableName, count, data })
        console.log(`✅ ${tableName.padEnd(35)} - ${count || 0} lignes`)
      }
    } catch (err) {
      missingTables.push(tableName)
    }
  }
  
  console.log('\n' + '='.repeat(70))
  console.log('📊 RÉSULTATS DE L\'EXPLORATION')
  console.log('='.repeat(70))
  console.log(`✅ Tables trouvées: ${foundTables.length}`)
  console.log(`❌ Tables absentes: ${missingTables.length}`)
  console.log('')
  
  if (foundTables.length === 0) {
    console.log('❌ AUCUNE TABLE TROUVÉE!')
    console.log('   La base est vide ou les permissions sont insuffisantes.')
    return
  }
  
  console.log('\n📋 DÉTAILS DES TABLES TROUVÉES:')
  console.log('='.repeat(70))
  
  for (const table of foundTables) {
    console.log(`\n📦 ${table.name}`)
    console.log(`   Nombre de lignes: ${table.count || 0}`)
    
    if (table.data && table.data.length > 0) {
      console.log(`   Colonnes: ${Object.keys(table.data[0]).join(', ')}`)
      
      // Afficher première ligne en exemple
      console.log(`   Premier enregistrement:`)
      const firstRow = table.data[0]
      Object.entries(firstRow).slice(0, 5).forEach(([key, value]) => {
        let displayValue = value
        if (typeof value === 'string' && value.length > 50) {
          displayValue = value.substring(0, 47) + '...'
        } else if (typeof value === 'object') {
          displayValue = JSON.stringify(value).substring(0, 47) + '...'
        }
        console.log(`      ${key}: ${displayValue}`)
      })
      
      if (Object.keys(firstRow).length > 5) {
        console.log(`      ... et ${Object.keys(firstRow).length - 5} autres colonnes`)
      }
    }
  }
  
  // Statistiques par catégorie
  console.log('\n' + '='.repeat(70))
  console.log('📈 STATISTIQUES PAR CATÉGORIE')
  console.log('='.repeat(70))
  
  const categories = {
    'Utilisateurs & Profils': foundTables.filter(t => 
      t.name.includes('user') || t.name.includes('profile') || t.name.includes('connection')
    ),
    'Entreprises': foundTables.filter(t => 
      t.name.includes('compan')
    ),
    'Opportunités': foundTables.filter(t => 
      t.name.includes('opportunit')
    ),
    'Événements': foundTables.filter(t => 
      t.name.includes('event')
    ),
    'Messages & Forum': foundTables.filter(t => 
      t.name.includes('message') || t.name.includes('forum')
    ),
    'Groupes': foundTables.filter(t => 
      t.name.includes('group')
    ),
    'Storage': foundTables.filter(t => 
      t.name.includes('storage') || t.name.includes('file') || t.name.includes('bucket')
    ),
    'Auth': foundTables.filter(t => 
      t.name.includes('auth') || t.name.includes('session')
    ),
    'Système': foundTables.filter(t => 
      t.name.includes('audit') || t.name.includes('notification') || t.name.includes('stat')
    ),
    'Référentiels': foundTables.filter(t => 
      t.name.includes('sector') || t.name.includes('sdg')
    )
  }
  
  Object.entries(categories).forEach(([category, tables]) => {
    if (tables.length > 0) {
      const totalRows = tables.reduce((sum, t) => sum + (t.count || 0), 0)
      console.log(`\n${category}:`)
      console.log(`  ${tables.length} tables, ${totalRows} lignes au total`)
      tables.forEach(t => {
        console.log(`    - ${t.name} (${t.count || 0} lignes)`)
      })
    }
  })
  
  // Vérifier si préfixe pev_ ou pas
  console.log('\n' + '='.repeat(70))
  console.log('🔍 ANALYSE DES PRÉFIXES')
  console.log('='.repeat(70))
  
  const withPrefix = foundTables.filter(t => t.name.startsWith('pev_'))
  const withoutPrefix = foundTables.filter(t => !t.name.startsWith('pev_'))
  
  console.log(`Tables avec préfixe pev_: ${withPrefix.length}`)
  console.log(`Tables sans préfixe: ${withoutPrefix.length}`)
  
  if (withPrefix.length > 0) {
    console.log('\n✅ Migration PostgreSQL déjà effectuée (tables avec préfixe pev_)')
  } else if (withoutPrefix.length > 0) {
    console.log('\n⚠️  Tables sans préfixe - Migration non effectuée ou ancienne structure')
  }
  
  console.log('\n' + '='.repeat(70))
  console.log('✨ EXPLORATION TERMINÉE')
  console.log('='.repeat(70))
}

exploreTables().catch(err => {
  console.error('\n❌ ERREUR FATALE:', err.message)
  console.error(err.stack)
  process.exit(1)
})
