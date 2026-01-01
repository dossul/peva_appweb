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
   * Créer une nouvelle entreprise
   */
  async createCompany(companyData) {
    const { data, error } = await supabase
      .from('pev_companies')
      .insert({
        owner_id: companyData.owner_id,
        name: companyData.name,
        slug: companyData.slug || companyData.name.toLowerCase().replace(/\s+/g, '-'),
        description: companyData.description,
        industry: companyData.sector || companyData.industry,
        country: companyData.country,
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

