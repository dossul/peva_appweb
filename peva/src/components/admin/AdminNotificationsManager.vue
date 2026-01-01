<template>
  <div class="admin-notifications-manager">
    <!-- En-tête avec actions -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h5 font-weight-bold">Gestion des Notifications</h2>
        <p class="text-body-2 text-grey-darken-1">{{ totalNotifications }} notifications envoyées</p>
      </div>
      <div class="d-flex align-center ga-2">
        <v-btn color="green" prepend-icon="mdi-bell-plus" @click="openCreateDialog">
          Nouvelle notification
        </v-btn>
        <v-btn color="orange" prepend-icon="mdi-broadcast" @click="openBroadcastDialog">
          Diffusion générale
        </v-btn>
      </div>
    </div>

    <!-- Statistiques -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card color="blue-darken-2" class="text-white pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-icon size="32" class="mr-3">mdi-bell</v-icon>
            <div>
              <div class="text-h5 font-weight-bold">{{ stats.total }}</div>
              <div class="text-body-2">Total envoyées</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="green-darken-2" class="text-white pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-icon size="32" class="mr-3">mdi-email-open</v-icon>
            <div>
              <div class="text-h5 font-weight-bold">{{ stats.read }}</div>
              <div class="text-body-2">Lues</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="orange-darken-2" class="text-white pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-icon size="32" class="mr-3">mdi-email</v-icon>
            <div>
              <div class="text-h5 font-weight-bold">{{ stats.unread }}</div>
              <div class="text-body-2">Non lues</div>
            </div>
          </div>
        </v-card>
      </v-col>
      <v-col cols="12" md="3">
        <v-card color="purple-darken-2" class="text-white pa-4" elevation="2">
          <div class="d-flex align-center">
            <v-icon size="32" class="mr-3">mdi-clock</v-icon>
            <div>
              <div class="text-h5 font-weight-bold">{{ stats.pending }}</div>
              <div class="text-body-2">En attente</div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Filtres et recherche -->
    <v-card class="mb-6" elevation="2">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="searchQuery"
              label="Rechercher une notification"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filterType"
              :items="typeOptions"
              label="Type"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filterPriority"
              :items="priorityOptions"
              label="Priorité"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filterStatus"
              :items="statusOptions"
              label="Statut"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filterChannel"
              :items="channelOptions"
              label="Canal"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="1">
            <v-btn color="grey" variant="outlined" block @click="resetFilters">
              Reset
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Tableau des notifications -->
    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="filteredNotifications"
        :loading="loading"
        :items-per-page="itemsPerPage"
        :search="searchQuery"
        class="elevation-0"
      >
        <!-- Notification -->
        <template #item.notification="{ item }">
          <div class="py-2">
            <div class="font-weight-medium">{{ item.title }}</div>
            <div class="text-caption text-grey-darken-1">{{ item.message }}</div>
          </div>
        </template>

        <!-- Type -->
        <template #item.type="{ item }">
          <v-chip
            :color="getTypeColor(item.type)"
            size="small"
            variant="flat"
          >
            {{ getTypeLabel(item.type) }}
          </v-chip>
        </template>

        <!-- Priorité -->
        <template #item.priority="{ item }">
          <v-chip
            :color="getPriorityColor(item.priority)"
            size="small"
            variant="tonal"
          >
            {{ getPriorityLabel(item.priority) }}
          </v-chip>
        </template>

        <!-- Destinataire -->
        <template #item.recipient="{ item }">
          <div v-if="item.recipient_id === 'broadcast'" class="d-flex align-center">
            <v-icon color="orange" class="mr-2">mdi-broadcast</v-icon>
            <span class="text-body-2">Diffusion générale</span>
          </div>
          <div v-else-if="item.recipient" class="d-flex align-center">
            <v-avatar size="24" class="mr-2">
              <v-img
                v-if="item.recipient.avatar_url"
                :src="item.recipient.avatar_url"
                :alt="item.recipient.first_name"
              />
              <v-icon v-else size="16">mdi-account</v-icon>
            </v-avatar>
            <div class="text-body-2">
              {{ item.recipient.first_name }} {{ item.recipient.last_name }}
            </div>
          </div>
          <div v-else class="text-caption text-grey">Utilisateur supprimé</div>
        </template>

        <!-- Statut -->
        <template #item.status="{ item }">
          <div class="d-flex align-center">
            <v-icon
              :color="item.is_read ? 'green' : 'grey'"
              size="16"
              class="mr-1"
            >
              {{ item.is_read ? 'mdi-email-open' : 'mdi-email' }}
            </v-icon>
            <span class="text-body-2">
              {{ item.is_read ? 'Lue' : 'Non lue' }}
            </span>
          </div>
        </template>

        <!-- Canaux -->
        <template #item.channels="{ item }">
          <div class="d-flex ga-1">
            <v-tooltip
              v-for="channel in getNotificationChannels(item)"
              :key="channel.type"
              :text="channel.label"
            >
              <template #activator="{ props }">
                <v-chip
                  v-bind="props"
                  :color="channel.color"
                  size="x-small"
                  variant="flat"
                >
                  <v-icon size="12">{{ channel.icon }}</v-icon>
                </v-chip>
              </template>
            </v-tooltip>
          </div>
        </template>

        <!-- Date d'envoi -->
        <template #item.created_at="{ item }">
          <div class="text-body-2">
            {{ formatDate(item.created_at) }}
          </div>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex align-center ga-1">
            <v-tooltip text="Voir les détails">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  @click="viewNotification(item)"
                />
              </template>
            </v-tooltip>
            <v-tooltip text="Renvoyer">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-refresh"
                  size="small"
                  variant="text"
                  color="blue"
                  @click="resendNotification(item)"
                />
              </template>
            </v-tooltip>
            <v-tooltip text="Supprimer">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-delete"
                  size="small"
                  variant="text"
                  color="red"
                  @click="deleteNotification(item)"
                />
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de création de notification -->
    <v-dialog v-model="notificationDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          Nouvelle Notification
        </v-card-title>
        
        <v-card-text>
          <v-form ref="notificationForm" v-model="formValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="notificationFormData.type"
                  :items="typeList"
                  label="Type de notification"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="notificationFormData.priority"
                  :items="priorityList"
                  label="Priorité"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="notificationFormData.title"
                  label="Titre"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="notificationFormData.message"
                  label="Message"
                  :rules="[rules.required]"
                  rows="4"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-autocomplete
                  v-model="notificationFormData.recipient_id"
                  :items="users"
                  item-title="display_name"
                  item-value="id"
                  label="Destinataire"
                  :rules="[rules.required]"
                  variant="outlined"
                  clearable
                >
                  <template #item="{ props, item }">
                    <v-list-item v-bind="props">
                      <template #prepend>
                        <v-avatar size="32">
                          <v-img
                            v-if="item.raw.avatar_url"
                            :src="item.raw.avatar_url"
                            :alt="item.raw.display_name"
                          />
                          <v-icon v-else>mdi-account</v-icon>
                        </v-avatar>
                      </template>
                      <v-list-item-title>{{ item.raw.display_name }}</v-list-item-title>
                      <v-list-item-subtitle>{{ item.raw.email }}</v-list-item-subtitle>
                    </v-list-item>
                  </template>
                </v-autocomplete>
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="notificationFormData.action_url"
                  label="URL d'action (optionnel)"
                  type="url"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="closeNotificationDialog">
            Annuler
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="saving"
            :disabled="!formValid"
            @click="saveNotification"
          >
            Envoyer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de diffusion générale -->
    <v-dialog v-model="broadcastDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          Diffusion Générale
        </v-card-title>
        
        <v-card-text>
          <v-form ref="broadcastForm" v-model="broadcastFormValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-select
                  v-model="broadcastFormData.type"
                  :items="typeList"
                  label="Type de notification"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="broadcastFormData.priority"
                  :items="priorityList"
                  label="Priorité"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="broadcastFormData.title"
                  label="Titre"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="broadcastFormData.message"
                  label="Message"
                  :rules="[rules.required]"
                  rows="4"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-select
                  v-model="broadcastFormData.target_roles"
                  :items="roleOptions"
                  label="Rôles cibles"
                  multiple
                  chips
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="closeBroadcastDialog">
            Annuler
          </v-btn>
          <v-btn
            color="orange"
            variant="flat"
            :loading="broadcasting"
            :disabled="!broadcastFormValid"
            @click="sendBroadcast"
          >
            Diffuser à tous
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import notificationService from '@/services/notificationService'

// État réactif
const notifications = ref([])
const users = ref([])
const loading = ref(false)
const saving = ref(false)
const broadcasting = ref(false)
const searchQuery = ref('')
const filterType = ref('all')
const filterPriority = ref('all')
const filterStatus = ref('all')
const filterChannel = ref('all')
const itemsPerPage = ref(25)

// Statistiques
const stats = ref({
  total: 0,
  read: 0,
  unread: 0,
  pending: 0
})

// Dialogs
const notificationDialog = ref(false)
const broadcastDialog = ref(false)
const formValid = ref(false)
const broadcastFormValid = ref(false)

// Données des formulaires
const notificationFormData = ref({
  type: 'system_update',
  priority: 'normal',
  title: '',
  message: '',
  recipient_id: '',
  action_url: ''
})

const broadcastFormData = ref({
  type: 'system_update',
  priority: 'normal',
  title: '',
  message: '',
  target_roles: ['user']
})

// Options
const typeOptions = [
  { title: 'Tous les types', value: 'all' },
  { title: 'Connexion', value: 'connection_request' },
  { title: 'Message', value: 'new_message' },
  { title: 'Opportunité', value: 'opportunity_application' },
  { title: 'Événement', value: 'event_reminder' },
  { title: 'Forum', value: 'forum_reply' },
  { title: 'Système', value: 'system_update' }
]

const typeList = computed(() => 
  typeOptions.value.filter(item => item.value !== 'all')
)

const priorityOptions = [
  { title: 'Toutes les priorités', value: 'all' },
  { title: 'Faible', value: 'low' },
  { title: 'Normale', value: 'normal' },
  { title: 'Élevée', value: 'high' },
  { title: 'Urgente', value: 'urgent' }
]

const priorityList = computed(() => 
  priorityOptions.value.filter(item => item.value !== 'all')
)

const statusOptions = [
  { title: 'Tous les statuts', value: 'all' },
  { title: 'Lues', value: 'read' },
  { title: 'Non lues', value: 'unread' }
]

const channelOptions = [
  { title: 'Tous les canaux', value: 'all' },
  { title: 'In-App', value: 'in_app' },
  { title: 'Email', value: 'email' },
  { title: 'Push', value: 'push' },
  { title: 'SMS', value: 'sms' }
]

const roleOptions = [
  { title: 'Utilisateurs', value: 'user' },
  { title: 'Modérateurs', value: 'moderator' },
  { title: 'Administrateurs', value: 'admin' }
]

// En-têtes du tableau
const headers = [
  { title: 'Notification', key: 'notification', sortable: false },
  { title: 'Type', key: 'type' },
  { title: 'Priorité', key: 'priority' },
  { title: 'Destinataire', key: 'recipient', sortable: false },
  { title: 'Statut', key: 'status', sortable: false },
  { title: 'Canaux', key: 'channels', sortable: false },
  { title: 'Envoyée le', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Règles de validation
const rules = {
  required: value => !!value || 'Ce champ est requis'
}

// Computed
const totalNotifications = computed(() => notifications.value.length)

const filteredNotifications = computed(() => {
  let filtered = notifications.value

  if (filterType.value !== 'all') {
    filtered = filtered.filter(notif => notif.type === filterType.value)
  }

  if (filterPriority.value !== 'all') {
    filtered = filtered.filter(notif => notif.priority === filterPriority.value)
  }

  if (filterStatus.value !== 'all') {
    if (filterStatus.value === 'read') {
      filtered = filtered.filter(notif => notif.is_read)
    } else if (filterStatus.value === 'unread') {
      filtered = filtered.filter(notif => !notif.is_read)
    }
  }

  return filtered
})

// Méthodes
const loadNotifications = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('user_notifications_with_actor')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(1000)

    if (error) throw error
    notifications.value = data || []

    // Calculer les statistiques
    stats.value = {
      total: notifications.value.length,
      read: notifications.value.filter(n => n.is_read).length,
      unread: notifications.value.filter(n => !n.is_read).length,
      pending: 0 // À implémenter avec la queue
    }
  } catch (error) {
    console.error('Erreur lors du chargement des notifications:', error)
  } finally {
    loading.value = false
  }
}

const loadUsers = async () => {
  try {
    const { data, error } = await supabase
      .from('pev_profiles')
      .select('id, first_name, last_name, email, avatar_url')
      .order('first_name')

    if (error) throw error
    
    users.value = (data || []).map(user => ({
      ...user,
      display_name: `${user.first_name} ${user.last_name}`
    }))
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error)
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  filterType.value = 'all'
  filterPriority.value = 'all'
  filterStatus.value = 'all'
  filterChannel.value = 'all'
}

const openCreateDialog = () => {
  notificationFormData.value = {
    type: 'system_update',
    priority: 'normal',
    title: '',
    message: '',
    recipient_id: '',
    action_url: ''
  }
  notificationDialog.value = true
}

const closeNotificationDialog = () => {
  notificationDialog.value = false
}

const saveNotification = async () => {
  if (!formValid.value) return

  saving.value = true
  try {
    await notificationService.createNotification(
      notificationFormData.value.recipient_id,
      null, // Admin notification
      notificationFormData.value.type,
      {
        title: notificationFormData.value.title,
        message: notificationFormData.value.message,
        priority: notificationFormData.value.priority,
        actionUrl: notificationFormData.value.action_url
      }
    )

    closeNotificationDialog()
    await loadNotifications()
  } catch (error) {
    console.error('Erreur lors de l\'envoi:', error)
  } finally {
    saving.value = false
  }
}

const openBroadcastDialog = () => {
  broadcastFormData.value = {
    type: 'system_update',
    priority: 'normal',
    title: '',
    message: '',
    target_roles: ['user']
  }
  broadcastDialog.value = true
}

const closeBroadcastDialog = () => {
  broadcastDialog.value = false
}

const sendBroadcast = async () => {
  if (!broadcastFormValid.value) return

  broadcasting.value = true
  try {
    // Récupérer tous les utilisateurs avec les rôles cibles
    const { data: targetUsers, error } = await supabase
      .from('pev_profiles')
      .select('id')
      .in('role', broadcastFormData.value.target_roles)

    if (error) throw error

    // Envoyer la notification à tous les utilisateurs cibles
    const promises = targetUsers.map(user =>
      notificationService.createNotification(
        user.id,
        null,
        broadcastFormData.value.type,
        {
          title: broadcastFormData.value.title,
          message: broadcastFormData.value.message,
          priority: broadcastFormData.value.priority
        }
      )
    )

    await Promise.all(promises)

    closeBroadcastDialog()
    await loadNotifications()
  } catch (error) {
    console.error('Erreur lors de la diffusion:', error)
  } finally {
    broadcasting.value = false
  }
}

const viewNotification = (notification) => {
  console.log('Voir notification:', notification)
}

const resendNotification = async (notification) => {
  try {
    await notificationService.createNotification(
      notification.recipient_id,
      null,
      notification.type,
      {
        title: notification.title,
        message: notification.message,
        priority: notification.priority
      }
    )
    
    await loadNotifications()
  } catch (error) {
    console.error('Erreur lors du renvoi:', error)
  }
}

const deleteNotification = async (notification) => {
  try {
    const { error } = await supabase
      .from('pev_notifications')
      .delete()
      .eq('id', notification.id)

    if (error) throw error

    const index = notifications.value.findIndex(n => n.id === notification.id)
    if (index !== -1) {
      notifications.value.splice(index, 1)
    }
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

// Utilitaires
const getTypeColor = (type) => {
  const colors = {
    connection_request: 'blue',
    new_message: 'green',
    opportunity_application: 'purple',
    event_reminder: 'orange',
    forum_reply: 'teal',
    system_update: 'red'
  }
  return colors[type] || 'grey'
}

const getTypeLabel = (type) => {
  const labels = {
    connection_request: 'Connexion',
    new_message: 'Message',
    opportunity_application: 'Opportunité',
    event_reminder: 'Événement',
    forum_reply: 'Forum',
    system_update: 'Système'
  }
  return labels[type] || type
}

const getPriorityColor = (priority) => {
  const colors = {
    low: 'blue',
    normal: 'green',
    high: 'orange',
    urgent: 'red'
  }
  return colors[priority] || 'grey'
}

const getPriorityLabel = (priority) => {
  const labels = {
    low: 'Faible',
    normal: 'Normale',
    high: 'Élevée',
    urgent: 'Urgente'
  }
  return labels[priority] || priority
}

const getNotificationChannels = (notification) => {
  // Simuler les canaux basés sur le type et la priorité
  const channels = [
    { type: 'in_app', label: 'In-App', icon: 'mdi-bell', color: 'blue' }
  ]

  if (notification.priority === 'high' || notification.priority === 'urgent') {
    channels.push({ type: 'email', label: 'Email', icon: 'mdi-email', color: 'green' })
  }

  if (notification.priority === 'urgent') {
    channels.push({ type: 'push', label: 'Push', icon: 'mdi-cellphone', color: 'orange' })
  }

  return channels
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleString('fr-FR')
}

// Lifecycle
onMounted(() => {
  loadNotifications()
  loadUsers()
})
</script>

<style scoped>
.admin-notifications-manager {
  min-height: 100vh;
}
</style>
