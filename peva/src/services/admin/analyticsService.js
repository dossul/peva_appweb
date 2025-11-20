import { supabase } from '@/lib/supabase'

/**
 * Service d'analytics pour l'administration PEVA
 * Fournit des métriques et statistiques détaillées de la plateforme
 */
export const analyticsService = {
  /**
   * Récupérer les KPIs principaux du dashboard
   * @returns {Promise<Object>} KPIs principaux
   */
  async getDashboardKPIs() {
    try {
      const [
        usersResult,
        companiesResult,
        opportunitiesResult,
        eventsResult,
        resourcesResult,
        connectionsResult
      ] = await Promise.all([
        // Statistiques utilisateurs
        supabase
          .from('profiles')
          .select('id, role, is_verified, onboarding_completed, created_at')
          .order('created_at', { ascending: false }),
        
        // Statistiques entreprises
        supabase
          .from('companies')
          .select('id, status, is_verified, created_at')
          .order('created_at', { ascending: false }),
        
        // Statistiques opportunités
        supabase
          .from('opportunities')
          .select('id, moderation_status, status, views_count, applications_count, created_at')
          .order('created_at', { ascending: false }),
        
        // Statistiques événements
        supabase
          .from('events')
          .select('id, status, created_at')
          .order('created_at', { ascending: false }),
        
        // Statistiques ressources
        supabase
          .from('resources')
          .select('id, status, created_at')
          .order('created_at', { ascending: false }),
        
        // Statistiques connexions
        supabase
          .from('connections')
          .select('id, status, created_at')
          .order('created_at', { ascending: false })
      ])

      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

      // Calculer les KPIs
      const users = usersResult.data || []
      const companies = companiesResult.data || []
      const opportunities = opportunitiesResult.data || []
      const events = eventsResult.data || []
      const resources = resourcesResult.data || []
      const connections = connectionsResult.data || []

      const kpis = {
        // Utilisateurs
        users: {
          total: users.length,
          new_this_week: users.filter(u => new Date(u.created_at) > weekAgo).length,
          new_this_month: users.filter(u => new Date(u.created_at) > monthAgo).length,
          verified: users.filter(u => u.is_verified).length,
          onboarding_completed: users.filter(u => u.onboarding_completed).length,
          by_role: {
            user: users.filter(u => u.role === 'user').length,
            moderator: users.filter(u => u.role === 'moderator').length,
            admin: users.filter(u => u.role === 'admin').length,
            super_admin: users.filter(u => u.role === 'super_admin').length
          }
        },
        
        // Entreprises
        companies: {
          total: companies.length,
          new_this_week: companies.filter(c => new Date(c.created_at) > weekAgo).length,
          new_this_month: companies.filter(c => new Date(c.created_at) > monthAgo).length,
          verified: companies.filter(c => c.is_verified).length,
          by_status: {
            published: companies.filter(c => c.status === 'published').length,
            in_review: companies.filter(c => c.status === 'in_review').length,
            rejected: companies.filter(c => c.status === 'rejected').length
          }
        },
        
        // Opportunités
        opportunities: {
          total: opportunities.length,
          new_this_week: opportunities.filter(o => new Date(o.created_at) > weekAgo).length,
          new_this_month: opportunities.filter(o => new Date(o.created_at) > monthAgo).length,
          total_views: opportunities.reduce((sum, o) => sum + (o.views_count || 0), 0),
          total_applications: opportunities.reduce((sum, o) => sum + (o.applications_count || 0), 0),
          by_moderation_status: {
            pending: opportunities.filter(o => o.moderation_status === 'pending').length,
            approved: opportunities.filter(o => o.moderation_status === 'approved').length,
            rejected: opportunities.filter(o => o.moderation_status === 'rejected').length
          },
          by_status: {
            active: opportunities.filter(o => o.status === 'active').length,
            closed: opportunities.filter(o => o.status === 'closed').length,
            draft: opportunities.filter(o => o.status === 'draft').length
          }
        },
        
        // Événements
        events: {
          total: events.length,
          new_this_week: events.filter(e => new Date(e.created_at) > weekAgo).length,
          new_this_month: events.filter(e => new Date(e.created_at) > monthAgo).length,
          by_status: {
            published: events.filter(e => e.status === 'published').length,
            in_review: events.filter(e => e.status === 'in_review').length,
            rejected: events.filter(e => e.status === 'rejected').length
          }
        },
        
        // Ressources
        resources: {
          total: resources.length,
          new_this_week: resources.filter(r => new Date(r.created_at) > weekAgo).length,
          new_this_month: resources.filter(r => new Date(r.created_at) > monthAgo).length,
          by_status: {
            published: resources.filter(r => r.status === 'published').length,
            in_review: resources.filter(r => r.status === 'in_review').length,
            rejected: resources.filter(r => r.status === 'rejected').length
          }
        },
        
        // Connexions
        connections: {
          total: connections.length,
          new_this_week: connections.filter(c => new Date(c.created_at) > weekAgo).length,
          new_this_month: connections.filter(c => new Date(c.created_at) > monthAgo).length,
          by_status: {
            accepted: connections.filter(c => c.status === 'accepted').length,
            pending: connections.filter(c => c.status === 'pending').length,
            rejected: connections.filter(c => c.status === 'rejected').length
          }
        }
      }

      return {
        success: true,
        data: kpis
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des KPIs:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }
  },

  /**
   * Récupérer les statistiques de croissance des utilisateurs
   * @param {string} period - Période (7d, 30d, 90d, 1y)
   * @returns {Promise<Object>} Données de croissance
   */
  async getUserGrowthStats(period = '30d') {
    try {
      const days = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365
      }[period] || 30

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data, error } = await supabase
        .from('profiles')
        .select('created_at, role')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      // Grouper par jour
      const dailyStats = {}
      const currentDate = new Date(startDate)
      
      // Initialiser tous les jours avec 0
      while (currentDate <= new Date()) {
        const dateKey = currentDate.toISOString().split('T')[0]
        dailyStats[dateKey] = { total: 0, users: 0, admins: 0 }
        currentDate.setDate(currentDate.getDate() + 1)
      }

      // Compter les inscriptions par jour
      data.forEach(user => {
        const dateKey = user.created_at.split('T')[0]
        if (dailyStats[dateKey]) {
          dailyStats[dateKey].total++
          if (['admin', 'super_admin'].includes(user.role)) {
            dailyStats[dateKey].admins++
          } else {
            dailyStats[dateKey].users++
          }
        }
      })

      // Convertir en format pour graphiques
      const chartData = Object.entries(dailyStats).map(([date, stats]) => ({
        date,
        total: stats.total,
        users: stats.users,
        admins: stats.admins
      }))

      return {
        success: true,
        data: {
          period,
          total_new_users: data.length,
          daily_stats: chartData
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des stats de croissance:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }
  },

  /**
   * Récupérer les statistiques de contenu par type
   * @param {string} contentType - Type de contenu
   * @param {string} period - Période
   * @returns {Promise<Object>} Statistiques de contenu
   */
  async getContentStats(contentType, period = '30d') {
    try {
      const days = {
        '7d': 7,
        '30d': 30,
        '90d': 90,
        '1y': 365
      }[period] || 30

      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      let query
      let statusField = 'status'

      switch (contentType) {
        case 'opportunities':
          statusField = 'moderation_status'
          query = supabase
            .from('opportunities')
            .select('created_at, moderation_status, status, views_count, applications_count')
          break
        case 'companies':
          query = supabase
            .from('companies')
            .select('created_at, status, is_verified')
          break
        case 'events':
          query = supabase
            .from('events')
            .select('created_at, status')
          break
        case 'resources':
          query = supabase
            .from('resources')
            .select('created_at, status')
          break
        default:
          throw new Error(`Type de contenu non supporté: ${contentType}`)
      }

      const { data, error } = await query
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: true })

      if (error) throw error

      // Statistiques par statut
      const statusStats = {}
      data.forEach(item => {
        const status = item[statusField] || 'unknown'
        statusStats[status] = (statusStats[status] || 0) + 1
      })

      // Statistiques par jour
      const dailyStats = {}
      const currentDate = new Date(startDate)
      
      while (currentDate <= new Date()) {
        const dateKey = currentDate.toISOString().split('T')[0]
        dailyStats[dateKey] = 0
        currentDate.setDate(currentDate.getDate() + 1)
      }

      data.forEach(item => {
        const dateKey = item.created_at.split('T')[0]
        if (dailyStats[dateKey] !== undefined) {
          dailyStats[dateKey]++
        }
      })

      const chartData = Object.entries(dailyStats).map(([date, count]) => ({
        date,
        count
      }))

      const result = {
        period,
        total: data.length,
        by_status: statusStats,
        daily_creation: chartData
      }

      // Ajouter des métriques spécifiques aux opportunités
      if (contentType === 'opportunities') {
        result.total_views = data.reduce((sum, o) => sum + (o.views_count || 0), 0)
        result.total_applications = data.reduce((sum, o) => sum + (o.applications_count || 0), 0)
        result.avg_views_per_opportunity = result.total_views / (data.length || 1)
        result.avg_applications_per_opportunity = result.total_applications / (data.length || 1)
      }

      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des stats de contenu:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }
  },

  /**
   * Récupérer les métriques d'engagement
   * @returns {Promise<Object>} Métriques d'engagement
   */
  async getEngagementMetrics() {
    try {
      const [
        activeUsersResult,
        opportunityViewsResult,
        connectionsResult,
        messagesResult
      ] = await Promise.all([
        // Utilisateurs actifs (dernière activité < 30 jours)
        supabase
          .from('profiles')
          .select('last_activity')
          .gte('last_activity', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        
        // Vues d'opportunités
        supabase
          .from('opportunities')
          .select('views_count'),
        
        // Connexions actives
        supabase
          .from('connections')
          .select('status')
          .eq('status', 'accepted'),
        
        // Messages (si la table existe)
        supabase
          .from('messages')
          .select('id')
          .gte('created_at', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
      ])

      const metrics = {
        active_users_30d: activeUsersResult.data?.length || 0,
        total_opportunity_views: opportunityViewsResult.data?.reduce((sum, o) => sum + (o.views_count || 0), 0) || 0,
        active_connections: connectionsResult.data?.length || 0,
        messages_30d: messagesResult.data?.length || 0
      }

      // Calculer les taux d'engagement
      const totalUsers = await supabase.from('profiles').select('id', { count: 'exact' })
      const totalOpportunities = await supabase.from('opportunities').select('id', { count: 'exact' })

      metrics.user_engagement_rate = totalUsers.count > 0 ? (metrics.active_users_30d / totalUsers.count * 100).toFixed(1) : 0
      metrics.avg_views_per_opportunity = totalOpportunities.count > 0 ? (metrics.total_opportunity_views / totalOpportunities.count).toFixed(1) : 0

      return {
        success: true,
        data: metrics
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des métriques d\'engagement:', error)
      return {
        success: false,
        error: error.message,
        data: {
          active_users_30d: 0,
          total_opportunity_views: 0,
          active_connections: 0,
          messages_30d: 0,
          user_engagement_rate: 0,
          avg_views_per_opportunity: 0
        }
      }
    }
  },

  /**
   * Récupérer la distribution géographique
   * @returns {Promise<Object>} Distribution par pays
   */
  async getGeographicDistribution() {
    try {
      const [usersResult, companiesResult, opportunitiesResult] = await Promise.all([
        supabase.from('profiles').select('country'),
        supabase.from('companies').select('country'),
        supabase.from('opportunities').select('country, countries')
      ])

      const distribution = {
        users: {},
        companies: {},
        opportunities: {}
      }

      // Compter les utilisateurs par pays
      usersResult.data?.forEach(user => {
        if (user.country) {
          distribution.users[user.country] = (distribution.users[user.country] || 0) + 1
        }
      })

      // Compter les entreprises par pays
      companiesResult.data?.forEach(company => {
        if (company.country) {
          distribution.companies[company.country] = (distribution.companies[company.country] || 0) + 1
        }
      })

      // Compter les opportunités par pays
      opportunitiesResult.data?.forEach(opportunity => {
        if (opportunity.countries && Array.isArray(opportunity.countries)) {
          opportunity.countries.forEach(country => {
            distribution.opportunities[country] = (distribution.opportunities[country] || 0) + 1
          })
        } else if (opportunity.country) {
          distribution.opportunities[opportunity.country] = (distribution.opportunities[opportunity.country] || 0) + 1
        }
      })

      return {
        success: true,
        data: distribution
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la distribution géographique:', error)
      return {
        success: false,
        error: error.message,
        data: { users: {}, companies: {}, opportunities: {} }
      }
    }
  },

  /**
   * Générer un rapport personnalisé
   * @param {Object} options - Options du rapport
   * @returns {Promise<Object>} Rapport généré
   */
  async generateReport(options = {}) {
    try {
      const {
        startDate,
        endDate,
        includeUsers = true,
        includeCompanies = true,
        includeOpportunities = true,
        includeEvents = true,
        includeResources = true
      } = options

      const report = {
        generated_at: new Date().toISOString(),
        period: { start: startDate, end: endDate },
        sections: {}
      }

      const promises = []

      if (includeUsers) {
        promises.push(
          this.getUserGrowthStats('30d').then(result => {
            report.sections.users = result.data
          })
        )
      }

      if (includeOpportunities) {
        promises.push(
          this.getContentStats('opportunities', '30d').then(result => {
            report.sections.opportunities = result.data
          })
        )
      }

      if (includeCompanies) {
        promises.push(
          this.getContentStats('companies', '30d').then(result => {
            report.sections.companies = result.data
          })
        )
      }

      if (includeEvents) {
        promises.push(
          this.getContentStats('events', '30d').then(result => {
            report.sections.events = result.data
          })
        )
      }

      if (includeResources) {
        promises.push(
          this.getContentStats('resources', '30d').then(result => {
            report.sections.resources = result.data
          })
        )
      }

      await Promise.all(promises)

      return {
        success: true,
        data: report
      }
    } catch (error) {
      console.error('Erreur lors de la génération du rapport:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }
  }
}
