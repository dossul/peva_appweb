<template>
  <div class="create-event-view">
    <!-- Header -->
    <v-app-bar color="primary" dark>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Organiser un Événement</v-toolbar-title>
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
              <v-icon class="mr-3">mdi-calendar-plus</v-icon>
              Nouvel Événement
            </v-card-title>
            
            <v-card-text>
              <v-form ref="eventForm" v-model="formValid">
                <!-- Type d'événement -->
                <v-row>
                  <v-col cols="12">
                    <h3 class="text-h6 mb-3">Type d'événement</h3>
                    <v-chip-group
                      v-model="event.type"
                      mandatory
                      selected-class="text-primary"
                    >
                      <v-chip
                        v-for="type in eventTypes"
                        :key="type.value"
                        :value="type.value"
                        :prepend-icon="type.icon"
                        :color="event.type === type.value ? 'primary' : ''"
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
                      v-model="event.title"
                      label="Titre de l'événement"
                      variant="outlined"
                      :rules="[v => !!v || 'Le titre est requis']"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="event.category"
                      :items="categories"
                      label="Catégorie"
                      variant="outlined"
                      :rules="[v => !!v || 'La catégorie est requise']"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="event.format"
                      :items="eventFormats"
                      label="Format"
                      variant="outlined"
                      :rules="[v => !!v || 'Le format est requis']"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="event.description"
                      label="Description de l'événement"
                      variant="outlined"
                      rows="4"
                      :rules="[v => !!v || 'La description est requise']"
                      required
                    ></v-textarea>
                  </v-col>
                </v-row>

                <v-divider class="my-6"></v-divider>

                <!-- Date et heure -->
                <v-row>
                  <v-col cols="12">
                    <h3 class="text-h6 mb-3">Date et heure</h3>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="event.start_date"
                      label="Date de début"
                      variant="outlined"
                      type="date"
                      :rules="[v => !!v || 'La date de début est requise']"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="event.start_time"
                      label="Heure de début"
                      variant="outlined"
                      type="time"
                      :rules="[v => !!v || 'L\'heure de début est requise']"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="event.end_date"
                      label="Date de fin"
                      variant="outlined"
                      type="date"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="event.end_time"
                      label="Heure de fin"
                      variant="outlined"
                      type="time"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="event.timezone"
                      :items="timezones"
                      label="Fuseau horaire"
                      variant="outlined"
                      :rules="[v => !!v || 'Le fuseau horaire est requis']"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-switch
                      v-model="event.is_recurring"
                      label="Événement récurrent"
                      color="primary"
                    ></v-switch>
                  </v-col>
                </v-row>

                <!-- Récurrence -->
                <v-row v-if="event.is_recurring">
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="event.recurrence_type"
                      :items="recurrenceTypes"
                      label="Type de récurrence"
                      variant="outlined"
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="event.recurrence_end"
                      label="Fin de récurrence"
                      variant="outlined"
                      type="date"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-divider class="my-6"></v-divider>

                <!-- Lieu -->
                <v-row>
                  <v-col cols="12">
                    <h3 class="text-h6 mb-3">Lieu et accès</h3>
                  </v-col>
                  <v-col cols="12" v-if="event.format !== 'online'">
                    <v-text-field
                      v-model="event.venue_name"
                      label="Nom du lieu"
                      variant="outlined"
                      :rules="event.format === 'physical' ? [v => !!v || 'Le lieu est requis'] : []"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" v-if="event.format !== 'online'">
                    <v-textarea
                      v-model="event.address"
                      label="Adresse complète"
                      variant="outlined"
                      rows="2"
                      :rules="event.format === 'physical' ? [v => !!v || 'L\'adresse est requise'] : []"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12" md="6" v-if="event.format !== 'physical'">
                    <v-text-field
                      v-model="event.online_link"
                      label="Lien de connexion"
                      variant="outlined"
                      type="url"
                      :rules="event.format === 'online' ? [v => !!v || 'Le lien est requis'] : []"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" v-if="event.format !== 'physical'">
                    <v-text-field
                      v-model="event.meeting_id"
                      label="ID de réunion (optionnel)"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-divider class="my-6"></v-divider>

                <!-- Inscription et participation -->
                <v-row>
                  <v-col cols="12">
                    <h3 class="text-h6 mb-3">Inscription et participation</h3>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="event.max_participants"
                      label="Nombre maximum de participants"
                      variant="outlined"
                      type="number"
                      min="1"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="event.registration_deadline"
                      label="Date limite d'inscription"
                      variant="outlined"
                      type="date"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-switch
                      v-model="event.is_free"
                      label="Événement gratuit"
                      color="primary"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-switch
                      v-model="event.requires_approval"
                      label="Inscription sur validation"
                      color="primary"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-switch
                      v-model="event.allow_waitlist"
                      label="Liste d'attente"
                      color="primary"
                    ></v-switch>
                  </v-col>
                  
                  <!-- Prix si payant -->
                  <v-col cols="12" md="6" v-if="!event.is_free">
                    <v-text-field
                      v-model="event.price"
                      label="Prix (€)"
                      variant="outlined"
                      type="number"
                      min="0"
                      step="0.01"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6" v-if="!event.is_free">
                    <v-text-field
                      v-model="event.early_bird_price"
                      label="Prix early bird (€)"
                      variant="outlined"
                      type="number"
                      min="0"
                      step="0.01"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <v-divider class="my-6"></v-divider>

                <!-- Programme et intervenants -->
                <v-row>
                  <v-col cols="12">
                    <h3 class="text-h6 mb-3">Programme et intervenants</h3>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="event.agenda"
                      label="Programme détaillé"
                      variant="outlined"
                      rows="4"
                      hint="Décrivez le déroulement de l'événement, les sessions, etc."
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="event.speakers"
                      label="Intervenants"
                      variant="outlined"
                      rows="3"
                      hint="Listez les intervenants et leurs qualifications"
                    ></v-textarea>
                  </v-col>
                  <v-col cols="12">
                    <v-combobox
                      v-model="event.tags"
                      label="Tags (mots-clés)"
                      variant="outlined"
                      multiple
                      chips
                      hint="Appuyez sur Entrée pour ajouter un tag"
                    ></v-combobox>
                  </v-col>
                </v-row>

                <v-divider class="my-6"></v-divider>

                <!-- Médias -->
                <v-row>
                  <v-col cols="12">
                    <h3 class="text-h6 mb-3">Médias et documents</h3>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-file-input
                      v-model="event.banner_image"
                      label="Image de bannière"
                      variant="outlined"
                      accept="image/*"
                      show-size
                    ></v-file-input>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-file-input
                      v-model="event.attachments"
                      label="Documents joints"
                      variant="outlined"
                      multiple
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      chips
                      show-size
                    ></v-file-input>
                  </v-col>
                </v-row>

                <v-divider class="my-6"></v-divider>

                <!-- Contact et informations complémentaires -->
                <v-row>
                  <v-col cols="12">
                    <h3 class="text-h6 mb-3">Contact organisateur</h3>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="event.organizer_name"
                      label="Nom de l'organisateur"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="event.organizer_email"
                      label="Email de contact"
                      variant="outlined"
                      type="email"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="event.organizer_phone"
                      label="Téléphone (optionnel)"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="event.website"
                      label="Site web (optionnel)"
                      variant="outlined"
                      type="url"
                    ></v-text-field>
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
                      v-model="event.is_featured"
                      label="Mettre en avant"
                      color="primary"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-switch
                      v-model="event.send_reminders"
                      label="Envoyer des rappels"
                      color="primary"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" md="4">
                    <v-switch
                      v-model="event.allow_networking"
                      label="Permettre le networking"
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
                @click="previewEvent"
              >
                <v-icon left>mdi-eye</v-icon>
                Aperçu
              </v-btn>
              <v-btn
                color="primary"
                :disabled="!formValid"
                @click="publishEvent"
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
  name: 'CreateEventView',
  setup() {
    const formValid = ref(false)
    const eventForm = ref(null)

    const event = ref({
      type: 'conference',
      title: '',
      category: '',
      format: 'physical',
      description: '',
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
      timezone: 'Africa/Abidjan',
      is_recurring: false,
      recurrence_type: '',
      recurrence_end: '',
      venue_name: '',
      address: '',
      online_link: '',
      meeting_id: '',
      max_participants: '',
      registration_deadline: '',
      is_free: true,
      requires_approval: false,
      allow_waitlist: false,
      price: '',
      early_bird_price: '',
      agenda: '',
      speakers: '',
      tags: [],
      banner_image: null,
      attachments: [],
      organizer_name: '',
      organizer_email: '',
      organizer_phone: '',
      website: '',
      is_featured: false,
      send_reminders: true,
      allow_networking: true
    })

    const eventTypes = [
      { label: 'Conférence', value: 'conference', icon: 'mdi-presentation' },
      { label: 'Workshop', value: 'workshop', icon: 'mdi-tools' },
      { label: 'Webinaire', value: 'webinar', icon: 'mdi-video' },
      { label: 'Formation', value: 'training', icon: 'mdi-school' },
      { label: 'Networking', value: 'networking', icon: 'mdi-account-group' },
      { label: 'Salon/Expo', value: 'exhibition', icon: 'mdi-store' }
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
      'Innovation',
      'Entrepreneuriat',
      'Formation'
    ]

    const eventFormats = [
      { title: 'Présentiel', value: 'physical' },
      { title: 'En ligne', value: 'online' },
      { title: 'Hybride', value: 'hybrid' }
    ]

    const timezones = [
      'Africa/Abidjan (GMT+0)',
      'Africa/Cairo (GMT+2)',
      'Africa/Johannesburg (GMT+2)',
      'Africa/Lagos (GMT+1)',
      'Africa/Nairobi (GMT+3)',
      'Europe/Paris (GMT+1)',
      'UTC (GMT+0)'
    ]

    const recurrenceTypes = [
      'Quotidien',
      'Hebdomadaire',
      'Mensuel',
      'Trimestriel',
      'Annuel'
    ]

    const saveDraft = () => {
      console.log('Sauvegarde du brouillon:', event.value)
      // Ici vous sauvegarderiez en local storage ou base de données
    }

    const previewEvent = () => {
      console.log('Aperçu de l\'événement:', event.value)
      // Ici vous pourriez ouvrir un dialog avec l'aperçu
    }

    const publishEvent = async () => {
      if (eventForm.value?.validate()) {
        console.log('Publication de l\'événement:', event.value)
        // Ici vous feriez l'appel API pour publier
        // Puis redirection vers la liste des événements
        // this.$router.push('/events')
      }
    }

    return {
      formValid,
      eventForm,
      event,
      eventTypes,
      categories,
      eventFormats,
      timezones,
      recurrenceTypes,
      saveDraft,
      previewEvent,
      publishEvent
    }
  }
}
</script>

<style scoped>
.create-event-view {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
