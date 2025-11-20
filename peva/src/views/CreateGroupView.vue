<template>
  <div class="create-group">
    <v-container class="py-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="d-flex align-center mb-4">
          <v-icon class="mr-3 text-teal-600" size="32">mdi-account-group-outline</v-icon>
          <div>
            <h1 class="text-h3 font-weight-bold text-grey-darken-3">Créer un Nouveau Groupe</h1>
            <p class="text-body-1 text-grey-darken-1 ma-0">Créez votre propre communauté et connectez-vous avec des professionnels de votre secteur</p>
          </div>
        </div>
      </div>

      <v-form ref="groupForm" v-model="formValid" @submit.prevent="createGroup">
        <v-row>
          <!-- Main Form -->
          <v-col cols="12" lg="8">
            <v-card elevation="2" class="mb-6">
              <v-card-title class="pa-6 bg-teal-darken-2 text-white">
                <v-icon start>mdi-information</v-icon>
                Informations de Base
              </v-card-title>
              <v-card-text class="pa-6">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="groupData.name"
                      label="Nom du Groupe"
                      placeholder="ex: Énergie Solaire Afrique de l'Ouest"
                      variant="outlined"
                      :rules="[rules.required]"
                      prepend-inner-icon="mdi-account-group"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="groupData.category"
                      :items="categories"
                      label="Catégorie Principale"
                      variant="outlined"
                      :rules="[rules.required]"
                      prepend-inner-icon="mdi-tag"
                    />
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="groupData.focus"
                      :items="focusAreas"
                      label="Pays/Région de Focus"
                      variant="outlined"
                      :rules="[rules.required]"
                      prepend-inner-icon="mdi-map"
                    />
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="groupData.description"
                      label="Description du Groupe"
                      placeholder="Décrivez l'objectif de votre groupe, les sujets abordés, le type de membres recherchés..."
                      variant="outlined"
                      rows="4"
                      :rules="[rules.required, rules.minLength(50)]"
                      prepend-inner-icon="mdi-text"
                      counter="500"
                      :maxlength="500"
                    />
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>

            <!-- Configuration et Visibilité -->
            <v-card elevation="2" class="mb-6">
              <v-card-title class="pa-6 bg-blue-darken-2 text-white">
                <v-icon start>mdi-cog</v-icon>
                Configuration et Visibilité
              </v-card-title>
              <v-card-text class="pa-6">
                <div class="mb-6">
                  <h3 class="text-h6 mb-4">Type de Groupe</h3>
                  <v-radio-group v-model="groupData.type" :rules="[rules.required]">
                    <v-radio value="public" color="green">
                      <template v-slot:label>
                        <div class="ml-2">
                          <div class="font-weight-medium">Public</div>
                          <div class="text-body-2 text-grey-darken-1">Visible par tous, rejoindre sans approbation</div>
                        </div>
                      </template>
                    </v-radio>
                    <v-radio value="private" color="orange">
                      <template v-slot:label>
                        <div class="ml-2">
                          <div class="font-weight-medium">Privé</div>
                          <div class="text-body-2 text-grey-darken-1">Visible par tous, mais nécessite une approbation des administrateurs</div>
                        </div>
                      </template>
                    </v-radio>
                  </v-radio-group>
                </div>

                <div class="mb-6">
                  <h3 class="text-h6 mb-4">Type d'Accès</h3>
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="groupData.accessType"
                        :items="accessTypes"
                        label="Accès au Groupe"
                        variant="outlined"
                        :rules="[rules.required]"
                      />
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="groupData.language"
                        :items="languages"
                        label="Langue Principale"
                        variant="outlined"
                        :rules="[rules.required]"
                      />
                    </v-col>
                  </v-row>
                </div>
              </v-card-text>
            </v-card>

            <!-- Image et Personnalisation -->
            <v-card elevation="2" class="mb-6">
              <v-card-title class="pa-6 bg-purple-darken-2 text-white">
                <v-icon start>mdi-image</v-icon>
                Image et Personnalisation
              </v-card-title>
              <v-card-text class="pa-6">
                <div class="mb-6">
                  <h3 class="text-h6 mb-4">Logo/Avatar du Groupe</h3>
                  <div class="d-flex align-center ga-4">
                    <v-avatar size="80" color="grey-lighten-2">
                      <v-img v-if="groupData.avatar" :src="groupData.avatar" />
                      <v-icon v-else size="40">mdi-camera</v-icon>
                    </v-avatar>
                    <div>
                      <v-btn variant="outlined" prepend-icon="mdi-upload" @click="uploadAvatar">
                        Choisir une Image
                      </v-btn>
                      <p class="text-caption mt-2 mb-0">PNG, JPG recommandé. Taille max: 2MB</p>
                    </div>
                  </div>
                </div>

                <div class="mb-6">
                  <h3 class="text-h6 mb-4">Image de Couverture (optionnel)</h3>
                  <div class="cover-upload-area">
                    <v-img v-if="groupData.cover" :src="groupData.cover" height="120" cover />
                    <div v-else class="upload-placeholder">
                      <v-icon size="48" color="grey-lighten-1">mdi-image-plus</v-icon>
                      <p class="text-body-2 mt-2">Ajoutez une image de couverture</p>
                    </div>
                    <v-btn
                      class="upload-btn"
                      variant="flat"
                      color="primary"
                      size="small"
                      @click="uploadCover"
                    >
                      {{ groupData.cover ? 'Changer' : 'Ajouter' }}
                    </v-btn>
                  </div>
                </div>

                <!-- Couleur Thématique -->
                <div>
                  <h3 class="text-h6 mb-4">Couleur Thématique</h3>
                  <v-btn-toggle v-model="groupData.themeColor" mandatory>
                    <v-btn
                      v-for="color in themeColors"
                      :key="color.value"
                      :value="color.value"
                      :color="color.value"
                      variant="flat"
                      size="small"
                    >
                      {{ color.name }}
                    </v-btn>
                  </v-btn-toggle>
                </div>
              </v-card-text>
            </v-card>

            <!-- Règles et Modération -->
            <v-card elevation="2" class="mb-6">
              <v-card-title class="pa-6 bg-red-darken-2 text-white">
                <v-icon start>mdi-shield-check</v-icon>
                Règles et Modération
              </v-card-title>
              <v-card-text class="pa-6">
                <div class="mb-4">
                  <h3 class="text-h6 mb-4">Règles du Groupe</h3>
                  <div class="rules-list">
                    <v-checkbox
                      v-for="(rule, index) in defaultRules"
                      :key="index"
                      v-model="groupData.rules"
                      :value="rule.id"
                      :label="rule.text"
                      color="red-darken-2"
                      density="comfortable"
                      class="mb-2"
                    />
                  </div>
                </div>

                <div class="mb-4">
                  <h3 class="text-h6 mb-4">Critères de Modération</h3>
                  <v-checkbox
                    v-model="groupData.autoModeration"
                    label="Approbation automatique des nouveaux membres"
                    color="red-darken-2"
                  />
                  <v-checkbox
                    v-model="groupData.contentModeration"
                    label="Modération du contenu par les administrateurs"
                    color="red-darken-2"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <!-- Sidebar -->
          <v-col cols="12" lg="4">
            <!-- Aperçu du Groupe -->
            <v-card elevation="2" class="mb-6 sticky-top">
              <v-card-title class="pa-4">
                <v-icon start>mdi-eye</v-icon>
                Aperçu du Groupe
              </v-card-title>
              <v-card-text class="pa-4">
                <div class="group-preview">
                  <div class="cover-preview mb-3">
                    <v-img
                      v-if="groupData.cover"
                      :src="groupData.cover"
                      height="80"
                      cover
                      class="rounded"
                    />
                    <div v-else class="cover-placeholder">
                      <v-icon color="grey-lighten-2">mdi-image</v-icon>
                    </div>
                  </div>
                  
                  <div class="d-flex align-center mb-3">
                    <v-avatar size="40" class="mr-3" :color="groupData.themeColor || 'grey'">
                      <v-img v-if="groupData.avatar" :src="groupData.avatar" />
                      <v-icon v-else color="white">mdi-account-group</v-icon>
                    </v-avatar>
                    <div>
                      <h4 class="text-h6 font-weight-bold">
                        {{ groupData.name || 'Nom du groupe' }}
                      </h4>
                      <p class="text-body-2 text-grey-darken-1 ma-0">
                        {{ groupData.category || 'Catégorie' }}
                      </p>
                    </div>
                  </div>
                  
                  <p class="text-body-2 mb-3">
                    {{ groupData.description || 'Description du groupe...' }}
                  </p>
                  
                  <div class="d-flex align-center justify-space-between">
                    <v-chip
                      :color="groupData.type === 'public' ? 'green' : 'orange'"
                      size="small"
                    >
                      {{ groupData.type === 'public' ? 'Public' : 'Privé' }}
                    </v-chip>
                    <v-chip size="small" color="blue">
                      {{ groupData.language || 'Français' }}
                    </v-chip>
                  </div>
                </div>
              </v-card-text>
            </v-card>

            <!-- Actions -->
            <v-card elevation="2">
              <v-card-text class="pa-4">
                <div class="d-flex flex-column ga-3">
                  <v-btn
                    type="submit"
                    color="teal-darken-2"
                    variant="flat"
                    size="large"
                    block
                    prepend-icon="mdi-plus"
                    :loading="creating"
                    :disabled="!formValid"
                  >
                    Créer le Groupe
                  </v-btn>
                  
                  <v-btn
                    variant="outlined"
                    block
                    prepend-icon="mdi-content-save"
                    @click="saveDraft"
                  >
                    Sauvegarder en brouillon
                  </v-btn>
                  
                  <v-btn
                    variant="text"
                    block
                    prepend-icon="mdi-arrow-left"
                    @click="$router.go(-1)"
                  >
                    Annuler
                  </v-btn>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const formValid = ref(false)
const creating = ref(false)

const groupData = ref({
  name: '',
  category: '',
  focus: '',
  description: '',
  type: 'public',
  accessType: '',
  language: 'Français',
  avatar: null,
  cover: null,
  themeColor: 'teal',
  rules: [],
  autoModeration: false,
  contentModeration: true
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Static data
const categories = [
  'Énergies Renouvelables',
  'Agriculture Durable',
  'Gestion des Déchets',
  'Transport Vert',
  'Construction Écologique',
  'Eau et Assainissement',
  'Fintech Verte',
  'Technologies Propres',
  'Économie Circulaire'
]

const focusAreas = [
  'Toute l\'Afrique',
  'Afrique de l\'Ouest',
  'Afrique de l\'Est',
  'Afrique Centrale',
  'Afrique du Nord',
  'Afrique Australe',
  'Sénégal',
  'Ghana',
  'Nigeria',
  'Kenya',
  'Maroc',
  'Afrique du Sud'
]

const accessTypes = [
  'Ouvert à tous',
  'Professionnels uniquement',
  'Entrepreneurs uniquement',
  'Investisseurs uniquement',
  'Sur invitation'
]

const languages = [
  'Français',
  'Anglais',
  'Arabe',
  'Portugais',
  'Swahili'
]

const themeColors = [
  { name: 'Teal', value: 'teal' },
  { name: 'Vert', value: 'green' },
  { name: 'Bleu', value: 'blue' },
  { name: 'Violet', value: 'purple' },
  { name: 'Orange', value: 'orange' }
]

const defaultRules = [
  { id: 1, text: 'Respecter tous les membres et maintenir un ton professionnel' },
  { id: 2, text: 'Pas de spam ou de contenu promotionnel excessif' },
  { id: 3, text: 'Partager du contenu pertinent à l\'économie verte' },
  { id: 4, text: 'Utiliser la fonction de recherche avant de poser une question' },
  { id: 5, text: 'Pas de contenu offensant ou discriminatoire' },
  { id: 6, text: 'Respecter la confidentialité et ne pas partager d\'informations privées' }
]

const rules = {
  required: value => !!value || 'Ce champ est requis',
  minLength: min => value => (value && value.length >= min) || `Minimum ${min} caractères requis`
}

// Methods
const createGroup = async () => {
  if (!formValid.value) return
  
  try {
    creating.value = true
    // TODO: Implémenter la création avec Supabase
    await new Promise(resolve => setTimeout(resolve, 2000)) // Simulation
    
    showMessage('Groupe créé avec succès !', 'success')
    setTimeout(() => {
      router.push('/groups')
    }, 1500)
  } catch (error) {
    console.error('Erreur lors de la création:', error)
    showMessage('Erreur lors de la création du groupe', 'error')
  } finally {
    creating.value = false
  }
}

const saveDraft = () => {
  // TODO: Sauvegarder en brouillon
  showMessage('Brouillon sauvegardé', 'info')
}

const uploadAvatar = () => {
  // TODO: Implémenter l'upload d'avatar
  showMessage('Fonctionnalité d\'upload en cours de développement', 'info')
}

const uploadCover = () => {
  // TODO: Implémenter l'upload de couverture
  showMessage('Fonctionnalité d\'upload en cours de développement', 'info')
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
  // Pré-remplir certains champs par défaut
  groupData.value.rules = [1, 2, 3, 5] // Règles par défaut sélectionnées
})
</script>

<style scoped>
.create-group {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.sticky-top {
  position: sticky;
  top: 100px;
}

.cover-upload-area {
  position: relative;
  border: 2px dashed #e0e0e0;
  border-radius: 8px;
  min-height: 120px;
  overflow: hidden;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 120px;
  background-color: #fafafa;
}

.upload-btn {
  position: absolute;
  top: 8px;
  right: 8px;
}

.cover-preview {
  border-radius: 8px;
  overflow: hidden;
}

.cover-placeholder {
  height: 80px;
  background-color: #f5f5f5;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

.group-preview {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  background-color: white;
}

.v-card {
  border-radius: 12px !important;
}

.v-btn {
  border-radius: 8px !important;
}

.rules-list .v-input {
  margin-bottom: 8px;
}
</style>
