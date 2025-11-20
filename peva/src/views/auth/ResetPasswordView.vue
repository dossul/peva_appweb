<template>
  <div class="d-flex align-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 py-12 px-4" style="min-height: 100vh;">
    <div style="max-width: 28rem; width: 100%;">
      <div class="text-center">
        <div class="mx-auto d-flex align-center justify-center mb-4" style="cursor: pointer;" @click="$router.push('/')">
          <img 
            src="@/assets/images/logos/logo_2ie_greenhub.png" 
            alt="2iE GreenHub" 
            style="height: 80px; width: auto;"
          />
        </div>
        <h1 class="mt-6 text-center text-h4 font-weight-black text-grey-darken-4" data-testid="reset-title">
          Réinitialiser
        </h1>
        <p class="mt-2 text-center text-body-2 text-grey-darken-2">
          Pas de souci ! Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
        </p>
      </div>

      <v-card class="mt-8 elevation-8 rounded-lg" style="border: none;">
        <v-card-text class="pa-8">
          <v-form @submit.prevent="handleResetPassword" ref="resetForm" v-if="!emailSent" data-testid="reset-password-form">
            <div class="d-flex flex-column ga-4">
              <v-text-field
                v-model="email"
                :rules="emailRules"
                label="Adresse email"
                type="email"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-email"
                required
                autofocus
              />
            </div>

            <v-btn
              type="submit"
              :loading="loading"
              color="green-darken-2"
              size="large"
              block
              class="mt-6 text-none"
            >
              <v-icon start>mdi-email-send</v-icon>
              Envoyer le lien de réinitialisation
            </v-btn>
          </v-form>

          <!-- Message de confirmation -->
          <div v-else class="text-center d-flex flex-column ga-6">
            <div class="mx-auto d-flex align-center justify-center rounded-circle bg-green-lighten-4" style="height: 64px; width: 64px;">
              <v-icon color="green-darken-2" size="32">mdi-email-check</v-icon>
            </div>
            <div>
              <h3 class="text-h6 font-weight-bold text-grey-darken-3 mb-2">
                Vérifiez votre email
              </h3>
              <p class="text-body-2 text-grey-darken-1 mb-4">
                Nous avons envoyé un lien de réinitialisation à :
              </p>
              <v-chip
                color="grey-lighten-3"
                class="text-body-2 font-weight-medium"
              >
                {{ email }}
              </v-chip>
            </div>
            <div class="d-flex flex-column ga-4">
              <p class="text-body-2 text-grey-darken-1">
                Cliquez sur le lien dans l'email pour réinitialiser votre mot de passe. Si vous ne voyez pas l'email, vérifiez votre dossier spam.
              </p>
              <v-btn
                @click="emailSent = false"
                variant="outlined"
                color="green-darken-2"
                class="text-none"
              >
                <v-icon start>mdi-email-sync</v-icon>
                Renvoyer l'email
              </v-btn>
            </div>
          </div>

          <div class="mt-8 d-flex flex-column ga-4 text-center">
            <router-link
              to="/auth/login"
              class="text-body-2 text-green-darken-2 text-decoration-none d-flex align-center justify-center ga-1"
            >
              <v-icon size="small">mdi-arrow-left</v-icon>
              Retour à la connexion
            </router-link>
            
            <v-divider class="my-2"></v-divider>
            
            <router-link 
              to="/" 
              class="text-body-2 text-grey-darken-1 text-decoration-none d-flex align-center justify-center ga-1"
            >
              <v-icon size="small">mdi-home</v-icon>
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
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

// État du composant
const resetForm = ref(null)
const email = ref('')
const loading = ref(false)
const emailSent = ref(false)

const snackbar = reactive({
  show: false,
  message: '',
  color: 'error'
})

// Règles de validation
const emailRules = [
  v => !!v || 'L\'email est requis',
  v => /.+@.+\..+/.test(v) || 'L\'email doit être valide'
]

// Méthodes
const showMessage = (message, color = 'error') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

const handleResetPassword = async () => {
  const { valid } = await resetForm.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await authStore.resetPassword(email.value)
    emailSent.value = true
  } catch (error) {
    showMessage(error.message || 'Erreur lors de l\'envoi de l\'email de réinitialisation')
  } finally {
    loading.value = false
  }
}
</script>