<template>
  <v-container fluid>
    <v-row>
      <v-col cols="12">
        <div class="d-flex align-center mb-4">
          <v-btn
            icon
            variant="text"
            @click="goBack"
          >
            <v-icon>mdi-arrow-left</v-icon>
          </v-btn>
          <h1 class="text-h4 font-weight-bold ml-4">
            {{ isEdit ? 'Modifier le' : 'Nouveau' }} Rapport RSE
          </h1>
        </div>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-stepper
          v-model="currentStep"
          :items="steps"
          alt-labels
        >
          <!-- Étape 1 : Informations générales -->
          <template #item.1>
            <v-card flat>
              <v-card-title>Informations Générales</v-card-title>
              <v-card-text>
                <v-form ref="form1">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model.number="form.fiscal_year"
                        label="Année fiscale *"
                        type="number"
                        :rules="[rules.required, rules.validYear]"
                        variant="outlined"
                        prepend-inner-icon="mdi-calendar"
                      />
                    </v-col>
                  </v-row>

                  <v-divider class="my-4" />
                  
                  <h3 class="text-h6 mb-4">Activités Principales</h3>
                  <v-btn
                    color="primary"
                    variant="outlined"
                    prepend-icon="mdi-plus"
                    size="small"
                    @click="addActivity"
                    class="mb-4"
                  >
                    Ajouter une activité
                  </v-btn>
                  
                  <v-row v-for="(activity, index) in form.main_activities" :key="index" class="mb-2">
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="activity.name"
                        label="Nom de l'activité"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-textarea
                        v-model="activity.description"
                        label="Description"
                        variant="outlined"
                        density="compact"
                        rows="2"
                      />
                    </v-col>
                    <v-col cols="12" md="2">
                      <div class="d-flex gap-2">
                        <v-text-field
                          v-model.number="activity.percentage"
                          label="Part (%)"
                          type="number"
                          suffix="%"
                          variant="outlined"
                          density="compact"
                        />
                        <v-btn
                          icon="mdi-delete"
                          size="small"
                          color="error"
                          variant="text"
                          @click="removeActivity(index)"
                        />
                      </div>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Étape 2 : Gouvernance -->
          <template #item.2>
            <v-card flat>
              <v-card-title>Gouvernance</v-card-title>
              <v-card-text>
                <v-form ref="form2">
                  <h3 class="text-h6 mb-4">ODD auxquels l'entreprise contribue</h3>
                  <v-row>
                    <v-col
                      v-for="sdg in sdgList"
                      :key="sdg.id"
                      cols="6"
                      sm="4"
                      md="3"
                      lg="2"
                    >
                      <v-checkbox
                        v-model="selectedSDGs"
                        :value="sdg.id"
                        density="compact"
                        hide-details
                      >
                        <template #label>
                          <div class="d-flex align-center">
                            <v-avatar
                              :color="sdg.color"
                              size="28"
                              class="mr-2"
                            >
                              <span class="text-caption font-weight-bold white--text">
                                {{ sdg.id }}
                              </span>
                            </v-avatar>
                            <span class="text-caption">{{ sdg.name_fr }}</span>
                          </div>
                        </template>
                      </v-checkbox>
                    </v-col>
                  </v-row>
                  
                  <v-divider class="my-6" />
                  
                  <h3 class="text-h6 mb-4">Politiques RSE Existantes</h3>
                  <v-btn
                    color="primary"
                    variant="outlined"
                    prepend-icon="mdi-plus"
                    size="small"
                    @click="addPolicy"
                    class="mb-4"
                  >
                    Ajouter une politique
                  </v-btn>
                  
                  <v-row v-for="(policy, index) in form.existing_policies" :key="index" class="mb-2">
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="policy.name"
                        label="Nom de la politique"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-textarea
                        v-model="policy.description"
                        label="Description"
                        variant="outlined"
                        density="compact"
                        rows="2"
                      />
                    </v-col>
                    <v-col cols="12" md="2">
                      <div class="d-flex gap-2">
                        <v-text-field
                          v-model="policy.date_adoption"
                          label="Date d'adoption"
                          type="date"
                          variant="outlined"
                          density="compact"
                        />
                        <v-btn
                          icon="mdi-delete"
                          size="small"
                          color="error"
                          variant="text"
                          @click="removePolicy(index)"
                        />
                      </div>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Étape 3 : Social -->
          <template #item.3>
            <v-card flat>
              <v-card-title>Indicateurs Sociaux</v-card-title>
              <v-card-text>
                <v-form ref="form3">
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model.number="form.total_employees"
                        label="Nombre total d'employés *"
                        type="number"
                        variant="outlined"
                        :rules="[rules.required, rules.positive]"
                        prepend-inner-icon="mdi-account-group"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model.number="form.cdi_count"
                        label="Nombre en CDI *"
                        type="number"
                        variant="outlined"
                        :rules="[rules.required, rules.positive, rules.cdiValid]"
                        prepend-inner-icon="mdi-account-check"
                        :error="contractMismatch"
                      />
                      <div v-if="cdiPercentage !== null" class="text-caption text-green mt-1">
                        {{ cdiPercentage }}% en CDI
                      </div>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model.number="form.cdd_count"
                        label="Nombre en CDD *"
                        type="number"
                        variant="outlined"
                        :rules="[rules.required, rules.positive, rules.cddValid]"
                        prepend-inner-icon="mdi-account-clock"
                        :error="contractMismatch"
                      />
                      <div v-if="cddPercentage !== null" class="text-caption text-blue mt-1">
                        {{ cddPercentage }}% en CDD
                      </div>
                    </v-col>
                  </v-row>
                  
                  <v-alert
                    v-if="contractMismatch"
                    type="error"
                    class="mt-4"
                    density="compact"
                    prominent
                  >
                    <v-icon start>mdi-alert-circle</v-icon>
                    <strong>Erreur de cohérence :</strong> La somme des CDI et CDD ({{ form.cdi_count + form.cdd_count }}) 
                    dépasse le nombre total d'employés ({{ form.total_employees }}).
                    <br><small>Veuillez corriger les valeurs avant de continuer.</small>
                  </v-alert>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Étape 4 : Communautés -->
          <template #item.4>
            <v-card flat>
              <v-card-title>Communautés et Achats Locaux</v-card-title>
              <v-card-text>
                <v-form ref="form4">
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model.number="form.suppliers_count"
                        label="Nombre de prestataires"
                        type="number"
                        variant="outlined"
                        prepend-inner-icon="mdi-truck"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model.number="form.suppliers_volume_eur"
                        label="Volume total des prestations (€)"
                        type="number"
                        prefix="€"
                        variant="outlined"
                        prepend-inner-icon="mdi-cash"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model.number="form.local_purchases_eur"
                        label="Montant des achats locaux (€)"
                        type="number"
                        prefix="€"
                        variant="outlined"
                        prepend-inner-icon="mdi-home-city"
                        :rules="[rules.positive, rules.localPurchasesValid]"
                        :error="purchasesMismatch"
                      />
                      <div v-if="localPurchasesPercentage !== null" class="text-caption text-green mt-1">
                        {{ localPurchasesPercentage }}% d'achats locaux
                      </div>
                    </v-col>
                  </v-row>

                  <v-alert
                    v-if="purchasesMismatch"
                    type="error"
                    class="mt-4"
                    density="compact"
                    prominent
                  >
                    <v-icon start>mdi-alert-circle</v-icon>
                    <strong>Erreur de cohérence :</strong> Les achats locaux ({{ form.local_purchases_eur }}€) 
                    dépassent le volume total ({{ form.suppliers_volume_eur }}€).
                  </v-alert>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Étape 5 : Environnement -->
          <template #item.5>
            <v-card flat>
              <v-card-title>Indicateurs Environnementaux</v-card-title>
              <v-card-text>
                <v-form ref="form5">
                  <v-row>
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model.number="form.energy_kwh_annual"
                        label="Énergie consommée (kWh/an)"
                        type="number"
                        suffix="kWh"
                        variant="outlined"
                        prepend-inner-icon="mdi-lightning-bolt"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model.number="form.solar_energy_kwh"
                        label="dont solaire (kWh/an)"
                        type="number"
                        suffix="kWh"
                        variant="outlined"
                        prepend-inner-icon="mdi-solar-power"
                        :rules="[rules.positive, rules.solarValid]"
                        :error="solarMismatch"
                      />
                      <div v-if="solarPercentage !== null" class="text-caption text-green mt-1">
                        {{ solarPercentage }}% d'énergie solaire
                      </div>
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model.number="form.water_m3_annual"
                        label="Eau consommée (m³/an)"
                        type="number"
                        suffix="m³"
                        variant="outlined"
                        prepend-inner-icon="mdi-water"
                        :rules="[rules.positive]"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model.number="form.fuel_liters_annual"
                        label="Carburant utilisé (L/an)"
                        type="number"
                        suffix="L"
                        variant="outlined"
                        prepend-inner-icon="mdi-gas-station"
                        :rules="[rules.positive]"
                      />
                    </v-col>
                  </v-row>

                  <v-alert
                    v-if="solarMismatch"
                    type="error"
                    class="mt-4"
                    density="compact"
                    prominent
                  >
                    <v-icon start>mdi-alert-circle</v-icon>
                    <strong>Erreur de cohérence :</strong> L'énergie solaire ({{ form.solar_energy_kwh }} kWh) 
                    dépasse la consommation totale ({{ form.energy_kwh_annual }} kWh).
                  </v-alert>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Étape 6 : Bilan Carbone -->
          <template #item.6>
            <v-card flat>
              <v-card-title>Bilan Carbone</v-card-title>
              <v-card-text>
                <v-form ref="form6">
                  <v-alert type="info" class="mb-4" density="compact">
                    <div class="text-body-2">
                      <strong>Scope 1</strong> : Émissions directes (combustibles, véhicules de l'entreprise)<br>
                      <strong>Scope 2</strong> : Émissions indirectes (électricité, chauffage, climatisation)<br>
                      <strong>Scope 3</strong> : Autres émissions indirectes (transport, déplacements, achats)
                    </div>
                  </v-alert>
                  
                  <v-row>
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model.number="form.carbon_scope1_tco2eq"
                        label="Scope 1 (tCO2eq)"
                        type="number"
                        suffix="tCO2eq"
                        variant="outlined"
                        prepend-inner-icon="mdi-factory"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model.number="form.carbon_scope2_tco2eq"
                        label="Scope 2 (tCO2eq)"
                        type="number"
                        suffix="tCO2eq"
                        variant="outlined"
                        prepend-inner-icon="mdi-flash"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-text-field
                        v-model.number="form.carbon_scope3_tco2eq"
                        label="Scope 3 (tCO2eq)"
                        type="number"
                        suffix="tCO2eq"
                        variant="outlined"
                        prepend-inner-icon="mdi-truck-delivery"
                      />
                    </v-col>
                    <v-col cols="12" md="3">
                      <v-card color="primary" class="pa-4 text-center">
                        <div class="text-h5 font-weight-bold text-white">
                          {{ carbonTotal }} tCO2eq
                        </div>
                        <div class="text-caption text-white">Émissions totales</div>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Étape 7 : Déchets -->
          <template #item.7>
            <v-card flat>
              <v-card-title>Gestion des Déchets</v-card-title>
              <v-card-text>
                <v-form ref="form7">
                  <v-row>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model.number="form.waste_total_kg"
                        label="Volume total de déchets (kg)"
                        type="number"
                        suffix="kg"
                        variant="outlined"
                        prepend-inner-icon="mdi-delete"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model.number="form.waste_composted_kg"
                        label="Déchets compostés/méthanisés (kg)"
                        type="number"
                        suffix="kg"
                        variant="outlined"
                        prepend-inner-icon="mdi-leaf"
                        :rules="[rules.positive, rules.wasteCompostedValid]"
                        :error="wasteMismatch"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model.number="form.waste_recycled_kg"
                        label="Déchets recyclés (kg)"
                        type="number"
                        suffix="kg"
                        variant="outlined"
                        prepend-inner-icon="mdi-recycle"
                        :rules="[rules.positive, rules.wasteRecycledValid]"
                        :error="wasteMismatch"
                      />
                    </v-col>
                  </v-row>
                  
                  <v-card v-if="wasteRecoveryPercentage !== null" color="success" class="pa-4 mb-4 text-center">
                    <div class="text-h5 font-weight-bold text-white">
                      {{ wasteRecoveryPercentage }}%
                    </div>
                    <div class="text-caption text-white">Taux de valorisation des déchets</div>
                  </v-card>

                  <v-alert
                    v-if="wasteMismatch"
                    type="error"
                    class="mt-4"
                    density="compact"
                    prominent
                  >
                    <v-icon start>mdi-alert-circle</v-icon>
                    <strong>Erreur de cohérence :</strong>
                    Les déchets valorisés ({{ wasteRecovered }} kg) sont supérieurs 
                    au total ({{ form.waste_total_kg }} kg).
                  </v-alert>
                  
                  <v-divider class="my-6" />
                  
                  <h3 class="text-h6 mb-4">Initiatives de Valorisation des Déchets</h3>
                  <v-btn
                    color="primary"
                    variant="outlined"
                    prepend-icon="mdi-plus"
                    size="small"
                    @click="addWasteInitiative"
                    class="mb-4"
                  >
                    Ajouter une initiative
                  </v-btn>
                  
                  <v-row v-for="(initiative, index) in form.waste_recovery_initiatives" :key="index" class="mb-2">
                    <v-col cols="12" md="4">
                      <v-text-field
                        v-model="initiative.name"
                        label="Nom de l'initiative"
                        variant="outlined"
                        density="compact"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-textarea
                        v-model="initiative.description"
                        label="Description"
                        variant="outlined"
                        density="compact"
                        rows="2"
                      />
                    </v-col>
                    <v-col cols="12" md="4">
                      <div class="d-flex gap-2">
                        <v-textarea
                          v-model="initiative.impact"
                          label="Impact mesuré"
                          variant="outlined"
                          density="compact"
                          rows="2"
                        />
                        <v-btn
                          icon="mdi-delete"
                          size="small"
                          color="error"
                          variant="text"
                          @click="removeWasteInitiative(index)"
                        />
                      </div>
                    </v-col>
                  </v-row>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Étape 8 : Documents -->
          <template #item.8>
            <v-card flat>
              <v-card-title>Documents Justificatifs</v-card-title>
              <v-card-text>
                <v-form ref="form8">
                  <v-file-input
                    v-model="uploadedFiles"
                    label="Documents justificatifs"
                    multiple
                    chips
                    variant="outlined"
                    prepend-icon="mdi-paperclip"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                    @update:model-value="handleFileUpload"
                    :loading="uploading"
                  >
                    <template #selection="{ fileNames }">
                      <v-chip
                        v-for="fileName in fileNames"
                        :key="fileName"
                        color="primary"
                        size="small"
                        class="ma-1"
                      >
                        {{ fileName }}
                      </v-chip>
                    </template>
                  </v-file-input>
                  
                  <v-list v-if="form.supporting_documents?.length" class="mt-4">
                    <v-list-item
                      v-for="(doc, index) in form.supporting_documents"
                      :key="index"
                    >
                      <template #prepend>
                        <v-icon>mdi-file-document</v-icon>
                      </template>
                      <v-list-item-title>{{ doc.name }}</v-list-item-title>
                      <v-list-item-subtitle>
                        {{ formatFileSize(doc.size) }} • {{ formatDate(doc.uploaded_at) }}
                      </v-list-item-subtitle>
                      <template #append>
                        <v-btn
                          icon="mdi-delete"
                          variant="text"
                          color="error"
                          size="small"
                          @click="removeDocument(index)"
                        />
                      </template>
                    </v-list-item>
                  </v-list>

                  <v-alert
                    v-if="form.supporting_documents?.length === 0"
                    type="info"
                    class="mt-4"
                    density="compact"
                  >
                    Aucun document téléchargé. Ajoutez des documents pour augmenter votre score RSE.
                  </v-alert>
                </v-form>
              </v-card-text>
            </v-card>
          </template>

          <!-- Actions du stepper -->
          <template #actions="{ prev, next }">
            <v-divider />
            <div class="d-flex justify-space-between align-center pa-4">
              <v-btn
                v-if="currentStep > 1"
                variant="text"
                @click="prev"
              >
                <v-icon start>mdi-chevron-left</v-icon>
                Précédent
              </v-btn>
              <v-spacer />
              
              <v-btn
                color="primary"
                variant="text"
                @click="saveDraft"
                :loading="saving"
              >
                <v-icon start>mdi-content-save</v-icon>
                Sauvegarder
              </v-btn>
              
              <v-btn
                v-if="currentStep < 8"
                color="primary"
                @click="next"
              >
                Suivant
                <v-icon end>mdi-chevron-right</v-icon>
              </v-btn>
              
              <v-btn
                v-else
                color="success"
                @click="submitReport"
                :loading="submitting"
              >
                <v-icon start>mdi-send</v-icon>
                Soumettre le rapport
              </v-btn>
            </div>
          </template>
        </v-stepper>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { rseService } from '@/services/rseService'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  companyId: {
    type: Number,
    required: true
  },
  reportId: {
    type: Number,
    default: null
  }
})

const isEdit = computed(() => !!props.reportId)

const currentStep = ref(1)
const steps = [
  { value: 1, title: 'Informations' },
  { value: 2, title: 'Gouvernance' },
  { value: 3, title: 'Social' },
  { value: 4, title: 'Communautés' },
  { value: 5, title: 'Environnement' },
  { value: 6, title: 'Carbone' },
  { value: 7, title: 'Déchets' },
  { value: 8, title: 'Documents' }
]

const form = ref({
  company_id: props.companyId,
  fiscal_year: route.query.year || new Date().getFullYear() - 1,
  main_activities: [],
  sdg_contributions: [],
  existing_policies: [],
  total_employees: 0,
  cdi_count: 0,
  cdd_count: 0,
  suppliers_count: 0,
  suppliers_volume_eur: 0,
  local_purchases_eur: 0,
  energy_kwh_annual: 0,
  water_m3_annual: 0,
  fuel_liters_annual: 0,
  solar_energy_kwh: 0,
  carbon_scope1_tco2eq: 0,
  carbon_scope2_tco2eq: 0,
  carbon_scope3_tco2eq: 0,
  waste_total_kg: 0,
  waste_composted_kg: 0,
  waste_recycled_kg: 0,
  waste_recovery_initiatives: [],
  supporting_documents: []
})

const sdgList = ref([])
const selectedSDGs = ref([])
const uploadedFiles = ref([])
const saving = ref(false)
const submitting = ref(false)
const uploading = ref(false)

const snackbar = ref({
  show: false,
  message: '',
  color: 'success',
  timeout: 3000
})

// Validation rules
const rules = {
  required: (v) => (v !== null && v !== '') || 'Ce champ est requis',
  positive: (v) => v >= 0 || 'La valeur doit être positive',
  validYear: (v) => {
    const year = parseInt(v)
    return (year >= 2000 && year <= new Date().getFullYear()) || 'Année invalide'
  },
  cdiValid: (v) => {
    const total = form.value.total_employees || 0
    const cdi = parseInt(v) || 0
    const cdd = form.value.cdd_count || 0
    if (cdi > total) return `Le nombre de CDI (${cdi}) ne peut pas dépasser le total d'employés (${total})`
    if (cdi + cdd > total) return `CDI + CDD (${cdi + cdd}) dépasse le total d'employés (${total})`
    return true
  },
  cddValid: (v) => {
    const total = form.value.total_employees || 0
    const cdd = parseInt(v) || 0
    const cdi = form.value.cdi_count || 0
    if (cdd > total) return `Le nombre de CDD (${cdd}) ne peut pas dépasser le total d'employés (${total})`
    if (cdi + cdd > total) return `CDI + CDD (${cdi + cdd}) dépasse le total d'employés (${total})`
    return true
  },
  localPurchasesValid: (v) => {
    const volume = form.value.suppliers_volume_eur || 0
    const local = parseFloat(v) || 0
    if (local > volume) return `Les achats locaux (${local}€) ne peuvent pas dépasser le volume total (${volume}€)`
    return true
  },
  solarValid: (v) => {
    const total = form.value.energy_kwh_annual || 0
    const solar = parseFloat(v) || 0
    if (solar > total) return `L'énergie solaire (${solar} kWh) ne peut pas dépasser l'énergie totale (${total} kWh)`
    return true
  },
  wasteCompostedValid: (v) => {
    const total = form.value.waste_total_kg || 0
    const composted = parseFloat(v) || 0
    const recycled = form.value.waste_recycled_kg || 0
    
    if (composted > total) return `Les déchets compostés (${composted} kg) ne peuvent pas dépasser le total (${total} kg)`
    if (composted + recycled > total) return `Déchets valorisés (${composted + recycled} kg) dépassent le total (${total} kg)`
    return true
  },
  wasteRecycledValid: (v) => {
    const total = form.value.waste_total_kg || 0
    const recycled = parseFloat(v) || 0
    const composted = form.value.waste_composted_kg || 0
    
    if (recycled > total) return `Les déchets recyclés (${recycled} kg) ne peuvent pas dépasser le total (${total} kg)`
    if (composted + recycled > total) return `Déchets valorisés (${composted + recycled} kg) dépassent le total (${total} kg)`
    return true
  }
}

// Computed properties
const cdiPercentage = computed(() => {
  if (!form.value.total_employees) return null
  return Math.round((form.value.cdi_count / form.value.total_employees) * 100)
})

const cddPercentage = computed(() => {
  if (!form.value.total_employees) return null
  return Math.round((form.value.cdd_count / form.value.total_employees) * 100)
})

const contractMismatch = computed(() => {
  return (form.value.cdi_count + form.value.cdd_count) > form.value.total_employees
})

const localPurchasesPercentage = computed(() => {
  if (!form.value.suppliers_volume_eur) return null
  return Math.round((form.value.local_purchases_eur / form.value.suppliers_volume_eur) * 100)
})

const purchasesMismatch = computed(() => {
  return form.value.local_purchases_eur > form.value.suppliers_volume_eur
})

const solarPercentage = computed(() => {
  if (!form.value.energy_kwh_annual) return null
  return Math.round((form.value.solar_energy_kwh / form.value.energy_kwh_annual) * 100)
})

const solarMismatch = computed(() => {
  return form.value.solar_energy_kwh > form.value.energy_kwh_annual
})

const carbonTotal = computed(() => {
  return (
    (form.value.carbon_scope1_tco2eq || 0) +
    (form.value.carbon_scope2_tco2eq || 0) +
    (form.value.carbon_scope3_tco2eq || 0)
  ).toFixed(2)
})

const wasteRecovered = computed(() => {
  return (form.value.waste_composted_kg || 0) + (form.value.waste_recycled_kg || 0)
})

const wasteRecoveryPercentage = computed(() => {
  if (!form.value.waste_total_kg) return null
  return Math.round((wasteRecovered.value / form.value.waste_total_kg) * 100)
})

const wasteMismatch = computed(() => {
  return wasteRecovered.value > form.value.waste_total_kg
})

// Methods
const addActivity = () => {
  form.value.main_activities.push({ name: '', description: '', percentage: 0 })
}

const removeActivity = (index) => {
  form.value.main_activities.splice(index, 1)
}

const addPolicy = () => {
  form.value.existing_policies.push({ name: '', description: '', date_adoption: '' })
}

const removePolicy = (index) => {
  form.value.existing_policies.splice(index, 1)
}

const addWasteInitiative = () => {
  form.value.waste_recovery_initiatives.push({ name: '', description: '', impact: '' })
}

const removeWasteInitiative = (index) => {
  form.value.waste_recovery_initiatives.splice(index, 1)
}

const handleFileUpload = async () => {
  if (!uploadedFiles.value || uploadedFiles.value.length === 0) return
  
  uploading.value = true
  try {
    for (const file of uploadedFiles.value) {
      const document = await rseService.uploadDocument(
        props.companyId,
        form.value.fiscal_year,
        file
      )
      form.value.supporting_documents.push(document)
    }
    showSuccess('Documents téléchargés avec succès')
    uploadedFiles.value = []
  } catch (error) {
    console.error('Error uploading files:', error)
    showError('Erreur lors du téléchargement des documents')
  } finally {
    uploading.value = false
  }
}

const removeDocument = (index) => {
  form.value.supporting_documents.splice(index, 1)
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('fr-FR')
}

const saveDraft = async () => {
  saving.value = true
  try {
    // Vérification des données minimales
    if (!props.companyId) {
      throw new Error('ID entreprise manquant')
    }
    if (!form.value.fiscal_year) {
      throw new Error('Année fiscale manquante')
    }

    const reportData = {
      ...form.value,
      sdg_contributions: selectedSDGs.value,
      report_status: 'draft'
    }
    
    let result
    if (props.reportId) {
      console.log('Mise à jour du rapport existant:', props.reportId)
      result = await rseService.updateReport(props.reportId, reportData)
    } else {
      console.log('Création d\'un nouveau rapport pour company:', props.companyId)
      result = await rseService.createReport(props.companyId, form.value.fiscal_year)
      console.log('Rapport créé avec ID:', result.id)
      form.value.id = result.id
      result = await rseService.updateReport(result.id, reportData)
      console.log('Rapport mis à jour avec toutes les données')
    }
    
    showSuccess('Brouillon sauvegardé avec succès')
    return result
  } catch (error) {
    console.error('Error saving draft:', error)
    
    // Message d'erreur plus détaillé
    let errorMessage = 'Erreur lors de la sauvegarde du brouillon'
    if (error.message?.includes('row-level security') || error.code === '42501') {
      errorMessage = 'Erreur de permissions : Veuillez exécuter le script RLS dans Supabase'
    } else if (error.message?.includes('duplicate')) {
      errorMessage = 'Un rapport existe déjà pour cette année'
    } else if (error.message) {
      errorMessage = `Erreur : ${error.message}`
    }
    
    showError(errorMessage)
    throw error
  } finally {
    saving.value = false
  }
}

const submitReport = async () => {
  submitting.value = true
  try {
    const savedReport = await saveDraft()
    await rseService.changeReportStatus(savedReport.id, 'submitted')
    
    showSuccess('Rapport soumis avec succès ! Il sera vérifié par notre équipe.')
    
    setTimeout(() => {
      router.push({
        name: 'RSEDashboard',
        params: { companyId: props.companyId }
      })
    }, 1500)
  } catch (error) {
    console.error('Error submitting report:', error)
    showError('Erreur lors de la soumission du rapport')
  } finally {
    submitting.value = false
  }
}

const loadSDGs = async () => {
  try {
    sdgList.value = await rseService.getAllSDGs()
  } catch (error) {
    console.error('Error loading SDGs:', error)
    showError('Erreur lors du chargement des ODD')
  }
}

const loadReport = async () => {
  if (!props.reportId) return
  
  try {
    const report = await rseService.getReportById(props.reportId)
    if (report) {
      Object.assign(form.value, report)
      selectedSDGs.value = report.sdg_contributions || []
    }
  } catch (error) {
    console.error('Error loading report:', error)
    showError('Erreur lors du chargement du rapport')
  }
}

const goBack = () => {
  router.push({
    name: 'RSEDashboard',
    params: { companyId: props.companyId }
  })
}

const showSuccess = (message) => {
  snackbar.value = { show: true, message, color: 'success', timeout: 3000 }
}

const showError = (message) => {
  snackbar.value = { show: true, message, color: 'error', timeout: 5000 }
}

onMounted(async () => {
  await loadSDGs()
  await loadReport()
})
</script>

<style scoped>
.gap-2 {
  gap: 0.5rem;
}
</style>

