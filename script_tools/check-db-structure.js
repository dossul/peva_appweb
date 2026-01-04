/**
 * Script de vérification de la structure BDD Supabase
 * Usage: node check-db-structure.js [table_name]
 * Exemple: node check-db-structure.js pev_opportunities
 */

import { createClient } from '@supabase/supabase-js'

// Configuration Supabase - URL de production
const SUPABASE_URL = 'https://supabase.benga.live'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzUwNTUwNDAwLCJleHAiOjE5MDgzMTY4MDB9.v_Okk2VYUgZGcM6JZl-fndj-iXR_vWxtOOxDz4jyh1A'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function getTableColumns(tableName) {
  console.log(`\n🔍 Vérification de la table: ${tableName}\n`);
  console.log('='.repeat(60));

  const { data, error } = await supabase.rpc('get_table_columns', { p_table_name: tableName });

  if (error) {
    // Fallback: requête directe si la fonction RPC n'existe pas
    const { data: fallbackData, error: fallbackError } = await supabase
      .from(tableName)
      .select('*')
      .limit(0);

    if (fallbackError) {
      console.error(`❌ Erreur: ${fallbackError.message}`);
      return null;
    }

    // Impossible d'obtenir les colonnes sans RPC, on fait un select pour voir la structure
    console.log('⚠️  Fonction RPC non disponible. Test de connexion à la table...');
    
    const { data: testData, error: testError } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);

    if (testError) {
      console.error(`❌ Erreur d'accès à la table: ${testError.message}`);
      return null;
    }

    if (testData && testData.length > 0) {
      const columns = Object.keys(testData[0]);
      console.log(`\n✅ Colonnes trouvées (${columns.length}):\n`);
      columns.forEach((col, i) => {
        console.log(`   ${(i + 1).toString().padStart(2)}. ${col}`);
      });
      return columns;
    } else {
      console.log('⚠️  Table vide - impossible de déterminer les colonnes');
      return [];
    }
  }

  if (data) {
    console.log(`\n✅ Colonnes de ${tableName} (${data.length}):\n`);
    data.forEach((col, i) => {
      console.log(`   ${(i + 1).toString().padStart(2)}. ${col.column_name} (${col.data_type})`);
    });
    return data;
  }

  return null;
}

async function listAllTables() {
  console.log('\n📋 Liste des tables pev_* disponibles:\n');
  console.log('='.repeat(60));

  // On essaie de lister quelques tables connues
  const knownTables = [
    'pev_profiles',
    'pev_companies',
    'pev_opportunities',
    'pev_opportunity_applications',
    'pev_events',
    'pev_resources',
    'pev_groups',
    'pev_messages',
    'pev_connections'
  ];

  for (const table of knownTables) {
    const { error } = await supabase.from(table).select('id').limit(1);
    if (!error) {
      console.log(`   ✅ ${table}`);
    } else {
      console.log(`   ❌ ${table} (${error.message})`);
    }
  }
}

async function main() {
  const tableName = process.argv[2];

  console.log('\n' + '='.repeat(60));
  console.log('   🗄️  VÉRIFICATION STRUCTURE BDD SUPABASE');
  console.log('='.repeat(60));
  console.log(`\n   URL: ${SUPABASE_URL}`);

  if (tableName) {
    await getTableColumns(tableName);
  } else {
    console.log('\n   Usage: node check-db-structure.js <table_name>');
    console.log('   Exemple: node check-db-structure.js pev_opportunities\n');
    await listAllTables();
  }

  console.log('\n' + '='.repeat(60) + '\n');
}

main().catch(console.error);
