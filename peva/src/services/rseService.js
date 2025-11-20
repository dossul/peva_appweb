/**
 * Service de gestion des rapports RSE/ESG
 * 
 * Ce service permet de :
 * - Créer, modifier, consulter et supprimer des rapports RSE
 * - Gérer les statuts des rapports (draft, submitted, validated, published)
 * - Uploader des documents justificatifs
 * - Calculer les scores RSE
 * - Récupérer les ODD (Objectifs de Développement Durable)
 */

import { supabase } from '@/lib/supabase'

export const rseService = {
  /**
   * Récupère les rapports RSE d'une entreprise
   * @param {number} companyId - ID de l'entreprise
   * @param {Object} options - Options de filtrage
   * @returns {Promise<Array>} Liste des rapports
   */
  async getCompanyReports(companyId, options = {}) {
    try {
      const { 
        includeStatus = ['published'], 
        fiscalYear = null,
        orderBy = 'fiscal_year',
        ascending = false
      } = options
      
      let query = supabase
        .from('company_rse_reports')
        .select(`
          *,
          companies (
            name,
            industry,
            logo_url,
            country
          )
        `)
        .eq('company_id', companyId)
        .in('report_status', includeStatus)
        .order(orderBy, { ascending })
      
      if (fiscalYear) {
        query = query.eq('fiscal_year', fiscalYear)
      }
      
      const { data, error } = await query
      
      if (error) {
        console.error('Erreur Supabase lors de la récupération des rapports:', error)
        return [] // Retourner un tableau vide au lieu de throw
      }
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des rapports:', error)
      return [] // Retourner un tableau vide au lieu de throw
    }
  },

  /**
   * Récupère un rapport RSE spécifique par ID
   * @param {number} reportId - ID du rapport
   * @returns {Promise<Object>} Le rapport
   */
  async getReportById(reportId) {
    try {
      const { data, error } = await supabase
        .from('company_rse_reports')
        .select(`
          *,
          companies (
            name,
            industry,
            logo_url,
            country
          )
        `)
        .eq('id', reportId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération du rapport:', error)
      throw error
    }
  },

  /**
   * Récupère le dernier rapport publié d'une entreprise
   * @param {number} companyId - ID de l'entreprise
   * @returns {Promise<Object|null>} Le dernier rapport ou null
   */
  async getLatestPublishedReport(companyId) {
    try {
      const { data, error } = await supabase
        .rpc('get_latest_rse_report', { p_company_id: companyId })
      
      if (error) throw error
      return data?.[0] || null
    } catch (error) {
      console.error('Erreur lors de la récupération du dernier rapport:', error)
      throw error
    }
  },

  /**
   * Crée un nouveau rapport RSE (brouillon)
   * @param {number} companyId - ID de l'entreprise
   * @param {number} fiscalYear - Année fiscale
   * @returns {Promise<Object>} Le rapport créé
   */
  async createReport(companyId, fiscalYear) {
    try {
      console.log('📝 Tentative de création du rapport...', { companyId, fiscalYear })
      
      // Timeout de 10 secondes
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout : La requête prend trop de temps (>10s)')), 10000)
      )
      
      const insertPromise = supabase
        .from('company_rse_reports')
        .insert({
          company_id: companyId,
          fiscal_year: fiscalYear,
          report_status: 'draft'
        })
        .select()
      
      const result = await Promise.race([insertPromise, timeoutPromise])
      const { data, error } = result
      
      // Si data est un tableau, prendre le premier élément
      const reportData = Array.isArray(data) ? data[0] : data
      
      if (error) {
        console.error('❌ Erreur Supabase:', error)
        throw error
      }
      
      if (!reportData) {
        throw new Error('Aucune donnée retournée après l\'insertion')
      }
      
      console.log('✅ Rapport créé avec succès:', reportData)
      return reportData
    } catch (error) {
      console.error('❌ Erreur lors de la création du rapport:', error)
      throw error
    }
  },

  /**
   * Met à jour un rapport RSE
   * @param {number} reportId - ID du rapport
   * @param {Object} updates - Données à mettre à jour
   * @returns {Promise<Object>} Le rapport mis à jour
   */
  async updateReport(reportId, updates) {
    try {
      // Supprimer les champs en lecture seule (colonnes calculées)
      const cleanUpdates = { ...updates }
      delete cleanUpdates.id
      delete cleanUpdates.created_at
      delete cleanUpdates.updated_at
      delete cleanUpdates.cdi_percentage
      delete cleanUpdates.cdd_percentage
      delete cleanUpdates.local_purchases_percentage
      delete cleanUpdates.solar_percentage
      delete cleanUpdates.carbon_total_tco2eq
      delete cleanUpdates.waste_recovery_percentage
      delete cleanUpdates.companies
      
      const { data, error } = await supabase
        .from('company_rse_reports')
        .update(cleanUpdates)
        .eq('id', reportId)
        .select()
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur lors de la mise à jour du rapport:', error)
      throw error
    }
  },

  /**
   * Change le statut d'un rapport
   * @param {number} reportId - ID du rapport
   * @param {string} newStatus - Nouveau statut (draft, submitted, validated, published)
   * @returns {Promise<Object>} Le rapport mis à jour
   */
  async changeReportStatus(reportId, newStatus) {
    try {
      const updates = { report_status: newStatus }
      
      if (newStatus === 'submitted') {
        updates.submitted_at = new Date().toISOString()
      } else if (newStatus === 'validated') {
        updates.validated_at = new Date().toISOString()
        // Récupérer l'utilisateur actuel
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          updates.validated_by = user.id
        }
      }
      
      return await this.updateReport(reportId, updates)
    } catch (error) {
      console.error('Erreur lors du changement de statut:', error)
      throw error
    }
  },

  /**
   * Supprime un rapport RSE
   * @param {number} reportId - ID du rapport
   * @returns {Promise<void>}
   */
  async deleteReport(reportId) {
    try {
      const { error } = await supabase
        .from('company_rse_reports')
        .delete()
        .eq('id', reportId)
      
      if (error) throw error
    } catch (error) {
      console.error('Erreur lors de la suppression du rapport:', error)
      throw error
    }
  },

  /**
   * SUPPRIMÉ : Plus de calcul automatique de score
   * Les entreprises saisissent directement leurs valeurs
   */

  /**
   * Récupère tous les ODD (Objectifs de Développement Durable)
   * @returns {Promise<Array>} Liste des 17 ODD
   */
  async getAllSDGs() {
    try {
      const { data, error } = await supabase
        .from('sdgs')
        .select('*')
        .order('id')
      
      if (error) {
        console.error('Erreur Supabase lors de la récupération des ODD:', error)
        return [] // Retourner un tableau vide au lieu de throw
      }
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des ODD:', error)
      return [] // Retourner un tableau vide au lieu de throw
    }
  },

  /**
   * Récupère un ODD spécifique par ID
   * @param {number} sdgId - ID de l'ODD (1-17)
   * @returns {Promise<Object|null>} L'ODD ou null
   */
  async getSDGById(sdgId) {
    try {
      const { data, error } = await supabase
        .from('sdgs')
        .select('*')
        .eq('id', sdgId)
        .single()
      
      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'ODD:', error)
      return null
    }
  },

  /**
   * Récupère les statistiques RSE globales
   * @param {number|null} fiscalYear - Année fiscale (optionnel)
   * @returns {Promise<Array>} Statistiques globales
   */
  async getGlobalStats(fiscalYear = null) {
    try {
      let query = supabase
        .from('v_rse_global_stats')
        .select('*')
      
      if (fiscalYear) {
        query = query.eq('fiscal_year', fiscalYear)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      throw error
    }
  },

  /**
   * Récupère les derniers rapports de toutes les entreprises
   * @param {Object} options - Options de filtrage
   * @returns {Promise<Array>} Liste des derniers rapports
   */
  async getAllLatestReports(options = {}) {
    try {
      const { limit = 10, country = null } = options
      
      let query = supabase
        .from('v_company_latest_rse_report')
        .select('*')
        .order('fiscal_year', { ascending: false })
        .limit(limit)
      
      if (country) {
        query = query.eq('country', country)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des derniers rapports:', error)
      throw error
    }
  },

  /**
   * Upload un document de support
   * @param {number} companyId - ID de l'entreprise
   * @param {number} fiscalYear - Année fiscale
   * @param {File} file - Fichier à uploader
   * @returns {Promise<Object>} Informations du fichier uploadé
   */
  async uploadDocument(companyId, fiscalYear, file) {
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `company_reports/${companyId}/${fiscalYear}/${fileName}`
      
      // Upload le fichier
      const { error: uploadError } = await supabase.storage
        .from('peva-private')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        })
      
      if (uploadError) throw uploadError
      
      // Récupérer l'URL signée (valide 1 an)
      const { data: { signedUrl }, error: urlError } = await supabase.storage
        .from('peva-private')
        .createSignedUrl(filePath, 31536000) // 1 an en secondes
      
      if (urlError) throw urlError
      
      return {
        path: filePath,
        url: signedUrl,
        name: file.name,
        size: file.size,
        type: file.type,
        uploaded_at: new Date().toISOString()
      }
    } catch (error) {
      console.error('Erreur lors de l\'upload du document:', error)
      throw error
    }
  },

  /**
   * Supprime un document de support
   * @param {string} filePath - Chemin du fichier dans le storage
   * @returns {Promise<void>}
   */
  async deleteDocument(filePath) {
    try {
      const { error } = await supabase.storage
        .from('peva-private')
        .remove([filePath])
      
      if (error) throw error
    } catch (error) {
      console.error('Erreur lors de la suppression du document:', error)
      throw error
    }
  },

  /**
   * Génère un rapport PDF (placeholder pour future implémentation)
   * @param {number} reportId - ID du rapport
   * @returns {Promise<Blob>} Le PDF généré
   */
  async generatePDF(reportId) {
    // TODO: Implémenter la génération de PDF
    // Pourrait utiliser une Edge Function Supabase avec jsPDF ou Puppeteer
    console.warn('Génération de PDF non encore implémentée')
    throw new Error('Fonctionnalité non disponible')
  },

  /**
   * Exporte les données du rapport en JSON
   * @param {number} reportId - ID du rapport
   * @returns {Promise<Object>} Les données du rapport
   */
  async exportReportData(reportId) {
    try {
      const report = await this.getReportById(reportId)
      
      return {
        report,
        exported_at: new Date().toISOString()
      }
    } catch (error) {
      console.error('Erreur lors de l\'export des données:', error)
      throw error
    }
  },

  /**
   * Vérifie si une entreprise peut créer un rapport pour une année donnée
   * @param {number} companyId - ID de l'entreprise
   * @param {number} fiscalYear - Année fiscale
   * @returns {Promise<boolean>} true si possible, false sinon
   */
  async canCreateReport(companyId, fiscalYear) {
    try {
      const { data, error } = await supabase
        .from('company_rse_reports')
        .select('id')
        .eq('company_id', companyId)
        .eq('fiscal_year', fiscalYear)
        .maybeSingle()
      
      if (error) throw error
      return data === null // Retourne true si aucun rapport n'existe
    } catch (error) {
      console.error('Erreur lors de la vérification:', error)
      return false
    }
  },

  /**
   * Récupère les années fiscales disponibles pour une entreprise
   * @param {number} companyId - ID de l'entreprise
   * @returns {Promise<Array<number>>} Liste des années
   */
  async getAvailableYears(companyId) {
    try {
      const { data, error } = await supabase
        .from('company_rse_reports')
        .select('fiscal_year')
        .eq('company_id', companyId)
        .order('fiscal_year', { ascending: false })
      
      if (error) throw error
      return [...new Set(data?.map(r => r.fiscal_year) || [])]
    } catch (error) {
      console.error('Erreur lors de la récupération des années:', error)
      return []
    }
  },

  /**
   * Validation simplifiée des données du rapport
   * @param {Object} reportData - Données du rapport à valider
   * @returns {Object} Résultat de validation { valid: boolean, errors: Array }
   */
  validateReportData(reportData) {
    const errors = []

    // Validation année fiscale uniquement
    if (!reportData.fiscal_year || reportData.fiscal_year < 2000 || reportData.fiscal_year > new Date().getFullYear()) {
      errors.push({ field: 'fiscal_year', message: 'Année fiscale invalide' })
    }

    // PLUS DE VALIDATIONS COMPLEXES
    // Les utilisateurs saisissent leurs valeurs telles qu'ils les ont obtenues

    return {
      valid: errors.length === 0,
      errors
    }
  }
}

export default rseService

