<template>
  <div class="user-profile-view">
    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-center align-center" style="min-height: 400px;">
      <v-progress-circular indeterminate color="green" size="64" />
    </div>

    <!-- Erreur -->
    <v-container v-else-if="error" class="py-8">
      <v-alert type="error" class="mb-4">
        {{ error }}
      </v-alert>
      <v-btn color="green" @click="router.push('/directory')">
        Retour à l'annuaire
      </v-btn>
    </v-container>

    <!-- Contenu du profil -->
    <template v-else>
      <div class="profile-banner bg-green-darken-2 text-white py-12">
        <v-container>
          <div class="d-flex align-center flex-wrap">
            <!-- Avatar -->
            <div class="position-relative mr-6 mb-4 mb-md-0">
              <v-avatar size="120" class="profile-avatar">
                <v-img
                  v-if="profileData.avatar_url"
                  :src="profileData.avatar_url"
                  :alt="fullName"
                />
                <div v-else class="d-flex align-center justify-center bg-white text-green-darken-2 w-100 h-100">
                  <span class="text-h3 font-weight-bold">{{ initials }}</span>
                </div>
              </v-avatar>
            </div>
            
            <!-- Informations principales -->
            <div class="flex-grow-1 mb-4 mb-md-0">
              <h1 class="text-h3 font-weight-bold mb-2">{{ fullName }}</h1>
              <p class="text-h6 mb-2">{{ profileData.user_type || 'Utilisateur' }}</p>
              <div v-if="profileData.location" class="d-flex align-center mb-3">
                <v-icon class="mr-2">mdi-map-marker</v-icon>
                <span>{{ profileData.location }}</span>
              </div>
            </div>
            
            <!-- Actions -->
            <div class="d-flex flex-column ga-2">
              <!-- Bouton Connexion -->
              <v-btn 
                v-if="connectionStatus === 'none'"
                color="white" 
                variant="flat" 
                prepend-icon="mdi-account-plus" 
                class="text-green-darken-2"
                @click="openConnectionDialog"
              >
                Ajouter à mon réseau
              </v-btn>
              <v-btn 
                v-else-if="connectionStatus === 'pending' && isRequester"
                color="orange-lighten-4" 
                variant="flat" 
                prepend-icon="mdi-clock-outline"
                class="text-orange-darken-3"
                disabled
              >
                Demande envoyée
              </v-btn>
              <v-btn 
                v-else-if="connectionStatus === 'pending' && !isRequester"
                color="blue" 
                variant="flat" 
                prepend-icon="mdi-account-check"
                @click="acceptConnection"
                :loading="actionLoading"
              >
                Accepter la demande
              </v-btn>
              <v-btn 
                v-else-if="connectionStatus === 'accepted'"
                color="green-lighten-4" 
                variant="flat" 
                prepend-icon="mdi-check-circle"
                class="text-green-darken-3"
                disabled
              >
                Connecté
              </v-btn>

              <!-- Bouton Message -->
              <v-btn 
                color="white" 
                variant="outlined" 
                prepend-icon="mdi-email"
                @click="sendMessage"
                :loading="messageLoading"
              >
                Envoyer un message
              </v-btn>

              <!-- Bouton Favoris -->
              <v-btn 
                :color="isFavorite ? 'red-lighten-4' : 'white'" 
                :variant="isFavorite ? 'flat' : 'outlined'"
                :prepend-icon="isFavorite ? 'mdi-heart' : 'mdi-heart-outline'"
                :class="isFavorite ? 'text-red-darken-2' : ''"
                @click="toggleFavorite"
                :loading="favoriteLoading"
              >
                {{ isFavorite ? 'Favori' : 'Ajouter aux favoris' }}
              </v-btn>
            </div>
          </div>
          
          <!-- Statistiques -->
          <v-row class="mt-6">
            <v-col cols="4" class="text-center">
              <div class="text-h4 font-weight-bold">{{ stats.connections }}</div>
              <div class="text-body-2">Connexions</div>
            </v-col>
            <v-col cols="4" class="text-center">
              <div class="text-h4 font-weight-bold">{{ stats.opportunities }}</div>
              <div class="text-body-2">Opportunités</div>
            </v-col>
            <v-col cols="4" class="text-center">
              <div class="text-h4 font-weight-bold">{{ stats.resources }}</div>
              <div class="text-body-2">Ressources</div>
            </v-col>
          </v-row>
        </v-container>
      </div>

      <v-container class="py-8">
        <v-row>
          <!-- Colonne principale -->
          <v-col cols="12" md="8">
            <!-- À propos -->
            <v-card class="mb-6" elevation="2">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-account</v-icon>
                À propos
              </v-card-title>
              <v-card-text class="pa-4">
                <p v-if="profileData.bio" class="text-body-1 mb-4">{{ profileData.bio }}</p>
                <p v-else class="text-body-2 text-grey-darken-1">Aucune description disponible.</p>
                
                <!-- Secteur -->
                <div v-if="profileData.sector" class="mb-4">
                  <h3 class="text-h6 font-weight-bold mb-2">Secteur d'activité</h3>
                  <v-chip color="green" size="small">
                    {{ profileData.sector }}
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
            
            <!-- Opportunités créées -->
            <v-card v-if="createdOpportunities.length > 0" elevation="2">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-briefcase</v-icon>
                Opportunités publiées
              </v-card-title>
              <v-card-text class="pa-4">
                <div
                  v-for="opp in createdOpportunities"
                  :key="opp.id"
                  class="d-flex align-center pa-3 mb-3 bg-grey-lighten-5 rounded cursor-pointer"
                  @click="router.push(`/opportunities/${opp.id}`)"
                >
                  <v-avatar color="green" size="32" class="mr-3">
                    <v-icon color="white" size="16">mdi-briefcase</v-icon>
                  </v-avatar>
                  <div class="flex-grow-1">
                    <h4 class="text-body-1 font-weight-bold">{{ opp.title }}</h4>
                    <div class="d-flex align-center mt-1">
                      <v-chip size="x-small" color="blue" class="mr-2">
                        {{ opp.type || 'Opportunité' }}
                      </v-chip>
                      <span v-if="opp.funding_amount" class="text-caption">
                        {{ opp.funding_amount }} {{ opp.currency || 'FCFA' }}
                      </span>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
          
          <!-- Sidebar droite -->
          <v-col cols="12" md="4">
            <!-- Contact -->
            <v-card class="mb-4" elevation="2">
              <v-card-title class="pa-4">Contact</v-card-title>
              <v-card-text class="pa-4">
                <v-btn
                  color="green-darken-2"
                  variant="flat"
                  block
                  prepend-icon="mdi-email"
                  class="mb-3"
                  @click="sendMessage"
                  :loading="messageLoading"
                >
                  Envoyer un message
                </v-btn>
              </v-card-text>
            </v-card>
            
            <!-- Informations -->
            <v-card elevation="2">
              <v-card-title class="pa-4">Informations</v-card-title>
              <v-card-text class="pa-4">
                <div class="mb-3" v-if="profileData.organization">
                  <div class="text-caption text-grey-darken-1">Organisation</div>
                  <div class="text-body-2 font-weight-bold">{{ profileData.organization }}</div>
                </div>
                <div class="mb-3" v-if="profileData.sector">
                  <div class="text-caption text-grey-darken-1">Secteur</div>
                  <div class="text-body-2 font-weight-bold">{{ profileData.sector }}</div>
                </div>
                <div class="mb-3" v-if="profileData.location">
                  <div class="text-caption text-grey-darken-1">Localisation</div>
                  <div class="text-body-2 font-weight-bold">{{ profileData.location }}</div>
                </div>
                <div v-if="profileData.member_since">
                  <div class="text-caption text-grey-darken-1">Membre depuis</div>
                  <div class="text-body-2 font-weight-bold">{{ profileData.member_since }}</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </template>

    <!-- Dialog Demande de connexion -->
    <v-dialog v-model="connectionDialog" max-width="500">
      <v-card>
        <v-card-title class="pa-4 bg-green-darken-2 text-white">
          <v-icon class="mr-2">mdi-account-plus</v-icon>
          Ajouter à mon réseau
        </v-card-title>
        <v-card-text class="pa-4">
          <div class="d-flex align-center mb-4">
            <v-avatar size="48" class="mr-3">
              <v-img v-if="profileData.avatar_url" :src="profileData.avatar_url" />
              <span v-else class="text-h6">{{ initials }}</span>
            </v-avatar>
            <div>
              <div class="font-weight-bold">{{ fullName }}</div>
              <div class="text-caption text-grey-darken-1">{{ profileData.user_type || 'Utilisateur' }}</div>
            </div>
          </div>
          
          <p class="text-body-2 mb-4">
            Envoyez une demande de connexion pour échanger avec cet utilisateur.
          </p>
          
          <v-textarea
            v-model="connectionMessage"
            label="Message personnalisé (optionnel)"
            variant="outlined"
            rows="3"
            counter="500"
            :rules="[v => !v || v.length <= 500 || 'Maximum 500 caractères']"
            placeholder="Bonjour, je souhaiterais me connecter avec vous..."
          />
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="connectionDialog = false">Annuler</v-btn>
          <v-btn 
            color="green-darken-2" 
            variant="flat" 
            :loading="actionLoading" 
            @click="sendConnectionRequest"
          >
            Envoyer la demande
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="4000"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">
          Fermer
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'
import { connectionService } from '@/services/connectionService'
import { messagesService } from '@/services/messagesService'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const error = ref(null)
const actionLoading = ref(false)
const messageLoading = ref(false)
const favoriteLoading = ref(false)

const profileData = ref({
  first_name: '',
  last_name: '',
  user_type: '',
  sector: '',
  location: '',
  bio: '',
  avatar_url: null,
  organization: '',
  member_since: ''
})

const stats = ref({
  connections: 0,
  opportunities: 0,
  resources: 0
})

const createdOpportunities = ref([])
const connectionStatus = ref('none')
const isRequester = ref(false)
const isFavorite = ref(false)
const connectionDialog = ref(false)
const connectionMessage = ref('')
const pendingConnectionId = ref(null)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const fullName = computed(() => {
  return `${profileData.value.first_name || ''} ${profileData.value.last_name || ''}`.trim() || 'Utilisateur'
})

const initials = computed(() => {
  return `${profileData.value.first_name?.[0] || ''}${profileData.value.last_name?.[0] || ''}`.toUpperCase() || '?'
})

const showMessage = (message, color = 'success') => {
  snackbar.value = { show: true, message, color }
}

const loadProfile = async () => {
  loading.value = true
  error.value = null
  
  try {
    const userId = route.params.id
    
    if (!userId) {
      error.value = 'ID utilisateur non spécifié'
      return
    }
    
    if (authStore.user?.id === userId) {
      router.replace('/profile')
      return
    }
    
    const { data: profile, error: profileError } = await supabase
      .from('pev_profiles')
      .select('id, first_name, last_name, email, avatar_url, user_type, sector, bio, location, organization, created_at')
      .eq('id', userId)
      .single()
    
    if (profileError) {
      if (profileError.code === 'PGRST116') {
        error.value = 'Utilisateur non trouvé'
      } else {
        throw profileError
      }
      return
    }
    
    profileData.value = {
      ...profile,
      member_since: profile.created_at 
        ? new Date(profile.created_at).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
        : null
    }
    
    await Promise.all([
      loadStats(userId),
      loadOpportunities(userId),
      loadConnectionStatus(userId),
      loadFavoriteStatus(userId)
    ])
    
  } catch (err) {
    console.error('Erreur chargement profil:', err)
    error.value = 'Erreur lors du chargement du profil'
  } finally {
    loading.value = false
  }
}

const loadStats = async (userId) => {
  try {
    const { count: connectionsCount } = await supabase
      .from('pev_connections')
      .select('*', { count: 'exact', head: true })
      .or(`requester_id.eq.${userId},addressee_id.eq.${userId}`)
      .eq('status', 'accepted')
    
    const { count: oppsCount } = await supabase
      .from('pev_opportunities')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', userId)
      .eq('status', 'published')
    
    const { count: resourcesCount } = await supabase
      .from('pev_resources')
      .select('*', { count: 'exact', head: true })
      .eq('created_by', userId)
      .eq('status', 'published')
    
    stats.value = {
      connections: connectionsCount || 0,
      opportunities: oppsCount || 0,
      resources: resourcesCount || 0
    }
  } catch (err) {
    console.warn('Erreur chargement stats:', err)
  }
}

const loadOpportunities = async (userId) => {
  try {
    const { data } = await supabase
      .from('pev_opportunities')
      .select('id, title, type, funding_amount, currency')
      .eq('created_by', userId)
      .eq('status', 'published')
      .order('created_at', { ascending: false })
      .limit(5)
    
    createdOpportunities.value = data || []
  } catch (err) {
    console.warn('Erreur chargement opportunités:', err)
  }
}

const loadConnectionStatus = async (userId) => {
  try {
    const currentUserId = authStore.user?.id
    if (!currentUserId) return
    
    const result = await connectionService.getConnectionStatus(currentUserId, userId)
    
    if (typeof result === 'object') {
      connectionStatus.value = result.status
      isRequester.value = result.isRequester
      
      if (result.status === 'pending' && !result.isRequester) {
        const { data } = await supabase
          .from('pev_connections')
          .select('id')
          .eq('requester_id', userId)
          .eq('addressee_id', currentUserId)
          .eq('status', 'pending')
          .single()
        
        pendingConnectionId.value = data?.id || null
      }
    } else {
      connectionStatus.value = result
    }
  } catch (err) {
    console.warn('Erreur chargement statut connexion:', err)
  }
}

const loadFavoriteStatus = async (userId) => {
  try {
    isFavorite.value = await connectionService.isUserFavorite(userId)
  } catch (err) {
    console.warn('Erreur chargement statut favori:', err)
  }
}

const openConnectionDialog = () => {
  connectionMessage.value = ''
  connectionDialog.value = true
}

const sendConnectionRequest = async () => {
  actionLoading.value = true
  try {
    await connectionService.sendRequest({
      targetUserId: route.params.id,
      message: connectionMessage.value
    })
    connectionStatus.value = 'pending'
    isRequester.value = true
    connectionDialog.value = false
    showMessage('Demande de connexion envoyée !', 'success')
  } catch (err) {
    showMessage(err.message || 'Erreur lors de l\'envoi', 'error')
  } finally {
    actionLoading.value = false
  }
}

const acceptConnection = async () => {
  if (!pendingConnectionId.value) return
  
  actionLoading.value = true
  try {
    await connectionService.acceptRequest(pendingConnectionId.value)
    connectionStatus.value = 'accepted'
    showMessage('Connexion acceptée !', 'success')
  } catch (err) {
    showMessage(err.message || 'Erreur lors de l\'acceptation', 'error')
  } finally {
    actionLoading.value = false
  }
}

const sendMessage = async () => {
  messageLoading.value = true
  try {
    const result = await messagesService.getOrCreateDirectConversation(route.params.id)
    if (result.success) {
      router.push(`/messages?conversation=${result.data.id}`)
    } else {
      throw new Error(result.error || 'Erreur création conversation')
    }
  } catch (err) {
    showMessage(err.message || 'Erreur lors de la création de la conversation', 'error')
  } finally {
    messageLoading.value = false
  }
}

const toggleFavorite = async () => {
  favoriteLoading.value = true
  try {
    if (isFavorite.value) {
      await connectionService.removeUserFromFavorites(route.params.id)
      isFavorite.value = false
      showMessage('Retiré des favoris', 'info')
    } else {
      await connectionService.addUserToFavorites(route.params.id)
      isFavorite.value = true
      showMessage('Ajouté aux favoris', 'success')
    }
  } catch (err) {
    showMessage(err.message || 'Erreur lors de la mise à jour des favoris', 'error')
  } finally {
    favoriteLoading.value = false
  }
}

watch(() => route.params.id, () => {
  if (route.params.id) {
    loadProfile()
  }
})

onMounted(() => {
  loadProfile()
})
</script>

<style scoped>
.user-profile-view {
  min-height: 100vh;
  background: #f5f5f5;
}

.profile-banner {
  background: linear-gradient(135deg, #2e7d32 0%, #1b5e20 100%);
}

.profile-avatar {
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
}

.cursor-pointer {
  cursor: pointer;
}

.cursor-pointer:hover {
  background: #e8e8e8 !important;
}
</style>
