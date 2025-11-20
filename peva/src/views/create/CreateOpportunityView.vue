<template>
  <div class="create-opportunity-view">
    <!-- Header -->
    <v-app-bar color="primary" dark>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>Publier une Opportunité</v-toolbar-title>
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
              <v-icon class="mr-3">mdi-briefcase-plus</v-icon>
              Nouvelle Opportunité
            </v-card-title>
            
            <v-card-text>
              <v-form ref="opportunityForm" v-model="formValid">
                <!-- Type d'opportunité -->
                <v-row>
                  <v-col cols="12">
                    <h3 class="text-h6 mb-3">Type d'opportunité</h3>
                    <v-chip-group
                      v-model="opportunity.type"
                      mandatory
                      selected-class="text-primary"
                    >
                      <v-chip
                        v-for="type in opportunityTypes"
                        :key="type.value"
                        :value="type.value"
                        :prepend-icon="type.icon"
                        :color="opportunity.type === type.value ? 'primary' : ''"
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
                      v-model="opportunity.title"
                      label="Titre de l'opportunité"
                      variant="outlined"
                      :rules="[v => !!v || 'Le titre est requis']"
                      required
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="opportunity.category"
                      :items="categories"
                      label="Catégorie"
                      variant="outlined"
                      :rules="[v => !!v || 'La catégorie est requise']"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-select
                      v-model="opportunity.sector"
                      :items="sectors"
                      label="Secteur d'activité"
                      variant="outlined"
                      :rules="[v => !!v || 'Le secteur est requis']"
                      required
                    ></v-select>
                  </v-col>
                  <v-col cols="12">
                    <v-textarea
                      v-model="opportunity.description"
                      label="Description détaillée"
                      variant="outlined"
                      rows="4"
                      :rules="[v => !!v || 'La description est requise']"
                      required
                    ></v-textarea>
                  </v-col>
                </v-row>

                <v-divider class="my-6"></v-divider>

                <!-- Détails spécifiques selon le type -->
                <div v-if="opportunity.type === 'funding'">
                  <v-row>
                    <v-col cols="12">
                      <h3 class="text-h6 mb-3">Détails du financement</h3>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="opportunity.funding_amount"
                        label="Montant du financement"
                        variant="outlined"
                        type="number"
                        prefix="€"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="opportunity.funding_type"
                        :items="fundingTypes"
                        label="Type de financement"
                        variant="outlined"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="opportunity.eligibility"
                        label="Critères d'éligibilité"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="opportunity.application_deadline"
                        label="Date limite de candidature"
                        variant="outlined"
                        type="date"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                </div>

                <div v-if="opportunity.type === 'job'">
                  <v-row>
                    <v-col cols="12">
                      <h3 class="text-h6 mb-3">Détails de l'emploi</h3>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="opportunity.job_type"
                        :items="jobTypes"
                        label="Type d'emploi"
                        variant="outlined"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="opportunity.experience_level"
                        :items="experienceLevels"
                        label="Niveau d'expérience"
                        variant="outlined"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="opportunity.salary_range"
                        label="Fourchette salariale"
                        variant="outlined"
                        placeholder="Ex: 30 000 - 45 000 €"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="opportunity.location"
                        label="Localisation"
                        variant="outlined"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="opportunity.requirements"
                        label="Exigences et qualifications"
                        variant="outlined"
                        rows="3"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </div>

                <div v-if="opportunity.type === 'partnership'">
                  <v-row>
                    <v-col cols="12">
                      <h3 class="text-h6 mb-3">Détails du partenariat</h3>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="opportunity.partnership_type"
                        :items="partnershipTypes"
                        label="Type de partenariat"
                        variant="outlined"
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="opportunity.duration"
                        label="Durée prévue"
                        variant="outlined"
                        placeholder="Ex: 12 mois"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12">
                      <v-textarea
                        v-model="opportunity.partner_profile"
                        label="Profil du partenaire recherché"
                        variant="outlined"
                        rows="3"
                      ></v-textarea>
                    </v-col>
                  </v-row>
                </div>

                <v-divider class="my-6"></v-divider>

                <!-- Contact et informations complémentaires -->
                <v-row>
                  <v-col cols="12">
                    <h3 class="text-h6 mb-3">Contact et informations complémentaires</h3>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="opportunity.contact_name"
                      label="Nom du contact"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="opportunity.contact_email"
                      label="Email de contact"
                      variant="outlined"
                      type="email"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="opportunity.contact_phone"
                      label="Téléphone (optionnel)"
                      variant="outlined"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-text-field
                      v-model="opportunity.website"
                      label="Site web (optionnel)"
                      variant="outlined"
                      type="url"
                    ></v-text-field>
                  </v-col>
                  <v-col cols="12">
                    <v-file-input
                      v-model="opportunity.attachments"
                      label="Documents joints (optionnel)"
                      variant="outlined"
                      multiple
                      accept=".pdf,.doc,.docx"
                      chips
                    ></v-file-input>
                  </v-col>
                </v-row>

                <v-divider class="my-6"></v-divider>

                <!-- Options de publication -->
                <v-row>
                  <v-col cols="12">
                    <h3 class="text-h6 mb-3">Options de publication</h3>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-switch
                      v-model="opportunity.is_featured"
                      label="Mettre en avant (premium)"
                      color="primary"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12" md="6">
                    <v-switch
                      v-model="opportunity.allow_applications"
                      label="Permettre les candidatures en ligne"
                      color="primary"
                    ></v-switch>
                  </v-col>
                  <v-col cols="12">
                    <v-text-field
                      v-model="opportunity.expiry_date"
                      label="Date d'expiration (optionnel)"
                      variant="outlined"
                      type="date"
                      hint="Laisser vide pour une publication permanente"
                    ></v-text-field>
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
                @click="previewOpportunity"
              >
                <v-icon left>mdi-eye</v-icon>
                Aperçu
              </v-btn>
              <v-btn
                color="primary"
                :disabled="!formValid"
                @click="publishOpportunity"
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
  name: 'CreateOpportunityView',
  setup() {
    const formValid = ref(false)
    const opportunityForm = ref(null)

    const opportunity = ref({
      type: 'funding',
      title: '',
      category: '',
      sector: '',
      description: '',
      // Funding specific
      funding_amount: '',
      funding_type: '',
      eligibility: '',
      application_deadline: '',
      // Job specific
      job_type: '',
      experience_level: '',
      salary_range: '',
      location: '',
      requirements: '',
      // Partnership specific
      partnership_type: '',
      duration: '',
      partner_profile: '',
      // Contact
      contact_name: '',
      contact_email: '',
      contact_phone: '',
      website: '',
      attachments: [],
      // Options
      is_featured: false,
      allow_applications: true,
      expiry_date: ''
    })

    const opportunityTypes = [
      { label: 'Financement', value: 'funding', icon: 'mdi-currency-usd' },
      { label: 'Emploi', value: 'job', icon: 'mdi-briefcase' },
      { label: 'Partenariat', value: 'partnership', icon: 'mdi-handshake' },
      { label: 'Formation', value: 'training', icon: 'mdi-school' }
    ]

    const categories = [
      'Énergies Renouvelables',
      'Agriculture Durable',
      'Technologies Propres',
      'Finance Verte',
      'Transport Durable',
      'Économie Circulaire',
      'Biodiversité',
      'Changement Climatique'
    ]

    const sectors = [
      'Énergie',
      'Agriculture',
      'Technologie',
      'Finance',
      'Transport',
      'Construction',
      'Industrie',
      'Services',
      'Éducation',
      'Santé'
    ]

    const fundingTypes = [
      'Subvention',
      'Prêt',
      'Investissement',
      'Crowdfunding',
      'Capital-risque',
      'Financement participatif'
    ]

    const jobTypes = [
      'CDI',
      'CDD',
      'Stage',
      'Freelance',
      'Temps partiel',
      'Télétravail'
    ]

    const experienceLevels = [
      'Débutant (0-2 ans)',
      'Intermédiaire (2-5 ans)',
      'Expérimenté (5-10 ans)',
      'Senior (10+ ans)'
    ]

    const partnershipTypes = [
      'Commercial',
      'Technique',
      'Recherche & Développement',
      'Distribution',
      'Joint-venture',
      'Consortium'
    ]

    const saveDraft = () => {
      console.log('Sauvegarde du brouillon:', opportunity.value)
      // Ici vous sauvegarderiez en local storage ou base de données
    }

    const previewOpportunity = () => {
      console.log('Aperçu de l\'opportunité:', opportunity.value)
      // Ici vous pourriez ouvrir un dialog avec l'aperçu
    }

    const publishOpportunity = async () => {
      if (opportunityForm.value?.validate()) {
        console.log('Publication de l\'opportunité:', opportunity.value)
        // Ici vous feriez l'appel API pour publier
        // Puis redirection vers la liste des opportunités
        // this.$router.push('/opportunities')
      }
    }

    return {
      formValid,
      opportunityForm,
      opportunity,
      opportunityTypes,
      categories,
      sectors,
      fundingTypes,
      jobTypes,
      experienceLevels,
      partnershipTypes,
      saveDraft,
      previewOpportunity,
      publishOpportunity
    }
  }
}
</script>

<style scoped>
.create-opportunity-view {
  min-height: 100vh;
  background-color: #f5f5f5;
}
</style>
