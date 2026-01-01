<template>
  <div class="create-opportunity-view">
    <!-- Header avec bannière -->
    <div class="hero-banner bg-indigo-darken-2 text-white py-8">
      <v-container>
        <div class="d-flex align-center">
          <v-icon size="48" class="mr-4">mdi-briefcase-plus</v-icon>
          <div>
            <h1 class="text-h3 font-weight-bold mb-2">Créer une nouvelle opportunité de financement, emploi, partenariat ou mission</h1>
          </div>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <!-- Stepper de progression -->
      <v-stepper v-model="currentStep" class="mb-8" elevation="2">
        <v-stepper-header>
          <v-stepper-item
            :complete="currentStep > 1"
            :value="1"
            title="Informations de base"
          />
          <v-divider />
          <v-stepper-item
            :complete="currentStep > 2"
            :value="2"
            title="Détails spécifiques"
          />
          <v-divider />
          <v-stepper-item
            :complete="currentStep > 3"
            :value="3"
            title="Critères & Publication"
          />
        </v-stepper-header>

        <v-stepper-window>
          <!-- Étape 1: Informations de base -->
          <v-stepper-window-item :value="1">
            <v-card-text class="pa-6">
              <h2 class="text-h5 font-weight-bold mb-4">1. Informations de base</h2>
              
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="opportunityData.title"
                    label="Titre de l'opportunité *"
                    variant="outlined"
                    :rules="[rules.required]"
                    placeholder="Ex: Financement Série A pour startups AgriTech"
                  />
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-select
                    v-model="opportunityData.type"
                    :items="opportunityTypes"
                    label="Type d'opportunité *"
                    variant="outlined"
                    :rules="[rules.required]"
                  />
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-select
                    v-model="opportunityData.sector"
                    :items="sectors"
                    label="Secteur principal *"
                    variant="outlined"
                    :rules="[rules.required]"
                  />
                </v-col>
                
                <v-col cols="12">
                  <v-textarea
                    v-model="opportunityData.description"
                    label="Description détaillée *"
                    variant="outlined"
                    :rules="[rules.required]"
                    rows="4"
                    placeholder="Décrivez l'opportunité, les objectifs, les bénéfices attendus..."
                  />
                </v-col>
                
                <!-- Choix simple : Personnel ou Organisation -->
                <v-col cols="12">
                  <h3 class="text-h6 mb-3">Publier cette opportunité :</h3>
                  <v-radio-group v-model="publicationType" inline>
                    <v-radio label="En mon nom personnel" value="personal" />
                    <v-radio label="Au nom de mon organisation" value="organization" />
                  </v-radio-group>
                </v-col>

                <!-- Select des entreprises si "organisation" est sélectionné -->
                <v-col cols="12" md="6" v-if="publicationType === 'organization' && userCompanies.length > 0">
                  <v-select
                    v-model="selectedCompany"
                    :items="userCompanies"
                    item-title="name"
                    item-value="id"
                    label="Sélectionner votre entreprise *"
                    variant="outlined"
                    :rules="[rules.required]"
                    @update:model-value="updateCompanyInfo"
                  />
                </v-col>

                <!-- Champ texte pour l'organisation -->
                <v-col cols="12" md="6" v-if="publicationType === 'personal' || (publicationType === 'organization' && userCompanies.length === 0)">
                  <v-text-field
                    v-model="opportunityData.organization"
                    label="Nom de l'organisation *"
                    variant="outlined"
                    :rules="[rules.required]"
                    :placeholder="publicationType === 'personal' ? 'Ex: Freelance, Consultant indépendant' : 'Ex: Mon Entreprise'"
                  />
                </v-col>

                <!-- Message si pas d'entreprise créée -->
                <v-col cols="12" v-if="publicationType === 'organization' && userCompanies.length === 0">
                  <v-alert type="info" variant="tonal">
                    Vous n'avez pas encore créé d'entreprise. Vous pouvez saisir le nom manuellement ou créer une entreprise dans votre profil.
                  </v-alert>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-select
                    v-model="selectedCountries"
                    :items="locations"
                    label="Localisation *"
                    variant="outlined"
                    :rules="[rules.required]"
                    clearable
                    :menu-props="{ maxHeight: '300px' }"
                    multiple
                    chips
                    closable-chips
                    @update:model-value="updateLocationData"
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-stepper-window-item>

          <!-- Étape 2: Détails spécifiques -->
          <v-stepper-window-item :value="2">
            <v-card-text class="pa-6">
              <h2 class="text-h5 font-weight-bold mb-4">2. Détails spécifiques</h2>
              
              <v-row>
                <v-col cols="12">
                  <v-textarea
                    v-model="opportunityData.detailed_description"
                    label="Description complète *"
                    variant="outlined"
                    :rules="[rules.required]"
                    rows="4"
                    placeholder="Décrivez en détail votre opportunité, les objectifs, les défis, les exigences..."
                    hint="300 caractères maximum - sera affiché dans la liste"
                  />
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="opportunityData.budget_salary"
                    label="Budget/Salaire"
                    variant="outlined"
                    placeholder="Ex: 50 000 - 2 000 000 FCFA CFA"
                  />
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-select
                    v-model="opportunityData.location"
                    :items="locations"
                    label="Localisation"
                    variant="outlined"
                    placeholder="Sélectionner un pays"
                  />
                </v-col>
                
                <v-col cols="12">
                  <v-combobox
                    v-model="opportunityData.required_skills"
                    label="Compétences requises"
                    variant="outlined"
                    multiple
                    chips
                    placeholder="Ex: Business Development, Finance, Marketing Digital..."
                    hint="Tapez une compétence et appuyez sur Entrée, ou séparez par des virgules"
                    @keydown.enter="addSkillOnEnter"
                    @paste="handlePasteSkills"
                  />
                </v-col>
              </v-row>
              
              <!-- Détails pour Financement -->
              <div v-if="opportunityData.type === 'Financement'" class="mt-6">
                <h3 class="text-h6 font-weight-bold mb-3">Détails du financement</h3>
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="opportunityData.funding_amount"
                      label="Montant du financement (€)"
                      type="number"
                      variant="outlined"
                      placeholder="Ex: 500000"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="opportunityData.funding_type"
                      :items="fundingTypes"
                      label="Type de financement"
                      variant="outlined"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="opportunityData.equity_percentage"
                      label="Pourcentage d'équité (%)"
                      type="number"
                      variant="outlined"
                      placeholder="Ex: 15"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="opportunityData.stage"
                      :items="fundingStages"
                      label="Stade de développement"
                      variant="outlined"
                    />
                  </v-col>
                </v-row>
              </div>

              <!-- Détails pour Emploi -->
              <div v-if="opportunityData.type === 'Emploi'">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="opportunityData.job_title"
                      label="Intitulé du poste"
                      variant="outlined"
                      placeholder="Ex: Directeur Développement Durable"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="opportunityData.contract_type"
                      :items="contractTypes"
                      label="Type de contrat"
                      variant="outlined"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="opportunityData.salary_min"
                      label="Salaire minimum (€/an)"
                      type="number"
                      variant="outlined"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="opportunityData.salary_max"
                      label="Salaire maximum (€/an)"
                      type="number"
                      variant="outlined"
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-textarea
                      v-model="opportunityData.requirements"
                      label="Exigences et qualifications"
                      variant="outlined"
                      rows="3"
                      placeholder="Diplômes, expérience, compétences requises..."
                    />
                  </v-col>
                </v-row>
              </div>

              <!-- Détails pour Partenariat -->
              <div v-if="opportunityData.type === 'Partenariat'">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="opportunityData.partnership_type"
                      :items="partnershipTypes"
                      label="Type de partenariat"
                      variant="outlined"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="opportunityData.duration"
                      label="Durée prévue"
                      variant="outlined"
                      placeholder="Ex: 12 mois, Long terme"
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-textarea
                      v-model="opportunityData.partnership_benefits"
                      label="Bénéfices du partenariat"
                      variant="outlined"
                      rows="3"
                      placeholder="Avantages mutuels, objectifs communs..."
                    />
                  </v-col>
                </v-row>
              </div>

              <!-- Détails pour Mission -->
              <div v-if="opportunityData.type === 'Mission'">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="opportunityData.mission_duration"
                      label="Durée de la mission"
                      variant="outlined"
                      placeholder="Ex: 3 mois, 6 semaines"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="opportunityData.daily_rate"
                      label="Tarif journalier (€)"
                      type="number"
                      variant="outlined"
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-checkbox
                      v-model="opportunityData.remote_possible"
                      label="Télétravail possible"
                      hide-details
                    />
                  </v-col>
                </v-row>
              </div>

              <!-- Dates communes -->
              <v-row class="mt-4">
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="opportunityData.deadline"
                    :label="getDeadlineLabel()"
                    type="date"
                    variant="outlined"
                    :rules="[rules.required]"
                  />
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="opportunityData.start_date"
                    label="Date de début souhaitée"
                    type="date"
                    variant="outlined"
                  />
                </v-col>
              </v-row>

              <!-- Liens sociaux et web -->
              <v-row class="mt-4">
                <v-col cols="12">
                  <h3 class="text-h6 font-weight-bold mb-3">Liens associés (optionnel)</h3>
                  <p class="text-body-2 text-medium-emphasis mb-4">
                    Ajoutez des liens vers votre site web, réseaux sociaux ou autres ressources liées à cette opportunité.
                  </p>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="socialLinks.website"
                    label="Site web"
                    variant="outlined"
                    prepend-inner-icon="mdi-web"
                    placeholder="https://example.com"
                  />
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="socialLinks.linkedin"
                    label="LinkedIn"
                    variant="outlined"
                    prepend-inner-icon="mdi-linkedin"
                    placeholder="https://linkedin.com/company/..."
                  />
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="socialLinks.twitter"
                    label="Twitter"
                    variant="outlined"
                    prepend-inner-icon="mdi-twitter"
                    placeholder="https://twitter.com/..."
                  />
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="socialLinks.facebook"
                    label="Facebook"
                    variant="outlined"
                    prepend-inner-icon="mdi-facebook"
                    placeholder="https://facebook.com/..."
                  />
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="socialLinks.youtube"
                    label="YouTube"
                    variant="outlined"
                    prepend-inner-icon="mdi-youtube"
                    placeholder="https://youtube.com/..."
                  />
                </v-col>
              </v-row>
            </v-card-text>
          </v-stepper-window-item>

          <!-- Étape 3: Critères & Publication -->
          <v-stepper-window-item :value="3">
            <v-card-text class="pa-6">
              <h2 class="text-h5 font-weight-bold mb-4">3. Critères & Publication</h2>
              
              <v-row>
                <!-- Contact -->
                <v-col cols="12">
                  <h3 class="text-h6 font-weight-bold mb-3">Contact</h3>
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="opportunityData.contact_email"
                    label="Email de contact *"
                    type="email"
                    variant="outlined"
                    :rules="[rules.required, rules.email]"
                  />
                </v-col>
                
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="opportunityData.contact_phone"
                    label="Téléphone (optionnel)"
                    variant="outlined"
                  />
                </v-col>

                <!-- Visibilité -->
                <v-col cols="12">
                  <h3 class="text-h6 font-weight-bold mb-3">Visibilité</h3>
                </v-col>
                
                <v-col cols="12">
                  <v-radio-group v-model="opportunityData.visibility">
                    <v-radio
                      label="Public - Visible par tous les membres"
                      value="public"
                    />
                    <v-radio
                      label="Membres uniquement"
                      value="members"
                    />
                    <v-radio
                      label="Membres Premium"
                      value="premium"
                    />
                  </v-radio-group>
                </v-col>

                <!-- Fichiers joints -->
                <v-col cols="12">
                  <h3 class="text-h6 font-weight-bold mb-3">Fichiers joints</h3>
                  <p class="text-body-2 text-grey-darken-1 mb-3">
                    Ajoutez des documents complémentaires (business plan, fiche de poste, présentation, etc.)
                  </p>
                </v-col>
                
                <v-col cols="12">
                  <v-file-input
                    v-model="selectedFiles"
                    label="Sélectionner des fichiers"
                    variant="outlined"
                    multiple
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                    prepend-icon="mdi-paperclip"
                    show-size
                    counter
                    :rules="fileRules"
                  >
                    <template v-slot:selection="{ fileNames }">
                      <template v-for="(fileName, index) in fileNames" :key="fileName">
                        <v-chip
                          v-if="index < 2"
                          color="primary"
                          size="small"
                          label
                          class="me-2"
                        >
                          {{ fileName }}
                        </v-chip>
                        <span
                          v-else-if="index === 2"
                          class="text-overline text-grey-darken-1 mx-2"
                        >
                          +{{ selectedFiles.length - 2 }} fichier(s)
                        </span>
                      </template>
                    </template>
                  </v-file-input>
                  
                  <!-- Liste des fichiers sélectionnés -->
                  <div v-if="selectedFiles.length > 0" class="mt-3">
                    <v-list density="compact">
                      <v-list-item
                        v-for="(file, index) in selectedFiles"
                        :key="index"
                        class="pa-2"
                      >
                        <template v-slot:prepend>
                          <v-icon>{{ getFileIcon(file.type) }}</v-icon>
                        </template>
                        <v-list-item-title>{{ file.name }}</v-list-item-title>
                        <v-list-item-subtitle>{{ formatFileSize(file.size) }}</v-list-item-subtitle>
                        <template v-slot:append>
                          <v-btn
                            icon="mdi-close"
                            variant="text"
                            size="small"
                            @click="removeFile(index)"
                          />
                        </template>
                      </v-list-item>
                    </v-list>
                  </div>
                </v-col>

                <!-- Options de publication -->
                <v-col cols="12">
                  <h3 class="text-h6 font-weight-bold mb-3">Options de publication</h3>
                </v-col>
                
                <v-col cols="12">
                  <div class="d-flex flex-column ga-2">
                    <v-checkbox
                      v-model="opportunityData.promote_premium"
                      label="Promouvoir cette opportunité (Option Premium)"
                      hide-details
                    />
                    <v-checkbox
                      v-model="opportunityData.send_notifications"
                      label="Recevoir des notifications par email"
                      hide-details
                    />
                    <v-checkbox
                      v-model="opportunityData.auto_share_social"
                      label="Partager automatiquement sur les réseaux sociaux"
                      hide-details
                    />
                  </div>
                </v-col>
              </v-row>
            </v-card-text>
          </v-stepper-window-item>
        </v-stepper-window>

        <v-stepper-actions>
          <template v-slot:prev>
            <v-btn
              v-if="currentStep > 1"
              variant="outlined"
              @click="currentStep--"
            >
              Précédent
            </v-btn>
          </template>
          
          <template v-slot:next>
            <v-btn
              v-if="currentStep < 3"
              color="primary"
              @click="currentStep++"
            >
              Suivant
            </v-btn>
            
            <v-btn
              v-else
              color="green-darken-2"
              @click="publishOpportunity"
              :disabled="!isFormValid"
              :loading="loading"
              prepend-icon="mdi-publish"
            >
              {{ loading ? 'Publication en cours...' : 'Publier l\'opportunité' }}
            </v-btn>
          </template>
        </v-stepper-actions>
      </v-stepper>

      <!-- Actions supplémentaires -->
      <div class="d-flex justify-space-between">
        <v-btn
          variant="outlined"
          prepend-icon="mdi-content-save"
          @click="saveDraft"
          color="blue-grey"
        >
          💾 Sauvegarder en brouillon
        </v-btn>
        
        <v-btn
          variant="outlined"
          prepend-icon="mdi-arrow-left"
          @click="goBack"
        >
          Annuler
        </v-btn>
      </div>
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
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { opportunitiesService } from '@/services/opportunitiesService'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const selectedFiles = ref([])
const loading = ref(false)
const currentStep = ref(1)
const publicationType = ref('personal')
const userCompanies = ref([])
const selectedCompany = ref(null)
const selectedCountries = ref([])
const socialLinks = ref({
  website: '',
  linkedin: '',
  twitter: '',
  facebook: '',
  youtube: ''
})

const opportunityData = ref({
  title: '',
  type: '',
  sector: '',
  description: '',
  detailed_description: '',
  organization: '',
  location: '',
  budget_salary: '',
  required_skills: [],
  deadline: '',
  
  // Financement
  funding_amount: '',
  funding_type: '',
  equity_percentage: '',
  stage: '',
  
  // Emploi
  job_title: '',
  contract_type: '',
  salary_min: '',
  salary_max: '',
  requirements: '',
  
  // Partenariat
  partnership_type: '',
  duration: '',
  partnership_benefits: '',
  
  // Mission
  mission_duration: '',
  daily_rate: '',
  remote_possible: false,
  
  // Dates
  start_date: '',
  
  // Contact & Publication
  contact_email: '',
  contact_phone: '',
  visibility: 'public',
  promote_premium: false,
  send_notifications: true,
  auto_share_social: false
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Static data
const opportunityTypes = [
  { title: 'Emploi', value: 'job' },
  { title: 'Stage', value: 'internship' },
  { title: 'Mission/Contrat', value: 'contract' },
  { title: 'Financement', value: 'funding' },
  { title: 'Partenariat', value: 'partnership' },
  { title: 'Appel d\'offres', value: 'tender' }
]

const sectors = [
  'Énergie Renouvelable',
  'Agriculture Durable',
  'Économie Circulaire',
  'Innovation Technologique',
  'Finance Verte',
  'Entrepreneuriat',
  'Développement Durable',
  'Autre'
]

const locations = [
  // Liste officielle des 54 pays africains (ordre alphabétique)
  'Afrique du Sud',
  'Algérie',
  'Angola',
  'Bénin',
  'Botswana',
  'Burkina Faso',
  'Burundi',
  'Cameroun',
  'Cap-Vert',
  'Comores',
  'Congo (Brazzaville)',
  'Côte d\'Ivoire',
  'Djibouti',
  'Égypte',
  'Érythrée',
  'Eswatini',
  'Éthiopie',
  'Gabon',
  'Gambie',
  'Ghana',
  'Guinée',
  'Guinée équatoriale',
  'Guinée-Bissau',
  'Kenya',
  'Lesotho',
  'Libéria',
  'Libye',
  'Madagascar',
  'Malawi',
  'Mali',
  'Maroc',
  'Maurice',
  'Mauritanie',
  'Mozambique',
  'Namibie',
  'Niger',
  'Nigeria',
  'Ouganda',
  'République centrafricaine',
  'République démocratique du Congo',
  'Rwanda',
  'Sao Tomé-et-Principe',
  'Sénégal',
  'Seychelles',
  'Sierra Leone',
  'Somalie',
  'Soudan',
  'Soudan du Sud',
  'Tanzanie',
  'Tchad',
  'Togo',
  'Tunisie',
  'Zambie',
  'Zimbabwe',
  
  // Options générales
  'International',
  'Autre'
]

const fundingTypes = [
  'Amorçage',
  'Série A',
  'Série B',
  'Série C+',
  'Subvention',
  'Prêt',
  'Crowdfunding'
]

const fundingStages = [
  'Idée',
  'Prototype',
  'MVP',
  'Croissance',
  'Expansion',
  'Maturité'
]

const contractTypes = [
  'CDI',
  'CDD',
  'Stage',
  'Freelance',
  'Temps partiel',
  'Alternance'
]

const partnershipTypes = [
  'Stratégique',
  'Commercial',
  'Technologique',
  'Recherche & Développement',
  'Distribution',
  'Joint-venture'
]

// Validation rules
const rules = {
  required: value => !!value || 'Ce champ est requis',
  email: value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || 'Email invalide'
}

// Validation du formulaire complet
const isFormValid = computed(() => {
  const data = opportunityData.value
  const countries = selectedCountries.value
  
  // Champs obligatoires de base
  const baseValid = !!(
    data.title &&
    data.type &&
    data.sector &&
    data.description &&
    data.organization &&
    countries && countries.length > 0 &&
    data.deadline &&
    data.contact_email
  )
  
  return baseValid
})

const fileRules = [
  files => !files || files.every(file => file.size <= 10 * 1024 * 1024) || 'Taille maximum 10MB par fichier'
]

// Methods
const saveDraft = () => {
  showMessage('💾 Brouillon sauvegardé ! Vous pouvez continuer plus tard.', 'info')
}

const publishOpportunity = async () => {
  if (!opportunityData.value.title || !opportunityData.value.type || !opportunityData.value.contact_email) {
    showMessage('Veuillez remplir tous les champs obligatoires', 'error')
    return
  }
  
  loading.value = true
  try {
    // Filtrer les liens sociaux non vides
    const filteredSocialLinks = Object.fromEntries(
      Object.entries(socialLinks.value).filter(([key, value]) => value.trim() !== '')
    )
    
    // Préparer les données à envoyer
    const dataToSubmit = {
      ...opportunityData.value,
      created_by: authStore.user?.id,
      // Ajouter company_id si une entreprise est sélectionnée
      ...(publicationType.value === 'organization' && selectedCompany.value && { 
        company_id: selectedCompany.value 
      }),
      // Ajouter les liens sociaux s'il y en a
      ...(Object.keys(filteredSocialLinks).length > 0 && { 
        social_links: filteredSocialLinks 
      })
    }
    
    const result = await opportunitiesService.createOpportunity(
      dataToSubmit,
      selectedFiles.value
    )
    
    if (result.success) {
      showMessage('✅ Opportunité soumise avec succès ! Elle sera visible après validation par notre équipe.', 'success')
      setTimeout(() => {
        router.push('/opportunities')
      }, 3000)
    } else {
      showMessage('❌ Erreur lors de la publication: ' + result.error, 'error')
    }
  } catch (error) {
    console.error('Erreur publication:', error)
    showMessage('Erreur lors de la publication', 'error')
  } finally {
    loading.value = false
  }
}

const goBack = () => {
  router.go(-1)
}

const showMessage = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  }
}

// Charger les entreprises de l'utilisateur
const loadUserCompanies = async () => {
  try {
    const { data, error } = await supabase
      .from('pev_companies')
      .select('id, name')
      .eq('owner_id', authStore.user?.id)
    
    if (error) throw error
    userCompanies.value = data || []
    console.log('Entreprises chargées:', userCompanies.value)
  } catch (error) {
    console.error('Erreur lors du chargement des entreprises:', error)
    userCompanies.value = []
  }
}

// Mettre à jour l'organisation quand une entreprise est sélectionnée
const updateCompanyInfo = (companyId) => {
  const company = userCompanies.value.find(c => c.id === companyId)
  if (company) {
    opportunityData.value.organization = company.name
  }
}

// Mettre à jour les données de localisation (toujours en mode multiple)
const updateLocationData = (selection) => {
  const countries = Array.isArray(selection) ? selection : []
  
  // Mettre à jour les données
  opportunityData.value.location = countries.length > 0 ? countries.join(', ') : ''
  opportunityData.value.countries = countries
  opportunityData.value.is_multi_country = countries.length > 1
}

// Label dynamique pour la date limite selon le type d'opportunité
const getDeadlineLabel = () => {
  const type = opportunityData.value.type
  switch (type) {
    case 'job':
    case 'internship':
      return 'Date limite de candidature *'
    case 'funding':
      return 'Date limite de soumission *'
    case 'partnership':
      return 'Date limite de proposition *'
    case 'contract':
      return 'Date limite de candidature *'
    case 'tender':
      return 'Date limite de soumission *'
    default:
      return 'Date limite *'
  }
}

// Gérer l'ajout de compétences avec Entrée
const addSkillOnEnter = (event) => {
  event.preventDefault()
  const input = event.target.value?.trim()
  if (input) {
    const skills = input.split(',').map(skill => skill.trim()).filter(skill => skill)
    const currentSkills = opportunityData.value.required_skills || []
    
    // Ajouter les nouvelles compétences sans doublons
    const newSkills = [...new Set([...currentSkills, ...skills])]
    opportunityData.value.required_skills = newSkills
    
    // Vider le champ de saisie
    event.target.value = ''
  }
}

// Gérer le collage de texte avec virgules
const handlePasteSkills = (event) => {
  setTimeout(() => {
    const input = event.target.value?.trim()
    if (input && input.includes(',')) {
      const skills = input.split(',').map(skill => skill.trim()).filter(skill => skill)
      const currentSkills = opportunityData.value.required_skills || []
      
      // Ajouter les nouvelles compétences sans doublons
      const newSkills = [...new Set([...currentSkills, ...skills])]
      opportunityData.value.required_skills = newSkills
      
      // Vider le champ de saisie
      event.target.value = ''
    }
  }, 100)
}

// Fonctions utilitaires pour les fichiers
const removeFile = (index) => {
  selectedFiles.value.splice(index, 1)
}

const getFileIcon = (mimeType) => {
  if (mimeType.includes('pdf')) return 'mdi-file-pdf-box'
  if (mimeType.includes('word') || mimeType.includes('document')) return 'mdi-file-word-box'
  if (mimeType.includes('excel') || mimeType.includes('spreadsheet')) return 'mdi-file-excel-box'
  if (mimeType.includes('powerpoint') || mimeType.includes('presentation')) return 'mdi-file-powerpoint-box'
  if (mimeType.includes('text')) return 'mdi-file-document-outline'
  return 'mdi-file-outline'
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// Initialize
onMounted(async () => {
  // Initialiser avec les données utilisateur
  if (authStore.user?.email) {
    opportunityData.value.contact_email = authStore.user.email
  }
  
  // Charger les entreprises de l'utilisateur
  await loadUserCompanies()
})
</script>

<style scoped>
.create-opportunity-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.hero-banner {
  background: linear-gradient(135deg, #3f51b5 0%, #5c6bc0 100%);
}

.v-stepper {
  border-radius: 12px !important;
}

.v-card {
  border-radius: 12px !important;
}

.v-btn {
  border-radius: 8px !important;
}
</style>
