<template>
  <div class="admin-users">
    <!-- Header avec statistiques -->
    <div class="admin-header bg-blue-darken-2 text-white py-6">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">
              <v-icon size="32" class="mr-3">mdi-account-group</v-icon>
              Gestion des Utilisateurs
            </h1>
            <p class="text-h6 font-weight-regular ma-0">
              Administration des comptes et permissions utilisateurs
            </p>
          </div>
          <div class="d-flex align-center ga-3">
            <v-chip color="white" text-color="blue-darken-2" prepend-icon="mdi-account">
              {{ overview.total }} utilisateurs
            </v-chip>
            <v-btn 
              color="white" 
              variant="flat" 
              prepend-icon="mdi-download" 
              class="text-blue-darken-2"
              @click="exportUsers"
              :loading="exporting"
            >
              Exporter
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <!-- Statistiques rapides -->
      <v-row class="mb-6">
        <v-col cols="12" md="3">
          <v-card color="green-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="32" class="mr-3">mdi-account-check</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">{{ overview.verified }}</div>
                <div class="text-body-2">Utilisateurs vérifiés</div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="purple-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="32" class="mr-3">mdi-shield-account</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">{{ overview.by_role.admin + overview.by_role.super_admin }}</div>
                <div class="text-body-2">Administrateurs</div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="orange-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="32" class="mr-3">mdi-account-plus</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">{{ overview.recent_registrations }}</div>
                <div class="text-body-2">Nouveaux (7j)</div>
              </div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card color="teal-darken-2" class="text-white pa-4" elevation="3">
            <div class="d-flex align-center">
              <v-icon size="32" class="mr-3">mdi-check-circle</v-icon>
              <div>
                <div class="text-h4 font-weight-bold">{{ overview.onboarding_completed }}</div>
                <div class="text-body-2">Onboarding terminé</div>
              </div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Filtres et recherche -->
      <v-card class="mb-6" elevation="2">
        <v-card-title>
          <v-icon class="mr-2">mdi-filter</v-icon>
          Filtres et Recherche
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="filters.search"
                label="Rechercher"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                placeholder="Nom, email, organisation..."
                @input="debouncedSearch"
                clearable
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="filters.role"
                label="Rôle"
                :items="roleOptions"
                variant="outlined"
                density="compact"
                clearable
                @update:model-value="loadUsers"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="filters.isVerified"
                label="Statut"
                :items="statusOptions"
                variant="outlined"
                density="compact"
                clearable
                @update:model-value="loadUsers"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="filters.onboardingCompleted"
                label="Onboarding"
                :items="onboardingOptions"
                variant="outlined"
                density="compact"
                clearable
                @update:model-value="loadUsers"
              />
            </v-col>
            <v-col cols="12" md="2">
              <v-select
                v-model="filters.country"
                label="Pays"
                :items="countryOptions"
                variant="outlined"
                density="compact"
                clearable
                @update:model-value="loadUsers"
              />
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Tableau des utilisateurs -->
      <v-card elevation="2">
        <v-card-title class="d-flex align-center justify-space-between">
          <div>
            <v-icon class="mr-2">mdi-account-group</v-icon>
            Liste des Utilisateurs
          </div>
          <div class="d-flex align-center ga-2">
            <v-chip size="small" color="primary">
              {{ pagination.total }} résultats
            </v-chip>
            <v-btn
              icon="mdi-refresh"
              size="small"
              @click="loadUsers"
              :loading="loading"
            />
          </div>
        </v-card-title>
        
        <v-data-table
          :headers="headers"
          :items="users"
          :loading="loading"
          :items-per-page="pagination.limit"
          :page="pagination.page"
          @update:page="onPageChange"
          @update:items-per-page="onItemsPerPageChange"
          class="elevation-0"
          item-key="id"
        >
          <!-- Avatar et nom -->
          <template v-slot:item.user="{ item }">
            <div class="d-flex align-center py-2">
              <v-avatar size="40" class="mr-3">
                <v-img 
                  v-if="item.avatar_url" 
                  :src="item.avatar_url"
                  :alt="`${item.first_name} ${item.last_name}`"
                />
                <v-icon v-else color="grey-lighten-1">mdi-account</v-icon>
              </v-avatar>
              <div>
                <div class="font-weight-medium">
                  {{ item.display_name || `${item.first_name} ${item.last_name}` }}
                </div>
                <div class="text-caption text-grey-darken-1">{{ item.email }}</div>
                <div v-if="item.organization" class="text-caption text-grey-darken-1">
                  {{ item.organization }}
                </div>
              </div>
            </div>
          </template>

          <!-- Rôle -->
          <template v-slot:item.role="{ item }">
            <v-chip
              :color="getRoleColor(item.role)"
              size="small"
              variant="flat"
            >
              {{ getRoleLabel(item.role) }}
            </v-chip>
          </template>

          <!-- Statut -->
          <template v-slot:item.status="{ item }">
            <div class="d-flex flex-column ga-1">
              <v-chip
                :color="item.is_verified ? 'success' : 'warning'"
                size="x-small"
                variant="flat"
              >
                {{ item.is_verified ? 'Vérifié' : 'Non vérifié' }}
              </v-chip>
              <v-chip
                :color="item.onboarding_completed ? 'success' : 'grey'"
                size="x-small"
                variant="flat"
              >
                {{ item.onboarding_completed ? 'Onboarding OK' : 'En cours' }}
              </v-chip>
            </div>
          </template>

          <!-- Localisation -->
          <template v-slot:item.location="{ item }">
            <div v-if="item.country || item.city">
              <div class="text-body-2">{{ item.city }}</div>
              <div class="text-caption text-grey-darken-1">{{ item.country }}</div>
            </div>
            <span v-else class="text-grey-lighten-1">Non renseigné</span>
          </template>

          <!-- Activité -->
          <template v-slot:item.activity="{ item }">
            <div class="d-flex align-center">
              <v-progress-circular
                :model-value="item.activity_score || 0"
                size="24"
                width="3"
                :color="getActivityColor(item.activity_score)"
                class="mr-2"
              />
              <div>
                <div class="text-body-2">{{ item.activity_score || 0 }}%</div>
                <div class="text-caption text-grey-darken-1">
                  {{ formatDate(item.last_activity) }}
                </div>
              </div>
            </div>
          </template>

          <!-- Actions -->
          <template v-slot:item.actions="{ item }">
            <div class="d-flex ga-1">
              <v-btn
                icon="mdi-eye"
                size="small"
                variant="text"
                @click="viewUser(item)"
                :disabled="loading"
              />
              <v-btn
                icon="mdi-pencil"
                size="small"
                variant="text"
                @click="editUser(item)"
                :disabled="loading"
              />
              <v-menu>
                <template v-slot:activator="{ props }">
                  <v-btn
                    icon="mdi-dots-vertical"
                    size="small"
                    variant="text"
                    v-bind="props"
                    :disabled="loading"
                  />
                </template>
                <v-list density="compact">
                  <v-list-item @click="changeRole(item)">
                    <v-list-item-title>
                      <v-icon class="mr-2" size="16">mdi-shield-account</v-icon>
                      Changer le rôle
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item 
                    @click="item.is_verified ? suspendUser(item) : reactivateUser(item)"
                    :class="item.is_verified ? 'text-error' : 'text-success'"
                  >
                    <v-list-item-title>
                      <v-icon class="mr-2" size="16">
                        {{ item.is_verified ? 'mdi-account-cancel' : 'mdi-account-check' }}
                      </v-icon>
                      {{ item.is_verified ? 'Suspendre' : 'Réactiver' }}
                    </v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="viewStats(item)">
                    <v-list-item-title>
                      <v-icon class="mr-2" size="16">mdi-chart-line</v-icon>
                      Statistiques
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </div>
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <!-- Dialog détail utilisateur -->
    <v-dialog v-model="userDetailDialog" max-width="800">
      <v-card v-if="selectedUser">
        <v-card-title class="d-flex align-center">
          <v-avatar size="40" class="mr-3">
            <v-img 
              v-if="selectedUser.avatar_url" 
              :src="selectedUser.avatar_url"
            />
            <v-icon v-else>mdi-account</v-icon>
          </v-avatar>
          {{ selectedUser.display_name || `${selectedUser.first_name} ${selectedUser.last_name}` }}
        </v-card-title>
        
        <v-card-text>
          <v-row>
            <v-col cols="12" md="6">
              <h4 class="mb-3">Informations personnelles</h4>
              <div class="mb-2"><strong>Email:</strong> {{ selectedUser.email }}</div>
              <div class="mb-2"><strong>Téléphone:</strong> {{ selectedUser.phone || 'Non renseigné' }}</div>
              <div class="mb-2"><strong>Type:</strong> {{ selectedUser.user_type }}</div>
              <div class="mb-2"><strong>Organisation:</strong> {{ selectedUser.organization || 'Non renseigné' }}</div>
              <div class="mb-2"><strong>Poste:</strong> {{ selectedUser.position || 'Non renseigné' }}</div>
            </v-col>
            <v-col cols="12" md="6">
              <h4 class="mb-3">Statut et activité</h4>
              <div class="mb-2"><strong>Rôle:</strong> {{ getRoleLabel(selectedUser.role) }}</div>
              <div class="mb-2"><strong>Vérifié:</strong> {{ selectedUser.is_verified ? 'Oui' : 'Non' }}</div>
              <div class="mb-2"><strong>Onboarding:</strong> {{ selectedUser.onboarding_completed ? 'Terminé' : 'En cours' }}</div>
              <div class="mb-2"><strong>Score d'activité:</strong> {{ selectedUser.activity_score }}%</div>
              <div class="mb-2"><strong>Dernière activité:</strong> {{ formatDate(selectedUser.last_activity) }}</div>
            </v-col>
          </v-row>
          
          <v-divider class="my-4" />
          
          <div v-if="selectedUser.bio">
            <h4 class="mb-3">Biographie</h4>
            <p>{{ selectedUser.bio }}</p>
          </div>
          
          <div v-if="selectedUser.sectors && selectedUser.sectors.length">
            <h4 class="mb-3">Secteurs d'activité</h4>
            <v-chip-group>
              <v-chip 
                v-for="sector in selectedUser.sectors" 
                :key="sector"
                size="small"
              >
                {{ sector }}
              </v-chip>
            </v-chip-group>
          </div>
        </v-card-text>
        
        <v-card-actions>
          <v-spacer />
          <v-btn @click="userDetailDialog = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog changement de rôle -->
    <v-dialog v-model="roleDialog" max-width="400">
      <v-card v-if="selectedUser">
        <v-card-title>Changer le rôle</v-card-title>
        <v-card-text>
          <p class="mb-4">
            Utilisateur: <strong>{{ selectedUser.display_name || `${selectedUser.first_name} ${selectedUser.last_name}` }}</strong>
          </p>
          <p class="mb-4">Rôle actuel: <strong>{{ getRoleLabel(selectedUser.role) }}</strong></p>
          
          <v-select
            v-model="newRole"
            label="Nouveau rôle"
            :items="roleOptions"
            variant="outlined"
            density="compact"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="roleDialog = false">Annuler</v-btn>
          <v-btn 
            color="primary" 
            @click="confirmRoleChange"
            :loading="updating"
            :disabled="!newRole || newRole === selectedUser.role"
          >
            Confirmer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar pour les notifications -->
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
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { userManagementService } from '@/services/admin/userManagementService'

const router = useRouter()
const authStore = useAuthStore()

// État réactif
const users = ref([])
const overview = ref({
  total: 0,
  verified: 0,
  by_role: { user: 0, moderator: 0, admin: 0, super_admin: 0 },
  recent_registrations: 0,
  onboarding_completed: 0
})
const loading = ref(false)
const exporting = ref(false)
const updating = ref(false)

// Pagination
const pagination = ref({
  page: 1,
  limit: 50,
  total: 0,
  totalPages: 0
})

// Filtres
const filters = ref({
  search: '',
  role: null,
  isVerified: null,
  onboardingCompleted: null,
  country: null,
  userType: null
})

// Dialogs
const userDetailDialog = ref(false)
const roleDialog = ref(false)
const selectedUser = ref(null)
const newRole = ref('')

// Snackbar
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Options pour les filtres
const roleOptions = [
  { title: 'Utilisateur', value: 'user' },
  { title: 'Modérateur', value: 'moderator' },
  { title: 'Administrateur', value: 'admin' },
  { title: 'Super Admin', value: 'super_admin' }
]

const statusOptions = [
  { title: 'Vérifié', value: true },
  { title: 'Non vérifié', value: false }
]

const onboardingOptions = [
  { title: 'Terminé', value: true },
  { title: 'En cours', value: false }
]

const countryOptions = ref([])

// Headers du tableau
const headers = [
  { title: 'Utilisateur', key: 'user', sortable: false },
  { title: 'Rôle', key: 'role', sortable: true },
  { title: 'Statut', key: 'status', sortable: false },
  { title: 'Localisation', key: 'location', sortable: false },
  { title: 'Activité', key: 'activity', sortable: true },
  { title: 'Inscription', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Méthodes
const loadUsers = async () => {
  loading.value = true
  try {
    const result = await userManagementService.getAllUsers({
      page: pagination.value.page,
      limit: pagination.value.limit,
      ...filters.value
    })

    if (result.success) {
      users.value = result.data
      pagination.value = result.pagination
    } else {
      showMessage('Erreur lors du chargement des utilisateurs', 'error')
    }
  } catch (error) {
    showMessage('Erreur lors du chargement des utilisateurs', 'error')
  } finally {
    loading.value = false
  }
}

const loadOverview = async () => {
  try {
    const result = await userManagementService.getUsersOverview()
    if (result.success) {
      overview.value = result.data
      
      // Extraire les pays pour les filtres
      countryOptions.value = Object.keys(result.data.by_country).map(country => ({
        title: country,
        value: country
      }))
    }
  } catch (error) {
    console.error('Erreur lors du chargement des statistiques:', error)
  }
}

const viewUser = async (user) => {
  try {
    const result = await userManagementService.getUserDetails(user.id)
    if (result.success) {
      selectedUser.value = result.data
      userDetailDialog.value = true
    }
  } catch (error) {
    showMessage('Erreur lors du chargement des détails', 'error')
  }
}

const editUser = (user) => {
  // Rediriger vers une page d'édition ou ouvrir un dialog d'édition
  router.push(`/admin/users/${user.id}/edit`)
}

const changeRole = (user) => {
  selectedUser.value = user
  newRole.value = user.role
  roleDialog.value = true
}

const confirmRoleChange = async () => {
  if (!selectedUser.value || !newRole.value) return
  
  updating.value = true
  try {
    const result = await userManagementService.updateUserRole(
      selectedUser.value.id,
      newRole.value,
      authStore.user.id
    )
    
    if (result.success) {
      showMessage('Rôle mis à jour avec succès', 'success')
      roleDialog.value = false
      await loadUsers()
      await loadOverview()
    } else {
      showMessage('Erreur lors de la mise à jour du rôle', 'error')
    }
  } catch (error) {
    showMessage('Erreur lors de la mise à jour du rôle', 'error')
  } finally {
    updating.value = false
  }
}

const suspendUser = async (user) => {
  if (!confirm(`Êtes-vous sûr de vouloir suspendre ${user.display_name || user.first_name + ' ' + user.last_name} ?`)) {
    return
  }
  
  try {
    const result = await userManagementService.suspendUser(
      user.id,
      'Suspension administrative',
      authStore.user.id
    )
    
    if (result.success) {
      showMessage('Utilisateur suspendu', 'success')
      await loadUsers()
    } else {
      showMessage('Erreur lors de la suspension', 'error')
    }
  } catch (error) {
    showMessage('Erreur lors de la suspension', 'error')
  }
}

const reactivateUser = async (user) => {
  try {
    const result = await userManagementService.reactivateUser(
      user.id,
      authStore.user.id
    )
    
    if (result.success) {
      showMessage('Utilisateur réactivé', 'success')
      await loadUsers()
    } else {
      showMessage('Erreur lors de la réactivation', 'error')
    }
  } catch (error) {
    showMessage('Erreur lors de la réactivation', 'error')
  }
}

const viewStats = async (user) => {
  // Implémenter l'affichage des statistiques utilisateur
  router.push(`/admin/users/${user.id}/stats`)
}

const exportUsers = async () => {
  exporting.value = true
  try {
    // Implémenter l'export CSV/Excel
    showMessage('Export en cours de développement', 'info')
  } catch (error) {
    showMessage('Erreur lors de l\'export', 'error')
  } finally {
    exporting.value = false
  }
}

// Pagination
const onPageChange = (page) => {
  pagination.value.page = page
  loadUsers()
}

const onItemsPerPageChange = (itemsPerPage) => {
  pagination.value.limit = itemsPerPage
  pagination.value.page = 1
  loadUsers()
}

// Recherche avec debounce
let searchTimeout
const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    pagination.value.page = 1
    loadUsers()
  }, 500)
}

// Utilitaires
const getRoleColor = (role) => {
  const colors = {
    user: 'blue',
    moderator: 'orange',
    admin: 'red',
    super_admin: 'purple'
  }
  return colors[role] || 'grey'
}

const getRoleLabel = (role) => {
  const labels = {
    user: 'Utilisateur',
    moderator: 'Modérateur',
    admin: 'Administrateur',
    super_admin: 'Super Admin'
  }
  return labels[role] || role
}

const getActivityColor = (score) => {
  if (score >= 80) return 'success'
  if (score >= 50) return 'warning'
  return 'error'
}

const formatDate = (dateString) => {
  if (!dateString) return 'Jamais'
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  })
}

const showMessage = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  }
}

// Initialisation
onMounted(async () => {
  await Promise.all([
    loadOverview(),
    loadUsers()
  ])
})
</script>

<style scoped>
.admin-users {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.admin-header {
  background: linear-gradient(135deg, #1565c0 0%, #1976d2 100%);
}

.v-card {
  border-radius: 12px !important;
}

.v-btn {
  border-radius: 8px !important;
}
</style>
