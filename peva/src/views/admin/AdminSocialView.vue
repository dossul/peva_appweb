<template>
  <div class="admin-social-view">
    <v-container fluid>
      <v-row>
        <v-col cols="12">
          <div class="d-flex align-center justify-space-between mb-6">
            <div>
              <h1 class="text-h4 font-weight-bold">Gestion des Réseaux Sociaux</h1>
              <p class="text-body-1 text-grey-darken-1 mt-2">
                Configurez les comptes sociaux pour le partage automatique des opportunités
              </p>
            </div>
            <v-btn
              color="primary"
              prepend-icon="mdi-plus"
              @click="openAddDialog"
            >
              Ajouter un compte
            </v-btn>
          </div>
        </v-col>
      </v-row>

      <!-- Statistiques -->
      <v-row>
        <v-col cols="12" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex align-center">
                <v-icon size="40" color="blue" class="mr-3">mdi-account-network</v-icon>
                <div>
                  <div class="text-h5 font-weight-bold">{{ accounts.length }}</div>
                  <div class="text-body-2 text-grey-darken-1">Comptes configurés</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex align-center">
                <v-icon size="40" color="green" class="mr-3">mdi-check-circle</v-icon>
                <div>
                  <div class="text-h5 font-weight-bold">{{ activeAccounts }}</div>
                  <div class="text-body-2 text-grey-darken-1">Comptes actifs</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex align-center">
                <v-icon size="40" color="purple" class="mr-3">mdi-share-variant</v-icon>
                <div>
                  <div class="text-h5 font-weight-bold">{{ totalPosts }}</div>
                  <div class="text-body-2 text-grey-darken-1">Publications totales</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="3">
          <v-card>
            <v-card-text>
              <div class="d-flex align-center">
                <v-icon size="40" color="orange" class="mr-3">mdi-clock-outline</v-icon>
                <div>
                  <div class="text-h5 font-weight-bold">{{ pendingPosts }}</div>
                  <div class="text-body-2 text-grey-darken-1">En attente</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Liste des comptes -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card>
            <v-card-title class="pa-4">
              <v-icon class="mr-2">mdi-account-network</v-icon>
              Comptes configurés
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="headers"
                :items="accounts"
                :loading="loading"
                class="elevation-0"
              >
                <template v-slot:item.platform="{ item }">
                  <v-chip :color="getPlatformColor(item.platform)" size="small">
                    <v-icon start :icon="getPlatformIcon(item.platform)"></v-icon>
                    {{ item.platform }}
                  </v-chip>
                </template>

                <template v-slot:item.is_active="{ item }">
                  <v-switch
                    v-model="item.is_active"
                    color="success"
                    hide-details
                    @change="toggleAccountStatus(item)"
                  />
                </template>

                <template v-slot:item.created_at="{ item }">
                  {{ new Date(item.created_at).toLocaleDateString('fr-FR') }}
                </template>

                <template v-slot:item.actions="{ item }">
                  <v-btn
                    icon="mdi-pencil"
                    variant="text"
                    size="small"
                    @click="editAccount(item)"
                  />
                  <v-btn
                    icon="mdi-delete"
                    variant="text"
                    size="small"
                    color="error"
                    @click="confirmDelete(item)"
                  />
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Historique des publications -->
      <v-row class="mt-4">
        <v-col cols="12">
          <v-card>
            <v-card-title class="pa-4">
              <v-icon class="mr-2">mdi-history</v-icon>
              Historique des publications
              <v-spacer />
              <v-btn
                variant="outlined"
                size="small"
                prepend-icon="mdi-refresh"
                @click="loadShareHistory"
              >
                Actualiser
              </v-btn>
            </v-card-title>
            <v-card-text>
              <v-data-table
                :headers="historyHeaders"
                :items="shareHistory"
                :loading="loadingHistory"
                class="elevation-0"
              >
                <template v-slot:item.platform="{ item }">
                  <v-chip :color="getPlatformColor(item.platform)" size="small">
                    <v-icon start :icon="getPlatformIcon(item.platform)"></v-icon>
                    {{ item.platform }}
                  </v-chip>
                </template>

                <template v-slot:item.status="{ item }">
                  <v-chip :color="getStatusColor(item.status)" size="small">
                    {{ getStatusLabel(item.status) }}
                  </v-chip>
                </template>

                <template v-slot:item.created_at="{ item }">
                  {{ new Date(item.created_at).toLocaleString('fr-FR') }}
                </template>

                <template v-slot:item.opportunity="{ item }">
                  {{ item.opportunity?.title || 'N/A' }}
                </template>

                <template v-slot:item.account="{ item }">
                  {{ item.account?.name || 'N/A' }}
                </template>
              </v-data-table>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dialog Ajout/Édition -->
    <v-dialog v-model="showDialog" max-width="600">
      <v-card>
        <v-card-title class="pa-4 bg-primary text-white">
          {{ editMode ? 'Modifier le compte' : 'Ajouter un compte social' }}
        </v-card-title>
        <v-card-text class="pa-4">
          <v-form ref="form">
            <v-select
              v-model="formData.platform"
              :items="platforms"
              label="Plateforme *"
              variant="outlined"
              :rules="[rules.required]"
              class="mb-3"
            >
              <template v-slot:item="{ item, props }">
                <v-list-item v-bind="props">
                  <template v-slot:prepend>
                    <v-icon :icon="getPlatformIcon(item.value)"></v-icon>
                  </template>
                </v-list-item>
              </template>
            </v-select>

            <v-text-field
              v-model="formData.name"
              label="Nom du compte *"
              variant="outlined"
              :rules="[rules.required]"
              placeholder="Ex: GreenHub Official"
              class="mb-3"
            />

            <v-alert type="info" variant="tonal" class="mb-3">
              <strong>Note :</strong> Les credentials (tokens API) doivent être configurés de manière sécurisée.
              Pour l'instant, cette fonctionnalité est en mode simulation.
            </v-alert>

            <v-switch
              v-model="formData.is_active"
              label="Compte actif"
              color="success"
              hide-details
            />
          </v-form>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="closeDialog">
            Annuler
          </v-btn>
          <v-btn
            color="primary"
            @click="saveAccount"
            :loading="saving"
          >
            {{ editMode ? 'Modifier' : 'Ajouter' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Confirmation Suppression -->
    <v-dialog v-model="showDeleteDialog" max-width="400">
      <v-card>
        <v-card-title class="pa-4">Confirmer la suppression</v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer le compte <strong>{{ accountToDelete?.name }}</strong> ?
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="outlined" @click="showDeleteDialog = false">
            Annuler
          </v-btn>
          <v-btn
            color="error"
            @click="deleteAccount"
            :loading="deleting"
          >
            Supprimer
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
import { ref, computed, onMounted } from 'vue'
import { socialService } from '@/services/admin/socialService'

// État
const accounts = ref([])
const shareHistory = ref([])
const loading = ref(false)
const loadingHistory = ref(false)
const saving = ref(false)
const deleting = ref(false)
const showDialog = ref(false)
const showDeleteDialog = ref(false)
const editMode = ref(false)
const accountToDelete = ref(null)

const formData = ref({
  platform: '',
  name: '',
  is_active: true,
  credentials: {}
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Headers tables
const headers = [
  { title: 'Plateforme', key: 'platform', sortable: true },
  { title: 'Nom du compte', key: 'name', sortable: true },
  { title: 'Actif', key: 'is_active', sortable: false },
  { title: 'Date de création', key: 'created_at', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false }
]

const historyHeaders = [
  { title: 'Opportunité', key: 'opportunity', sortable: false },
  { title: 'Compte', key: 'account', sortable: false },
  { title: 'Plateforme', key: 'platform', sortable: true },
  { title: 'Statut', key: 'status', sortable: true },
  { title: 'Date', key: 'created_at', sortable: true }
]

const platforms = [
  { title: 'Facebook', value: 'facebook' },
  { title: 'Twitter', value: 'twitter' },
  { title: 'LinkedIn', value: 'linkedin' },
  { title: 'Instagram', value: 'instagram' }
]

const rules = {
  required: value => !!value || 'Ce champ est requis'
}

// Computed
const activeAccounts = computed(() => accounts.value.filter(a => a.is_active).length)
const totalPosts = computed(() => shareHistory.value.filter(h => h.status === 'published').length)
const pendingPosts = computed(() => shareHistory.value.filter(h => h.status === 'pending').length)

// Methods
const loadAccounts = async () => {
  loading.value = true
  try {
    const result = await socialService.getSocialAccounts()
    if (result.success) {
      accounts.value = result.data
    } else {
      showMessage('Erreur lors du chargement des comptes', 'error')
    }
  } catch (error) {
    console.error('Erreur:', error)
    showMessage('Erreur lors du chargement des comptes', 'error')
  } finally {
    loading.value = false
  }
}

const loadShareHistory = async () => {
  loadingHistory.value = true
  try {
    const result = await socialService.getShareHistory()
    if (result.success) {
      shareHistory.value = result.data
    } else {
      showMessage('Erreur lors du chargement de l\'historique', 'error')
    }
  } catch (error) {
    console.error('Erreur:', error)
    showMessage('Erreur lors du chargement de l\'historique', 'error')
  } finally {
    loadingHistory.value = false
  }
}

const openAddDialog = () => {
  editMode.value = false
  formData.value = {
    platform: '',
    name: '',
    is_active: true,
    credentials: {}
  }
  showDialog.value = true
}

const editAccount = (account) => {
  editMode.value = true
  formData.value = { ...account }
  showDialog.value = true
}

const closeDialog = () => {
  showDialog.value = false
  formData.value = {
    platform: '',
    name: '',
    is_active: true,
    credentials: {}
  }
}

const saveAccount = async () => {
  saving.value = true
  try {
    let result
    if (editMode.value) {
      result = await socialService.updateSocialAccount(formData.value.id, formData.value)
    } else {
      result = await socialService.addSocialAccount(formData.value)
    }

    if (result.success) {
      showMessage(
        editMode.value ? 'Compte modifié avec succès' : 'Compte ajouté avec succès',
        'success'
      )
      closeDialog()
      loadAccounts()
    } else {
      showMessage('Erreur lors de l\'enregistrement', 'error')
    }
  } catch (error) {
    console.error('Erreur:', error)
    showMessage('Erreur lors de l\'enregistrement', 'error')
  } finally {
    saving.value = false
  }
}

const toggleAccountStatus = async (account) => {
  try {
    const result = await socialService.updateSocialAccount(account.id, {
      is_active: account.is_active
    })

    if (result.success) {
      showMessage(
        account.is_active ? 'Compte activé' : 'Compte désactivé',
        'success'
      )
    } else {
      account.is_active = !account.is_active
      showMessage('Erreur lors de la modification', 'error')
    }
  } catch (error) {
    console.error('Erreur:', error)
    account.is_active = !account.is_active
    showMessage('Erreur lors de la modification', 'error')
  }
}

const confirmDelete = (account) => {
  accountToDelete.value = account
  showDeleteDialog.value = true
}

const deleteAccount = async () => {
  deleting.value = true
  try {
    const result = await socialService.deleteSocialAccount(accountToDelete.value.id)

    if (result.success) {
      showMessage('Compte supprimé avec succès', 'success')
      showDeleteDialog.value = false
      loadAccounts()
    } else {
      showMessage('Erreur lors de la suppression', 'error')
    }
  } catch (error) {
    console.error('Erreur:', error)
    showMessage('Erreur lors de la suppression', 'error')
  } finally {
    deleting.value = false
  }
}

const getPlatformIcon = (platform) => {
  const icons = {
    facebook: 'mdi-facebook',
    twitter: 'mdi-twitter',
    linkedin: 'mdi-linkedin',
    instagram: 'mdi-instagram'
  }
  return icons[platform] || 'mdi-web'
}

const getPlatformColor = (platform) => {
  const colors = {
    facebook: 'blue',
    twitter: 'light-blue',
    linkedin: 'indigo',
    instagram: 'pink'
  }
  return colors[platform] || 'grey'
}

const getStatusColor = (status) => {
  const colors = {
    pending: 'orange',
    published: 'green',
    failed: 'red',
    skipped: 'grey'
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'En attente',
    published: 'Publié',
    failed: 'Échec',
    skipped: 'Ignoré'
  }
  return labels[status] || status
}

const showMessage = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  }
}

// Initialize
onMounted(() => {
  loadAccounts()
  loadShareHistory()
})
</script>

<style scoped>
.admin-social-view {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 24px;
}
</style>
