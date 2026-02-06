<template>
  <div class="min-h-screen d-flex align-center justify-center hero-section pa-4">
    <div style="max-width: 28rem; width: 100%;">
      <div class="text-center">
        <!-- Loading state -->
        <template v-if="loading">
          <v-progress-circular
            indeterminate
            color="green-darken-2"
            size="64"
            class="mb-6"
          />
          <h2 class="text-h5 font-weight-bold text-grey-darken-4">
            Vérification en cours...
          </h2>
          <p class="mt-2 text-body-2 text-grey-darken-2">
            Veuillez patienter pendant que nous vérifions votre compte.
          </p>
        </template>

        <!-- Success state -->
        <template v-else-if="status === 'success'">
          <div class="mx-auto d-flex align-center justify-center rounded-circle elevation-4 mb-6" 
               style="height: 80px; width: 80px; background: linear-gradient(135deg, #4ade80 0%, #10b981 100%);">
            <v-icon color="white" size="48">mdi-check-circle</v-icon>
          </div>
          <h2 class="text-h4 font-weight-black text-grey-darken-4">
            Email confirmé !
          </h2>
          <p class="mt-2 text-body-1 text-grey-darken-2">
            Votre adresse email a été vérifiée avec succès.
          </p>
        </template>

        <!-- Error state -->
        <template v-else-if="status === 'error'">
          <div class="mx-auto d-flex align-center justify-center rounded-circle elevation-4 mb-6" 
               style="height: 80px; width: 80px; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);">
            <v-icon color="white" size="48">mdi-alert-circle</v-icon>
          </div>
          <h2 class="text-h4 font-weight-black text-grey-darken-4">
            Erreur de vérification
          </h2>
          <p class="mt-2 text-body-1 text-grey-darken-2">
            {{ errorMessage }}
          </p>
        </template>
      </div>

      <!-- Card avec actions -->
      <v-card v-if="!loading" class="mt-8 elevation-8 rounded-lg" style="border: none;">
        <v-card-text class="pa-8">
          <template v-if="status === 'success'">
            <v-alert type="success" variant="tonal" class="mb-6">
              <div class="d-flex align-center">
                <v-icon class="mr-2">mdi-party-popper</v-icon>
                <span>Bienvenue sur 2iE GreenHub ! Vous pouvez maintenant vous connecter.</span>
              </div>
            </v-alert>
            
            <v-btn
              @click="goToLogin"
              color="green-darken-2"
              size="large"
              block
              class="text-none"
            >
              <v-icon start>mdi-login</v-icon>
              Se connecter
            </v-btn>
          </template>

          <template v-else-if="status === 'error'">
            <v-alert type="error" variant="tonal" class="mb-6">
              <div>
                <strong>Que faire ?</strong>
                <ul class="mt-2 ml-4">
                  <li>Vérifiez que le lien n'a pas expiré</li>
                  <li>Demandez un nouveau lien de confirmation</li>
                  <li>Contactez le support si le problème persiste</li>
                </ul>
              </div>
            </v-alert>
            
            <div class="d-flex flex-column ga-3">
              <v-btn
                @click="goToRegister"
                variant="outlined"
                color="green-darken-2"
                size="large"
                block
                class="text-none"
              >
                <v-icon start>mdi-account-plus</v-icon>
                Créer un nouveau compte
              </v-btn>
              
              <v-btn
                @click="goToLogin"
                variant="text"
                color="green-darken-2"
                size="large"
                block
                class="text-none"
              >
                <v-icon start>mdi-login</v-icon>
                Aller à la connexion
              </v-btn>
            </div>
          </template>
        </v-card-text>
      </v-card>

      <!-- Countdown pour redirection automatique -->
      <div v-if="status === 'success' && countdown > 0" class="mt-4 text-center">
        <p class="text-body-2 text-grey-darken-2">
          Redirection automatique vers la connexion dans {{ countdown }} secondes...
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const route = useRoute()

const loading = ref(true)
const status = ref('') // 'success' | 'error'
const errorMessage = ref('')
const countdown = ref(5)
let countdownInterval = null

const goToLogin = () => {
  router.push('/auth/login')
}

const goToRegister = () => {
  router.push('/auth/register')
}

const startCountdown = () => {
  countdownInterval = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownInterval)
      goToLogin()
    }
  }, 1000)
}

const handleCallback = async () => {
  try {
    // Récupérer les paramètres de l'URL
    const hashParams = new URLSearchParams(window.location.hash.substring(1))
    const queryParams = route.query
    
    // Vérifier si c'est une confirmation d'email (type=signup ou type=email)
    const type = hashParams.get('type') || queryParams.type
    const accessToken = hashParams.get('access_token') || queryParams.access_token
    const refreshToken = hashParams.get('refresh_token') || queryParams.refresh_token
    const error = hashParams.get('error') || queryParams.error
    const errorDescription = hashParams.get('error_description') || queryParams.error_description
    
    console.log('Auth callback params:', { type, accessToken: !!accessToken, error })
    
    // Gérer les erreurs de Supabase
    if (error) {
      status.value = 'error'
      errorMessage.value = errorDescription || 'Une erreur est survenue lors de la vérification.'
      loading.value = false
      return
    }
    
    // Si on a des tokens, établir la session
    if (accessToken && refreshToken) {
      const { data, error: sessionError } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      })
      
      if (sessionError) {
        console.error('Session error:', sessionError)
        status.value = 'error'
        errorMessage.value = 'Erreur lors de l\'établissement de la session.'
        loading.value = false
        return
      }
      
      console.log('Session établie:', data.user?.email)
    }
    
    // Vérifier la session actuelle
    const { data: { session } } = await supabase.auth.getSession()
    
    if (session?.user) {
      // L'utilisateur est connecté et son email est confirmé
      status.value = 'success'
      loading.value = false
      startCountdown()
    } else {
      // Pas de session mais c'était peut-être une confirmation réussie
      // Vérifier si c'est un callback de confirmation email
      if (type === 'signup' || type === 'email' || type === 'email_change') {
        status.value = 'success'
        loading.value = false
        startCountdown()
      } else {
        // Type inconnu ou pas de session
        status.value = 'error'
        errorMessage.value = 'Le lien de confirmation est invalide ou a expiré.'
        loading.value = false
      }
    }
  } catch (err) {
    console.error('Callback error:', err)
    status.value = 'error'
    errorMessage.value = err.message || 'Une erreur inattendue est survenue.'
    loading.value = false
  }
}

onMounted(() => {
  handleCallback()
})

onUnmounted(() => {
  if (countdownInterval) {
    clearInterval(countdownInterval)
  }
})
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
}
</style>
