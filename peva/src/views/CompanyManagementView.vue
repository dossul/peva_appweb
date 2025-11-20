<template>
  <div class="company-management">
    <v-container class="py-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="d-flex align-center mb-4">
          <v-icon class="mr-3 text-green-600" size="32">mdi-domain</v-icon>
          <div>
            <h1 class="text-h3 font-weight-bold text-grey-darken-3">Gestion Entreprise</h1>
            <p class="text-body-1 text-grey-darken-1 ma-0">Éditer profil et rapports RSE</p>
          </div>
        </div>
      </div>

      <!-- Indicateur de chargement -->
      <v-row v-if="loading">
        <v-col cols="12" class="text-center py-12">
          <v-progress-circular
            indeterminate
            color="green-darken-2"
            size="64"
          />
          <p class="text-body-1 mt-4 text-grey">Chargement des données de l'entreprise...</p>
        </v-col>
      </v-row>

      <!-- Navigation Tabs -->
      <v-card v-else class="mb-6" elevation="2">
        <v-tabs v-model="activeTab" color="green-darken-2" class="px-4">
          <v-tab value="profile">
            <v-icon start>mdi-pencil</v-icon>
            Profil Entreprise
            <v-chip size="small" class="ml-2">Informations générales</v-chip>
          </v-tab>
          <v-tab value="reports">
            <v-icon start>mdi-chart-line</v-icon>
            Rapports RSE
            <v-chip size="small" class="ml-2">Responsabilité sociétale</v-chip>
          </v-tab>
          <v-tab value="team">
            <v-icon start>mdi-account-group</v-icon>
            Équipe
            <v-chip size="small" class="ml-2">Gestion des membres</v-chip>
          </v-tab>
          <v-tab value="settings">
            <v-icon start>mdi-cog</v-icon>
            Paramètres
            <v-chip size="small" class="ml-2">Configuration</v-chip>
          </v-tab>
        </v-tabs>
      </v-card>

      <v-row v-if="!loading">
        <!-- Main Content -->
        <v-col cols="12" lg="8">
          <v-window v-model="activeTab">
            <!-- Profil Entreprise -->
            <v-window-item value="profile">
              <v-card elevation="2">
                <v-card-title class="bg-green-darken-2 text-white pa-4">
                  <v-icon start>mdi-domain</v-icon>
                  Profil Entreprise
                </v-card-title>
                <v-card-text class="pa-6">
                  <v-form ref="profileForm" v-model="profileFormValid">
                    <v-row>
                      <v-col cols="12">
                        <v-text-field
                          v-model="companyProfile.name"
                          label="Nom de l'entreprise"
                          placeholder="Nom de votre entreprise"
                          variant="outlined"
                          :rules="[rules.required]"
                          prepend-inner-icon="mdi-domain"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="companyProfile.sector"
                          :items="sectors"
                          label="Secteur d'activité"
                          variant="outlined"
                          :rules="[rules.required]"
                          prepend-inner-icon="mdi-factory"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="companyProfile.country"
                          :items="countries"
                          label="Pays"
                          variant="outlined"
                          :rules="[rules.required]"
                          prepend-inner-icon="mdi-map-marker"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="companyProfile.description"
                          label="Description"
                          placeholder="Description de votre entreprise et de ses activités"
                          variant="outlined"
                          rows="4"
                          :rules="[rules.required]"
                          prepend-inner-icon="mdi-text"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
                <v-card-actions class="pa-6 pt-0">
                  <v-spacer />
                  <v-btn
                    color="green-darken-2"
                    variant="flat"
                    prepend-icon="mdi-content-save"
                    :loading="saving"
                    @click="saveProfile"
                  >
                    Sauvegarder le profil
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-window-item>

            <!-- Rapports RSE -->
            <v-window-item value="reports">
              <v-card elevation="2">
                <v-card-title class="bg-blue-darken-2 text-white pa-4">
                  <v-icon start>mdi-chart-line</v-icon>
                  Rapports RSE/ESG
                </v-card-title>
                <v-card-text class="pa-6">
                  <!-- Info Section -->
                  <v-alert
                    type="info"
                    variant="tonal"
                    class="mb-6"
                  >
                    <div class="d-flex align-center">
                      <v-icon size="32" class="mr-3">mdi-information</v-icon>
                      <div>
                        <div class="font-weight-bold mb-1">Système de Gestion RSE/ESG Complet</div>
                        <div class="text-body-2">
                          Accédez au tableau de bord complet pour gérer vos rapports RSE, 
                          suivre vos indicateurs de performance ESG et soumettre vos données annuelles.
                        </div>
                      </div>
                    </div>
                  </v-alert>

                  <!-- Quick Stats (placeholder) -->
                  <v-row class="mb-6">
                    <v-col cols="12" md="4">
                      <v-card color="green-lighten-5" class="pa-4 text-center">
                        <v-icon color="green-darken-2" size="32">mdi-file-document-check</v-icon>
                        <div class="text-h6 font-weight-bold text-green-darken-2 mt-2">
                          {{ companyRSEStats.reportsCount }}
                        </div>
                        <div class="text-caption">Rapports publiés</div>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-card color="blue-lighten-5" class="pa-4 text-center">
                        <v-icon color="blue-darken-2" size="32">mdi-chart-line</v-icon>
                        <div class="text-h6 font-weight-bold text-blue-darken-2 mt-2">
                          {{ companyRSEStats.latestScore || 'N/A' }}
                        </div>
                        <div class="text-caption">Score RSE actuel</div>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-card color="orange-lighten-5" class="pa-4 text-center">
                        <v-icon color="orange-darken-2" size="32">mdi-calendar-clock</v-icon>
                        <div class="text-h6 font-weight-bold text-orange-darken-2 mt-2">
                          {{ companyRSEStats.latestYear || new Date().getFullYear() - 1 }}
                        </div>
                        <div class="text-caption">Dernière année</div>
                      </v-card>
                    </v-col>
                  </v-row>

                  <!-- Main Actions -->
                  <div class="d-flex flex-column gap-3">
                    <v-btn
                      color="primary"
                      size="x-large"
                      variant="flat"
                      prepend-icon="mdi-view-dashboard"
                      @click="goToRSEDashboard"
                      block
                    >
                      Accéder au Tableau de Bord RSE Complet
                    </v-btn>

                    <v-divider class="my-2" />

                    <!-- Quick Actions -->
                    <v-list density="compact" class="pa-0">
                      <v-list-item
                        prepend-icon="mdi-plus-circle"
                        title="Créer un nouveau rapport RSE"
                        subtitle="Soumettre les données pour une nouvelle année"
                        @click="createNewRSEReport"
                      >
                        <template #append>
                          <v-icon>mdi-chevron-right</v-icon>
                        </template>
                      </v-list-item>
                      
                      <v-divider />
                      
                      <v-list-item
                        prepend-icon="mdi-file-document-multiple"
                        title="Consulter les rapports historiques"
                        subtitle="Voir tous vos rapports RSE passés"
                        @click="goToRSEDashboard"
                      >
                        <template #append>
                          <v-icon>mdi-chevron-right</v-icon>
                        </template>
                      </v-list-item>
                      
                      <v-divider />
                      
                      <v-list-item
                        prepend-icon="mdi-earth"
                        title="Objectifs de Développement Durable"
                        subtitle="Gérer votre contribution aux ODD"
                        @click="goToRSEDashboard"
                      >
                        <template #append>
                          <v-chip color="success" size="small">17 ODD</v-chip>
                        </template>
                      </v-list-item>
                    </v-list>
                  </div>

                  <!-- Features Info -->
                  <v-card class="mt-6" color="grey-lighten-4" flat>
                    <v-card-text>
                      <h4 class="text-subtitle-1 font-weight-bold mb-3">
                        <v-icon start>mdi-check-circle</v-icon>
                        Fonctionnalités du système RSE/ESG
                      </h4>
                      <v-row dense>
                        <v-col cols="12" sm="6">
                          <div class="d-flex align-center mb-2">
                            <v-icon size="small" color="success" class="mr-2">mdi-check</v-icon>
                            <span class="text-body-2">Gouvernance & ODD</span>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="d-flex align-center mb-2">
                            <v-icon size="small" color="success" class="mr-2">mdi-check</v-icon>
                            <span class="text-body-2">Indicateurs Sociaux</span>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="d-flex align-center mb-2">
                            <v-icon size="small" color="success" class="mr-2">mdi-check</v-icon>
                            <span class="text-body-2">Communautés & Achats locaux</span>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="d-flex align-center mb-2">
                            <v-icon size="small" color="success" class="mr-2">mdi-check</v-icon>
                            <span class="text-body-2">Environnement & Énergie</span>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="d-flex align-center mb-2">
                            <v-icon size="small" color="success" class="mr-2">mdi-check</v-icon>
                            <span class="text-body-2">Bilan Carbone (Scope 1, 2, 3)</span>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="d-flex align-center mb-2">
                            <v-icon size="small" color="success" class="mr-2">mdi-check</v-icon>
                            <span class="text-body-2">Gestion des Déchets</span>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="d-flex align-center mb-2">
                            <v-icon size="small" color="success" class="mr-2">mdi-check</v-icon>
                            <span class="text-body-2">Score RSE automatique (0-100)</span>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="d-flex align-center mb-2">
                            <v-icon size="small" color="success" class="mr-2">mdi-check</v-icon>
                            <span class="text-body-2">Export & Documents justificatifs</span>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-card-text>
              </v-card>
            </v-window-item>

            <!-- Équipe -->
            <v-window-item value="team">
              <v-card elevation="2">
                <v-card-title class="bg-purple-darken-2 text-white pa-4">
                  <v-icon start>mdi-account-group</v-icon>
                  Équipe
                </v-card-title>
                <v-card-text class="pa-6">
                  <p class="text-body-1 mb-4">Gestion des membres de votre équipe</p>
                  <v-btn color="purple-darken-2" variant="flat" prepend-icon="mdi-account-plus">
                    Inviter un membre
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-window-item>

            <!-- Paramètres -->
            <v-window-item value="settings">
              <v-card elevation="2">
                <v-card-title class="bg-orange-darken-2 text-white pa-4">
                  <v-icon start>mdi-cog</v-icon>
                  Paramètres
                </v-card-title>
                <v-card-text class="pa-6">
                  <p class="text-body-1 mb-4">Configuration de votre compte entreprise</p>
                  <v-btn color="orange-darken-2" variant="flat" prepend-icon="mdi-cog">
                    Configurer
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </v-col>

        <!-- Sidebar -->
        <v-col cols="12" lg="4">
          <!-- Tableau de Bord RSE -->
          <v-card class="mb-6" elevation="2">
            <v-card-title class="pa-4">
              <v-icon start>mdi-chart-box</v-icon>
              Tableau de Bord RSE
            </v-card-title>
            <v-card-text class="pa-4">
              <v-row class="text-center">
                <v-col cols="6">
                  <div class="text-h4 font-weight-bold text-green-darken-2">92%</div>
                  <div class="text-body-2">Score RSE global</div>
                </v-col>
                <v-col cols="6">
                  <div class="text-h4 font-weight-bold text-blue-darken-2">15</div>
                  <div class="text-body-2">Certifications</div>
                </v-col>
                <v-col cols="6">
                  <div class="text-h4 font-weight-bold text-purple-darken-2">847</div>
                  <div class="text-body-2">Tonnes CO² évitées</div>
                </v-col>
                <v-col cols="6">
                  <div class="text-h4 font-weight-bold text-orange-darken-2">2.3M</div>
                  <div class="text-body-2">Impact social €</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Success Snackbar -->
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { companyService } from '@/services/companyService'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const activeTab = ref('profile')
const profileFormValid = ref(false)
const saving = ref(false)
const loading = ref(true)
const currentCompany = ref(null)

const companyProfile = ref({
  name: '',
  sector: 'Énergies renouvelables',
  country: 'Sénégal',
  description: ''
})

// RSE Stats (will be loaded from API)
const companyRSEStats = ref({
  reportsCount: 0,
  latestScore: null,
  latestYear: null
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Static data
const sectors = [
  'Énergies renouvelables',
  'Agriculture durable',
  'Gestion des déchets',
  'Transport vert',
  'Construction écologique',
  'Eau et assainissement',
  'Technologies propres'
]

const countries = [
  'Sénégal',
  'Ghana',
  'Côte d\'Ivoire',
  'Nigeria',
  'Kenya',
  'Maroc',
  'Tunisie',
  'Afrique du Sud',
  'Cameroun',
  'Mali',
  'Burkina Faso',
  'Rwanda',
  'Éthiopie'
]

const rules = {
  required: value => !!value || 'Ce champ est requis'
}

// Methods
const loadCompanyData = async () => {
  try {
    loading.value = true
    const user = authStore.user
    
    if (!user) {
      showMessage('Utilisateur non connecté', 'error')
      return
    }

    // Récupérer l'entreprise de l'utilisateur
    const company = await companyService.getUserMainCompany(user.id)
    
    if (company) {
      currentCompany.value = company
      companyProfile.value = {
        name: company.name || '',
        sector: company.industry || 'Énergies renouvelables',
        country: company.country || 'Sénégal',
        description: company.description || ''
      }

      // Charger les stats RSE
      try {
        const stats = await companyService.getCompanyRSEStats(company.id)
        companyRSEStats.value = stats
      } catch (rseError) {
        console.warn('Impossible de charger les stats RSE:', rseError)
        // Stats par défaut si la table n'existe pas encore
        companyRSEStats.value = {
          reportsCount: 0,
          latestYear: null,
          latestScore: null
        }
      }
    } else {
      showMessage('Aucune entreprise trouvée pour cet utilisateur', 'warning')
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    showMessage('Erreur lors du chargement des données', 'error')
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  if (!profileFormValid.value) return
  
  if (!currentCompany.value) {
    showMessage('Aucune entreprise à mettre à jour', 'error')
    return
  }
  
  try {
    saving.value = true
    
    // Sauvegarder dans Supabase
    await companyService.updateCompany(currentCompany.value.id, {
      name: companyProfile.value.name,
      sector: companyProfile.value.sector,
      country: companyProfile.value.country,
      description: companyProfile.value.description
    })
    
    showMessage('Profil sauvegardé avec succès !', 'success')
    
    // Recharger les données pour refléter les changements
    await loadCompanyData()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    showMessage('Erreur lors de la sauvegarde: ' + error.message, 'error')
  } finally {
    saving.value = false
  }
}

const showMessage = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  }
}

// RSE Methods
const goToRSEDashboard = () => {
  if (!currentCompany.value) {
    showMessage('Aucune entreprise trouvée', 'error')
    return
  }
  
  router.push({
    name: 'RSEDashboard',
    params: { companyId: currentCompany.value.id },
    query: { name: companyProfile.value.name }
  })
}

const createNewRSEReport = () => {
  if (!currentCompany.value) {
    showMessage('Aucune entreprise trouvée', 'error')
    return
  }
  
  router.push({
    name: 'RSEReportForm',
    params: { companyId: currentCompany.value.id },
    query: { year: new Date().getFullYear() - 1 }
  })
}

onMounted(async () => {
  await loadCompanyData()
})
</script>

<style scoped>
.company-management {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.v-card {
  border-radius: 12px !important;
}

.v-btn {
  border-radius: 8px !important;
}

.v-tab {
  text-transform: none !important;
}
</style>
