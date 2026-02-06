require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NTA1NTA0MDAsImV4cCI6MTkwODMxNjgwMH0._vzEGKcOeWa5pUsAxBDlgkui--m5itWX6B3ewlqQwY0'
);

async function addColumn() {
  console.log('Ajout de la colonne experience_level à pev_profiles...');
  
  const { data, error } = await supabaseAdmin.rpc('exec_sql', {
    sql: "ALTER TABLE pev_profiles ADD COLUMN IF NOT EXISTS experience_level TEXT DEFAULT 'beginner';"
  });
  
  if (error) {
    console.log('RPC non disponible, tentative directe...');
    // Alternative: vérifier si la colonne existe via une requête
    const { data: test, error: testErr } = await supabaseAdmin
      .from('pev_profiles')
      .select('id')
      .limit(1);
    
    if (testErr) {
      console.error('Erreur:', testErr.message);
    } else {
      console.log('La table pev_profiles est accessible.');
      console.log('\n⚠️ Exécutez ce SQL dans votre panel Supabase:');
      console.log('─'.repeat(50));
      console.log("ALTER TABLE pev_profiles ADD COLUMN IF NOT EXISTS experience_level TEXT DEFAULT 'beginner';");
      console.log('─'.repeat(50));
    }
  } else {
    console.log('✅ Colonne ajoutée avec succès!');
  }
}

addColumn();
