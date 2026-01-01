<template>
  <div class="admin-opportunities-manager">
    <!-- En-tête avec actions -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h5 font-weight-bold">Gestion des Opportunités</h2>
        <p class="text-body-2 text-grey-darken-1">{{ totalOpportunities }} opportunités publiées</p>
      </div>
      <div class="d-flex align-center ga-2">
        <v-btn color="green" prepend-icon="mdi-briefcase-plus" @click="openCreateDialog">
          Nouvelle opportunité
        </v-btn>
        <v-btn color="blue" prepend-icon="mdi-export" @click="exportOpportunities">
          Exporter
        </v-btn>
      </div>
    </div>

    <!-- Filtres et recherche -->
    <v-card class="mb-6" elevation="2">
      <v-card-text>
        <v-row>
          <v-col cols="12" md="3">
            <v-text-field
              v-model="searchQuery"
              label="Rechercher une opportunité"
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
              v-model="filterCategory"
              :items="categoryOptions"
              label="Catégorie"
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
              v-model="filterCountry"
              :items="countryOptions"
              label="Pays"
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

    <!-- Tableau des opportunités -->
    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="filteredOpportunities"
        :loading="loading"
        :items-per-page="itemsPerPage"
        :search="searchQuery"
        class="elevation-0"
      >
        <!-- Titre et type -->
        <template #item.opportunity="{ item }">
          <div class="py-2">
            <div class="font-weight-medium">{{ item.title }}</div>
            <div class="text-caption text-grey-darken-1">
              <v-chip
                :color="getTypeColor(item.type)"
                size="x-small"
                variant="flat"
                class="mr-1"
              >
                {{ getTypeLabel(item.type) }}
              </v-chip>
              {{ item.category }}
            </div>
          </div>
        </template>

        <!-- Montant -->
        <template #item.amount="{ item }">
          <div v-if="item.budget_min || item.budget_max" class="text-body-2">
            <div v-if="item.budget_min && item.budget_max">
              {{ formatAmount(item.budget_min) }} - {{ formatAmount(item.budget_max) }}
            </div>
            <div v-else-if="item.budget_min">
              À partir de {{ formatAmount(item.budget_min) }}
            </div>
            <div v-else>
              Jusqu'à {{ formatAmount(item.budget_max) }}
            </div>
          </div>
          <div v-else class="text-caption text-grey">Non spécifié</div>
        </template>

        <!-- Localisation -->
        <template #item.location="{ item }">
          <div class="text-body-2">
            <div v-if="item.is_remote" class="d-flex align-center">
              <v-icon size="16" color="blue" class="mr-1">mdi-web</v-icon>
              Télétravail
            </div>
            <div v-else>
              {{ item.city || item.country || 'Non spécifié' }}
            </div>
          </div>
        </template>

        <!-- Créateur -->
        <template #item.creator="{ item }">
          <div v-if="item.creator" class="d-flex align-center">
            <v-avatar size="24" class="mr-2">
              <v-img
                v-if="item.creator.avatar_url"
                :src="item.creator.avatar_url"
                :alt="item.creator.first_name"
              />
              <v-icon v-else size="16">mdi-account</v-icon>
            </v-avatar>
            <div class="text-body-2">
              {{ item.creator.first_name }} {{ item.creator.last_name }}
            </div>
          </div>
          <div v-else class="text-caption text-grey">Non défini</div>
        </template>

        <!-- Statut -->
        <template #item.status="{ item }">
          <v-chip
            :color="getStatusColor(item.status)"
            size="small"
            variant="tonal"
          >
            {{ getStatusLabel(item.status) }}
          </v-chip>
        </template>

        <!-- Date limite -->
        <template #item.deadline="{ item }">
          <div v-if="item.deadline" class="text-body-2">
            <div :class="getDeadlineClass(item.deadline)">
              {{ formatDate(item.deadline) }}
            </div>
          </div>
          <div v-else class="text-caption text-grey">Aucune</div>
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
            <v-tooltip text="Voir l'opportunité">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  @click="viewOpportunity(item)"
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
                  @click="editOpportunity(item)"
                />
              </template>
            </v-tooltip>
            <v-tooltip :text="item.status === 'published' ? 'Suspendre' : 'Publier'">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  :icon="item.status === 'published' ? 'mdi-pause' : 'mdi-play'"
                  size="small"
                  variant="text"
                  :color="item.status === 'published' ? 'orange' : 'green'"
                  @click="toggleStatus(item)"
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
                  @click="deleteOpportunity(item)"
                />
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de création/modification -->
    <v-dialog v-model="opportunityDialog" max-width="1000px" persistent>
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          {{ editingOpportunity ? 'Modifier l\'opportunité' : 'Nouvelle opportunité' }}
        </v-card-title>
        
        <v-card-text>
          <v-form ref="opportunityForm" v-model="formValid">
            <v-row>
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="opportunityFormData.title"
                  label="Titre de l'opportunité"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-select
                  v-model="opportunityFormData.type"
                  :items="typeList"
                  label="Type d'opportunité"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="opportunityFormData.description"
                  label="Description"
                  :rules="[rules.required]"
                  rows="4"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="opportunityFormData.category"
                  label="Catégorie"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="opportunityFormData.organization"
                  label="Organisation"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="opportunityFormData.budget_min"
                  label="Budget minimum"
                  type="number"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="opportunityFormData.budget_max"
                  label="Budget maximum"
                  type="number"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="opportunityFormData.currency"
                  label="Devise"
                  value="XOF"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="opportunityFormData.city"
                  label="Ville"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="opportunityFormData.country"
                  label="Pays"
                  value="Burkina Faso"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="opportunityFormData.deadline"
                  label="Date limite"
                  type="date"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-switch
                  v-model="opportunityFormData.is_remote"
                  label="Télétravail possible"
                  color="primary"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="opportunityFormData.requirements"
                  label="Exigences"
                  rows="3"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="closeOpportunityDialog">
            Annuler
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="saving"
            :disabled="!formValid"
            @click="saveOpportunity"
          >
            {{ editingOpportunity ? 'Modifier' : 'Créer' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de confirmation de suppression -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">Confirmer la suppression</v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer l'opportunité 
          <strong>{{ opportunityToDelete?.title }}</strong> ?
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
const opportunities = ref([])
const loading = ref(false)
const saving = ref(false)
const searchQuery = ref('')
const filterType = ref('all')
const filterCategory = ref('all')
const filterStatus = ref('all')
const filterCountry = ref('all')
const itemsPerPage = ref(25)

// Dialogs
const opportunityDialog = ref(false)
const deleteDialog = ref(false)
const editingOpportunity = ref(null)
const opportunityToDelete = ref(null)
const formValid = ref(false)

// Données du formulaire
const opportunityFormData = ref({
  title: '',
  type: '',
  description: '',
  category: '',
  organization: '',
  budget_min: null,
  budget_max: null,
  currency: 'XOF',
  city: '',
  country: 'Burkina Faso',
  deadline: '',
  is_remote: false,
  requirements: ''
})

// Options pour les filtres
const typeOptions = [
  { title: 'Tous les types', value: 'all' },
  { title: 'Financement', value: 'funding' },
  { title: 'Emploi', value: 'job' },
  { title: 'Partenariat', value: 'partnership' },
  { title: 'Mission', value: 'mission' },
  { title: 'Formation', value: 'training' }
]

const typeList = computed(() => 
  typeOptions.value.filter(item => item.value !== 'all')
)

const categoryOptions = [
  { title: 'Toutes les catégories', value: 'all' },
  { title: 'Énergie Solaire', value: 'Énergie Solaire' },
  { title: 'Agriculture Durable', value: 'Agriculture Durable' },
  { title: 'Gestion de l\'Eau', value: 'Gestion de l\'Eau' },
  { title: 'Écotourisme', value: 'Écotourisme' }
]

const statusOptions = [
  { title: 'Tous les statuts', value: 'all' },
  { title: 'Publiée', value: 'published' },
  { title: 'Brouillon', value: 'draft' },
  { title: 'Expirée', value: 'expired' },
  { title: 'Suspendue', value: 'suspended' }
]

const countryOptions = [
  { title: 'Tous les pays', value: 'all' },
  { title: 'Burkina Faso', value: 'Burkina Faso' }
]

// En-têtes du tableau
const headers = [
  { title: 'Opportunité', key: 'opportunity', sortable: false },
  { title: 'Montant', key: 'amount', sortable: false },
  { title: 'Localisation', key: 'location', sortable: false },
  { title: 'Créateur', key: 'creator', sortable: false },
  { title: 'Statut', key: 'status' },
  { title: 'Date limite', key: 'deadline' },
  { title: 'Créée le', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Règles de validation
const rules = {
  required: value => !!value || 'Ce champ est requis'
}

// Computed
const totalOpportunities = computed(() => opportunities.value.length)

const filteredOpportunities = computed(() => {
  let filtered = opportunities.value

  if (filterType.value !== 'all') {
    filtered = filtered.filter(opp => opp.type === filterType.value)
  }

  if (filterCategory.value !== 'all') {
    filtered = filtered.filter(opp => opp.category === filterCategory.value)
  }

  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(opp => opp.status === filterStatus.value)
  }

  if (filterCountry.value !== 'all') {
    filtered = filtered.filter(opp => opp.country === filterCountry.value)
  }

  return filtered
})

// Méthodes
const loadOpportunities = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('pev_opportunities')
      .select(`
        *,
        creator:pev_profiles(first_name, last_name, avatar_url),
        company:companies(name, logo_url)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    opportunities.value = data || []
  } catch (error) {
    console.error('Erreur lors du chargement des opportunités:', error)
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  filterType.value = 'all'
  filterCategory.value = 'all'
  filterStatus.value = 'all'
  filterCountry.value = 'all'
}

const openCreateDialog = () => {
  editingOpportunity.value = null
  opportunityFormData.value = {
    title: '',
    type: '',
    description: '',
    category: '',
    organization: '',
    budget_min: null,
    budget_max: null,
    currency: 'XOF',
    city: '',
    country: 'Burkina Faso',
    deadline: '',
    is_remote: false,
    requirements: ''
  }
  opportunityDialog.value = true
}

const editOpportunity = (opportunity) => {
  editingOpportunity.value = opportunity
  opportunityFormData.value = { ...opportunity }
  opportunityDialog.value = true
}

const closeOpportunityDialog = () => {
  opportunityDialog.value = false
  editingOpportunity.value = null
}

const saveOpportunity = async () => {
  if (!formValid.value) return

  saving.value = true
  try {
    if (editingOpportunity.value) {
      // Modification
      const { error } = await supabase
        .from('pev_opportunities')
        .update(opportunityFormData.value)
        .eq('id', editingOpportunity.value.id)

      if (error) throw error
      
      // Mettre à jour localement
      const index = opportunities.value.findIndex(o => o.id === editingOpportunity.value.id)
      if (index !== -1) {
        opportunities.value[index] = { ...opportunities.value[index], ...opportunityFormData.value }
      }
    } else {
      // Création
      const { data, error } = await dataService.createOpportunity(opportunityFormData.value)
      if (error) throw error
      
      opportunities.value.unshift(data)
    }

    closeOpportunityDialog()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    saving.value = false
  }
}

const viewOpportunity = (opportunity) => {
  window.open(`/opportunities/${opportunity.id}`, '_blank')
}

const toggleStatus = async (opportunity) => {
  try {
    const newStatus = opportunity.status === 'published' ? 'suspended' : 'published'
    const { error } = await supabase
      .from('pev_opportunities')
      .update({ status: newStatus })
      .eq('id', opportunity.id)

    if (error) throw error

    opportunity.status = newStatus
  } catch (error) {
    console.error('Erreur lors de la modification du statut:', error)
  }
}

const deleteOpportunity = (opportunity) => {
  opportunityToDelete.value = opportunity
  deleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    const { error } = await supabase
      .from('pev_opportunities')
      .delete()
      .eq('id', opportunityToDelete.value.id)

    if (error) throw error

    const index = opportunities.value.findIndex(o => o.id === opportunityToDelete.value.id)
    if (index !== -1) {
      opportunities.value.splice(index, 1)
    }

    deleteDialog.value = false
    opportunityToDelete.value = null
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

const exportOpportunities = () => {
  const csvContent = "data:text/csv;charset=utf-8," 
    + "Titre,Type,Catégorie,Organisation,Statut,Créée le\n"
    + opportunities.value.map(opp => 
        `"${opp.title}","${opp.type}","${opp.category}","${opp.organization || ''}","${opp.status}","${formatDate(opp.created_at)}"`
      ).join("\n")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `opportunites_peva_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Utilitaires
const getTypeColor = (type) => {
  const colors = {
    funding: 'green',
    job: 'blue',
    partnership: 'purple',
    mission: 'orange',
    training: 'teal'
  }
  return colors[type] || 'grey'
}

const getTypeLabel = (type) => {
  const labels = {
    funding: 'Financement',
    job: 'Emploi',
    partnership: 'Partenariat',
    mission: 'Mission',
    training: 'Formation'
  }
  return labels[type] || type
}

const getStatusColor = (status) => {
  const colors = {
    published: 'green',
    draft: 'grey',
    expired: 'orange',
    suspended: 'red'
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = {
    published: 'Publiée',
    draft: 'Brouillon',
    expired: 'Expirée',
    suspended: 'Suspendue'
  }
  return labels[status] || status
}

const getDeadlineClass = (deadline) => {
  const now = new Date()
  const deadlineDate = new Date(deadline)
  const diffDays = Math.ceil((deadlineDate - now) / (1000 * 60 * 60 * 24))

  if (diffDays < 0) return 'text-red'
  if (diffDays <= 7) return 'text-orange'
  return 'text-green'
}

const formatAmount = (amount) => {
  return new Intl.NumberFormat('fr-FR').format(amount) + ' XOF'
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

// Lifecycle
onMounted(() => {
  loadOpportunities()
})
</script>

<style scoped>
.admin-opportunities-manager {
  min-height: 100vh;
}
</style>
