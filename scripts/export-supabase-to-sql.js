#!/usr/bin/env node

/**
 * Export complet Supabase → SQL Dump
 * Génère un fichier SQL avec toutes les tables, données, et structure
 * 
 * Usage: node scripts/export-supabase-to-sql.js [options]
 * Options:
 *   --output=fichier.sql    Nom du fichier de sortie (défaut: supabase-export-YYYYMMDD-HHMMSS.sql)
 *   --schema-only           Exporter uniquement la structure (pas les données)
 *   --data-only             Exporter uniquement les données (pas la structure)
 *   --tables=table1,table2  Exporter uniquement ces tables
 */

import { createClient } from '@supabase/supabase-js'
import { writeFileSync } from 'fs'
import { join } from 'path'

// Configuration depuis .env
const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://supabase.benga.live'
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzUwNTUwNDAwLCJleHAiOjE5MDgzMTY4MDB9.v_Okk2VYUgZGcM6JZl-fndj-iXR_vWxtOOxDz4jyh1A'

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// Parser les arguments
const args = process.argv.slice(2)
const options = {
  output: null,
  schemaOnly: args.includes('--schema-only'),
  dataOnly: args.includes('--data-only'),
  tables: null
}

args.forEach(arg => {
  if (arg.startsWith('--output=')) {
    options.output = arg.split('=')[1]
  }
  if (arg.startsWith('--tables=')) {
    options.tables = arg.split('=')[1].split(',')
  }
})

// Nom du fichier par défaut
if (!options.output) {
  const date = new Date()
  const timestamp = date.toISOString().replace(/[:.]/g, '-').slice(0, -5)
  options.output = `supabase-export-${timestamp}.sql`
}

const outputPath = join(process.cwd(), 'docs', options.output)

/**
 * Découvrir toutes les tables existantes
 */
async function discoverTables() {
  console.log('🔍 Découverte des tables...')
  
  const possibleTables = [
    'pev_users', 'pev_profiles', 'pev_connections', 'pev_companies', 'pev_company_members',
    'pev_opportunities', 'pev_opportunity_applications', 'pev_events', 'pev_event_registrations',
    'pev_projects', 'pev_resources', 'pev_message_threads', 'pev_message_thread_participants',
    'pev_messages', 'pev_message_read_status', 'pev_forum_categories', 'pev_forum_topics',
    'pev_forum_posts', 'pev_groups', 'pev_group_members', 'pev_notifications', 'pev_favorites',
    'pev_audit_logs', 'pev_platform_stats', 'pev_sectors', 'pev_sdgs',
    'pev_storage_buckets', 'pev_storage_objects', 'pev_file_uploads', 'pev_storage_quotas',
    'pev_auth_sessions', 'pev_auth_password_resets', 'pev_auth_email_verifications'
  ]
  
  const foundTables = []
  
  for (const table of possibleTables) {
    // Filtrer si option --tables spécifiée
    if (options.tables && !options.tables.includes(table)) {
      continue
    }
    
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (!error) {
        foundTables.push({ name: table, count: count || 0 })
        console.log(`   ✅ ${table} (${count || 0} lignes)`)
      }
    } catch (err) {
      // Ignorer les tables inexistantes
    }
  }
  
  console.log(`\n📊 ${foundTables.length} tables trouvées\n`)
  return foundTables
}

/**
 * Générer le schéma d'une table (approximation)
 */
async function generateTableSchema(tableName) {
  const { data, error } = await supabase
    .from(tableName)
    .select('*')
    .limit(1)
  
  if (error || !data || data.length === 0) {
    return `-- Table ${tableName}: Aucune donnée pour inférer la structure\n`
  }
  
  const firstRow = data[0]
  let sql = `-- Table: ${tableName}\n`
  sql += `-- Note: Structure inférée depuis les données (peut être incomplète)\n`
  sql += `CREATE TABLE IF NOT EXISTS ${tableName} (\n`
  
  const columns = Object.entries(firstRow).map(([key, value]) => {
    let type = 'TEXT'
    if (typeof value === 'number') {
      type = Number.isInteger(value) ? 'BIGINT' : 'NUMERIC'
    } else if (typeof value === 'boolean') {
      type = 'BOOLEAN'
    } else if (value && typeof value === 'object') {
      type = 'JSONB'
    } else if (value && value.match && value.match(/^\d{4}-\d{2}-\d{2}/)) {
      type = 'TIMESTAMPTZ'
    } else if (key === 'id' || key.endsWith('_id')) {
      if (key === 'id') {
        type = 'UUID PRIMARY KEY'
      } else {
        type = 'UUID'
      }
    }
    
    return `    ${key} ${type}`
  })
  
  sql += columns.join(',\n')
  sql += `\n);\n\n`
  
  return sql
}

/**
 * Générer les INSERT pour une table
 */
async function generateTableData(tableName, rowCount) {
  if (rowCount === 0) {
    return `-- Table ${tableName}: Aucune donnée\n\n`
  }
  
  console.log(`   📥 Export ${tableName} (${rowCount} lignes)...`)
  
  let sql = `-- Données: ${tableName} (${rowCount} lignes)\n`
  
  // Récupérer toutes les données par batch de 1000
  const batchSize = 1000
  let offset = 0
  let hasMore = true
  
  while (hasMore) {
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .range(offset, offset + batchSize - 1)
    
    if (error || !data || data.length === 0) {
      hasMore = false
      break
    }
    
    // Générer les INSERT
    data.forEach(row => {
      const columns = Object.keys(row)
      const values = columns.map(col => {
        const val = row[col]
        
        if (val === null || val === undefined) {
          return 'NULL'
        } else if (typeof val === 'boolean') {
          return val ? 'TRUE' : 'FALSE'
        } else if (typeof val === 'number') {
          return val
        } else if (typeof val === 'object') {
          return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`
        } else {
          // Échapper les apostrophes
          return `'${String(val).replace(/'/g, "''")}'`
        }
      })
      
      sql += `INSERT INTO ${tableName} (${columns.join(', ')}) VALUES (${values.join(', ')});\n`
    })
    
    offset += batchSize
    if (data.length < batchSize) {
      hasMore = false
    }
  }
  
  sql += `\n`
  return sql
}

/**
 * Export principal
 */
async function exportDatabase() {
  console.log('🚀 Export Supabase → SQL')
  console.log('=' .repeat(70))
  console.log(`📍 Source: ${SUPABASE_URL}`)
  console.log(`📄 Destination: ${outputPath}`)
  console.log(`⚙️  Options:`)
  if (options.schemaOnly) console.log('   - Schema uniquement')
  if (options.dataOnly) console.log('   - Données uniquement')
  if (options.tables) console.log('   - Tables:', options.tables.join(', '))
  console.log('=' .repeat(70))
  console.log('')
  
  // Découvrir les tables
  const tables = await discoverTables()
  
  if (tables.length === 0) {
    console.error('❌ Aucune table trouvée!')
    process.exit(1)
  }
  
  // Générer le fichier SQL
  let sql = `-- ==========================================\n`
  sql += `-- Export Supabase Self-Hosted\n`
  sql += `-- Source: ${SUPABASE_URL}\n`
  sql += `-- Date: ${new Date().toISOString()}\n`
  sql += `-- Tables: ${tables.length}\n`
  sql += `-- ==========================================\n\n`
  
  // Extensions
  sql += `-- Extensions\n`
  sql += `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";\n`
  sql += `CREATE EXTENSION IF NOT EXISTS "pgcrypto";\n\n`
  
  // Export de chaque table
  console.log('📦 Export des tables...\n')
  
  for (const table of tables) {
    console.log(`📦 ${table.name}`)
    
    // Schema
    if (!options.dataOnly) {
      console.log('   📐 Structure...')
      sql += await generateTableSchema(table.name)
    }
    
    // Data
    if (!options.schemaOnly) {
      sql += await generateTableData(table.name, table.count)
    }
  }
  
  // Footer
  sql += `-- ==========================================\n`
  sql += `-- FIN DE L'EXPORT\n`
  sql += `-- Total: ${tables.length} tables\n`
  sql += `-- ==========================================\n`
  
  // Écrire le fichier
  console.log('\n💾 Écriture du fichier...')
  writeFileSync(outputPath, sql, 'utf-8')
  
  console.log('\n' + '='.repeat(70))
  console.log('✅ EXPORT TERMINÉ!')
  console.log('=' .repeat(70))
  console.log(`📄 Fichier: ${outputPath}`)
  console.log(`📊 Tables exportées: ${tables.length}`)
  console.log(`💾 Taille: ${(sql.length / 1024).toFixed(2)} KB`)
  console.log('=' .repeat(70))
  console.log('\n💡 Pour restaurer:')
  console.log(`   psql -h localhost -U postgres -d ma_base -f ${options.output}`)
  console.log('')
}

// Exécution
exportDatabase().catch(err => {
  console.error('\n❌ ERREUR:', err.message)
  console.error(err.stack)
  process.exit(1)
})
