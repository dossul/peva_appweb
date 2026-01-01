<template>
  <div class="d-flex align-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4" style="min-height: 100vh;">
    <div style="max-width: 48rem; width: 100%;">
      <div class="text-center">
        <div class="mx-auto d-flex align-center justify-center mb-4" style="cursor: pointer;" @click="$router.push('/')">
          <img 
            src="@/assets/images/logos/logo_2ie_greenhub.png" 
            alt="2iE GreenHub" 
            style="height: 80px; width: auto;"
          />
        </div>
        <h1 class="mt-6 text-center text-h4 font-weight-black text-grey-darken-4" data-testid="register-title">
          Inscription
        </h1>
        <p class="mt-2 text-center text-body-2 text-grey-darken-2">
          Créez votre compte pour accéder à l'écosystème de l'économie verte en Afrique
        </p>
      </div>

      <v-card class="mt-8 elevation-8 rounded-lg" style="border: none;">
        <v-card-text class="pa-8">
          <!-- Connexion OAuth -->
          <div class="d-flex flex-column ga-3 mb-6">
            <v-btn
              @click="signUpWithGoogle"
              :loading="loading.google"
              variant="outlined"
              size="large"
              block
              class="text-none"
            >
              <v-icon start color="red">mdi-google</v-icon>
              S'inscrire avec Google
            </v-btn>
            
            <v-btn
              @click="signUpWithLinkedIn"
              :loading="loading.linkedin"
              variant="outlined"
              size="large"
              block
              class="text-none"
            >
              <v-icon start color="blue">mdi-linkedin</v-icon>
              S'inscrire avec LinkedIn
            </v-btn>
          </div>

          <v-divider class="my-6">
            <span class="text-body-2 text-grey-darken-1">Ou s'inscrire avec</span>
          </v-divider>

          <!-- Stepper d'inscription -->
          <v-stepper
            v-model="currentStep"
            :items="stepperItems"
            color="green-darken-2"
            class="elevation-0"
            data-testid="register-form"
          >
            <!-- Étape 1: Informations personnelles -->
            <template v-slot:item.1>
              <v-card flat>
                <v-card-title class="text-h6 text-green-darken-2 pb-4">
                  <v-icon start>mdi-account-circle</v-icon>
                  Informations personnelles
                </v-card-title>
                <v-card-text class="pa-0">
                  <v-form ref="step1Form" data-testid="register-form">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="form.firstName"
                          :rules="nameRules"
                          label="Prénom"
                          variant="outlined"
                          prepend-inner-icon="mdi-account"
                          density="comfortable"
                          required
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="form.lastName"
                          :rules="nameRules"
                          label="Nom de famille"
                          variant="outlined"
                          prepend-inner-icon="mdi-account"
                          density="comfortable"
                          required
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="form.email"
                          :rules="emailRules"
                          label="Adresse email"
                          type="email"
                          variant="outlined"
                          prepend-inner-icon="mdi-email"
                          density="comfortable"
                          required
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-card>
            </template>

            <!-- Étape 2: Type de profil -->
            <template v-slot:item.2>
              <v-card flat>
                <v-card-title class="text-h6 text-green-darken-2 pb-4">
                  <v-icon start>mdi-account-group</v-icon>
                  Type de profil
                </v-card-title>
                <v-card-text class="pa-0">
                  <v-form ref="step2Form">
                    <p class="text-body-2 text-grey-darken-2 mb-4">
                      Sélectionnez le type de profil qui correspond le mieux à votre activité
                    </p>
                    <v-radio-group v-model="form.profileType">
                      <v-row>
                        <v-col v-for="type in profileTypes" :key="type.value" cols="12" md="6">
                          <v-radio :value="type.value" color="green-darken-2" class="w-100">
                            <template v-slot:label>
                              <div class="d-flex align-center ga-4 pa-4 rounded border w-100" :class="form.profileType === type.value ? 'bg-green-lighten-5 border-green-darken-2' : 'border-grey-lighten-2'">
                                <v-icon :color="type.color" size="32">{{ type.icon }}</v-icon>
                                <div class="flex-grow-1">
                                  <div class="font-weight-bold text-grey-darken-4 text-body-1">{{ type.title }}</div>
                                  <div class="text-body-2 text-grey-darken-2">{{ type.description }}</div>
                                </div>
                              </div>
                            </template>
                          </v-radio>
                        </v-col>
                      </v-row>
                    </v-radio-group>
                  </v-form>
                </v-card-text>
              </v-card>
            </template>

            <!-- Étape 3: Sécurité et conditions -->
            <template v-slot:item.3>
              <v-card flat>
                <v-card-title class="text-h6 text-green-darken-2 pb-4">
                  <v-icon start>mdi-shield-check</v-icon>
                  Sécurité et conditions
                </v-card-title>
                <v-card-text class="pa-0">
                  <v-form ref="step3Form">
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="form.password"
                          :rules="passwordRules"
                          label="Mot de passe"
                          :type="showPassword ? 'text' : 'password'"
                          variant="outlined"
                          density="comfortable"
                          prepend-inner-icon="mdi-lock"
                          :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append-inner="showPassword = !showPassword"
                          required
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="form.confirmPassword"
                          :rules="confirmPasswordRules"
                          label="Confirmer le mot de passe"
                          :type="showConfirmPassword ? 'text' : 'password'"
                          variant="outlined"
                          density="comfortable"
                          prepend-inner-icon="mdi-lock-check"
                          :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                          @click:append-inner="showConfirmPassword = !showConfirmPassword"
                          required
                        />
                      </v-col>
                      <v-col cols="12" class="py-0">
                        <v-checkbox
                          v-model="form.acceptTerms"
                          :rules="termsRules"
                          color="green-darken-2"
                          required
                        >
                          <template v-slot:label>
                            <span class="text-body-2 text-grey-darken-2">
                              J'accepte les 
                              <a href="/terms" target="_blank" class="text-green-darken-2 text-decoration-underline">
                                conditions d'utilisation
                              </a>
                              et la 
                              <a href="/privacy" target="_blank" class="text-green-darken-2 text-decoration-underline">
                                politique de confidentialité
                              </a>
                            </span>
                          </template>
                        </v-checkbox>
                      </v-col>
                      <v-col cols="12" class="py-0">
                        <v-checkbox
                          v-model="form.newsletter"
                          color="green-darken-2"
                        >
                          <template v-slot:label>
                            <span class="text-body-2 text-grey-darken-2">
                              Je souhaite recevoir la newsletter 2iE Green HUB avec les dernières actualités de l'économie verte
                            </span>
                          </template>
                        </v-checkbox>
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
              </v-card>
            </template>

            <!-- Étape 4: Préférences et intérêts -->
            <template v-slot:item.4>
              <v-card flat>
                <v-card-title class="text-h6 text-green-darken-2 pb-4">
                  <v-icon start>mdi-heart</v-icon>
                  Vos préférences et intérêts
                </v-card-title>
                <v-card-text class="pa-0">
                  <v-form ref="step4Form">
                    <p class="text-body-2 text-grey-darken-2 mb-4">
                      Sélectionnez les domaines qui vous intéressent pour personnaliser votre expérience
                    </p>
                    
                    <v-row>
                      <v-col cols="12" md="6" v-for="preference in userPreferences" :key="preference.value">
                        <v-checkbox
                          v-model="form.preferences"
                          :value="preference.value"
                          color="green-darken-2"
                        >
                          <template v-slot:label>
                            <div class="d-flex align-center ga-2">
                              <v-icon :color="preference.color">{{ preference.icon }}</v-icon>
                              <div>
                                <div class="font-weight-bold text-body-1">{{ preference.title }}</div>
                                <div class="text-body-2 text-grey-darken-2">{{ preference.description }}</div>
                              </div>
                            </div>
                          </template>
                        </v-checkbox>
                      </v-col>
                    </v-row>

                    <v-alert type="info" variant="tonal" class="mt-4">
                      <div class="text-body-2">
                        <v-icon start>mdi-bell-ring</v-icon>
                        Ces préférences vous permettront de recevoir des notifications et des recommandations personnalisées selon vos intérêts.
                      </div>
                    </v-alert>
                  </v-form>
                </v-card-text>
              </v-card>
            </template>

            <!-- Actions du stepper -->
            <template v-slot:actions="{ prev, next }">
              <div class="d-flex justify-space-between mt-6">
                <v-btn
                  v-if="currentStep > 1"
                  @click="prev"
                  variant="outlined"
                  color="green-darken-2"
                  class="text-none"
                >
                  <v-icon start>mdi-arrow-left</v-icon>
                  Précédent
                </v-btn>
                <v-spacer v-else />
                
                <v-btn
                  v-if="currentStep < 4"
                  @click="nextStep"
                  color="green-darken-2"
                  class="text-none"
                >
                  Suivant
                  <v-icon end>mdi-arrow-right</v-icon>
                </v-btn>
                
                <v-btn
                  v-else
                  @click="handleRegister"
                  :loading="loading.email"
                  color="green-darken-2"
                  class="text-none"
                >
                  <v-icon start>mdi-account-plus</v-icon>
                  Créer mon compte
                </v-btn>
              </div>
            </template>
          </v-stepper>

          <div class="mt-8 d-flex flex-column ga-4 text-center">
            <span class="text-body-2 text-grey-darken-2">
              Déjà un compte ?
              <router-link
                to="/auth/login"
                class="font-weight-medium text-green-darken-2 text-decoration-none ml-1"
              >
                Se connecter
              </router-link>
            </span>
            
            <div class="pt-4" style="border-top: 1px solid #e0e0e0;">
              <router-link to="/" class="d-inline-flex align-center text-body-2 text-grey-darken-1 text-decoration-none">
                <v-icon start size="16">mdi-arrow-left</v-icon>
                Retour à l'accueil
              </router-link>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Snackbar pour les messages -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="5000"
      location="top"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn
          color="white"
          variant="text"
          @click="snackbar.show = false"
        >
          Fermer
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Formulaire et état
const registerForm = ref(null)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  profileType: '',
  password: '',
  confirmPassword: '',
  acceptTerms: false,
  newsletter: false,
  preferences: [] // Préférences utilisateur
})

const loading = reactive({
  email: false,
  google: false,
  linkedin: false
})

const snackbar = reactive({
  show: false,
  message: '',
  color: 'error'
})

// Types de profil détaillés
const profileTypes = [
  {
    value: 'entrepreneur',
    title: 'Entrepreneur',
    description: 'Créateur d\'entreprise dans l\'économie verte',
    icon: 'mdi-lightbulb-on',
    color: 'orange'
  },
  {
    value: 'investor',
    title: 'Investisseur',
    description: 'Financeur de projets verts et durables',
    icon: 'mdi-trending-up',
    color: 'green'
  },
  {
    value: 'expert',
    title: 'Expert/Consultant',
    description: 'Spécialiste en développement durable',
    icon: 'mdi-account-tie',
    color: 'blue'
  },
  {
    value: 'organization',
    title: 'Organisation',
    description: 'ONG, institution ou entreprise',
    icon: 'mdi-domain',
    color: 'purple'
  },
  {
    value: 'recruiter',
    title: 'Recruteur',
    description: 'Recherche de talents verts',
    icon: 'mdi-account-search',
    color: 'teal'
  }
]

// Règles de validation
const nameRules = [
  v => !!v || 'Ce champ est requis',
  v => v.length >= 2 || 'Le nom doit contenir au moins 2 caractères'
]

const emailRules = [
  v => !!v || 'L\'email est requis',
  v => /.+@.+\..+/.test(v) || 'L\'email doit être valide'
]

const profileTypeRules = [
  v => !!v || 'Le type de profil est requis'
]

const passwordRules = [
  v => !!v || 'Le mot de passe est requis',
  v => v.length >= 8 || 'Le mot de passe doit contenir au moins 8 caractères',
  v => /(?=.*[a-z])/.test(v) || 'Le mot de passe doit contenir au moins une minuscule',
  v => /(?=.*[A-Z])/.test(v) || 'Le mot de passe doit contenir au moins une majuscule',
  v => /(?=.*\d)/.test(v) || 'Le mot de passe doit contenir au moins un chiffre'
]

const confirmPasswordRules = [
  v => !!v || 'La confirmation est requise',
  v => v === form.password || 'Les mots de passe ne correspondent pas'
]

const termsRules = [
  v => !!v || 'Vous devez accepter les conditions d\'utilisation'
]

// Stepper
const currentStep = ref(1)
const step1Form = ref(null)
const step2Form = ref(null)
const step3Form = ref(null)
const step4Form = ref(null)

const stepperItems = [
  {
    title: 'Informations personnelles',
    value: 1,
    icon: 'mdi-account-circle'
  },
  {
    title: 'Type de profil',
    value: 2,
    icon: 'mdi-account-group'
  },
  {
    title: 'Sécurité',
    value: 3,
    icon: 'mdi-shield-check'
  },
  {
    title: 'Préférences',
    value: 4,
    icon: 'mdi-heart'
  }
]

// Préférences utilisateur
const userPreferences = [
  {
    value: 'energies_renouvelables',
    title: 'Énergies renouvelables',
    description: 'Solaire, éolien, hydraulique',
    icon: 'mdi-solar-power',
    color: 'orange'
  },
  {
    value: 'formations',
    title: 'Formations',
    description: 'Cours, webinaires, certifications',
    icon: 'mdi-school',
    color: 'blue'
  },
  {
    value: 'opportunites_emplois',
    title: 'Opportunités d\'emplois',
    description: 'Offres d\'emploi dans l\'économie verte',
    icon: 'mdi-briefcase',
    color: 'green'
  },
  {
    value: 'gestion_dechets',
    title: 'Gestion des déchets',
    description: 'Recyclage, valorisation, économie circulaire',
    icon: 'mdi-recycle',
    color: 'teal'
  },
  {
    value: 'agriculture_durable',
    title: 'Agriculture durable',
    description: 'Agroécologie, permaculture',
    icon: 'mdi-sprout',
    color: 'lime'
  },
  {
    value: 'finance_verte',
    title: 'Finance verte',
    description: 'Investissements, subventions, crowdfunding',
    icon: 'mdi-cash',
    color: 'purple'
  }
]

// Méthodes
const showMessage = (message, color = 'error') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

const nextStep = async () => {
  let isValid = false
  
  if (currentStep.value === 1) {
    const { valid } = await step1Form.value.validate()
    isValid = valid
  } else if (currentStep.value === 2) {
    const { valid } = await step2Form.value.validate()
    isValid = valid && form.profileType !== ''
  }
  
  if (isValid) {
    currentStep.value++
  } else {
    showMessage('Veuillez remplir tous les champs requis')
  }
}

const handleRegister = async () => {
  const { valid } = await step3Form.value.validate()
  if (!valid) {
    showMessage('Veuillez remplir tous les champs requis')
    return
  }

  loading.email = true
  try {
    await authStore.signUp(form.email, form.password, {
      firstName: form.firstName,
      lastName: form.lastName,
      profileType: form.profileType,
      newsletter: form.newsletter
    })
    
    // Rediriger vers la page de confirmation d'email avec l'adresse email
    router.push({
      name: 'EmailConfirmation',
      query: { email: form.email }
    })
  } catch (error) {
    showMessage(error.message || 'Erreur lors de la création du compte')
  } finally {
    loading.email = false
  }
}

const signUpWithGoogle = async () => {
  loading.google = true
  try {
    await authStore.signInWithOAuth('google')
  } catch (error) {
    showMessage(error.message || 'Erreur lors de l\'inscription avec Google')
  } finally {
    loading.google = false
  }
}

const signUpWithLinkedIn = async () => {
  loading.linkedin = true
  try {
    await authStore.signInWithOAuth('linkedin_oidc')
  } catch (error) {
    showMessage(error.message || 'Erreur lors de l\'inscription avec LinkedIn')
  } finally {
    loading.linkedin = false
  }
}
</script>