import { supabase } from '@/lib/supabase'

/**
 * Service de gestion du forum pour l'administration 2iEGreenHub
 * CRUD complet pour catégories, topics et posts
 */
export const forumService = {
  // ==========================================
  // CATÉGORIES
  // ==========================================

  /**
   * Récupérer toutes les catégories du forum
   */
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('pev_forum_categories')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Erreur récupération catégories:', error)
      return { success: false, error: error.message, data: [] }
    }
  },

  /**
   * Créer une nouvelle catégorie
   * @param {Object} category - Données de la catégorie
   */
  async createCategory(category) {
    try {
      const { data, error } = await supabase
        .from('pev_forum_categories')
        .insert({
          name: category.name,
          description: category.description,
          icon: category.icon || 'mdi-folder',
          color: category.color || 'primary',
          display_order: category.display_order || 0,
          is_active: category.is_active !== false,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Erreur création catégorie:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Mettre à jour une catégorie
   * @param {string|number} categoryId - ID de la catégorie
   * @param {Object} updates - Données à mettre à jour
   */
  async updateCategory(categoryId, updates) {
    try {
      const { data, error } = await supabase
        .from('pev_forum_categories')
        .update({
          name: updates.name,
          description: updates.description,
          icon: updates.icon,
          color: updates.color,
          display_order: updates.display_order,
          is_active: updates.is_active,
          updated_at: new Date().toISOString()
        })
        .eq('id', categoryId)
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Erreur mise à jour catégorie:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Supprimer une catégorie
   * @param {string|number} categoryId - ID de la catégorie
   */
  async deleteCategory(categoryId) {
    try {
      // Vérifier s'il y a des topics dans cette catégorie
      const { count } = await supabase
        .from('pev_forum_topics')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId)

      if (count > 0) {
        return { 
          success: false, 
          error: `Impossible de supprimer: ${count} topic(s) utilisent cette catégorie` 
        }
      }

      const { error } = await supabase
        .from('pev_forum_categories')
        .delete()
        .eq('id', categoryId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur suppression catégorie:', error)
      return { success: false, error: error.message }
    }
  },

  // ==========================================
  // TOPICS
  // ==========================================

  /**
   * Récupérer tous les topics avec pagination
   */
  async getTopics(options = {}) {
    try {
      const { page = 1, limit = 20, categoryId, status, search } = options

      let query = supabase
        .from('pev_forum_topics')
        .select(`
          *,
          pev_profiles:user_id(id, first_name, last_name, avatar_url),
          pev_forum_categories:category_id(id, name, icon, color)
        `, { count: 'exact' })

      if (categoryId) query = query.eq('category_id', categoryId)
      if (status) query = query.eq('status', status)
      if (search) query = query.ilike('title', `%${search}%`)

      query = query.order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      const { data, error, count } = await query

      if (error) throw error

      return { success: true, data: data || [], total: count }
    } catch (error) {
      console.error('Erreur récupération topics:', error)
      return { success: false, error: error.message, data: [], total: 0 }
    }
  },

  /**
   * Créer un nouveau topic
   */
  async createTopic(topic) {
    try {
      const { data, error } = await supabase
        .from('pev_forum_topics')
        .insert({
          title: topic.title,
          content: topic.content,
          category_id: topic.category_id,
          user_id: topic.user_id,
          status: topic.status || 'published',
          is_pinned: topic.is_pinned || false,
          views_count: 0,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Erreur création topic:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Mettre à jour un topic
   */
  async updateTopic(topicId, updates) {
    try {
      const { data, error } = await supabase
        .from('pev_forum_topics')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', topicId)
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Erreur mise à jour topic:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Supprimer un topic et ses posts
   */
  async deleteTopic(topicId) {
    try {
      // Supprimer d'abord les posts du topic
      await supabase
        .from('pev_forum_posts')
        .delete()
        .eq('topic_id', topicId)

      // Puis supprimer le topic
      const { error } = await supabase
        .from('pev_forum_topics')
        .delete()
        .eq('id', topicId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur suppression topic:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Épingler/désépingler un topic
   */
  async togglePinTopic(topicId, isPinned) {
    return this.updateTopic(topicId, { is_pinned: isPinned })
  },

  // ==========================================
  // POSTS
  // ==========================================

  /**
   * Récupérer les posts d'un topic
   */
  async getPostsByTopic(topicId, options = {}) {
    try {
      const { page = 1, limit = 20 } = options

      const { data, error, count } = await supabase
        .from('pev_forum_posts')
        .select(`
          *,
          pev_profiles:user_id(id, first_name, last_name, avatar_url)
        `, { count: 'exact' })
        .eq('topic_id', topicId)
        .order('created_at', { ascending: true })
        .range((page - 1) * limit, page * limit - 1)

      if (error) throw error

      return { success: true, data: data || [], total: count }
    } catch (error) {
      console.error('Erreur récupération posts:', error)
      return { success: false, error: error.message, data: [], total: 0 }
    }
  },

  /**
   * Supprimer un post
   */
  async deletePost(postId) {
    try {
      const { error } = await supabase
        .from('pev_forum_posts')
        .delete()
        .eq('id', postId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur suppression post:', error)
      return { success: false, error: error.message }
    }
  },

  // ==========================================
  // STATISTIQUES
  // ==========================================

  /**
   * Récupérer les statistiques du forum
   */
  async getForumStats() {
    try {
      const [categoriesRes, topicsRes, postsRes, membersRes] = await Promise.all([
        supabase.from('pev_forum_categories').select('*', { count: 'exact', head: true }),
        supabase.from('pev_forum_topics').select('*', { count: 'exact', head: true }),
        supabase.from('pev_forum_posts').select('*', { count: 'exact', head: true }),
        supabase.from('pev_profiles').select('*', { count: 'exact', head: true }).eq('onboarding_completed', true)
      ])

      // Posts aujourd'hui
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const { count: postsToday } = await supabase
        .from('pev_forum_posts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', today.toISOString())

      return {
        success: true,
        data: {
          categories: categoriesRes.count || 0,
          topics: topicsRes.count || 0,
          posts: postsRes.count || 0,
          members: membersRes.count || 0,
          postsToday: postsToday || 0
        }
      }
    } catch (error) {
      console.error('Erreur stats forum:', error)
      return { success: false, error: error.message, data: {} }
    }
  }
}
