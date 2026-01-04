import { supabase } from '@/lib/supabase'

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
          .from('greenhub-public')
          .upload(filePath, file)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('greenhub-public')
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

      // Adapter les données à la structure Supabase (colonnes réelles uniquement)
      const adaptedData = {
        title: opportunityData.title,
        description: opportunityData.description,
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
        // IMPORTANT: status='pending' pour modération avant publication
        status: 'pending',
        created_by: opportunityData.created_by,
        // Ajouter company_id si c'est une publication d'entreprise
        ...(opportunityData.company_id && { company_id: opportunityData.company_id }),
        // Sauvegarder les fichiers joints
        attachments: attachments,
        // Options de publication
        promote_premium: opportunityData.promote_premium || false,
        auto_share_social: opportunityData.auto_share_social || false,
        social_links: opportunityData.social_links
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

  // Postuler à une opportunité
  async applyToOpportunity(opportunityId, applicationData) {
    try {
      const { data, error } = await supabase
        .from('pev_opportunity_applications')
        .insert([{
          opportunity_id: opportunityId,
          ...applicationData
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
  }
}
