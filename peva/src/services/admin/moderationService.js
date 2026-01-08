import { supabase } from '@/lib/supabase'
import { emailService } from '@/services/emailService'

/**
 * Service de modération pour l'administration 2iEGreenHub
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
            .eq('status', 'in_review')
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
              pev_profiles:created_by(first_name, last_name, email, avatar_url),
              pev_event_categories:category_id(id, name, icon, color)
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
    console.log('approveContent START:', { contentType, contentId })
    try {
      const updateData = {
        status: 'published',
        updated_at: new Date().toISOString()
      }

      let tableName
      switch (contentType) {
        case 'opportunities':
          tableName = 'pev_opportunities'
          break
        case 'resources':
          tableName = 'pev_resources'
          break
        case 'events':
          tableName = 'pev_events'
          break
        case 'companies':
          tableName = 'pev_companies'
          updateData.is_verified = true
          break
        case 'forum_topics':
          tableName = 'pev_forum_topics'
          break
        case 'forum_posts':
          tableName = 'pev_forum_posts'
          break
        default:
          throw new Error(`Type de contenu non supporté: ${contentType}`)
      }

      console.log('approveContent UPDATE:', { tableName, contentId, updateData })
      
      const { data, error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', contentId)
        .select()

      console.log('approveContent RESULT:', { data, error })

      if (error) throw error

      // Log et email en arrière-plan (non-bloquants)
      this.logModerationAction(moderatorId, 'approve', contentType, contentId, { notes }).catch(() => {})
      this.sendModerationEmail(contentType, contentId, 'approved').catch(() => {})

      return {
        success: true,
        data: data?.[0] || null
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
    console.log('rejectContent START:', { contentType, contentId, reason })
    try {
      const updateData = {
        status: 'rejected',
        updated_at: new Date().toISOString()
      }

      let tableName
      switch (contentType) {
        case 'opportunities':
          tableName = 'pev_opportunities'
          updateData.status = 'draft'
          break
        case 'resources':
          tableName = 'pev_resources'
          break
        case 'events':
          tableName = 'pev_events'
          break
        case 'companies':
          tableName = 'pev_companies'
          break
        case 'forum_topics':
          tableName = 'pev_forum_topics'
          break
        case 'forum_posts':
          tableName = 'pev_forum_posts'
          break
        default:
          throw new Error(`Type de contenu non supporté: ${contentType}`)
      }

      console.log('rejectContent UPDATE:', { tableName, contentId, updateData })
      
      const { data, error } = await supabase
        .from(tableName)
        .update(updateData)
        .eq('id', contentId)
        .select()

      console.log('rejectContent RESULT:', { data, error })

      if (error) throw error

      // Log et email en arrière-plan (non-bloquants)
      this.logModerationAction(moderatorId, 'reject', contentType, contentId, { reason }).catch(() => {})
      this.sendModerationEmail(contentType, contentId, 'rejected', reason).catch(() => {})

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
              pev_profiles:created_by(first_name, last_name, email, avatar_url),
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
              pev_profiles:created_by(first_name, last_name, email, avatar_url)
            `)
            .eq('id', contentId)
            .single()
          break

        case 'events':
          query = supabase
            .from('pev_events')
            .select(`
              *,
              pev_profiles:created_by(first_name, last_name, email, avatar_url),
              pev_event_categories:category_id(id, name, icon, color)
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
        .from('pev_audit_logs')
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
          pending: opportunitiesStats.data?.filter(o => o.status === 'in_review').length || 0,
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
        .from('pev_audit_logs')
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
  },

  /**
   * Envoyer un email de modération au créateur du contenu
   * @param {string} contentType - Type de contenu (opportunities, resources, events)
   * @param {string|number} contentId - ID du contenu
   * @param {string} action - 'approved' ou 'rejected'
   * @param {string} reason - Motif de rejet (optionnel)
   */
  async sendModerationEmail(contentType, contentId, action, reason = '') {
    try {
      // Récupérer les détails du contenu et du créateur
      const details = await this.getContentDetails(contentType, contentId)
      if (!details.success || !details.data) return

      const content = details.data
      const creator = content.pev_profiles || content.creator
      
      if (!creator?.email) {
        console.warn('Email du créateur non trouvé pour la notification')
        return
      }

      // Validation basique de l'email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(creator.email)) {
        console.warn(`Email invalide pour la notification: ${creator.email}`)
        return
      }

      const recipientName = `${creator.first_name || ''} ${creator.last_name || ''}`.trim() || 'Utilisateur'
      const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://2iegreenhub.org'

      // Déterminer le template et les variables selon le type de contenu
      let templateCode, variables

      switch (contentType) {
        case 'opportunities':
          templateCode = action === 'approved' ? 'opportunity_approved' : 'opportunity_rejected'
          variables = {
            recipient_name: recipientName,
            opportunity_title: content.title,
            opportunity_type: content.type || 'Opportunité',
            rejection_reason: reason,
            action_url: `${baseUrl}/opportunities/${contentId}`
          }
          break

        case 'events':
          templateCode = action === 'approved' ? 'event_approved' : 'event_rejected'
          variables = {
            recipient_name: recipientName,
            event_title: content.title,
            event_date: content.start_date ? new Date(content.start_date).toLocaleDateString('fr-FR') : 'Non définie',
            event_location: content.location || 'En ligne',
            rejection_reason: reason,
            action_url: `${baseUrl}/events/${contentId}`
          }
          break

        case 'resources':
          templateCode = action === 'approved' ? 'resource_approved' : 'resource_rejected'
          variables = {
            recipient_name: recipientName,
            resource_title: content.title,
            resource_type: content.type || 'Ressource',
            rejection_reason: reason,
            action_url: `${baseUrl}/resources/${contentId}`
          }
          break

        default:
          console.warn(`Type de contenu non supporté pour les emails: ${contentType}`)
          return
      }

      // Envoyer l'email (en arrière-plan, jamais bloquant)
      emailService.sendTemplateEmail(templateCode, creator.email, variables)
        .then(result => {
          if (result?.success) {
            console.log(`✅ Email de modération (${action}) envoyé à ${creator.email}`)
          } else {
            console.warn(`⚠️ Échec envoi email modération: ${result?.error}`)
          }
        })
        .catch(err => {
          console.warn('Email modération échoué:', err.message)
        })
    } catch (error) {
      console.warn('Erreur email modération (ignorée):', error.message)
    }
  }
}
