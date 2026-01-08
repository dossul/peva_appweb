import { supabase } from '@/lib/supabase'
import { emailService } from '@/services/emailService'

export const opportunitiesService = {
  // Récupérer toutes les opportunités avec filtres
  async getOpportunities(filters = {}) {
    try {
      let query = supabase
        .from('pev_opportunities')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      // Appliquer les filtres
      if (filters.types && filters.types.length > 0) {
        query = query.in('type', filters.types)
      }

      if (filters.sectors && filters.sectors.length > 0) {
        query = query.in('category', filters.sectors)
      }

      if (filters.location) {
        query = query.ilike('location', `%${filters.location}%`)
      }

      if (filters.minAmount) {
        query = query.gte('salary_min', filters.minAmount)
      }

      if (filters.maxAmount) {
        query = query.lte('salary_max', filters.maxAmount)
      }

      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des opportunités:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }
  },

  // Récupérer une opportunité par ID avec détails
  async getOpportunityById(id) {
    try {
      const { data, error } = await supabase
        .from('pev_opportunities')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'opportunité:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Créer une nouvelle opportunité
  async createOpportunity(opportunityData, files = []) {
    try {
      // Upload des fichiers d'abord
      const attachments = []
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `opportunities/${fileName}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath)

        attachments.push({
          title: file.name.split('.')[0],
          filename: file.name,
          url: publicUrl,
          size: file.size,
          type: file.type,
          uploaded_at: new Date().toISOString()
        })
      }

      // Logique de mapping des montants selon le type
      let minAmount = null
      let maxAmount = null

      if (opportunityData.type === 'Financement' && opportunityData.funding_amount) {
        minAmount = parseFloat(opportunityData.funding_amount)
        maxAmount = minAmount
      } else if (opportunityData.type === 'Mission' && opportunityData.daily_rate) {
        minAmount = parseFloat(opportunityData.daily_rate)
        maxAmount = minAmount
      } else if (opportunityData.type === 'Emploi') {
        minAmount = opportunityData.salary_min ? parseFloat(opportunityData.salary_min) : null
        maxAmount = opportunityData.salary_max ? parseFloat(opportunityData.salary_max) : null
      } else if (opportunityData.budget_salary) {
        // Essayer de parser le champ texte budget_salary si possible (ex: "50000")
        const parsed = parseFloat(opportunityData.budget_salary.replace(/[^0-9.]/g, ''))
        if (!isNaN(parsed)) {
          minAmount = parsed
        }
      }

      // TOUS les champs du formulaire - Migration add_opportunity_extra_fields.sql requise
      const adaptedData = {
        title: opportunityData.title,
        description: opportunityData.description,
        detailed_description: opportunityData.detailed_description,
        type: opportunityData.type,
        category: opportunityData.sector,
        location: opportunityData.location,
        country: opportunityData.country || opportunityData.location,
        region: opportunityData.region,
        city: opportunityData.city,
        is_remote: opportunityData.remote_possible || false,
        salary_min: minAmount,
        salary_max: maxAmount,
        currency: opportunityData.currency || 'XOF',
        deadline: opportunityData.deadline,
        requirements: opportunityData.requirements,
        status: 'in_review',
        created_by: opportunityData.created_by,
        ...(opportunityData.company_id && { company_id: opportunityData.company_id }),
        attachments: attachments.length > 0 ? attachments : null,
        promote_premium: opportunityData.promote_premium || false,
        auto_share_social: opportunityData.auto_share_social || false,
        social_links: opportunityData.social_links || null,
        // Champs supplémentaires
        budget_salary: opportunityData.budget_salary,
        required_skills: opportunityData.required_skills?.length > 0 ? opportunityData.required_skills : null,
        organization: opportunityData.organization,
        contact_email: opportunityData.contact_email,
        contact_phone: opportunityData.contact_phone,
        // Financement
        funding_amount: opportunityData.funding_amount ? parseFloat(opportunityData.funding_amount) : null,
        funding_type: opportunityData.funding_type,
        equity_percentage: opportunityData.equity_percentage ? parseFloat(opportunityData.equity_percentage) : null,
        stage: opportunityData.stage,
        // Emploi
        job_title: opportunityData.job_title,
        contract_type: opportunityData.contract_type,
        // Partenariat
        partnership_type: opportunityData.partnership_type,
        duration: opportunityData.duration,
        partnership_benefits: opportunityData.partnership_benefits,
        // Mission
        mission_duration: opportunityData.mission_duration,
        daily_rate: opportunityData.daily_rate ? parseFloat(opportunityData.daily_rate) : null,
        // Autres
        start_date: opportunityData.start_date || null,
        visibility: opportunityData.visibility || 'public',
        send_notifications: opportunityData.send_notifications !== false
      }

      const { data, error } = await supabase
        .from('pev_opportunities')
        .insert([adaptedData])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Erreur lors de la création de l\'opportunité:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Postuler à une opportunité avec upload de documents
   * @param {string} opportunityId - ID de l'opportunité
   * @param {Object} applicationData - Données de candidature (user_id, cover_letter, etc.)
   * @param {File} resumeFile - Fichier CV (optionnel)
   * @param {File} portfolioFile - Fichier portfolio (optionnel)
   */
  async applyToOpportunity(opportunityId, applicationData, resumeFile = null, portfolioFile = null) {
    try {
      let resume_url = applicationData.resume_url || null
      let portfolio_url = applicationData.portfolio_url || null

      // Upload CV si fourni
      if (resumeFile) {
        const fileName = `applications/${opportunityId}/${applicationData.user_id}/cv_${Date.now()}_${resumeFile.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, resumeFile, { upsert: true })

        if (uploadError) {
          console.warn('Erreur upload CV:', uploadError)
        } else {
          const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName)
          resume_url = urlData?.publicUrl
        }
      }

      // Upload portfolio si fourni
      if (portfolioFile) {
        const fileName = `applications/${opportunityId}/${applicationData.user_id}/portfolio_${Date.now()}_${portfolioFile.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(fileName, portfolioFile, { upsert: true })

        if (uploadError) {
          console.warn('Erreur upload portfolio:', uploadError)
        } else {
          const { data: urlData } = supabase.storage.from('documents').getPublicUrl(fileName)
          portfolio_url = urlData?.publicUrl
        }
      }

      // Insérer la candidature
      const { data, error } = await supabase
        .from('pev_opportunity_applications')
        .insert([{
          opportunity_id: opportunityId,
          ...applicationData,
          resume_url,
          portfolio_url
        }])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Erreur lors de la candidature:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Ajouter aux favoris
  async addToFavorites(opportunityId, userId) {
    try {
      const { data, error } = await supabase
        .from('pev_favorites')
        .insert([{
          entity_type: 'opportunity',
          entity_id: opportunityId.toString(),
          user_id: userId
        }])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Retirer des favoris
  async removeFromFavorites(opportunityId, userId) {
    try {
      const { error } = await supabase
        .from('pev_favorites')
        .delete()
        .eq('entity_type', 'opportunity')
        .eq('entity_id', opportunityId.toString())
        .eq('user_id', userId)

      if (error) throw error

      return {
        success: true
      }
    } catch (error) {
      console.error('Erreur lors de la suppression des favoris:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Sauvegarder un brouillon d'opportunité
  async saveDraft(opportunityData, files = []) {
    try {
      // Upload des fichiers d'abord
      const attachments = []
      
      for (const file of files) {
        const fileExt = file.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `opportunities/drafts/${fileName}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('documents')
          .getPublicUrl(filePath)

        attachments.push({
          title: file.name.split('.')[0],
          filename: file.name,
          url: publicUrl,
          size: file.size,
          type: file.type,
          uploaded_at: new Date().toISOString()
        })
      }

      // TOUS les champs du formulaire - Migration add_opportunity_extra_fields.sql requise
      const adaptedData = {
        title: opportunityData.title || 'Brouillon sans titre',
        description: opportunityData.description,
        detailed_description: opportunityData.detailed_description,
        type: opportunityData.type,
        category: opportunityData.sector,
        location: opportunityData.location,
        country: opportunityData.country || opportunityData.location,
        region: opportunityData.region,
        city: opportunityData.city,
        is_remote: opportunityData.remote_possible || false,
        salary_min: opportunityData.salary_min || null,
        salary_max: opportunityData.salary_max || null,
        currency: opportunityData.currency || 'XOF',
        deadline: opportunityData.deadline,
        requirements: opportunityData.requirements,
        status: 'draft',
        created_by: opportunityData.created_by,
        ...(opportunityData.company_id && { company_id: opportunityData.company_id }),
        attachments: attachments.length > 0 ? attachments : (opportunityData.attachments || null),
        promote_premium: opportunityData.promote_premium || false,
        auto_share_social: opportunityData.auto_share_social || false,
        social_links: opportunityData.social_links || null,
        // Champs supplémentaires
        budget_salary: opportunityData.budget_salary,
        required_skills: opportunityData.required_skills?.length > 0 ? opportunityData.required_skills : null,
        organization: opportunityData.organization,
        contact_email: opportunityData.contact_email,
        contact_phone: opportunityData.contact_phone,
        // Financement
        funding_amount: opportunityData.funding_amount ? parseFloat(opportunityData.funding_amount) : null,
        funding_type: opportunityData.funding_type,
        equity_percentage: opportunityData.equity_percentage ? parseFloat(opportunityData.equity_percentage) : null,
        stage: opportunityData.stage,
        // Emploi
        job_title: opportunityData.job_title,
        contract_type: opportunityData.contract_type,
        // Partenariat
        partnership_type: opportunityData.partnership_type,
        duration: opportunityData.duration,
        partnership_benefits: opportunityData.partnership_benefits,
        // Mission
        mission_duration: opportunityData.mission_duration,
        daily_rate: opportunityData.daily_rate ? parseFloat(opportunityData.daily_rate) : null,
        // Autres
        start_date: opportunityData.start_date || null,
        visibility: opportunityData.visibility || 'public',
        send_notifications: opportunityData.send_notifications !== false
      }

      // Si l'opportunité existe déjà (update), sinon insert
      if (opportunityData.id) {
        const { data, error } = await supabase
          .from('pev_opportunities')
          .update(adaptedData)
          .eq('id', opportunityData.id)
          .eq('created_by', opportunityData.created_by)
          .select()
          .single()

        if (error) throw error
        return { success: true, data }
      } else {
        const { data, error } = await supabase
          .from('pev_opportunities')
          .insert([adaptedData])
          .select()
          .single()

        if (error) throw error
        return { success: true, data }
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du brouillon:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  // Récupérer les opportunités de l'utilisateur (brouillons + soumises + publiées)
  async getUserOpportunities(userId) {
    try {
      const { data, error } = await supabase
        .from('pev_opportunities')
        .select('*')
        .eq('created_by', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des opportunités utilisateur:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }
  },

  // Récupérer uniquement les brouillons de l'utilisateur
  async getUserDrafts(userId) {
    try {
      const { data, error } = await supabase
        .from('pev_opportunities')
        .select('*')
        .eq('created_by', userId)
        .eq('status', 'draft')
        .order('updated_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des brouillons:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }
  },

  // Supprimer un brouillon
  async deleteDraft(opportunityId, userId) {
    try {
      const { error } = await supabase
        .from('pev_opportunities')
        .delete()
        .eq('id', opportunityId)
        .eq('created_by', userId)
        .eq('status', 'draft')

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur lors de la suppression du brouillon:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Supprimer une opportunité (tous statuts - avec notification candidats)
   * @param {string} opportunityId - ID de l'opportunité
   * @param {string} userId - ID de l'utilisateur qui supprime
   * @param {string} reason - Raison de la suppression
   */
  async deleteOpportunity(opportunityId, userId = null, reason = 'Opportunité retirée') {
    try {
      // 1. Récupérer l'opportunité et vérifier propriétaire
      const { data: opportunity, error: oppError } = await supabase
        .from('pev_opportunities')
        .select('id, title, type, created_by')
        .eq('id', opportunityId)
        .single()

      if (oppError || !opportunity) {
        throw new Error('Opportunité non trouvée')
      }

      // Vérifier propriétaire si userId fourni
      if (userId && opportunity.created_by !== userId) {
        throw new Error('Non autorisé à supprimer cette opportunité')
      }

      // 2. Récupérer les candidats pour notification
      const { data: applicants } = await supabase
        .from('pev_opportunity_applications')
        .select('user_id')
        .eq('opportunity_id', opportunityId)

      // 3. Récupérer les profils et envoyer emails
      let notifiedCount = 0
      if (applicants && applicants.length > 0) {
        const userIds = applicants.map(a => a.user_id)
        
        const { data: profiles } = await supabase
          .from('pev_profiles')
          .select('id, email, first_name, last_name')
          .in('id', userIds)
        
        if (profiles && profiles.length > 0) {
          notifiedCount = profiles.length
          const platformUrl = typeof window !== 'undefined' ? window.location.origin : 'https://2iegreenhub.org'
          for (const profile of profiles) {
            if (profile.email) {
              emailService.sendTemplateEmail('opportunity_cancelled', profile.email, {
                recipient_name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Candidat',
                opportunity_title: opportunity.title,
                cancellation_reason: reason,
                platform_url: platformUrl
              }).catch(e => console.warn('Email erreur:', e))
            }
          }
        }
      }

      // 4. Supprimer candidatures
      await supabase.from('pev_opportunity_applications').delete().eq('opportunity_id', opportunityId)

      // 5. Supprimer l'opportunité
      const { error } = await supabase
        .from('pev_opportunities')
        .delete()
        .eq('id', opportunityId)

      if (error) throw error

      return { success: true, notifiedCount }
    } catch (error) {
      console.error('Erreur suppression opportunité:', error)
      return { success: false, error: error.message }
    }
  }
}
