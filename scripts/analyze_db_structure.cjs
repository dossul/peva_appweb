/**
 * Script d'analyse de la structure BDD existante pour le module Companies
 * Analyse les tables pev_companies et tables connexes
 */

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://supabase.benga.live',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NTA1NTA0MDAsImV4cCI6MTkwODMxNjgwMH0._vzEGKcOeWa5pUsAxBDlgkui--m5itWX6B3ewlqQwY0'
);

async function analyzeTable(tableName) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`TABLE: ${tableName}`);
  console.log('='.repeat(60));
  
  try {
    // Récupérer un échantillon pour voir les colonnes
    const { data, error } = await supabase
      .from(tableName)
      .select('*')
      .limit(1);
    
    if (error) {
      console.log(`  ERREUR: ${error.message}`);
      return null;
    }
    
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log(`  COLONNES (${columns.length}):`);
      columns.forEach(col => {
        const value = data[0][col];
        const type = value === null ? 'null' : typeof value;
        console.log(`    - ${col}: ${type}`);
      });
      
      // Compter les lignes
      const { count } = await supabase
        .from(tableName)
        .select('*', { count: 'exact', head: true });
      
      console.log(`  TOTAL LIGNES: ${count || 0}`);
      return { columns, count };
    } else {
      console.log('  TABLE VIDE - impossible de déterminer les colonnes');
      return { columns: [], count: 0 };
    }
  } catch (err) {
    console.log(`  ERREUR: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('ANALYSE DE LA STRUCTURE BDD - MODULE COMPANIES');
  console.log('='.repeat(60));
  
  // Tables à analyser
  const tables = [
    'pev_companies',
    'pev_company_members',
    'pev_company_reports',
    'pev_profiles',
    'pev_sectors'
  ];
  
  const results = {};
  
  for (const table of tables) {
    results[table] = await analyzeTable(table);
  }
  
  // Vérifier les tables qui pourraient exister pour les déclarations
  const potentialTables = [
    'pev_company_declarations',
    'pev_company_annual_data',
    'pev_company_claims',
    'pev_company_history',
    'pev_company_emissions',
    'pev_company_waste',
    'pev_periods',
    'pev_campaigns'
  ];
  
  console.log('\n' + '='.repeat(60));
  console.log('VERIFICATION TABLES ADDITIONNELLES');
  console.log('='.repeat(60));
  
  for (const table of potentialTables) {
    const result = await analyzeTable(table);
    if (result) {
      results[table] = result;
    }
  }
  
  // Afficher un résumé
  console.log('\n' + '='.repeat(60));
  console.log('RESUME');
  console.log('='.repeat(60));
  
  console.log('\nTables existantes avec données:');
  for (const [table, info] of Object.entries(results)) {
    if (info && info.count > 0) {
      console.log(`  - ${table}: ${info.count} lignes, ${info.columns.length} colonnes`);
    }
  }
  
  console.log('\nTables vides ou inexistantes:');
  for (const [table, info] of Object.entries(results)) {
    if (!info || info.count === 0) {
      console.log(`  - ${table}`);
    }
  }
  
  // Analyser pev_companies en détail
  console.log('\n' + '='.repeat(60));
  console.log('DETAIL pev_companies');
  console.log('='.repeat(60));
  
  const { data: companies } = await supabase
    .from('pev_companies')
    .select('*')
    .limit(3);
  
  if (companies && companies.length > 0) {
    console.log('\nExemple de données:');
    companies.forEach((c, i) => {
      console.log(`\n[${i+1}] ${c.name || 'N/A'}`);
      console.log(`    ID: ${c.id}`);
      console.log(`    Secteur: ${c.industry || c.sector || 'N/A'}`);
      console.log(`    Pays: ${c.country || 'N/A'}`);
      console.log(`    Status: ${c.status || 'N/A'}`);
      console.log(`    Owner: ${c.owner_id || 'N/A'}`);
    });
  }
}

main().catch(console.error);
