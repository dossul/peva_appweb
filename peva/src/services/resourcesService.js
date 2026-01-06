import { supabase } from '@/lib/supabase'

/**
 * Service de gestion des ressources - 2iE GreenHub
 * Inspiré du module opportunités fonctionnel
 */
export const resourcesService = {
  /**
   * Récupérer toutes les ressources publiées avec filtres
   */
  async getResources(filters = {}) {
    try {
      let query = supabase
        .from('pev_resources')
        .select(`
          *,
          pev_profiles:created_by(first_name, last_name, avatar_url)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      // Appliquer les filtres
      if (filters.sector) {
        query = query.contains('sectors', [filters.sector])
      }

      if (filters.type) {
        query = query.eq('type', filters.type)
      }

      if (filters.difficulty_level) {
        query = query.eq('difficulty_level', filters.difficulty_level)
      }

      if (filters.language) {
        query = query.eq('language', filters.language)
      }

      if (filters.is_free !== undefined) {
        query = query.eq('is_free', filters.is_free)
      }

      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
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
      console.error('Erreur lors de la récupération des ressources:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }
  },

  /**
   * Récupérer une ressource par ID
   */
  async getResourceById(id) {
    try {
      const { data, error } = await supabase
        .from('pev_resources')
        .select(`
          *,
          pev_profiles:created_by(first_name, last_name, email, avatar_url)
        `)
        .eq('id', id)
        .single()

      if (error) throw error

      // Incrémenter le compteur de vues
      await supabase
        .from('pev_resources')
        .update({ views: (data.views || 0) + 1 })
        .eq('id', id)

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de la ressource:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Créer une nouvelle ressource (soumission pour révision)
   */
  async createResource(resourceData, mainFile = null, coverImage = null) {
    try {
      let fileUrl = null
      let coverImageUrl = null

      // Upload du fichier principal
      if (mainFile) {
        const fileExt = mainFile.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `resources/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, mainFile)

        if (uploadError) {
          console.warn('Erreur upload fichier principal:', uploadError.message)
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath)
          fileUrl = publicUrl
        }
      }

      // Upload de l'image de couverture
      if (coverImage) {
        const imgExt = coverImage.name.split('.').pop()
        const imgName = `${Date.now()}_cover_${Math.random().toString(36).substring(7)}.${imgExt}`
        const imgPath = `resources/covers/${imgName}`

        const { error: imgError } = await supabase.storage
          .from('images')
          .upload(imgPath, coverImage)

        if (imgError) {
          console.warn('Erreur upload image couverture:', imgError.message)
        } else {
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(imgPath)
          coverImageUrl = publicUrl
        }
      }

      // Préparer les données adaptées à la BDD
      const adaptedData = {
        title: resourceData.title,
        description: resourceData.description,
        type: resourceData.type || 'guide',
        sectors: resourceData.sector ? [resourceData.sector] : null,
        difficulty_level: resourceData.difficulty_level || null,
        language: resourceData.language || 'fr',
        tags: resourceData.tags?.length > 0 ? resourceData.tags : null,
        media_url: fileUrl,
        source: resourceData.external_link || null,
        is_free: resourceData.is_free !== false,
        allow_download: resourceData.allow_download !== false,
        allow_sharing: resourceData.allow_sharing !== false,
        status: 'in_review',
        created_by: resourceData.created_by
      }

      const { data, error } = await supabase
        .from('pev_resources')
        .insert([adaptedData])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        data
      }
    } catch (error) {
      console.error('Erreur lors de la création de la ressource:', error)
      return {
        success: false,
        error: error.message
      }
    }
  },

  /**
   * Sauvegarder un brouillon de ressource
   */
  async saveDraft(resourceData, mainFile = null, coverImage = null) {
    try {
      let fileUrl = resourceData.file_url || null
      let coverImageUrl = resourceData.cover_image_url || null

      // Upload du fichier principal si nouveau
      if (mainFile && mainFile instanceof File) {
        const fileExt = mainFile.name.split('.').pop()
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `resources/drafts/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, mainFile)

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('documents')
            .getPublicUrl(filePath)
          fileUrl = publicUrl
        }
      }

      // Upload de l'image de couverture si nouvelle
      if (coverImage && coverImage instanceof File) {
        const imgExt = coverImage.name.split('.').pop()
        const imgName = `${Date.now()}_cover_${Math.random().toString(36).substring(7)}.${imgExt}`
        const imgPath = `resources/covers/${imgName}`

        const { error: imgError } = await supabase.storage
          .from('images')
          .upload(imgPath, coverImage)

        if (!imgError) {
          const { data: { publicUrl } } = supabase.storage
            .from('images')
            .getPublicUrl(imgPath)
          coverImageUrl = publicUrl
        }
      }

      const adaptedData = {
        title: resourceData.title || 'Brouillon sans titre',
        description: resourceData.description,
        type: resourceData.type || 'guide',
        sectors: resourceData.sector ? [resourceData.sector] : null,
        difficulty_level: resourceData.difficulty_level || null,
        language: resourceData.language || 'fr',
        tags: resourceData.tags?.length > 0 ? resourceData.tags : null,
        media_url: fileUrl,
        source: resourceData.external_link || null,
        is_free: resourceData.is_free !== false,
        allow_download: resourceData.allow_download !== false,
        allow_sharing: resourceData.allow_sharing !== false,
        status: 'draft',
        created_by: resourceData.created_by
      }

      // Update si existe, sinon insert
      if (resourceData.id) {
        const { data, error } = await supabase
          .from('pev_resources')
          .update(adaptedData)
          .eq('id', resourceData.id)
          .eq('created_by', resourceData.created_by)
          .select()
          .single()

        if (error) throw error
        return { success: true, data }
      } else {
        const { data, error } = await supabase
          .from('pev_resources')
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

  /**
   * Récupérer les ressources de l'utilisateur
   */
  async getUserResources(userId) {
    try {
      const { data, error } = await supabase
        .from('pev_resources')
        .select('*')
        .eq('created_by', userId)
        .order('updated_at', { ascending: false })

      if (error) throw error

      return {
        success: true,
        data: data || []
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des ressources utilisateur:', error)
      return {
        success: false,
        error: error.message,
        data: []
      }
    }
  },

  /**
   * Récupérer uniquement les brouillons de l'utilisateur
   */
  async getUserDrafts(userId) {
    try {
      const { data, error } = await supabase
        .from('pev_resources')
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

  /**
   * Supprimer un brouillon
   */
  async deleteDraft(resourceId, userId) {
    try {
      const { error } = await supabase
        .from('pev_resources')
        .delete()
        .eq('id', resourceId)
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
   * Incrémenter le compteur de téléchargements
   */
  async incrementDownloads(resourceId) {
    try {
      const { data: resource } = await supabase
        .from('pev_resources')
        .select('downloads')
        .eq('id', resourceId)
        .single()

      await supabase
        .from('pev_resources')
        .update({ downloads: (resource?.downloads || 0) + 1 })
        .eq('id', resourceId)

      return { success: true }
    } catch (error) {
      console.error('Erreur lors de l\'incrémentation des téléchargements:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Ajouter aux favoris
   */
  async addToFavorites(resourceId, userId) {
    try {
      const { data, error } = await supabase
        .from('pev_favorites')
        .insert([{
          entity_type: 'resource',
          entity_id: resourceId.toString(),
          user_id: userId
        }])
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Erreur lors de l\'ajout aux favoris:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Retirer des favoris
   */
  async removeFromFavorites(resourceId, userId) {
    try {
      const { error } = await supabase
        .from('pev_favorites')
        .delete()
        .eq('entity_type', 'resource')
        .eq('entity_id', resourceId.toString())
        .eq('user_id', userId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur lors de la suppression des favoris:', error)
      return { success: false, error: error.message }
    }
  }
}

export default resourcesService
