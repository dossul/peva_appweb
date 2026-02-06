<template>
  <div class="my-companies-view">
    <!-- Hero Banner -->
    <div class="hero-banner text-white py-8">
      <v-container>
        <div class="d-flex align-center justify-space-between flex-wrap ga-4">
          <div class="d-flex align-center">
            <v-icon size="48" class="mr-4">mdi-domain</v-icon>
            <div>
              <h1 class="text-h4 font-weight-bold mb-1">Mes Entreprises</h1>
              <p class="text-body-1 ma-0 opacity-90">
                Gérez vos entreprises et leurs déclarations ESG
              </p>
            </div>
          </div>
          <div class="d-flex ga-2">
            <v-btn color="white" variant="outlined" @click="showClaimDialog = true">
              <v-icon start>mdi-hand-pointing-right</v-icon>
              Réclamer une entreprise
            </v-btn>
            <v-btn color="white" variant="flat" class="text-teal" @click="showCreateDialog = true">
              <v-icon start>mdi-plus</v-icon>
              Créer une entreprise
            </v-btn>
          </div>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <!-- Stats rapides -->
      <v-row class="mb-6">
        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-4 text-center" color="teal-lighten-5">
            <v-icon size="32" color="teal" class="mb-2">mdi-domain</v-icon>
            <div class="text-h4 font-weight-bold text-teal">{{ myCompanies.length }}</div>
            <div class="text-body-2 text-grey-darken-1">Entreprises</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-4 text-center" color="orange-lighten-5">
            <v-icon size="32" color="orange" class="mb-2">mdi-clock-outline</v-icon>
            <div class="text-h4 font-weight-bold text-orange">{{ pendingClaims.length }}</div>
            <div class="text-body-2 text-grey-darken-1">Demandes en cours</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-4 text-center" color="green-lighten-5">
            <v-icon size="32" color="green" class="mb-2">mdi-check-circle</v-icon>
            <div class="text-h4 font-weight-bold text-green">{{ approvedClaims.length }}</div>
            <div class="text-body-2 text-grey-darken-1">Claims approuvés</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-4 text-center" color="blue-lighten-5">
            <v-icon size="32" color="blue" class="mb-2">mdi-file-document-edit</v-icon>
            <div class="text-h4 font-weight-bold text-blue">{{ totalDeclarations }}</div>
            <div class="text-body-2 text-grey-darken-1">Déclarations</div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Onglets -->
      <v-tabs v-model="activeTab" color="teal" class="mb-6">
        <v-tab value="companies">
          <v-icon start>mdi-domain</v-icon>
          Mes entreprises
          <v-chip v-if="myCompanies.length" size="small" class="ml-2" color="teal">
            {{ myCompanies.length }}
          </v-chip>
        </v-tab>
        <v-tab value="claims">
          <v-icon start>mdi-hand-pointing-right</v-icon>
          Mes demandes
          <v-chip v-if="pendingClaims.length" size="small" class="ml-2" color="orange">
            {{ pendingClaims.length }}
          </v-chip>
        </v-tab>
      </v-tabs>

      <v-window v-model="activeTab">
        <!-- Tab: Mes Entreprises -->
        <v-window-item value="companies">
          <v-row v-if="loading">
            <v-col v-for="i in 3" :key="i" cols="12" md="6" lg="4">
              <v-skeleton-loader type="card" />
            </v-col>
          </v-row>

          <div v-else-if="myCompanies.length === 0" class="text-center py-12">
            <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-domain-off</v-icon>
            <h3 class="text-h5 text-grey-darken-1 mb-2">Aucune entreprise</h3>
            <p class="text-body-1 text-grey mb-4">
              Vous n'avez pas encore d'entreprise attribuée.<br>
              Réclamez une entreprise existante ou créez-en une nouvelle.
            </p>
            <div class="d-flex justify-center ga-2">
              <v-btn color="teal" variant="outlined" @click="showClaimDialog = true">
                <v-icon start>mdi-hand-pointing-right</v-icon>
                Réclamer une entreprise
              </v-btn>
              <v-btn color="teal" @click="showCreateDialog = true">
                <v-icon start>mdi-plus</v-icon>
                Créer une entreprise
              </v-btn>
            </div>
          </div>

          <v-row v-else>
            <v-col v-for="company in myCompanies" :key="company.id" cols="12" md="6" lg="4">
              <v-card class="company-card h-100" hover @click="openCompanyAdmin(company)">
                <!-- Cover image or placeholder -->
                <div class="company-cover" :style="{ background: getCompanyColor(company) }">
                  <v-avatar size="80" class="company-avatar" color="white">
                    <v-img v-if="company.logo_url" :src="company.logo_url" />
                    <span v-else class="text-h4 font-weight-bold" :style="{ color: getCompanyColor(company) }">
                      {{ company.name?.charAt(0) }}
                    </span>
                  </v-avatar>
                </div>

                <v-card-text class="pt-12 text-center">
                  <h3 class="text-h6 font-weight-bold mb-1">{{ company.name }}</h3>
                  <p class="text-body-2 text-grey mb-2">
                    <v-icon size="14" class="mr-1">mdi-map-marker</v-icon>
                    {{ company.city }}, {{ company.country }}
                  </p>
                  <v-chip size="small" :color="getSectorColor(company.industry)" class="mb-3">
                    {{ company.industry || 'Non spécifié' }}
                  </v-chip>

                  <!-- Stats de l'entreprise -->
                  <v-divider class="my-3" />
                  <div class="d-flex justify-space-around text-center">
                    <div>
                      <div class="text-h6 font-weight-bold text-teal">{{ company.employees || '-' }}</div>
                      <div class="text-caption text-grey">Employés</div>
                    </div>
                    <div>
                      <div class="text-h6 font-weight-bold text-blue">{{ company.declarations_count || 0 }}</div>
                      <div class="text-caption text-grey">Déclarations</div>
                    </div>
                    <div>
                      <v-icon :color="company.is_verified ? 'green' : 'grey'" size="24">
                        {{ company.is_verified ? 'mdi-check-decagram' : 'mdi-alert-circle-outline' }}
                      </v-icon>
                      <div class="text-caption text-grey">{{ company.is_verified ? 'Vérifié' : 'En attente' }}</div>
                    </div>
                  </div>
                </v-card-text>

                <v-card-actions class="pa-4 pt-0">
                  <v-btn color="teal" variant="flat" block @click.stop="openCompanyAdmin(company)">
                    <v-icon start>mdi-cog</v-icon>
                    Gérer l'entreprise
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
        </v-window-item>

        <!-- Tab: Mes Demandes -->
        <v-window-item value="claims">
          <v-card v-if="allClaims.length === 0" class="text-center py-12" variant="outlined">
            <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-file-document-outline</v-icon>
            <h3 class="text-h6 text-grey-darken-1 mb-2">Aucune demande</h3>
            <p class="text-body-2 text-grey mb-4">
              Vous n'avez soumis aucune demande de réclamation d'entreprise.
            </p>
            <v-btn color="teal" variant="outlined" @click="showClaimDialog = true">
              <v-icon start>mdi-hand-pointing-right</v-icon>
              Réclamer une entreprise
            </v-btn>
          </v-card>

          <v-list v-else lines="two" class="pa-0">
            <v-list-item
              v-for="claim in allClaims"
              :key="claim.id"
              class="mb-2 rounded-lg"
              :class="{
                'bg-orange-lighten-5': claim.status === 'pending',
                'bg-green-lighten-5': claim.status === 'approved',
                'bg-red-lighten-5': claim.status === 'rejected'
              }"
            >
              <template #prepend>
                <v-avatar size="48" :color="getStatusColor(claim.status)">
                  <v-icon color="white">{{ getStatusIcon(claim.status) }}</v-icon>
                </v-avatar>
              </template>

              <v-list-item-title class="font-weight-bold">
                {{ claim.company?.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                <span class="text-grey">Demandé le {{ formatDate(claim.created_at) }}</span>
                <span v-if="claim.position_in_company" class="ml-2">
                  • {{ claim.position_in_company }}
                </span>
              </v-list-item-subtitle>

              <template #append>
                <div class="d-flex align-center ga-2">
                  <v-chip :color="getStatusColor(claim.status)" size="small">
                    {{ getStatusLabel(claim.status) }}
                  </v-chip>
                  <v-btn
                    v-if="claim.status === 'pending'"
                    icon="mdi-close"
                    size="small"
                    variant="text"
                    color="red"
                    @click="cancelClaim(claim)"
                  />
                </div>
              </template>
            </v-list-item>
          </v-list>
        </v-window-item>
      </v-window>
    </v-container>

    <!-- Dialog: Réclamer une entreprise -->
    <v-dialog v-model="showClaimDialog" max-width="600">
      <v-card>
        <v-card-title class="d-flex align-center pa-4 bg-teal text-white">
          <v-icon class="mr-2">mdi-hand-pointing-right</v-icon>
          Réclamer une entreprise
        </v-card-title>

        <v-card-text class="pa-4">
          <!-- Recherche d'entreprise -->
          <v-autocomplete
            v-model="selectedCompanyToClaim"
            :items="availableCompanies"
            :loading="searchingCompanies"
            item-title="name"
            item-value="id"
            label="Rechercher une entreprise"
            placeholder="Tapez le nom de l'entreprise..."
            prepend-inner-icon="mdi-magnify"
            variant="outlined"
            return-object
            class="mb-4"
            @update:search="searchCompanies"
          >
            <template #item="{ item, props }">
              <v-list-item v-bind="props">
                <template #prepend>
                  <v-avatar size="40" color="teal-lighten-4">
                    <v-img v-if="item.raw.logo_url" :src="item.raw.logo_url" />
                    <span v-else class="text-teal font-weight-bold">{{ item.raw.name?.charAt(0) }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                <v-list-item-subtitle>{{ item.raw.city }}, {{ item.raw.country }}</v-list-item-subtitle>
              </v-list-item>
            </template>
          </v-autocomplete>

          <v-expand-transition>
            <div v-if="selectedCompanyToClaim">
              <v-alert type="info" variant="tonal" class="mb-4">
                <div class="d-flex align-center">
                  <v-avatar size="48" class="mr-3" color="teal-lighten-4">
                    <span class="text-teal font-weight-bold">{{ selectedCompanyToClaim.name?.charAt(0) }}</span>
                  </v-avatar>
                  <div>
                    <div class="font-weight-bold">{{ selectedCompanyToClaim.name }}</div>
                    <div class="text-body-2">{{ selectedCompanyToClaim.city }}, {{ selectedCompanyToClaim.country }}</div>
                  </div>
                </div>
              </v-alert>

              <v-text-field
                v-model="claimForm.position"
                label="Votre poste dans l'entreprise"
                placeholder="Ex: Directeur RSE, Responsable environnement..."
                variant="outlined"
                class="mb-4"
              />

              <v-textarea
                v-model="claimForm.message"
                label="Message de justification"
                placeholder="Expliquez pourquoi vous réclamez cette entreprise..."
                variant="outlined"
                rows="3"
                class="mb-4"
              />

              <v-alert type="warning" variant="tonal" density="compact">
                <v-icon start>mdi-information</v-icon>
                Votre demande sera examinée par un administrateur. Vous recevrez un email de confirmation.
              </v-alert>
            </div>
          </v-expand-transition>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="showClaimDialog = false">Annuler</v-btn>
          <v-btn
            color="teal"
            :disabled="!selectedCompanyToClaim || !claimForm.message"
            :loading="submittingClaim"
            @click="submitClaim"
          >
            <v-icon start>mdi-send</v-icon>
            Envoyer la demande
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Créer une entreprise -->
    <v-dialog v-model="showCreateDialog" max-width="600">
      <v-card>
        <v-card-title class="d-flex align-center pa-4 bg-teal text-white">
          <v-icon class="mr-2">mdi-plus</v-icon>
          Créer une entreprise
        </v-card-title>

        <v-card-text class="pa-4">
          <v-text-field
            v-model="createForm.name"
            label="Nom de l'entreprise *"
            variant="outlined"
            class="mb-4"
          />
          
          <v-select
            v-model="createForm.sector"
            :items="sectors"
            label="Secteur d'activité *"
            variant="outlined"
            class="mb-4"
          />

          <v-row>
            <v-col cols="6">
              <v-select
                v-model="createForm.country"
                :items="countries"
                label="Pays *"
                variant="outlined"
              />
            </v-col>
            <v-col cols="6">
              <v-text-field
                v-model="createForm.city"
                label="Ville *"
                variant="outlined"
              />
            </v-col>
          </v-row>

          <v-textarea
            v-model="createForm.description"
            label="Description"
            variant="outlined"
            rows="3"
          />
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="showCreateDialog = false">Annuler</v-btn>
          <v-btn
            color="teal"
            :disabled="!createForm.name || !createForm.sector || !createForm.country || !createForm.city"
            :loading="creatingCompany"
            @click="createCompany"
          >
            <v-icon start>mdi-check</v-icon>
            Créer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" timeout="4000">
      {{ snackbarMessage }}
      <template #actions>
        <v-btn variant="text" @click="showSnackbar = false">Fermer</v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { claimService } from '@/services/claimService'
import companyService from '@/services/companyService'
import { getSectorNames } from '@/services/sectorsService'

const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(true)
const activeTab = ref('companies')
const myCompanies = ref([])
const allClaims = ref([])
const totalDeclarations = ref(0)

// Dialogs
const showClaimDialog = ref(false)
const showCreateDialog = ref(false)

// Claim form
const selectedCompanyToClaim = ref(null)
const availableCompanies = ref([])
const searchingCompanies = ref(false)
const submittingClaim = ref(false)
const claimForm = ref({
  position: '',
  message: ''
})

// Create form
const sectors = ref([])
const countries = ref(['Burkina Faso', 'Côte d\'Ivoire', 'Mali', 'Niger', 'Sénégal', 'Bénin', 'Togo', 'Ghana'])
const creatingCompany = ref(false)
const createForm = ref({
  name: '',
  sector: '',
  country: 'Burkina Faso',
  city: '',
  description: ''
})

// Snackbar
const showSnackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Computed
const pendingClaims = computed(() => allClaims.value.filter(c => c.status === 'pending'))
const approvedClaims = computed(() => allClaims.value.filter(c => c.status === 'approved'))

// Methods
const loadData = async () => {
  if (!authStore.user?.id) return
  
  loading.value = true
  try {
    // Charger mes entreprises
    myCompanies.value = await claimService.getUserCompanies(authStore.user.id)
    
    // Charger mes claims
    allClaims.value = await claimService.getUserClaims(authStore.user.id)
    
    // Charger les secteurs
    sectors.value = await getSectorNames()
  } catch (error) {
    console.error('Erreur chargement données:', error)
    showMessage('Erreur lors du chargement des données', 'error')
  } finally {
    loading.value = false
  }
}

const searchCompanies = async (search) => {
  if (!search || search.length < 2) {
    availableCompanies.value = []
    return
  }
  
  searchingCompanies.value = true
  try {
    const results = await companyService.searchSimilarCompanies(search)
    // Filtrer les entreprises qui n'ont pas de claimed_by
    availableCompanies.value = results.filter(c => !c.claimed_by && c.owner_id !== authStore.user?.id)
  } catch (error) {
    console.error('Erreur recherche:', error)
  } finally {
    searchingCompanies.value = false
  }
}

const submitClaim = async () => {
  if (!selectedCompanyToClaim.value) return
  
  submittingClaim.value = true
  try {
    const result = await claimService.submitClaim({
      companyId: selectedCompanyToClaim.value.id,
      userId: authStore.user.id,
      message: claimForm.value.message,
      position: claimForm.value.position
    })
    
    if (result.success) {
      showMessage(result.message, 'success')
      showClaimDialog.value = false
      resetClaimForm()
      await loadData()
    } else {
      showMessage(result.error, 'error')
    }
  } catch (error) {
    showMessage(error.message, 'error')
  } finally {
    submittingClaim.value = false
  }
}

const cancelClaim = async (claim) => {
  if (!confirm('Voulez-vous vraiment annuler cette demande ?')) return
  
  try {
    const result = await claimService.cancelClaim(claim.id, authStore.user.id)
    if (result.success) {
      showMessage('Demande annulée', 'success')
      await loadData()
    } else {
      showMessage(result.error, 'error')
    }
  } catch (error) {
    showMessage(error.message, 'error')
  }
}

const createCompany = async () => {
  creatingCompany.value = true
  try {
    const result = await companyService.createCompany({
      ...createForm.value,
      owner_id: authStore.user.id,
      industry: createForm.value.sector,
      status: 'draft'
    })
    
    showMessage('Entreprise créée avec succès !', 'success')
    showCreateDialog.value = false
    resetCreateForm()
    await loadData()
  } catch (error) {
    showMessage(error.message, 'error')
  } finally {
    creatingCompany.value = false
  }
}

const openCompanyAdmin = (company) => {
  router.push({ name: 'CompanyAdmin', params: { id: company.id } })
}

const resetClaimForm = () => {
  selectedCompanyToClaim.value = null
  claimForm.value = { position: '', message: '' }
}

const resetCreateForm = () => {
  createForm.value = { name: '', sector: '', country: 'Burkina Faso', city: '', description: '' }
}

const showMessage = (message, color = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  showSnackbar.value = true
}

const getCompanyColor = (company) => {
  const colors = ['#0d9488', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444', '#10b981']
  const index = company.name?.charCodeAt(0) % colors.length
  return colors[index]
}

const getSectorColor = (sector) => {
  const colors = {
    'Agriculture et agroalimentaire': 'green',
    'Énergies renouvelables': 'amber',
    'Gestion des déchets': 'brown',
    'Construction durable': 'blue-grey',
    'Eau et assainissement': 'blue'
  }
  return colors[sector] || 'grey'
}

const getStatusColor = (status) => {
  const colors = { pending: 'orange', approved: 'green', rejected: 'red' }
  return colors[status] || 'grey'
}

const getStatusIcon = (status) => {
  const icons = { pending: 'mdi-clock-outline', approved: 'mdi-check', rejected: 'mdi-close' }
  return icons[status] || 'mdi-help'
}

const getStatusLabel = (status) => {
  const labels = { pending: 'En attente', approved: 'Approuvé', rejected: 'Rejeté' }
  return labels[status] || status
}

const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(loadData)
</script>

<style scoped>
.hero-banner {
  background: linear-gradient(135deg, #0d9488 0%, #14b8a6 100%);
}

.company-card {
  position: relative;
  overflow: visible;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.company-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
}

.company-cover {
  height: 80px;
  position: relative;
}

.company-avatar {
  position: absolute;
  bottom: -40px;
  left: 50%;
  transform: translateX(-50%);
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>
