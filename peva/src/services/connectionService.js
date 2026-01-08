/**
 * Service pour gérer les connexions entre utilisateurs/entreprises
 * Version complète avec intégration Supabase et envoi d'emails
 */
import { supabase } from '@/lib/supabase'
import notificationService from './notificationService'
import { emailService } from './emailService'
import { ref } from 'vue'

// Cache local pour les connexions
const connections = ref([])
const connectionRequests = ref([])

export const connectionService = {
  /**
   * Envoyer une demande de connexion
   */
  async sendRequest(requestData) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Utilisateur non authentifié')
      }

      // Vérifier si une demande existe déjà
      const { data: existingRequest } = await supabase
        .from('pev_connections')
        .select('*')
        .or(`and(requester_id.eq.${user.id},addressee_id.eq.${requestData.targetUserId}),and(requester_id.eq.${requestData.targetUserId},addressee_id.eq.${user.id})`)
        .single()

      if (existingRequest) {
        throw new Error('Une demande de connexion existe déjà entre ces utilisateurs')
      }

      // Créer la demande de connexion
      const { data: newRequest, error } = await supabase
        .from('pev_connections')
        .insert({
          requester_id: user.id,
          addressee_id: requestData.targetUserId,
          message: requestData.message,
          status: 'pending',
          requested_at: new Date().toISOString()
        })
        .select(`
          *,
          requester:pev_profiles!pev_connections_requester_id_fkey(first_name, last_name, avatar_url),
          addressee:pev_profiles!pev_connections_addressee_id_fkey(first_name, last_name, avatar_url)
        `)
        .single()

      if (error) throw error

      // Ajouter au cache local
      connectionRequests.value.push(newRequest)

      // Envoyer une notification in-app
      await notificationService.notifyConnectionRequest(
        requestData.targetUserId,
        `${newRequest.requester.first_name} ${newRequest.requester.last_name}`,
        requestData.message
      )

      // Envoyer un email de notification
      try {
        const { data: addresseeProfile } = await supabase
          .from('pev_profiles')
          .select('email, first_name, last_name')
          .eq('id', requestData.targetUserId)
          .single()

        if (addresseeProfile?.email) {
          await emailService.sendConnectionRequestNotification(
            addresseeProfile.email,
            `${addresseeProfile.first_name} ${addresseeProfile.last_name}`,
            `${newRequest.requester.first_name} ${newRequest.requester.last_name}`,
            '', // company_name non disponible
            `${window.location.origin}/connections`
          )
        }
      } catch (emailError) {
        console.warn('Erreur envoi email connexion:', emailError)
      }

      return { success: true, data: newRequest }
    } catch (error) {
      console.error('Erreur lors de l\'envoi de la demande:', error)
      throw error
    }
  },

  /**
   * Accepter une demande de connexion
   */
  async acceptRequest(requestId) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Utilisateur non authentifié')
      }

      // Mettre à jour le statut de la demande
      const { data: updatedRequest, error } = await supabase
        .from('pev_connections')
        .update({
          status: 'accepted',
          responded_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('addressee_id', user.id) // S'assurer que l'utilisateur peut accepter cette demande
        .select(`
          *,
          requester:pev_profiles!pev_connections_requester_id_fkey(first_name, last_name, avatar_url),
          addressee:pev_profiles!pev_connections_addressee_id_fkey(first_name, last_name, avatar_url)
        `)
        .single()

      if (error) throw error

      // Mettre à jour le cache local
      const localRequestIndex = connectionRequests.value.findIndex(r => r.id === requestId)
      if (localRequestIndex !== -1) {
        connectionRequests.value[localRequestIndex] = updatedRequest
      }

      // Ajouter à la liste des connexions actives
      connections.value.push(updatedRequest)

      // Notifier le demandeur (in-app)
      await notificationService.notifyConnectionAccepted(
        updatedRequest.requester_id,
        `${updatedRequest.addressee.first_name} ${updatedRequest.addressee.last_name}`
      )

      // Envoyer un email de notification
      try {
        const { data: requesterProfile } = await supabase
          .from('pev_profiles')
          .select('email, first_name, last_name')
          .eq('id', updatedRequest.requester_id)
          .single()

        if (requesterProfile?.email) {
          await emailService.sendTemplateEmail('connection_accepted', requesterProfile.email, {
            recipient_name: `${requesterProfile.first_name} ${requesterProfile.last_name}`,
            accepter_name: `${updatedRequest.addressee.first_name} ${updatedRequest.addressee.last_name}`,
            action_url: `${window.location.origin}/connections`
          })
        }
      } catch (emailError) {
        console.warn('Erreur envoi email connexion acceptée:', emailError)
      }

      return { success: true, data: updatedRequest }
    } catch (error) {
      console.error('Erreur lors de l\'acceptation:', error)
      throw error
    }
  },

  /**
   * Refuser une demande de connexion
   */
  async rejectRequest(requestId) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Utilisateur non authentifié')
      }

      // Mettre à jour le statut de la demande
      const { data: updatedRequest, error } = await supabase
        .from('pev_connections')
        .update({
          status: 'declined',
          responded_at: new Date().toISOString()
        })
        .eq('id', requestId)
        .eq('addressee_id', user.id)
        .select()
        .single()

      if (error) throw error

      // Mettre à jour le cache local
      const localRequestIndex = connectionRequests.value.findIndex(r => r.id === requestId)
      if (localRequestIndex !== -1) {
        connectionRequests.value[localRequestIndex] = updatedRequest
      }

      return { success: true, data: updatedRequest }
    } catch (error) {
      console.error('Erreur lors du refus:', error)
      throw error
    }
  },

  /**
   * Obtenir les demandes de connexion reçues
   */
  async getReceivedRequests(userId = null) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Utilisateur non authentifié')
      }

      const targetUserId = userId || user.id

      const { data, error } = await supabase
        .from('pev_connections')
        .select(`
          *,
          requester:pev_profiles!pev_connections_requester_id_fkey(first_name, last_name, avatar_url),
          addressee:pev_profiles!pev_connections_addressee_id_fkey(first_name, last_name, avatar_url)
        `)
        .eq('addressee_id', targetUserId)
        .eq('status', 'pending')
        .order('requested_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes reçues:', error)
      return []
    }
  },

  /**
   * Obtenir les demandes de connexion envoyées
   */
  async getSentRequests(userId = null) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Utilisateur non authentifié')
      }

      const targetUserId = userId || user.id

      const { data, error } = await supabase
        .from('pev_connections')
        .select(`
          *,
          requester:pev_profiles!pev_connections_requester_id_fkey(first_name, last_name, avatar_url),
          addressee:pev_profiles!pev_connections_addressee_id_fkey(first_name, last_name, avatar_url)
        `)
        .eq('requester_id', targetUserId)
        .order('requested_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des demandes envoyées:', error)
      return []
    }
  },

  /**
   * Obtenir les connexions actives
   */
  async getConnections(userId = null) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Utilisateur non authentifié')
      }

      const targetUserId = userId || user.id

      const { data, error } = await supabase
        .from('pev_connections')
        .select(`
          *,
          requester:pev_profiles!pev_connections_requester_id_fkey(first_name, last_name, avatar_url),
          addressee:pev_profiles!pev_connections_addressee_id_fkey(first_name, last_name, avatar_url)
        `)
        .or(`requester_id.eq.${targetUserId},addressee_id.eq.${targetUserId}`)
        .eq('status', 'accepted')
        .order('responded_at', { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Erreur lors de la récupération des connexions:', error)
      return []
    }
  },

  /**
   * Vérifier si deux utilisateurs sont connectés
   */
  async areConnected(user1Id, user2Id) {
    try {
      const { data, error } = await supabase
        .from('pev_connections')
        .select('id')
        .or(`and(requester_id.eq.${user1Id},addressee_id.eq.${user2Id}),and(requester_id.eq.${user2Id},addressee_id.eq.${user1Id})`)
        .eq('status', 'accepted')
        .single()

      return !!data
    } catch (error) {
      // Pas d'erreur si aucune connexion trouvée
      return false
    }
  },

  /**
   * Obtenir le statut d'une connexion entre deux utilisateurs
   */
  async getConnectionStatus(user1Id, user2Id) {
    try {
      const { data, error } = await supabase
        .from('pev_connections')
        .select('status, requester_id, addressee_id')
        .or(`and(requester_id.eq.${user1Id},addressee_id.eq.${user2Id}),and(requester_id.eq.${user2Id},addressee_id.eq.${user1Id})`)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      
      if (!data) return 'none'
      
      return {
        status: data.status,
        isRequester: data.requester_id === user1Id
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error)
      return 'none'
    }
  },

  /**
   * Supprimer une connexion
   */
  async removeConnection(connectionId) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Utilisateur non authentifié')
      }

      // Supprimer la connexion (seuls les participants peuvent la supprimer)
      const { error } = await supabase
        .from('pev_connections')
        .delete()
        .eq('id', connectionId)
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)

      if (error) throw error

      // Supprimer du cache local
      const index = connections.value.findIndex(c => c.id === connectionId)
      if (index !== -1) {
        connections.value.splice(index, 1)
      }

      return { success: true }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      throw error
    }
  },

  /**
   * Obtenir les statistiques de connexions d'un utilisateur
   */
  async getConnectionStats(userId = null) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Utilisateur non authentifié')
      }

      const targetUserId = userId || user.id

      // Compter les connexions actives
      const { count: activeConnections, error: activeError } = await supabase
        .from('pev_connections')
        .select('*', { count: 'exact', head: true })
        .or(`requester_id.eq.${targetUserId},addressee_id.eq.${targetUserId}`)
        .eq('status', 'accepted')

      if (activeError) throw activeError

      // Compter les demandes en attente (reçues)
      const { count: pendingReceived, error: pendingError } = await supabase
        .from('pev_connections')
        .select('*', { count: 'exact', head: true })
        .eq('addressee_id', targetUserId)
        .eq('status', 'pending')

      if (pendingError) throw pendingError

      // Compter les demandes envoyées en attente
      const { count: pendingSent, error: sentError } = await supabase
        .from('pev_connections')
        .select('*', { count: 'exact', head: true })
        .eq('requester_id', targetUserId)
        .eq('status', 'pending')

      if (sentError) throw sentError

      return {
        activeConnections: activeConnections || 0,
        pendingReceived: pendingReceived || 0,
        pendingSent: pendingSent || 0
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error)
      return {
        activeConnections: 0,
        pendingReceived: 0,
        pendingSent: 0
      }
    }
  },

  /**
   * Ajouter un utilisateur aux favoris
   */
  async addUserToFavorites(targetUserId) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Utilisateur non authentifié')
      }

      const { data, error } = await supabase
        .from('pev_favorites')
        .insert({
          entity_type: 'user',
          entity_id: targetUserId,
          user_id: user.id
        })
        .select()
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Erreur ajout favori utilisateur:', error)
      throw error
    }
  },

  /**
   * Retirer un utilisateur des favoris
   */
  async removeUserFromFavorites(targetUserId) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) {
        throw new Error('Utilisateur non authentifié')
      }

      const { error } = await supabase
        .from('pev_favorites')
        .delete()
        .eq('entity_type', 'user')
        .eq('entity_id', targetUserId)
        .eq('user_id', user.id)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Erreur suppression favori utilisateur:', error)
      throw error
    }
  },

  /**
   * Vérifier si un utilisateur est dans les favoris
   */
  async isUserFavorite(targetUserId) {
    try {
      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) return false

      const { data, error } = await supabase
        .from('pev_favorites')
        .select('id')
        .eq('entity_type', 'user')
        .eq('entity_id', targetUserId)
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return !!data
    } catch (error) {
      console.error('Erreur vérification favori:', error)
      return false
    }
  }
}

// Export des données réactives pour les composants
export { connections, connectionRequests }
