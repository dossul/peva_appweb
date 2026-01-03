/**
 * Service de messagerie - 2iEGreenHub
 * CRUD complet pour conversations et messages avec Supabase
 */

import { supabase } from '@/lib/supabase'

export const messagesService = {
  // =====================================================
  // CONVERSATIONS
  // =====================================================

  /**
   * Récupérer toutes les conversations de l'utilisateur
   */
  async getConversations(options = {}) {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user?.user) return { success: false, error: 'Non authentifié' }

      let query = supabase
        .from('user_conversations')
        .select('*')
        .order('last_message_at', { ascending: false })

      if (options.type) {
        query = query.eq('type', options.type)
      }

      if (options.favorites) {
        query = query.eq('is_favorite', true)
      }

      if (options.unreadOnly) {
        query = query.gt('unread_count', 0)
      }

      const { data, error } = await query

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Erreur getConversations:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Récupérer une conversation par ID avec ses messages
   */
  async getConversation(conversationId, limit = 50) {
    try {
      // Récupérer la conversation
      const { data: conversation, error: convError } = await supabase
        .from('pev_conversations')
        .select(`
          *,
          participants:pev_conversation_participants(
            user_id,
            role,
            is_muted,
            is_favorite,
            unread_count,
            pev_profiles:user_id(id, first_name, last_name, avatar_url, organization)
          )
        `)
        .eq('id', conversationId)
        .single()

      if (convError) throw convError

      // Récupérer les messages
      const { data: messages, error: msgError } = await supabase
        .from('pev_messages')
        .select(`
          *,
          sender:sender_id(id, first_name, last_name, avatar_url),
          attachments:pev_message_attachments(*)
        `)
        .eq('conversation_id', conversationId)
        .eq('is_deleted', false)
        .order('created_at', { ascending: true })
        .limit(limit)

      if (msgError) throw msgError

      return { 
        success: true, 
        data: { 
          ...conversation, 
          messages: messages || [] 
        } 
      }
    } catch (error) {
      console.error('Erreur getConversation:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Créer ou récupérer une conversation directe
   */
  async getOrCreateDirectConversation(otherUserId) {
    try {
      const { data, error } = await supabase
        .rpc('create_direct_conversation', { other_user_id: otherUserId })

      if (error) throw error

      return { success: true, data: { id: data } }
    } catch (error) {
      console.error('Erreur getOrCreateDirectConversation:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Créer une conversation de groupe
   */
  async createGroupConversation(name, participantIds) {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user?.user) return { success: false, error: 'Non authentifié' }

      // Créer la conversation
      const { data: conversation, error: convError } = await supabase
        .from('pev_conversations')
        .insert({
          name,
          type: 'group',
          created_by: user.user.id
        })
        .select()
        .single()

      if (convError) throw convError

      // Ajouter le créateur comme admin
      const participants = [
        { conversation_id: conversation.id, user_id: user.user.id, role: 'admin' },
        ...participantIds.map(id => ({
          conversation_id: conversation.id,
          user_id: id,
          role: 'member'
        }))
      ]

      const { error: partError } = await supabase
        .from('pev_conversation_participants')
        .insert(participants)

      if (partError) throw partError

      return { success: true, data: conversation }
    } catch (error) {
      console.error('Erreur createGroupConversation:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Mettre à jour une conversation
   */
  async updateConversation(conversationId, updates) {
    try {
      const { data, error } = await supabase
        .from('pev_conversations')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', conversationId)
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Erreur updateConversation:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Archiver une conversation
   */
  async archiveConversation(conversationId) {
    return this.updateConversation(conversationId, { is_archived: true })
  },

  /**
   * Quitter une conversation
   */
  async leaveConversation(conversationId) {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user?.user) return { success: false, error: 'Non authentifié' }

      const { error } = await supabase
        .from('pev_conversation_participants')
        .update({ left_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.user.id)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur leaveConversation:', error)
      return { success: false, error: error.message }
    }
  },

  // =====================================================
  // MESSAGES
  // =====================================================

  /**
   * Envoyer un message
   */
  async sendMessage(conversationId, content, messageType = 'text') {
    try {
      const { data, error } = await supabase
        .rpc('send_message', {
          p_conversation_id: conversationId,
          p_content: content,
          p_message_type: messageType
        })

      if (error) throw error

      // Récupérer le message créé avec les détails
      const { data: message, error: fetchError } = await supabase
        .from('pev_messages')
        .select(`
          *,
          sender:sender_id(id, first_name, last_name, avatar_url)
        `)
        .eq('id', data)
        .single()

      if (fetchError) throw fetchError

      return { success: true, data: message }
    } catch (error) {
      console.error('Erreur sendMessage:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Modifier un message
   */
  async editMessage(messageId, newContent) {
    try {
      const { data, error } = await supabase
        .from('pev_messages')
        .update({
          content: newContent,
          is_edited: true,
          edited_at: new Date().toISOString()
        })
        .eq('id', messageId)
        .select()
        .single()

      if (error) throw error

      return { success: true, data }
    } catch (error) {
      console.error('Erreur editMessage:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Supprimer un message (soft delete)
   */
  async deleteMessage(messageId) {
    try {
      const { error } = await supabase
        .from('pev_messages')
        .update({
          is_deleted: true,
          deleted_at: new Date().toISOString()
        })
        .eq('id', messageId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur deleteMessage:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Marquer une conversation comme lue
   */
  async markAsRead(conversationId) {
    try {
      const { error } = await supabase
        .rpc('mark_conversation_read', { p_conversation_id: conversationId })

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur markAsRead:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Charger plus de messages (pagination)
   */
  async loadMoreMessages(conversationId, beforeMessageId, limit = 30) {
    try {
      const { data, error } = await supabase
        .from('pev_messages')
        .select(`
          *,
          sender:sender_id(id, first_name, last_name, avatar_url),
          attachments:pev_message_attachments(*)
        `)
        .eq('conversation_id', conversationId)
        .eq('is_deleted', false)
        .lt('id', beforeMessageId)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return { success: true, data: (data || []).reverse() }
    } catch (error) {
      console.error('Erreur loadMoreMessages:', error)
      return { success: false, error: error.message }
    }
  },

  // =====================================================
  // PARTICIPANTS
  // =====================================================

  /**
   * Ajouter un participant à une conversation de groupe
   */
  async addParticipant(conversationId, userId) {
    try {
      const { error } = await supabase
        .from('pev_conversation_participants')
        .insert({
          conversation_id: conversationId,
          user_id: userId,
          role: 'member'
        })

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur addParticipant:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Retirer un participant d'une conversation
   */
  async removeParticipant(conversationId, userId) {
    try {
      const { error } = await supabase
        .from('pev_conversation_participants')
        .update({ left_at: new Date().toISOString() })
        .eq('conversation_id', conversationId)
        .eq('user_id', userId)

      if (error) throw error

      return { success: true }
    } catch (error) {
      console.error('Erreur removeParticipant:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Basculer le statut favori d'une conversation
   */
  async toggleFavorite(conversationId) {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user?.user) return { success: false, error: 'Non authentifié' }

      // Récupérer le statut actuel
      const { data: current, error: fetchError } = await supabase
        .from('pev_conversation_participants')
        .select('is_favorite')
        .eq('conversation_id', conversationId)
        .eq('user_id', user.user.id)
        .single()

      if (fetchError) throw fetchError

      // Basculer
      const { error } = await supabase
        .from('pev_conversation_participants')
        .update({ is_favorite: !current.is_favorite })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.user.id)

      if (error) throw error

      return { success: true, data: { is_favorite: !current.is_favorite } }
    } catch (error) {
      console.error('Erreur toggleFavorite:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Basculer le statut muet d'une conversation
   */
  async toggleMute(conversationId) {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user?.user) return { success: false, error: 'Non authentifié' }

      const { data: current, error: fetchError } = await supabase
        .from('pev_conversation_participants')
        .select('is_muted')
        .eq('conversation_id', conversationId)
        .eq('user_id', user.user.id)
        .single()

      if (fetchError) throw fetchError

      const { error } = await supabase
        .from('pev_conversation_participants')
        .update({ is_muted: !current.is_muted })
        .eq('conversation_id', conversationId)
        .eq('user_id', user.user.id)

      if (error) throw error

      return { success: true, data: { is_muted: !current.is_muted } }
    } catch (error) {
      console.error('Erreur toggleMute:', error)
      return { success: false, error: error.message }
    }
  },

  // =====================================================
  // TEMPS RÉEL
  // =====================================================

  /**
   * S'abonner aux nouveaux messages d'une conversation
   */
  subscribeToConversation(conversationId, callback) {
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'pev_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        async (payload) => {
          // Enrichir le message avec les infos du sender
          const { data: message } = await supabase
            .from('pev_messages')
            .select(`
              *,
              sender:sender_id(id, first_name, last_name, avatar_url)
            `)
            .eq('id', payload.new.id)
            .single()

          callback({ type: 'new_message', data: message || payload.new })
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'pev_messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          callback({ type: 'message_updated', data: payload.new })
        }
      )
      .subscribe()

    return channel
  },

  /**
   * S'abonner aux nouvelles conversations
   */
  subscribeToConversations(userId, callback) {
    const channel = supabase
      .channel(`user_conversations:${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'pev_conversation_participants',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          callback({ type: 'conversation_update', data: payload })
        }
      )
      .subscribe()

    return channel
  },

  /**
   * Se désabonner d'un canal
   */
  unsubscribe(channel) {
    if (channel) {
      supabase.removeChannel(channel)
    }
  },

  // =====================================================
  // STATISTIQUES
  // =====================================================

  /**
   * Obtenir le nombre total de messages non lus
   */
  async getTotalUnreadCount() {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user?.user) return { success: false, error: 'Non authentifié' }

      const { data, error } = await supabase
        .from('pev_conversation_participants')
        .select('unread_count')
        .eq('user_id', user.user.id)
        .is('left_at', null)

      if (error) throw error

      const total = (data || []).reduce((sum, p) => sum + (p.unread_count || 0), 0)

      return { success: true, data: total }
    } catch (error) {
      console.error('Erreur getTotalUnreadCount:', error)
      return { success: false, error: error.message }
    }
  },

  /**
   * Rechercher dans les messages
   */
  async searchMessages(query, limit = 20) {
    try {
      const { data: user } = await supabase.auth.getUser()
      if (!user?.user) return { success: false, error: 'Non authentifié' }

      const { data, error } = await supabase
        .from('pev_messages')
        .select(`
          *,
          conversation:conversation_id(id, name, type),
          sender:sender_id(id, first_name, last_name)
        `)
        .ilike('content', `%${query}%`)
        .eq('is_deleted', false)
        .order('created_at', { ascending: false })
        .limit(limit)

      if (error) throw error

      return { success: true, data: data || [] }
    } catch (error) {
      console.error('Erreur searchMessages:', error)
      return { success: false, error: error.message }
    }
  }
}

export default messagesService
