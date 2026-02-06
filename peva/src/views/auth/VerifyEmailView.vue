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
            Confirmation de votre adresse email.
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
            Votre compte a été activé avec succès.
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
                <span>Bienvenue sur 2iE GreenHub ! Connectez-vous maintenant.</span>
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
            <v-alert type="warning" variant="tonal" class="mb-6">
              <div>
                <strong>Le lien peut avoir expiré.</strong>
                <p class="mt-2 mb-0">Essayez de vous connecter directement ou demandez un nouveau lien.</p>
              </div>
            </v-alert>
            
            <div class="d-flex flex-column ga-3">
              <v-btn
                @click="goToLogin"
                color="green-darken-2"
                size="large"
                block
                class="text-none"
              >
                <v-icon start>mdi-login</v-icon>
                Essayer de se connecter
              </v-btn>
              
              <v-btn
                @click="resendEmail"
                :loading="resending"
                variant="outlined"
                color="green-darken-2"
                size="large"
                block
                class="text-none"
              >
                <v-icon start>mdi-email-sync</v-icon>
                Renvoyer l'email
              </v-btn>
            </div>
          </template>
        </v-card-text>
      </v-card>

      <!-- Countdown -->
      <div v-if="status === 'success' && countdown > 0" class="mt-4 text-center">
        <p class="text-body-2 text-grey-darken-2">
          Redirection dans {{ countdown }} secondes...
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
const status = ref('')
const errorMessage = ref('')
const countdown = ref(5)
const resending = ref(false)
const userEmail = ref('')
let countdownInterval = null

const goToLogin = () => {
  router.push('/auth/login')
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

const resendEmail = async () => {
  if (!userEmail.value) {
    errorMessage.value = 'Email non trouvé'
    return
  }
  
  resending.value = true
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email: userEmail.value
    })
    
    if (error) throw error
    
    status.value = 'success'
    errorMessage.value = ''
    alert('Email de confirmation renvoyé !')
  } catch (err) {
    console.error('Resend error:', err)
    alert('Erreur: ' + err.message)
  } finally {
    resending.value = false
  }
}

const verifyEmail = async () => {
  try {
    // Récupérer les paramètres
    const email = route.query.email
    const token = route.query.token
    
    userEmail.value = email || ''
    
    console.log('Verify params:', { email, token })
    
    if (!token || !email) {
      status.value = 'error'
      errorMessage.value = 'Lien de confirmation incomplet.'
      loading.value = false
      return
    }
    
    // Appeler notre API de vérification
    const response = await fetch('https://apiemail2iegreenhub.vercel.app/api/verify-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token })
    })
    
    const data = await response.json()
    
    if (!response.ok || !data.success) {
      console.error('Verify API error:', data)
      status.value = 'error'
      errorMessage.value = data.error || 'Token invalide ou expiré'
      loading.value = false
      return
    }
    
    console.log('Email verified:', data)
    status.value = 'success'
    loading.value = false
    startCountdown()
    
  } catch (err) {
    console.error('Verify error:', err)
    status.value = 'error'
    errorMessage.value = err.message || 'Erreur lors de la vérification'
    loading.value = false
  }
}

onMounted(() => {
  verifyEmail()
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
