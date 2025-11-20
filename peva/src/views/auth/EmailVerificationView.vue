<template>
  <div class="tw-min-h-screen tw-flex tw-items-center tw-justify-center tw-bg-gradient-to-br tw-from-green-50 tw-to-emerald-100 tw-py-12 tw-px-4 sm:tw-px-6 lg:tw-px-8">
    <div class="tw-max-w-md tw-w-full tw-space-y-8">
      <div class="tw-text-center">
        <div class="tw-mx-auto tw-h-16 tw-w-16 tw-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-gradient-to-r tw-from-green-500 tw-to-emerald-600 tw-shadow-lg">
          <v-icon color="white" size="32">mdi-email-check</v-icon>
        </div>
        <h2 class="tw-mt-6 tw-text-center tw-text-3xl tw-font-extrabold tw-text-gray-900">
          Vérifiez votre email
        </h2>
        <p class="tw-mt-2 tw-text-center tw-text-sm tw-text-gray-600">
          Nous avons envoyé un email de vérification à votre adresse
        </p>
      </div>

      <v-card class="tw-mt-8 tw-shadow-xl tw-border-0" elevation="0">
        <v-card-text class="tw-p-8">
          <div class="tw-text-center tw-space-y-6">
            <div class="tw-mx-auto tw-h-20 tw-w-20 tw-flex tw-items-center tw-justify-center tw-rounded-full tw-bg-green-100">
              <v-icon color="green" size="40">mdi-email-outline</v-icon>
            </div>
            
            <div>
              <h3 class="tw-text-xl tw-font-semibold tw-text-gray-900 tw-mb-2">
                Confirmez votre adresse email
              </h3>
              <p class="tw-text-sm tw-text-gray-600 tw-mb-4">
                Un email de vérification a été envoyé à :
              </p>
              <p class="tw-text-sm tw-font-medium tw-text-gray-900 tw-bg-gray-50 tw-px-4 tw-py-2 tw-rounded-lg tw-inline-block">
                {{ userEmail }}
              </p>
            </div>
            
            <div class="tw-space-y-4">
              <div class="tw-bg-blue-50 tw-border tw-border-blue-200 tw-rounded-lg tw-p-4">
                <div class="tw-flex tw-items-start tw-space-x-3">
                  <v-icon color="blue" size="20" class="tw-mt-0.5">mdi-information</v-icon>
                  <div class="tw-text-left">
                    <h4 class="tw-text-sm tw-font-medium tw-text-blue-900 tw-mb-1">
                      Étapes suivantes :
                    </h4>
                    <ol class="tw-text-sm tw-text-blue-800 tw-space-y-1 tw-list-decimal tw-list-inside">
                      <li>Ouvrez votre boîte email</li>
                      <li>Recherchez l'email de PEVA</li>
                      <li>Cliquez sur le lien de vérification</li>
                      <li>Revenez ici pour vous connecter</li>
                    </ol>
                  </div>
                </div>
              </div>
              
              <p class="tw-text-xs tw-text-gray-500">
                Vous ne voyez pas l'email ? Vérifiez votre dossier spam ou courrier indésirable.
              </p>
            </div>
            
            <div class="tw-space-y-3">
              <v-btn
                @click="resendVerificationEmail"
                :loading="loading.resend"
                variant="outlined"
                color="green"
                size="large"
                block
                class="tw-border-2"
              >
                <v-icon start>mdi-email-sync</v-icon>
                Renvoyer l'email de vérification
              </v-btn>
              
              <v-btn
                @click="checkVerificationStatus"
                :loading="loading.check"
                color="green"
                size="large"
                block
                class="tw-bg-gradient-to-r tw-from-green-500 tw-to-emerald-600 tw-shadow-lg hover:tw-shadow-xl tw-transition-all"
              >
                <v-icon start>mdi-refresh</v-icon>
                J'ai vérifié mon email
              </v-btn>
            </div>
          </div>
          
          <div class="tw-mt-8 tw-space-y-4 tw-text-center">
            <router-link
              to="/auth/login"
              class="tw-inline-flex tw-items-center tw-text-sm tw-text-green-600 hover:tw-text-green-700 tw-transition-colors"
            >
              <v-icon start size="16">mdi-arrow-left</v-icon>
              Retour à la connexion
            </router-link>
            
            <div class="tw-pt-4 tw-border-t tw-border-gray-200">
              <router-link to="/" class="tw-inline-flex tw-items-center tw-text-sm tw-text-gray-500 hover:tw-text-gray-700 tw-transition-colors">
                <v-icon start size="16">mdi-home</v-icon>
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
import { ref, reactive, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// État du composant
const userEmail = ref('')
const loading = reactive({
  resend: false,
  check: false
})

const snackbar = reactive({
  show: false,
  message: '',
  color: 'error'
})

// Méthodes
const showMessage = (message, color = 'success') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

const resendVerificationEmail = async () => {
  loading.resend = true
  try {
    await authStore.resendVerificationEmail(userEmail.value)
    showMessage('Email de vérification renvoyé avec succès', 'success')
  } catch (error) {
    showMessage(error.message || 'Erreur lors de l\'envoi de l\'email de vérification', 'error')
  } finally {
    loading.resend = false
  }
}

const checkVerificationStatus = async () => {
  loading.check = true
  try {
    const isVerified = await authStore.checkEmailVerification()
    if (isVerified) {
      showMessage('Email vérifié avec succès ! Redirection...', 'success')
      setTimeout(() => {
        if (authStore.isAdmin) {
          router.push('/admin/dashboard')
        } else if (authStore.hasCompletedOnboarding) {
          router.push('/') // Page d'accueil
        } else {
          router.push('/onboarding') // Compléter l'onboarding
        }
      }, 2000)
    } else {
      showMessage('Email non encore vérifié. Veuillez cliquer sur le lien dans votre email.', 'warning')
    }
  } catch (error) {
    showMessage(error.message || 'Erreur lors de la vérification', 'error')
  } finally {
    loading.check = false
  }
}

// Initialisation
onMounted(() => {
  // Récupérer l'email depuis les paramètres de route ou le store
  userEmail.value = route.query.email || authStore.user?.email || 'votre-email@exemple.com'
})
</script>