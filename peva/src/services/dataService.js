/**
 * Service pour récupérer les données depuis Supabase
 * Plateforme Digitale Stratégique pour l'Écosystème de l'Économie Verte en Afrique
 * Version complète avec données réelles du Burkina Faso
 */

import { supabase } from '@/lib/supabase'

class DataService {
  /**
   * Récupérer les statistiques de la plateforme
   */
  async getPlatformStats() {
    try {
      const { data, error } = await supabase
        .from('pev_platform_stats')
        .select('*')
        .eq('is_active', true)
        .order('id')

      if (error) throw error
      
      // Les données sont déjà formatées dans la DB
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      // Retourner des données par défaut en cas d'erreur
      return [
        { key: 'companies', value: 150, formatted_value: '150+', label: 'Entreprises Vertes', icon: 'mdi-domain', color: 'blue' },
        { key: 'users', value: 2500, formatted_value: '2.5K', label: 'Membres Actifs', icon: 'mdi-account-group', color: 'green' },
        { key: 'opportunities', value: 89, formatted_value: '89', label: 'Opportunités', icon: 'mdi-briefcase', color: 'orange' },
        { key: 'events', value: 24, formatted_value: '24', label: 'Événements', icon: 'mdi-calendar', color: 'purple' }
      ]
    }
  }

  /**
   * Formater les valeurs statistiques pour l'affichage
   */
  formatStatValue(value) {
    if (value >= 1000000) {
      return (value / 1000000).toFixed(1) + 'M'
    } else if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'K'
    }
    return value.toString()
  }

  /**
   * Récupérer les secteurs actifs
   */
  async getSectors() {
    try {
      const { data, error } = await supabase
        .from('pev_sectors')
        .select('*')
        .eq('is_active', true)
        .order('sort_order')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des secteurs:', error)
      return []
    }
  }

  /**
   * Récupérer les ODD actifs
   */
  async getSDGs() {
    try {
      const { data, error } = await supabase
        .from('pev_sdgs')
        .select('*')
        .eq('is_active', true)
        .order('id')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des ODD:', error)
      return []
    }
  }

  /**
   * Récupérer les entreprises publiées
   */
  async getCompanies(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('pev_companies')
        .select(`
          *,
          owner:pev_profiles(first_name, last_name, avatar_url)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des entreprises:', error)
      return []
    }
  }

  /**
   * Récupérer les opportunités publiées
   */
  async getOpportunities(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('pev_opportunities')
        .select(`
          *,
          company:pev_companies(name, logo_url),
          creator:pev_profiles(first_name, last_name)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des opportunités:', error)
      return []
    }
  }

  /**
   * Récupérer les événements publiés
   */
  async getEvents(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('pev_events')
        .select(`
          *,
          creator:pev_profiles(first_name, last_name, avatar_url)
        `)
        .eq('status', 'published')
        .gte('end_at', new Date().toISOString()) // Événements futurs ou en cours
        .order('start_at', { ascending: true })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des événements:', error)
      return []
    }
  }

  /**
   * Récupérer les projets publiés
   */
  async getProjects(limit = 10) {
    try {
      const { data, error } = await supabase
        .from('pev_projects')
        .select(`
          *,
          owner:pev_profiles(first_name, last_name, avatar_url),
          company:pev_companies(name, logo_url)
        `)
        .eq('status', 'published')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des projets:', error)
      return []
    }
  }

  /**
   * Récupérer les témoignages approuvés
   */
  async getTestimonials(limit = 6) {
    try {
      const { data, error } = await supabase
        .from('pev_testimonials')
        .select(`
          *,
          user:pev_profiles(first_name, last_name, avatar_url, organization, position)
        `)
        .eq('is_approved', true)
        .eq('status', 'published')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des témoignages:', error)
      return []
    }
  }

  /**
   * Rechercher dans les entreprises
   */
  async searchCompanies(query, filters = {}) {
    try {
      let queryBuilder = supabase
        .from('pev_companies')
        .select(`
          *,
          owner:pev_profiles(first_name, last_name, avatar_url)
        `)
        .eq('status', 'published')

      // Recherche textuelle
      if (query) {
        queryBuilder = queryBuilder.or(`
          name.ilike.%${query}%,
          description.ilike.%${query}%,
          industry.ilike.%${query}%
        `)
      }

      // Filtres
      if (filters.country) {
        queryBuilder = queryBuilder.eq('country', filters.country)
      }
      if (filters.industry) {
        queryBuilder = queryBuilder.eq('industry', filters.industry)
      }
      if (filters.size) {
        queryBuilder = queryBuilder.eq('size', filters.size)
      }

      const { data, error } = await queryBuilder
        .order('is_verified', { ascending: false })
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la recherche d\'entreprises:', error)
      return []
    }
  }

  /**
   * Rechercher dans les opportunités
   */
  async searchOpportunities(query, filters = {}) {
    try {
      let queryBuilder = supabase
        .from('pev_opportunities')
        .select(`
          *,
          company:pev_companies(name, logo_url),
          creator:profiles(first_name, last_name)
        `)
        .eq('status', 'published')

      // Recherche textuelle
      if (query) {
        queryBuilder = queryBuilder.or(`
          title.ilike.%${query}%,
          description.ilike.%${query}%,
          category.ilike.%${query}%
        `)
      }

      // Filtres
      if (filters.type) {
        queryBuilder = queryBuilder.eq('type', filters.type)
      }
      if (filters.country) {
        queryBuilder = queryBuilder.eq('country', filters.country)
      }
      if (filters.is_remote !== undefined) {
        queryBuilder = queryBuilder.eq('is_remote', filters.is_remote)
      }

      const { data, error } = await queryBuilder
        .order('created_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la recherche d\'opportunités:', error)
      return []
    }
  }

  /**
   * Récupérer les données géographiques du Burkina Faso
   */
  async getBurkinaRegions() {
    try {
      const { data, error } = await supabase
        .from('pev_burkina_regions')
        .select('*')
        .order('name')

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des régions:', error)
      return []
    }
  }

  /**
   * Récupérer les villes du Burkina Faso
   */
  async getBurkinaCities() {
    try {
      const { data, error } = await supabase
        .from('pev_burkina_cities')
        .select(`
          *,
          region:pev_burkina_regions(name, name_fr)
        `)
        .order('population', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des villes:', error)
      return []
    }
  }

  /**
   * Créer une nouvelle entreprise
   */
  async createCompany(companyData) {
    try {
      const { data, error } = await supabase
        .from('pev_companies')
        .insert([companyData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur lors de la création de l\'entreprise:', error)
      throw error
    }
  }

  /**
   * Mettre à jour une entreprise
   */
  async updateCompany(id, companyData) {
    try {
      const { data, error } = await supabase
        .from('pev_companies')
        .update(companyData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'entreprise:', error)
      throw error
    }
  }

  /**
   * Supprimer une entreprise
   */
  async deleteCompany(id) {
    try {
      const { error } = await supabase
        .from('pev_companies')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'entreprise:', error)
      throw error
    }
  }

  /**
   * Créer une nouvelle opportunité
   */
  async createOpportunity(opportunityData) {
    try {
      const { data, error } = await supabase
        .from('pev_opportunities')
        .insert([opportunityData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur lors de la création de l\'opportunité:', error)
      throw error
    }
  }

  /**
   * Créer un nouvel événement
   */
  async createEvent(eventData) {
    try {
      const { data, error } = await supabase
        .from('pev_events')
        .insert([eventData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur lors de la création de l\'événement:', error)
      throw error
    }
  }

  /**
   * Créer une nouvelle ressource
   */
  async createResource(resourceData) {
    try {
      const { data, error } = await supabase
        .from('pev_resources')
        .insert([resourceData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur lors de la création de la ressource:', error)
      throw error
    }
  }

  /**
   * Obtenir les notifications d'un utilisateur
   */
  async getUserNotifications(userId, limit = 20) {
    try {
      const { data, error } = await supabase
        .from('pev_user_notifications_with_actor')
        .select('*')
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error)
      return []
    }
  }

  /**
   * Marquer une notification comme lue
   */
  async markNotificationAsRead(notificationId) {
    try {
      const { data, error } = await supabase
        .rpc('mark_notification_read', {
          p_notification_id: notificationId,
          p_user_id: (await supabase.auth.getUser()).data.user?.id
        })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error)
      throw error
    }
  }

  /**
   * Obtenir le nombre de notifications non lues
   */
  async getUnreadNotificationsCount(userId) {
    try {
      const { data, error } = await supabase
        .rpc('get_unread_count', { p_user_id: userId })

      if (error) throw error
      return data || 0
    } catch (error) {
      console.error('Erreur lors du comptage des notifications:', error)
      return 0
    }
  }
}

// Instance singleton
const dataService = new DataService()

export default dataService
