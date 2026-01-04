import { supabase } from '@/lib/supabase'

export const socialService = {
  // Récupérer tous les comptes sociaux
  async getSocialAccounts() {
    try {
      const { data, error } = await supabase
        .from('pev_social_accounts')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Erreur récupération comptes sociaux:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Ajouter un compte social
  async addSocialAccount(accountData) {
    try {
      const { data, error } = await supabase
        .from('pev_social_accounts')
        .insert([{
          ...accountData,
          created_by: (await supabase.auth.getUser()).data.user?.id
        }])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Erreur ajout compte social:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Mettre à jour un compte social
  async updateSocialAccount(id, updates) {
    try {
      const { data, error } = await supabase
        .from('pev_social_accounts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Erreur mise à jour compte social:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Supprimer un compte social
  async deleteSocialAccount(id) {
    try {
      const { error } = await supabase
        .from('pev_social_accounts')
        .delete()
        .eq('id', id)

      if (error) throw error

      return {
        success: true
      }
    } catch (error) {
      console.error('Erreur suppression compte social:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Simuler le partage sur les réseaux sociaux (Stub)
  // À remplacer par de vrais appels API (Facebook Graph API, Twitter API, etc.) via Edge Functions
  async shareOpportunity(opportunity, accounts) {
    const results = []
    
    for (const account of accounts) {
      try {
        console.log(`Simulation partage sur ${account.platform} (${account.name}) pour: ${opportunity.title}`)
        
        // Simulation d'un délai réseau
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // Enregistrement dans l'historique
        const { error } = await supabase
          .from('pev_social_posts')
          .insert({
            opportunity_id: opportunity.id,
            social_account_id: account.id,
            platform: account.platform,
            status: 'published',
            external_post_id: `mock_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            posted_at: new Date().toISOString()
          })

        if (error) throw error

        results.push({
          accountId: account.id,
          status: 'success',
          platform: account.platform
        })
      } catch (error) {
        console.error(`Erreur partage ${account.platform}:`, error)
        
        // Enregistrement de l'échec
        await supabase
          .from('pev_social_posts')
          .insert({
            opportunity_id: opportunity.id,
            social_account_id: account.id,
            platform: account.platform,
            status: 'failed',
            error_message: error.message
          })

        results.push({
          accountId: account.id,
          status: 'error',
          error: error.message
        })
      }
    }

    return results
  },

  // Récupérer l'historique des partages
  async getShareHistory(limit = 50) {
    try {
      const { data, error } = await supabase
        .from('pev_social_posts')
        .select(`
          *,
          opportunity:opportunity_id (title),
          account:social_account_id (name, platform)
        `)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Erreur récupération historique partages:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}
