import { supabase } from '@/lib/supabase'

/**
 * Service de modération pour l'administration PEVA
 * Gère la modération de tous les types de contenu
 */
export const moderationService = {
  /**
   * Récupérer le contenu en attente de modération par type
   * @param {string} contentType - Type de contenu (opportunities, resources, events, companies, forum_topics, forum_posts)
   * @param {Object} options - Options de filtrage et pagination
   * @returns {Promise<Object>} Contenu en attente
   */
  async getPendingContent(contentType, options = {}) {
    try {
      const { page = 1, limit = 20, sortBy = 'created_at', sortOrder = 'desc' } = options

      let query
      let selectFields = '*'

      switch (contentType) {
        case 'opportunities':
          query = supabase
            .from('pev_opportunities')
            .select(`
              *,
              pev_profiles:created_by(first_name, last_name, email, avatar_url)
            `)
            .eq('status', 'draft')
          break

        case 'resources':
          query = supabase
            .from('pev_resources')
            .select(`
              *,
              pev_profiles:created_by(first_name, last_name, email, avatar_url)
            `)
            .eq('status', 'in_review')
          break

        case 'events':
          query = supabase
            .from('pev_events')
            .select(`
              *,
              pev_profiles:created_by(first_name, last_name, email, avatar_url)
            `)
            .eq('status', 'in_review')
          break

        case 'companies':
          query = supabase
            .from('pev_companies')
            .select(`
              *,
              pev_profiles:owner_id(first_name, last_name, email, avatar_url)
            `)
            .eq('status', 'in_review')
          break

        case 'forum_topics':
          query = supabase
            .from('pev_forum_topics')
            .select(`
              *,
              pev_profiles:user_id(first_name, last_name, email, avatar_url),
              forum_categories:category_id(name)
            `)
            .eq('status', 'pending')
          break

        case 'forum_posts':
          query = supabase
            .from('pev_forum_posts')
            .select(`
              *,
              pev_profiles:user_id(first_name, last_name, email, avatar_url),
              forum_topics:topic_id(title)
            `)
          break

        default:
          throw new Error(`Type de contenu non supporté: ${contentType}`)
      }

      // Tri et pagination
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })
      
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      return {
        success: true,
        data: data || [],
        pagination: {
          page,
          limit,
          total: count || 0,
          totalPages: Math.ceil((count || 0) / limit)
        }
      }
    } catch (error) {
      console.error(`Erreur lors de la récupération du contenu ${contentType}:`, error)
      return {
        success: false,
        error: error.message,
        data: [],
        pagination: { page: 1, limit: 20, total: 0, totalPages: 0 }
      }
    }
  },

  /**
   * Approuver un contenu
   * @param {string} contentType - Type de contenu
   * @param {string|number} contentId - ID du contenu
   * @param {string} moderatorId - ID du modérateur
   * @param {string} notes - Notes de modération
   * @returns {Promise<Object>} Résultat de l'opération
   */
  async approveContent(contentType, contentId, moderatorId, notes = '') {
    try {
      let updateData = {
        updated_at: new Date().toISOString()
      }
      let query

      switch (contentType) {
        case 'opportunities':
          updateData.status = 'published'
          query = supabase.from('pev_opportunities').update(updateData).eq('id', contentId)
          break

        case 'resources':
          updateData.status = 'published'
          query = supabase.from('pev_resources').update(updateData).eq('id', contentId)
          break

        case 'events':
          updateData.status = 'published'
          query = supabase.from('pev_events').update(updateData).eq('id', contentId)
          break

        case 'companies':
          updateData.status = 'published'
          updateData.is_verified = true
          query = supabase.from('pev_companies').update(updateData).eq('id', contentId)
          break

        case 'forum_topics':
          updateData.status = 'published'
          query = supabase.from('pev_forum_topics').update(updateData).eq('id', contentId)
          break

        case 'forum_posts':
          // Les posts du forum n'ont pas de statut de modération par défaut
          // On peut ajouter une colonne si nécessaire
          query = supabase.from('pev_forum_posts').update(updateData).eq('id', contentId)
          break

        default:
          throw new Error(`Type de contenu non supporté: ${contentType}`)
      }

      const { data, error } = await query.select()

      if (error) throw error

      // Log de l'action
      await this.logModerationAction(moderatorId, 'approve', contentType, contentId, { notes })

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

  /**
   * Rejeter un contenu
   * @param {string} contentType - Type de contenu
   * @param {string|number} contentId - ID du contenu
   * @param {string} moderatorId - ID du modérateur
   * @param {string} reason - Raison du rejet
   * @returns {Promise<Object>} Résultat de l'opération
   */
  async rejectContent(contentType, contentId, moderatorId, reason) {
    try {
      let updateData = {
        updated_at: new Date().toISOString()
      }
      let query

      switch (contentType) {
        case 'opportunities':
          updateData.status = 'draft'
          query = supabase.from('pev_opportunities').update(updateData).eq('id', contentId)
          break

        case 'resources':
          updateData.status = 'rejected'
          query = supabase.from('pev_resources').update(updateData).eq('id', contentId)
          break

        case 'events':
          updateData.status = 'rejected'
          query = supabase.from('pev_events').update(updateData).eq('id', contentId)
          break

        case 'companies':
          updateData.status = 'rejected'
          query = supabase.from('pev_companies').update(updateData).eq('id', contentId)
          break

        case 'forum_topics':
          updateData.status = 'rejected'
          query = supabase.from('pev_forum_topics').update(updateData).eq('id', contentId)
          break

        case 'forum_posts':
          // Supprimer le post rejeté
          query = supabase.from('pev_forum_posts').delete().eq('id', contentId)
          break

        default:
          throw new Error(`Type de contenu non supporté: ${contentType}`)
      }

      const { data, error } = await query.select()

      if (error) throw error

      // Log de l'action
      await this.logModerationAction(moderatorId, 'reject', contentType, contentId, { reason })

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

  /**
   * Récupérer les détails d'un contenu
   * @param {string} contentType - Type de contenu
   * @param {string|number} contentId - ID du contenu
   * @returns {Promise<Object>} Détails du contenu
   */
  async getContentDetails(contentType, contentId) {
    try {
      let query

      switch (contentType) {
        case 'opportunities':
          query = supabase
            .from('pev_opportunities')
            .select(`
              *,
              pev_profiles:created_by(first_name, last_name, email, avatar_url, organization),
              companies:company_id(name, logo_url)
            `)
            .eq('id', contentId)
            .single()
          break

        case 'resources':
          query = supabase
            .from('pev_resources')
            .select(`
              *,
              pev_profiles:created_by(first_name, last_name, email, avatar_url, organization)
            `)
            .eq('id', contentId)
            .single()
          break

        case 'events':
          query = supabase
            .from('pev_events')
            .select(`
              *,
              pev_profiles:created_by(first_name, last_name, email, avatar_url, organization)
            `)
            .eq('id', contentId)
            .single()
          break

        case 'companies':
          query = supabase
            .from('pev_companies')
            .select(`
              *,
              pev_profiles:owner_id(first_name, last_name, email, avatar_url)
            `)
            .eq('id', contentId)
            .single()
          break

        case 'forum_topics':
          query = supabase
            .from('pev_forum_topics')
            .select(`
              *,
              pev_profiles:user_id(first_name, last_name, email, avatar_url),
              forum_categories:category_id(name, description)
            `)
            .eq('id', contentId)
            .single()
          break

        case 'forum_posts':
          query = supabase
            .from('pev_forum_posts')
            .select(`
              *,
              pev_profiles:user_id(first_name, last_name, email, avatar_url),
              forum_topics:topic_id(title, category_id)
            `)
            .eq('id', contentId)
            .single()
          break

        default:
          throw new Error(`Type de contenu non supporté: ${contentType}`)
      }

      const { data, error } = await query

      if (error) throw error

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }
  },

  /**
   * Récupérer l'historique de modération d'un contenu
   * @param {string} contentType - Type de contenu
   * @param {string|number} contentId - ID du contenu
   * @returns {Promise<Object>} Historique de modération
   */
  async getModerationHistory(contentType, contentId) {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .select(`
          *,
          profiles:actor_id(first_name, last_name, email)
        `)
        .eq('target_entity', contentType)
        .eq('target_id', contentId.toString())
        .in('action', ['approve', 'reject', 'moderate'])
        .order('created_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'historique:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }
  },

  /**
   * Modération en masse
   * @param {string} contentType - Type de contenu
   * @param {Array} contentIds - IDs des contenus
   * @param {string} action - Action (approve/reject)
   * @param {string} moderatorId - ID du modérateur
   * @param {string} reason - Raison (pour les rejets)
   * @returns {Promise<Object>} Résultat de l'opération
   */
  async bulkModerate(contentType, contentIds, action, moderatorId, reason = '') {
    try {
      const results = []
      
      for (const contentId of contentIds) {
        let result
        if (action === 'approve') {
          result = await this.approveContent(contentType, contentId, moderatorId, reason)
        } else if (action === 'reject') {
          result = await this.rejectContent(contentType, contentId, moderatorId, reason)
        }
        results.push({ contentId, success: result.success, error: result.error })
      }

      const successCount = results.filter(r => r.success).length
      const errorCount = results.filter(r => !r.success).length

      return {
        success: true,
        data: {
          total: contentIds.length,
          success: successCount,
          errors: errorCount,
          results
        }
      }
    } catch (error) {
      console.error('Erreur lors de la modération en masse:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Récupérer les statistiques de modération
   * @returns {Promise<Object>} Statistiques de modération
   */
  async getModerationStats() {
    try {
      const [
        opportunitiesStats,
        resourcesStats,
        eventsStats,
        companiesStats,
        forumStats
      ] = await Promise.all([
        // Opportunités
        supabase
          .from('pev_opportunities')
          .select('status', { count: 'exact' }),
        
        // Ressources
        supabase
          .from('pev_resources')
          .select('status', { count: 'exact' }),
        
        // Événements
        supabase
          .from('pev_events')
          .select('status', { count: 'exact' }),
        
        // Entreprises
        supabase
          .from('pev_companies')
          .select('status', { count: 'exact' }),
        
        // Forum topics
        supabase
          .from('pev_forum_topics')
          .select('status', { count: 'exact' })
      ])

      // Calculer les statistiques
      const stats = {
        opportunities: {
          pending: opportunitiesStats.data?.filter(o => o.status === 'draft').length || 0,
          approved: opportunitiesStats.data?.filter(o => o.status === 'published').length || 0,
          rejected: 0,
          total: opportunitiesStats.count || 0
        },
        resources: {
          pending: resourcesStats.data?.filter(r => r.status === 'in_review').length || 0,
          published: resourcesStats.data?.filter(r => r.status === 'published').length || 0,
          rejected: resourcesStats.data?.filter(r => r.status === 'rejected').length || 0,
          total: resourcesStats.count || 0
        },
        events: {
          pending: eventsStats.data?.filter(e => e.status === 'in_review').length || 0,
          published: eventsStats.data?.filter(e => e.status === 'published').length || 0,
          rejected: eventsStats.data?.filter(e => e.status === 'rejected').length || 0,
          total: eventsStats.count || 0
        },
        companies: {
          pending: companiesStats.data?.filter(c => c.status === 'in_review').length || 0,
          published: companiesStats.data?.filter(c => c.status === 'published').length || 0,
          rejected: companiesStats.data?.filter(c => c.status === 'rejected').length || 0,
          total: companiesStats.count || 0
        },
        forum: {
          pending: forumStats.data?.filter(t => t.status === 'pending').length || 0,
          published: forumStats.data?.filter(t => t.status === 'published').length || 0,
          total: forumStats.count || 0
        }
      }

      // Calculer les totaux
      stats.totals = {
        pending: stats.opportunities.pending + stats.resources.pending + stats.events.pending + stats.companies.pending + stats.forum.pending,
        approved: stats.opportunities.approved + stats.resources.published + stats.events.published + stats.companies.published + stats.forum.published,
        rejected: stats.opportunities.rejected + stats.resources.rejected + stats.events.rejected + stats.companies.rejected
      }

      return {
        success: true,
        data: stats
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }
  },

  /**
   * Logger une action de modération
   * @param {string} moderatorId - ID du modérateur
   * @param {string} action - Action effectuée
   * @param {string} contentType - Type de contenu
   * @param {string|number} contentId - ID du contenu
   * @param {Object} payload - Détails de l'action
   * @returns {Promise<void>}
   */
  async logModerationAction(moderatorId, action, contentType, contentId, payload = {}) {
    try {
      await supabase
        .from('audit_logs')
        .insert({
          actor_id: moderatorId,
          action: `${action}_${contentType}`,
          target_entity: contentType,
          target_id: contentId.toString(),
          payload,
          created_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Erreur lors du logging de modération:', error)
      // Ne pas faire échouer l'opération principale si le log échoue
    }
  }
}
