<template>
  <div class="d-flex align-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 pa-4" style="min-height: 100vh;">
    <div style="max-width: 64rem; width: 100%;">
      <!-- Header -->
      <div class="text-center mb-8">
        <div class="d-flex align-center justify-center mb-4">
          <div class="mx-auto d-flex align-center justify-center rounded-circle elevation-4" style="height: 64px; width: 64px; background: linear-gradient(135deg, #4ade80 0%, #10b981 100%);">
            <v-icon size="32" color="white">mdi-leaf</v-icon>
          </div>
        </div>
        <h1 class="text-h3 font-weight-black text-grey-darken-4 mb-2">Bienvenue sur PEVA</h1>
        <p class="text-body-1 text-grey-darken-2">Plateforme de l'Économie Verte en Afrique</p>
        <p class="text-body-2 text-grey-darken-1 mt-2">Configurons votre profil en quelques étapes simples</p>
      </div>

      <!-- Stepper -->
      <AppCard peva-style="glass" class="mb-6">
        <template #default>
          <v-stepper 
            v-model="currentStep" 
            :items="stepperItems"
            hide-actions
            class="bg-transparent elevation-0"
          >
            <!-- Étape 1: Informations personnelles -->
            <template #item.1>
              <div class="pa-6">
                <div class="text-center mb-6">
                  <v-icon size="48" color="success" class="mb-3">mdi-account-circle</v-icon>
                  <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-2">Informations personnelles</h2>
                  <p class="text-body-1 text-grey-darken-2">Parlez-nous de vous</p>
                </div>
                
                <v-form ref="personalInfoForm" v-model="personalInfoValid">
                  <v-row>
                    <v-col cols="12">
                      <v-text-field
                        v-model="onboardingData.phone"
                        label="Numéro de téléphone"
                        prepend-inner-icon="mdi-phone"
                        variant="outlined"
                        :rules="[rules.phone]"
                        density="comfortable"
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12">
                      <v-select
                        v-model="onboardingData.country"
                        :items="africanCountries"
                        label="Pays"
                        prepend-inner-icon="mdi-earth"
                        variant="outlined"
                        :rules="[rules.required]"
                        density="comfortable"
                      ></v-select>
                    </v-col>
                    
                    <v-col cols="12">
                      <v-text-field
                        v-model="onboardingData.city"
                        label="Ville"
                        prepend-inner-icon="mdi-city"
                        variant="outlined"
                        :rules="[rules.required]"
                        density="comfortable"
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12">
                      <v-text-field
                        v-model="onboardingData.location"
                        label="Localisation/Région"
                        prepend-inner-icon="mdi-map-marker"
                        variant="outlined"
                        :rules="[rules.required]"
                        density="comfortable"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </v-form>
              </div>
            </template>

            <!-- Étape 2: Profil professionnel -->
            <template #item.2>
              <div class="pa-6">
                <div class="text-center mb-6">
                  <v-icon size="48" color="info" class="mb-3">mdi-briefcase</v-icon>
                  <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-2">Profil professionnel</h2>
                  <p class="text-body-1 text-grey-darken-2">Votre expertise dans l'économie verte</p>
                </div>
                
                <v-form ref="professionalForm" v-model="professionalValid">
                  <v-row>
                    <v-col cols="12">
                      <v-select
                        v-model="onboardingData.userType"
                        :items="userTypes"
                        label="Type d'utilisateur"
                        prepend-inner-icon="mdi-account-group"
                        variant="outlined"
                        :rules="[rules.required]"
                        density="comfortable"
                      ></v-select>
                    </v-col>
                    
                    <v-col cols="12">
                      <v-text-field
                        v-model="onboardingData.organization"
                        label="Organisation / Entreprise"
                        prepend-inner-icon="mdi-domain"
                        variant="outlined"
                        density="comfortable"
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12">
                      <v-text-field
                        v-model="onboardingData.position"
                        label="Poste / Fonction"
                        prepend-inner-icon="mdi-badge-account"
                        variant="outlined"
                        density="comfortable"
                      ></v-text-field>
                    </v-col>
                    
                    <v-col cols="12">
                      <v-select
                        v-model="onboardingData.sectors"
                        :items="greenSectors"
                        label="Secteurs d'intérêt"
                        prepend-inner-icon="mdi-leaf"
                        variant="outlined"
                        multiple
                        chips
                        :rules="[rules.required]"
                        density="comfortable"
                      ></v-select>
                    </v-col>
                    
                    <v-col cols="12">
                      <v-textarea
                        v-model="onboardingData.bio"
                        label="Présentation (optionnel)"
                        prepend-inner-icon="mdi-text"
                        variant="outlined"
                        rows="3"
                        counter="500"
                        density="comfortable"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </v-form>
              </div>
            </template>

            <!-- Étape 3: Objectifs et intérêts -->
            <template #item.3>
              <div class="pa-6">
                <div class="text-center mb-6">
                  <v-icon size="48" color="warning" class="mb-3">mdi-target</v-icon>
                  <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-2">Vos objectifs</h2>
                  <p class="text-body-1 text-grey-darken-2">Comment PEVA peut vous aider</p>
                </div>
                
                <v-form ref="objectivesForm" v-model="objectivesValid">
                  <div class="mb-6 px-4">
                    <h3 class="text-h6 font-weight-medium text-grey-darken-3 mb-4">Que souhaitez-vous accomplir sur PEVA ?</h3>
                    <v-checkbox
                      v-for="goal in platformGoals"
                      :key="goal.value"
                      v-model="onboardingData.goals"
                      :value="goal.value"
                      :label="goal.text"
                      density="comfortable"
                      class="mb-1"
                    ></v-checkbox>
                    <div v-if="onboardingData.goals.length === 0" class="text-error text-caption mt-2">
                      Veuillez sélectionner au moins un objectif
                    </div>
                  </div>
                  
                  <div class="mb-6">
                    <h3 class="text-h6 font-weight-medium text-grey-darken-3 mb-4">Objectifs de Développement Durable prioritaires</h3>
                    <div class="d-flex flex-wrap gap-2">
                      <v-chip
                        v-for="sdg in sdgObjectives"
                        :key="sdg.value"
                        :color="onboardingData.sdgPriorities.includes(sdg.value) ? 'success' : 'default'"
                        :variant="onboardingData.sdgPriorities.includes(sdg.value) ? 'flat' : 'outlined'"
                        @click="toggleSDG(sdg.value)"
                        class="cursor-pointer"
                      >
                        <v-icon start>{{ sdg.icon }}</v-icon>
                        {{ sdg.text }}
                      </v-chip>
                    </div>
                    <div v-if="onboardingData.sdgPriorities.length === 0" class="text-error text-caption mt-2">
                      Veuillez sélectionner au moins un objectif de développement durable
                    </div>
                  </div>
                  
                  <!-- Champs cachés pour la validation -->
                  <v-text-field
                    v-model="goalsValidation"
                    style="display: none;"
                    :rules="[rules.goalsRequired]"
                  ></v-text-field>
                  
                  <v-text-field
                    v-model="sdgValidation"
                    style="display: none;"
                    :rules="[rules.sdgRequired]"
                  ></v-text-field>
                  
                  <v-select
                    v-model="onboardingData.experienceLevel"
                    :items="experienceLevels"
                    label="Niveau d'expérience dans l'économie verte"
                    prepend-inner-icon="mdi-chart-line"
                    variant="outlined"
                    :rules="[rules.required]"
                    density="comfortable"
                  ></v-select>
                </v-form>
              </div>
            </template>

            <!-- Étape 4: Préférences et finalisation -->
            <template #item.4>
              <div class="pa-6">
                <div class="text-center mb-6">
                  <v-icon size="48" color="secondary" class="mb-3">mdi-cog</v-icon>
                  <h2 class="text-h5 font-weight-bold text-grey-darken-3 mb-2">Préférences</h2>
                  <p class="text-body-1 text-grey-darken-2">Personnalisez votre expérience</p>
                </div>
                
                <v-form ref="preferencesForm" v-model="preferencesValid">
                  <div class="mb-6">
                    <h3 class="text-h6 font-weight-medium text-grey-darken-3 mb-4">Notifications</h3>
                    <v-switch
                      v-model="onboardingData.notifications.email"
                      label="Notifications par email"
                      color="success"
                      density="comfortable"
                      class="mb-2"
                    ></v-switch>
                    <v-switch
                      v-model="onboardingData.notifications.push"
                      label="Notifications push"
                      color="success"
                      density="comfortable"
                      class="mb-2"
                    ></v-switch>
                    <v-switch
                      v-model="onboardingData.notifications.newsletter"
                      label="Newsletter 2iE Green HUB"
                      color="success"
                      density="comfortable"
                      class="mb-2"
                    ></v-switch>
                  </div>
                  
                  <div class="mb-6">
                    <h3 class="text-h6 font-weight-medium text-grey-darken-3 mb-4">Langue préférée</h3>
                    <v-select
                      v-model="onboardingData.language"
                      :items="languages"
                      label="Langue"
                      prepend-inner-icon="mdi-translate"
                      variant="outlined"
                      :rules="[rules.required]"
                      density="comfortable"
                    ></v-select>
                  </div>
                  
                  <div class="mb-6">
                    <h3 class="text-h6 font-weight-medium text-grey-darken-3 mb-4">Confidentialité</h3>
                    <v-switch
                      v-model="onboardingData.privacy.profilePublic"
                      label="Profil public"
                      color="info"
                      density="comfortable"
                      class="mb-2"
                    ></v-switch>
                    <v-switch
                      v-model="onboardingData.privacy.showInDirectory"
                      label="Apparaître dans l'annuaire"
                      color="info"
                      density="comfortable"
                      class="mb-2"
                    ></v-switch>
                  </div>
                </v-form>
                

              </div>
            </template>
          </v-stepper>
        </template>
      </AppCard>

      <!-- Navigation -->
      <div class="d-flex justify-space-between align-center">
        <AppButton 
          v-if="currentStep > 1"
          @click="previousStep"
          variant="outlined"
          prepend-icon="mdi-arrow-left"
        >
          Précédent
        </AppButton>
        <div v-else></div>
        
        <div class="d-flex align-center">
          <div class="text-body-2 text-grey-darken-2 mr-4">
            Étape {{ currentStep }} sur {{ stepperItems.length }}
          </div>
          
          <AppButton 
            v-if="currentStep < stepperItems.length"
            @click="nextStep"
            :disabled="!canProceed"
            append-icon="mdi-arrow-right"
            class="ml-2"
          >
            Suivant
          </AppButton>
          
          <AppButton 
            v-else
            @click="completeOnboarding"
            :loading="isCompleting"
            :disabled="!canComplete"
            color="success"
            append-icon="mdi-check"
            class="ml-2"
          >
            Terminer
          </AppButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AppCard from '@/components/ui/AppCard.vue'
import AppButton from '@/components/ui/AppButton.vue'

const router = useRouter()
const authStore = useAuthStore()

// État du stepper
const currentStep = ref(1)
const isCompleting = ref(false)

// Validation des formulaires
const personalInfoValid = ref(false)
const professionalValid = ref(false)
const objectivesValid = ref(false)
const preferencesValid = ref(false)

// Configuration du stepper
const stepperItems = ref([
  { title: 'Informations personnelles', value: 1 },
  { title: 'Profil professionnel', value: 2 },
  { title: 'Objectifs', value: 3 },
  { title: 'Préférences', value: 4 }
])

// Données d'onboarding
const onboardingData = ref({
  phone: '',
  country: '',
  location: '',
            city: '',
  userType: '',
  organization: '',
  position: '',
  sectors: [],
  bio: '',
  goals: [],
  sdgPriorities: [],
  experienceLevel: '',
  notifications: {
    email: true,
    push: true,
    newsletter: true
  },
  language: 'fr',
  privacy: {
    profilePublic: true,
    showInDirectory: true
  }
})

// Propriétés computed pour la validation
const goalsValidation = computed(() => {
  return onboardingData.value.goals.length > 0 ? 'valid' : ''
})

const sdgValidation = computed(() => {
  return onboardingData.value.sdgPriorities.length > 0 ? 'valid' : ''
})

// Règles de validation
const rules = {
  required: value => !!value || 'Ce champ est requis',
  phone: value => {
    const pattern = /^[+]?[0-9\s-()]+$/
    return !value || pattern.test(value) || 'Numéro de téléphone invalide'
  },
  goalsRequired: value => {
    return onboardingData.value.goals.length > 0 || 'Veuillez sélectionner au moins un objectif'
  },
  sdgRequired: value => {
    return onboardingData.value.sdgPriorities.length > 0 || 'Veuillez sélectionner au moins un objectif de développement durable'
  }
}

// Options de sélection
const africanCountries = [
  'Afrique du Sud', 'Algérie', 'Angola', 'Bénin', 'Botswana', 'Burkina Faso', 'Burundi',
  'Cameroun', 'Cap-Vert', 'Comores', 'Côte d\'Ivoire', 'Djibouti',
  'Égypte', 'Érythrée', 'Eswatini', 'Éthiopie', 
  'Gabon', 'Gambie', 'Ghana', 'Guinée', 'Guinée équatoriale', 'Guinée-Bissau',
  'Kenya', 'Lesotho', 'Libéria', 'Libye',
  'Madagascar', 'Malawi', 'Mali', 'Maroc', 'Maurice', 'Mauritanie', 'Mozambique',
  'Namibie', 'Niger', 'Nigéria', 'Ouganda',
  'République centrafricaine', 'République démocratique du Congo', 'République du Congo', 'Rwanda',
  'São Tomé-et-Príncipe', 'Sénégal', 'Seychelles', 'Sierra Leone', 'Somalie', 'Soudan', 'Soudan du Sud',
  'Tanzanie', 'Tchad', 'Togo', 'Tunisie',
  'Zambie', 'Zimbabwe',
  'Autre'
]

const userTypes = [
  { title: 'Entrepreneur', value: 'entrepreneur' },
  { title: 'Investisseur', value: 'investor' },
  { title: 'Chercheur/Académique', value: 'researcher' },
  { title: 'ONG/Association', value: 'ngo' },
  { title: 'Institution publique', value: 'public' },
  { title: 'Consultant', value: 'consultant' },
  { title: 'Étudiant', value: 'student' },
  { title: 'Autre', value: 'other' }
]

const greenSectors = [
  'Agroalimentaire', 'Agriculture durable', 'Énergies renouvelables', 
  'Gestion des déchets', 'Eau et assainissement', 'Transport durable', 
  'Construction verte', 'Économie circulaire', 'Biodiversité et conservation', 
  'Financement vert', 'Technologies propres', 'Éducation environnementale', 
  'Écotourisme'
]

const platformGoals = [
  { text: 'Trouver des partenaires pour mes projets', value: 'find_partners' },
  { text: 'Accéder à des financements', value: 'access_funding' },
  { text: 'Partager mes connaissances', value: 'share_knowledge' },
  { text: 'Apprendre de nouvelles compétences', value: 'learn_skills' },
  { text: 'Développer mon réseau professionnel', value: 'network' },
  { text: 'Promouvoir mes solutions', value: 'promote_solutions' },
  { text: 'Participer à des événements', value: 'attend_events' },
  { text: 'Contribuer aux discussions', value: 'contribute_discussions' }
]

const sdgObjectives = [
  { text: 'Énergie propre', value: 'sdg7', icon: 'mdi-lightning-bolt' },
  { text: 'Action climatique', value: 'sdg13', icon: 'mdi-earth' },
  { text: 'Vie terrestre', value: 'sdg15', icon: 'mdi-tree' },
  { text: 'Eau propre', value: 'sdg6', icon: 'mdi-water' },
  { text: 'Villes durables', value: 'sdg11', icon: 'mdi-city' },
  { text: 'Consommation responsable', value: 'sdg12', icon: 'mdi-recycle' },
  { text: 'Innovation', value: 'sdg9', icon: 'mdi-lightbulb' },
  { text: 'Partenariats', value: 'sdg17', icon: 'mdi-handshake' }
]

const experienceLevels = [
  { title: 'Débutant (moins de 1 an)', value: 'beginner' },
  { title: 'Intermédiaire (1-3 ans)', value: 'intermediate' },
  { title: 'Expérimenté (3-7 ans)', value: 'experienced' },
  { title: 'Expert (plus de 7 ans)', value: 'expert' }
]

const languages = [
  { title: 'Français', value: 'fr' },
  { title: 'English', value: 'en' },
  { title: 'العربية', value: 'ar' },
  { title: 'Português', value: 'pt' },
  { title: 'Español', value: 'es' }
]

// Computed properties
const canProceed = computed(() => {
  switch (currentStep.value) {
    case 1: return personalInfoValid.value
    case 2: return professionalValid.value
    case 3: return objectivesValid.value
    case 4: return preferencesValid.value
    default: return false
  }
})

const canComplete = computed(() => {
  return personalInfoValid.value && 
         professionalValid.value && 
         objectivesValid.value && 
         preferencesValid.value &&
         onboardingData.value.goals.length > 0 &&
         onboardingData.value.sdgPriorities.length > 0
})

// Méthodes
const nextStep = () => {
  if (currentStep.value < stepperItems.value.length) {
    currentStep.value++
  }
}

const previousStep = () => {
  if (currentStep.value > 1) {
    currentStep.value--
  }
}

const toggleSDG = (sdgValue) => {
  const index = onboardingData.value.sdgPriorities.indexOf(sdgValue)
  if (index > -1) {
    onboardingData.value.sdgPriorities.splice(index, 1)
  } else {
    onboardingData.value.sdgPriorities.push(sdgValue)
  }
}

const completeOnboarding = async () => {
  if (!canComplete.value) {
    console.warn('Impossible de terminer l\'onboarding - validation échouée')
    return
  }
  
  isCompleting.value = true
  
  try {
    console.log('Début de la finalisation de l\'onboarding...')
    console.log('Utilisateur actuel:', authStore.user)
    
    // Validation finale des données requises
    if (onboardingData.value.goals.length === 0) {
      throw new Error('Veuillez sélectionner au moins un objectif')
    }
    
    if (onboardingData.value.sdgPriorities.length === 0) {
      throw new Error('Veuillez sélectionner au moins un objectif de développement durable')
    }
    
    // Sauvegarder toutes les données d'onboarding
    const profileData = {
      phone: onboardingData.value.phone || null,
      country: onboardingData.value.country || null,
      location: onboardingData.value.location || null,
      city: onboardingData.value.city || null,
      user_type: onboardingData.value.userType || null,
      organization: onboardingData.value.organization || null,
      position: onboardingData.value.position || null,
      sectors: onboardingData.value.sectors || [],
      bio: onboardingData.value.bio || null,
      goals: onboardingData.value.goals || [],
      sdg_priorities: onboardingData.value.sdgPriorities || [],
      experience_level: onboardingData.value.experienceLevel || null,
      notifications: onboardingData.value.notifications || { email: true, push: true, newsletter: true },
      language: onboardingData.value.language || 'fr',
      privacy: onboardingData.value.privacy || { profilePublic: true, showInDirectory: true },
      onboarding_completed: true
    }
    
    console.log('Données à sauvegarder:', profileData)
    
    await authStore.updateProfile(profileData)
    
    console.log('Profil mis à jour avec succès')
    
    // Attendre un peu pour s'assurer que la mise à jour est terminée
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Rediriger vers la page d'accueil après completion de l'onboarding
    router.push('/')
  } catch (error) {
    console.error('Erreur lors de la finalisation de l\'onboarding:', error)
    console.error('Détails de l\'erreur:', error.message)
    console.error('Code d\'erreur:', error.code)
    
    // Afficher un message d'erreur plus détaillé à l'utilisateur
    let errorMessage = 'Erreur lors de la sauvegarde. '
    
    if (error.message.includes('column') && error.message.includes('does not exist')) {
      errorMessage += 'Il semble que la base de données ne soit pas à jour. Veuillez contacter l\'administrateur.'
    } else if (error.message.includes('row-level security')) {
      errorMessage += 'Problème de permissions. Veuillez vous reconnecter et réessayer.'
    } else if (error.message.includes('sélectionner au moins')) {
      errorMessage = error.message
    } else if (error.message.includes('first_name') && error.message.includes('not-null constraint')) {
      errorMessage += 'Problème avec les informations de base. Veuillez vous reconnecter et réessayer.'
    } else if (error.code === '23502') {
      errorMessage += 'Certaines informations requises sont manquantes. Veuillez vérifier vos données.'
    } else {
      errorMessage += 'Veuillez réessayer dans quelques instants.'
    }
    
    alert(errorMessage)
  } finally {
    isCompleting.value = false
  }
}

// Initialisation
onMounted(async () => {
  // Attendre que l'auth store soit initialisé
  if (!authStore.initialized) {
    await authStore.initialize()
  }
  
  // Si l'utilisateur est admin, le rediriger vers le dashboard admin
  // (les admins n'ont pas besoin de faire l'onboarding)
  if (authStore.isAdmin && authStore.isAuthenticated) {
    console.log('Utilisateur admin, redirection vers le dashboard admin')
    router.push('/admin/dashboard')
    return
  }
  
  // Vérifier si l'utilisateur a déjà complété l'onboarding
  if (authStore.hasCompletedOnboarding) {
    console.log('Utilisateur déjà onboardé, redirection vers la page d\'accueil')
    router.push('/')
    return
  }
  
  // Pré-remplir avec les données utilisateur existantes si disponibles
  if (authStore.user?.email) {
    // TODO: Charger les données existantes du profil
  }
})
</script>