import { supabase } from '@/lib/supabase'

/**
 * Service de gestion de contenu pour l'administration
 * Gère les opportunités, ressources, événements et posts forum
 */
export const contentManagementService = {
  /**
   * Récupérer toutes les opportunités avec filtres
   */
  async getAllOpportunities(filters = {}) {
    try {
      let query = supabase
        .from('pev_opportunities')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error

      // Récupérer les profils des créateurs
      if (data && data.length > 0) {
        const creatorIds = [...new Set(data.map(o => o.created_by).filter(Boolean))]
        const { data: profiles } = await supabase
          .from('pev_profiles')
          .select('id, first_name, last_name, email')
          .in('id', creatorIds)

        const profilesMap = {}
        profiles?.forEach(p => { profilesMap[p.id] = p })

        data.forEach(opp => {
          opp.creator = profilesMap[opp.created_by] || null
        })
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Erreur récupération opportunités:', error)
      return { success: false, error: error.message, data: [] }
    }
  },

  /**
   * Récupérer toutes les ressources avec filtres
   */
  async getAllResources(filters = {}) {
    try {
      let query = supabase
        .from('pev_resources')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error

      // Récupérer les profils des créateurs
      if (data && data.length > 0) {
        const creatorIds = [...new Set(data.map(r => r.created_by).filter(Boolean))]
        const { data: profiles } = await supabase
          .from('pev_profiles')
          .select('id, first_name, last_name, email')
          .in('id', creatorIds)

        const profilesMap = {}
        profiles?.forEach(p => { profilesMap[p.id] = p })

        data.forEach(res => {
          res.creator = profilesMap[res.created_by] || null
        })
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Erreur récupération ressources:', error)
      return { success: false, error: error.message, data: [] }
    }
  },

  /**
   * Récupérer tous les événements avec filtres
   */
  async getAllEvents(filters = {}) {
    try {
      let query = supabase
        .from('pev_events')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error

      // Récupérer les profils des créateurs
      if (data && data.length > 0) {
        const creatorIds = [...new Set(data.map(e => e.created_by).filter(Boolean))]
        const { data: profiles } = await supabase
          .from('pev_profiles')
          .select('id, first_name, last_name, email')
          .in('id', creatorIds)

        const profilesMap = {}
        profiles?.forEach(p => { profilesMap[p.id] = p })

        data.forEach(event => {
          event.creator = profilesMap[event.created_by] || null
        })
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Erreur récupération événements:', error)
      return { success: false, error: error.message, data: [] }
    }
  },

  /**
   * Récupérer tous les sujets de forum avec filtres
   */
  async getAllForumTopics(filters = {}) {
    try {
      let query = supabase
        .from('pev_forum_topics')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      if (filters.search) {
        query = query.ilike('title', `%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error

      // Récupérer les profils des auteurs
      if (data && data.length > 0) {
        const authorIds = [...new Set(data.map(t => t.author_id).filter(Boolean))]
        const { data: profiles } = await supabase
          .from('pev_profiles')
          .select('id, first_name, last_name, email')
          .in('id', authorIds)

        const profilesMap = {}
        profiles?.forEach(p => { profilesMap[p.id] = p })

        data.forEach(topic => {
          topic.author = profilesMap[topic.author_id] || null
        })
      }

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Erreur récupération sujets forum:', error)
      return { success: false, error: error.message, data: [] }
    }
  },

  /**
   * Mettre à jour le statut d'un contenu
   */
  async updateContentStatus(contentType, contentId, newStatus) {
    try {
      const tableMap = {
        opportunity: 'pev_opportunities',
        resource: 'pev_resources',
        event: 'pev_events',
        forum_topic: 'pev_forum_topics'
      }

      const tableName = tableMap[contentType]
      if (!tableName) throw new Error('Type de contenu invalide')

      const { data, error } = await supabase
        .from(tableName)
        .update({ status: newStatus })
        .eq('id', contentId)
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Erreur mise à jour statut:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Supprimer un contenu
   */
  async deleteContent(contentType, contentId) {
    try {
      const tableMap = {
        opportunity: 'pev_opportunities',
        resource: 'pev_resources',
        event: 'pev_events',
        forum_topic: 'pev_forum_topics'
      }

      const tableName = tableMap[contentType]
      if (!tableName) throw new Error('Type de contenu invalide')

      const { error } = await supabase
        .from(tableName)
        .delete()
        .eq('id', contentId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur suppression contenu:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Récupérer les statistiques de contenu
   */
  async getContentStats() {
    try {
      const [opps, resources, events, topics] = await Promise.all([
        supabase.from('pev_opportunities').select('status'),
        supabase.from('pev_resources').select('status'),
        supabase.from('pev_events').select('status'),
        supabase.from('pev_forum_topics').select('status')
      ])

      const countByStatus = (data) => {
        const result = { total: 0, published: 0, pending: 0, draft: 0, rejected: 0 }
        data?.forEach(item => {
          result.total++
          if (item.status === 'published') result.published++
          else if (item.status === 'pending' || item.status === 'in_review') result.pending++
          else if (item.status === 'draft') result.draft++
          else if (item.status === 'rejected') result.rejected++
        })
        return result
      }

      return {
        success: true,
        data: {
          opportunities: countByStatus(opps.data),
          resources: countByStatus(resources.data),
          events: countByStatus(events.data),
          forum_topics: countByStatus(topics.data)
        }
      }
    } catch (error) {
      console.error('Erreur statistiques contenu:', error)
      return { success: false, error: error.message }
    }
  }
}

export default contentManagementService
