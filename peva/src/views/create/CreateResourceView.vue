<template>
  <div class="create-resource-view">
    <!-- Header -->
    <v-app-bar color="primary" dark>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Partager une Ressource</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="accent" @click="saveDraft">
        <v-icon left>mdi-content-save</v-icon>
        Sauvegarder brouillon
      </v-btn>
    </v-app-bar>

    <v-container fluid class="pa-6">
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>
              <v-icon class="mr-3">mdi-file-plus</v-icon>
              Nouvelle Ressource
            </v-card-title>
            
            <v-card-text>
              <v-form ref="resourceForm" v-model="formValid">
                <!-- Type de ressource -->
                <v-row>
                  <v-col cols="12">
                    <h3 class="text-h6 mb-3">Type de ressource</h3>
                    <v-chip-group
                      v-model="resource.type"
                      mandatory
                      selected-class="text-primary"
                    >
                      <v-chip
                        v-for="type in resourceTypes"
                        :key="type.value"
                        :value="type.value"
                        :prepend-icon="type.icon"
                        :color="resource.type === type.value ? 'primary' : ''"
                        variant="outlined"
                      >
                        {{ type.label }}
                      </v-chip>
                    </v-chip-group>
                  </v-col>
                </v-row>

                <v-divider class="my-6"></v-divider>

                <!-- Informations de base -->
                <v-row>
                  <v-col cols="12">
                    <h3 class="text-h6 mb-3">Informations de base</h3>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="resource.title"
                      label="Titre de la ressource"
                      variant="outlined"
                      :rules="[v => !!v || 'Le titre est requis']"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="resource.category"
                      :items="categories"
                      label="Catégorie"
                      variant="outlined"
                      :rules="[v => !!v || 'La catégorie est requise']"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="resource.language"
                      :items="languages"
                      label="Langue"
                      variant="outlined"
                      :rules="[v => !!v || 'La langue est requise']"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="resource.description"
                      label="Description détaillée"
                      variant="outlined"
                      rows="4"
                      :rules="[v => !!v || 'La description est requise']"
                      required
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-combobox
                      v-model="resource.tags"
                      label="Tags (mots-clés)"
                      variant="outlined"
                      multiple
                      chips
                      hint="Appuyez sur Entrée pour ajouter un tag"
                    ></v-combobox>
                  </v-col>
                </v-row>

                <v-divider class="my-6"></v-divider>

                <!-- Contenu de la ressource -->
                <v-row>
                  <v-col cols="12">
                    <h3 class="text-h6 mb-3">Contenu de la ressource</h3>
                  </v-col>
                  
                  <!-- Upload de fichier -->
                  <v-col cols="12" v-if="resource.type !== 'link'">
                    <v-file-input
                      v-model="resource.file"
                      :label="getFileInputLabel()"
                      variant="outlined"
                      :accept="getAcceptedFileTypes()"
                      :rules="[v => !!v || 'Le fichier est requis']"
                      required
                      show-size
                    >
                      <template v-slot:prepend-inner>
                        <v-icon>{{ getFileIcon() }}</v-icon>
                      </template>
                    </v-file-input>
                    <v-alert type="info" variant="tonal" class="mt-2">
                      {{ getFileHint() }}
                    </v-alert>
                  </v-col>

                  <!-- Lien externe -->
                  <v-col cols="12" v-if="resource.type === 'link'">
                    <v-text-field
                      v-model="resource.external_url"
                      label="URL de la ressource"
                      variant="outlined"
                      type="url"
                      :rules="[v => !!v || 'L\'URL est requise']"
                      required
                    ></v-text-field>
                  </v-col>

                  <!-- Image de couverture -->
                  <v-col cols="12" md="6">
                    <v-file-input
                      v-model="resource.thumbnail"
                      label="Image de couverture (optionnel)"
                      variant="outlined"
                      accept="image/*"
                      show-size
                    ></v-file-input>
                  </v-col>

                  <!-- Niveau de difficulté -->
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="resource.difficulty_level"
                      :items="difficultyLevels"
                      label="Niveau de difficulté"
                      variant="outlined"
                    ></v-select>
                  </v-col>
                </v-row>

                <v-divider class="my-6"></v-divider>

                <!-- Informations complémentaires -->
                <v-row>
                  <v-col cols="12">
                    <h3 class="text-h6 mb-3">Informations complémentaires</h3>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="resource.author_name"
                      label="Nom de l'auteur"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="resource.organization"
                      label="Organisation"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="resource.publication_date"
                      label="Date de publication originale"
                      variant="outlined"
                      type="date"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="resource.version"
                      label="Version (optionnel)"
                      variant="outlined"
                      placeholder="Ex: v1.0, 2024"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="resource.prerequisites"
                      label="Prérequis (optionnel)"
                      variant="outlined"
                      rows="2"
                      hint="Connaissances ou outils nécessaires pour utiliser cette ressource"
                    ></v-textarea>
                  </v-col>
                </v-row>

                <v-divider class="my-6"></v-divider>

                <!-- Licence et droits -->
                <v-row>
                  <v-col cols="12">
                    <h3 class="text-h6 mb-3">Licence et droits d'utilisation</h3>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="resource.license"
                      :items="licenses"
                      label="Licence"
                      variant="outlined"
                      :rules="[v => !!v || 'La licence est requise']"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-switch
                      v-model="resource.allow_commercial_use"
                      label="Autoriser l'usage commercial"
                      color="primary"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="resource.usage_rights"
                      label="Conditions d'utilisation spécifiques (optionnel)"
                      variant="outlined"
                      rows="2"
                    ></v-textarea>
                  </v-col>
                </v-row>

                <v-divider class="my-6"></v-divider>

                <!-- Options de publication -->
                <v-row>
                  <v-col cols="12">
                    <h3 class="text-h6 mb-3">Options de publication</h3>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-switch
                      v-model="resource.is_featured"
                      label="Mettre en avant"
                      color="primary"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-switch
                      v-model="resource.allow_comments"
                      label="Autoriser les commentaires"
                      color="primary"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-switch
                      v-model="resource.notify_updates"
                      label="Notifier les mises à jour"
                      color="primary"
                    ></v-switch>
                  </v-col>
                </v-row>
              </v-form>
            </v-card-text>

            <v-card-actions class="pa-6">
              <v-btn @click="$router.go(-1)">
                Annuler
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn
                color="grey"
                @click="previewResource"
              >
                <v-icon left>mdi-eye</v-icon>
                Aperçu
              </v-btn>
              <v-btn
                color="primary"
                :disabled="!formValid"
                @click="publishResource"
              >
                <v-icon left>mdi-publish</v-icon>
                Publier
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { ref } from 'vue'

export default {
  name: 'CreateResourceView',
  setup() {
    const formValid = ref(false)
    const resourceForm = ref(null)

    const resource = ref({
      type: 'pdf',
      title: '',
      category: '',
      language: 'fr',
      description: '',
      tags: [],
      file: null,
      external_url: '',
      thumbnail: null,
      difficulty_level: '',
      author_name: '',
      organization: '',
      publication_date: '',
      version: '',
      prerequisites: '',
      license: '',
      allow_commercial_use: false,
      usage_rights: '',
      is_featured: false,
      allow_comments: true,
      notify_updates: false
    })

    const resourceTypes = [
      { label: 'Document PDF', value: 'pdf', icon: 'mdi-file-pdf-box' },
      { label: 'Présentation', value: 'presentation', icon: 'mdi-presentation' },
      { label: 'Feuille de calcul', value: 'spreadsheet', icon: 'mdi-file-excel' },
      { label: 'Vidéo', value: 'video', icon: 'mdi-video' },
      { label: 'Audio', value: 'audio', icon: 'mdi-music' },
      { label: 'Lien externe', value: 'link', icon: 'mdi-link' },
      { label: 'Archive', value: 'archive', icon: 'mdi-zip-box' }
    ]

    const categories = [
      'Énergies Renouvelables',
      'Agriculture Durable',
      'Technologies Propres',
      'Finance Verte',
      'Transport Durable',
      'Économie Circulaire',
      'Biodiversité',
      'Changement Climatique',
      'Politique Environnementale',
      'Innovation',
      'Formation'
    ]

    const languages = [
      { title: 'Français', value: 'fr' },
      { title: 'Anglais', value: 'en' },
      { title: 'Arabe', value: 'ar' },
      { title: 'Portugais', value: 'pt' },
      { title: 'Espagnol', value: 'es' }
    ]

    const difficultyLevels = [
      'Débutant',
      'Intermédiaire',
      'Avancé',
      'Expert'
    ]

    const licenses = [
      'Creative Commons CC0 (Domaine public)',
      'Creative Commons BY (Attribution)',
      'Creative Commons BY-SA (Attribution-ShareAlike)',
      'Creative Commons BY-NC (Attribution-NonCommercial)',
      'Creative Commons BY-NC-SA (Attribution-NonCommercial-ShareAlike)',
      'Tous droits réservés',
      'Licence personnalisée'
    ]

    const getFileInputLabel = () => {
      const labels = {
        'pdf': 'Fichier PDF',
        'presentation': 'Fichier de présentation (PPT, PPTX)',
        'spreadsheet': 'Feuille de calcul (XLS, XLSX)',
        'video': 'Fichier vidéo (MP4, AVI, MOV)',
        'audio': 'Fichier audio (MP3, WAV)',
        'archive': 'Archive (ZIP, RAR)'
      }
      return labels[resource.value.type] || 'Fichier'
    }

    const getAcceptedFileTypes = () => {
      const types = {
        'pdf': '.pdf',
        'presentation': '.ppt,.pptx,.odp',
        'spreadsheet': '.xls,.xlsx,.ods,.csv',
        'video': '.mp4,.avi,.mov,.wmv,.flv',
        'audio': '.mp3,.wav,.ogg,.m4a',
        'archive': '.zip,.rar,.7z,.tar.gz'
      }
      return types[resource.value.type] || '*'
    }

    const getFileIcon = () => {
      const icons = {
        'pdf': 'mdi-file-pdf-box',
        'presentation': 'mdi-presentation',
        'spreadsheet': 'mdi-file-excel',
        'video': 'mdi-video',
        'audio': 'mdi-music',
        'archive': 'mdi-zip-box'
      }
      return icons[resource.value.type] || 'mdi-file'
    }

    const getFileHint = () => {
      const hints = {
        'pdf': 'Taille maximale: 50 MB. Formats acceptés: PDF',
        'presentation': 'Taille maximale: 100 MB. Formats acceptés: PPT, PPTX, ODP',
        'spreadsheet': 'Taille maximale: 25 MB. Formats acceptés: XLS, XLSX, ODS, CSV',
        'video': 'Taille maximale: 500 MB. Formats acceptés: MP4, AVI, MOV, WMV',
        'audio': 'Taille maximale: 100 MB. Formats acceptés: MP3, WAV, OGG, M4A',
        'archive': 'Taille maximale: 200 MB. Formats acceptés: ZIP, RAR, 7Z, TAR.GZ'
      }
      return hints[resource.value.type] || 'Veuillez sélectionner un fichier'
    }

    const saveDraft = () => {
      console.log('Sauvegarde du brouillon:', resource.value)
      // Ici vous sauvegarderiez en local storage ou base de données
    }

    const previewResource = () => {
      console.log('Aperçu de la ressource:', resource.value)
      // Ici vous pourriez ouvrir un dialog avec l'aperçu
    }

    const publishResource = async () => {
      if (resourceForm.value?.validate()) {
        console.log('Publication de la ressource:', resource.value)
        // Ici vous feriez l'appel API pour publier
        // Puis redirection vers la liste des ressources
        // this.$router.push('/resources')
      }
    }

    return {
      formValid,
      resourceForm,
      resource,
      resourceTypes,
      categories,
      languages,
      difficultyLevels,
      licenses,
      getFileInputLabel,
      getAcceptedFileTypes,
      getFileIcon,
      getFileHint,
      saveDraft,
      previewResource,
      publishResource
    }
  }
}
</script>

<style scoped>
.create-resource-view {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
