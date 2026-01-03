import { createClient } from '@supabase/supabase-js'

// Configuration Supabase - Utilise le SERVICE_ROLE pour créer des utilisateurs
const SUPABASE_URL = 'https://supabase.benga.live'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ2bWFoanV3cnN3ZG5hdWdzbWN6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODI4MTY0MCwiZXhwIjoyMDczODU3NjQwfQ.m5NbV-UMh9Dp6tt0fceoAJ_M54CTVcrAyJ4VlEafbcI'

// Client Supabase avec service_role pour bypasser RLS
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Liste des comptes à créer
const ACCOUNTS_TO_CREATE = [
  {
    email: 'admin@2iegreenhub.org',
    password: 'Admin@2iE2026!',
    first_name: 'Admin',
    last_name: 'Principal',
    role: 'admin',
    user_type: 'admin',
    location: 'Ouagadougou',
    country: 'Burkina Faso',
    is_verified: true,
    onboarding_completed: true
  },
  {
    email: 'superadmin@2iegreenhub.org',
    password: 'SuperAdmin@2iE2026!',
    first_name: 'Super',
    last_name: 'Admin',
    role: 'superadmin',
    user_type: 'admin',
    location: 'Dakar',
    country: 'Sénégal',
    is_verified: true,
    onboarding_completed: true
  },
  {
    email: 'moderator@2iegreenhub.org',
    password: 'Moderator@2iE2026!',
    first_name: 'Modérateur',
    last_name: 'Contenu',
    role: 'moderator',
    user_type: 'moderator',
    location: 'Abidjan',
    country: 'Côte d\'Ivoire',
    is_verified: true,
    onboarding_completed: true
  },
  {
    email: 'entrepreneur@2iegreenhub.org',
    password: 'User@2iE2026!',
    first_name: 'Fatou',
    last_name: 'Diallo',
    role: 'user',
    user_type: 'entrepreneur',
    location: 'Bamako',
    country: 'Mali',
    is_verified: true,
    onboarding_completed: true
  },
  {
    email: 'investor@2iegreenhub.org',
    password: 'User@2iE2026!',
    first_name: 'Kwame',
    last_name: 'Mensah',
    role: 'user',
    user_type: 'investor',
    location: 'Accra',
    country: 'Ghana',
    is_verified: true,
    onboarding_completed: true
  },
  {
    email: 'researcher@2iegreenhub.org',
    password: 'User@2iE2026!',
    first_name: 'Aminata',
    last_name: 'Touré',
    role: 'user',
    user_type: 'researcher',
    location: 'Dakar',
    country: 'Sénégal',
    is_verified: true,
    onboarding_completed: true
  }
]

/**
 * Créer un utilisateur dans Supabase Auth et son profil
 */
async function createUser(accountData) {
  const { email, password, ...profileData } = accountData
  
  try {
    console.log(`\n📝 Création du compte: ${email}...`)
    
    // 1. Créer l'utilisateur dans auth.users
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirmer l'email
      user_metadata: {
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        user_type: profileData.user_type,
        role: profileData.role
      }
    })

    if (authError) {
      console.error(`   ❌ Erreur création auth:`, authError.message)
      return { success: false, error: authError }
    }

    console.log(`   ✅ Utilisateur auth créé - ID: ${authData.user.id}`)

    // 2. Créer/Mettre à jour le profil dans pev_profiles
    const { data: profileDataResult, error: profileError } = await supabaseAdmin
      .from('pev_profiles')
      .upsert({
        id: authData.user.id,
        email: email,
        first_name: profileData.first_name,
        last_name: profileData.last_name,
        display_name: `${profileData.first_name} ${profileData.last_name}`,
        user_type: profileData.user_type,
        role: profileData.role,
        location: profileData.location,
        country: profileData.country,
        is_verified: profileData.is_verified,
        onboarding_completed: profileData.onboarding_completed,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select()

    if (profileError) {
      console.error(`   ❌ Erreur création profil:`, profileError.message)
      return { success: false, error: profileError }
    }

    console.log(`   ✅ Profil créé avec rôle: ${profileData.role}`)
    console.log(`   🔑 Email: ${email}`)
    console.log(`   🔐 Password: ${password}`)
    
    return { success: true, user: authData.user, profile: profileDataResult }
    
  } catch (error) {
    console.error(`   ❌ Erreur inattendue:`, error.message)
    return { success: false, error }
  }
}

/**
 * Fonction principale pour seeder tous les comptes
 */
async function seedAccounts() {
  console.log('🌱 SEED COMPTES PEVA - Démarrage...\n')
  console.log('═'.repeat(80))
  
  const results = {
    success: [],
    failed: []
  }

  // Créer chaque compte
  for (const account of ACCOUNTS_TO_CREATE) {
    const result = await createUser(account)
    
    if (result.success) {
      results.success.push(account.email)
    } else {
      results.failed.push({
        email: account.email,
        error: result.error?.message || 'Erreur inconnue'
      })
    }
    
    // Pause de 500ms entre chaque création pour éviter rate limiting
    await new Promise(resolve => setTimeout(resolve, 500))
  }

  // Résumé
  console.log('\n' + '═'.repeat(80))
  console.log('\n📊 RÉSUMÉ DE LA CRÉATION DES COMPTES:\n')
  
  console.log(`✅ Comptes créés avec succès: ${results.success.length}`)
  results.success.forEach(email => {
    console.log(`   ✓ ${email}`)
  })
  
  if (results.failed.length > 0) {
    console.log(`\n❌ Comptes en échec: ${results.failed.length}`)
    results.failed.forEach(({ email, error }) => {
      console.log(`   ✗ ${email}: ${error}`)
    })
  }

  console.log('\n' + '═'.repeat(80))
  console.log('\n📋 CREDENTIALS DES COMPTES CRÉÉS:\n')
  
  ACCOUNTS_TO_CREATE.forEach(account => {
    if (results.success.includes(account.email)) {
      console.log(`${account.role.toUpperCase().padEnd(12)} → ${account.email.padEnd(30)} | ${account.password}`)
    }
  })
  
  console.log('\n' + '═'.repeat(80))
  console.log('\n✨ Seed terminé! Vous pouvez maintenant vous connecter avec ces comptes.\n')
}

// Exécution
seedAccounts().catch(error => {
  console.error('❌ Erreur fatale:', error)
  process.exit(1)
})
