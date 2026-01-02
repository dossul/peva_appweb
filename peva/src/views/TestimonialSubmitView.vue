<template>
  <v-container class="py-8">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <v-card class="pa-6" elevation="3">
          <div class="text-center mb-6">
            <v-icon size="64" color="primary" class="mb-4">mdi-comment-quote</v-icon>
            <h1 class="text-h4 font-weight-bold mb-2">Partagez votre témoignage</h1>
            <p class="text-body-1 text-grey-darken-1">
              Votre expérience peut inspirer d'autres membres de la communauté
            </p>
          </div>

          <v-form ref="form" v-model="formValid" @submit.prevent="submitTestimonial">
            <!-- Témoignage -->
            <v-textarea
              v-model="testimonial.content"
              label="Votre témoignage *"
              placeholder="Partagez votre expérience avec 2iE GreenHub..."
              :rules="contentRules"
              rows="6"
              counter="500"
              variant="outlined"
              class="mb-4"
            ></v-textarea>

            <!-- Note -->
            <div class="mb-6">
              <label class="text-subtitle-1 font-weight-medium mb-2 d-block">
                Évaluation *
              </label>
              <v-rating
                v-model="testimonial.rating"
                color="amber"
                hover
                size="large"
              ></v-rating>
            </div>

            <!-- Options d'affichage -->
            <v-card variant="outlined" class="pa-4 mb-4">
              <h3 class="text-h6 font-weight-bold mb-4">
                <v-icon>mdi-eye</v-icon>
                Options de visibilité
              </h3>

              <!-- Afficher le nom -->
              <v-checkbox
                v-model="testimonial.display_name"
                label="Afficher mon nom (prénom et nom)"
                color="primary"
                hide-details
                class="mb-2"
              ></v-checkbox>

              <!-- Afficher la photo -->
              <v-checkbox
                v-model="testimonial.display_avatar"
                label="Afficher ma photo de profil"
                color="primary"
                hide-details
                class="mb-2"
              ></v-checkbox>

              <!-- Afficher la structure -->
              <v-checkbox
                v-model="testimonial.display_company"
                label="Afficher le nom de ma structure/entreprise"
                color="primary"
                hide-details
                class="mb-4"
              ></v-checkbox>

              <!-- Nom de la structure (si cochée) -->
              <v-text-field
                v-if="testimonial.display_company"
                v-model="testimonial.company_name"
                label="Nom de votre structure/entreprise"
                placeholder="Ex: EcoSolar Burkina"
                variant="outlined"
                :rules="companyNameRules"
              ></v-text-field>

              <v-alert type="info" variant="tonal" density="compact">
                <template v-if="!testimonial.display_name && !testimonial.display_company">
                  Votre témoignage sera publié anonymement
                </template>
                <template v-else>
                  Aperçu: <strong>{{ getDisplayPreview() }}</strong>
                </template>
              </v-alert>
            </v-card>

            <!-- Boutons -->
            <div class="d-flex justify-space-between">
              <v-btn
                variant="outlined"
                @click="$router.push('/')"
                :disabled="loading"
              >
                Annuler
              </v-btn>
              <v-btn
                type="submit"
                color="primary"
                :loading="loading"
                :disabled="!formValid"
              >
                <v-icon start>mdi-send</v-icon>
                Soumettre le témoignage
              </v-btn>
            </div>
          </v-form>

          <!-- Message de succès -->
          <v-alert
            v-if="successMessage"
            type="success"
            variant="tonal"
            class="mt-4"
          >
            {{ successMessage }}
          </v-alert>

          <!-- Message d'erreur -->
          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            class="mt-4"
          >
            {{ errorMessage }}
          </v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const authStore = useAuthStore()
const form = ref(null)
const formValid = ref(false)
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

// Données du formulaire
const testimonial = ref({
  content: '',
  rating: 5,
  display_name: true,
  display_avatar: true,
  display_company: false,
  company_name: ''
})

// Règles de validation
const contentRules = [
  v => !!v || 'Le témoignage est requis',
  v => (v && v.length >= 20) || 'Le témoignage doit contenir au moins 20 caractères',
  v => (v && v.length <= 500) || 'Le témoignage ne doit pas dépasser 500 caractères'
]

const companyNameRules = computed(() => {
  if (!testimonial.value.display_company) return []
  return [
    v => !!v || 'Le nom de la structure est requis si vous souhaitez l\'afficher'
  ]
})

// Aperçu du nom affiché
const getDisplayPreview = () => {
  const parts = []
  
  if (testimonial.value.display_name && authStore.user) {
    const profile = authStore.user.profile
    if (profile) {
      parts.push(`${profile.first_name} ${profile.last_name}`)
    }
  }
  
  if (testimonial.value.display_company && testimonial.value.company_name) {
    parts.push(testimonial.value.company_name)
  }
  
  return parts.join(', ') || 'Membre anonyme'
}

// Soumission du témoignage
const submitTestimonial = async () => {
  if (!formValid.value) return
  
  try {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''

    // Vérifier l'authentification
    if (!authStore.user || !authStore.user.id) {
      errorMessage.value = 'Vous devez être connecté pour soumettre un témoignage'
      return
    }

    // Préparer les données
    const data = {
      user_id: authStore.user.id,
      content: testimonial.value.content.trim(),
      rating: testimonial.value.rating,
      display_name: testimonial.value.display_name,
      display_avatar: testimonial.value.display_avatar,
      display_company: testimonial.value.display_company,
      company_name: testimonial.value.display_company ? testimonial.value.company_name.trim() : null,
      is_approved: false, // En attente de modération
      is_featured: false,
      status: 'pending'
    }

    // Insertion dans Supabase
    const { error } = await supabase
      .from('pev_testimonials')
      .insert([data])

    if (error) throw error

    successMessage.value = 'Votre témoignage a été soumis avec succès ! Il sera publié après validation par notre équipe.'
    
    // Réinitialiser le formulaire
    testimonial.value = {
      content: '',
      rating: 5,
      display_name: true,
      display_avatar: true,
      display_company: false,
      company_name: ''
    }
    form.value?.reset()

    // Rediriger après 3 secondes
    setTimeout(() => {
      router.push('/')
    }, 3000)

  } catch (error) {
    console.error('Erreur lors de la soumission du témoignage:', error)
    errorMessage.value = 'Une erreur est survenue lors de la soumission. Veuillez réessayer.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.v-card {
  border-radius: 16px !important;
}
</style>
