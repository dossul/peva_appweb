/**
 * Service de notifications temps réel avec Supabase Realtime
 * Gestion complète des notifications push, email et in-app
 */

import { supabase } from '@/lib/supabase'
import { ref, computed } from 'vue'

class NotificationService {
  constructor() {
    this.notifications = ref([])
    this.unreadCount = ref(0)
    this.isInitialized = ref(false)
    this.realtimeChannel = null
    this.userId = null
  }

  /**
   * Initialiser le service de notifications
   */
  async initialize(userId) {
    try {
      this.userId = userId
      
      // Charger les notifications existantes
      await this.loadNotifications()
      
      // Configurer les notifications temps réel
      await this.setupRealtimeSubscription()
      
      // Charger le compteur de notifications non lues
      await this.loadUnreadCount()
      
      this.isInitialized.value = true
      console.log('Service de notifications initialisé')
    } catch (error) {
      console.error('Erreur lors de l\'initialisation des notifications:', error)
    }
  }

  /**
   * Configurer l'abonnement temps réel
   */
  async setupRealtimeSubscription() {
    if (!this.userId) return

    // Se désabonner du canal précédent si il existe
    if (this.realtimeChannel) {
      await supabase.removeChannel(this.realtimeChannel)
    }

    // Créer un nouveau canal pour les notifications de l'utilisateur
    this.realtimeChannel = supabase
      .channel(`notifications:${this.userId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${this.userId}`
        },
        (payload) => {
          this.handleNewNotification(payload.new)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'notifications',
          filter: `recipient_id=eq.${this.userId}`
        },
        (payload) => {
          this.handleNotificationUpdate(payload.new)
        }
      )
      .subscribe()
  }

  /**
   * Gérer une nouvelle notification
   */
  async handleNewNotification(notification) {
    // Enrichir la notification avec les données de l'acteur
    const enrichedNotification = await this.enrichNotification(notification)
    
    // Ajouter à la liste
    this.notifications.value.unshift(enrichedNotification)
    
    // Mettre à jour le compteur
    if (!notification.is_read) {
      this.unreadCount.value++
    }
    
    // Afficher une notification push si supporté
    await this.showBrowserNotification(enrichedNotification)
    
    // Émettre un événement personnalisé
    this.emitNotificationEvent('new', enrichedNotification)
  }

  /**
   * Gérer la mise à jour d'une notification
   */
  handleNotificationUpdate(updatedNotification) {
    const index = this.notifications.value.findIndex(n => n.id === updatedNotification.id)
    if (index !== -1) {
      const oldNotification = this.notifications.value[index]
      this.notifications.value[index] = updatedNotification
      
      // Mettre à jour le compteur si le statut de lecture a changé
      if (oldNotification.is_read !== updatedNotification.is_read) {
        if (updatedNotification.is_read) {
          this.unreadCount.value = Math.max(0, this.unreadCount.value - 1)
        } else {
          this.unreadCount.value++
        }
      }
      
      this.emitNotificationEvent('updated', updatedNotification)
    }
  }

  /**
   * Enrichir une notification avec les données de l'acteur
   */
  async enrichNotification(notification) {
    if (!notification.actor_id) {
      return {
        ...notification,
        actor_name: 'Système PEVA',
        actor_avatar: null,
        actor_organization: null
      }
    }

    try {
      const { data: actor, error } = await supabase
        .from('pev_profiles')
        .select('first_name, last_name, avatar_url, organization')
        .eq('id', notification.actor_id)
        .single()

      if (error) throw error

      return {
        ...notification,
        actor_name: `${actor.first_name} ${actor.last_name}`,
        actor_avatar: actor.avatar_url,
        actor_organization: actor.organization
      }
    } catch (error) {
      console.error('Erreur lors de l\'enrichissement de la notification:', error)
      return {
        ...notification,
        actor_name: 'Utilisateur',
        actor_avatar: null,
        actor_organization: null
      }
    }
  }

  /**
   * Charger les notifications existantes
   */
  async loadNotifications(limit = 50) {
    if (!this.userId) return

    try {
      const { data, error } = await supabase
        .from('user_notifications_with_actor')
        .select('*')
        .eq('recipient_id', this.userId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      this.notifications.value = data || []
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error)
      this.notifications.value = []
    }
  }

  /**
   * Charger le compteur de notifications non lues
   */
  async loadUnreadCount() {
    if (!this.userId) return

    try {
      const { data, error } = await supabase
        .rpc('get_unread_count', { p_user_id: this.userId })

      if (error) throw error
      this.unreadCount.value = data || 0
    } catch (error) {
      console.error('Erreur lors du chargement du compteur:', error)
      this.unreadCount.value = 0
    }
  }

  /**
   * Créer une nouvelle notification
   */
  async createNotification(recipientId, actorId, type, options = {}) {
    try {
      const { data, error } = await supabase
        .rpc('create_notification', {
          p_recipient_id: recipientId,
          p_actor_id: actorId,
          p_type: type,
          p_related_entity: options.relatedEntity || null,
          p_related_id: options.relatedId || null,
          p_title: options.title || null,
          p_message: options.message || null,
          p_priority: options.priority || 'normal'
        })

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error)
      throw error
    }
  }

  /**
   * Marquer une notification comme lue
   */
  async markAsRead(notificationId) {
    try {
      const { data, error } = await supabase
        .rpc('mark_notification_read', {
          p_notification_id: notificationId,
          p_user_id: this.userId
        })

      if (error) throw error

      // Mettre à jour localement
      const notification = this.notifications.value.find(n => n.id === notificationId)
      if (notification && !notification.is_read) {
        notification.is_read = true
        notification.read_at = new Date().toISOString()
        this.unreadCount.value = Math.max(0, this.unreadCount.value - 1)
      }

      return data
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error)
      throw error
    }
  }

  /**
   * Marquer toutes les notifications comme lues
   */
  async markAllAsRead() {
    try {
      const unreadNotifications = this.notifications.value.filter(n => !n.is_read)
      
      for (const notification of unreadNotifications) {
        await this.markAsRead(notification.id)
      }

      return true
    } catch (error) {
      console.error('Erreur lors du marquage global:', error)
      throw error
    }
  }

  /**
   * Supprimer une notification
   */
  async deleteNotification(notificationId) {
    try {
      const { error } = await supabase
        .from('pev_notifications')
        .delete()
        .eq('id', notificationId)
        .eq('recipient_id', this.userId)

      if (error) throw error

      // Supprimer localement
      const index = this.notifications.value.findIndex(n => n.id === notificationId)
      if (index !== -1) {
        const notification = this.notifications.value[index]
        if (!notification.is_read) {
          this.unreadCount.value = Math.max(0, this.unreadCount.value - 1)
        }
        this.notifications.value.splice(index, 1)
      }

      return true
    } catch (error) {
      console.error('Erreur lors de la suppression:', error)
      throw error
    }
  }

  /**
   * Obtenir les préférences de notifications
   */
  async getPreferences() {
    if (!this.userId) return null

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('user_id', this.userId)
        .single()

      if (error && error.code !== 'PGRST116') throw error

      return data || this.getDefaultPreferences()
    } catch (error) {
      console.error('Erreur lors de la récupération des préférences:', error)
      return this.getDefaultPreferences()
    }
  }

  /**
   * Mettre à jour les préférences de notifications
   */
  async updatePreferences(preferences) {
    if (!this.userId) return false

    try {
      const { data, error } = await supabase
        .from('notification_preferences')
        .upsert({
          user_id: this.userId,
          ...preferences,
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur lors de la mise à jour des préférences:', error)
      throw error
    }
  }

  /**
   * Obtenir les préférences par défaut
   */
  getDefaultPreferences() {
    return {
      email_notifications: true,
      push_notifications: true,
      sms_notifications: false,
      newsletter: true,
      marketing: false,
      connection_requests: true,
      messages: true,
      opportunities: true,
      events: true,
      forum_replies: true,
      system_updates: true,
      digest_frequency: 'daily',
      quiet_hours_start: '22:00',
      quiet_hours_end: '08:00',
      timezone: 'UTC'
    }
  }

  /**
   * Afficher une notification navigateur
   */
  async showBrowserNotification(notification) {
    // Vérifier si les notifications sont supportées et autorisées
    if (!('Notification' in window) || Notification.permission !== 'granted') {
      return
    }

    try {
      const browserNotification = new Notification(notification.title || 'PEVA', {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: `peva-${notification.id}`,
        requireInteraction: notification.priority === 'urgent',
        data: {
          notificationId: notification.id,
          actionUrl: notification.action_url
        }
      })

      // Gérer le clic sur la notification
      browserNotification.onclick = () => {
        window.focus()
        if (notification.action_url) {
          window.location.href = notification.action_url
        }
        browserNotification.close()
      }

      // Fermer automatiquement après 5 secondes sauf si urgente
      if (notification.priority !== 'urgent') {
        setTimeout(() => {
          browserNotification.close()
        }, 5000)
      }
    } catch (error) {
      console.error('Erreur lors de l\'affichage de la notification navigateur:', error)
    }
  }

  /**
   * Demander la permission pour les notifications navigateur
   */
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      return 'not-supported'
    }

    if (Notification.permission === 'granted') {
      return 'granted'
    }

    if (Notification.permission === 'denied') {
      return 'denied'
    }

    const permission = await Notification.requestPermission()
    return permission
  }

  /**
   * Émettre un événement de notification personnalisé
   */
  emitNotificationEvent(type, notification) {
    const event = new CustomEvent('peva-notification', {
      detail: { type, notification }
    })
    window.dispatchEvent(event)
  }

  /**
   * Nettoyer les ressources
   */
  async cleanup() {
    if (this.realtimeChannel) {
      await supabase.removeChannel(this.realtimeChannel)
      this.realtimeChannel = null
    }
    
    this.notifications.value = []
    this.unreadCount.value = 0
    this.isInitialized.value = false
    this.userId = null
  }

  /**
   * Getters réactifs
   */
  get allNotifications() {
    return computed(() => this.notifications.value)
  }

  get unreadNotifications() {
    return computed(() => this.notifications.value.filter(n => !n.is_read))
  }

  get readNotifications() {
    return computed(() => this.notifications.value.filter(n => n.is_read))
  }

  get unreadNotificationsCount() {
    return computed(() => this.unreadCount.value)
  }

  get isReady() {
    return computed(() => this.isInitialized.value)
  }

  /**
   * Méthodes utilitaires pour les types de notifications courants
   */
  async notifyConnectionRequest(recipientId, senderName, message = '') {
    return this.createNotification(recipientId, this.userId, 'connection_request', {
      title: 'Nouvelle demande de connexion',
      message: `${senderName} souhaite se connecter avec vous`,
      priority: 'normal'
    })
  }

  async notifyConnectionAccepted(recipientId, accepterName) {
    return this.createNotification(recipientId, this.userId, 'connection_accepted', {
      title: 'Connexion acceptée',
      message: `${accepterName} a accepté votre demande de connexion`,
      priority: 'normal'
    })
  }

  async notifyNewMessage(recipientId, senderName, preview = '') {
    return this.createNotification(recipientId, this.userId, 'new_message', {
      title: 'Nouveau message',
      message: `Message de ${senderName}${preview ? ': ' + preview : ''}`,
      priority: 'normal'
    })
  }

  async notifyOpportunityApplication(recipientId, applicantName, opportunityTitle) {
    return this.createNotification(recipientId, this.userId, 'opportunity_application', {
      title: 'Nouvelle candidature',
      message: `${applicantName} a postulé pour "${opportunityTitle}"`,
      priority: 'normal'
    })
  }

  async notifyEventReminder(recipientId, eventTitle, timeUntil) {
    return this.createNotification(recipientId, null, 'event_reminder', {
      title: 'Rappel d\'événement',
      message: `"${eventTitle}" commence ${timeUntil}`,
      priority: 'high'
    })
  }
}

// Instance singleton
const notificationService = new NotificationService()

export default notificationService
