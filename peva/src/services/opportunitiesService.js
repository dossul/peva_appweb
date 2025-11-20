import { supabase } from '@/lib/supabase'

export const opportunitiesService = {
  // Récupérer toutes les opportunités avec filtres
  async getOpportunities(filters = {}) {
    try {
      let query = supabase
        .from('opportunities')
        .select(`
          *,
          countries,
          is_multi_country,
          visibility,
          promote_premium,
          send_notifications,
          auto_share_social,
          social_links,
          attachments
        `)
        .eq('status', 'published')
        .eq('moderation_status', 'approved')
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
        .from('opportunities')
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

      // Adapter les données à la structure Supabase
      const adaptedData = {
        title: opportunityData.title,
        description: opportunityData.description,
        type: opportunityData.type,
        category: opportunityData.sector,
        location: opportunityData.location,
        country: opportunityData.country || opportunityData.location,
        salary_min: opportunityData.amount_min,
        salary_max: opportunityData.amount_max,
        currency: opportunityData.currency || 'EUR',
        deadline: opportunityData.deadline,
        requirements: opportunityData.requirements,
        status: 'published',
        moderation_status: 'pending',
        created_by: opportunityData.created_by,
        organization: opportunityData.organization,
        // Ajouter company_id si c'est une publication d'entreprise
        ...(opportunityData.company_id && { company_id: opportunityData.company_id }),
        // Gérer les pays multiples
        ...(opportunityData.countries && { countries: JSON.stringify(opportunityData.countries) }),
        ...(opportunityData.is_multi_country !== undefined && { is_multi_country: opportunityData.is_multi_country }),
        // Options de publication et visibilité
        visibility: opportunityData.visibility || 'public',
        promote_premium: opportunityData.promote_premium || false,
        send_notifications: opportunityData.send_notifications !== undefined ? opportunityData.send_notifications : true,
        auto_share_social: opportunityData.auto_share_social || false,
        // Stocker les liens sociaux en JSON
        ...(opportunityData.social_links && { social_links: JSON.stringify(opportunityData.social_links) }),
        // Stocker les fichiers joints en JSON
        ...(attachments.length > 0 && { attachments: JSON.stringify(attachments) })
      }

      const { data, error } = await supabase
        .from('opportunities')
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
        .from('opportunity_applications')
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
        .from('opportunity_favorites')
        .insert([{
          opportunity_id: opportunityId,
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
        .from('opportunity_favorites')
        .delete()
        .eq('opportunity_id', opportunityId)
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
