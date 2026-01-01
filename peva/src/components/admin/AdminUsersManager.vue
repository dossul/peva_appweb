<template>
  <div class="admin-users-manager">
    <!-- En-tête avec actions -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h5 font-weight-bold">Gestion des Utilisateurs</h2>
        <p class="text-body-2 text-grey-darken-1">{{ totalUsers }} utilisateurs au total</p>
      </div>
      <div class="d-flex align-center ga-2">
        <v-btn color="green" prepend-icon="mdi-account-plus" @click="openCreateDialog">
          Nouvel utilisateur
        </v-btn>
        <v-btn color="blue" prepend-icon="mdi-export" @click="exportUsers">
          Exporter
        </v-btn>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <v-card class="mb-6" elevation="2">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="searchQuery"
              label="Rechercher un utilisateur"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
              @input="searchUsers"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filterRole"
              :items="roleOptions"
              label="Rôle"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="applyFilters"
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
              @update:model-value="applyFilters"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filterCountry"
              :items="countryOptions"
              label="Pays"
              variant="outlined"
              density="compact"
              hide-details
              @update:model-value="applyFilters"
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-btn color="grey" variant="outlined" block @click="resetFilters">
              Réinitialiser
            </v-btn>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Tableau des utilisateurs -->
    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="filteredUsers"
        :loading="loading"
        :items-per-page="itemsPerPage"
        :search="searchQuery"
        class="elevation-0"
      >
        <!-- Avatar et nom -->
        <template #item.profile="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="40" class="mr-3">
              <v-img
                v-if="item.avatar_url"
                :src="item.avatar_url"
                :alt="item.display_name"
              />
              <v-icon v-else>mdi-account-circle</v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-medium">{{ item.display_name || 'Nom non défini' }}</div>
              <div class="text-caption text-grey-darken-1">{{ item.email }}</div>
            </div>
          </div>
        </template>

        <!-- Rôle avec badge -->
        <template #item.role="{ item }">
          <v-chip
            :color="getRoleColor(item.role)"
            size="small"
            variant="flat"
          >
            {{ getRoleLabel(item.role) }}
          </v-chip>
        </template>

        <!-- Statut -->
        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item)"
            size="small"
            variant="tonal"
          >
            {{ getStatusLabel(item) }}
          </v-chip>
        </template>

        <!-- Date de création -->
        <template #item.created_at="{ item }">
          <div class="text-body-2">
            {{ formatDate(item.created_at) }}
          </div>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="d-flex align-center ga-1">
            <v-tooltip text="Voir le profil">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  @click="viewUser(item)"
                />
              </template>
            </v-tooltip>
            <v-tooltip text="Modifier">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-pencil"
                  size="small"
                  variant="text"
                  color="blue"
                  @click="editUser(item)"
                />
              </template>
            </v-tooltip>
            <v-tooltip text="Suspendre/Activer">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="item.is_suspended ? 'mdi-account-check' : 'mdi-account-off'"
                  size="small"
                  variant="text"
                  :color="item.is_suspended ? 'green' : 'orange'"
                  @click="toggleSuspension(item)"
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
                  @click="deleteUser(item)"
                />
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de création/modification d'utilisateur -->
    <v-dialog v-model="userDialog" max-width="800px" persistent>
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          {{ editingUser ? 'Modifier l\'utilisateur' : 'Nouvel utilisateur' }}
        </v-card-title>
        
        <v-card-text>
          <v-form ref="userForm" v-model="formValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="userFormData.first_name"
                  label="Prénom"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="userFormData.last_name"
                  label="Nom"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-text-field
                  v-model="userFormData.email"
                  label="Email"
                  type="email"
                  :rules="[rules.required, rules.email]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="userFormData.role"
                  :items="roleOptions"
                  label="Rôle"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="userFormData.organization"
                  label="Organisation"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="userFormData.bio"
                  label="Biographie"
                  rows="3"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="closeUserDialog">
            Annuler
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="saving"
            :disabled="!formValid"
            @click="saveUser"
          >
            {{ editingUser ? 'Modifier' : 'Créer' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de confirmation de suppression -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">Confirmer la suppression</v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer l'utilisateur 
          <strong>{{ userToDelete?.display_name }}</strong> ?
          Cette action est irréversible.
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="deleteDialog = false">
            Annuler
          </v-btn>
          <v-btn color="red" variant="flat" @click="confirmDelete">
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { supabase } from '@/lib/supabase'
import dataService from '@/services/dataService'

// État réactif
const users = ref([])
const loading = ref(false)
const saving = ref(false)
const searchQuery = ref('')
const filterRole = ref('all')
const filterStatus = ref('all')
const filterCountry = ref('all')
const itemsPerPage = ref(25)

// Dialogs
const userDialog = ref(false)
const deleteDialog = ref(false)
const editingUser = ref(null)
const userToDelete = ref(null)
const formValid = ref(false)

// Données du formulaire
const userFormData = ref({
  first_name: '',
  last_name: '',
  email: '',
  role: 'user',
  organization: '',
  bio: ''
})

// Options pour les filtres
const roleOptions = [
  { title: 'Tous les rôles', value: 'all' },
  { title: 'Utilisateur', value: 'user' },
  { title: 'Modérateur', value: 'moderator' },
  { title: 'Administrateur', value: 'admin' },
  { title: 'Super Admin', value: 'super_admin' }
]

const statusOptions = [
  { title: 'Tous les statuts', value: 'all' },
  { title: 'Actif', value: 'active' },
  { title: 'Suspendu', value: 'suspended' },
  { title: 'Email non vérifié', value: 'unverified' }
]

const countryOptions = ref([
  { title: 'Tous les pays', value: 'all' },
  { title: 'Burkina Faso', value: 'Burkina Faso' }
])

// En-têtes du tableau
const headers = [
  { title: 'Utilisateur', key: 'profile', sortable: false },
  { title: 'Rôle', key: 'role' },
  { title: 'Organisation', key: 'organization' },
  { title: 'Pays', key: 'country' },
  { title: 'Statut', key: 'status', sortable: false },
  { title: 'Créé le', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Règles de validation
const rules = {
  required: value => !!value || 'Ce champ est requis',
  email: value => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(value) || 'Email invalide'
  }
}

// Computed
const totalUsers = computed(() => users.value.length)

const filteredUsers = computed(() => {
  let filtered = users.value

  if (filterRole.value !== 'all') {
    filtered = filtered.filter(user => user.role === filterRole.value)
  }

  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(user => {
      switch (filterStatus.value) {
        case 'active':
          return !user.is_suspended && user.email_confirmed_at
        case 'suspended':
          return user.is_suspended
        case 'unverified':
          return !user.email_confirmed_at
        default:
          return true
      }
    })
  }

  if (filterCountry.value !== 'all') {
    filtered = filtered.filter(user => user.country === filterCountry.value)
  }

  return filtered
})

// Méthodes
const loadUsers = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('pev_profiles')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    users.value = data || []
  } catch (error) {
    console.error('Erreur lors du chargement des utilisateurs:', error)
  } finally {
    loading.value = false
  }
}

const searchUsers = () => {
  // La recherche est gérée par le v-data-table
}

const applyFilters = () => {
  // Les filtres sont appliqués via les computed
}

const resetFilters = () => {
  searchQuery.value = ''
  filterRole.value = 'all'
  filterStatus.value = 'all'
  filterCountry.value = 'all'
}

const openCreateDialog = () => {
  editingUser.value = null
  userFormData.value = {
    first_name: '',
    last_name: '',
    email: '',
    role: 'user',
    organization: '',
    bio: ''
  }
  userDialog.value = true
}

const editUser = (user) => {
  editingUser.value = user
  userFormData.value = { ...user }
  userDialog.value = true
}

const closeUserDialog = () => {
  userDialog.value = false
  editingUser.value = null
}

const saveUser = async () => {
  if (!formValid.value) return

  saving.value = true
  try {
    if (editingUser.value) {
      // Modification
      const { error } = await supabase
        .from('pev_profiles')
        .update(userFormData.value)
        .eq('id', editingUser.value.id)

      if (error) throw error
      
      // Mettre à jour localement
      const index = users.value.findIndex(u => u.id === editingUser.value.id)
      if (index !== -1) {
        users.value[index] = { ...users.value[index], ...userFormData.value }
      }
    } else {
      // Création (nécessite l'API Auth de Supabase)
      console.log('Création d\'utilisateur:', userFormData.value)
      // TODO: Implémenter la création via l'API Admin
    }

    closeUserDialog()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    saving.value = false
  }
}

const viewUser = (user) => {
  // Ouvrir le profil utilisateur
  window.open(`/profile/${user.id}`, '_blank')
}

const toggleSuspension = async (user) => {
  try {
    const newStatus = !user.is_suspended
    const { error } = await supabase
      .from('pev_profiles')
      .update({ is_suspended: newStatus })
      .eq('id', user.id)

    if (error) throw error

    user.is_suspended = newStatus
  } catch (error) {
    console.error('Erreur lors de la modification du statut:', error)
  }
}

const deleteUser = (user) => {
  userToDelete.value = user
  deleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    const { error } = await supabase
      .from('pev_profiles')
      .delete()
      .eq('id', userToDelete.value.id)

    if (error) throw error

    const index = users.value.findIndex(u => u.id === userToDelete.value.id)
    if (index !== -1) {
      users.value.splice(index, 1)
    }

    deleteDialog.value = false
    userToDelete.value = null
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

const exportUsers = () => {
  // Exporter les données utilisateurs
  const csvContent = "data:text/csv;charset=utf-8," 
    + "Nom,Email,Rôle,Organisation,Pays,Créé le\n"
    + users.value.map(user => 
        `"${user.display_name}","${user.email}","${user.role}","${user.organization || ''}","${user.country || ''}","${formatDate(user.created_at)}"`
      ).join("\n")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `utilisateurs_peva_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
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
    admin: 'Admin',
    super_admin: 'Super Admin'
  }
  return labels[role] || role
}

const getStatusColor = (user) => {
  if (user.is_suspended) return 'red'
  if (!user.email_confirmed_at) return 'orange'
  return 'green'
}

const getStatusLabel = (user) => {
  if (user.is_suspended) return 'Suspendu'
  if (!user.email_confirmed_at) return 'Non vérifié'
  return 'Actif'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

// Lifecycle
onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.admin-users-manager {
  min-height: 100vh;
}
</style>
