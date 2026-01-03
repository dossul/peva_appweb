import { createClient } from '@supabase/supabase-js'

// Configuration Supabase - Instance self-hosted
const SUPABASE_URL = 'https://supabase.benga.live'
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NTA1NTA0MDAsImV4cCI6MTkwODMxNjgwMH0._vzEGKcOeWa5pUsAxBDlgkui--m5itWX6B3ewlqQwY0'

// Client Admin (Service Role)
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

// Comptes à créer
const ACCOUNTS = [
  {
    email: 'admin@2iegreenhub.org',
    password: 'Admin@2iE2026!',
    user_metadata: {
      first_name: 'Admin',
      last_name: 'Principal',
      role: 'admin'
    },
    profile: {
      first_name: 'Admin',
      last_name: 'Principal',
      display_name: 'Admin Principal',
      role: 'admin',
      user_type: 'admin',
      location: 'Ouagadougou',
      country: 'Burkina Faso',
      is_verified: true,
      onboarding_completed: true
    }
  },
  {
    email: 'superadmin@2iegreenhub.org',
    password: 'SuperAdmin@2iE2026!',
    user_metadata: {
      first_name: 'Super',
      last_name: 'Admin',
      role: 'super_admin'
    },
    profile: {
      first_name: 'Super',
      last_name: 'Admin',
      display_name: 'Super Admin',
      role: 'super_admin',
      user_type: 'admin',
      location: 'Dakar',
      country: 'Sénégal',
      is_verified: true,
      onboarding_completed: true
    }
  },
  {
    email: 'moderator@2iegreenhub.org',
    password: 'Moderator@2iE2026!',
    user_metadata: {
      first_name: 'Modérateur',
      last_name: 'Contenu',
      role: 'moderator'
    },
    profile: {
      first_name: 'Modérateur',
      last_name: 'Contenu',
      display_name: 'Modérateur Contenu',
      role: 'moderator',
      user_type: 'moderator',
      location: 'Abidjan',
      country: 'Côte d\'Ivoire',
      is_verified: true,
      onboarding_completed: true
    }
  },
  {
    email: 'entrepreneur@2iegreenhub.org',
    password: 'User@2iE2026!',
    user_metadata: {
      first_name: 'Fatou',
      last_name: 'Diallo',
      user_type: 'entrepreneur'
    },
    profile: {
      first_name: 'Fatou',
      last_name: 'Diallo',
      display_name: 'Fatou Diallo',
      role: 'user',
      user_type: 'entrepreneur',
      location: 'Bamako',
      country: 'Mali',
      is_verified: true,
      onboarding_completed: true
    }
  },
  {
    email: 'investor@2iegreenhub.org',
    password: 'User@2iE2026!',
    user_metadata: {
      first_name: 'Kwame',
      last_name: 'Mensah',
      user_type: 'investor'
    },
    profile: {
      first_name: 'Kwame',
      last_name: 'Mensah',
      display_name: 'Kwame Mensah',
      role: 'user',
      user_type: 'investor',
      location: 'Accra',
      country: 'Ghana',
      is_verified: true,
      onboarding_completed: true
    }
  },
  {
    email: 'researcher@2iegreenhub.org',
    password: 'User@2iE2026!',
    user_metadata: {
      first_name: 'Aminata',
      last_name: 'Touré',
      user_type: 'researcher'
    },
    profile: {
      first_name: 'Aminata',
      last_name: 'Touré',
      display_name: 'Aminata Touré',
      role: 'user',
      user_type: 'researcher',
      location: 'Dakar',
      country: 'Sénégal',
      is_verified: true,
      onboarding_completed: true
    }
  }
]

async function deleteExistingUsers() {
  console.log('\n🗑️  Suppression des utilisateurs existants...\n')
  
  for (const account of ACCOUNTS) {
    try {
      // Récupérer l'utilisateur par email
      const { data: users } = await supabaseAdmin.auth.admin.listUsers()
      const existingUser = users?.users?.find(u => u.email === account.email)
      
      if (existingUser) {
        // Supprimer de auth via API
        await supabaseAdmin.auth.admin.deleteUser(existingUser.id)
        console.log(`✅ Supprimé: ${account.email}`)
        
        // Supprimer de pev_users si existe
        await supabaseAdmin.from('pev_users').delete().eq('email', account.email)
        
        // Supprimer de pev_profiles si existe
        await supabaseAdmin.from('pev_profiles').delete().eq('email', account.email)
      }
    } catch (error) {
      console.log(`⚠️  ${account.email}: ${error.message}`)
    }
  }
}

async function createUsers() {
  console.log('\n✨ Création des utilisateurs via API Admin...\n')
  
  const results = []
  
  for (const account of ACCOUNTS) {
    try {
      // 1. Créer utilisateur via API Admin (comme EPACO)
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email: account.email,
        password: account.password,
        email_confirm: true,  // Confirmer l'email automatiquement
        user_metadata: account.user_metadata
      })
      
      if (authError) throw authError
      
      console.log(`✅ Auth créé: ${account.email} (ID: ${authData.user.id})`)
      
      // 2. Créer dans pev_users
      const { error: pevUsersError } = await supabaseAdmin
        .from('pev_users')
        .insert({
          id: authData.user.id,
          email: account.email,
          encrypted_password: authData.user.encrypted_password || '',
          email_confirmed_at: new Date().toISOString(),
          raw_user_meta_data: account.user_metadata,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (pevUsersError) {
        console.log(`⚠️  pev_users: ${pevUsersError.message}`)
      } else {
        console.log(`   ✓ pev_users créé`)
      }
      
      // 3. Créer dans pev_profiles
      const { error: profileError } = await supabaseAdmin
        .from('pev_profiles')
        .insert({
          id: authData.user.id,
          email: account.email,
          ...account.profile,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
      
      if (profileError) {
        console.log(`⚠️  pev_profiles: ${profileError.message}`)
      } else {
        console.log(`   ✓ pev_profiles créé`)
      }
      
      results.push({
        email: account.email,
        password: account.password,
        user_id: authData.user.id,
        success: true
      })
      
      console.log('')
      
    } catch (error) {
      console.error(`❌ Erreur ${account.email}:`, error.message)
      results.push({
        email: account.email,
        success: false,
        error: error.message
      })
    }
  }
  
  return results
}

async function verifyUsers() {
  console.log('\n🔍 Vérification des comptes créés...\n')
  
  const { data: users } = await supabaseAdmin.auth.admin.listUsers()
  const ourUsers = users?.users?.filter(u => u.email?.includes('@2iegreenhub.org'))
  
  console.log(`✅ ${ourUsers?.length || 0} utilisateurs trouvés dans auth.users`)
  
  const { data: profiles } = await supabaseAdmin
    .from('pev_profiles')
    .select('email, role, user_type')
    .like('email', '%@2iegreenhub.org')
  
  console.log(`✅ ${profiles?.length || 0} profils trouvés dans pev_profiles`)
  
  console.log('\n📋 Liste des comptes:')
  profiles?.forEach(p => {
    console.log(`   • ${p.email} (${p.role}/${p.user_type})`)
  })
}

// Exécution
async function main() {
  console.log('🚀 Création des utilisateurs via API Admin Supabase')
  console.log('=' .repeat(60))
  
  try {
    // 1. Supprimer les anciens
    await deleteExistingUsers()
    
    // 2. Créer les nouveaux
    const results = await createUsers()
    
    // 3. Vérifier
    await verifyUsers()
    
    // 4. Résumé
    console.log('\n' + '='.repeat(60))
    console.log('📊 RÉSUMÉ DES CREDENTIALS')
    console.log('='.repeat(60) + '\n')
    
    results.forEach(r => {
      if (r.success) {
        console.log(`✅ ${r.email}`)
        console.log(`   Password: ${r.password}`)
        console.log(`   User ID: ${r.user_id}\n`)
      }
    })
    
    console.log('✨ Terminé! Testez la connexion sur votre app.')
    
  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

main()
