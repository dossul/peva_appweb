/**
 * Service pour la gestion des entreprises
 */

import { supabase } from '@/lib/supabase'

export const companyService = {
  /**
   * Récupérer les entreprises de l'utilisateur connecté
   */
  async getUserCompanies(userId) {
    const { data, error } = await supabase
      .from('pev_companies')
      .select('*')
      .eq('owner_id', userId)
    
    if (error) throw error
    return data
  },

  /**
   * Récupérer une entreprise par ID
   */
  async getCompanyById(companyId) {
    const { data, error } = await supabase
      .from('pev_companies')
      .select('*')
      .eq('id', companyId)
      .single()
    
    if (error) throw error
    return data
  },

  /**
   * Récupérer l'entreprise principale de l'utilisateur
   */
  async getUserMainCompany(userId) {
    const { data, error } = await supabase
      .from('pev_companies')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    
    if (error) throw error
    return data
  },

  /**
   * Mettre à jour le profil d'une entreprise
   */
  async updateCompany(companyId, updates) {
    // Préparer les données à mettre à jour
    const updateData = {
      updated_at: new Date().toISOString()
    }

    // Mapper les champs du formulaire aux colonnes de la base
    if (updates.name) updateData.name = updates.name
    if (updates.description) updateData.description = updates.description
    if (updates.sector || updates.industry) {
      updateData.industry = updates.sector || updates.industry
    }
    if (updates.country) updateData.country = updates.country
    if (updates.city) updateData.city = updates.city
    if (updates.website) updateData.website = updates.website
    if (updates.email) updateData.email = updates.email
    if (updates.headquarters) updateData.headquarters = updates.headquarters
    if (updates.size) updateData.size = updates.size
    if (updates.founded_year) updateData.founded_year = updates.founded_year
    if (updates.mission) updateData.mission = updates.mission
    if (updates.logo_url) updateData.logo_url = updates.logo_url
    if (updates.cover_image_url) updateData.cover_image_url = updates.cover_image_url

    const { data, error } = await supabase
      .from('pev_companies')
      .update(updateData)
      .eq('id', companyId)
      .select()
    
    if (error) {
      console.error('Supabase update error:', error)
      throw new Error(`Erreur de mise à jour: ${error.message}. Vérifiez vos permissions.`)
    }
    
    if (!data || data.length === 0) {
      throw new Error('Aucune entreprise mise à jour. Vérifiez vos permissions ou que l\'entreprise existe.')
    }
    
    return data[0]
  },

  /**
   * Rechercher des entreprises disponibles pour réclamation
   */
  async searchSimilarCompanies(searchTerm) {
    try {
      if (!searchTerm || searchTerm.length < 2) return []
      
      const { data, error } = await supabase
        .from('pev_companies')
        .select('id, name, slug, industry, country, city, logo_url, owner_id, claimed_by')
        .ilike('name', `%${searchTerm}%`)
        .is('claimed_by', null)
        .limit(20)
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur recherche entreprises:', error)
      return []
    }
  },

  /**
   * Rechercher des entreprises similaires par nom (anti-duplication)
   */
  async findSimilarCompanies(name, threshold = 0.6) {
    try {
      // Recherche exacte d'abord
      const { data: exactMatch } = await supabase
        .from('pev_companies')
        .select('id, name, slug, industry, country, logo_url, owner_id')
        .ilike('name', name)
        .limit(5)

      if (exactMatch && exactMatch.length > 0) {
        return {
          exact: exactMatch,
          similar: []
        }
      }

      // Recherche par mots-clés similaires
      const searchTerms = name.toLowerCase().split(/\s+/).filter(t => t.length > 2)
      let similar = []
      
      if (searchTerms.length > 0) {
        const { data: partialMatches } = await supabase
          .from('pev_companies')
          .select('id, name, slug, industry, country, logo_url, owner_id')
          .or(searchTerms.map(t => `name.ilike.%${t}%`).join(','))
          .limit(10)
        
        similar = partialMatches || []
      }

      return {
        exact: [],
        similar
      }
    } catch (error) {
      console.error('Erreur recherche entreprises similaires:', error)
      return { exact: [], similar: [] }
    }
  },

  /**
   * Créer une nouvelle entreprise avec vérification anti-duplication
   */
  async createCompany(companyData, skipDuplicateCheck = false) {
    // Vérifier les doublons potentiels si non ignoré
    if (!skipDuplicateCheck) {
      const similarCompanies = await this.findSimilarCompanies(companyData.name)
      if (similarCompanies.exact.length > 0) {
        throw new Error(`Une entreprise avec ce nom existe déjà: "${similarCompanies.exact[0].name}"`)
      }
    }

    // Générer un slug unique
    const baseSlug = this.generateSlug(companyData.name)
    let slug = baseSlug
    let counter = 0
    
    while (!(await this.isSlugAvailable(slug))) {
      counter++
      slug = `${baseSlug}-${counter}`
    }

    const { data, error } = await supabase
      .from('pev_companies')
      .insert({
        owner_id: companyData.owner_id,
        name: companyData.name,
        slug: slug,
        description: companyData.description,
        industry: companyData.sector || companyData.industry,
        country: companyData.country,
        city: companyData.city,
        website: companyData.website,
        email: companyData.email,
        status: 'draft'
      })
      .select()
      .single()
    
    if (error) throw error
    return data
  },

  /**
   * Demander à rejoindre une entreprise existante
   */
  async requestToJoinCompany(companyId, userId, message = '') {
    // Vérifier si déjà membre
    const { data: existingMember } = await supabase
      .from('pev_company_members')
      .select('id, status')
      .eq('company_id', companyId)
      .eq('user_id', userId)
      .single()

    if (existingMember) {
      if (existingMember.status === 'approved') {
        throw new Error('Vous êtes déjà membre de cette entreprise')
      }
      if (existingMember.status === 'pending') {
        throw new Error('Une demande est déjà en cours pour cette entreprise')
      }
    }

    // Vérifier si une demande existe déjà
    const { data: existingRequest } = await supabase
      .from('pev_company_join_requests')
      .select('id, status')
      .eq('company_id', companyId)
      .eq('user_id', userId)
      .single()

    if (existingRequest && existingRequest.status === 'pending') {
      throw new Error('Une demande d\'adhésion est déjà en attente')
    }

    // Créer la demande
    const { data, error } = await supabase
      .from('pev_company_join_requests')
      .upsert({
        company_id: companyId,
        user_id: userId,
        message: message,
        status: 'pending',
        created_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Récupérer les demandes d'adhésion pour une entreprise
   */
  async getCompanyJoinRequests(companyId) {
    const { data, error } = await supabase
      .from('pev_company_join_requests')
      .select(`
        *,
        user:user_id(id, first_name, last_name, email, avatar_url, organization)
      `)
      .eq('company_id', companyId)
      .eq('status', 'pending')
      .order('created_at', { ascending: false })

    if (error) throw error
    return data || []
  },

  /**
   * Approuver une demande d'adhésion
   */
  async approveJoinRequest(requestId, role = 'member') {
    // Récupérer la demande
    const { data: request, error: fetchError } = await supabase
      .from('pev_company_join_requests')
      .select('*')
      .eq('id', requestId)
      .single()

    if (fetchError) throw fetchError
    if (!request) throw new Error('Demande non trouvée')

    // Créer le membre
    const { error: memberError } = await supabase
      .from('pev_company_members')
      .upsert({
        company_id: request.company_id,
        user_id: request.user_id,
        role: role,
        status: 'approved',
        approved_at: new Date().toISOString()
      })

    if (memberError) throw memberError

    // Mettre à jour la demande
    const { data, error: updateError } = await supabase
      .from('pev_company_join_requests')
      .update({
        status: 'approved',
        reviewed_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single()

    if (updateError) throw updateError
    return data
  },

  /**
   * Rejeter une demande d'adhésion
   */
  async rejectJoinRequest(requestId, notes = '') {
    const { data, error } = await supabase
      .from('pev_company_join_requests')
      .update({
        status: 'rejected',
        review_notes: notes,
        reviewed_at: new Date().toISOString()
      })
      .eq('id', requestId)
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Récupérer les membres d'une entreprise
   */
  async getCompanyMembers(companyId) {
    const { data, error } = await supabase
      .from('pev_company_members')
      .select(`
        *,
        user:user_id(id, first_name, last_name, email, avatar_url, organization, position)
      `)
      .eq('company_id', companyId)
      .eq('status', 'approved')
      .order('role', { ascending: true })

    if (error) throw error
    return data || []
  },

  /**
   * Inviter un utilisateur à rejoindre une entreprise
   */
  async inviteMemberToCompany(companyId, userId, role = 'member', invitedBy) {
    const { data, error } = await supabase
      .from('pev_company_members')
      .insert({
        company_id: companyId,
        user_id: userId,
        role: role,
        status: 'pending',
        invited_by: invitedBy,
        invited_at: new Date().toISOString()
      })
      .select()
      .single()

    if (error) throw error
    return data
  },

  /**
   * Supprimer un membre d'une entreprise
   */
  async removeMemberFromCompany(companyId, memberId) {
    const { error } = await supabase
      .from('pev_company_members')
      .delete()
      .eq('company_id', companyId)
      .eq('id', memberId)

    if (error) throw error
    return true
  },

  /**
   * Récupérer les entreprises dont l'utilisateur est membre
   */
  async getUserMemberCompanies(userId) {
    const { data, error } = await supabase
      .from('pev_company_members')
      .select(`
        *,
        company:company_id(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'approved')

    if (error) throw error
    return data?.map(m => ({ ...m.company, memberRole: m.role })) || []
  },

  /**
   * Supprimer une entreprise
   */
  async deleteCompany(companyId) {
    const { error } = await supabase
      .from('pev_companies')
      .delete()
      .eq('id', companyId)
    
    if (error) throw error
    return true
  },

  /**
   * Récupérer les statistiques RSE complètes d'une entreprise pour le dashboard
   */
  async getCompanyRSEDashboardStats(companyId) {
    try {
      // Récupérer le dernier rapport RSE publié avec toutes les données
      const { data: latestReport, error } = await supabase
        .from('pev_company_rse_reports')
        .select('*')
        .eq('company_id', companyId)
        .in('report_status', ['published', 'validated'])
        .order('fiscal_year', { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching RSE dashboard stats:', error)
      }

      if (!latestReport) {
        return {
          rseScore: null,
          certifications: 0,
          co2Avoided: 0,
          socialImpact: null,
          hasData: false
        }
      }

      // Calculer le score RSE basé sur les indicateurs disponibles
      const indicators = [
        latestReport.cdi_percentage || 0,
        latestReport.solar_percentage || 0,
        latestReport.waste_recovery_percentage || 0,
        latestReport.local_purchases_percentage || 0
      ]
      const avgScore = indicators.reduce((a, b) => a + b, 0) / indicators.length

      return {
        rseScore: Math.round(avgScore),
        certifications: latestReport.existing_policies?.length || 0,
        co2Avoided: latestReport.carbon_total_tco2eq || 0,
        socialImpact: latestReport.total_employees || 0,
        hasData: true,
        latestYear: latestReport.fiscal_year
      }
    } catch (error) {
      console.error('Error getting RSE dashboard stats:', error)
      return {
        rseScore: null,
        certifications: 0,
        co2Avoided: 0,
        socialImpact: null,
        hasData: false
      }
    }
  },

  /**
   * Récupérer les statistiques RSE d'une entreprise
   */
  async getCompanyRSEStats(companyId) {
    try {
      // Récupérer les rapports RSE publiés
      const { data: reports, error } = await supabase
        .from('pev_company_rse_reports')
        .select('id, fiscal_year, report_status')
        .eq('company_id', companyId)
        .in('report_status', ['published', 'validated'])
        .order('fiscal_year', { ascending: false })
      
      if (error) throw error

      const stats = {
        reportsCount: reports?.length || 0,
        latestYear: null,
        latestScore: null
      }

      if (reports && reports.length > 0) {
        stats.latestYear = reports[0].fiscal_year
        // Plus de calcul de score automatique
        // Les entreprises saisissent directement leurs valeurs
      }

      return stats
    } catch (error) {
      console.error('Error getting RSE stats:', error)
      return {
        reportsCount: 0,
        latestYear: null,
        latestScore: null
      }
    }
  },

  /**
   * Vérifier si un slug est disponible
   */
  async isSlugAvailable(slug, excludeCompanyId = null) {
    let query = supabase
      .from('pev_companies')
      .select('id')
      .eq('slug', slug)
    
    if (excludeCompanyId) {
      query = query.neq('id', excludeCompanyId)
    }

    const { data, error } = await query

    if (error) throw error
    return data.length === 0
  },

  /**
   * Générer un slug unique à partir d'un nom
   */
  generateSlug(name) {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Retirer les accents
      .replace(/[^a-z0-9\s-]/g, '') // Garder seulement lettres, chiffres, espaces et tirets
      .trim()
      .replace(/\s+/g, '-') // Remplacer espaces par tirets
      .replace(/-+/g, '-') // Éviter les tirets multiples
  }
}

export default companyService

