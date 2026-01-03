<template>
  <div class="messages-view">
    <!-- Header avec icône Messages -->
    <div class="messages-header bg-blue-darken-1 text-white py-6">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon size="32" class="mr-3">mdi-message</v-icon>
            <div>
              <h1 class="text-h4 font-weight-bold mb-1">Messages</h1>
              <p class="text-body-2 ma-0 opacity-80">Vos conversations sur 2iE GreenHub</p>
            </div>
          </div>
          <v-btn color="white" variant="flat" class="text-blue-darken-1" prepend-icon="mdi-plus" @click="startNewConversation">
            Nouvelle conversation
          </v-btn>
        </div>
      </v-container>
    </div>

    <v-container class="py-6">
      <v-row no-gutters style="height: calc(100vh - 120px);">
        <!-- Sidebar gauche avec conversations -->
        <v-col cols="12" md="4" class="conversations-sidebar">
          <!-- Barre de recherche et filtres -->
          <div class="search-section pa-4 bg-grey-lighten-5">
            <v-text-field
              v-model="searchQuery"
              placeholder="Rechercher une conversation..."
              variant="outlined"
              density="compact"
              prepend-inner-icon="mdi-magnify"
              hide-details
              class="mb-3"
            />
            
            <!-- Filtres -->
            <div class="d-flex ga-2">
              <v-chip
                :color="activeFilter === 'all' ? 'blue' : 'default'"
                size="small"
                @click="activeFilter = 'all'"
              >
                Toutes
              </v-chip>
              <v-chip
                :color="activeFilter === 'unread' ? 'blue' : 'default'"
                size="small"
                @click="activeFilter = 'unread'"
              >
                Non lues
              </v-chip>
              <v-chip
                :color="activeFilter === 'favorites' ? 'blue' : 'default'"
                size="small"
                @click="activeFilter = 'favorites'"
              >
                Favoris
              </v-chip>
              <v-chip
                :color="activeFilter === 'groups' ? 'blue' : 'default'"
                size="small"
                @click="activeFilter = 'groups'"
              >
                Groupes
              </v-chip>
            </div>
          </div>

          <!-- Liste des conversations -->
          <div class="conversations-list">
            <v-list class="pa-0">
              <v-list-item
                v-for="conversation in filteredConversations"
                :key="conversation.id"
                @click="selectConversation(conversation)"
                :class="{ 'selected-conversation': selectedConversation?.id === conversation.id }"
                class="conversation-item"
              >
                <template v-slot:prepend>
                  <div class="position-relative">
                    <v-avatar :color="conversation.avatarColor" size="48">
                      <span class="text-white font-weight-bold">{{ conversation.initials }}</span>
                    </v-avatar>
                    <v-badge
                      v-if="conversation.unreadCount > 0"
                      :content="conversation.unreadCount"
                      color="red"
                      class="position-absolute"
                      style="top: -5px; right: -5px;"
                    />
                    <div
                      v-if="conversation.isOnline"
                      class="online-indicator"
                    />
                  </div>
                </template>
                
                <div class="conversation-content">
                  <div class="d-flex justify-space-between align-center mb-1">
                    <v-list-item-title class="font-weight-bold">
                      {{ conversation.name }}
                    </v-list-item-title>
                    <span class="text-caption text-grey-darken-1">{{ conversation.time }}</span>
                  </div>
                  
                  <v-list-item-subtitle class="text-truncate">
                    <v-icon v-if="conversation.type === 'group'" size="14" class="mr-1">mdi-account-group</v-icon>
                    {{ conversation.lastMessage }}
                  </v-list-item-subtitle>
                  
                  <div class="d-flex align-center mt-1">
                    <v-chip
                      v-if="conversation.category"
                      size="x-small"
                      :color="getCategoryColor(conversation.category)"
                      class="mr-2"
                    >
                      {{ conversation.category }}
                    </v-chip>
                    <v-icon
                      v-if="conversation.isFavorite"
                      size="14"
                      color="amber"
                    >
                      mdi-star
                    </v-icon>
                  </div>
                </div>
              </v-list-item>
            </v-list>
          </div>
        </v-col>

        <!-- Zone de chat principale -->
        <v-col cols="12" md="8" class="chat-main">
          <div v-if="selectedConversation" class="chat-container d-flex flex-column h-100">
            <!-- En-tête de la conversation -->
            <div class="chat-header pa-4 bg-white border-b d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-avatar :color="selectedConversation.avatarColor" class="mr-3">
                  <span class="text-white font-weight-bold">{{ selectedConversation.initials }}</span>
                </v-avatar>
                <div>
                  <h3 class="text-h6 font-weight-bold">{{ selectedConversation.name }}</h3>
                  <div class="d-flex align-center">
                    <v-icon 
                      :color="selectedConversation.isOnline ? 'green' : 'grey'" 
                      size="12" 
                      class="mr-1"
                    >
                      mdi-circle
                    </v-icon>
                    <span class="text-caption">
                      {{ selectedConversation.isOnline ? 'En ligne' : selectedConversation.status }}
                    </span>
                  </div>
                </div>
              </div>
              
              <div class="d-flex ga-2">
                <v-btn icon size="small" variant="text">
                  <v-icon>mdi-phone</v-icon>
                </v-btn>
                <v-btn icon size="small" variant="text">
                  <v-icon>mdi-video</v-icon>
                </v-btn>
                <v-btn icon size="small" variant="text">
                  <v-icon>mdi-information</v-icon>
                </v-btn>
              </div>
            </div>

            <!-- Messages -->
            <div class="messages-container flex-grow-1 pa-4" ref="messagesContainer">
              <div
                v-for="message in selectedConversation.messages"
                :key="message.id"
                :class="['message-wrapper mb-4', message.sender === 'me' ? 'message-sent' : 'message-received']"
              >
                <div class="d-flex" :class="message.sender === 'me' ? 'justify-end' : 'justify-start'">
                  <div
                    :class="[
                      'message-bubble pa-3 rounded-lg max-width-70',
                      message.sender === 'me' ? 'bg-blue text-white' : 'bg-grey-lighten-3'
                    ]"
                  >
                    <div class="message-content">{{ message.content }}</div>
                    <div 
                      :class="[
                        'message-time text-caption mt-1',
                        message.sender === 'me' ? 'text-blue-lighten-4' : 'text-grey-darken-1'
                      ]"
                    >
                      {{ message.time }}
                      <v-icon 
                        v-if="message.sender === 'me'" 
                        size="12" 
                        class="ml-1"
                        :color="message.read ? 'blue-lighten-4' : 'blue-lighten-2'"
                      >
                        {{ message.read ? 'mdi-check-all' : 'mdi-check' }}
                      </v-icon>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Zone de saisie -->
            <div class="message-input pa-4 bg-white border-t">
              <div class="d-flex align-center ga-2">
                <v-btn icon size="small" variant="text">
                  <v-icon>mdi-paperclip</v-icon>
                </v-btn>
                <v-btn icon size="small" variant="text">
                  <v-icon>mdi-image</v-icon>
                </v-btn>
                <v-btn icon size="small" variant="text">
                  <v-icon>mdi-microphone</v-icon>
                </v-btn>
                
                <v-text-field
                  v-model="newMessage"
                  placeholder="Tapez votre message..."
                  variant="outlined"
                  density="compact"
                  hide-details
                  class="flex-grow-1"
                  @keyup.enter="sendMessage"
                />
                
                <v-btn
                  icon="mdi-send"
                  color="blue"
                  size="small"
                  @click="sendMessage"
                  :disabled="!newMessage.trim()"
                />
              </div>
              
              <div class="d-flex align-center justify-space-between mt-2">
                <v-checkbox
                  v-model="replyOnEnter"
                  label="Appuyer sur Entrée pour envoyer"
                  density="compact"
                  hide-details
                />
                <span class="text-caption text-grey-darken-1">
                  Shift+Entrée pour nouvelle ligne
                </span>
              </div>
            </div>
          </div>
          
          <!-- État vide -->
          <div v-else class="no-conversation d-flex align-center justify-center h-100">
            <div class="text-center">
              <v-icon size="80" color="grey-lighten-2">mdi-message-outline</v-icon>
              <h3 class="text-h5 mt-4 text-grey-darken-1">Sélectionnez une conversation</h3>
              <p class="text-grey-darken-1 mt-2">Choisissez une conversation dans la liste pour commencer à discuter</p>
              <v-btn color="blue" variant="flat" class="mt-4" @click="startNewConversation">
                <v-icon class="mr-2">mdi-plus</v-icon>
                Nouvelle conversation
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { messagesService } from '@/services/messagesService'
import { emailService } from '@/services/emailService'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// Reactive data
const searchQuery = ref('')
const activeFilter = ref('all')
const selectedConversation = ref(null)
const newMessage = ref('')
const replyOnEnter = ref(true)
const messagesContainer = ref(null)
const loading = ref(false)
const sendingMessage = ref(false)

// Données depuis Supabase
const conversations = ref([])
const currentUserId = ref(null)

// Channel temps réel
let conversationChannel = null
let userChannel = null

// Charger les conversations depuis Supabase
const loadConversations = async () => {
  loading.value = true
  try {
    const result = await messagesService.getConversations({
      type: activeFilter.value === 'groups' ? 'group' : null,
      favorites: activeFilter.value === 'favorites',
      unreadOnly: activeFilter.value === 'unread'
    })

    if (result.success) {
      conversations.value = result.data.map(conv => ({
        id: conv.id,
        name: conv.display_name || conv.name || 'Conversation',
        initials: getInitials(conv.display_name || conv.name),
        avatarColor: getAvatarColor(conv.id),
        avatarUrl: conv.avatar_url,
        lastMessage: conv.last_message_preview || 'Aucun message',
        time: formatTime(conv.last_message_at),
        isOnline: false, // À implémenter avec presence
        unreadCount: conv.unread_count || 0,
        type: conv.type,
        category: getCategoryFromTime(conv.last_message_at),
        isFavorite: conv.is_favorite,
        isMuted: conv.is_muted,
        otherUserId: conv.other_user_id,
        messages: []
      }))
    }
  } catch (error) {
    console.error('Erreur chargement conversations:', error)
  }
  loading.value = false
}

// Charger les messages d'une conversation
const loadMessages = async (conversationId) => {
  try {
    const result = await messagesService.getConversation(conversationId)
    
    if (result.success && result.data) {
      const conv = conversations.value.find(c => c.id === conversationId)
      if (conv) {
        conv.messages = result.data.messages.map(msg => ({
          id: msg.id,
          sender: msg.sender_id === currentUserId.value ? 'me' : 'other',
          senderId: msg.sender_id,
          senderName: msg.sender ? `${msg.sender.first_name} ${msg.sender.last_name}` : 'Utilisateur',
          senderAvatar: msg.sender?.avatar_url,
          content: msg.content,
          time: formatMessageTime(msg.created_at),
          read: true,
          isEdited: msg.is_edited
        }))
      }
    }
  } catch (error) {
    console.error('Erreur chargement messages:', error)
  }
}

// Obtenir l'utilisateur courant
const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    currentUserId.value = user.id
  }
}

// Computed
const filteredConversations = computed(() => {
  let filtered = conversations.value

  // Filtrer par recherche
  if (searchQuery.value) {
    filtered = filtered.filter(conv => 
      conv.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return filtered
})

// Helpers
const getInitials = (name) => {
  if (!name) return '?'
  const parts = name.split(' ')
  return parts.map(p => p[0]).join('').substring(0, 2).toUpperCase()
}

const getAvatarColor = (id) => {
  const colors = ['blue', 'green', 'purple', 'orange', 'teal', 'red', 'indigo']
  return colors[id % colors.length]
}

const formatTime = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  } else if (diffDays === 1) {
    return 'hier'
  } else if (diffDays < 7) {
    return date.toLocaleDateString('fr-FR', { weekday: 'short' })
  } else {
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })
  }
}

const formatMessageTime = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
}

const getCategoryFromTime = (dateString) => {
  if (!dateString) return 'Nouveau'
  const date = new Date(dateString)
  const now = new Date()
  const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return 'Aujourd\'hui'
  if (diffDays === 1) return 'Hier'
  if (diffDays < 7) return 'Cette semaine'
  return 'Plus ancien'
}

const getCategoryColor = (category) => {
  const colors = {
    'Aujourd\'hui': 'green',
    'Hier': 'blue',
    'Cette semaine': 'orange',
    'Plus ancien': 'grey',
    'Groupe': 'purple'
  }
  return colors[category] || 'grey'
}

// Methods
const selectConversation = async (conversation) => {
  selectedConversation.value = conversation
  
  // Charger les messages si pas encore chargés
  if (!conversation.messages || conversation.messages.length === 0) {
    await loadMessages(conversation.id)
  }
  
  // Marquer comme lu
  if (conversation.unreadCount > 0) {
    await messagesService.markAsRead(conversation.id)
    conversation.unreadCount = 0
  }
  
  // S'abonner aux nouveaux messages
  setupConversationRealtime(conversation.id)
  
  // Scroll vers le bas
  scrollToBottom()
}

const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedConversation.value || sendingMessage.value) return

  sendingMessage.value = true
  const messageContent = newMessage.value
  newMessage.value = ''

  try {
    const result = await messagesService.sendMessage(selectedConversation.value.id, messageContent)
    
    if (result.success) {
      // Ajouter le message localement
      const message = {
        id: result.data.id,
        sender: 'me',
        senderId: currentUserId.value,
        content: messageContent,
        time: formatMessageTime(new Date().toISOString()),
        read: false
      }
      
      selectedConversation.value.messages.push(message)
      selectedConversation.value.lastMessage = messageContent
      selectedConversation.value.time = message.time
      
      // Envoyer notification email au destinataire
      await sendEmailNotification(messageContent)
      
      scrollToBottom()
    } else {
      newMessage.value = messageContent // Restaurer le message en cas d'erreur
      console.error('Erreur envoi message:', result.error)
    }
  } catch (error) {
    newMessage.value = messageContent
    console.error('Erreur envoi message:', error)
  }
  
  sendingMessage.value = false
}

// Envoyer notification email
const sendEmailNotification = async (messageContent) => {
  if (!selectedConversation.value?.otherUserId) return
  
  try {
    // Récupérer les infos du destinataire
    const { data: recipient } = await supabase
      .from('pev_profiles')
      .select('email, first_name, last_name')
      .eq('id', selectedConversation.value.otherUserId)
      .single()
    
    if (recipient?.email) {
      const { data: sender } = await supabase
        .from('pev_profiles')
        .select('first_name, last_name')
        .eq('id', currentUserId.value)
        .single()
      
      const senderName = sender ? `${sender.first_name} ${sender.last_name}` : 'Un utilisateur'
      const recipientName = `${recipient.first_name || ''} ${recipient.last_name || ''}`.trim() || 'Utilisateur'
      const preview = messageContent.substring(0, 100)
      const conversationUrl = `${window.location.origin}/messages?conversation=${selectedConversation.value.id}`
      
      await emailService.sendNewMessageNotification(
        recipient.email,
        recipientName,
        senderName,
        preview,
        conversationUrl
      )
    }
  } catch (error) {
    console.log('Notification email non envoyée:', error.message)
  }
}

const scrollToBottom = () => {
  setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }, 100)
}

const startNewConversation = () => {
  router.push('/connections')
}

// Temps réel
const setupConversationRealtime = (conversationId) => {
  // Désabonner de l'ancienne conversation
  if (conversationChannel) {
    messagesService.unsubscribe(conversationChannel)
  }
  
  // S'abonner à la nouvelle conversation
  conversationChannel = messagesService.subscribeToConversation(conversationId, (event) => {
    if (event.type === 'new_message' && event.data.sender_id !== currentUserId.value) {
      // Nouveau message reçu
      const message = {
        id: event.data.id,
        sender: 'other',
        senderId: event.data.sender_id,
        senderName: event.data.sender ? `${event.data.sender.first_name} ${event.data.sender.last_name}` : 'Utilisateur',
        content: event.data.content,
        time: formatMessageTime(event.data.created_at),
        read: true
      }
      
      selectedConversation.value.messages.push(message)
      scrollToBottom()
    }
  })
}

// Gérer le contact depuis la carte
const handleContactFromMap = async (queryParams) => {
  const { contact, contactName, subject } = queryParams
  
  if (contact) {
    try {
      // Créer ou récupérer la conversation directe
      const result = await messagesService.getOrCreateDirectConversation(contact)
      
      if (result.success) {
        await loadConversations()
        
        const conv = conversations.value.find(c => c.id === result.data.id)
        if (conv) {
          await selectConversation(conv)
          
          if (subject) {
            newMessage.value = `Bonjour,\n\nJe vous contacte depuis 2iE GreenHub concernant : ${subject}\n\n`
          }
        }
      }
    } catch (error) {
      console.error('Erreur création conversation:', error)
    }
  }
}

// Watch pour le filtre actif
watch(activeFilter, () => {
  loadConversations()
})

// Initialize
onMounted(async () => {
  await getCurrentUser()
  await loadConversations()
  
  // Vérifier si on arrive avec des paramètres
  if (route.query.contact) {
    await handleContactFromMap(route.query)
  } else if (route.query.conversation) {
    const conv = conversations.value.find(c => c.id === parseInt(route.query.conversation))
    if (conv) {
      await selectConversation(conv)
    }
  } else if (conversations.value.length > 0) {
    await selectConversation(conversations.value[0])
  }
})

// Cleanup
onUnmounted(() => {
  if (conversationChannel) {
    messagesService.unsubscribe(conversationChannel)
  }
  if (userChannel) {
    messagesService.unsubscribe(userChannel)
  }
})
</script>

<style scoped>
.messages-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.messages-header {
  background: linear-gradient(135deg, #1565c0 0%, #1976d2 100%);
}

.conversations-sidebar {
  border-right: 1px solid #e0e0e0;
  background: white;
  border-radius: 12px 0 0 12px;
  overflow: hidden;
}

.chat-main {
  border-radius: 0 12px 12px 0;
}

.conversation-item {
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s ease;
}

.conversation-item:hover {
  background-color: #f5f5f5;
}

.selected-conversation {
  background-color: #e3f2fd !important;
  border-left: 4px solid #1976d2;
}

.online-indicator {
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 12px;
  height: 12px;
  background-color: #4caf50;
  border: 2px solid white;
  border-radius: 50%;
}

.chat-main {
  background: white;
}

.messages-container {
  background: #fafafa;
  overflow-y: auto;
  max-height: calc(100vh - 300px);
}

.message-bubble {
  max-width: 70%;
  word-wrap: break-word;
}

.max-width-70 {
  max-width: 70%;
}

.border-b {
  border-bottom: 1px solid #e0e0e0;
}

.border-t {
  border-top: 1px solid #e0e0e0;
}

.v-card {
  border-radius: 12px !important;
}

.v-btn {
  border-radius: 8px !important;
}
</style>
