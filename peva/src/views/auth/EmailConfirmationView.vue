<template>
  <div class="min-h-screen d-flex align-center justify-center hero-section pa-4">
    <div style="max-width: 28rem; width: 100%;">
      <div class="text-center">
        <div class="mx-auto d-flex align-center justify-center rounded-circle elevation-4" style="height: 64px; width: 64px; background: linear-gradient(135deg, #4ade80 0%, #10b981 100%);">
          <v-icon color="white" size="32">mdi-email-check</v-icon>
        </div>
        <h2 class="mt-6 text-center text-h4 font-weight-black text-grey-darken-4">
          Vérifiez votre email
        </h2>
        <p class="mt-2 text-center text-body-2 text-grey-darken-2">
          Nous avons envoyé un lien de confirmation à votre adresse email. Cliquez sur le lien pour activer votre compte.
        </p>
      </div>

      <v-card class="mt-8 elevation-8 rounded-lg" style="border: none;">
        <v-card-text class="pa-8">
          <div class="text-center">
            <v-icon color="success" size="64" class="mb-4">mdi-email-outline</v-icon>
            <h3 class="text-h6 font-weight-bold mb-4">Email envoyé !</h3>
            <p class="text-body-2 text-grey-darken-1 mb-6">
              Un email de confirmation a été envoyé à <strong>{{ userEmail }}</strong>.
              Veuillez vérifier votre boîte de réception et cliquer sur le lien de confirmation.
            </p>
            
            <v-alert
              type="info"
              variant="tonal"
              class="mb-6 text-left"
            >
              <v-icon slot="prepend">mdi-information</v-icon>
              <div>
                <strong>Conseils :</strong>
                <ul class="mt-2 ml-4">
                  <li>Vérifiez votre dossier spam/courrier indésirable</li>
                  <li>Le lien expire dans {{ expiryHours }} heures</li>
                  <li>Vous pouvez demander un nouveau lien si nécessaire</li>
                </ul>
              </div>
            </v-alert>

            <div class="d-flex flex-column ga-3">
              <v-btn
                @click="resendConfirmation"
                :loading="loading.resend"
                variant="outlined"
                color="primary"
                size="large"
                block
                class="text-none"
              >
                <v-icon start>mdi-email-sync</v-icon>
                Renvoyer l'email de confirmation
              </v-btn>
              
              <v-btn
                @click="goToLogin"
                variant="text"
                color="primary"
                size="large"
                block
                class="text-none"
              >
                <v-icon start>mdi-arrow-left</v-icon>
                Retour à la connexion
              </v-btn>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <!-- Navigation Links -->
      <div class="mt-8 text-center">
        <div class="d-flex align-center justify-center ga-4">
          <router-link to="/" class="text-decoration-none">
            <div class="d-flex align-center ga-2 text-grey-darken-2 hover-text-primary">
              <v-icon size="16">mdi-home</v-icon>
              <span class="text-body-2">Accueil</span>
            </div>
          </router-link>
          
          <v-divider vertical class="mx-2" style="height: 20px;"></v-divider>
          
          <router-link to="/auth/register" class="text-decoration-none">
            <div class="d-flex align-center ga-2 text-grey-darken-2 hover-text-primary">
              <v-icon size="16">mdi-account-plus</v-icon>
              <span class="text-body-2">Créer un compte</span>
            </div>
          </router-link>
        </div>
      </div>
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
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

// État réactif
const userEmail = ref('')
const expiryHours = ref(import.meta.env.VITE_EMAIL_CONFIRMATION_EXPIRY_HOURS || 24)
const loading = ref({
  resend: false
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'error'
})

// Méthodes
const showMessage = (message, color = 'error') => {
  snackbar.value.message = message
  snackbar.value.color = color
  snackbar.value.show = true
}

const resendConfirmation = async () => {
  if (!userEmail.value) {
    showMessage('Adresse email non trouvée')
    return
  }

  loading.value.resend = true
  try {
    await authStore.resendConfirmation(userEmail.value)
    showMessage('Email de confirmation renvoyé avec succès !', 'success')
  } catch (error) {
    showMessage(error.message || 'Erreur lors de l\'envoi de l\'email')
  } finally {
    loading.value.resend = false
  }
}

const goToLogin = () => {
  router.push('/auth/login')
}

// Récupérer l'email depuis les paramètres de route
onMounted(() => {
  userEmail.value = route.query.email || 'votre adresse email'
})
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}

.hover-text-primary:hover {
  color: rgb(var(--v-theme-primary)) !important;
}
</style>