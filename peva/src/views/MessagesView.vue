<template>
  <div class="messages-view">
    <!-- Header avec icône Messages -->
    <div class="messages-header bg-blue-darken-1 text-white py-4">
      <v-container>
        <div class="d-flex align-center">
          <v-icon size="32" class="mr-3">mdi-message</v-icon>
          <h1 class="text-h4 font-weight-bold">Messages</h1>
        </div>
      </v-container>
    </div>

    <v-container fluid class="pa-0">
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const searchQuery = ref('')
const activeFilter = ref('all')
const selectedConversation = ref(null)
const newMessage = ref('')
const replyOnEnter = ref(true)
const messagesContainer = ref(null)

// Mock data selon l'image
const conversations = ref([
  {
    id: 1,
    name: 'Sarah Okoye',
    initials: 'SO',
    avatarColor: 'green',
    lastMessage: 'Salut Amina ! J\'ai vu ton message sur le forum à propos du financement pour ta startup solaire en Côte d\'Ivoire. C\'est exactement le type de projet qui nous intéresse chez nous !',
    time: '14:22',
    isOnline: true,
    unreadCount: 2,
    type: 'direct',
    category: 'En ligne',
    isFavorite: false,
    status: 'Investisseuse Impact',
    messages: [
      {
        id: 1,
        sender: 'other',
        content: 'Salut Amina ! J\'ai vu ton message sur le forum à propos du financement pour ta startup solaire en Côte d\'Ivoire. C\'est exactement le type de projet qui nous intéresse chez nous !',
        time: '14:22',
        read: true
      },
      {
        id: 2,
        sender: 'other',
        content: 'Je peux te faire une intro avec quelques contacts chez I&P si tu veux. Ils sont très actifs en Afrique francophone et financent des projets d\'énergie verte.',
        time: '14:30',
        read: true
      },
      {
        id: 3,
        sender: 'other',
        content: 'Tu as déjà un business plan finalisé ? Et quel est ton timeline pour lever les fonds ?',
        time: '14:30',
        read: true
      },
      {
        id: 4,
        sender: 'me',
        content: 'Merci beaucoup Sarah ! C\'est super gentil de proposer ton aide. 🙏',
        time: '14:35',
        read: true
      }
    ]
  },
  {
    id: 2,
    name: 'Ahmed Ben Ali',
    initials: 'AA',
    avatarColor: 'blue',
    lastMessage: 'Merci pour tes conseils sur l\'installation solaire !',
    time: 'hier',
    isOnline: false,
    unreadCount: 0,
    type: 'direct',
    category: 'Hier',
    isFavorite: true,
    status: 'Hors ligne depuis 2h',
    messages: [
      {
        id: 1,
        sender: 'other',
        content: 'Merci pour tes conseils sur l\'installation solaire !',
        time: 'hier',
        read: true
      }
    ]
  },
  {
    id: 3,
    name: 'Groupe Energie Solaire CI',
    initials: 'ES',
    avatarColor: 'purple',
    lastMessage: 'Marie: Quelqu\'un connaît un bon installateur à Abidjan ?',
    time: '09:15',
    isOnline: true,
    unreadCount: 5,
    type: 'group',
    category: 'Groupe',
    isFavorite: false,
    status: '12 membres',
    messages: [
      {
        id: 1,
        sender: 'other',
        content: 'Quelqu\'un connaît un bon installateur à Abidjan ?',
        time: '09:15',
        read: true
      }
    ]
  },
  {
    id: 4,
    name: 'Marie Diop',
    initials: 'MD',
    avatarColor: 'orange',
    lastMessage: 'Super présentation à la conférence ! On peut collaborer ?',
    time: 'mar',
    isOnline: false,
    unreadCount: 0,
    type: 'direct',
    category: 'Cette semaine',
    isFavorite: false,
    status: 'Hors ligne depuis 1j',
    messages: [
      {
        id: 1,
        sender: 'other',
        content: 'Super présentation à la conférence ! On peut collaborer ?',
        time: 'mar',
        read: true
      }
    ]
  },
  {
    id: 5,
    name: 'Kwame Asante',
    initials: 'KA',
    avatarColor: 'teal',
    lastMessage: 'Les documents sont prêts pour signature',
    time: 'lun',
    isOnline: false,
    unreadCount: 0,
    type: 'direct',
    category: 'Cette semaine',
    isFavorite: false,
    status: 'Hors ligne depuis 3j',
    messages: [
      {
        id: 1,
        sender: 'other',
        content: 'Les documents sont prêts pour signature',
        time: 'lun',
        read: true
      }
    ]
  }
])

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

  // Filtrer par type
  switch (activeFilter.value) {
    case 'unread':
      filtered = filtered.filter(conv => conv.unreadCount > 0)
      break
    case 'favorites':
      filtered = filtered.filter(conv => conv.isFavorite)
      break
    case 'groups':
      filtered = filtered.filter(conv => conv.type === 'group')
      break
  }

  return filtered
})

// Methods
const selectConversation = (conversation) => {
  selectedConversation.value = conversation
  // Marquer comme lu
  conversation.unreadCount = 0
}

const sendMessage = () => {
  if (!newMessage.value.trim() || !selectedConversation.value) return

  const message = {
    id: Date.now(),
    sender: 'me',
    content: newMessage.value,
    time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
    read: false
  }

  selectedConversation.value.messages.push(message)
  selectedConversation.value.lastMessage = newMessage.value
  selectedConversation.value.time = message.time

  newMessage.value = ''

  // Scroll vers le bas
  setTimeout(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }, 100)
}

const startNewConversation = () => {
  // TODO: Ouvrir un dialog pour créer une nouvelle conversation
  console.log('Nouvelle conversation')
}

const getCategoryColor = (category) => {
  const colors = {
    'En ligne': 'green',
    'Hier': 'blue',
    'Groupe': 'purple',
    'Cette semaine': 'orange'
  }
  return colors[category] || 'grey'
}

// Initialize
onMounted(() => {
  // Vérifier si on arrive depuis la carte avec un contact
  const route = useRoute()
  if (route.query.contact) {
    handleContactFromMap(route.query)
  } else {
    // Sélectionner la première conversation par défaut
    if (conversations.value.length > 0) {
      selectConversation(conversations.value[0])
    }
  }
})

// Gérer le contact depuis la carte
const handleContactFromMap = (queryParams) => {
  const { contact, contactName, contactType, subject } = queryParams
  
  // Vérifier si une conversation existe déjà avec ce contact
  let existingConversation = conversations.value.find(conv => 
    conv.contactId === contact
  )
  
  if (!existingConversation) {
    // Créer une nouvelle conversation
    const newConversation = {
      id: Date.now(),
      contactId: contact,
      name: contactName || 'Nouveau Contact',
      initials: contactName ? contactName.substring(0, 2).toUpperCase() : 'NC',
      avatarColor: contactType === 'company' ? 'green' : 'blue',
      lastMessage: `Conversation avec ${contactName}`,
      time: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      isOnline: false,
      unreadCount: 0,
      type: 'direct',
      category: 'Nouveau',
      isFavorite: false,
      status: 'Nouveau contact',
      messages: []
    }
    
    // Ajouter la conversation en haut de la liste
    conversations.value.unshift(newConversation)
    existingConversation = newConversation
  }
  
  // Sélectionner la conversation
  selectConversation(existingConversation)
  
  // Pré-remplir le message si un sujet est fourni
  if (subject) {
    newMessage.value = `Bonjour,\n\nJe vous contacte depuis la carte interactive PEVA concernant : ${subject}\n\n`
  }
}
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
