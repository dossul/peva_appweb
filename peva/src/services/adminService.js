import { supabase } from '@/lib/supabase'

export const adminService = {
  // Récupérer les opportunités en attente de modération
  async getPendingOpportunities() {
    try {
      const { data, error } = await supabase
        .from('opportunities')
        .select(`
          *,
          countries,
          is_multi_country,
          visibility,
          promote_premium,
          send_notifications,
          auto_share_social,
          social_links,
          attachments
        `)
        .eq('moderation_status', 'pending')
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
        .from('opportunities')
        .update({
          moderation_status: 'approved',
          moderated_by: adminId,
          moderated_at: new Date().toISOString(),
          moderation_notes: notes
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
        .from('opportunities')
        .update({
          moderation_status: 'rejected',
          moderated_by: adminId,
          moderated_at: new Date().toISOString(),
          moderation_notes: notes
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
        .from('opportunities')
        .select(`
          *,
          countries,
          moderation_status,
          moderated_by,
          moderated_at,
          moderation_notes
        `)
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
        .from('opportunities')
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
