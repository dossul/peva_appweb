<template>
  <v-container fluid>
    <v-row>
      <!-- En-tête -->
      <v-col cols="12">
        <div class="d-flex justify-space-between align-center flex-wrap">
          <div>
            <h1 class="text-h4 font-weight-bold mb-2">
              Tableau de Bord RSE
            </h1>
            <p class="text-body-1 text-grey-darken-1">
              Vue d'ensemble des performances RSE/ESG de {{ companyName }}
            </p>
          </div>
          <v-btn
            color="primary"
            size="large"
            prepend-icon="mdi-plus"
            @click="createNewReport"
          >
            Nouveau rapport RSE
          </v-btn>
        </div>
      </v-col>
    </v-row>

    <!-- Sélecteur d'année et actions -->
    <v-row>
      <v-col cols="12" md="4">
        <v-select
          v-model="selectedYear"
          :items="availableYears"
          label="Année fiscale"
          variant="outlined"
          density="comfortable"
          prepend-inner-icon="mdi-calendar"
        />
      </v-col>
      <v-col cols="12" md="8" class="d-flex align-center justify-end gap-2">
        <v-btn
          v-if="currentReport"
          variant="outlined"
          prepend-icon="mdi-download"
          @click="exportReport"
        >
          Exporter
        </v-btn>
        <v-btn
          v-if="currentReport && canEdit"
          color="primary"
          variant="outlined"
          prepend-icon="mdi-pencil"
          @click="editReport"
        >
          Modifier
        </v-btn>
        <v-btn
          v-if="currentReport && currentReport.report_status === 'draft' && canEdit"
          color="success"
          prepend-icon="mdi-send"
          @click="submitReport"
        >
          Soumettre
        </v-btn>
      </v-col>
    </v-row>

    <!-- Loading -->
    <v-row v-if="loading">
      <v-col cols="12" class="text-center py-12">
        <v-progress-circular indeterminate color="primary" size="64" />
        <p class="text-body-1 mt-4">Chargement des données RSE...</p>
      </v-col>
    </v-row>

    <!-- Contenu principal -->
    <template v-else-if="currentReport">
      <!-- Indicateurs Clés -->
      <v-row>
        <!-- Social -->
        <v-col cols="12" sm="6" md="3">
          <v-card hover>
            <v-card-text>
              <div class="d-flex justify-space-between align-center mb-2">
                <v-icon color="purple" size="32">mdi-account-group</v-icon>
                <v-chip color="purple" size="small">Social</v-chip>
              </div>
              <div class="text-h4 font-weight-bold text-purple">
                {{ currentReport.cdi_percentage || 0 }}%
              </div>
              <div class="text-body-2 text-grey">
                CDI sur {{ currentReport.total_employees || 0 }} employés
              </div>
              <v-progress-linear
                :model-value="currentReport.cdi_percentage || 0"
                color="purple"
                height="4"
                class="mt-2"
              />
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Environnement -->
        <v-col cols="12" sm="6" md="3">
          <v-card hover>
            <v-card-text>
              <div class="d-flex justify-space-between align-center mb-2">
                <v-icon color="green" size="32">mdi-solar-power</v-icon>
                <v-chip color="green" size="small">Environnement</v-chip>
              </div>
              <div class="text-h4 font-weight-bold text-green">
                {{ currentReport.solar_percentage || 0 }}%
              </div>
              <div class="text-body-2 text-grey">Énergie solaire</div>
              <v-progress-linear
                :model-value="currentReport.solar_percentage || 0"
                color="green"
                height="4"
                class="mt-2"
              />
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Carbone -->
        <v-col cols="12" sm="6" md="3">
          <v-card hover>
            <v-card-text>
              <div class="d-flex justify-space-between align-center mb-2">
                <v-icon color="blue" size="32">mdi-molecule-co2</v-icon>
                <v-chip color="blue" size="small">Carbone</v-chip>
              </div>
              <div class="text-h4 font-weight-bold text-blue">
                {{ formatNumber(currentReport.carbon_total_tco2eq) }}
              </div>
              <div class="text-body-2 text-grey">
                tCO2eq • {{ carbonPerEmployee }} /employé
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Déchets -->
        <v-col cols="12" sm="6" md="3">
          <v-card hover>
            <v-card-text>
              <div class="d-flex justify-space-between align-center mb-2">
                <v-icon color="orange" size="32">mdi-recycle</v-icon>
                <v-chip color="orange" size="small">Déchets</v-chip>
              </div>
              <div class="text-h4 font-weight-bold text-orange">
                {{ currentReport.waste_recovery_percentage || 0 }}%
              </div>
              <div class="text-body-2 text-grey">Valorisation</div>
              <v-progress-linear
                :model-value="currentReport.waste_recovery_percentage || 0"
                color="orange"
                height="4"
                class="mt-2"
              />
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Détails par catégorie -->
      <v-row ref="detailsSection">
        <!-- Gouvernance -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="bg-indigo-darken-2 text-white">
              <v-icon start>mdi-gavel</v-icon>
              Gouvernance
            </v-card-title>
            <v-card-text class="pa-4">
              <h3 class="text-subtitle-1 font-weight-bold mb-3">
                Contribution aux ODD ({{ sdgCount }})
              </h3>
              <div class="d-flex flex-wrap ga-2 mb-4">
                <v-chip
                  v-for="sdgId in currentReport.sdg_contributions"
                  :key="sdgId"
                  :color="getSDGColor(sdgId)"
                  size="small"
                  class="text-white"
                >
                  {{ getSDGCode(sdgId) }}
                </v-chip>
              </div>
              
              <v-divider class="my-3" />
              
              <h3 class="text-subtitle-1 font-weight-bold mb-3">
                Politiques RSE ({{ policiesCount }})
              </h3>
              <v-list v-if="policiesCount > 0" density="compact" class="pa-0">
                <v-list-item
                  v-for="(policy, index) in currentReport.existing_policies"
                  :key="index"
                  class="px-0"
                >
                  <template #prepend>
                    <v-icon size="small" color="indigo">mdi-file-document</v-icon>
                  </template>
                  <v-list-item-title>{{ policy.name }}</v-list-item-title>
                  <v-list-item-subtitle>{{ policy.date_adoption }}</v-list-item-subtitle>
                </v-list-item>
              </v-list>
              <p v-else class="text-body-2 text-grey">Aucune politique enregistrée</p>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Communautés -->
        <v-col cols="12" md="6">
          <v-card>
            <v-card-title class="bg-teal-darken-2 text-white">
              <v-icon start>mdi-handshake</v-icon>
              Communautés
            </v-card-title>
            <v-card-text class="pa-4">
              <v-row dense>
                <v-col cols="6">
                  <div class="text-h5 font-weight-bold">
                    {{ currentReport.suppliers_count || 0 }}
                  </div>
                  <div class="text-caption text-grey">Prestataires</div>
                </v-col>
                <v-col cols="6">
                  <div class="text-h5 font-weight-bold">
                    {{ formatCurrency(currentReport.suppliers_volume_eur) }}
                  </div>
                  <div class="text-caption text-grey">Volume total</div>
                </v-col>
                <v-col cols="12" class="mt-4">
                  <div class="text-caption text-grey mb-1">Achats locaux</div>
                  <v-progress-linear
                    :model-value="currentReport.local_purchases_percentage || 0"
                    color="teal"
                    height="25"
                    striped
                  >
                    <template #default="{ value }">
                      <strong class="text-white">{{ value }}%</strong>
                    </template>
                  </v-progress-linear>
                  <div class="text-body-2 mt-1">
                    {{ formatCurrency(currentReport.local_purchases_eur) }} d'achats locaux
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Bilan Carbone Détaillé -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="bg-blue-darken-2 text-white">
              <v-icon start>mdi-chart-bar</v-icon>
              Bilan Carbone Détaillé
            </v-card-title>
            <v-card-text class="pa-4">
              <v-row>
                <v-col cols="12" sm="6" md="3">
                  <v-card color="red-lighten-4" class="pa-4 text-center">
                    <div class="text-h5 font-weight-bold text-red-darken-2">
                      {{ formatNumber(currentReport.carbon_scope1_tco2eq) }}
                    </div>
                    <div class="text-caption font-weight-bold">Scope 1 (tCO2eq)</div>
                    <div class="text-caption text-grey">Émissions directes</div>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card color="orange-lighten-4" class="pa-4 text-center">
                    <div class="text-h5 font-weight-bold text-orange-darken-2">
                      {{ formatNumber(currentReport.carbon_scope2_tco2eq) }}
                    </div>
                    <div class="text-caption font-weight-bold">Scope 2 (tCO2eq)</div>
                    <div class="text-caption text-grey">Émissions indirectes (énergie)</div>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card color="yellow-lighten-4" class="pa-4 text-center">
                    <div class="text-h5 font-weight-bold text-yellow-darken-4">
                      {{ formatNumber(currentReport.carbon_scope3_tco2eq) }}
                    </div>
                    <div class="text-caption font-weight-bold">Scope 3 (tCO2eq)</div>
                    <div class="text-caption text-grey">Autres émissions indirectes</div>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card color="blue-darken-4" class="pa-4 text-center">
                    <div class="text-h5 font-weight-bold text-white">
                      {{ formatNumber(currentReport.carbon_total_tco2eq) }}
                    </div>
                    <div class="text-caption text-white font-weight-bold">Total (tCO2eq)</div>
                    <div class="text-caption text-blue-lighten-3">
                      {{ carbonPerEmployee }} tCO2eq/employé
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Environnement Détaillé -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="bg-green-darken-2 text-white">
              <v-icon start>mdi-leaf</v-icon>
              Indicateurs Environnementaux
            </v-card-title>
            <v-card-text class="pa-4">
              <v-row>
                <v-col cols="12" md="4">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="yellow" class="mr-2">mdi-lightning-bolt</v-icon>
                    <span class="font-weight-bold">Énergie</span>
                  </div>
                  <div class="text-h6">{{ formatNumber(currentReport.energy_kwh_annual) }} kWh</div>
                  <div class="text-caption text-grey">dont {{ formatNumber(currentReport.solar_energy_kwh) }} kWh solaire</div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="blue" class="mr-2">mdi-water</v-icon>
                    <span class="font-weight-bold">Eau</span>
                  </div>
                  <div class="text-h6">{{ formatNumber(currentReport.water_m3_annual) }} m³</div>
                  <div class="text-caption text-grey">Consommation annuelle</div>
                </v-col>
                <v-col cols="12" md="4">
                  <div class="d-flex align-center mb-2">
                    <v-icon color="red" class="mr-2">mdi-gas-station</v-icon>
                    <span class="font-weight-bold">Carburant</span>
                  </div>
                  <div class="text-h6">{{ formatNumber(currentReport.fuel_liters_annual) }} L</div>
                  <div class="text-caption text-grey">Consommation annuelle</div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Déchets Détaillé -->
      <v-row>
        <v-col cols="12">
          <v-card>
            <v-card-title class="bg-orange-darken-2 text-white">
              <v-icon start>mdi-delete</v-icon>
              Gestion des Déchets
            </v-card-title>
            <v-card-text class="pa-4">
              <v-row>
                <v-col cols="12" md="8">
                  <v-row>
                    <v-col cols="12" sm="4">
                      <div class="text-h6">{{ formatNumber(currentReport.waste_total_kg) }} kg</div>
                      <div class="text-caption text-grey">Total déchets</div>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <div class="text-h6 text-green">{{ formatNumber(currentReport.waste_composted_kg) }} kg</div>
                      <div class="text-caption text-grey">Compostés/Méthanisés</div>
                    </v-col>
                    <v-col cols="12" sm="4">
                      <div class="text-h6 text-blue">{{ formatNumber(currentReport.waste_recycled_kg) }} kg</div>
                      <div class="text-caption text-grey">Recyclés</div>
                    </v-col>
                  </v-row>
                  
                  <v-divider class="my-4" />
                  
                  <h4 class="text-subtitle-1 font-weight-bold mb-3">
                    Initiatives de valorisation ({{ wasteInitiativesCount }})
                  </h4>
                  <v-list v-if="wasteInitiativesCount > 0" density="compact" class="pa-0">
                    <v-list-item
                      v-for="(initiative, index) in currentReport.waste_recovery_initiatives"
                      :key="index"
                      class="px-0"
                    >
                      <template #prepend>
                        <v-icon size="small" color="orange">mdi-lightbulb-on</v-icon>
                      </template>
                      <v-list-item-title>{{ initiative.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{ initiative.impact }}</v-list-item-subtitle>
                    </v-list-item>
                  </v-list>
                  <p v-else class="text-body-2 text-grey">Aucune initiative enregistrée</p>
                </v-col>
                
                <v-col cols="12" md="4" class="d-flex align-center justify-center">
                  <div class="text-center">
                    <v-progress-circular
                      :model-value="currentReport.waste_recovery_percentage || 0"
                      :size="150"
                      :width="15"
                      color="orange"
                    >
                      <span class="text-h4 font-weight-bold">{{ currentReport.waste_recovery_percentage || 0 }}%</span>
                    </v-progress-circular>
                    <div class="text-body-2 mt-2 font-weight-bold">Taux de valorisation</div>
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>

    <!-- Message si aucun rapport -->
    <v-row v-else>
      <v-col cols="12">
        <v-card class="pa-12 text-center">
          <v-icon size="64" color="grey">mdi-file-document-outline</v-icon>
          <h2 class="text-h5 mt-4 mb-2">Aucun rapport RSE pour cette année</h2>
          <p class="text-body-1 text-grey mb-4">
            Créez votre premier rapport RSE pour commencer à suivre vos performances ESG.
          </p>
          <v-btn
            color="primary"
            size="large"
            prepend-icon="mdi-plus"
            @click="createNewReport"
          >
            Créer un rapport RSE
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="snackbar.timeout"
    >
      {{ snackbar.message }}
      <template #actions>
        <v-btn variant="text" @click="snackbar.show = false">Fermer</v-btn>
      </template>
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { rseService } from '@/services/rseService'

const props = defineProps({
  companyId: {
    type: Number,
    required: true
  },
  companyName: {
    type: String,
    default: 'Votre entreprise'
  }
})

const router = useRouter()

const loading = ref(true)
const currentReport = ref(null)
const selectedYear = ref(new Date().getFullYear() - 1)
const availableYears = ref([])
const sdgList = ref([])
const detailsSection = ref(null)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
  timeout: 3000
})

// Computed
const canEdit = computed(() => {
  if (!currentReport.value) return false
  return ['draft', 'submitted'].includes(currentReport.value.report_status)
})

const carbonPerEmployee = computed(() => {
  if (!currentReport.value || !currentReport.value.total_employees) return '0'
  const value = currentReport.value.carbon_total_tco2eq / currentReport.value.total_employees
  return value.toFixed(2)
})

const sdgCount = computed(() => {
  return currentReport.value?.sdg_contributions?.length || 0
})

const policiesCount = computed(() => {
  return currentReport.value?.existing_policies?.length || 0
})

const wasteInitiativesCount = computed(() => {
  return currentReport.value?.waste_recovery_initiatives?.length || 0
})

// Methods
const generateYearRange = () => {
  const currentYear = new Date().getFullYear()
  const years = []
  // Générer les 5 dernières années + année en cours
  for (let i = 0; i < 6; i++) {
    years.push(currentYear - i)
  }
  return years
}

const loadReports = async () => {
  loading.value = true
  try {
    const reports = await rseService.getCompanyReports(props.companyId, {
      includeStatus: ['draft', 'submitted', 'validated', 'published']
    })
    
    // Récupérer les années des rapports existants
    const reportYears = [...new Set(reports.map(r => r.fiscal_year))]
    
    // Générer une plage d'années par défaut (5 dernières années + année en cours)
    const defaultYears = generateYearRange()
    
    // Combiner les années des rapports avec les années par défaut
    const allYears = [...new Set([...reportYears, ...defaultYears])].sort((a, b) => b - a)
    
    availableYears.value = allYears
    
    currentReport.value = reports.find(r => r.fiscal_year === selectedYear.value) || null
    
    // PLUS DE CALCUL DE SCORE AUTOMATIQUE
    // Les entreprises saisissent directement leurs valeurs
  } catch (error) {
    console.error('Error loading reports:', error)
    showError('Erreur lors du chargement des rapports')
  } finally {
    loading.value = false
  }
}

const loadSDGs = async () => {
  try {
    sdgList.value = await rseService.getAllSDGs()
  } catch (error) {
    console.error('Error loading SDGs:', error)
  }
}

const getSDGCode = (id) => {
  const sdg = sdgList.value.find(s => s.id === id)
  return sdg?.code || `SDG${id}`
}

const getSDGColor = (id) => {
  const sdg = sdgList.value.find(s => s.id === id)
  return sdg?.color || '#999'
}

const formatNumber = (value) => {
  if (!value && value !== 0) return '0'
  return new Intl.NumberFormat('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  }).format(value)
}

const formatCurrency = (value) => {
  if (!value && value !== 0) return '0 €'
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0
  }).format(value)
}

const createNewReport = () => {
  router.push({
    name: 'RSEReportForm',
    params: { companyId: props.companyId },
    query: { year: selectedYear.value }
  })
}

const editReport = () => {
  if (!currentReport.value) return
  router.push({
    name: 'RSEReportForm',
    params: { 
      companyId: props.companyId,
      reportId: currentReport.value.id
    }
  })
}

const submitReport = async () => {
  if (!currentReport.value) return
  
  try {
    await rseService.changeReportStatus(currentReport.value.id, 'submitted')
    showSuccess('Rapport soumis pour validation')
    await loadReports()
  } catch (error) {
    console.error('Error submitting report:', error)
    showError('Erreur lors de la soumission')
  }
}

const exportReport = async () => {
  if (!currentReport.value) return
  
  try {
    const data = await rseService.exportReportData(currentReport.value.id)
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `rapport-rse-${props.companyName}-${currentReport.value.fiscal_year}.json`
    a.click()
    URL.revokeObjectURL(url)
    showSuccess('Rapport exporté avec succès')
  } catch (error) {
    console.error('Error exporting report:', error)
    showError('Erreur lors de l\'export')
  }
}

const scrollToDetails = () => {
  if (detailsSection.value) {
    detailsSection.value.scrollIntoView({ behavior: 'smooth' })
  }
}

const showSuccess = (message) => {
  snackbar.value = { show: true, message, color: 'success', timeout: 3000 }
}

const showError = (message) => {
  snackbar.value = { show: true, message, color: 'error', timeout: 5000 }
}

// Watchers
watch(selectedYear, () => {
  loadReports()
})

// Lifecycle
onMounted(async () => {
  await Promise.all([
    loadSDGs(),
    loadReports()
  ])
})
</script>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}
</style>

