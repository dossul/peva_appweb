import { supabase } from '@/lib/supabase'

/**
 * Service de gestion des entreprises pour l'administration PEVA
 * Basé sur la structure exacte de la table companies Supabase
 */
export const companyManagementService = {
  /**
   * Récupérer toutes les entreprises avec filtres et pagination
   * @param {Object} options - Options de filtrage et pagination
   * @returns {Promise<Object>} Résultat avec données et métadonnées
   */
  async getAllCompanies(options = {}) {
    try {
      const {
        page = 1,
        limit = 50,
        status = null,
        isVerified = null,
        country = null,
        industry = null,
        search = '',
        sortBy = 'created_at',
        sortOrder = 'desc'
      } = options

      let query = supabase
        .from('pev_companies')
        .select(`
          id,
          owner_id,
          name,
          slug,
          description,
          mission,
          industry,
          size,
          founded_year,
          headquarters,
          country,
          city,
          logo_url,
          cover_image_url,
          website,
          email,
          phone,
          activity_sector,
          employees,
          latitude,
          longitude,
          is_verified,
          status,
          created_at,
          updated_at,
          profiles:owner_id(first_name, last_name, email, avatar_url)
        `)

      // Filtres
      if (status) {
        query = query.eq('status', status)
      }
      if (isVerified !== null) {
        query = query.eq('is_verified', isVerified)
      }
      if (country) {
        query = query.eq('country', country)
      }
      if (industry) {
        query = query.eq('industry', industry)
      }

      // Recherche full-text
      if (search) {
        query = query.or(`
          name.ilike.%${search}%,
          description.ilike.%${search}%,
          mission.ilike.%${search}%,
          industry.ilike.%${search}%,
          headquarters.ilike.%${search}%
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
        .from('pev_companies')
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
      console.error('Erreur lors de la récupération des entreprises:', error)
      return {
        success: false,
        error: error.message,
        data: [],
        pagination: { page: 1, limit: 50, total: 0, totalPages: 0 }
      }
    }
  },

  /**
   * Récupérer les détails complets d'une entreprise
   * @param {number} companyId - ID de l'entreprise
   * @returns {Promise<Object>} Détails de l'entreprise
   */
  async getCompanyDetails(companyId) {
    try {
      const { data, error } = await supabase
        .from('pev_companies')
        .select(`
          *,
          pev_profiles:owner_id(first_name, last_name, email, avatar_url, organization, phone),
          company_members(
            id,
            role,
            joined_at,
            profiles:user_id(first_name, last_name, email, avatar_url)
          )
        `)
        .eq('id', companyId)
        .single()

      if (error) throw error

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des détails entreprise:', error)
      return {
        success: false,
        error: error.message,
        data: null
      }
    }
  },

  /**
   * Vérifier une entreprise
   * @param {number} companyId - ID de l'entreprise
   * @param {string} adminId - ID de l'admin qui effectue l'action
   * @param {Object} verificationData - Données de vérification
   * @returns {Promise<Object>} Résultat de l'opération
   */
  async verifyCompany(companyId, adminId, verificationData = {}) {
    try {
      const { notes = '', documents = [] } = verificationData

      const { data, error } = await supabase
        .from('pev_companies')
        .update({
          is_verified: true,
          status: 'published',
          updated_at: new Date().toISOString()
        })
        .eq('id', companyId)
        .select()

      if (error) throw error

      // Log de l'action dans audit_logs
      await this.logCompanyAction(adminId, 'verify_company', {
        company_id: companyId,
        notes,
        documents
      })

      return {
        success: true,
        data: data[0]
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Rejeter une entreprise
   * @param {number} companyId - ID de l'entreprise
   * @param {string} adminId - ID de l'admin
   * @param {string} reason - Raison du rejet
   * @returns {Promise<Object>} Résultat de l'opération
   */
  async rejectCompany(companyId, adminId, reason) {
    try {
      const { data, error } = await supabase
        .from('pev_companies')
        .update({
          is_verified: false,
          status: 'rejected',
          updated_at: new Date().toISOString()
        })
        .eq('id', companyId)
        .select()

      if (error) throw error

      // Log de l'action
      await this.logCompanyAction(adminId, 'reject_company', {
        company_id: companyId,
        reason
      })

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
   * Mettre à jour le statut d'une entreprise
   * @param {number} companyId - ID de l'entreprise
   * @param {string} newStatus - Nouveau statut
   * @param {string} adminId - ID de l'admin
   * @returns {Promise<Object>} Résultat de l'opération
   */
  async updateCompanyStatus(companyId, newStatus, adminId) {
    try {
      // Vérifier que le statut est valide
      const validStatuses = ['draft', 'in_review', 'published', 'rejected']
      if (!validStatuses.includes(newStatus)) {
        throw new Error(`Statut invalide: ${newStatus}`)
      }

      const { data, error } = await supabase
        .from('pev_companies')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', companyId)
        .select()

      if (error) throw error

      // Log de l'action
      await this.logCompanyAction(adminId, 'update_company_status', {
        company_id: companyId,
        old_status: data[0]?.status,
        new_status: newStatus
      })

      return {
        success: true,
        data: data[0]
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du statut:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Récupérer les membres d'une entreprise
   * @param {number} companyId - ID de l'entreprise
   * @returns {Promise<Object>} Liste des membres
   */
  async getCompanyMembers(companyId) {
    try {
      const { data, error } = await supabase
        .from('company_members')
        .select(`
          id,
          role,
          joined_at,
          profiles:user_id(
            id,
            first_name,
            last_name,
            email,
            avatar_url,
            organization,
            position
          )
        `)
        .eq('company_id', companyId)
        .order('joined_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des membres:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }
  },

  /**
   * Récupérer les statistiques d'une entreprise
   * @param {number} companyId - ID de l'entreprise
   * @returns {Promise<Object>} Statistiques de l'entreprise
   */
  async getCompanyStats(companyId) {
    try {
      const [
        membersResult,
        opportunitiesResult,
        eventsResult
      ] = await Promise.all([
        // Membres de l'entreprise
        supabase
          .from('company_members')
          .select('id', { count: 'exact' })
          .eq('company_id', companyId),
        
        // Opportunités créées par l'entreprise
        supabase
          .from('opportunities')
          .select('id, views_count, applications_count', { count: 'exact' })
          .eq('company_id', companyId),
        
        // Événements créés par l'entreprise
        supabase
          .from('pev_events')
          .select('id', { count: 'exact' })
          .eq('company_id', companyId)
      ])

      const opportunities = opportunitiesResult.data || []
      
      return {
        success: true,
        data: {
          members_count: membersResult.count || 0,
          opportunities_count: opportunitiesResult.count || 0,
          events_count: eventsResult.count || 0,
          total_views: opportunities.reduce((sum, o) => sum + (o.views_count || 0), 0),
          total_applications: opportunities.reduce((sum, o) => sum + (o.applications_count || 0), 0)
        }
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      return {
        success: false,
        error: error.message,
        data: {
          members_count: 0,
          opportunities_count: 0,
          events_count: 0,
          total_views: 0,
          total_applications: 0
        }
      }
    }
  },

  /**
   * Rechercher des entreprises
   * @param {string} query - Terme de recherche
   * @param {number} limit - Limite de résultats
   * @returns {Promise<Object>} Résultats de recherche
   */
  async searchCompanies(query, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('pev_companies')
        .select(`
          id,
          name,
          slug,
          description,
          industry,
          logo_url,
          country,
          city,
          is_verified,
          status
        `)
        .or(`
          name.ilike.%${query}%,
          description.ilike.%${query}%,
          industry.ilike.%${query}%,
          headquarters.ilike.%${query}%
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
   * Récupérer les statistiques globales des entreprises
   * @returns {Promise<Object>} Statistiques globales
   */
  async getCompaniesOverview() {
    try {
      const { data, error } = await supabase
        .from('pev_companies')
        .select(`
          status,
          is_verified,
          country,
          industry,
          size,
          created_at
        `)

      if (error) throw error

      // Calculer les statistiques
      const stats = {
        total: data.length,
        by_status: {
          draft: data.filter(c => c.status === 'draft').length,
          in_review: data.filter(c => c.status === 'in_review').length,
          published: data.filter(c => c.status === 'published').length,
          rejected: data.filter(c => c.status === 'rejected').length
        },
        verified: data.filter(c => c.is_verified).length,
        by_country: {},
        by_industry: {},
        by_size: {},
        recent_registrations: data.filter(c => {
          const createdAt = new Date(c.created_at)
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          return createdAt > weekAgo
        }).length
      }

      // Grouper par pays
      data.forEach(company => {
        if (company.country) {
          stats.by_country[company.country] = (stats.by_country[company.country] || 0) + 1
        }
      })

      // Grouper par secteur
      data.forEach(company => {
        if (company.industry) {
          stats.by_industry[company.industry] = (stats.by_industry[company.industry] || 0) + 1
        }
      })

      // Grouper par taille
      data.forEach(company => {
        if (company.size) {
          stats.by_size[company.size] = (stats.by_size[company.size] || 0) + 1
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
   * Exporter les entreprises
   * @param {Object} filters - Filtres à appliquer
   * @returns {Promise<Object>} Données d'export
   */
  async exportCompanies(filters = {}) {
    try {
      const result = await this.getAllCompanies({
        ...filters,
        limit: 1000, // Export limité à 1000 entreprises
        page: 1
      })

      if (!result.success) {
        throw new Error(result.error)
      }

      // Formater les données pour l'export
      const exportData = result.data.map(company => ({
        ID: company.id,
        Nom: company.name,
        Secteur: company.industry || '',
        Pays: company.country || '',
        Ville: company.city || '',
        Taille: company.size || '',
        'Année de création': company.founded_year || '',
        'Site web': company.website || '',
        Email: company.email || '',
        Téléphone: company.phone || '',
        Vérifié: company.is_verified ? 'Oui' : 'Non',
        Statut: company.status,
        'Date de création': new Date(company.created_at).toLocaleDateString('fr-FR'),
        Propriétaire: company.profiles ? `${company.profiles.first_name} ${company.profiles.last_name}` : ''
      }))

      return {
        success: true,
        data: exportData,
        filename: `entreprises-${new Date().toISOString().split('T')[0]}.csv`
      }
    } catch (error) {
      console.error('Erreur lors de l\'export:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }
  },

  /**
   * Logger une action admin sur une entreprise
   * @param {string} adminId - ID de l'admin
   * @param {string} action - Action effectuée
   * @param {Object} payload - Détails de l'action
   * @returns {Promise<void>}
   */
  async logCompanyAction(adminId, action, payload = {}) {
    try {
      await supabase
        .from('audit_logs')
        .insert({
          actor_id: adminId,
          action,
          target_entity: 'company',
          target_id: payload.company_id?.toString() || null,
          payload,
          created_at: new Date().toISOString()
        })
    } catch (error) {
      console.error('Erreur lors du logging:', error)
      // Ne pas faire échouer l'opération principale si le log échoue
    }
  }
}
