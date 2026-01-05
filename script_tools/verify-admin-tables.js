/**
 * Script de vérification des tables utilisées par le dashboard admin
 * Vérifie l'existence des tables et colonnes requises
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://supabase.benga.live',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzUwNTUwNDAwLCJleHAiOjE5MDgzMTY4MDB9.v_Okk2VYUgZGcM6JZl-fndj-iXR_vWxtOOxDz4jyh1A'
)

// Tables et colonnes à vérifier (basé sur les erreurs)
const TABLES_TO_CHECK = [
  {
    table: 'pev_reports',
    columns: ['id', 'content', 'reporter_id', 'priority', 'created_at'],
    joinTest: 'pev_profiles:reporter_id(first_name,last_name)'
  },
  {
    table: 'pev_forum_topics',
    columns: ['id', 'status', 'created_at']
  },
  {
    table: 'pev_messages',
    columns: ['id', 'created_at']
  },
  {
    table: 'pev_profiles',
    columns: ['id', 'first_name', 'last_name', 'last_activity']
  },
  {
    table: 'pev_connections',
    columns: ['id', 'status', 'created_at']
  },
  {
    table: 'pev_events',
    columns: ['id', 'title', 'created_at', 'created_by']
  }
]

console.log('\n🔍 VÉRIFICATION DES TABLES ADMIN DASHBOARD\n')
console.log('=' .repeat(70))

const results = []

for (const { table, columns, joinTest } of TABLES_TO_CHECK) {
  console.log(`\n📋 Table: ${table}`)
  console.log('-'.repeat(50))
  
  // Test 1: La table existe-t-elle ?
  const { data: tableData, error: tableError } = await supabase
    .from(table)
    .select('*')
    .limit(1)
  
  if (tableError) {
    console.log(`   ❌ TABLE N'EXISTE PAS ou ERREUR: ${tableError.message}`)
    results.push({ table, exists: false, error: tableError.message, missingColumns: columns })
    continue
  }
  
  console.log(`   ✅ Table existe`)
  
  // Test 2: Vérifier chaque colonne
  const missingColumns = []
  for (const col of columns) {
    const { data, error } = await supabase
      .from(table)
      .select(col)
      .limit(1)
    
    if (error) {
      console.log(`   ❌ Colonne "${col}": MANQUANTE - ${error.message}`)
      missingColumns.push(col)
    } else {
      console.log(`   ✅ Colonne "${col}": OK`)
    }
  }
  
  // Test 3: Vérifier la jointure si spécifiée
  if (joinTest) {
    const selectQuery = `id,${joinTest}`
    const { data, error } = await supabase
      .from(table)
      .select(selectQuery)
      .limit(1)
    
    if (error) {
      console.log(`   ❌ Jointure "${joinTest}": ERREUR - ${error.message}`)
      missingColumns.push(`JOIN:${joinTest}`)
    } else {
      console.log(`   ✅ Jointure "${joinTest}": OK`)
    }
  }
  
  results.push({ table, exists: true, missingColumns })
}

console.log('\n' + '=' .repeat(70))
console.log('\n📊 RÉSUMÉ DES PROBLÈMES:\n')

const problems = results.filter(r => !r.exists || r.missingColumns.length > 0)

if (problems.length === 0) {
  console.log('🎉 Aucun problème détecté!')
} else {
  for (const p of problems) {
    if (!p.exists) {
      console.log(`❌ ${p.table}: Table n'existe pas`)
      console.log(`   → CRÉER la table avec colonnes: ${p.missingColumns.join(', ')}`)
    } else if (p.missingColumns.length > 0) {
      console.log(`⚠️ ${p.table}: Colonnes manquantes: ${p.missingColumns.join(', ')}`)
    }
  }
}

console.log('\n')
