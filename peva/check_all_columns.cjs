/**
 * Script de vérification des colonnes pev_companies
 * Teste toutes les colonnes nécessaires pour le JSON des 20 entreprises
 */
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://supabase.benga.live',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NTA1NTA0MDAsImV4cCI6MTkwODMxNjgwMH0._vzEGKcOeWa5pUsAxBDlgkui--m5itWX6B3ewlqQwY0'
);

// Colonnes nécessaires basées sur le JSON et MapView
const REQUIRED_COLUMNS = [
  'id',
  'name',
  'slug',
  'description',
  'industry',
  'country',
  'city',
  'employees',
  'size',
  'status',
  'is_verified',
  // Colonnes pour les données complètes du JSON
  'main_activities',
  'activities_summary',
  'sdg_contributions',
  'policies_list',
  // Coordonnées GPS pour la carte
  'latitude',
  'longitude',
  // Données RH
  'cdi_ratio',
  'cdd_ratio',
  'temporary_ratio',
  'temporary_count',
  'local_purchases_ratio',
  'solar_percentage',
  // Émissions (stockées en JSONB ou colonnes séparées)
  'emissions_total',
  'emissions_scope1',
  'emissions_scope2',
  'emissions_scope3',
  // Déchets
  'waste_solid',
  'waste_liquid',
  'waste_valorization'
];

async function checkColumns() {
  console.log('='.repeat(60));
  console.log('VÉRIFICATION DES COLONNES pev_companies');
  console.log('='.repeat(60));

  // Récupérer un enregistrement vide pour voir les colonnes
  const { data, error } = await supabase
    .from('pev_companies')
    .select('*')
    .limit(0);

  if (error) {
    console.log('Erreur:', error.message);
    return;
  }

  // Essayer d'insérer une ligne avec toutes les colonnes pour voir lesquelles existent
  const testData = {};
  REQUIRED_COLUMNS.forEach(col => {
    if (col === 'id') return;
    if (col === 'name') testData[col] = 'TEST_COLUMN_CHECK';
    else if (col === 'slug') testData[col] = 'test-column-check';
    else if (col.includes('ratio') || col.includes('percentage')) testData[col] = 0.5;
    else if (col.includes('count') || col.includes('employees') || col.includes('total') || col.includes('scope')) testData[col] = 0;
    else if (col === 'latitude') testData[col] = 12.0;
    else if (col === 'longitude') testData[col] = -1.5;
    else if (col === 'sdg_contributions' || col === 'policies_list') testData[col] = [];
    else if (col === 'is_verified') testData[col] = false;
    else testData[col] = 'test';
  });

  const { error: insertError } = await supabase
    .from('pev_companies')
    .insert(testData);

  if (insertError) {
    // Parser l'erreur pour trouver la colonne manquante
    const match = insertError.message.match(/Could not find the '(\w+)' column/);
    if (match) {
      console.log('\n❌ COLONNE MANQUANTE:', match[1]);
      
      // Tester chaque colonne individuellement
      console.log('\n📋 Test de chaque colonne...\n');
      const existingCols = [];
      const missingCols = [];
      
      for (const col of REQUIRED_COLUMNS) {
        if (col === 'id') continue;
        
        const singleTest = { name: 'TEST_' + col, slug: 'test-' + col };
        if (col !== 'name' && col !== 'slug') {
          if (col.includes('ratio') || col.includes('percentage')) singleTest[col] = 0.5;
          else if (col.includes('count') || col.includes('employees') || col.includes('total') || col.includes('scope')) singleTest[col] = 0;
          else if (col === 'latitude') singleTest[col] = 12.0;
          else if (col === 'longitude') singleTest[col] = -1.5;
          else if (col === 'sdg_contributions' || col === 'policies_list') singleTest[col] = [];
          else if (col === 'is_verified') singleTest[col] = false;
          else singleTest[col] = 'test';
        }
        
        const { error: colError } = await supabase.from('pev_companies').insert(singleTest);
        
        if (colError && colError.message.includes(`'${col}'`)) {
          missingCols.push(col);
          console.log(`   ❌ ${col} - MANQUANTE`);
        } else {
          existingCols.push(col);
          console.log(`   ✓ ${col} - existe`);
          // Nettoyer
          await supabase.from('pev_companies').delete().eq('slug', 'test-' + col);
        }
      }
      
      console.log('\n' + '='.repeat(60));
      console.log('RÉSUMÉ');
      console.log('='.repeat(60));
      console.log(`\n✓ Colonnes existantes (${existingCols.length}):`);
      console.log('  ' + existingCols.join(', '));
      console.log(`\n❌ Colonnes manquantes (${missingCols.length}):`);
      console.log('  ' + missingCols.join(', '));
      
      // Générer le SQL pour créer les colonnes manquantes
      if (missingCols.length > 0) {
        console.log('\n' + '='.repeat(60));
        console.log('SQL À EXÉCUTER POUR CRÉER LES COLONNES MANQUANTES:');
        console.log('='.repeat(60));
        console.log('\nDO $$ BEGIN');
        
        missingCols.forEach(col => {
          let type = 'TEXT';
          if (col.includes('ratio') || col.includes('percentage')) type = 'DECIMAL(5,4)';
          else if (col.includes('count') || col.includes('employees')) type = 'INTEGER';
          else if (col.includes('total') || col.includes('scope')) type = 'DECIMAL(12,2)';
          else if (col === 'latitude') type = 'DECIMAL(10,8)';
          else if (col === 'longitude') type = 'DECIMAL(11,8)';
          else if (col === 'sdg_contributions' || col === 'policies_list') type = 'JSONB DEFAULT \'[]\'';
          else if (col === 'is_verified') type = 'BOOLEAN DEFAULT false';
          
          console.log(`  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pev_companies' AND column_name = '${col}') THEN`);
          console.log(`    ALTER TABLE pev_companies ADD COLUMN ${col} ${type};`);
          console.log(`  END IF;`);
        });
        
        console.log('END $$;');
      }
    } else {
      console.log('Erreur:', insertError.message);
    }
  } else {
    console.log('✓ Toutes les colonnes existent!');
    // Nettoyer
    await supabase.from('pev_companies').delete().eq('slug', 'test-column-check');
  }
}

checkColumns();
