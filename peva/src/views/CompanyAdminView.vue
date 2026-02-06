<template>
  <div class="company-admin-view">
    <!-- Loading -->
    <div v-if="loading" class="d-flex justify-center align-center" style="min-height: 400px">
      <v-progress-circular indeterminate color="teal" size="64" />
    </div>

    <template v-else>
      <v-row no-gutters>
        <!-- Sidebar: Liste des entreprises -->
        <v-col cols="12" md="3" lg="2" class="sidebar-companies bg-grey-lighten-4" style="min-height: calc(100vh - 64px);">
          <div class="pa-4">
            <div class="d-flex align-center justify-space-between mb-4">
              <h3 class="text-h6">Mes Entreprises</h3>
              <v-btn icon="mdi-plus" size="small" color="teal" variant="text" @click="$router.push('/my-companies')" />
            </div>
            
            <v-list density="compact" nav class="bg-transparent">
              <v-list-item
                v-for="c in userCompanies"
                :key="c.id"
                :active="company?.id === c.id"
                active-color="teal"
                rounded
                @click="selectCompany(c.id)"
              >
                <template #prepend>
                  <v-avatar size="36" :color="c.logo_url ? 'transparent' : 'teal-lighten-4'">
                    <v-img v-if="c.logo_url" :src="c.logo_url" />
                    <span v-else class="text-teal font-weight-bold">{{ c.name?.charAt(0) }}</span>
                  </v-avatar>
                </template>
                <v-list-item-title class="text-body-2">{{ c.name }}</v-list-item-title>
                <v-list-item-subtitle class="text-caption">{{ c.city }}, {{ c.country }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>

            <v-divider class="my-4" />
            
            <v-btn block color="teal" variant="outlined" size="small" @click="$router.push('/my-companies')">
              <v-icon start>mdi-arrow-left</v-icon>
              Retour
            </v-btn>
          </div>
        </v-col>

        <!-- Main Content -->
        <v-col cols="12" md="9" lg="10">
          <template v-if="company">
      <!-- Hero Banner avec infos entreprise -->
      <div class="hero-banner text-white py-6" :style="{ background: `linear-gradient(135deg, ${primaryColor} 0%, ${secondaryColor} 100%)` }">
        <v-container>
          <div class="d-flex align-center justify-space-between flex-wrap ga-4">
            <div class="d-flex align-center">
              <!-- Logo / Avatar -->
              <v-avatar size="80" class="mr-4 company-logo" color="white">
                <v-img v-if="company.logo_url" :src="company.logo_url" />
                <span v-else class="text-h3 font-weight-bold" :style="{ color: primaryColor }">
                  {{ company.name?.charAt(0) }}
                </span>
              </v-avatar>
              <div>
                <h1 class="text-h4 font-weight-bold mb-1">{{ company.name }}</h1>
                <p class="text-body-1 ma-0 opacity-90">
                  <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
                  {{ company.city }}, {{ company.country }}
                  <v-chip size="x-small" class="ml-2" color="white" variant="outlined">
                    {{ company.industry }}
                  </v-chip>
                </p>
              </div>
            </div>
            <div class="d-flex ga-2">
              <v-btn color="white" variant="outlined" @click="$router.push('/my-companies')">
                <v-icon start>mdi-arrow-left</v-icon>
                Retour
              </v-btn>
              <v-btn color="white" variant="flat" :style="{ color: primaryColor }" @click="showOnMap">
                <v-icon start>mdi-map</v-icon>
                Voir sur la carte
              </v-btn>
            </div>
          </div>
        </v-container>
      </div>

      <v-container class="py-6">
        <!-- Onglets de gestion -->
        <v-tabs v-model="activeTab" color="teal" class="mb-6">
          <v-tab value="profile">
            <v-icon start>mdi-domain</v-icon>
            Fiche entreprise
          </v-tab>
          <v-tab value="declarations">
            <v-icon start>mdi-file-document-edit</v-icon>
            Déclarations ESG
            <v-chip v-if="declarations.length" size="x-small" class="ml-2" color="teal">
              {{ declarations.length }}
            </v-chip>
          </v-tab>
          <v-tab value="analytics">
            <v-icon start>mdi-chart-line</v-icon>
            Analytiques
          </v-tab>
        </v-tabs>

        <v-window v-model="activeTab">
          <!-- Tab: Fiche entreprise -->
          <v-window-item value="profile">
            <v-row>
              <v-col cols="12" md="8">
                <v-card class="mb-4">
                  <v-card-title class="d-flex align-center">
                    <v-icon class="mr-2" color="teal">mdi-pencil</v-icon>
                    Informations générales
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="editForm.name"
                          label="Nom de l'entreprise"
                          variant="outlined"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="editForm.industry"
                          :items="sectors"
                          label="Secteur d'activité"
                          variant="outlined"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="editForm.country"
                          :items="countries"
                          label="Pays"
                          variant="outlined"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="editForm.city"
                          label="Ville"
                          variant="outlined"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="editForm.description"
                          label="Description"
                          variant="outlined"
                          rows="3"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="editForm.website"
                          label="Site web"
                          variant="outlined"
                          prepend-inner-icon="mdi-web"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="editForm.email"
                          label="Email de contact"
                          variant="outlined"
                          prepend-inner-icon="mdi-email"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="editForm.phone"
                          label="Téléphone"
                          variant="outlined"
                          prepend-inner-icon="mdi-phone"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model.number="editForm.employees"
                          label="Nombre d'employés"
                          variant="outlined"
                          type="number"
                          prepend-inner-icon="mdi-account-group"
                        />
                      </v-col>
                    </v-row>
                  </v-card-text>
                  <v-card-actions class="pa-4">
                    <v-spacer />
                    <v-btn color="teal" :loading="savingProfile" @click="saveProfile">
                      <v-icon start>mdi-content-save</v-icon>
                      Enregistrer les modifications
                    </v-btn>
                  </v-card-actions>
                </v-card>

                <!-- Activités et ODD -->
                <v-card>
                  <v-card-title class="d-flex align-center">
                    <v-icon class="mr-2" color="teal">mdi-leaf</v-icon>
                    Activités & Contributions ODD
                  </v-card-title>
                  <v-card-text>
                    <v-textarea
                      v-model="editForm.main_activities"
                      label="Activités principales"
                      variant="outlined"
                      rows="3"
                      class="mb-4"
                    />
                    
                    <div class="text-subtitle-2 mb-2">ODD contribués</div>
                    <v-chip-group v-model="editForm.sdg_contributions" multiple column>
                      <v-chip
                        v-for="sdg in sdgList"
                        :key="sdg.number"
                        :value="sdg.number"
                        filter
                        :color="sdg.color"
                        variant="outlined"
                        size="small"
                      >
                        ODD {{ sdg.number }}
                      </v-chip>
                    </v-chip-group>
                  </v-card-text>
                </v-card>
              </v-col>

              <!-- Sidebar: Logo et statut -->
              <v-col cols="12" md="4">
                <!-- Logo -->
                <v-card class="mb-4">
                  <v-card-title>
                    <v-icon class="mr-2" color="teal">mdi-image</v-icon>
                    Logo de l'entreprise
                  </v-card-title>
                  <v-card-text class="text-center">
                    <v-avatar size="120" class="mb-4" :color="company.logo_url ? 'transparent' : 'teal-lighten-4'">
                      <v-img v-if="company.logo_url" :src="company.logo_url" />
                      <v-icon v-else size="60" color="teal">mdi-domain</v-icon>
                    </v-avatar>
                    
                    <v-file-input
                      v-model="logoFile"
                      label="Changer le logo"
                      accept="image/*"
                      prepend-icon=""
                      prepend-inner-icon="mdi-camera"
                      variant="outlined"
                      density="compact"
                      class="mb-2"
                    />
                    
                    <v-btn
                      color="teal"
                      variant="outlined"
                      size="small"
                      :loading="uploadingLogo"
                      :disabled="!logoFile"
                      @click="uploadLogo"
                    >
                      <v-icon start>mdi-upload</v-icon>
                      Télécharger
                    </v-btn>
                  </v-card-text>
                </v-card>

                <!-- Statut -->
                <v-card class="mb-4">
                  <v-card-title>
                    <v-icon class="mr-2" color="teal">mdi-shield-check</v-icon>
                    Statut
                  </v-card-title>
                  <v-card-text>
                    <v-list density="compact">
                      <v-list-item>
                        <template #prepend>
                          <v-icon :color="company.is_verified ? 'green' : 'orange'">
                            {{ company.is_verified ? 'mdi-check-circle' : 'mdi-clock-outline' }}
                          </v-icon>
                        </template>
                        <v-list-item-title>
                          {{ company.is_verified ? 'Vérifié' : 'En attente de vérification' }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item>
                        <template #prepend>
                          <v-icon :color="getStatusColor(company.status)">mdi-circle</v-icon>
                        </template>
                        <v-list-item-title>
                          Statut: {{ getStatusLabel(company.status) }}
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item>
                        <template #prepend>
                          <v-icon color="teal">mdi-calendar</v-icon>
                        </template>
                        <v-list-item-title>
                          Créé le {{ formatDate(company.created_at) }}
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                </v-card>

                <!-- Coordonnées GPS -->
                <v-card>
                  <v-card-title>
                    <v-icon class="mr-2" color="teal">mdi-map-marker</v-icon>
                    Position sur la carte
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="6">
                        <v-text-field
                          v-model.number="editForm.latitude"
                          label="Latitude"
                          variant="outlined"
                          density="compact"
                          type="number"
                          step="0.0001"
                        />
                      </v-col>
                      <v-col cols="6">
                        <v-text-field
                          v-model.number="editForm.longitude"
                          label="Longitude"
                          variant="outlined"
                          density="compact"
                          type="number"
                          step="0.0001"
                        />
                      </v-col>
                    </v-row>
                    <v-btn
                      color="teal"
                      variant="text"
                      size="small"
                      block
                      @click="showOnMap"
                    >
                      <v-icon start>mdi-map</v-icon>
                      Voir sur la carte
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Tab: Déclarations ESG -->
          <v-window-item value="declarations">
            <v-row>
              <v-col cols="12">
                <div class="d-flex align-center justify-space-between mb-4">
                  <h3 class="text-h6">Déclarations par année</h3>
                  <v-btn color="teal" @click="showNewDeclarationDialog = true">
                    <v-icon start>mdi-plus</v-icon>
                    Nouvelle déclaration
                  </v-btn>
                </div>

                <!-- Liste des déclarations -->
                <v-card v-if="declarations.length === 0" variant="outlined" class="text-center py-12">
                  <v-icon size="64" color="grey-lighten-1" class="mb-4">mdi-file-document-outline</v-icon>
                  <h3 class="text-h6 text-grey-darken-1 mb-2">Aucune déclaration</h3>
                  <p class="text-body-2 text-grey mb-4">
                    Créez votre première déclaration ESG pour cette entreprise.
                  </p>
                  <v-btn color="teal" @click="showNewDeclarationDialog = true">
                    <v-icon start>mdi-plus</v-icon>
                    Créer une déclaration
                  </v-btn>
                </v-card>

                <v-expansion-panels v-else variant="accordion">
                  <v-expansion-panel
                    v-for="declaration in declarations"
                    :key="declaration.id"
                  >
                    <v-expansion-panel-title>
                      <div class="d-flex align-center justify-space-between w-100 pr-4">
                        <div class="d-flex align-center">
                          <v-icon class="mr-3" color="teal">mdi-calendar</v-icon>
                          <div>
                            <div class="font-weight-bold">Année {{ declaration.period?.label }}</div>
                            <div class="text-caption text-grey">
                              Créée le {{ formatDate(declaration.created_at) }}
                            </div>
                          </div>
                        </div>
                        <v-chip :color="getDeclarationStatusColor(declaration.status)" size="small">
                          {{ getDeclarationStatusLabel(declaration.status) }}
                        </v-chip>
                      </div>
                    </v-expansion-panel-title>
                    <v-expansion-panel-text>
                      <v-tabs v-model="declaration.activeSubTab" density="compact" class="mb-4">
                        <v-tab value="hr">RH</v-tab>
                        <v-tab value="emissions">Émissions</v-tab>
                        <v-tab value="waste">Déchets</v-tab>
                      </v-tabs>

                      <v-window v-model="declaration.activeSubTab">
                        <!-- Données RH -->
                        <v-window-item value="hr">
                          <v-row>
                            <v-col cols="6" md="3">
                              <v-text-field
                                v-model.number="declaration.hr.employee_count"
                                label="Employés"
                                type="number"
                                variant="outlined"
                                density="compact"
                              />
                            </v-col>
                            <v-col cols="6" md="3">
                              <v-text-field
                                v-model.number="declaration.hr.cdi_ratio"
                                label="% CDI"
                                type="number"
                                variant="outlined"
                                density="compact"
                                suffix="%"
                              />
                            </v-col>
                            <v-col cols="6" md="3">
                              <v-text-field
                                v-model.number="declaration.hr.cdd_ratio"
                                label="% CDD"
                                type="number"
                                variant="outlined"
                                density="compact"
                                suffix="%"
                              />
                            </v-col>
                            <v-col cols="6" md="3">
                              <v-text-field
                                v-model.number="declaration.hr.solar_percentage"
                                label="% Énergie solaire"
                                type="number"
                                variant="outlined"
                                density="compact"
                                suffix="%"
                              />
                            </v-col>
                          </v-row>
                        </v-window-item>

                        <!-- Émissions -->
                        <v-window-item value="emissions">
                          <v-row>
                            <v-col cols="6" md="3">
                              <v-text-field
                                v-model.number="declaration.emissions.total_emissions"
                                label="Émissions totales"
                                type="number"
                                variant="outlined"
                                density="compact"
                                suffix="tCO2e"
                              />
                            </v-col>
                            <v-col cols="6" md="3">
                              <v-text-field
                                v-model.number="declaration.emissions.scope1_emissions"
                                label="Scope 1"
                                type="number"
                                variant="outlined"
                                density="compact"
                                suffix="tCO2e"
                              />
                            </v-col>
                            <v-col cols="6" md="3">
                              <v-text-field
                                v-model.number="declaration.emissions.scope2_emissions"
                                label="Scope 2"
                                type="number"
                                variant="outlined"
                                density="compact"
                                suffix="tCO2e"
                              />
                            </v-col>
                            <v-col cols="6" md="3">
                              <v-text-field
                                v-model.number="declaration.emissions.scope3_emissions"
                                label="Scope 3"
                                type="number"
                                variant="outlined"
                                density="compact"
                                suffix="tCO2e"
                              />
                            </v-col>
                          </v-row>
                        </v-window-item>

                        <!-- Déchets -->
                        <v-window-item value="waste">
                          <v-row>
                            <v-col cols="12" md="6">
                              <v-text-field
                                v-model="declaration.waste.solid_waste_raw"
                                label="Déchets solides"
                                variant="outlined"
                                density="compact"
                                placeholder="Ex: 15,29t/an"
                              />
                            </v-col>
                            <v-col cols="12" md="6">
                              <v-text-field
                                v-model="declaration.waste.liquid_waste_raw"
                                label="Déchets liquides"
                                variant="outlined"
                                density="compact"
                                placeholder="Ex: 773m3/an"
                              />
                            </v-col>
                            <v-col cols="12">
                              <v-textarea
                                v-model="declaration.waste.valorization_initiatives"
                                label="Initiatives de valorisation"
                                variant="outlined"
                                rows="2"
                              />
                            </v-col>
                          </v-row>
                        </v-window-item>
                      </v-window>

                      <v-divider class="my-4" />
                      <div class="d-flex justify-end ga-2">
                        <v-btn variant="text" color="grey" @click="resetDeclaration(declaration)">
                          Annuler
                        </v-btn>
                        <v-btn color="teal" @click="saveDeclaration(declaration)">
                          <v-icon start>mdi-content-save</v-icon>
                          Enregistrer
                        </v-btn>
                      </div>
                    </v-expansion-panel-text>
                  </v-expansion-panel>
                </v-expansion-panels>
              </v-col>
            </v-row>
          </v-window-item>

          <!-- Tab: Analytiques -->
          <v-window-item value="analytics">
            <v-row>
              <v-col cols="12" md="4">
                <v-card class="text-center pa-4" color="green-lighten-5">
                  <v-icon size="48" color="green" class="mb-2">mdi-leaf</v-icon>
                  <div class="text-h4 font-weight-bold text-green">
                    {{ latestDeclaration?.emissions?.total_emissions || '-' }}
                  </div>
                  <div class="text-body-2 text-grey">tCO2e émissions totales</div>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card class="text-center pa-4" color="blue-lighten-5">
                  <v-icon size="48" color="blue" class="mb-2">mdi-account-group</v-icon>
                  <div class="text-h4 font-weight-bold text-blue">
                    {{ latestDeclaration?.hr?.employee_count || company.employees || '-' }}
                  </div>
                  <div class="text-body-2 text-grey">Employés</div>
                </v-card>
              </v-col>
              <v-col cols="12" md="4">
                <v-card class="text-center pa-4" color="amber-lighten-5">
                  <v-icon size="48" color="amber" class="mb-2">mdi-solar-power</v-icon>
                  <div class="text-h4 font-weight-bold text-amber">
                    {{ latestDeclaration?.hr?.solar_percentage || '-' }}%
                  </div>
                  <div class="text-body-2 text-grey">Énergie solaire</div>
                </v-card>
              </v-col>
            </v-row>

            <v-card class="mt-6">
              <v-card-title>
                <v-icon class="mr-2" color="teal">mdi-chart-timeline-variant</v-icon>
                Évolution des émissions
              </v-card-title>
              <v-card-text>
                <div v-if="declarations.length < 2" class="text-center py-8 text-grey">
                  <v-icon size="48" class="mb-2">mdi-chart-line</v-icon>
                  <p>Ajoutez au moins 2 déclarations pour voir l'évolution</p>
                </div>
                <div v-else class="emissions-chart">
                  <!-- Placeholder pour un vrai graphique -->
                  <v-table density="compact">
                    <thead>
                      <tr>
                        <th>Année</th>
                        <th class="text-right">Émissions totales</th>
                        <th class="text-right">Scope 1</th>
                        <th class="text-right">Scope 2</th>
                        <th class="text-right">Scope 3</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="d in declarations" :key="d.id">
                        <td>{{ d.period?.label }}</td>
                        <td class="text-right">{{ d.emissions?.total_emissions || '-' }}</td>
                        <td class="text-right">{{ d.emissions?.scope1_emissions || '-' }}</td>
                        <td class="text-right">{{ d.emissions?.scope2_emissions || '-' }}</td>
                        <td class="text-right">{{ d.emissions?.scope3_emissions || '-' }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card-text>
            </v-card>
          </v-window-item>
        </v-window>
      </v-container>
          </template>

          <!-- No company selected -->
          <v-container v-else class="text-center py-12">
            <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-domain</v-icon>
            <h2 class="text-h5 text-grey-darken-1 mb-2">Sélectionnez une entreprise</h2>
            <p class="text-body-1 text-grey mb-4">Choisissez une entreprise dans la liste à gauche pour voir ses détails.</p>
          </v-container>
        </v-col>
      </v-row>
    </template>

    <!-- Dialog: Nouvelle déclaration -->
    <v-dialog v-model="showNewDeclarationDialog" max-width="400">
      <v-card>
        <v-card-title class="bg-teal text-white">
          <v-icon class="mr-2">mdi-plus</v-icon>
          Nouvelle déclaration
        </v-card-title>
        <v-card-text class="pa-4">
          <v-select
            v-model="newDeclarationYear"
            :items="availableYears"
            label="Année"
            variant="outlined"
          />
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="showNewDeclarationDialog = false">Annuler</v-btn>
          <v-btn color="teal" :disabled="!newDeclarationYear" @click="createDeclaration">
            Créer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="showSnackbar" :color="snackbarColor" timeout="4000">
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { supabase } from '@/lib/supabase'
import companyService from '@/services/companyService'
import { getSectorNames } from '@/services/sectorsService'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// State
const loading = ref(true)
const company = ref(null)
const userCompanies = ref([])
const declarations = ref([])
const activeTab = ref('profile')

// Edit form
const editForm = ref({})
const savingProfile = ref(false)

// Logo
const logoFile = ref(null)
const uploadingLogo = ref(false)

// Sectors & Countries
const sectors = ref([])
const countries = ref(['Burkina Faso', 'Côte d\'Ivoire', 'Mali', 'Niger', 'Sénégal', 'Bénin', 'Togo', 'Ghana'])

// SDG List
const sdgList = ref([
  { number: 1, color: '#E5243B' }, { number: 2, color: '#DDA63A' }, { number: 3, color: '#4C9F38' },
  { number: 4, color: '#C5192D' }, { number: 5, color: '#FF3A21' }, { number: 6, color: '#26BDE2' },
  { number: 7, color: '#FCC30B' }, { number: 8, color: '#A21942' }, { number: 9, color: '#FD6925' },
  { number: 10, color: '#DD1367' }, { number: 11, color: '#FD9D24' }, { number: 12, color: '#BF8B2E' },
  { number: 13, color: '#3F7E44' }, { number: 14, color: '#0A97D9' }, { number: 15, color: '#56C02B' },
  { number: 16, color: '#00689D' }, { number: 17, color: '#19486A' }
])

// Declaration dialog
const showNewDeclarationDialog = ref(false)
const newDeclarationYear = ref(null)
const availableYears = computed(() => {
  const usedYears = declarations.value.map(d => d.period?.label)
  return [2024, 2025, 2026].filter(y => !usedYears.includes(String(y)))
})

// Snackbar
const showSnackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Computed
const primaryColor = computed(() => {
  const colors = ['#0d9488', '#3b82f6', '#8b5cf6', '#f59e0b', '#ef4444']
  return colors[company.value?.name?.charCodeAt(0) % colors.length] || '#0d9488'
})

const secondaryColor = computed(() => {
  return primaryColor.value + '99'
})

const latestDeclaration = computed(() => {
  return declarations.value.find(d => d.status === 'VALIDATED') || declarations.value[0]
})

// Methods
const loadUserCompanies = async () => {
  try {
    const { data, error } = await supabase
      .from('pev_companies')
      .select('id, name, logo_url, city, country, industry')
      .or(`owner_id.eq.${authStore.user?.id},claimed_by.eq.${authStore.user?.id}`)
      .order('name')
    
    if (error) throw error
    userCompanies.value = data || []
  } catch (error) {
    console.error('Erreur chargement entreprises:', error)
  }
}

const selectCompany = (companyId) => {
  router.push({ name: 'CompanyAdmin', params: { id: companyId } })
}

const loadCompany = async () => {
  const companyId = route.params.id
  
  // Charger la liste des entreprises de l'utilisateur
  await loadUserCompanies()
  
  if (!companyId) {
    // Si pas d'ID, sélectionner la première entreprise
    if (userCompanies.value.length > 0) {
      router.replace({ name: 'CompanyAdmin', params: { id: userCompanies.value[0].id } })
    }
    loading.value = false
    return
  }

  loading.value = true
  try {
    // Charger l'entreprise
    const { data, error } = await supabase
      .from('pev_companies')
      .select('*')
      .eq('id', companyId)
      .single()

    if (error) throw error

    // Vérifier les droits d'accès
    if (data.owner_id !== authStore.user?.id && data.claimed_by !== authStore.user?.id) {
      // Vérifier si admin
      if (!authStore.isAdmin) {
        company.value = null
        return
      }
    }

    company.value = data
    editForm.value = { ...data, sdg_contributions: data.sdg_contributions || [] }

    // Charger les déclarations
    await loadDeclarations()
    
    // Charger les secteurs
    sectors.value = await getSectorNames()
  } catch (error) {
    console.error('Erreur chargement entreprise:', error)
  } finally {
    loading.value = false
  }
}

const loadDeclarations = async () => {
  if (!company.value?.id) return

  try {
    const { data, error } = await supabase
      .from('pev_company_declarations')
      .select(`
        *,
        period:period_id(id, year, label)
      `)
      .eq('company_id', company.value.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    // Charger les données détaillées pour chaque déclaration
    for (const declaration of data || []) {
      declaration.activeSubTab = 'hr'
      
      // HR
      const { data: hr } = await supabase
        .from('pev_company_declaration_hr')
        .select('*')
        .eq('declaration_id', declaration.id)
        .single()
      declaration.hr = hr || {}

      // Emissions
      const { data: emissions } = await supabase
        .from('pev_company_declaration_emissions')
        .select('*')
        .eq('declaration_id', declaration.id)
        .single()
      declaration.emissions = emissions || {}

      // Waste
      const { data: waste } = await supabase
        .from('pev_company_declaration_waste')
        .select('*')
        .eq('declaration_id', declaration.id)
        .single()
      declaration.waste = waste || {}
    }

    declarations.value = data || []
  } catch (error) {
    console.error('Erreur chargement déclarations:', error)
  }
}

const saveProfile = async () => {
  savingProfile.value = true
  try {
    const { error } = await supabase
      .from('pev_companies')
      .update({
        name: editForm.value.name,
        industry: editForm.value.industry,
        activity_sector: editForm.value.industry,
        country: editForm.value.country,
        city: editForm.value.city,
        description: editForm.value.description,
        website: editForm.value.website,
        email: editForm.value.email,
        phone: editForm.value.phone,
        employees: editForm.value.employees,
        latitude: editForm.value.latitude,
        longitude: editForm.value.longitude,
        main_activities: editForm.value.main_activities,
        sdg_contributions: editForm.value.sdg_contributions,
        updated_at: new Date().toISOString()
      })
      .eq('id', company.value.id)

    if (error) throw error

    company.value = { ...company.value, ...editForm.value }
    showMessage('Profil mis à jour avec succès', 'success')
  } catch (error) {
    showMessage(error.message, 'error')
  } finally {
    savingProfile.value = false
  }
}

const uploadLogo = async () => {
  if (!logoFile.value) return

  uploadingLogo.value = true
  try {
    const file = logoFile.value
    const fileExt = file.name.split('.').pop()
    const fileName = `${company.value.id}-${Date.now()}.${fileExt}`
    const filePath = `companies/logos/${fileName}`

    // Upload vers le bucket
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // Récupérer l'URL publique
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    // Mettre à jour l'entreprise
    const { error: updateError } = await supabase
      .from('pev_companies')
      .update({ logo_url: publicUrl, updated_at: new Date().toISOString() })
      .eq('id', company.value.id)

    if (updateError) throw updateError

    company.value.logo_url = publicUrl
    logoFile.value = null
    showMessage('Logo mis à jour avec succès', 'success')
  } catch (error) {
    showMessage(error.message, 'error')
  } finally {
    uploadingLogo.value = false
  }
}

const createDeclaration = async () => {
  if (!newDeclarationYear.value) return

  try {
    // Trouver la période
    const { data: period } = await supabase
      .from('pev_periods')
      .select('id')
      .eq('year', newDeclarationYear.value)
      .single()

    if (!period) {
      showMessage('Période non trouvée', 'error')
      return
    }

    // Créer la déclaration
    const { data, error } = await supabase
      .from('pev_company_declarations')
      .insert({
        company_id: company.value.id,
        period_id: period.id,
        source: 'COMPANY',
        status: 'DRAFT',
        created_by: authStore.user.id
      })
      .select()
      .single()

    if (error) throw error

    showNewDeclarationDialog.value = false
    newDeclarationYear.value = null
    await loadDeclarations()
    showMessage('Déclaration créée', 'success')
  } catch (error) {
    showMessage(error.message, 'error')
  }
}

const saveDeclaration = async (declaration) => {
  try {
    // Sauvegarder HR
    if (declaration.hr) {
      await supabase
        .from('pev_company_declaration_hr')
        .upsert({
          declaration_id: declaration.id,
          ...declaration.hr,
          updated_at: new Date().toISOString()
        }, { onConflict: 'declaration_id' })
    }

    // Sauvegarder Emissions
    if (declaration.emissions) {
      await supabase
        .from('pev_company_declaration_emissions')
        .upsert({
          declaration_id: declaration.id,
          ...declaration.emissions,
          updated_at: new Date().toISOString()
        }, { onConflict: 'declaration_id' })
    }

    // Sauvegarder Waste
    if (declaration.waste) {
      await supabase
        .from('pev_company_declaration_waste')
        .upsert({
          declaration_id: declaration.id,
          ...declaration.waste,
          updated_at: new Date().toISOString()
        }, { onConflict: 'declaration_id' })
    }

    showMessage('Déclaration enregistrée', 'success')
  } catch (error) {
    showMessage(error.message, 'error')
  }
}

const resetDeclaration = (declaration) => {
  loadDeclarations()
}

const showOnMap = () => {
  if (company.value?.latitude && company.value?.longitude) {
    router.push({
      path: '/map',
      query: { highlight: company.value.id }
    })
  } else {
    showMessage('Coordonnées GPS non définies', 'warning')
  }
}

const showMessage = (message, color = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  showSnackbar.value = true
}

const getStatusColor = (status) => {
  const colors = { draft: 'grey', in_review: 'orange', published: 'green', rejected: 'red' }
  return colors[status] || 'grey'
}

const getStatusLabel = (status) => {
  const labels = { draft: 'Brouillon', in_review: 'En révision', published: 'Publié', rejected: 'Rejeté' }
  return labels[status] || status
}

const getDeclarationStatusColor = (status) => {
  const colors = { DRAFT: 'grey', SUBMITTED: 'orange', VALIDATED: 'green', REJECTED: 'red' }
  return colors[status] || 'grey'
}

const getDeclarationStatusLabel = (status) => {
  const labels = { DRAFT: 'Brouillon', SUBMITTED: 'Soumise', VALIDATED: 'Validée', REJECTED: 'Rejetée' }
  return labels[status] || status
}

const formatDate = (date) => {
  if (!date) return '-'
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

onMounted(loadCompany)
watch(() => route.params.id, loadCompany)
</script>

<style scoped>
.hero-banner {
  min-height: 140px;
}

.company-logo {
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.sidebar-companies {
  border-right: 1px solid #e0e0e0;
  position: sticky;
  top: 64px;
  max-height: calc(100vh - 64px);
  overflow-y: auto;
}

@media (max-width: 960px) {
  .sidebar-companies {
    position: relative;
    top: 0;
    max-height: none;
    min-height: auto !important;
    border-right: none;
    border-bottom: 1px solid #e0e0e0;
  }
}
</style>
