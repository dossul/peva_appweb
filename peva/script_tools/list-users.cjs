require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');

const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NTA1NTA0MDAsImV4cCI6MTkwODMxNjgwMH0._vzEGKcOeWa5pUsAxBDlgkui--m5itWX6B3ewlqQwY0'
);

async function listUsers() {
  const keywords = ['urlish2002', 'soleil', 'olivia', 'hello'];
  
  const { data, error } = await supabaseAdmin.auth.admin.listUsers();
  
  if (error) {
    console.error('Erreur:', error.message);
    return;
  }
  
  const filteredUsers = data.users.filter(user => 
    keywords.some(k => user.email?.toLowerCase().includes(k.toLowerCase()))
  );
  
  console.log('='.repeat(60));
  console.log('COMPTES À SUPPRIMER');
  console.log('='.repeat(60));
  
  filteredUsers.forEach(user => {
    console.log(`Email: ${user.email}`);
    console.log(`ID: ${user.id}`);
    console.log(`Créé: ${user.created_at}`);
    console.log(`Confirmé: ${user.email_confirmed_at ? 'Oui' : 'Non'}`);
    console.log('-'.repeat(40));
  });
  
  console.log(`\nTotal: ${filteredUsers.length} compte(s)`);
}

listUsers();
