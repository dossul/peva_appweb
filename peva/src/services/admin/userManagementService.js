import { supabase } from '@/lib/supabase'

/**
 * Service de gestion des utilisateurs pour l'administration PEVA
 * Basé sur la structure exacte de la table profiles Supabase
 */
export const userManagementService = {
  /**
   * Récupérer tous les utilisateurs avec filtres et pagination
   * @param {Object} options - Options de filtrage et pagination
   * @returns {Promise<Object>} Résultat avec données et métadonnées
   */
  async getAllUsers(options = {}) {
    try {
      const {
        page = 1,
        limit = 50,
        role = null,
        isVerified = null,
        onboardingCompleted = null,
        country = null,
        userType = null,
        search = '',
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = options

      let query = supabase
        .from('pev_profiles')
        .select(`
          id,
          email,
          first_name,
          last_name,
          display_name,
          user_type,
          avatar_url,
          bio,
          location,
          country,
          city,
          sectors,
          website,
          linkedin_url,
          twitter_url,
          phone,
          organization,
          position,
          role,
          is_verified,
          onboarding_completed,
          experience_level,
          language,
          activity_score,
          last_activity,
          created_at,
          updated_at
        `)

      // Filtres
      if (role) {
        query = query.eq('role', role)
      }
      if (isVerified !== null) {
        query = query.eq('is_verified', isVerified)
      }
      if (onboardingCompleted !== null) {
        query = query.eq('onboarding_completed', onboardingCompleted)
      }
      if (country) {
        query = query.eq('country', country)
      }
      if (userType) {
        query = query.eq('user_type', userType)
      }

      // Recherche full-text
      if (search) {
        query = query.or(`
          first_name.ilike.%${search}%,
          last_name.ilike.%${search}%,
          email.ilike.%${search}%,
          organization.ilike.%${search}%,
          display_name.ilike.%${search}%
        `)
      }

      // Tri
      query = query.order(sortBy, { ascending: sortOrder === 'asc' })

      // Pagination
      const from = (page - 1) * limit
      const to = from + limit - 1
      query = query.range(from, to)

      const { data, error, count } = await query

      if (error) throw error

      // Récupérer le total pour la pagination
      const { count: totalCount } = await supabase
        .from('pev_profiles')
        .select('*', { count: 'exact', head: true })

      return {
        success: true,
        data: data || [],
        pagination: {
          page,
          limit,
          total: totalCount || 0,
          totalPages: Math.ceil((totalCount || 0) / limit)
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs:', error)
      return {
        success: false,
        error: error.message,
        data: [],
        pagination: { page: 1, limit: 50, total: 0, totalPages: 0 }
      }
    }
  },

  /**
   * Récupérer les détails complets d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Détails de l'utilisateur
   */
  async getUserDetails(userId) {
    try {
      const { data, error } = await supabase
        .from('pev_profiles')
        .select(`
          *,
          goals,
          sdg_priorities,
          notifications,
          privacy
        `)
        .eq('id', userId)
        .single()

      if (error) throw error

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails utilisateur:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }
  },

  /**
   * Mettre à jour le rôle d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @param {string} newRole - Nouveau rôle (user, moderator, admin, super_admin)
   * @param {string} adminId - ID de l'admin qui effectue l'action
   * @returns {Promise<Object>} Résultat de l'opération
   */
  async updateUserRole(userId, newRole, adminId) {
    try {
      // Vérifier que le rôle est valide
      const validRoles = ['user', 'moderator', 'admin', 'super_admin']
      if (!validRoles.includes(newRole)) {
        throw new Error(`Rôle invalide: ${newRole}`)
      }

      const { data, error } = await supabase
        .from('pev_profiles')
        .update({
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()

      if (error) throw error

      // Log de l'action dans audit_logs
      await this.logAdminAction(adminId, 'update_user_role', {
        target_user_id: userId,
        old_role: data[0]?.role,
        new_role: newRole
      })

      return {
        success: true,
        data: data[0]
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rôle:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Suspendre un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @param {string} reason - Raison de la suspension
   * @param {string} adminId - ID de l'admin
   * @returns {Promise<Object>} Résultat de l'opération
   */
  async suspendUser(userId, reason, adminId) {
    try {
      // Note: Nous utilisons un champ dans les métadonnées pour marquer la suspension
      // car Supabase Auth gère l'état des comptes
      const { data, error } = await supabase
        .from('pev_profiles')
        .update({
          // Marquer comme non vérifié pour empêcher l'accès
          is_verified: false,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()

      if (error) throw error

      // Log de l'action
      await this.logAdminAction(adminId, 'suspend_user', {
        target_user_id: userId,
        reason
      })

      return {
        success: true,
        data: data[0]
      }
    } catch (error) {
      console.error('Erreur lors de la suspension:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Réactiver un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @param {string} adminId - ID de l'admin
   * @returns {Promise<Object>} Résultat de l'opération
   */
  async reactivateUser(userId, adminId) {
    try {
      const { data, error } = await supabase
        .from('pev_profiles')
        .update({
          is_verified: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId)
        .select()

      if (error) throw error

      // Log de l'action
      await this.logAdminAction(adminId, 'reactivate_user', {
        target_user_id: userId
      })

      return {
        success: true,
        data: data[0]
      }
    } catch (error) {
      console.error('Erreur lors de la réactivation:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Récupérer les statistiques d'un utilisateur
   * @param {string} userId - ID de l'utilisateur
   * @returns {Promise<Object>} Statistiques de l'utilisateur
   */
  async getUserStats(userId) {
    try {
      // Récupérer les statistiques depuis différentes tables
      const [
        opportunitiesResult,
        connectionsResult,
        messagesResult,
        eventsResult
      ] = await Promise.all([
        // Opportunités créées
        supabase
          .from('pev_opportunities')
          .select('id', { count: 'exact' })
          .eq('created_by', userId),
        
        // Connexions
        supabase
          .from('pev_connections')
          .select('id', { count: 'exact' })
          .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
          .eq('status', 'accepted'),
        
        // Messages envoyés (si table existe)
        supabase
          .from('pev_messages')
          .select('id', { count: 'exact' })
          .eq('sender_id', userId),
        
        // Événements créés
        supabase
          .from('pev_events')
          .select('id', { count: 'exact' })
          .eq('created_by', userId)
      ])

      return {
        success: true,
        data: {
          opportunities_created: opportunitiesResult.count || 0,
          connections_count: connectionsResult.count || 0,
          messages_sent: messagesResult.count || 0,
          events_created: eventsResult.count || 0
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      return {
        success: false,
        error: error.message,
        data: {
          opportunities_created: 0,
          connections_count: 0,
          messages_sent: 0,
          events_created: 0
        }
      }
    }
  },

  /**
   * Rechercher des utilisateurs
   * @param {string} query - Terme de recherche
   * @param {number} limit - Limite de résultats
   * @returns {Promise<Object>} Résultats de recherche
   */
  async searchUsers(query, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('pev_profiles')
        .select(`
          id,
          first_name,
          last_name,
          display_name,
          email,
          avatar_url,
          organization,
          role,
          is_verified
        `)
        .or(`
          first_name.ilike.%${query}%,
          last_name.ilike.%${query}%,
          email.ilike.%${query}%,
          organization.ilike.%${query}%,
          display_name.ilike.%${query}%
        `)
        .limit(limit)

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('Erreur lors de la recherche:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }
  },

  /**
   * Récupérer les statistiques globales des utilisateurs
   * @returns {Promise<Object>} Statistiques globales
   */
  async getUsersOverview() {
    try {
      const { data, error } = await supabase
        .from('pev_profiles')
        .select(`
          role,
          is_verified,
          onboarding_completed,
          country,
          user_type,
          created_at
        `)

      if (error) throw error

      // Calculer les statistiques
      const stats = {
        total: data.length,
        by_role: {
          user: data.filter(u => u.role === 'user').length,
          moderator: data.filter(u => u.role === 'moderator').length,
          admin: data.filter(u => u.role === 'admin').length,
          super_admin: data.filter(u => u.role === 'super_admin').length
        },
        verified: data.filter(u => u.is_verified).length,
        onboarding_completed: data.filter(u => u.onboarding_completed).length,
        by_country: {},
        by_user_type: {},
        recent_registrations: data.filter(u => {
          const createdAt = new Date(u.created_at)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return createdAt > weekAgo
        }).length
      }

      // Grouper par pays
      data.forEach(user => {
        if (user.country) {
          stats.by_country[user.country] = (stats.by_country[user.country] || 0) + 1
        }
      })

      // Grouper par type d'utilisateur
      data.forEach(user => {
        if (user.user_type) {
          stats.by_user_type[user.user_type] = (stats.by_user_type[user.user_type] || 0) + 1
        }
      })

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
   * Logger une action admin dans audit_logs
   * @param {string} adminId - ID de l'admin
   * @param {string} action - Action effectuée
   * @param {Object} payload - Détails de l'action
   * @returns {Promise<void>}
   */
  async logAdminAction(adminId, action, payload = {}) {
    try {
      await supabase
        .from('pev_audit_logs')
        .insert({
          actor_id: adminId,
          action,
          target_entity: 'user',
          target_id: payload.target_user_id || null,
          payload,
          created_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Erreur lors du logging:', error)
      // Ne pas faire échouer l'opération principale si le log échoue
    }
  }
}
