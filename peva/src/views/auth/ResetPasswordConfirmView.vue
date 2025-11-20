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
        <h2 class="mt-6 text-center text-h4 font-weight-black text-grey-darken-4">
          Nouveau mot de passe
        </h2>
        <p class="mt-2 text-center text-body-2 text-grey-darken-2">
          Entrez votre nouveau mot de passe
        </p>
      </div>

      <v-card class="mt-8 elevation-8 rounded-lg" style="border: none;">
        <v-card-text class="pa-8">
          <v-form @submit.prevent="handleUpdatePassword" ref="passwordForm">
            <div class="d-flex flex-column ga-4">
              <div>
                <label class="text-body-2 font-weight-medium text-grey-darken-2 mb-2 d-block">Nouveau mot de passe</label>
                <v-text-field
                  v-model="form.password"
                  :rules="passwordRules"
                  :type="showPassword ? 'text' : 'password'"
                  variant="outlined"
                  prepend-inner-icon="mdi-lock"
                  :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showPassword = !showPassword"
                  placeholder="Votre nouveau mot de passe"
                  density="comfortable"
                  required
                />
              </div>

              <div>
                <label class="text-body-2 font-weight-medium text-grey-darken-2 mb-2 d-block">Confirmer le mot de passe</label>
                <v-text-field
                  v-model="form.confirmPassword"
                  :rules="confirmPasswordRules"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  variant="outlined"
                  prepend-inner-icon="mdi-lock-check"
                  :append-inner-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                  @click:append-inner="showConfirmPassword = !showConfirmPassword"
                  placeholder="Confirmez votre nouveau mot de passe"
                  density="comfortable"
                  required
                />
              </div>

              <!-- Indicateur de force du mot de passe -->
              <div v-if="form.password" class="mt-2">
                <div class="text-body-2 text-grey-darken-2 mb-2">Force du mot de passe :</div>
                <v-progress-linear
                  :model-value="passwordStrength.score * 25"
                  :color="passwordStrength.color"
                  height="6"
                  rounded
                />
                <div class="text-caption mt-1" :class="`text-${passwordStrength.color}`">
                  {{ passwordStrength.text }}
                </div>
              </div>

              <v-btn
                type="submit"
                :loading="loading"
                color="green-darken-2"
                size="large"
                block
                class="mt-4 text-none"
              >
                <v-icon start>mdi-check</v-icon>
                Mettre à jour le mot de passe
              </v-btn>
            </div>
          </v-form>

          <!-- Lien retour à la connexion -->
          <div class="text-center mt-6">
            <router-link
              to="/auth/login"
              class="text-body-2 text-green-darken-2 text-decoration-none d-flex align-center justify-center ga-1"
            >
              <v-icon size="small">mdi-arrow-left</v-icon>
              Retour à la connexion
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
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Formulaire et état
const passwordForm = ref(null)
const loading = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = reactive({
  password: '',
  confirmPassword: ''
})

const snackbar = reactive({
  show: false,
  message: '',
  color: 'error'
})

// Règles de validation
const passwordRules = [
  v => !!v || 'Le mot de passe est requis',
  v => v.length >= 8 || 'Le mot de passe doit contenir au moins 8 caractères',
  v => /(?=.*[a-z])/.test(v) || 'Le mot de passe doit contenir au moins une lettre minuscule',
  v => /(?=.*[A-Z])/.test(v) || 'Le mot de passe doit contenir au moins une lettre majuscule',
  v => /(?=.*\d)/.test(v) || 'Le mot de passe doit contenir au moins un chiffre'
]

const confirmPasswordRules = [
  v => !!v || 'La confirmation du mot de passe est requise',
  v => v === form.password || 'Les mots de passe ne correspondent pas'
]

// Calculer la force du mot de passe
const passwordStrength = computed(() => {
  const password = form.password
  if (!password) return { score: 0, text: '', color: 'grey' }

  let score = 0
  let text = ''
  let color = 'red'

  // Longueur
  if (password.length >= 8) score++
  if (password.length >= 12) score++

  // Complexité
  if (/(?=.*[a-z])/.test(password)) score++
  if (/(?=.*[A-Z])/.test(password)) score++
  if (/(?=.*\d)/.test(password)) score++
  if (/(?=.*[!@#$%^&*])/.test(password)) score++

  // Déterminer le niveau
  if (score <= 2) {
    text = 'Faible'
    color = 'red'
  } else if (score <= 4) {
    text = 'Moyen'
    color = 'orange'
  } else if (score <= 5) {
    text = 'Fort'
    color = 'light-green'
  } else {
    text = 'Très fort'
    color = 'green'
  }

  return { score: Math.min(score, 4), text, color }
})

// Méthodes
const showMessage = (message, color = 'error') => {
  snackbar.message = message
  snackbar.color = color
  snackbar.show = true
}

const handleUpdatePassword = async () => {
  const { valid } = await passwordForm.value.validate()
  if (!valid) return

  loading.value = true
  try {
    await authStore.updatePassword(form.password)
    showMessage('Mot de passe mis à jour avec succès !', 'success')
    
    // Rediriger intelligemment après 2 secondes
    setTimeout(() => {
      if (authStore.isAdmin) {
        router.push('/admin/dashboard')
      } else {
        router.push('/') // Page d'accueil
      }
    }, 2000)
  } catch (error) {
    showMessage(error.message || 'Erreur lors de la mise à jour du mot de passe')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.hero-section {
  background: linear-gradient(135deg, #e8f5e8 0%, #f1f8e9 100%);
}

.bg-gradient {
  background: linear-gradient(135deg, #2e7d32 0%, #4caf50 100%);
}
</style>