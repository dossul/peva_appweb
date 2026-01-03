import { createClient } from '@supabase/supabase-js'

// Configuration Supabase - URL de production
const SUPABASE_URL = 'https://supabase.benga.live'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzUwNTUwNDAwLCJleHAiOjE5MDgzMTY4MDB9.v_Okk2VYUgZGcM6JZl-fndj-iXR_vWxtOOxDz4jyh1A'

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function listAllAccounts() {
  console.log('🔍 Connexion à Supabase...\n')
  
  try {
    // Récupérer tous les profils
    const { data: profiles, error } = await supabase
      .from('pev_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Erreur lors de la récupération des profils:', error.message)
      return
    }

    if (!profiles || profiles.length === 0) {
      console.log('ℹ️  Aucun compte trouvé dans pev_profiles')
      return
    }

    console.log(`✅ ${profiles.length} compte(s) trouvé(s):\n`)
    console.log('═'.repeat(100))
    
    profiles.forEach((profile, index) => {
      console.log(`\n${index + 1}. 👤 ${profile.first_name} ${profile.last_name}`)
      console.log(`   📧 Email: ${profile.email}`)
      console.log(`   🔐 Rôle: ${profile.role || 'user'}`)
      console.log(`   👔 Type: ${profile.user_type || 'N/A'}`)
      console.log(`   📍 Localisation: ${profile.location || 'N/A'}`)
      console.log(`   🌍 Pays: ${profile.country || 'N/A'}`)
      console.log(`   ✅ Vérifié: ${profile.is_verified ? 'Oui' : 'Non'}`)
      console.log(`   🎓 Onboarding: ${profile.onboarding_completed ? 'Complété' : 'Non complété'}`)
      console.log(`   📅 Créé le: ${new Date(profile.created_at).toLocaleString('fr-FR')}`)
      console.log(`   🆔 ID: ${profile.id}`)
      console.log('   ' + '─'.repeat(80))
    })

    console.log('\n' + '═'.repeat(100))
    console.log('\n📊 RÉSUMÉ:')
    console.log(`   Total comptes: ${profiles.length}`)
    console.log(`   Admins: ${profiles.filter(p => p.role === 'admin' || p.role === 'superadmin').length}`)
    console.log(`   Utilisateurs: ${profiles.filter(p => !p.role || p.role === 'user').length}`)
    console.log(`   Vérifiés: ${profiles.filter(p => p.is_verified).length}`)
    console.log(`   Onboarding complété: ${profiles.filter(p => p.onboarding_completed).length}`)

  } catch (error) {
    console.error('❌ Erreur:', error.message)
  }
}

// Exécution
listAllAccounts()
