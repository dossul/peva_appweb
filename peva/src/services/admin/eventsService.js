import { supabase } from '@/lib/supabase'

/**
 * Service de gestion des événements pour l'administration 2iEGreenHub
 * CRUD complet pour événements, catégories, participants et commentaires
 */
export const eventsService = {
  // ==========================================
  // ÉVÉNEMENTS
  // ==========================================

  /**
   * Récupérer tous les événements avec pagination
   */
  async getEvents(options = {}) {
    try {
      const { page = 1, limit = 20, search, categoryId, status, countryId, upcoming } = options

      let query = supabase
        .from('pev_events')
        .select(`
          *,
          pev_profiles:created_by(id, first_name, last_name),
          pev_countries:country_id(id, name, flag),
          pev_event_categories:category_id(id, name, icon, color)
        `, { count: 'exact' })

      if (search) query = query.ilike('title', `%${search}%`)
      if (categoryId) query = query.eq('category_id', categoryId)
      if (status) query = query.eq('status', status)
      if (countryId) query = query.eq('country_id', countryId)
      if (upcoming) query = query.gte('start_date', new Date().toISOString())

      query = query.order('start_date', { ascending: true })
        .range((page - 1) * limit, page * limit - 1)

      const { data, error, count } = await query

      if (error) throw error

      return { success: true, data: data || [], total: count }
    } catch (error) {
      console.error('Erreur récupération événements:', error)
      return { success: false, error: error.message, data: [], total: 0 }
    }
  },

  /**
   * Récupérer un événement par ID
   */
  async getEventById(eventId) {
    try {
      const { data, error } = await supabase
        .from('pev_events')
        .select(`
          *,
          pev_profiles:created_by(id, first_name, last_name, email),
          pev_countries:country_id(id, name, flag),
          pev_event_categories:category_id(id, name, icon, color)
        `)
        .eq('id', eventId)
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Erreur récupération événement:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Créer un nouvel événement
   */
  async createEvent(event) {
    try {
      const { data, error } = await supabase
        .from('pev_events')
        .insert({
          title: event.title,
          description: event.description,
          category: event.category,
          category_id: event.category_id,
          event_type: event.event_type || 'conference',
          location: event.location,
          location_type: event.location_type || 'physical',
          address: event.address,
          city: event.city,
          country_id: event.country_id,
          online_link: event.online_link,
          start_date: event.start_date,
          end_date: event.end_date,
          registration_deadline: event.registration_deadline,
          max_participants: event.max_participants,
          registration_required: event.registration_required !== false,
          is_free: event.is_free || false,
          price: event.price,
          currency: event.currency || 'XOF',
          image_url: event.image_url,
          organizer_name: event.organizer_name,
          organizer_id: event.organizer_id,
          contact_email: event.contact_email,
          contact_phone: event.contact_phone,
          status: event.status || 'draft',
          is_featured: event.is_featured || false,
          created_by: event.created_by,
          participants_count: 0,
          views_count: 0,
          created_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Erreur création événement:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Mettre à jour un événement
   */
  async updateEvent(eventId, updates) {
    try {
      const { data, error } = await supabase
        .from('pev_events')
        .update({
          ...updates,
          updated_at: new Date().toISOString()
        })
        .eq('id', eventId)
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Erreur mise à jour événement:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Supprimer un événement
   */
  async deleteEvent(eventId) {
    try {
      // Supprimer les participants
      await supabase.from('pev_event_participants').delete().eq('event_id', eventId)
      
      // Supprimer les commentaires
      await supabase.from('pev_event_comments').delete().eq('event_id', eventId)

      // Supprimer l'événement
      const { error } = await supabase
        .from('pev_events')
        .delete()
        .eq('id', eventId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur suppression événement:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Publier/Dépublier un événement
   */
  async toggleEventStatus(eventId, status) {
    return this.updateEvent(eventId, { status })
  },

  /**
   * Mettre en avant un événement
   */
  async toggleFeatured(eventId, isFeatured) {
    return this.updateEvent(eventId, { is_featured: isFeatured })
  },

  // ==========================================
  // CATÉGORIES D'ÉVÉNEMENTS
  // ==========================================

  /**
   * Récupérer toutes les catégories
   */
  async getCategories() {
    try {
      const { data, error } = await supabase
        .from('pev_event_categories')
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
        .from('pev_event_categories')
        .insert({
          name: category.name,
          description: category.description,
          icon: category.icon || 'mdi-calendar',
          color: category.color || 'blue',
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
        .from('pev_event_categories')
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
        .from('pev_events')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', categoryId)

      if (count > 0) {
        return { 
          success: false, 
          error: `Impossible de supprimer: ${count} événement(s) utilisent cette catégorie` 
        }
      }

      const { error } = await supabase
        .from('pev_event_categories')
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
  // PARTICIPANTS
  // ==========================================

  /**
   * Récupérer les participants d'un événement
   */
  async getEventParticipants(eventId, options = {}) {
    try {
      const { page = 1, limit = 20, status } = options

      let query = supabase
        .from('pev_event_participants')
        .select(`
          *,
          pev_profiles:user_id(id, first_name, last_name, email, avatar_url)
        `, { count: 'exact' })
        .eq('event_id', eventId)

      if (status) query = query.eq('status', status)

      query = query.order('registration_date', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

      const { data, error, count } = await query

      if (error) throw error

      return { success: true, data: data || [], total: count }
    } catch (error) {
      console.error('Erreur récupération participants:', error)
      return { success: false, error: error.message, data: [], total: 0 }
    }
  },

  /**
   * Inscrire un participant
   */
  async registerParticipant(eventId, userId) {
    try {
      const { data, error } = await supabase
        .from('pev_event_participants')
        .insert({
          event_id: eventId,
          user_id: userId,
          status: 'registered',
          registration_date: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      // Incrémenter le compteur de participants
      await supabase.rpc('increment_event_participants', { event_id: eventId })

      return { success: true, data }
    } catch (error) {
      console.error('Erreur inscription participant:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Retirer un participant
   */
  async removeParticipant(participantId) {
    try {
      const { error } = await supabase
        .from('pev_event_participants')
        .delete()
        .eq('id', participantId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur suppression participant:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Marquer la présence d'un participant
   */
  async markAttendance(participantId, attended) {
    try {
      const { error } = await supabase
        .from('pev_event_participants')
        .update({
          attendance_status: attended ? 'present' : 'absent',
          attended_at: attended ? new Date().toISOString() : null
        })
        .eq('id', participantId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur marquage présence:', error)
      return { success: false, error: error.message }
    }
  },

  // ==========================================
  // COMMENTAIRES
  // ==========================================

  /**
   * Récupérer les commentaires d'un événement
   */
  async getEventComments(eventId) {
    try {
      const { data, error } = await supabase
        .from('pev_event_comments')
        .select(`
          *,
          pev_profiles:user_id(id, first_name, last_name, avatar_url)
        `)
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Erreur récupération commentaires:', error)
      return { success: false, error: error.message, data: [] }
    }
  },

  /**
   * Supprimer un commentaire
   */
  async deleteComment(commentId) {
    try {
      const { error } = await supabase
        .from('pev_event_comments')
        .delete()
        .eq('id', commentId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur suppression commentaire:', error)
      return { success: false, error: error.message }
    }
  },

  // ==========================================
  // STATISTIQUES
  // ==========================================

  /**
   * Récupérer les statistiques des événements
   */
  async getEventsStats() {
    try {
      const [eventsRes, upcomingRes, participantsRes, publishedRes] = await Promise.all([
        supabase.from('pev_events').select('*', { count: 'exact', head: true }),
        supabase.from('pev_events').select('*', { count: 'exact', head: true })
          .gte('start_date', new Date().toISOString()),
        supabase.from('pev_event_participants').select('*', { count: 'exact', head: true }),
        supabase.from('pev_events').select('*', { count: 'exact', head: true })
          .eq('status', 'published')
      ])

      // Événements ce mois
      const monthStart = new Date()
      monthStart.setDate(1)
      monthStart.setHours(0, 0, 0, 0)
      const { count: eventsMonth } = await supabase
        .from('pev_events')
        .select('*', { count: 'exact', head: true })
        .gte('start_date', monthStart.toISOString())

      return {
        success: true,
        data: {
          total: eventsRes.count || 0,
          upcoming: upcomingRes.count || 0,
          published: publishedRes.count || 0,
          participants: participantsRes.count || 0,
          thisMonth: eventsMonth || 0
        }
      }
    } catch (error) {
      console.error('Erreur stats événements:', error)
      return { success: false, error: error.message, data: {} }
    }
  }
}
