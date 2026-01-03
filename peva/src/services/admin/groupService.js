import { supabase } from '@/lib/supabase'

/**
 * Service de gestion des groupes/communautés pour l'administration 2iEGreenHub
 * CRUD complet pour groupes, catégories et membres
 */
export const groupService = {
  // ==========================================
  // GROUPES
  // ==========================================

  /**
   * Récupérer tous les groupes avec pagination
   */
  async getGroups(options = {}) {
    try {
      const { page = 1, limit = 20, search, categoryId, isActive, countryId } = options

      let query = supabase
        .from('pev_groups')
        .select(`
          *,
          pev_profiles:created_by(id, first_name, last_name),
          pev_countries:country_id(id, name, flag)
        `, { count: 'exact' })

      if (search) query = query.ilike('name', `%${search}%`)
      if (categoryId) query = query.eq('category_id', categoryId)
      if (isActive !== undefined) query = query.eq('is_active', isActive)
      if (countryId) query = query.eq('country_id', countryId)

      query = query.order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      const { data, error, count } = await query

      if (error) throw error

      return { success: true, data: data || [], total: count }
    } catch (error) {
      console.error('Erreur récupération groupes:', error)
      return { success: false, error: error.message, data: [], total: 0 }
    }
  },

  /**
   * Récupérer un groupe par ID
   */
  async getGroupById(groupId) {
    try {
      const { data, error } = await supabase
        .from('pev_groups')
        .select(`
          *,
          pev_profiles:created_by(id, first_name, last_name, email),
          pev_countries:country_id(id, name, flag)
        `)
        .eq('id', groupId)
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Erreur récupération groupe:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Créer un nouveau groupe
   */
  async createGroup(group) {
    try {
      const { data, error } = await supabase
        .from('pev_groups')
        .insert({
          name: group.name,
          description: group.description,
          category: group.category,
          category_id: group.category_id,
          icon: group.icon || 'mdi-account-group',
          color: group.color || 'teal',
          cover_url: group.cover_url,
          is_public: group.is_public !== false,
          is_active: group.is_active !== false,
          country_id: group.country_id,
          created_by: group.created_by,
          members_count: 0,
          posts_count: 0,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Erreur création groupe:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Mettre à jour un groupe
   */
  async updateGroup(groupId, updates) {
    try {
      const { data, error } = await supabase
        .from('pev_groups')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', groupId)
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Erreur mise à jour groupe:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Supprimer un groupe
   */
  async deleteGroup(groupId) {
    try {
      // Supprimer les membres du groupe
      await supabase.from('pev_group_members').delete().eq('group_id', groupId)
      
      // Supprimer les posts du groupe
      await supabase.from('pev_group_posts').delete().eq('group_id', groupId)

      // Supprimer le groupe
      const { error } = await supabase
        .from('pev_groups')
        .delete()
        .eq('id', groupId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur suppression groupe:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Activer/Désactiver un groupe
   */
  async toggleGroupStatus(groupId, isActive) {
    return this.updateGroup(groupId, { is_active: isActive })
  },

  // ==========================================
  // CATÉGORIES DE GROUPES
  // ==========================================

  /**
   * Récupérer toutes les catégories
   */
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('pev_group_categories')
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
   * Créer une catégorie
   */
  async createCategory(category) {
    try {
      const { data, error } = await supabase
        .from('pev_group_categories')
        .insert({
          name: category.name,
          description: category.description,
          icon: category.icon || 'mdi-folder',
          color: category.color || 'teal',
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
   */
  async updateCategory(categoryId, updates) {
    try {
      const { data, error } = await supabase
        .from('pev_group_categories')
        .update({
          ...updates,
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
   */
  async deleteCategory(categoryId) {
    try {
      const { count } = await supabase
        .from('pev_groups')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId)

      if (count > 0) {
        return { 
          success: false, 
          error: `Impossible de supprimer: ${count} groupe(s) utilisent cette catégorie` 
        }
      }

      const { error } = await supabase
        .from('pev_group_categories')
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
  // MEMBRES
  // ==========================================

  /**
   * Récupérer les membres d'un groupe
   */
  async getGroupMembers(groupId, options = {}) {
    try {
      const { page = 1, limit = 20, status } = options

      let query = supabase
        .from('pev_group_members')
        .select(`
          *,
          pev_profiles:user_id(id, first_name, last_name, email, avatar_url)
        `, { count: 'exact' })
        .eq('group_id', groupId)

      if (status) query = query.eq('status', status)

      query = query.order('joined_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      const { data, error, count } = await query

      if (error) throw error

      return { success: true, data: data || [], total: count }
    } catch (error) {
      console.error('Erreur récupération membres:', error)
      return { success: false, error: error.message, data: [], total: 0 }
    }
  },

  /**
   * Approuver un membre
   */
  async approveMember(memberId) {
    try {
      const { error } = await supabase
        .from('pev_group_members')
        .update({ status: 'approved', approved_at: new Date().toISOString() })
        .eq('id', memberId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur approbation membre:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Rejeter/Retirer un membre
   */
  async removeMember(memberId) {
    try {
      const { error } = await supabase
        .from('pev_group_members')
        .delete()
        .eq('id', memberId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur suppression membre:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Promouvoir un membre admin
   */
  async setMemberRole(memberId, role) {
    try {
      const { error } = await supabase
        .from('pev_group_members')
        .update({ role })
        .eq('id', memberId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur changement rôle:', error)
      return { success: false, error: error.message }
    }
  },

  // ==========================================
  // STATISTIQUES
  // ==========================================

  /**
   * Récupérer les statistiques des groupes
   */
  async getGroupsStats() {
    try {
      const [groupsRes, activeRes, membersRes, postsRes] = await Promise.all([
        supabase.from('pev_groups').select('*', { count: 'exact', head: true }),
        supabase.from('pev_groups').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('pev_group_members').select('*', { count: 'exact', head: true }),
        supabase.from('pev_group_posts').select('*', { count: 'exact', head: true })
      ])

      // Posts cette semaine
      const oneWeekAgo = new Date()
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)
      const { count: postsWeek } = await supabase
        .from('pev_group_posts')
        .select('*', { count: 'exact', head: true })
        .gte('created_at', oneWeekAgo.toISOString())

      // Demandes en attente
      const { count: pendingMembers } = await supabase
        .from('pev_group_members')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      return {
        success: true,
        data: {
          total: groupsRes.count || 0,
          active: activeRes.count || 0,
          members: membersRes.count || 0,
          posts: postsRes.count || 0,
          postsWeek: postsWeek || 0,
          pendingMembers: pendingMembers || 0
        }
      }
    } catch (error) {
      console.error('Erreur stats groupes:', error)
      return { success: false, error: error.message, data: {} }
    }
  }
}
