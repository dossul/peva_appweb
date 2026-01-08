import { supabase } from '@/lib/supabase'
import { emailService } from '@/services/emailService'

/**
 * Service de gestion des signalements pour l'administration
 * Gère les signalements de contenu et les actions associées
 */
export const reportsService = {
  /**
   * Récupérer tous les signalements avec filtres
   * @param {Object} filters - Filtres (status, priority, target_type)
   * @returns {Promise<Object>} Liste des signalements
   */
  async getReports(filters = {}) {
    try {
      let query = supabase
        .from('pev_reports')
        .select(`
          *,
          reporter:reporter_id(id, first_name, last_name, email, avatar_url),
          reviewer:reviewed_by(id, first_name, last_name)
        `)
        .order('created_at', { ascending: false })

      if (filters.status && filters.status !== 'all') {
        query = query.eq('status', filters.status)
      }

      if (filters.priority && filters.priority !== 'all') {
        query = query.eq('priority', filters.priority)
      }

      if (filters.target_type && filters.target_type !== 'all') {
        query = query.eq('target_type', filters.target_type)
      }

      const { data, error } = await query

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('Erreur récupération signalements:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }
  },

  /**
   * Récupérer un signalement par ID
   * @param {string} reportId - ID du signalement
   * @returns {Promise<Object>} Signalement
   */
  async getReportById(reportId) {
    try {
      const { data, error } = await supabase
        .from('pev_reports')
        .select(`
          *,
          reporter:reporter_id(id, first_name, last_name, email, avatar_url),
          reviewer:reviewed_by(id, first_name, last_name)
        `)
        .eq('id', reportId)
        .single()

      if (error) throw error

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Erreur récupération signalement:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Récupérer le contenu signalé
   * @param {string} targetType - Type de contenu
   * @param {string} targetId - ID du contenu
   * @returns {Promise<Object>} Contenu signalé
   */
  async getReportedContent(targetType, targetId) {
    try {
      let tableName = ''
      let selectFields = '*'

      switch (targetType) {
        case 'opportunity':
          tableName = 'pev_opportunities'
          selectFields = '*, creator:created_by(id, first_name, last_name, email)'
          break
        case 'event':
          tableName = 'pev_events'
          selectFields = '*, creator:created_by(id, first_name, last_name, email)'
          break
        case 'resource':
          tableName = 'pev_resources'
          selectFields = '*, creator:created_by(id, first_name, last_name, email)'
          break
        case 'forum_topic':
          tableName = 'pev_forum_topics'
          selectFields = '*, author:author_id(id, first_name, last_name, email)'
          break
        case 'forum_post':
          tableName = 'pev_forum_posts'
          selectFields = '*, author:author_id(id, first_name, last_name, email)'
          break
        case 'user':
          tableName = 'pev_profiles'
          selectFields = 'id, first_name, last_name, email, avatar_url, organization, role'
          break
        case 'company':
          tableName = 'pev_companies'
          selectFields = '*, owner:owner_id(id, first_name, last_name, email)'
          break
        default:
          return { success: false, error: 'Type de contenu non supporté' }
      }

      const { data, error } = await supabase
        .from(tableName)
        .select(selectFields)
        .eq('id', targetId)
        .single()

      if (error) throw error

      return {
        success: true,
        data,
        targetType
      }
    } catch (error) {
      console.error('Erreur récupération contenu signalé:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Mettre à jour le statut d'un signalement
   * @param {string} reportId - ID du signalement
   * @param {string} status - Nouveau statut
   * @param {string} adminNotes - Notes admin
   * @param {string} adminId - ID de l'admin
   * @returns {Promise<Object>} Résultat
   */
  async updateReportStatus(reportId, status, adminNotes, adminId) {
    try {
      const { data, error } = await supabase
        .from('pev_reports')
        .update({
          status,
          admin_notes: adminNotes,
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reportId)
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Erreur mise à jour signalement:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Résoudre un signalement avec action sur le contenu
   * @param {string} reportId - ID du signalement
   * @param {string} action - Action à effectuer ('delete', 'modify', 'warn', 'dismiss')
   * @param {string} adminNotes - Notes admin
   * @param {string} adminId - ID de l'admin
   * @returns {Promise<Object>} Résultat
   */
  async resolveReport(reportId, action, adminNotes, adminId) {
    try {
      // 1. Récupérer le signalement
      const { data: report, error: reportError } = await supabase
        .from('pev_reports')
        .select(`
          *,
          reporter:reporter_id(id, first_name, last_name, email)
        `)
        .eq('id', reportId)
        .single()

      if (reportError) throw reportError

      // 2. Récupérer le contenu et l'auteur
      const contentResult = await this.getReportedContent(report.target_type, report.target_id)
      if (!contentResult.success) throw new Error(contentResult.error)

      const content = contentResult.data
      const authorEmail = content.creator?.email || content.author?.email || content.owner?.email || content.email
      const authorName = content.creator 
        ? `${content.creator.first_name} ${content.creator.last_name}`
        : content.author 
          ? `${content.author.first_name} ${content.author.last_name}`
          : content.owner
            ? `${content.owner.first_name} ${content.owner.last_name}`
            : `${content.first_name || ''} ${content.last_name || ''}`
      
      const contentTitle = content.title || content.name || content.first_name || 'Contenu'
      const platformUrl = typeof window !== 'undefined' ? window.location.origin : 'https://2iegreenhub.org'

      // 3. Exécuter l'action
      let actionTaken = ''
      if (action === 'delete') {
        await this._deleteContent(report.target_type, report.target_id)
        actionTaken = 'Suppression du contenu'
      } else if (action === 'warn') {
        actionTaken = 'Avertissement envoyé'
      } else if (action === 'modify') {
        actionTaken = 'Demande de modification'
      }

      // 4. Mettre à jour le signalement
      const newStatus = action === 'dismiss' ? 'dismissed' : 'resolved'
      await supabase
        .from('pev_reports')
        .update({
          status: newStatus,
          admin_notes: adminNotes,
          reviewed_by: adminId,
          reviewed_at: new Date().toISOString()
        })
        .eq('id', reportId)

      // 5. Envoyer emails si action prise (pas dismiss)
      if (action !== 'dismiss' && authorEmail) {
        // Email 1: Notification du signalement à l'auteur
        try {
          await emailService.sendTemplateEmail('content_reported', authorEmail, {
            recipient_name: authorName.trim() || 'Utilisateur',
            content_title: contentTitle,
            content_type: this._getContentTypeLabel(report.target_type),
            report_reason: report.content,
            platform_url: platformUrl
          })
        } catch (e) {
          console.warn('Erreur email signalement:', e)
        }

        // Email 2: Notification de l'action prise à l'auteur
        try {
          await emailService.sendTemplateEmail('report_action_taken', authorEmail, {
            recipient_name: authorName.trim() || 'Utilisateur',
            content_title: contentTitle,
            content_type: this._getContentTypeLabel(report.target_type),
            action_taken: actionTaken,
            admin_notes: adminNotes || 'Aucune note supplémentaire',
            platform_url: platformUrl
          })
        } catch (e) {
          console.warn('Erreur email action:', e)
        }
      }

      // 6. Notifier le signaleur
      if (report.reporter?.email) {
        try {
          await emailService.sendTemplateEmail('report_resolved', report.reporter.email, {
            recipient_name: `${report.reporter.first_name} ${report.reporter.last_name}`.trim(),
            content_type: this._getContentTypeLabel(report.target_type),
            resolution_status: action === 'dismiss' ? 'rejeté' : 'traité et résolu',
            platform_url: platformUrl
          })
        } catch (e) {
          console.warn('Erreur email signaleur:', e)
        }
      }

      return {
        success: true,
        action: actionTaken || (action === 'dismiss' ? 'Signalement rejeté' : 'Résolu')
      }
    } catch (error) {
      console.error('Erreur résolution signalement:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Rejeter un signalement
   * @param {string} reportId - ID du signalement
   * @param {string} adminNotes - Notes admin
   * @param {string} adminId - ID de l'admin
   * @returns {Promise<Object>} Résultat
   */
  async dismissReport(reportId, adminNotes, adminId) {
    return this.resolveReport(reportId, 'dismiss', adminNotes, adminId)
  },

  /**
   * Récupérer les statistiques des signalements
   * @returns {Promise<Object>} Statistiques
   */
  async getReportsStats() {
    try {
      const { data, error } = await supabase
        .from('pev_reports')
        .select('status, priority')

      if (error) throw error

      const stats = {
        total: data.length,
        pending: data.filter(r => r.status === 'pending').length,
        reviewed: data.filter(r => r.status === 'reviewed').length,
        resolved: data.filter(r => r.status === 'resolved').length,
        dismissed: data.filter(r => r.status === 'dismissed').length,
        byPriority: {
          critical: data.filter(r => r.priority === 'critical' && r.status === 'pending').length,
          high: data.filter(r => r.priority === 'high' && r.status === 'pending').length,
          medium: data.filter(r => r.priority === 'medium' && r.status === 'pending').length,
          low: data.filter(r => r.priority === 'low' && r.status === 'pending').length
        }
      }

      return {
        success: true,
        data: stats
      }
    } catch (error) {
      console.error('Erreur statistiques signalements:', error)
      return {
        success: false,
        error: error.message,
        data: { total: 0, pending: 0, resolved: 0, dismissed: 0 }
      }
    }
  },

  /**
   * Créer un signalement (côté utilisateur)
   * @param {Object} reportData - Données du signalement
   * @returns {Promise<Object>} Résultat
   */
  async createReport(reportData) {
    try {
      const { data, error } = await supabase
        .from('pev_reports')
        .insert([{
          content: reportData.content,
          reporter_id: reportData.reporter_id,
          target_type: reportData.target_type,
          target_id: reportData.target_id,
          priority: reportData.priority || 'medium'
        }])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Erreur création signalement:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // === Méthodes privées ===

  /**
   * Supprimer le contenu signalé
   */
  async _deleteContent(targetType, targetId) {
    let tableName = ''
    switch (targetType) {
      case 'opportunity':
        tableName = 'pev_opportunities'
        break
      case 'event':
        tableName = 'pev_events'
        break
      case 'resource':
        tableName = 'pev_resources'
        break
      case 'forum_topic':
        tableName = 'pev_forum_topics'
        break
      case 'forum_post':
        tableName = 'pev_forum_posts'
        break
      default:
        return
    }

    if (tableName) {
      await supabase.from(tableName).delete().eq('id', targetId)
    }
  },

  /**
   * Obtenir le libellé du type de contenu
   */
  _getContentTypeLabel(targetType) {
    const labels = {
      opportunity: 'Opportunité',
      event: 'Événement',
      resource: 'Ressource',
      forum_topic: 'Sujet de forum',
      forum_post: 'Message de forum',
      user: 'Profil utilisateur',
      company: 'Entreprise',
      message: 'Message privé'
    }
    return labels[targetType] || targetType
  }
}

export default reportsService
