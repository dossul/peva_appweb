require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NTA1NTA0MDAsImV4cCI6MTkwODMxNjgwMH0._vzEGKcOeWa5pUsAxBDlgkui--m5itWX6B3ewlqQwY0'
);

async function fixProfile() {
  const targetEmail = 'urlish2002@yahoo.fr';
  
  console.log('=== Création profil pour:', targetEmail, '===');
  
  // 1. Trouver l'utilisateur auth par email
  const { data: authUsers } = await supabaseAdmin.auth.admin.listUsers();
  const authUser = authUsers?.users?.find(u => u.email === targetEmail);
  
  if (!authUser) {
    console.log('❌ Utilisateur auth non trouvé');
    return;
  }
  
  const userId = authUser.id;
  console.log('Auth user ID:', userId);
  
  // 2. Vérifier si profil existe
  const { data: existing } = await supabaseAdmin
    .from('pev_profiles')
    .select('id')
    .eq('id', userId)
    .single();
  
  if (existing) {
    console.log('✅ Profil existe déjà');
    return;
  }
  
  // 3. Créer le profil
  const { data, error } = await supabaseAdmin
    .from('pev_profiles')
    .insert({
      id: userId,
      email: authUser.email,
      first_name: authUser.user_metadata?.first_name || 'Utilisateur',
      last_name: authUser.user_metadata?.last_name || 'Test',
      role: 'user',
      user_type: 'user',
      onboarding_completed: false
    })
    .select()
    .single();
  
  if (error) {
    console.log('❌ Erreur:', error.message);
  } else {
    console.log('✅ Profil créé:', data.email);
  }
}

fixProfile();
