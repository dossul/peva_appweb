/**
 * Vérification des tables de déclarations périodiques dans Supabase
 */
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://supabase.benga.live',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NTA1NTA0MDAsImV4cCI6MTkwODMxNjgwMH0._vzEGKcOeWa5pUsAxBDlgkui--m5itWX6B3ewlqQwY0'
);

const TABLES_TO_CHECK = [
  'pev_periods',
  'pev_company_declarations',
  'pev_company_declaration_hr',
  'pev_company_declaration_emissions',
  'pev_company_declaration_waste',
  'pev_company_declaration_sdg',
  'pev_company_declaration_policies',
  'pev_sdg',
  'pev_policies'
];

async function checkTables() {
  console.log('='.repeat(60));
  console.log('VÉRIFICATION DES TABLES DE DÉCLARATIONS');
  console.log('='.repeat(60));
  
  for (const table of TABLES_TO_CHECK) {
    const { data, error } = await supabase.from(table).select('*').limit(1);
    
    if (error) {
      if (error.message.includes('does not exist') || error.code === '42P01') {
        console.log(`❌ ${table} - N'EXISTE PAS`);
      } else {
        console.log(`⚠️ ${table} - Erreur: ${error.message}`);
      }
    } else {
      console.log(`✓ ${table} - EXISTE (${data.length} enregistrement(s) test)`);
      
      // Afficher les colonnes si la table existe
      if (data.length > 0) {
        console.log(`   Colonnes: ${Object.keys(data[0]).join(', ')}`);
      }
    }
  }
  
  // Vérifier spécifiquement pev_periods
  console.log('\n' + '='.repeat(60));
  console.log('CONTENU DE pev_periods (années disponibles)');
  console.log('='.repeat(60));
  
  const { data: periods, error: periodsError } = await supabase
    .from('pev_periods')
    .select('*')
    .order('year', { ascending: true });
  
  if (periodsError) {
    console.log('Erreur:', periodsError.message);
  } else if (periods && periods.length > 0) {
    periods.forEach(p => console.log(`   ${p.year}: ${p.label} (${p.is_active ? 'actif' : 'inactif'})`));
  } else {
    console.log('   Aucune période définie');
  }
}

checkTables();
