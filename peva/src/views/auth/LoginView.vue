<template>
  <div class="min-h-screen d-flex align-center justify-center hero-section pa-4">
    <div class="w-100" style="max-width: 400px;">
      <div class="text-center mb-8">
        <div class="mx-auto d-flex align-center justify-center mb-4" style="cursor: pointer;" @click="$router.push('/')">
          <img 
            src="@/assets/images/logos/logo_2ie_greenhub.png" 
            alt="2iE GreenHub" 
            style="height: 80px; width: auto;"
          />
        </div>
        <h1 class="text-h4 font-weight-bold text-grey-darken-3 mb-2" data-testid="login-title">
          Connexion
        </h1>
        <p class="text-body-2 text-grey-darken-1">
          Accédez à l'écosystème de l'économie verte en Afrique
        </p>
      </div>

      <v-card elevation="8" rounded="lg" class="pa-6">
        <v-card-text class="pa-0">
          <v-form @submit.prevent="handleLogin" ref="loginForm" data-testid="login-form">
            <div class="d-flex flex-column ga-4">
            </div>
              <!-- Connexion OAuth -->
              <div class="d-flex flex-column ga-3">
                <v-btn
                  @click="signInWithGoogle"
                  :loading="loading.google"
                  variant="outlined"
                  size="large"
                  block
                  class="text-none"
                >
                  <v-icon start color="red">mdi-google</v-icon>
                  Continuer avec Google
                </v-btn>
                
                <v-btn
                  @click="signInWithLinkedIn"
                  :loading="loading.linkedin"
                  variant="outlined"
                  size="large"
                  block
                  class="text-none"
                >
                  <v-icon start color="blue">mdi-linkedin</v-icon>
                  Continuer avec LinkedIn
                </v-btn>
              </div>

              <v-divider class="my-6">
                <span class="text-body-2 text-grey-darken-1">Ou continuer avec</span>
              </v-divider>

              <!-- Formulaire email/password -->
              <div class="d-flex flex-column ga-4">
                <div>
                  <label class="text-body-2 font-weight-medium text-grey-darken-2 mb-2 d-block">Adresse email</label>
                  <v-text-field
                    v-model="form.email"
                    :rules="emailRules"
                    type="email"
                    variant="outlined"
                    prepend-inner-icon="mdi-email"
                    placeholder="votre@email.com"
                    density="comfortable"
                    data-testid="email-input"
                    required
                  />
                </div>

                <div>
                  <label class="text-body-2 font-weight-medium text-grey-darken-2 mb-2 d-block">Mot de passe</label>
                  <v-text-field
                    v-model="form.password"
                    :rules="passwordRules"
                    :type="showPassword ? 'text' : 'password'"
                    variant="outlined"
                    prepend-inner-icon="mdi-lock"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append-inner="showPassword = !showPassword"
                    placeholder="Votre mot de passe"
                    density="comfortable"
                    data-testid="password-input"
                    required
                  />
                </div>

                <div class="d-flex align-center justify-space-between">
                  <v-checkbox
                    v-model="form.rememberMe"
                    label="Se souvenir de moi"
                    density="compact"
                    color="green-darken-2"
                  />
                  
                  <router-link
                    to="/auth/reset-password"
                    class="text-body-2 text-green-darken-2 text-decoration-none"
                  >
                    Mot de passe oublié ?
                  </router-link>
                </div>
              </div>

              <v-btn
                type="submit"
                :loading="loading.email"
                color="green-darken-2"
                size="large"
                block
                class="mt-4 text-none"
                data-testid="login-button"
              >
                <v-icon start>mdi-login</v-icon>
                Se connecter
              </v-btn>
          </v-form>

          <!-- Lien d'inscription -->
          <div class="text-center mt-6">
            <span class="text-body-2 text-grey-darken-2">Pas encore de compte ?</span>
            <router-link
              to="/auth/register"
              class="text-body-2 text-green-darken-2 text-decoration-none font-weight-medium ml-1"
            >
              Créer un compte
            </router-link>
          </div>

          <!-- Lien retour à l'accueil -->
          <div class="text-center mt-4">
            <router-link
              to="/"
              class="text-body-2 text-grey-darken-1 text-decoration-none d-flex align-center justify-center ga-1"
            >
              <v-icon size="small">mdi-arrow-left</v-icon>
              Retour à l'accueil
            </router-link>
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
const loginForm = ref(null)
const showPassword = ref(false)

const form = reactive({
  email: '',
  password: '',
  rememberMe: false
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

// Règles de validation
const emailRules = [
  v => !!v || 'Email requis',
  v => /.+@.+\..+/.test(v) || 'Email invalide'
]

const passwordRules = [
  v => !!v || 'Mot de passe requis',
  v => v.length >= 6 || 'Minimum 6 caractères'
]

// Méthodes
const showMessage = (message, color = 'error') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

const handleLogin = async () => {
  const { valid } = await loginForm.value.validate()
  if (!valid) return

  loading.email = true
  try {
    await authStore.signIn(form.email, form.password)
    showMessage('Connexion réussie !', 'success')
    
    // Redirection intelligente selon le rôle et le statut d'onboarding
    if (authStore.isAdmin) {
      router.push('/admin/dashboard')
    } else if (authStore.hasCompletedOnboarding) {
      router.push('/') // Page d'accueil avec le beau header
    } else {
      router.push('/onboarding') // Utilisateur doit compléter son onboarding
    }
  } catch (error) {
    showMessage(error.message || 'Erreur lors de la connexion')
  } finally {
    loading.email = false
  }
}

const signInWithGoogle = async () => {
  loading.google = true
  try {
    await authStore.signInWithOAuth('google')
  } catch (error) {
    showMessage(error.message || 'Erreur lors de la connexion avec Google')
  } finally {
    loading.google = false
  }
}

const signInWithLinkedIn = async () => {
  loading.linkedin = true
  try {
    await authStore.signInWithOAuth('linkedin_oidc')
  } catch (error) {
    showMessage(error.message || 'Erreur lors de la connexion avec LinkedIn')
  } finally {
    loading.linkedin = false
  }
}
</script>