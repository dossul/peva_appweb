import { supabase } from '@/lib/supabase'

/**
 * Service pour gérer les données des vues PEVA
 */
export class ViewsService {
  
  // ========== OPPORTUNITIES ==========
  
  /**
   * Récupère toutes les opportunités avec filtres
   */
  async getOpportunities(filters = {}) {
    try {
      let query = supabase
        .from('pev_opportunities')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      // Appliquer les filtres
      if (filters.type) {
        query = query.eq('type', filters.type)
      }
      if (filters.sector) {
        query = query.contains('sectors', [filters.sector])
      }
      if (filters.location) {
        query = query.eq('location', filters.location)
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des opportunités:', error)
      return []
    }
  }

  /**
   * Crée une nouvelle opportunité
   */
  async createOpportunity(opportunityData) {
    try {
      const { data, error } = await supabase
        .from('pev_opportunities')
        .insert([opportunityData])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Erreur lors de la création de l\'opportunité:', error)
      throw error
    }
  }

  // ========== EVENTS ==========
  
  /**
   * Récupère tous les événements
   */
  async getEvents(filters = {}) {
    try {
      let query = supabase
        .from('pev_events')
        .select('*')
        .eq('status', 'published')
        .order('start_date', { ascending: true })

      if (filters.type) {
        query = query.eq('type', filters.type)
      }
      if (filters.location) {
        query = query.eq('location', filters.location)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error)
      return []
    }
  }

  /**
   * Crée un nouvel événement
   */
  async createEvent(eventData) {
    try {
      const { data, error } = await supabase
        .from('pev_events')
        .insert([eventData])
        .select()

      if (error) throw error
      return data[0]
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error)
      throw error
    }
  }

  // ========== RESOURCES ==========
  
  /**
   * Récupère toutes les ressources
   */
  async getResources(filters = {}) {
    try {
      let query = supabase
        .from('pev_resources')
        .select(`
          *,
          pev_profiles!pev_resources_created_by_fkey(
            first_name,
            last_name
          )
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (filters.type) {
        query = query.eq('type', filters.type)
      }
      if (filters.sector) {
        query = query.contains('sectors', [filters.sector])
      }
      if (filters.level) {
        query = query.eq('level', filters.level)
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des ressources:', error)
      return []
    }
  }

  // ========== COMPANIES ==========
  
  /**
   * Récupère toutes les entreprises
   */
  async getCompanies(filters = {}) {
    try {
      let query = supabase
        .from('pev_companies')
        .select(`
          *,
          pev_profiles!pev_companies_owner_id_fkey(
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false })

      // Filtrer par statut si la colonne existe et a des valeurs valides
      // Les valeurs communes pour content_status sont: 'published', 'draft', 'archived'
      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      if (filters.size) {
        query = query.eq('size', filters.size)
      }
      if (filters.country) {
        query = query.eq('country', filters.country)
      }
      if (filters.industry) {
        query = query.contains('industries', [filters.industry])
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des entreprises:', error)
      return []
    }
  }

  // ========== PROFILES ==========
  
  /**
   * Récupère tous les profils pour l'annuaire
   * IMPORTANT: Exclut les profils admin, super_admin et moderator de l'annuaire public
   */
  async getProfiles(filters = {}) {
    try {
      // Emails des comptes admin à exclure de l'annuaire public
      const adminEmails = [
        'admin@2iegreenhub.org',
        'superadmin@2iegreenhub.org',
        'moderator@2iegreenhub.org'
      ]
      
      let query = supabase
        .from('pev_profiles')
        .select(`
          *,
          pev_companies(
            name,
            logo_url
          )
        `)
        // Exclure les profils admin de l'annuaire public par email
        .not('email', 'in', `(${adminEmails.join(',')})`)
        .order('created_at', { ascending: false })

      // Appliquer le filtre de type de profil uniquement s'il est valide
      if (filters.profileType) {
        const pt = filters.profileType
        if (Array.isArray(pt) && pt.length > 0) {
          query = query.contains('profile_types', pt)
        } else if (typeof pt === 'string' && pt.trim() !== '') {
          query = query.contains('profile_types', [pt])
        }
      }
      if (filters.country) {
        query = query.eq('country', filters.country)
      }
      if (filters.sectors && filters.sectors.length > 0) {
        query = query.overlaps('sectors', filters.sectors)
      }
      if (filters.search) {
        query = query.or(`first_name.ilike.%${filters.search}%,last_name.ilike.%${filters.search}%,bio.ilike.%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des profils:', error)
      return []
    }
  }

  // ========== GROUPS ==========
  
  /**
   * Récupère tous les groupes
   */
  async getGroups(filters = {}) {
    try {
      let query = supabase
        .from('pev_groups')
        .select(`
          *,
          pev_profiles!pev_groups_created_by_fkey(
            first_name,
            last_name
          ),
          pev_group_members(count)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false })

      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      if (filters.type) {
        query = query.eq('type', filters.type)
      }
      if (filters.search) {
        query = query.or(`name.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des groupes:', error)
      return []
    }
  }

  // ========== FORUM ==========
  
  /**
   * Récupère les discussions du forum
   */
  async getForumDiscussions(filters = {}) {
    try {
      let query = supabase
        .from('pev_forum_topics')
        .select(`
          *,
          pev_profiles!pev_forum_topics_user_id_fkey(
            first_name,
            last_name,
            avatar_url
          ),
          pev_forum_posts(count)
        `)
        .eq('status', 'active')
        .order('updated_at', { ascending: false })

      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      if (filters.search) {
        query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
      }

      const { data, error } = await query

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des discussions:', error)
      return []
    }
  }

  // ========== MESSAGES ==========
  
  /**
   * Récupère les conversations de l'utilisateur
   */
  async getConversations(userId) {
    try {
      const { data, error } = await supabase
        .from('pev_message_threads')
        .select(`
          *,
          pev_message_thread_participants!inner(
            pev_profiles(
              id,
              first_name,
              last_name,
              avatar_url
            )
          ),
          pev_messages(
            content,
            created_at,
            sender_id
          )
        `)
        .contains('conversation_participants.user_id', [userId])
        .order('updated_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des conversations:', error)
      return []
    }
  }

  // ========== STATISTICS ==========
  
  /**
   * Récupère les statistiques générales
   */
  async getStatistics() {
    try {
      const [
        { count: opportunitiesCount },
        { count: eventsCount },
        { count: resourcesCount },
        { count: companiesCount },
        { count: profilesCount },
        { count: groupsCount }
      ] = await Promise.all([
        supabase.from('pev_opportunities').select('*', { count: 'exact', head: true }),
        supabase.from('pev_events').select('*', { count: 'exact', head: true }),
        supabase.from('pev_resources').select('*', { count: 'exact', head: true }),
        supabase.from('pev_companies').select('*', { count: 'exact', head: true }),
        supabase.from('pev_profiles').select('*', { count: 'exact', head: true }),
        supabase.from('pev_groups').select('*', { count: 'exact', head: true })
      ])

      return {
        opportunities: opportunitiesCount || 0,
        events: eventsCount || 0,
        resources: resourcesCount || 0,
        companies: companiesCount || 0,
        profiles: profilesCount || 0,
        groups: groupsCount || 0
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      return {
        opportunities: 0,
        events: 0,
        resources: 0,
        companies: 0,
        profiles: 0,
        groups: 0
      }
    }
  }
}

// Instance singleton
export const viewsService = new ViewsService()
