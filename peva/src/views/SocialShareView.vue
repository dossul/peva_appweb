<template>
  <div class="social-share-view">
    <!-- Header avec bannière -->
    <div class="hero-banner bg-blue-darken-2 text-white py-8">
      <v-container>
        <div class="d-flex align-center">
          <v-icon size="48" class="mr-4">mdi-share-variant</v-icon>
          <div>
            <h1 class="text-h3 font-weight-bold mb-2">Partage depuis les Réseaux Sociaux</h1>
            <p class="text-h6 font-weight-regular ma-0">Importez et partagez du contenu depuis LinkedIn, Twitter, YouTube et d'autres plateformes</p>
          </div>
        </div>
      </v-container>
    </div>

    <v-container class="py-8">
      <!-- Section Nouveau partage -->
      <v-card class="mb-8" elevation="2">
        <v-card-title class="pa-4 bg-green-lighten-5">
          <v-icon class="mr-2" color="green-darken-2">mdi-plus-circle</v-icon>
          Nouveau partage
        </v-card-title>
        <v-card-text class="pa-6">
          <p class="text-body-1 mb-4">Créez du lien d'un contenu publié depuis un réseau social pour l'importer sur PEVA</p>
          
          <div class="mb-4">
            <h3 class="text-h6 font-weight-bold mb-3">URL du contenu à partager</h3>
            <v-text-field
              v-model="shareUrl"
              placeholder="https://linkedin.com/posts/..."
              variant="outlined"
              prepend-inner-icon="mdi-link"
              clearable
              hide-details
            />
          </div>
          
          <div class="d-flex align-center justify-space-between">
            <div class="d-flex align-center ga-2">
              <v-btn color="blue" variant="flat" prepend-icon="mdi-magnify" @click="analyzeUrl">
                Analyser
              </v-btn>
              <span class="text-caption text-grey-darken-1">Aucun partage récent</span>
            </div>
          </div>
        </v-card-text>
      </v-card>

      <v-row>
        <!-- Section Comment ça fonctionne -->
        <v-col cols="12" md="6">
          <v-card class="h-100" elevation="2">
            <v-card-title class="pa-4">
              <v-icon class="mr-2">mdi-help-circle</v-icon>
              Comment ça fonctionne ?
            </v-card-title>
            <v-card-text class="pa-4">
              <div class="d-flex flex-column ga-3">
                <div class="d-flex align-start">
                  <v-avatar color="blue" size="24" class="mr-3 mt-1">
                    <span class="text-caption font-weight-bold">1</span>
                  </v-avatar>
                  <div>
                    <p class="text-body-2 font-weight-bold mb-1">Copiez le lien d'un post depuis votre réseau social préféré</p>
                  </div>
                </div>
                <div class="d-flex align-start">
                  <v-avatar color="blue" size="24" class="mr-3 mt-1">
                    <span class="text-caption font-weight-bold">2</span>
                  </v-avatar>
                  <div>
                    <p class="text-body-2 font-weight-bold mb-1">Collez le dans le champ ci-dessus et cliquez sur "Analyser"</p>
                  </div>
                </div>
                <div class="d-flex align-start">
                  <v-avatar color="blue" size="24" class="mr-3 mt-1">
                    <span class="text-caption font-weight-bold">3</span>
                  </v-avatar>
                  <div>
                    <p class="text-body-2 font-weight-bold mb-1">Personnalisez le contenu extrait</p>
                  </div>
                </div>
                <div class="d-flex align-start">
                  <v-avatar color="blue" size="24" class="mr-3 mt-1">
                    <span class="text-caption font-weight-bold">4</span>
                  </v-avatar>
                  <div>
                    <p class="text-body-2 font-weight-bold mb-1">Choisissez la catégorie PEVA appropriée</p>
                  </div>
                </div>
                <div class="d-flex align-start">
                  <v-avatar color="blue" size="24" class="mr-3 mt-1">
                    <span class="text-caption font-weight-bold">5</span>
                  </v-avatar>
                  <div>
                    <p class="text-body-2 font-weight-bold mb-1">Publiez sur la plateforme PEVA</p>
                  </div>
                </div>
              </div>
              
              <v-btn
                color="blue"
                variant="flat"
                block
                class="mt-4"
                prepend-icon="mdi-play"
                @click="startDemo"
              >
                Démarrer le partage social
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Section Historique et Statistiques -->
        <v-col cols="12" md="6">
          <v-card class="mb-4" elevation="2">
            <v-card-title class="pa-4">
              <v-icon class="mr-2">mdi-history</v-icon>
              Historique récent
              <v-spacer />
              <v-btn variant="text" color="primary" size="small">
                Voir tout
              </v-btn>
            </v-card-title>
            <v-card-text class="pa-4">
              <p class="text-body-2 text-grey-darken-1 text-center py-4">
                Aucun partage récent
              </p>
            </v-card-text>
          </v-card>

          <!-- Statistiques -->
          <v-card elevation="2">
            <v-card-title class="pa-4">
              <v-icon class="mr-2">mdi-chart-line</v-icon>
              Vos statistiques
            </v-card-title>
            <v-card-text class="pa-4">
              <v-row>
                <v-col cols="6" class="text-center">
                  <div class="text-h4 font-weight-bold text-blue-darken-2">0</div>
                  <div class="text-body-2">Contenus partagés</div>
                </v-col>
                <v-col cols="6" class="text-center">
                  <div class="text-h4 font-weight-bold text-green-darken-2">0</div>
                  <div class="text-body-2">Vues</div>
                </v-col>
              </v-row>
              
              <v-divider class="my-4" />
              
              <div class="mb-3">
                <div class="d-flex justify-space-between align-center mb-1">
                  <span class="text-body-2">Plateforme préférée</span>
                  <span class="text-body-2 font-weight-bold">LinkedIn</span>
                </div>
              </div>
              
              <div class="mb-3">
                <div class="d-flex justify-space-between align-center mb-1">
                  <span class="text-body-2">Catégorie favorite</span>
                  <span class="text-body-2 font-weight-bold">Opportunités</span>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Plateformes supportées -->
      <v-card class="mt-8" elevation="2">
        <v-card-title class="pa-4">
          <v-icon class="mr-2">mdi-apps</v-icon>
          Plateformes supportées
        </v-card-title>
        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="6" md="2" class="text-center">
              <div class="platform-card pa-4">
                <v-icon size="32" color="blue" class="mb-2">mdi-linkedin</v-icon>
                <div class="text-body-2 font-weight-bold">LinkedIn</div>
                <div class="text-caption">Posts privés</div>
              </div>
            </v-col>
            <v-col cols="6" md="2" class="text-center">
              <div class="platform-card pa-4">
                <v-icon size="32" color="red" class="mb-2">mdi-twitter</v-icon>
                <div class="text-body-2 font-weight-bold">Twitter/X</div>
                <div class="text-caption">Tweets</div>
              </div>
            </v-col>
            <v-col cols="6" md="2" class="text-center">
              <div class="platform-card pa-4">
                <v-icon size="32" color="red" class="mb-2">mdi-youtube</v-icon>
                <div class="text-body-2 font-weight-bold">YouTube</div>
                <div class="text-caption">Vidéos</div>
              </div>
            </v-col>
            <v-col cols="6" md="2" class="text-center">
              <div class="platform-card pa-4">
                <v-icon size="32" color="blue" class="mb-2">mdi-facebook</v-icon>
                <div class="text-body-2 font-weight-bold">Facebook</div>
                <div class="text-caption">Posts privés</div>
              </div>
            </v-col>
            <v-col cols="6" md="2" class="text-center">
              <div class="platform-card pa-4">
                <v-icon size="32" color="purple" class="mb-2">mdi-instagram</v-icon>
                <div class="text-body-2 font-weight-bold">Instagram</div>
                <div class="text-caption">Posts privés</div>
              </div>
            </v-col>
            <v-col cols="6" md="2" class="text-center">
              <div class="platform-card pa-4">
                <v-icon size="32" color="orange" class="mb-2">mdi-reddit</v-icon>
                <div class="text-body-2 font-weight-bold">Medium</div>
                <div class="text-caption">Articles</div>
              </div>
            </v-col>
          </v-row>
          
          <v-row class="mt-4">
            <v-col cols="6" md="2" class="text-center">
              <div class="platform-card pa-4">
                <v-icon size="32" color="black" class="mb-2">mdi-github</v-icon>
                <div class="text-body-2 font-weight-bold">GitHub</div>
                <div class="text-caption">Repositories</div>
              </div>
            </v-col>
            <v-col cols="6" md="2" class="text-center">
              <div class="platform-card pa-4">
                <v-icon size="32" color="black" class="mb-2">mdi-tiktok</v-icon>
                <div class="text-body-2 font-weight-bold">TikTok</div>
                <div class="text-caption">Vidéos</div>
              </div>
            </v-col>
            <v-col cols="6" md="2" class="text-center">
              <div class="platform-card pa-4">
                <v-icon size="32" color="orange" class="mb-2">mdi-newspaper</v-icon>
                <div class="text-body-2 font-weight-bold">Substack</div>
                <div class="text-caption">Newsletter</div>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Exemples d'utilisation -->
      <v-card class="mt-8" elevation="2">
        <v-card-title class="pa-4">
          <v-icon class="mr-2">mdi-lightbulb</v-icon>
          Exemples d'utilisation
        </v-card-title>
        <v-card-text class="pa-4">
          <v-row>
            <v-col cols="12" md="4">
              <div class="example-card pa-4 bg-green-lighten-5 rounded mb-3">
                <v-icon color="green-darken-2" class="mb-2">mdi-briefcase</v-icon>
                <h4 class="text-h6 font-weight-bold mb-2">Opportunités d'affaires</h4>
                <p class="text-body-2 mb-0">Partagez des posts LinkedIn sur des foires de fonds, des appels d'offres ou des partenariats d'affaires depuis l'innovation verte</p>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="example-card pa-4 bg-blue-lighten-5 rounded mb-3">
                <v-icon color="blue-darken-2" class="mb-2">mdi-school</v-icon>
                <h4 class="text-h6 font-weight-bold mb-2">Ressources éducatives</h4>
                <p class="text-body-2 mb-0">Importez des articles Medium ou Substack sur les meilleures pratiques en développement durable</p>
              </div>
            </v-col>
            <v-col cols="12" md="4">
              <div class="example-card pa-4 bg-purple-lighten-5 rounded mb-3">
                <v-icon color="purple-darken-2" class="mb-2">mdi-video</v-icon>
                <h4 class="text-h6 font-weight-bold mb-2">Contenu vidéo</h4>
                <p class="text-body-2 mb-0">Partagez des documentaires YouTube ou des conférences TED sur l'innovation verte en Afrique</p>
              </div>
            </v-col>
          </v-row>
          
          <v-row>
            <v-col cols="12" md="4">
              <div class="example-card pa-4 bg-orange-lighten-5 rounded">
                <v-icon color="orange-darken-2" class="mb-2">mdi-chart-line</v-icon>
                <h4 class="text-h6 font-weight-bold mb-2">Success stories</h4>
                <p class="text-body-2 mb-0">Mettez en avant des success stories entrepreneuriales depuis Instagram ou Facebook</p>
              </div>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-container>

    <!-- Actions rapides -->
    <div class="floating-actions">
      <v-btn
        color="green-darken-2"
        size="large"
        class="mr-3"
        prepend-icon="mdi-plus"
        @click="showNewShareDialog"
      >
        Nouveau partage
      </v-btn>
      <v-btn
        color="blue"
        variant="outlined"
        size="large"
        prepend-icon="mdi-history"
        @click="showHistory"
      >
        Voir l'historique
      </v-btn>
    </div>

    <!-- Actions rapides sidebar -->
    <div class="actions-sidebar">
      <div class="mb-4">
        <h3 class="text-h6 font-weight-bold mb-3">Actions rapides</h3>
        <v-btn
          color="green"
          variant="flat"
          block
          prepend-icon="mdi-plus"
          class="mb-2"
          @click="showNewShareDialog"
        >
          Nouveau partage
        </v-btn>
        <v-btn
          color="blue"
          variant="outlined"
          block
          prepend-icon="mdi-history"
          class="mb-2"
          @click="showHistory"
        >
          Voir l'historique
        </v-btn>
        <v-btn
          color="purple"
          variant="outlined"
          block
          prepend-icon="mdi-cog"
          @click="showSettings"
        >
          Mes opportunités
        </v-btn>
      </div>
      
      <div>
        <h3 class="text-h6 font-weight-bold mb-3">Mes ressources</h3>
        <v-btn
          variant="text"
          block
          prepend-icon="mdi-file"
          class="justify-start"
          @click="showResources"
        >
          Mes ressources
        </v-btn>
      </div>
    </div>

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
const shareUrl = ref('')

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Methods
const analyzeUrl = () => {
  if (!shareUrl.value) {
    showMessage('Veuillez entrer une URL', 'warning')
    return
  }
  showMessage('Analyse de l\'URL en cours...', 'info')
}

const startDemo = () => {
  showMessage('Démonstration du partage social', 'info')
}

const showNewShareDialog = () => {
  showMessage('Ouverture du dialogue de nouveau partage', 'info')
}

const showHistory = () => {
  showMessage('Affichage de l\'historique', 'info')
}

const showSettings = () => {
  router.push('/opportunities')
}

const showResources = () => {
  router.push('/resources')
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
  // TODO: Charger les données depuis Supabase
})
</script>
<style scoped>
.social-share-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.hero-banner {
  background: linear-gradient(135deg, #1565c0 0%, #1976d2 100%);
}

.platform-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  transition: transform 0.2s ease-in-out;
}

.platform-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.example-card {
  border: 1px solid rgba(0,0,0,0.1);
}

.floating-actions {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
}

.actions-sidebar {
  position: fixed;
  top: 50%;
  right: 24px;
  transform: translateY(-50%);
  background: white;
  padding: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  min-width: 200px;
  z-index: 999;
}

.v-card {
  border-radius: 12px !important;
}

.v-btn {
  border-radius: 8px !important;
}

@media (max-width: 768px) {
  .actions-sidebar {
    display: none;
  }
}
</style>