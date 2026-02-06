require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NTA1NTA0MDAsImV4cCI6MTkwODMxNjgwMH0._vzEGKcOeWa5pUsAxBDlgkui--m5itWX6B3ewlqQwY0'
);

async function diagnose() {
  const userId = '54afd3dd-6979-458c-9e27-b31c943aeacc';
  
  console.log('=== DIAGNOSTIC COMPLET ===\n');
  
  // 1. Vérifier l'utilisateur auth
  console.log('1. Utilisateur auth:');
  const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
  const authUser = authUsers?.users?.find(u => u.id === userId);
  
  if (authUser) {
    console.log('   ✅ Existe:', authUser.email);
    console.log('   Email confirmé:', authUser.email_confirmed_at ? 'Oui' : 'Non');
  } else {
    console.log('   ❌ Non trouvé');
  }
  
  // 2. Vérifier le profil pev_profiles
  console.log('\n2. Profil pev_profiles:');
  const { data: profile, error: profileErr } = await supabaseAdmin
    .from('pev_profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (profile) {
    console.log('   ✅ Existe:', profile.email);
  } else {
    console.log('   ❌ Non trouvé');
    if (profileErr) console.log('   Erreur:', profileErr.message);
  }
  
  // 3. Lister les colonnes de pev_profiles
  console.log('\n3. Colonnes pev_profiles:');
  const { data: cols } = await supabaseAdmin
    .from('pev_profiles')
    .select('*')
    .limit(1);
  
  if (cols && cols[0]) {
    console.log('   Colonnes:', Object.keys(cols[0]).join(', '));
  }
  
  // 4. Vérifier RLS
  console.log('\n4. Test RLS (lecture tous profils avec service_role):');
  const { data: allProfiles, error: rlsErr } = await supabaseAdmin
    .from('pev_profiles')
    .select('id, email')
    .limit(3);
  
  if (allProfiles) {
    console.log('   ✅', allProfiles.length, 'profils accessibles');
    allProfiles.forEach(p => console.log('     -', p.email));
  } else {
    console.log('   ❌ Erreur RLS:', rlsErr?.message);
  }
  
  // 5. Si profil n'existe pas, le créer
  if (!profile && authUser) {
    console.log('\n5. Création du profil manquant...');
    const { error: createErr } = await supabaseAdmin
      .from('pev_profiles')
      .insert({
        id: userId,
        email: authUser.email,
        first_name: authUser.user_metadata?.first_name || 'Utilisateur',
        last_name: 'Test',
        role: 'user',
        user_type: 'user',
        onboarding_completed: false
      });
    
    if (createErr) {
      console.log('   ❌ Erreur:', createErr.message);
    } else {
      console.log('   ✅ Profil créé!');
    }
  }
  
  console.log('\n=== FIN DIAGNOSTIC ===');
}

diagnose();
