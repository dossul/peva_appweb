<template>
  <div class="admin-groups">
    <!-- Header -->
    <div class="admin-header bg-teal-darken-2 text-white py-6">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">
              <v-icon size="32" class="mr-3">mdi-account-group</v-icon>
              Gestion des Communautés
            </h1>
            <p class="text-h6 font-weight-regular ma-0">
              Gérez les groupes, catégories et membres
            </p>
          </div>
          <div class="d-flex align-center ga-3">
            <v-chip v-if="stats.pendingMembers" color="warning" prepend-icon="mdi-clock">
              {{ stats.pendingMembers }} demandes en attente
            </v-chip>
            <v-btn 
              color="white" 
              variant="flat" 
              prepend-icon="mdi-plus" 
              class="text-teal-darken-2"
              @click="openGroupDialog()"
            >
              Nouveau Groupe
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <!-- Statistiques -->
      <v-row class="mb-6">
        <v-col cols="12" md="2">
          <v-card color="teal-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-account-group</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.total }}</div>
              <div class="text-body-2">Total groupes</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="2">
          <v-card color="green-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-check-circle</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.active }}</div>
              <div class="text-body-2">Actifs</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="2">
          <v-card color="blue-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-account-multiple</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.members }}</div>
              <div class="text-body-2">Membres</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="2">
          <v-card color="purple-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-message</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.posts }}</div>
              <div class="text-body-2">Publications</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="2">
          <v-card color="orange-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-calendar-week</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.postsWeek }}</div>
              <div class="text-body-2">Cette semaine</div>
            </div>
          </v-card>
        </v-col>
        <v-col cols="12" md="2">
          <v-card color="red-darken-2" class="text-white pa-4" elevation="3">
            <div class="text-center">
              <v-icon size="32" class="mb-2">mdi-clock-alert</v-icon>
              <div class="text-h5 font-weight-bold">{{ stats.pendingMembers }}</div>
              <div class="text-body-2">En attente</div>
            </div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Onglets -->
      <v-card elevation="2">
        <v-tabs v-model="activeTab" bg-color="grey-lighten-4">
          <v-tab value="groups">
            <v-icon class="mr-2">mdi-account-group</v-icon>
            Groupes
          </v-tab>
          <v-tab value="categories">
            <v-icon class="mr-2">mdi-folder-multiple</v-icon>
            Catégories
          </v-tab>
          <v-tab value="pending">
            <v-icon class="mr-2">mdi-clock</v-icon>
            Demandes
            <v-chip v-if="stats.pendingMembers" size="small" color="warning" class="ml-2">
              {{ stats.pendingMembers }}
            </v-chip>
          </v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <!-- Onglet Groupes -->
          <v-window-item value="groups">
            <v-card-text>
              <v-row class="mb-4">
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="groupSearch"
                    placeholder="Rechercher..."
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                    @update:model-value="loadGroups"
                  />
                </v-col>
                <v-col cols="12" md="3">
                  <v-select
                    v-model="groupStatusFilter"
                    :items="[
                      { title: 'Tous', value: null },
                      { title: 'Actifs', value: true },
                      { title: 'Inactifs', value: false }
                    ]"
                    item-title="title"
                    item-value="value"
                    variant="outlined"
                    density="compact"
                    hide-details
                    @update:model-value="loadGroups"
                  />
                </v-col>
              </v-row>

              <v-data-table
                :headers="groupHeaders"
                :items="groups"
                :loading="loadingGroups"
                class="elevation-0"
              >
                <template v-slot:item.name="{ item }">
                  <div class="d-flex align-center">
                    <v-avatar :color="item.color || 'teal'" size="40" class="mr-3">
                      <v-icon color="white">{{ item.icon || 'mdi-account-group' }}</v-icon>
                    </v-avatar>
                    <div>
                      <div class="font-weight-bold">{{ item.name }}</div>
                      <div class="text-caption text-grey">{{ item.category || 'Général' }}</div>
                    </div>
                  </div>
                </template>
                
                <template v-slot:item.is_public="{ item }">
                  <v-chip :color="item.is_public ? 'green' : 'orange'" size="small">
                    {{ item.is_public ? 'Public' : 'Privé' }}
                  </v-chip>
                </template>
                
                <template v-slot:item.members_count="{ item }">
                  <div class="d-flex align-center">
                    <v-icon size="14" class="mr-1">mdi-account-group</v-icon>
                    {{ item.members_count || 0 }}
                  </div>
                </template>
                
                <template v-slot:item.is_active="{ item }">
                  <v-switch
                    :model-value="item.is_active"
                    color="success"
                    hide-details
                    density="compact"
                    @update:model-value="toggleGroupStatus(item)"
                  />
                </template>
                
                <template v-slot:item.actions="{ item }">
                  <v-btn icon size="small" @click="openGroupDialog(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon size="small" @click="viewMembers(item)">
                    <v-icon>mdi-account-multiple</v-icon>
                  </v-btn>
                  <v-btn icon size="small" color="error" @click="confirmDeleteGroup(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-window-item>

          <!-- Onglet Catégories -->
          <v-window-item value="categories">
            <v-card-text>
              <div class="d-flex justify-end mb-4">
                <v-btn color="teal-darken-2" variant="flat" prepend-icon="mdi-plus" @click="openCategoryDialog()">
                  Nouvelle Catégorie
                </v-btn>
              </div>

              <v-data-table
                :headers="categoryHeaders"
                :items="categories"
                :loading="loadingCategories"
                class="elevation-0"
              >
                <template v-slot:item.icon="{ item }">
                  <v-avatar :color="item.color || 'teal'" size="36">
                    <v-icon color="white">{{ item.icon || 'mdi-folder' }}</v-icon>
                  </v-avatar>
                </template>
                
                <template v-slot:item.name="{ item }">
                  <div>
                    <div class="font-weight-bold">{{ item.name }}</div>
                    <div class="text-caption text-grey">{{ item.description }}</div>
                  </div>
                </template>
                
                <template v-slot:item.is_active="{ item }">
                  <v-chip :color="item.is_active ? 'success' : 'grey'" size="small">
                    {{ item.is_active ? 'Actif' : 'Inactif' }}
                  </v-chip>
                </template>
                
                <template v-slot:item.actions="{ item }">
                  <v-btn icon size="small" @click="openCategoryDialog(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon size="small" color="error" @click="confirmDeleteCategory(item)">
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-window-item>

          <!-- Onglet Demandes en attente -->
          <v-window-item value="pending">
            <v-card-text>
              <v-data-table
                :headers="pendingHeaders"
                :items="pendingMembers"
                :loading="loadingPending"
                class="elevation-0"
              >
                <template v-slot:item.user="{ item }">
                  <div class="d-flex align-center">
                    <v-avatar size="32" class="mr-2" color="teal">
                      <span class="text-white">{{ getInitials(item.pev_profiles) }}</span>
                    </v-avatar>
                    <div>
                      <div class="font-weight-bold">
                        {{ item.pev_profiles?.first_name }} {{ item.pev_profiles?.last_name }}
                      </div>
                      <div class="text-caption text-grey">{{ item.pev_profiles?.email }}</div>
                    </div>
                  </div>
                </template>
                
                <template v-slot:item.group="{ item }">
                  {{ item.pev_groups?.name || 'Groupe inconnu' }}
                </template>
                
                <template v-slot:item.joined_at="{ item }">
                  {{ formatDate(item.joined_at) }}
                </template>
                
                <template v-slot:item.actions="{ item }">
                  <v-btn size="small" color="success" variant="flat" class="mr-2" @click="approveMember(item)">
                    <v-icon class="mr-1">mdi-check</v-icon>
                    Approuver
                  </v-btn>
                  <v-btn size="small" color="error" variant="outlined" @click="rejectMember(item)">
                    <v-icon class="mr-1">mdi-close</v-icon>
                    Refuser
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-window-item>
        </v-window>
      </v-card>
    </v-container>

    <!-- Dialog Groupe -->
    <v-dialog v-model="groupDialog" max-width="700">
      <v-card>
        <v-card-title>
          {{ editingGroup ? 'Modifier le groupe' : 'Nouveau groupe' }}
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12">
              <v-text-field v-model="groupForm.name" label="Nom du groupe *" variant="outlined" />
            </v-col>
            <v-col cols="12">
              <v-textarea v-model="groupForm.description" label="Description" variant="outlined" rows="3" />
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="groupForm.icon"
                :items="iconOptions"
                label="Icône"
                variant="outlined"
              >
                <template v-slot:selection="{ item }">
                  <v-icon class="mr-2">{{ item.value }}</v-icon>
                  {{ item.title }}
                </template>
                <template v-slot:item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-icon>{{ item.value }}</v-icon>
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="groupForm.color"
                :items="colorOptions"
                label="Couleur"
                variant="outlined"
              >
                <template v-slot:selection="{ item }">
                  <v-avatar :color="item.value" size="20" class="mr-2" />
                  {{ item.title }}
                </template>
                <template v-slot:item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend>
                      <v-avatar :color="item.value" size="24" />
                    </template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                v-model="groupForm.category_id"
                :items="categories"
                item-title="name"
                item-value="id"
                label="Catégorie"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-switch v-model="groupForm.is_public" label="Groupe public" color="success" />
            </v-col>
            <v-col cols="6">
              <v-switch v-model="groupForm.is_active" label="Groupe actif" color="success" />
            </v-col>
          </v-row>

          <!-- Prévisualisation -->
          <div class="mt-4 pa-4 bg-grey-lighten-4 rounded">
            <div class="text-caption mb-2">Prévisualisation :</div>
            <div class="d-flex align-center">
              <v-avatar :color="groupForm.color || 'teal'" size="48" class="mr-4">
                <v-icon color="white" size="24">{{ groupForm.icon || 'mdi-account-group' }}</v-icon>
              </v-avatar>
              <div>
                <div class="font-weight-bold">{{ groupForm.name || 'Nom du groupe' }}</div>
                <div class="text-body-2 text-grey">{{ groupForm.description || 'Description...' }}</div>
              </div>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="groupDialog = false">Annuler</v-btn>
          <v-btn color="teal-darken-2" variant="flat" @click="saveGroup" :loading="saving" :disabled="!groupForm.name">
            {{ editingGroup ? 'Enregistrer' : 'Créer' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Catégorie -->
    <v-dialog v-model="categoryDialog" max-width="500">
      <v-card>
        <v-card-title>
          {{ editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
        </v-card-title>
        <v-card-text>
          <v-text-field v-model="categoryForm.name" label="Nom *" variant="outlined" class="mb-4" />
          <v-textarea v-model="categoryForm.description" label="Description" variant="outlined" rows="2" class="mb-4" />
          <v-row>
            <v-col cols="6">
              <v-select v-model="categoryForm.icon" :items="iconOptions" label="Icône" variant="outlined">
                <template v-slot:selection="{ item }">
                  <v-icon class="mr-2">{{ item.value }}</v-icon>
                </template>
                <template v-slot:item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend><v-icon>{{ item.value }}</v-icon></template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
            <v-col cols="6">
              <v-select v-model="categoryForm.color" :items="colorOptions" label="Couleur" variant="outlined">
                <template v-slot:selection="{ item }">
                  <v-avatar :color="item.value" size="20" class="mr-2" />
                </template>
                <template v-slot:item="{ item, props }">
                  <v-list-item v-bind="props">
                    <template v-slot:prepend><v-avatar :color="item.value" size="24" /></template>
                  </v-list-item>
                </template>
              </v-select>
            </v-col>
          </v-row>
          <v-switch v-model="categoryForm.is_active" label="Catégorie active" color="success" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="categoryDialog = false">Annuler</v-btn>
          <v-btn color="teal-darken-2" variant="flat" @click="saveCategory" :loading="saving" :disabled="!categoryForm.name">
            {{ editingCategory ? 'Enregistrer' : 'Créer' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Confirmation Suppression -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-error">Confirmer la suppression</v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer {{ deleteType === 'group' ? 'ce groupe' : 'cette catégorie' }} ?
          <br><br>
          <strong>{{ deleteItem?.name }}</strong>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDelete" :loading="deleting">Supprimer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Membres -->
    <v-dialog v-model="membersDialog" max-width="800">
      <v-card>
        <v-card-title>
          Membres de {{ selectedGroup?.name }}
        </v-card-title>
        <v-card-text>
          <v-data-table
            :headers="memberHeaders"
            :items="groupMembers"
            :loading="loadingMembers"
            class="elevation-0"
          >
            <template v-slot:item.user="{ item }">
              <div class="d-flex align-center">
                <v-avatar size="32" class="mr-2" color="teal">
                  <span class="text-white">{{ getInitials(item.pev_profiles) }}</span>
                </v-avatar>
                <div>
                  <div>{{ item.pev_profiles?.first_name }} {{ item.pev_profiles?.last_name }}</div>
                  <div class="text-caption text-grey">{{ item.pev_profiles?.email }}</div>
                </div>
              </div>
            </template>
            <template v-slot:item.role="{ item }">
              <v-chip :color="item.role === 'admin' ? 'purple' : 'grey'" size="small">
                {{ item.role === 'admin' ? 'Admin' : 'Membre' }}
              </v-chip>
            </template>
            <template v-slot:item.actions="{ item }">
              <v-btn icon size="small" color="error" @click="removeMemberFromGroup(item)">
                <v-icon>mdi-account-remove</v-icon>
              </v-btn>
            </template>
          </v-data-table>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="membersDialog = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="4000">
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">Fermer</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { groupService } from '@/services/admin/groupService'

// État
const activeTab = ref('groups')
const loadingGroups = ref(false)
const loadingCategories = ref(false)
const loadingPending = ref(false)
const loadingMembers = ref(false)
const saving = ref(false)
const deleting = ref(false)

// Données
const stats = ref({ total: 0, active: 0, members: 0, posts: 0, postsWeek: 0, pendingMembers: 0 })
const groups = ref([])
const categories = ref([])
const pendingMembers = ref([])
const groupMembers = ref([])

// Filtres
const groupSearch = ref('')
const groupStatusFilter = ref(null)

// Dialogs
const groupDialog = ref(false)
const categoryDialog = ref(false)
const deleteDialog = ref(false)
const membersDialog = ref(false)

// Edition
const editingGroup = ref(null)
const editingCategory = ref(null)
const deleteType = ref('')
const deleteItem = ref(null)
const selectedGroup = ref(null)

// Formulaires
const groupForm = ref({
  name: '', description: '', icon: 'mdi-account-group', color: 'teal',
  category_id: null, is_public: true, is_active: true
})
const categoryForm = ref({
  name: '', description: '', icon: 'mdi-folder', color: 'teal', is_active: true
})

// Snackbar
const snackbar = ref({ show: false, message: '', color: 'success' })

// Options
const iconOptions = [
  { title: 'Groupe', value: 'mdi-account-group' },
  { title: 'Énergie', value: 'mdi-solar-power' },
  { title: 'Agriculture', value: 'mdi-sprout' },
  { title: 'Finance', value: 'mdi-currency-eur' },
  { title: 'Transport', value: 'mdi-car-electric' },
  { title: 'Recyclage', value: 'mdi-recycle' },
  { title: 'Innovation', value: 'mdi-lightbulb' },
  { title: 'Eau', value: 'mdi-water' },
  { title: 'Bâtiment', value: 'mdi-home-city' },
  { title: 'Global', value: 'mdi-earth' }
]

const colorOptions = [
  { title: 'Teal', value: 'teal' },
  { title: 'Vert', value: 'green' },
  { title: 'Bleu', value: 'blue' },
  { title: 'Violet', value: 'purple' },
  { title: 'Orange', value: 'orange' },
  { title: 'Rose', value: 'pink' },
  { title: 'Indigo', value: 'indigo' },
  { title: 'Rouge', value: 'red' }
]

// Headers
const groupHeaders = [
  { title: 'Groupe', key: 'name' },
  { title: 'Type', key: 'is_public', width: 100 },
  { title: 'Membres', key: 'members_count', width: 100 },
  { title: 'Actif', key: 'is_active', width: 80 },
  { title: 'Actions', key: 'actions', sortable: false, width: 150 }
]

const categoryHeaders = [
  { title: 'Icône', key: 'icon', sortable: false, width: 80 },
  { title: 'Catégorie', key: 'name' },
  { title: 'Ordre', key: 'display_order', width: 100 },
  { title: 'Statut', key: 'is_active', width: 100 },
  { title: 'Actions', key: 'actions', sortable: false, width: 120 }
]

const pendingHeaders = [
  { title: 'Utilisateur', key: 'user' },
  { title: 'Groupe', key: 'group' },
  { title: 'Date demande', key: 'joined_at', width: 150 },
  { title: 'Actions', key: 'actions', sortable: false, width: 220 }
]

const memberHeaders = [
  { title: 'Membre', key: 'user' },
  { title: 'Rôle', key: 'role', width: 100 },
  { title: 'Actions', key: 'actions', sortable: false, width: 80 }
]

// Méthodes
const loadStats = async () => {
  const result = await groupService.getGroupsStats()
  if (result.success) stats.value = result.data
}

const loadGroups = async () => {
  loadingGroups.value = true
  const result = await groupService.getGroups({
    search: groupSearch.value,
    isActive: groupStatusFilter.value
  })
  if (result.success) groups.value = result.data
  loadingGroups.value = false
}

const loadCategories = async () => {
  loadingCategories.value = true
  const result = await groupService.getCategories()
  if (result.success) categories.value = result.data
  loadingCategories.value = false
}

const loadPendingMembers = async () => {
  loadingPending.value = true
  // Charger toutes les demandes en attente de tous les groupes
  const result = await groupService.getGroupMembers(null, { status: 'pending' })
  if (result.success) pendingMembers.value = result.data
  loadingPending.value = false
}

const openGroupDialog = (group = null) => {
  editingGroup.value = group
  if (group) {
    groupForm.value = { ...group }
  } else {
    groupForm.value = {
      name: '', description: '', icon: 'mdi-account-group', color: 'teal',
      category_id: null, is_public: true, is_active: true
    }
  }
  groupDialog.value = true
}

const openCategoryDialog = (category = null) => {
  editingCategory.value = category
  if (category) {
    categoryForm.value = { ...category }
  } else {
    categoryForm.value = { name: '', description: '', icon: 'mdi-folder', color: 'teal', is_active: true }
  }
  categoryDialog.value = true
}

const saveGroup = async () => {
  saving.value = true
  let result
  if (editingGroup.value) {
    result = await groupService.updateGroup(editingGroup.value.id, groupForm.value)
  } else {
    result = await groupService.createGroup(groupForm.value)
  }
  if (result.success) {
    showMessage(editingGroup.value ? 'Groupe modifié' : 'Groupe créé', 'success')
    groupDialog.value = false
    loadGroups()
    loadStats()
  } else {
    showMessage(result.error || 'Erreur', 'error')
  }
  saving.value = false
}

const saveCategory = async () => {
  saving.value = true
  let result
  if (editingCategory.value) {
    result = await groupService.updateCategory(editingCategory.value.id, categoryForm.value)
  } else {
    result = await groupService.createCategory(categoryForm.value)
  }
  if (result.success) {
    showMessage(editingCategory.value ? 'Catégorie modifiée' : 'Catégorie créée', 'success')
    categoryDialog.value = false
    loadCategories()
  } else {
    showMessage(result.error || 'Erreur', 'error')
  }
  saving.value = false
}

const toggleGroupStatus = async (group) => {
  const result = await groupService.toggleGroupStatus(group.id, !group.is_active)
  if (result.success) {
    group.is_active = !group.is_active
    loadStats()
  }
}

const confirmDeleteGroup = (group) => {
  deleteType.value = 'group'
  deleteItem.value = group
  deleteDialog.value = true
}

const confirmDeleteCategory = (category) => {
  deleteType.value = 'category'
  deleteItem.value = category
  deleteDialog.value = true
}

const confirmDelete = async () => {
  deleting.value = true
  let result
  if (deleteType.value === 'group') {
    result = await groupService.deleteGroup(deleteItem.value.id)
    if (result.success) loadGroups()
  } else {
    result = await groupService.deleteCategory(deleteItem.value.id)
    if (result.success) loadCategories()
  }
  if (result.success) {
    showMessage('Supprimé avec succès', 'success')
    loadStats()
  } else {
    showMessage(result.error || 'Erreur', 'error')
  }
  deleteDialog.value = false
  deleting.value = false
}

const viewMembers = async (group) => {
  selectedGroup.value = group
  loadingMembers.value = true
  membersDialog.value = true
  const result = await groupService.getGroupMembers(group.id)
  if (result.success) groupMembers.value = result.data
  loadingMembers.value = false
}

const approveMember = async (member) => {
  const result = await groupService.approveMember(member.id)
  if (result.success) {
    showMessage('Membre approuvé', 'success')
    loadPendingMembers()
    loadStats()
  }
}

const rejectMember = async (member) => {
  const result = await groupService.removeMember(member.id)
  if (result.success) {
    showMessage('Demande refusée', 'success')
    loadPendingMembers()
    loadStats()
  }
}

const removeMemberFromGroup = async (member) => {
  const result = await groupService.removeMember(member.id)
  if (result.success) {
    showMessage('Membre retiré', 'success')
    viewMembers(selectedGroup.value)
  }
}

const getInitials = (profile) => {
  if (!profile) return '?'
  return ((profile.first_name?.[0] || '') + (profile.last_name?.[0] || '')).toUpperCase() || '?'
}

const formatDate = (date) => date ? new Date(date).toLocaleDateString('fr-FR') : '-'

const showMessage = (message, color) => {
  snackbar.value = { show: true, message, color }
}

// Init
onMounted(() => {
  loadStats()
  loadGroups()
  loadCategories()
  loadPendingMembers()
})
</script>

<style scoped>
.admin-groups {
  min-height: 100vh;
  background-color: #f8f9fa;
}
.admin-header {
  background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%);
}
.v-card { border-radius: 12px !important; }
.v-btn { border-radius: 8px !important; }
</style>
