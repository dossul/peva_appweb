const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://supabase.benga.live',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NTA1NTA0MDAsImV4cCI6MTkwODMxNjgwMH0._vzEGKcOeWa5pUsAxBDlgkui--m5itWX6B3ewlqQwY0'
);

async function checkColumns() {
  // Méthode 1: Essayer d'insérer une ligne vide pour voir l'erreur
  const { error } = await supabase
    .from('pev_companies')
    .insert({ name: 'TEST_DELETE_ME', latitude: 12.5, longitude: -1.5 })
    .select();
  
  if (error) {
    console.log('Erreur insertion test:', error.message);
    
    // Vérifier si latitude existe
    const { error: err2 } = await supabase
      .from('pev_companies')
      .insert({ name: 'TEST_DELETE_ME_2' })
      .select();
    
    if (err2) {
      console.log('Erreur sans lat/lng:', err2.message);
    } else {
      console.log('Insertion OK sans lat/lng - ces colonnes n\'existent pas');
      // Supprimer le test
      await supabase.from('pev_companies').delete().eq('name', 'TEST_DELETE_ME_2');
    }
  } else {
    console.log('Colonnes latitude/longitude EXISTENT');
    // Supprimer le test
    await supabase.from('pev_companies').delete().eq('name', 'TEST_DELETE_ME');
  }
}

checkColumns();
