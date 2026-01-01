import { supabase } from '@/lib/supabase'

export const adminService = {
  // Récupérer les opportunités en attente de modération
  async getPendingOpportunities() {
    try {
      const { data, error } = await supabase
        .from('pev_opportunities')
        .select('*')
        .eq('status', 'draft')
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des opportunités en attente:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }
  },

  // Approuver une opportunité
  async approveOpportunity(opportunityId, adminId, notes = '') {
    try {
      const { data, error } = await supabase
        .from('pev_opportunities')
        .update({
          status: 'published',
          updated_at: new Date().toISOString()
        })
        .eq('id', opportunityId)
        .select()

      if (error) throw error

      return {
        success: true,
        data: data[0]
      }
    } catch (error) {
      console.error('Erreur lors de l\'approbation:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Rejeter une opportunité
  async rejectOpportunity(opportunityId, adminId, notes = '') {
    try {
      const { data, error } = await supabase
        .from('pev_opportunities')
        .update({
          status: 'draft',
          updated_at: new Date().toISOString()
        })
        .eq('id', opportunityId)
        .select()

      if (error) throw error

      return {
        success: true,
        data: data[0]
      }
    } catch (error) {
      console.error('Erreur lors du rejet:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Récupérer toutes les opportunités avec leur statut
  async getAllOpportunities() {
    try {
      const { data, error } = await supabase
        .from('pev_opportunities')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des opportunités:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }
  },

  // Supprimer une opportunité
  async deleteOpportunity(opportunityId) {
    try {
      const { error } = await supabase
        .from('pev_opportunities')
        .delete()
        .eq('id', opportunityId)

      if (error) throw error

      return {
        success: true
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}
