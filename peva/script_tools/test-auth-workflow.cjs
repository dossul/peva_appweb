/**
 * Test complet du workflow d'authentification
 * 2iE GreenHub
 */

require('dotenv').config({ path: '../.env' });
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://supabase.benga.live';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY;
const SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NTA1NTA0MDAsImV4cCI6MTkwODMxNjgwMH0._vzEGKcOeWa5pUsAxBDlgkui--m5itWX6B3ewlqQwY0';
const API_EMAIL_URL = 'https://apiemail2iegreenhub.vercel.app';

// Couleurs console
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  step: (num, msg) => console.log(`\n${colors.blue}[ÉTAPE ${num}]${colors.reset} ${msg}`)
};

async function testAuthWorkflow() {
  console.log('\n' + '='.repeat(60));
  console.log('🔐 TEST WORKFLOW AUTHENTIFICATION 2iE GreenHub');
  console.log('='.repeat(60));

  const testEmail = `test_${Date.now()}@test.com`;
  const testPassword = 'TestPassword123!';
  const testFirstName = 'TestUser';

  // Client normal (anon key)
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  
  // Client admin (service role)
  const supabaseAdmin = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, persistSession: false }
  });

  let results = {
    total: 0,
    passed: 0,
    failed: 0
  };

  // ============================================
  // ÉTAPE 1: Test connexion Supabase
  // ============================================
  log.step(1, 'Test connexion Supabase');
  results.total++;
  try {
    const { data, error } = await supabase.from('pev_profiles').select('count').limit(1);
    if (error) throw error;
    log.success('Connexion Supabase OK');
    results.passed++;
  } catch (err) {
    log.error(`Connexion Supabase: ${err.message}`);
    results.failed++;
  }

  // ============================================
  // ÉTAPE 2: Création utilisateur via API Admin (seule méthode)
  // ============================================
  log.step(2, `Création utilisateur via API: ${testEmail}`);
  results.total++;
  let confirmationLink = null;
  try {
    const response = await fetch(`${API_EMAIL_URL}/api/send-confirmation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        firstName: testFirstName,
        redirectTo: 'https://app.2iegreenhub.org/auth/verify',
        password: testPassword
      })
    });

    const data = await response.json();
    
    if (response.ok && data.success) {
      log.success('API send-confirmation OK');
      results.passed++;
    } else {
      log.error(`API send-confirmation: ${data.error || 'Erreur inconnue'}`);
      results.failed++;
    }
  } catch (err) {
    log.error(`API send-confirmation: ${err.message}`);
    results.failed++;
  }

  // ============================================
  // ÉTAPE 3: Confirmer email via admin
  // ============================================
  log.step(3, 'Confirmation email via admin API');
  results.total++;
  let userId = null;
  try {
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const testUser = users.users.find(u => u.email === testEmail);
    
    if (testUser) {
      userId = testUser.id;
      const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
        email_confirm: true
      });
      
      if (error) throw error;
      log.success(`Email confirmé pour user: ${userId}`);
      results.passed++;
    } else {
      log.error('Utilisateur test non trouvé');
      results.failed++;
    }
  } catch (err) {
    log.error(`Confirmation email: ${err.message}`);
    results.failed++;
  }

  // ============================================
  // ÉTAPE 4: Test connexion (signIn)
  // ============================================
  log.step(4, 'Test connexion avec mot de passe');
  results.total++;
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testEmail,
      password: testPassword
    });

    if (error) throw error;
    
    log.success(`Connexion réussie - Session: ${data.session ? 'OK' : 'N/A'}`);
    results.passed++;
  } catch (err) {
    log.error(`Connexion: ${err.message}`);
    results.failed++;
  }

  // ============================================
  // NETTOYAGE: Supprimer utilisateur test
  // ============================================
  log.step('🧹', 'Nettoyage - Suppression utilisateur test');
  try {
    const { data: users } = await supabaseAdmin.auth.admin.listUsers();
    const testUser = users.users.find(u => u.email === testEmail);
    
    if (testUser) {
      await supabaseAdmin.auth.admin.deleteUser(testUser.id);
      log.success('Utilisateur test supprimé');
    }
  } catch (err) {
    log.warn(`Nettoyage: ${err.message}`);
  }

  // ============================================
  // RÉSUMÉ
  // ============================================
  console.log('\n' + '='.repeat(60));
  console.log('📊 RÉSUMÉ DES TESTS');
  console.log('='.repeat(60));
  console.log(`Total: ${results.total}`);
  console.log(`${colors.green}Réussis: ${results.passed}${colors.reset}`);
  console.log(`${colors.red}Échoués: ${results.failed}${colors.reset}`);
  console.log('='.repeat(60));

  if (results.failed > 0) {
    console.log(`\n${colors.red}⚠️  ATTENTION: ${results.failed} test(s) échoué(s)${colors.reset}`);
    process.exit(1);
  } else {
    console.log(`\n${colors.green}✅ TOUS LES TESTS PASSENT${colors.reset}`);
    process.exit(0);
  }
}

testAuthWorkflow().catch(err => {
  log.error(`Erreur fatale: ${err.message}`);
  process.exit(1);
});
