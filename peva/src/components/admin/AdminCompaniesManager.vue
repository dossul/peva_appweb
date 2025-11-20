<template>
  <div class="admin-companies-manager">
    <!-- En-tête avec actions -->
    <div class="d-flex align-center justify-space-between mb-6">
      <div>
        <h2 class="text-h5 font-weight-bold">Gestion des Entreprises</h2>
        <p class="text-body-2 text-grey-darken-1">{{ totalCompanies }} entreprises enregistrées</p>
      </div>
      <div class="d-flex align-center ga-2">
        <v-btn color="green" prepend-icon="mdi-domain-plus" @click="openCreateDialog">
          Nouvelle entreprise
        </v-btn>
        <v-btn color="blue" prepend-icon="mdi-export" @click="exportCompanies">
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
              label="Rechercher une entreprise"
              prepend-inner-icon="mdi-magnify"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filterIndustry"
              :items="industryOptions"
              label="Secteur"
              variant="outlined"
              density="compact"
              hide-details
            />
          </v-col>
          <v-col cols="12" md="2">
            <v-select
              v-model="filterSize"
              :items="sizeOptions"
              label="Taille"
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

    <!-- Tableau des entreprises -->
    <v-card elevation="2">
      <v-data-table
        :headers="headers"
        :items="filteredCompanies"
        :loading="loading"
        :items-per-page="itemsPerPage"
        :search="searchQuery"
        class="elevation-0"
      >
        <!-- Logo et nom -->
        <template #item.company="{ item }">
          <div class="d-flex align-center py-2">
            <v-avatar size="40" class="mr-3">
              <v-img
                v-if="item.logo_url"
                :src="item.logo_url"
                :alt="item.name"
              />
              <v-icon v-else>mdi-domain</v-icon>
            </v-avatar>
            <div>
              <div class="font-weight-medium">{{ item.name }}</div>
              <div class="text-caption text-grey-darken-1">{{ item.slug }}</div>
            </div>
          </div>
        </template>

        <!-- Secteur avec badge -->
        <template #item.industry="{ item }">
          <v-chip
            color="blue"
            size="small"
            variant="tonal"
          >
            {{ item.industry }}
          </v-chip>
        </template>

        <!-- Taille -->
        <template #item.size="{ item }">
          <v-chip
            :color="getSizeColor(item.size)"
            size="small"
            variant="flat"
          >
            {{ getSizeLabel(item.size) }}
          </v-chip>
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

        <!-- Propriétaire -->
        <template #item.owner="{ item }">
          <div v-if="item.owner" class="text-body-2">
            {{ item.owner.first_name }} {{ item.owner.last_name }}
          </div>
          <div v-else class="text-caption text-grey">Non défini</div>
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
            <v-tooltip text="Voir la fiche">
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  icon="mdi-eye"
                  size="small"
                  variant="text"
                  @click="viewCompany(item)"
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
                  @click="editCompany(item)"
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
                  @click="deleteCompany(item)"
                />
              </template>
            </v-tooltip>
          </div>
        </template>
      </v-data-table>
    </v-card>

    <!-- Dialog de création/modification -->
    <v-dialog v-model="companyDialog" max-width="900px" persistent>
      <v-card>
        <v-card-title class="text-h6 font-weight-bold">
          {{ editingCompany ? 'Modifier l\'entreprise' : 'Nouvelle entreprise' }}
        </v-card-title>
        
        <v-card-text>
          <v-form ref="companyForm" v-model="formValid">
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="companyFormData.name"
                  label="Nom de l'entreprise"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="companyFormData.slug"
                  label="Slug (URL)"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="companyFormData.description"
                  label="Description"
                  :rules="[rules.required]"
                  rows="3"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="companyFormData.industry"
                  :items="industryList"
                  label="Secteur d'activité"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-select
                  v-model="companyFormData.size"
                  :items="sizeList"
                  label="Taille de l'entreprise"
                  :rules="[rules.required]"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="companyFormData.headquarters"
                  label="Siège social"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="companyFormData.country"
                  label="Pays"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="companyFormData.website"
                  label="Site web"
                  type="url"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="companyFormData.email"
                  label="Email de contact"
                  type="email"
                  variant="outlined"
                />
              </v-col>
              <v-col cols="12">
                <v-textarea
                  v-model="companyFormData.mission"
                  label="Mission"
                  rows="2"
                  variant="outlined"
                />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn color="grey" variant="text" @click="closeCompanyDialog">
            Annuler
          </v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="saving"
            :disabled="!formValid"
            @click="saveCompany"
          >
            {{ editingCompany ? 'Modifier' : 'Créer' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de confirmation de suppression -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h6">Confirmer la suppression</v-card-title>
        <v-card-text>
          Êtes-vous sûr de vouloir supprimer l'entreprise 
          <strong>{{ companyToDelete?.name }}</strong> ?
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
const companies = ref([])
const loading = ref(false)
const saving = ref(false)
const searchQuery = ref('')
const filterIndustry = ref('all')
const filterSize = ref('all')
const filterStatus = ref('all')
const filterCountry = ref('all')
const itemsPerPage = ref(25)

// Dialogs
const companyDialog = ref(false)
const deleteDialog = ref(false)
const editingCompany = ref(null)
const companyToDelete = ref(null)
const formValid = ref(false)

// Données du formulaire
const companyFormData = ref({
  name: '',
  slug: '',
  description: '',
  industry: '',
  size: '',
  headquarters: '',
  country: 'Burkina Faso',
  website: '',
  email: '',
  mission: ''
})

// Options pour les filtres
const industryOptions = ref([
  { title: 'Tous les secteurs', value: 'all' },
  { title: 'Énergie Solaire', value: 'Énergie Solaire' },
  { title: 'Agriculture Durable', value: 'Agriculture Durable' },
  { title: 'Gestion de l\'Eau', value: 'Gestion de l\'Eau' },
  { title: 'Mines Responsables', value: 'Mines Responsables' },
  { title: 'Écotourisme', value: 'Écotourisme' },
  { title: 'Élevage Durable', value: 'Élevage Durable' },
  { title: 'Artisanat Vert', value: 'Artisanat Vert' },
  { title: 'Transport Écologique', value: 'Transport Écologique' }
])

const industryList = computed(() => 
  industryOptions.value.filter(item => item.value !== 'all')
)

const sizeOptions = [
  { title: 'Toutes les tailles', value: 'all' },
  { title: 'Startup', value: 'Startup' },
  { title: 'PME', value: 'PME' },
  { title: 'Moyenne', value: 'Moyenne' },
  { title: 'Grande', value: 'Grande' },
  { title: 'Coopérative', value: 'Coopérative' }
]

const sizeList = computed(() => 
  sizeOptions.filter(item => item.value !== 'all')
)

const statusOptions = [
  { title: 'Tous les statuts', value: 'all' },
  { title: 'Publiée', value: 'published' },
  { title: 'Brouillon', value: 'draft' },
  { title: 'En révision', value: 'pending' },
  { title: 'Suspendue', value: 'suspended' }
]

const countryOptions = [
  { title: 'Tous les pays', value: 'all' },
  { title: 'Burkina Faso', value: 'Burkina Faso' }
]

// En-têtes du tableau
const headers = [
  { title: 'Entreprise', key: 'company', sortable: false },
  { title: 'Secteur', key: 'industry' },
  { title: 'Taille', key: 'size' },
  { title: 'Pays', key: 'country' },
  { title: 'Propriétaire', key: 'owner', sortable: false },
  { title: 'Statut', key: 'status' },
  { title: 'Créée le', key: 'created_at' },
  { title: 'Actions', key: 'actions', sortable: false }
]

// Règles de validation
const rules = {
  required: value => !!value || 'Ce champ est requis'
}

// Computed
const totalCompanies = computed(() => companies.value.length)

const filteredCompanies = computed(() => {
  let filtered = companies.value

  if (filterIndustry.value !== 'all') {
    filtered = filtered.filter(company => company.industry === filterIndustry.value)
  }

  if (filterSize.value !== 'all') {
    filtered = filtered.filter(company => company.size === filterSize.value)
  }

  if (filterStatus.value !== 'all') {
    filtered = filtered.filter(company => company.status === filterStatus.value)
  }

  if (filterCountry.value !== 'all') {
    filtered = filtered.filter(company => company.country === filterCountry.value)
  }

  return filtered
})

// Méthodes
const loadCompanies = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('companies')
      .select(`
        *,
        owner:profiles(first_name, last_name, email)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error
    companies.value = data || []
  } catch (error) {
    console.error('Erreur lors du chargement des entreprises:', error)
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  filterIndustry.value = 'all'
  filterSize.value = 'all'
  filterStatus.value = 'all'
  filterCountry.value = 'all'
}

const openCreateDialog = () => {
  editingCompany.value = null
  companyFormData.value = {
    name: '',
    slug: '',
    description: '',
    industry: '',
    size: '',
    headquarters: '',
    country: 'Burkina Faso',
    website: '',
    email: '',
    mission: ''
  }
  companyDialog.value = true
}

const editCompany = (company) => {
  editingCompany.value = company
  companyFormData.value = { ...company }
  companyDialog.value = true
}

const closeCompanyDialog = () => {
  companyDialog.value = false
  editingCompany.value = null
}

const saveCompany = async () => {
  if (!formValid.value) return

  saving.value = true
  try {
    if (editingCompany.value) {
      // Modification
      const { data, error } = await dataService.updateCompany(
        editingCompany.value.id, 
        companyFormData.value
      )
      if (error) throw error
      
      // Mettre à jour localement
      const index = companies.value.findIndex(c => c.id === editingCompany.value.id)
      if (index !== -1) {
        companies.value[index] = { ...companies.value[index], ...data }
      }
    } else {
      // Création
      const { data, error } = await dataService.createCompany(companyFormData.value)
      if (error) throw error
      
      companies.value.unshift(data)
    }

    closeCompanyDialog()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  } finally {
    saving.value = false
  }
}

const viewCompany = (company) => {
  window.open(`/companies/${company.slug}`, '_blank')
}

const toggleStatus = async (company) => {
  try {
    const newStatus = company.status === 'published' ? 'suspended' : 'published'
    const { error } = await supabase
      .from('companies')
      .update({ status: newStatus })
      .eq('id', company.id)

    if (error) throw error

    company.status = newStatus
  } catch (error) {
    console.error('Erreur lors de la modification du statut:', error)
  }
}

const deleteCompany = (company) => {
  companyToDelete.value = company
  deleteDialog.value = true
}

const confirmDelete = async () => {
  try {
    await dataService.deleteCompany(companyToDelete.value.id)

    const index = companies.value.findIndex(c => c.id === companyToDelete.value.id)
    if (index !== -1) {
      companies.value.splice(index, 1)
    }

    deleteDialog.value = false
    companyToDelete.value = null
  } catch (error) {
    console.error('Erreur lors de la suppression:', error)
  }
}

const exportCompanies = () => {
  const csvContent = "data:text/csv;charset=utf-8," 
    + "Nom,Secteur,Taille,Pays,Statut,Créée le\n"
    + companies.value.map(company => 
        `"${company.name}","${company.industry}","${company.size}","${company.country}","${company.status}","${formatDate(company.created_at)}"`
      ).join("\n")

  const encodedUri = encodeURI(csvContent)
  const link = document.createElement("a")
  link.setAttribute("href", encodedUri)
  link.setAttribute("download", `entreprises_peva_${new Date().toISOString().split('T')[0]}.csv`)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Utilitaires
const getSizeColor = (size) => {
  const colors = {
    'Startup': 'purple',
    'PME': 'blue',
    'Moyenne': 'green',
    'Grande': 'orange',
    'Coopérative': 'teal'
  }
  return colors[size] || 'grey'
}

const getSizeLabel = (size) => size

const getStatusColor = (status) => {
  const colors = {
    published: 'green',
    draft: 'grey',
    pending: 'orange',
    suspended: 'red'
  }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = {
    published: 'Publiée',
    draft: 'Brouillon',
    pending: 'En révision',
    suspended: 'Suspendue'
  }
  return labels[status] || status
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('fr-FR')
}

// Lifecycle
onMounted(() => {
  loadCompanies()
})
</script>

<style scoped>
.admin-companies-manager {
  min-height: 100vh;
}
</style>
