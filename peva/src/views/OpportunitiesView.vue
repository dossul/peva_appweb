<template>
  <div class="opportunities-view" data-testid="opportunities-page">
    <!-- Header avec bannière -->
    <div class="hero-banner bg-indigo-darken-2 text-white py-8">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon size="48" class="mr-4">mdi-briefcase-search</v-icon>
            <div>
              <h1 class="text-h3 font-weight-bold mb-2">Place de Marché des Opportunités</h1>
              <p class="text-h6 font-weight-regular ma-0">Découvrez des opportunités de financement, emploi et partenariats</p>
            </div>
          </div>
          <v-btn
            color="white"
            variant="flat"
            size="large"
            prepend-icon="mdi-plus"
            class="text-indigo-darken-2"
            @click="$router.push('/opportunities/create')"
            data-testid="create-opportunity-btn"
          >
            Publier une opportunité
          </v-btn>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <v-row>
        <!-- Sidebar Filtres -->
        <v-col cols="12" md="3">
          <v-card elevation="2" class="sticky-filters">
            <v-card-title class="pa-4">
              <v-icon class="mr-2">mdi-filter</v-icon>
              Filtres
            </v-card-title>
            <v-card-text class="pa-4">
              <!-- Recherche -->
              <div class="mb-4">
                <v-text-field
                  v-model="searchQuery"
                  placeholder="ex: financement, développeur, CI..."
                  prepend-inner-icon="mdi-magnify"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </div>

              <!-- Type d'opportunité -->
              <div class="mb-4">
                <h4 class="text-body-1 font-weight-bold mb-2">Type d'opportunité</h4>
                <v-checkbox
                  v-for="type in opportunityTypes"
                  :key="type"
                  v-model="selectedTypes"
                  :value="type"
                  :label="type"
                  density="compact"
                  hide-details
                  class="mb-1"
                />
              </div>

              <!-- Secteurs -->
              <div class="mb-4">
                <h4 class="text-body-1 font-weight-bold mb-2">Secteurs</h4>
                <v-checkbox
                  v-for="sector in sectors"
                  :key="sector"
                  v-model="selectedSectors"
                  :value="sector"
                  :label="sector"
                  density="compact"
                  hide-details
                  class="mb-1"
                />
              </div>

              <!-- Localisation -->
              <div class="mb-4">
                <h4 class="text-body-1 font-weight-bold mb-2">Localisation</h4>
                <v-select
                  v-model="selectedLocation"
                  :items="locations"
                  label="Toutes les localisations"
                  variant="outlined"
                  density="compact"
                  hide-details
                />
              </div>

              <!-- Montant -->
              <div class="mb-4">
                <h4 class="text-body-1 font-weight-bold mb-2">Montant</h4>
                <v-row>
                  <v-col cols="6">
                    <v-text-field
                      v-model="minAmount"
                      label="Min"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>
                  <v-col cols="6">
                    <v-text-field
                      v-model="maxAmount"
                      label="Max"
                      variant="outlined"
                      density="compact"
                      hide-details
                    />
                  </v-col>
                </v-row>
              </div>

              <v-btn
                color="green-darken-2"
                variant="flat"
                block
                prepend-icon="mdi-filter"
                @click="applyFilters"
              >
                Appliquer les filtres
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Contenu principal -->
        <v-col cols="12" md="9">
          <!-- Barre d'info et tri -->
          <div class="d-flex align-center justify-space-between mb-4">
            <div class="text-body-1">
              <strong>{{ filteredOpportunities.length }}</strong> opportunités trouvées
            </div>
            <v-select
              v-model="sortBy"
              :items="sortOptions"
              label="Trier par pertinence"
              variant="outlined"
              density="compact"
              hide-details
              style="max-width: 200px;"
            />
          </div>

          <!-- Liste des opportunités -->
          <div class="opportunities-list">
            <v-card
              v-for="opportunity in paginatedOpportunities"
              :key="opportunity.id"
              class="mb-4 opportunity-card"
              :class="{ 'premium-card': opportunity.promote_premium }"
              elevation="2"
              hover
            >
              <v-card-text class="pa-4">
                <div class="d-flex align-start justify-space-between">
                  <div class="flex-grow-1">
                    <!-- Header avec badges -->
                    <div class="d-flex align-center mb-2">
                      <v-chip
                        v-if="opportunity.promote_premium"
                        color="amber-darken-2"
                        variant="flat"
                        size="small"
                        class="mr-2 font-weight-bold"
                        prepend-icon="mdi-star"
                      >
                        À la une
                      </v-chip>
                      <v-chip
                        :color="getTypeColor(opportunity.type)"
                        size="small"
                        class="mr-2"
                      >
                        {{ opportunity.type }}
                      </v-chip>
                      <v-chip
                        v-if="opportunity.urgent"
                        color="red"
                        size="small"
                        class="mr-2"
                      >
                        Urgent
                      </v-chip>
                    </div>

                    <!-- Titre et description -->
                    <h3 class="text-h6 font-weight-bold mb-2">{{ opportunity.title }}</h3>
                    <p class="text-body-2 text-grey-darken-1 mb-3">{{ opportunity.description }}</p>

                    <!-- Détails -->
                    <div class="d-flex align-center flex-wrap ga-4 mb-3">
                      <div class="d-flex align-center">
                        <v-icon size="16" class="mr-1">mdi-currency-eur</v-icon>
                        <span class="text-body-2">{{ opportunity.amount }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
                        <span class="text-body-2">{{ opportunity.location }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <v-icon size="16" class="mr-1">mdi-calendar</v-icon>
                        <span class="text-body-2">Deadline: {{ opportunity.deadline }}</span>
                      </div>
                      <div class="d-flex align-center">
                        <v-icon size="16" class="mr-1">mdi-account-multiple</v-icon>
                        <span class="text-body-2">{{ opportunity.candidates }} candidatures</span>
                      </div>
                    </div>

                    <!-- Status et entreprise -->
                    <div class="d-flex align-center">
                      <v-avatar size="24" class="mr-2" :color="opportunity.companyColor">
                        <span class="text-white text-caption">{{ opportunity.companyInitials }}</span>
                      </v-avatar>
                      <span class="text-body-2 mr-2">{{ opportunity.company }}</span>
                      <v-chip
                        :color="opportunity.statusColor"
                        size="x-small"
                      >
                        {{ opportunity.status }}
                      </v-chip>
                      <span class="text-body-2 text-grey-darken-1 ml-2">{{ opportunity.timeAgo }}</span>
                    </div>

                    <!-- Tags -->
                    <div class="mt-3">
                      <v-chip
                        v-for="tag in opportunity.tags"
                        :key="tag"
                        size="small"
                        variant="outlined"
                        class="mr-1 mb-1"
                      >
                        {{ tag }}
                      </v-chip>
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="ml-4 d-flex flex-column ga-2">
                    <v-btn
                      color="primary"
                      size="small"
                      :disabled="opportunity.created_by === authStore.user?.id"
                      @click="applyToOpportunity(opportunity)"
                    >
                      {{ opportunity.created_by === authStore.user?.id ? 'Votre opportunité' : 'Postuler' }}
                    </v-btn>
                    <v-btn
                      variant="outlined"
                      size="small"
                      @click="viewDetails(opportunity)"
                    >
                      Détails
                    </v-btn>
                    <v-btn
                      icon
                      variant="text"
                      size="small"
                      @click="toggleFavorite(opportunity)"
                    >
                      <v-icon :color="opportunity.isFavorite ? 'red' : 'grey'">
                        {{ opportunity.isFavorite ? 'mdi-heart' : 'mdi-heart-outline' }}
                      </v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </div>

          <!-- Pagination -->
          <div class="d-flex align-center justify-space-between mt-6">
            <div class="text-body-2">
              Affichage de {{ startIndex }} à {{ endIndex }} sur {{ filteredOpportunities.length }} résultats
            </div>
            <v-pagination
              v-model="currentPage"
              :length="totalPages"
              :total-visible="5"
              @update:model-value="scrollToTop"
            />
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Dialog détails de l'opportunité -->
    <v-dialog v-model="showDetailsDialog" max-width="800" scrollable>
      <v-card v-if="selectedOpportunity">
        <v-card-title class="pa-4 bg-indigo-darken-2 text-white">
          <div class="d-flex align-center justify-space-between">
            <div>
              <h2 class="text-h5 font-weight-bold">{{ selectedOpportunity.title }}</h2>
              <p class="text-body-2 ma-0 mt-1">{{ selectedOpportunity.organization }}</p>
            </div>
            <v-btn icon variant="text" color="white" @click="showDetailsDialog = false">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </div>
        </v-card-title>

        <v-card-text class="pa-0">
          <div class="pa-4">
            <!-- Informations principales -->
            <v-row class="mb-4">
              <v-col cols="12" md="6">
                <div class="mb-3">
                  <h4 class="text-body-1 font-weight-bold mb-1">Type</h4>
                  <v-chip :color="getTypeColor(selectedOpportunity.type)" size="small">
                    {{ selectedOpportunity.type }}
                  </v-chip>
                </div>
                <div class="mb-3">
                  <h4 class="text-body-1 font-weight-bold mb-1">Secteur</h4>
                  <p class="text-body-2">{{ selectedOpportunity.sector }}</p>
                </div>
                <div class="mb-3">
                  <h4 class="text-body-1 font-weight-bold mb-1">Localisation</h4>
                  <p class="text-body-2">{{ selectedOpportunity.location }}</p>
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="mb-3" v-if="selectedOpportunity.amount">
                  <h4 class="text-body-1 font-weight-bold mb-1">Montant</h4>
                  <p class="text-body-2">{{ selectedOpportunity.amount }} {{ selectedOpportunity.currency }}</p>
                </div>
                <div class="mb-3" v-if="selectedOpportunity.deadline">
                  <h4 class="text-body-1 font-weight-bold mb-1">Date limite</h4>
                  <p class="text-body-2">{{ new Date(selectedOpportunity.deadline).toLocaleDateString('fr-FR') }}</p>
                </div>
                <div class="mb-3">
                  <h4 class="text-body-1 font-weight-bold mb-1">Contact</h4>
                  <p class="text-body-2">{{ selectedOpportunity.contact_email }}</p>
                  <p class="text-body-2" v-if="selectedOpportunity.contact_phone">{{ selectedOpportunity.contact_phone }}</p>
                </div>
                
                <div class="mb-3">
                  <h4 class="text-body-1 font-weight-bold mb-1">Visibilité</h4>
                  <v-chip 
                    :color="getVisibilityColor(selectedOpportunity.visibility)" 
                    size="small"
                  >
                    {{ getVisibilityLabel(selectedOpportunity.visibility) }}
                  </v-chip>
                  <v-chip 
                    v-if="selectedOpportunity.promote_premium"
                    color="purple" 
                    size="small"
                    class="ml-2"
                  >
                    Premium
                  </v-chip>
                </div>
              </v-col>
            </v-row>

            <!-- Description -->
            <div class="mb-4">
              <h4 class="text-body-1 font-weight-bold mb-2">Description</h4>
              <p class="text-body-2">{{ selectedOpportunity.description }}</p>
            </div>

            <!-- Exigences -->
            <div class="mb-4" v-if="selectedOpportunity.requirements">
              <h4 class="text-body-1 font-weight-bold mb-2">Exigences</h4>
              <p class="text-body-2">{{ selectedOpportunity.requirements }}</p>
            </div>

            <!-- Avantages -->
            <div class="mb-4" v-if="selectedOpportunity.benefits">
              <h4 class="text-body-1 font-weight-bold mb-2">Avantages</h4>
              <p class="text-body-2">{{ selectedOpportunity.benefits }}</p>
            </div>

            <!-- Fichiers joints -->
            <div class="mb-4" v-if="hasValidAttachments(selectedOpportunity.attachments)">
              <h4 class="text-body-1 font-weight-bold mb-2">Fichiers joints</h4>
              <v-list density="compact">
                <v-list-item
                  v-for="file in getParsedAttachments(selectedOpportunity.attachments)"
                  :key="file.url || file.filename || file.name"
                  :href="file.url || file.publicUrl"
                  target="_blank"
                  class="pa-2"
                  v-if="(file.name || file.filename) && file.size"
                >
                  <template v-slot:prepend>
                    <v-icon>{{ getFileIcon(file.type || file.mimeType) }}</v-icon>
                  </template>
                  <v-list-item-title>{{ file.filename || file.name || file.title }}</v-list-item-title>
                  <v-list-item-subtitle>{{ formatFileSize(file.size) }}</v-list-item-subtitle>
                  <template v-slot:append>
                    <v-icon>mdi-download</v-icon>
                  </template>
                </v-list-item>
              </v-list>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-btn
            v-if="authStore.isAuthenticated && selectedOpportunity?.created_by !== authStore.user?.id"
            variant="text"
            color="error"
            size="small"
            @click="openReportDialog(selectedOpportunity)"
          >
            <v-icon start size="small">mdi-flag</v-icon>
            Signaler
          </v-btn>
          <v-spacer />
          <v-btn variant="outlined" @click="showDetailsDialog = false">
            Fermer
          </v-btn>
          <v-btn
            color="secondary"
            variant="flat"
            :disabled="selectedOpportunity?.created_by === authStore.user?.id"
            @click="applyToOpportunity(selectedOpportunity)"
          >
            {{ selectedOpportunity?.created_by === authStore.user?.id ? 'Votre opportunité' : 'Postuler' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de signalement -->
    <ReportContentDialog
      v-model="reportDialog"
      target-type="opportunity"
      :target-id="opportunityToReport?.id || ''"
      :content-title="opportunityToReport?.title || ''"
      @reported="handleReported"
    />

    <!-- Dialog de candidature -->
    <v-dialog v-model="applyDialog" max-width="600" persistent>
      <v-card>
        <v-card-title class="d-flex align-center">
          <v-icon color="secondary" class="mr-2">mdi-file-document-edit</v-icon>
          Postuler à cette opportunité
        </v-card-title>
        <v-card-text>
          <p class="text-body-2 text-grey mb-4">
            <strong>{{ opportunityToApply?.title }}</strong>
          </p>
          
          <v-textarea
            v-model="applicationForm.cover_letter"
            label="Lettre de motivation"
            variant="outlined"
            rows="4"
            placeholder="Présentez-vous et expliquez pourquoi vous êtes intéressé(e)..."
            class="mb-3"
          />
          
          <v-file-input
            v-model="applicationForm.resumeFile"
            label="CV (PDF, DOC, DOCX)"
            variant="outlined"
            prepend-icon="mdi-file-document"
            accept=".pdf,.doc,.docx"
            hint="Max 5 MB"
            class="mb-3"
          />
          
          <v-file-input
            v-model="applicationForm.portfolioFile"
            label="Portfolio ou document complémentaire (optionnel)"
            variant="outlined"
            prepend-icon="mdi-folder-open"
            accept=".pdf,.doc,.docx,.zip"
            hint="Max 10 MB"
            class="mb-3"
          />
          
          <v-textarea
            v-model="applicationForm.applicant_notes"
            label="Notes additionnelles (optionnel)"
            variant="outlined"
            rows="2"
            placeholder="Informations supplémentaires..."
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="applyDialog = false" :disabled="submitting">
            Annuler
          </v-btn>
          <v-btn 
            color="secondary" 
            variant="flat" 
            @click="submitApplication"
            :loading="submitting"
          >
            Envoyer ma candidature
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar pour les messages -->
    <v-snackbar
      v-model="showSnackbar"
      :color="snackbarColor"
      :timeout="4000"
      location="top"
    >
      {{ snackbarMessage }}
      <template v-slot:actions>
        <v-btn variant="text" @click="showSnackbar = false">
          Fermer
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Indicateur de chargement -->
    <v-overlay v-model="loading" class="align-center justify-center">
      <v-progress-circular
        color="primary"
        indeterminate
        size="64"
      />
    </v-overlay>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { opportunitiesService } from '@/services/opportunitiesService'
import { emailService } from '@/services/emailService'
import { supabase } from '@/lib/supabase'
import ReportContentDialog from '@/components/ReportContentDialog.vue'

const router = useRouter()
const authStore = useAuthStore()

// État des données
const opportunities = ref([])
const loading = ref(false)
const stats = ref({})
const selectedOpportunity = ref(null)
const showDetailsDialog = ref(false)

// Candidature
const applyDialog = ref(false)
const opportunityToApply = ref(null)
const submitting = ref(false)

// Signalement
const reportDialog = ref(false)
const opportunityToReport = ref(null)
const applicationForm = ref({
  cover_letter: '',
  resumeFile: null,
  portfolioFile: null,
  applicant_notes: ''
})

// Reactive data
const searchQuery = ref('')
const selectedTypes = ref([])
const selectedSectors = ref([])
const selectedLocation = ref('')
const minAmount = ref('')
const maxAmount = ref('')
const sortBy = ref('Trier par pertinence')
const currentPage = ref(1)
const itemsPerPage = 10

// Snackbar pour les messages
const showSnackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Données dynamiques basées sur les vraies données
const opportunityTypes = computed(() => {
  // Types ciblés selon les besoins
  const targetTypes = [
    'Appels à projets',
    'Stages',
    'Thèses',
    'Found raising',
    'Emplois',
    'Vente et achats d\'équipements',
    'Vente et achats de matières',
    'Idées business'
  ]
  
  return targetTypes.map(type => {
    const count = opportunities.value.filter(o => 
      o.type?.toLowerCase() === type.toLowerCase() ||
      o.category?.toLowerCase().includes(type.toLowerCase())
    ).length
    return count > 0 ? `${type} (${count})` : type
  })
})

const sectors = computed(() => {
  const sectors = [...new Set(opportunities.value.map(o => o.category))]
  return sectors
})

const locations = computed(() => {
  const locations = [...new Set(opportunities.value.map(o => o.location))]
  return ['Toutes les localisations', ...locations]
})

const sortOptions = ['Trier par pertinence', 'Plus récent', 'Montant croissant', 'Montant décroissant', 'Deadline proche']

// Computed
const filteredOpportunities = computed(() => {
  let filtered = [...opportunities.value]

  // Filtre par recherche
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(opp => 
      opp.title.toLowerCase().includes(query) ||
      opp.description.toLowerCase().includes(query) ||
      opp.organization.toLowerCase().includes(query) ||
      opp.category.toLowerCase().includes(query)
    )
  }

  // Filtre par types
  if (selectedTypes.value.length > 0) {
    const types = selectedTypes.value.map(t => t.split(' (')[0].toLowerCase())
    filtered = filtered.filter(opp => types.includes(opp.type))
  }

  // Filtre par secteurs
  if (selectedSectors.value.length > 0) {
    filtered = filtered.filter(opp => selectedSectors.value.includes(opp.category))
  }

  // Filtre par localisation
  if (selectedLocation.value && selectedLocation.value !== 'Toutes les localisations') {
    filtered = filtered.filter(opp => opp.location.includes(selectedLocation.value))
  }

  // Filtre par montant
  if (minAmount.value) {
    filtered = filtered.filter(opp => opp.amount >= parseFloat(minAmount.value))
  }
  if (maxAmount.value) {
    filtered = filtered.filter(opp => opp.amount <= parseFloat(maxAmount.value))
  }

  // Tri
  if (sortBy.value === 'Trier par pertinence') {
    // Premium d'abord, puis par date
    filtered.sort((a, b) => {
      if (a.promote_premium && !b.promote_premium) return -1
      if (!a.promote_premium && b.promote_premium) return 1
      return new Date(b.created_at) - new Date(a.created_at)
    })
  } else if (sortBy.value === 'Plus récent') {
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  } else if (sortBy.value === 'Montant croissant') {
    filtered.sort((a, b) => (parseFloat(a.salary_min) || 0) - (parseFloat(b.salary_min) || 0))
  } else if (sortBy.value === 'Montant décroissant') {
    filtered.sort((a, b) => (parseFloat(b.salary_min) || 0) - (parseFloat(a.salary_min) || 0))
  } else if (sortBy.value === 'Deadline proche') {
    filtered.sort((a, b) => {
      if (!a.deadline) return 1
      if (!b.deadline) return -1
      return new Date(a.deadline) - new Date(b.deadline)
    })
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredOpportunities.value.length / itemsPerPage))

const paginatedOpportunities = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredOpportunities.value.slice(start, end)
})

const startIndex = computed(() => (currentPage.value - 1) * itemsPerPage + 1)
const endIndex = computed(() => Math.min(currentPage.value * itemsPerPage, filteredOpportunities.value.length))

// Charger les opportunités depuis Supabase
const loadOpportunities = async () => {
  loading.value = true
  try {
    const result = await opportunitiesService.getOpportunities()
    
    if (result.success) {
      opportunities.value = result.data.map(opp => ({
        ...opp,
        // Formatage pour l'affichage
        type: opp.type.charAt(0).toUpperCase() + opp.type.slice(1),
        amount: opp.salary_min && opp.salary_max ? `${opp.salary_min}-${opp.salary_max}€` : 
                opp.salary_min ? `${opp.salary_min}€+` : 'Non spécifié',
        deadline: opp.deadline ? new Date(opp.deadline).toLocaleDateString('fr-FR') : 'Non spécifié',
        candidates: opp.applications_count || 0,
        company: opp.title.split(' - ')[1] || 'PEVA',
        companyInitials: (opp.title.split(' - ')[1] || 'PEVA').split(' ').map(w => w[0]).join('').substring(0, 2),
        companyColor: getRandomColor(),
        status: getStatusLabel(opp.type),
        statusColor: getTypeColor(opp.type),
        timeAgo: getRelativeTime(opp.created_at),
        tags: [opp.category, opp.type.charAt(0).toUpperCase() + opp.type.slice(1)],
        urgent: opp.deadline && new Date(opp.deadline) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isFavorite: false // TODO: Récupérer depuis les favoris de l'utilisateur
      }))
      
      console.log('Opportunités chargées:', opportunities.value.length)
    } else {
      console.error('Erreur chargement opportunités:', result.error)
      showMessage('Erreur lors du chargement des opportunités', 'error')
    }
  } catch (error) {
    console.error('Erreur:', error)
    showMessage('Erreur lors du chargement des opportunités', 'error')
  } finally {
    loading.value = false
  }
}

// Methods
const getTypeColor = (type) => {
  const colors = {
    'appels à projets': 'blue',
    'stages': 'green',
    'thèses': 'purple',
    'found raising': 'orange',
    'emplois': 'teal',
    'vente et achats d\'équipements': 'indigo',
    'vente et achats de matières': 'pink',
    'idées business': 'amber',
    // Anciens types pour compatibilité
    'financement': 'blue',
    'emploi': 'green',
    'partenariat': 'purple',
    'mission': 'orange'
  }
  return colors[type?.toLowerCase()] || 'grey'
}

const getStatusLabel = (type) => {
  const labels = {
    'financement': 'Recherche investisseurs',
    'emploi': 'Recrutement actif',
    'partenariat': 'Recherche partenaires',
    'mission': 'Mission disponible'
  }
  return labels[type] || 'Actif'
}

const getRandomColor = () => {
  const colors = ['orange', 'blue', 'purple', 'green', 'red', 'teal']
  return colors[Math.floor(Math.random() * colors.length)]
}

const getRelativeTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInHours = Math.floor((now - date) / (1000 * 60 * 60))
  
  if (diffInHours < 24) {
    return `il y a ${diffInHours}h`
  } else {
    const diffInDays = Math.floor(diffInHours / 24)
    return `il y a ${diffInDays} jour${diffInDays > 1 ? 's' : ''}`
  }
}

const showMessage = (message, color = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  showSnackbar.value = true
}

const applyFilters = () => {
  currentPage.value = 1
  loadOpportunities()
}

const applyToOpportunity = async (opportunity) => {
  if (!authStore.isAuthenticated) {
    showMessage('Vous devez être connecté pour postuler', 'warning')
    return
  }
  
  // Vérifier si l'utilisateur est le créateur de l'opportunité
  if (opportunity.created_by === authStore.user?.id) {
    showMessage('Vous ne pouvez pas postuler à votre propre opportunité', 'info')
    return
  }

  try {
    const userId = authStore.user?.id
    
    // Vérifier si déjà postulé
    const { data: existing } = await supabase
      .from('pev_opportunity_applications')
      .select('id')
      .eq('opportunity_id', opportunity.id)
      .eq('user_id', userId)
      .single()

    if (existing) {
      showMessage('Vous avez déjà postulé à cette opportunité', 'info')
      return
    }

    // Ouvrir le dialog de candidature
    opportunityToApply.value = opportunity
    applicationForm.value = {
      cover_letter: '',
      resumeFile: null,
      portfolioFile: null,
      applicant_notes: ''
    }
    applyDialog.value = true
  } catch (error) {
    // Erreur vérification = pas de candidature existante, ouvrir le dialog
    opportunityToApply.value = opportunity
    applicationForm.value = {
      cover_letter: '',
      resumeFile: null,
      portfolioFile: null,
      applicant_notes: ''
    }
    applyDialog.value = true
  }
}

const submitApplication = async () => {
  if (!opportunityToApply.value) return
  
  submitting.value = true
  try {
    const userId = authStore.user?.id
    const opportunity = opportunityToApply.value
    
    // Utiliser le service avec upload
    const result = await opportunitiesService.applyToOpportunity(
      opportunity.id,
      {
        user_id: userId,
        cover_letter: applicationForm.value.cover_letter,
        applicant_notes: applicationForm.value.applicant_notes,
        status: 'pending'
      },
      applicationForm.value.resumeFile?.[0] || null,
      applicationForm.value.portfolioFile?.[0] || null
    )

    if (!result.success) throw new Error(result.error)

    // Envoyer email de confirmation au candidat
    try {
      const applicantEmail = authStore.user?.email
      const applicantName = `${authStore.user?.profile?.first_name || ''} ${authStore.user?.profile?.last_name || ''}`.trim() || 'Utilisateur'
      
      await emailService.sendTemplateEmail('application_sent', applicantEmail, {
        recipient_name: applicantName,
        opportunity_title: opportunity.title,
        company_name: opportunity.company || 'PEVA',
        action_url: `${window.location.origin}/user-dashboard`
      })
    } catch (emailError) {
      console.warn('Erreur envoi email candidature:', emailError)
    }

    // Envoyer email au créateur de l'opportunité
    try {
      const { data: creator } = await supabase
        .from('pev_profiles')
        .select('email, first_name, last_name')
        .eq('id', opportunity.created_by)
        .single()

      if (creator?.email) {
        const applicantName = `${authStore.user?.profile?.first_name || ''} ${authStore.user?.profile?.last_name || ''}`.trim()
        
        await emailService.sendTemplateEmail('application_received', creator.email, {
          recipient_name: `${creator.first_name} ${creator.last_name}`,
          applicant_name: applicantName,
          opportunity_title: opportunity.title,
          action_url: `${window.location.origin}/opportunities/${opportunity.id}/applications`
        })
      }
    } catch (emailError) {
      console.warn('Erreur envoi email créateur:', emailError)
    }

    applyDialog.value = false
    showDetailsDialog.value = false
    showMessage('Candidature envoyée avec succès !', 'success')
  } catch (error) {
    console.error('Erreur candidature:', error)
    showMessage('Erreur lors de l\'envoi de la candidature: ' + error.message, 'error')
  } finally {
    submitting.value = false
  }
}

const viewDetails = async (opportunity) => {
  try {
    const result = await opportunitiesService.getOpportunityById(opportunity.id)
    if (result.success) {
      selectedOpportunity.value = result.data
      showDetailsDialog.value = true
    }
  } catch (error) {
    console.error('Erreur chargement détails:', error)
    showMessage('Erreur lors du chargement des détails', 'error')
  }
}

const toggleFavorite = async (opportunity) => {
  if (!authStore.isAuthenticated) {
    showMessage('Vous devez être connecté pour ajouter aux favoris', 'warning')
    return
  }

  try {
    const result = await opportunitiesService.toggleFavorite(opportunity.id)
    if (result.success) {
      opportunity.isFavorite = result.isFavorite
      showMessage(
        result.isFavorite ? 'Ajouté aux favoris' : 'Retiré des favoris',
        'success'
      )
    }
  } catch (error) {
    console.error('Erreur favori:', error)
    showMessage('Erreur lors de la gestion des favoris', 'error')
  }
}

const openReportDialog = (opportunity) => {
  opportunityToReport.value = opportunity
  reportDialog.value = true
}

const handleReported = () => {
  showMessage('Signalement envoyé. Notre équipe l\'examinera rapidement.', 'success')
  showDetailsDialog.value = false
}

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// Watchers pour recharger les données quand les filtres changent
watch([selectedTypes, selectedSectors, selectedLocation, minAmount, maxAmount], () => {
  currentPage.value = 1
}, { deep: true })

// Recherche avec debounce
let searchTimeout
watch(searchQuery, () => {
  clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    currentPage.value = 1
  }, 500)
})

// Fonctions helper pour la visibilité
const getVisibilityLabel = (visibility) => {
  switch (visibility) {
    case 'public': return 'Public'
    case 'members': return 'Membres uniquement'
    case 'premium': return 'Membres Premium'
    default: return 'Public'
  }
}

const getVisibilityColor = (visibility) => {
  switch (visibility) {
    case 'public': return 'green'
    case 'members': return 'blue'
    case 'premium': return 'purple'
    default: return 'green'
  }
}

// Parser les attachments (string JSON ou array direct)
const getParsedAttachments = (attachments) => {
  if (!attachments) return []
  
  // Si c'est une chaîne JSON, la parser
  if (typeof attachments === 'string') {
    try {
      return JSON.parse(attachments)
    } catch (e) {
      return []
    }
  }
  
  // Si c'est déjà un array, le retourner directement
  return Array.isArray(attachments) ? attachments : []
}

// Vérifier si les attachments sont valides
const hasValidAttachments = (attachments) => {
  const parsedAttachments = getParsedAttachments(attachments)
  return parsedAttachments.some(file => file && (file.name || file.filename) && file.size && file.size > 0)
}

// Formater la taille des fichiers
const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Icône selon le type de fichier
const getFileIcon = (mimeType) => {
  if (!mimeType) return 'mdi-file-document'
  if (mimeType.includes('pdf')) return 'mdi-file-pdf-box'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'mdi-file-word-box'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'mdi-file-excel-box'
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'mdi-file-powerpoint-box'
  if (mimeType.includes('image')) return 'mdi-file-image-box'
  return 'mdi-file-document'
}

// Initialize
onMounted(() => {
  loadOpportunities()
})
</script>

<style scoped>
.opportunities-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.hero-banner {
  background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%);
}

.sticky-filters {
  position: sticky;
  top: 20px;
}

.opportunity-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.opportunity-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.1) !important;
}

.premium-card {
  border: 2px solid #FFC107;
  background: linear-gradient(to bottom right, #fff, #fffbf0);
}

.premium-card:hover {
  box-shadow: 0 8px 25px rgba(255, 193, 7, 0.2) !important;
}

.v-card {
  border-radius: 12px !important;
}

.v-btn {
  border-radius: 8px !important;
}

.v-chip {
  border-radius: 6px !important;
}
</style>
