<template>
  <div class="submit-resource-view">
    <!-- Header avec bannière -->
    <div class="hero-banner bg-teal-darken-2 text-white py-8">
      <v-container>
        <div class="d-flex align-center">
          <v-icon size="48" class="mr-4">mdi-file-plus</v-icon>
          <div>
            <h1 class="text-h3 font-weight-bold mb-2">Proposer une Ressource</h1>
            <p class="text-h6 font-weight-regular ma-0">Partagez vos connaissances avec la communauté PEVA</p>
          </div>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <v-form ref="resourceForm" v-model="formValid">
        <v-row>
          <!-- Formulaire principal -->
          <v-col cols="12" md="8">
            <!-- Informations de Base -->
            <v-card class="mb-6" elevation="2">
              <v-card-title class="pa-4 bg-green-lighten-5">
                <v-icon class="mr-2" color="green-darken-2">mdi-information</v-icon>
                Informations de Base
              </v-card-title>
              <v-card-text class="pa-6">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="resourceData.title"
                      label="Titre de la ressource *"
                      variant="outlined"
                      :rules="[rules.required]"
                      placeholder="Ex: Guide pratique de l'agriculture durable en Afrique"
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-textarea
                      v-model="resourceData.description"
                      label="Description *"
                      variant="outlined"
                      :rules="[rules.required]"
                      rows="4"
                      placeholder="Décrivez votre ressource, son contenu et sa valeur ajoutée..."
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Catégorisation -->
            <v-card class="mb-6" elevation="2">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-tag</v-icon>
                Catégorisation
              </v-card-title>
              <v-card-text class="pa-6">
                <v-row>
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="resourceData.sector"
                      :items="sectors"
                      label="Secteur Principal *"
                      variant="outlined"
                      :rules="[rules.required]"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="resourceData.difficulty_level"
                      :items="difficultyLevels"
                      label="Niveau de Difficulté"
                      variant="outlined"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="4">
                    <v-select
                      v-model="resourceData.language"
                      :items="languages"
                      label="Langue"
                      variant="outlined"
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-combobox
                      v-model="resourceData.tags"
                      :items="suggestedTags"
                      label="Mots-clés"
                      variant="outlined"
                      multiple
                      chips
                      placeholder="Séparez les mots clés par des virgules"
                      hint="Ex: financement, startup, énergie solaire, afrique"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Fichiers et Liens -->
            <v-card class="mb-6" elevation="2">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-paperclip</v-icon>
                Fichiers et Liens
              </v-card-title>
              <v-card-text class="pa-6">
                <v-row>
                  <v-col cols="12">
                    <div class="file-upload-area">
                      <v-file-input
                        v-model="resourceData.files"
                        label="Fichier Principal"
                        variant="outlined"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                        prepend-icon="mdi-paperclip"
                        show-size
                        placeholder="Choisir un fichier ou glisser-déposer ici"
                      />
                      <div class="text-caption text-grey-darken-1 mt-2">
                        Formats acceptés: PDF, Word, PowerPoint, Excel (max 10MB)
                      </div>
                    </div>
                  </v-col>
                  
                  <v-col cols="12">
                    <v-text-field
                      v-model="resourceData.external_link"
                      label="Lien Externe (optionnel)"
                      variant="outlined"
                      placeholder="https://example.com/resource"
                      hint="Lien vers votre ressource si elle est hébergée ailleurs"
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <v-file-input
                      v-model="resourceData.cover_image"
                      label="Image de Couverture (optionnelle)"
                      variant="outlined"
                      accept="image/*"
                      prepend-icon="mdi-image"
                      placeholder="Choisir une image"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Informations Supplémentaires -->
            <v-card class="mb-6" elevation="2">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-information-outline</v-icon>
                Informations Supplémentaires
              </v-card-title>
              <v-card-text class="pa-6">
                <v-row>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="resourceData.author"
                      label="Auteur/Organisation"
                      variant="outlined"
                      placeholder="Nom de l'auteur ou organisation"
                    />
                  </v-col>
                  
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="resourceData.publication_date"
                      label="Date de Publication"
                      type="date"
                      variant="outlined"
                    />
                  </v-col>
                  
                  <v-col cols="12">
                    <div class="d-flex flex-column ga-2">
                      <v-checkbox
                        v-model="resourceData.is_free"
                        label="Cette ressource est gratuite"
                        hide-details
                      />
                      <v-checkbox
                        v-model="resourceData.allow_download"
                        label="Je déclare les droits de cette ressource"
                        hide-details
                      />
                      <v-checkbox
                        v-model="resourceData.allow_sharing"
                        label="Autoriser le téléchargement"
                        hide-details
                      />
                    </div>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Actions -->
            <div class="d-flex justify-space-between">
              <v-btn
                variant="outlined"
                prepend-icon="mdi-content-save"
                @click="saveDraft"
              >
                Enregistrer en Brouillon
              </v-btn>
              
              <div class="d-flex ga-2">
                <v-btn
                  variant="outlined"
                  prepend-icon="mdi-arrow-left"
                  @click="goBack"
                >
                  Annuler
                </v-btn>
                
                <v-btn
                  color="green-darken-2"
                  variant="flat"
                  prepend-icon="mdi-send"
                  :disabled="!formValid"
                  @click="submitResource"
                >
                  Soumettre pour Révision
                </v-btn>
              </div>
            </div>
          </v-col>

          <!-- Sidebar droite -->
          <v-col cols="12" md="4">
            <!-- Aperçu -->
            <v-card class="mb-4" elevation="2">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-eye</v-icon>
                Aperçu
              </v-card-title>
              <v-card-text class="pa-4">
                <div class="resource-preview">
                  <div class="preview-image bg-grey-lighten-3 rounded mb-3 d-flex align-center justify-center" style="height: 120px;">
                    <v-icon size="48" color="grey">mdi-file-document</v-icon>
                  </div>
                  
                  <h3 class="text-h6 font-weight-bold mb-2">
                    {{ resourceData.title || 'Titre de la ressource' }}
                  </h3>
                  
                  <p class="text-body-2 text-grey-darken-1 mb-3">
                    {{ resourceData.description?.substring(0, 100) || 'Description de la ressource...' }}
                    {{ resourceData.description?.length > 100 ? '...' : '' }}
                  </p>
                  
                  <div class="d-flex align-center mb-2">
                    <v-icon size="16" class="mr-2">mdi-account</v-icon>
                    <span class="text-body-2">
                      {{ resourceData.author || 'Auteur' }}
                    </span>
                  </div>
                  
                  <div class="d-flex align-center mb-3">
                    <v-icon size="16" class="mr-2">mdi-calendar</v-icon>
                    <span class="text-body-2">
                      {{ formatDate(resourceData.publication_date) || 'Date de publication' }}
                    </span>
                  </div>
                  
                  <div class="d-flex flex-wrap ga-1 mb-3">
                    <v-chip
                      v-for="tag in resourceData.tags?.slice(0, 3)"
                      :key="tag"
                      size="x-small"
                      color="blue-grey"
                    >
                      {{ tag }}
                    </v-chip>
                  </div>
                  
                  <div class="d-flex align-center justify-space-between">
                    <v-chip
                      :color="getSectorColor(resourceData.sector)"
                      size="small"
                    >
                      {{ resourceData.sector || 'Secteur' }}
                    </v-chip>
                    
                    <v-chip
                      color="green"
                      size="small"
                      v-if="resourceData.is_free"
                    >
                      Gratuit
                    </v-chip>
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- Conseils -->
            <v-card class="mb-4" elevation="2">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-lightbulb</v-icon>
                Conseils pour une bonne ressource
              </v-card-title>
              <v-card-text class="pa-4">
                <div class="d-flex flex-column ga-3">
                  <div class="d-flex align-start">
                    <v-icon color="green" size="16" class="mr-2 mt-1">mdi-check</v-icon>
                    <span class="text-body-2">Titre clair et descriptif</span>
                  </div>
                  <div class="d-flex align-start">
                    <v-icon color="green" size="16" class="mr-2 mt-1">mdi-check</v-icon>
                    <span class="text-body-2">Description détaillée du contenu</span>
                  </div>
                  <div class="d-flex align-start">
                    <v-icon color="green" size="16" class="mr-2 mt-1">mdi-check</v-icon>
                    <span class="text-body-2">Mots-clés pertinents pour la recherche</span>
                  </div>
                  <div class="d-flex align-start">
                    <v-icon color="green" size="16" class="mr-2 mt-1">mdi-check</v-icon>
                    <span class="text-body-2">Fichier de qualité et bien structuré</span>
                  </div>
                  <div class="d-flex align-start">
                    <v-icon color="green" size="16" class="mr-2 mt-1">mdi-check</v-icon>
                    <span class="text-body-2">Respect des droits d'auteur</span>
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- Processus de validation -->
            <v-card elevation="2">
              <v-card-title class="pa-4">
                <v-icon class="mr-2">mdi-clock-outline</v-icon>
                Processus de validation
              </v-card-title>
              <v-card-text class="pa-4">
                <div class="d-flex flex-column ga-3">
                  <div class="d-flex align-start">
                    <v-avatar color="blue" size="24" class="mr-3 mt-1">
                      <span class="text-caption font-weight-bold">1</span>
                    </v-avatar>
                    <div>
                      <div class="text-body-2 font-weight-bold">Soumission</div>
                      <div class="text-caption text-grey-darken-1">Votre ressource est envoyée pour révision</div>
                    </div>
                  </div>
                  <div class="d-flex align-start">
                    <v-avatar color="orange" size="24" class="mr-3 mt-1">
                      <span class="text-caption font-weight-bold">2</span>
                    </v-avatar>
                    <div>
                      <div class="text-body-2 font-weight-bold">Révision</div>
                      <div class="text-caption text-grey-darken-1">Vérification par notre équipe (24-48h)</div>
                    </div>
                  </div>
                  <div class="d-flex align-start">
                    <v-avatar color="green" size="24" class="mr-3 mt-1">
                      <span class="text-caption font-weight-bold">3</span>
                    </v-avatar>
                    <div>
                      <div class="text-body-2 font-weight-bold">Publication</div>
                      <div class="text-caption text-grey-darken-1">Mise en ligne et notification</div>
                    </div>
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-form>
    </v-container>

    <!-- Success Snackbar -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      :timeout="4000"
    >
      {{ snackbar.message }}
      <template v-slot:actions>
        <v-btn variant="text" @click="snackbar.show = false">
          Fermer
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const formValid = ref(false)
const resourceForm = ref(null)

const resourceData = ref({
  title: '',
  description: '',
  sector: '',
  difficulty_level: '',
  language: 'Français',
  tags: [],
  files: null,
  external_link: '',
  cover_image: null,
  author: '',
  publication_date: '',
  is_free: true,
  allow_download: true,
  allow_sharing: true
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Static data
const sectors = [
  'Agroalimentaire',
  'Agriculture Durable',
  'Économie Circulaire',
  'Écotourisme',
  'Énergie Renouvelable',
  'Entrepreneuriat',
  'Finance Verte',
  'Innovation Technologique',
  'Développement Durable',
  'Autre'
]

const difficultyLevels = [
  'Débutant',
  'Intermédiaire',
  'Avancé',
  'Expert'
]

const languages = [
  'Français',
  'Anglais',
  'Arabe',
  'Portugais',
  'Espagnol'
]

const suggestedTags = [
  'financement',
  'startup',
  'énergie solaire',
  'agriculture',
  'innovation',
  'afrique',
  'développement durable',
  'économie verte',
  'entrepreneuriat',
  'technologie'
]

// Validation rules
const rules = {
  required: value => !!value || 'Ce champ est requis'
}

// Methods
const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString('fr-FR')
}

const getSectorColor = (sector) => {
  const colors = {
    'Énergie Renouvelable': 'orange',
    'Agriculture Durable': 'green',
    'Économie Circulaire': 'blue',
    'Innovation Technologique': 'purple',
    'Finance Verte': 'teal',
    'Entrepreneuriat': 'pink',
    'Développement Durable': 'indigo'
  }
  return colors[sector] || 'grey'
}

const saveDraft = () => {
  showMessage('Ressource sauvegardée en brouillon', 'info')
}

const submitResource = () => {
  if (!formValid.value) {
    showMessage('Veuillez remplir tous les champs obligatoires', 'error')
    return
  }
  
  showMessage('Ressource soumise pour révision !', 'success')
  setTimeout(() => {
    router.push('/resources')
  }, 2000)
}

const goBack = () => {
  router.go(-1)
}

const showMessage = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  }
}

// Initialize
onMounted(() => {
  // TODO: Charger les données utilisateur depuis Supabase
  if (authStore.user?.profile) {
    resourceData.value.author = `${authStore.user.profile.first_name} ${authStore.user.profile.last_name}`
  }
})
</script>

<style scoped>
.submit-resource-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.hero-banner {
  background: linear-gradient(135deg, #00695c 0%, #00796b 100%);
}

.resource-preview {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
}

.preview-image {
  border: 2px dashed #ccc;
}

.file-upload-area {
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background: #fafafa;
  transition: border-color 0.3s ease;
}

.file-upload-area:hover {
  border-color: #00796b;
}

.v-card {
  border-radius: 12px !important;
}

.v-btn {
  border-radius: 8px !important;
}
</style>
