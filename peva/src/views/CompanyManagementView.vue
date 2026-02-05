<template>
  <div class="company-management">
    <v-container class="py-8">
      <!-- Header Section -->
      <div class="mb-8">
        <div class="d-flex align-center mb-4">
          <v-icon class="mr-3 text-green-600" size="32">mdi-domain</v-icon>
          <div>
            <h1 class="text-h3 font-weight-bold text-grey-darken-3">Gestion Entreprise</h1>
            <p class="text-body-1 text-grey-darken-1 ma-0">Éditer profil et rapports RSE</p>
          </div>
        </div>
      </div>

      <!-- Indicateur de chargement -->
      <v-row v-if="loading">
        <v-col cols="12" class="text-center py-12">
          <v-progress-circular
            indeterminate
            color="green-darken-2"
            size="64"
          />
          <p class="text-body-1 mt-4 text-grey">Chargement des données de l'entreprise...</p>
        </v-col>
      </v-row>

      <!-- Navigation Tabs -->
      <v-card v-else class="mb-6" elevation="2">
        <v-tabs v-model="activeTab" color="green-darken-2" class="px-4">
          <v-tab value="profile">
            <v-icon start>mdi-pencil</v-icon>
            Profil Entreprise
            <v-chip size="small" class="ml-2">Informations générales</v-chip>
          </v-tab>
          <v-tab value="reports">
            <v-icon start>mdi-chart-line</v-icon>
            Rapports RSE
            <v-chip size="small" class="ml-2">Responsabilité sociétale</v-chip>
          </v-tab>
          <v-tab value="team">
            <v-icon start>mdi-account-group</v-icon>
            Équipe
            <v-chip size="small" class="ml-2">Gestion des membres</v-chip>
          </v-tab>
          <v-tab value="settings">
            <v-icon start>mdi-cog</v-icon>
            Paramètres
            <v-chip size="small" class="ml-2">Configuration</v-chip>
          </v-tab>
        </v-tabs>
      </v-card>

      <v-row v-if="!loading">
        <!-- Main Content -->
        <v-col cols="12" lg="8">
          <v-window v-model="activeTab">
            <!-- Profil Entreprise -->
            <v-window-item value="profile">
              <v-card elevation="2">
                <v-card-title class="bg-green-darken-2 text-white pa-4">
                  <v-icon start>mdi-domain</v-icon>
                  Profil Entreprise
                </v-card-title>
                <v-card-text class="pa-6">
                  <v-form ref="profileForm" v-model="profileFormValid">
                    <v-row>
                      <!-- Logo entreprise -->
                      <v-col cols="12" class="text-center mb-4">
                        <div class="d-flex flex-column align-center">
                          <v-avatar size="120" class="mb-3 elevation-2">
                            <v-img
                              v-if="companyProfile.logo_url"
                              :src="companyProfile.logo_url"
                              alt="Logo entreprise"
                            />
                            <v-icon v-else size="60" color="grey-lighten-1">mdi-domain</v-icon>
                          </v-avatar>
                          <v-file-input
                            v-model="logoFile"
                            label="Logo de l'entreprise"
                            accept="image/*"
                            prepend-icon="mdi-camera"
                            variant="outlined"
                            density="compact"
                            class="logo-upload-input"
                            style="max-width: 300px;"
                            :loading="uploadingLogo"
                            @update:model-value="uploadLogo"
                          />
                          <p class="text-caption text-grey mt-1">Format: JPG, PNG (max 2MB)</p>
                        </div>
                      </v-col>
                      <v-col cols="12">
                        <v-text-field
                          v-model="companyProfile.name"
                          label="Nom de l'entreprise"
                          placeholder="Nom de votre entreprise"
                          variant="outlined"
                          :rules="[rules.required]"
                          prepend-inner-icon="mdi-domain"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="companyProfile.sector"
                          :items="sectors"
                          label="Secteur d'activité"
                          variant="outlined"
                          :rules="[rules.required]"
                          prepend-inner-icon="mdi-factory"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="companyProfile.country"
                          :items="countries"
                          label="Pays"
                          variant="outlined"
                          :rules="[rules.required]"
                          prepend-inner-icon="mdi-map-marker"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="companyProfile.city"
                          label="Ville"
                          placeholder="Ex: Ouagadougou, Dakar..."
                          variant="outlined"
                          prepend-inner-icon="mdi-city"
                        />
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-select
                          v-model="companyProfile.size"
                          :items="companySizes"
                          label="Taille de l'entreprise"
                          variant="outlined"
                          :rules="[rules.required]"
                          prepend-inner-icon="mdi-account-group"
                        />
                      </v-col>
                      <v-col cols="12">
                        <v-textarea
                          v-model="companyProfile.description"
                          label="Description"
                          placeholder="Description de votre entreprise et de ses activités"
                          variant="outlined"
                          rows="4"
                          :rules="[rules.required]"
                          prepend-inner-icon="mdi-text"
                        />
                      </v-col>
                    </v-row>
                  </v-form>
                </v-card-text>
                <v-card-actions class="pa-6 pt-0">
                  <v-spacer />
                  <v-btn
                    color="green-darken-2"
                    variant="flat"
                    prepend-icon="mdi-content-save"
                    :loading="saving"
                    @click="saveProfile"
                  >
                    Sauvegarder le profil
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-window-item>

            <!-- Rapports RSE -->
            <v-window-item value="reports">
              <v-card elevation="2">
                <v-card-title class="bg-blue-darken-2 text-white pa-4">
                  <v-icon start>mdi-chart-line</v-icon>
                  Rapports RSE/ESG
                </v-card-title>
                <v-card-text class="pa-6">
                  <!-- Info Section -->
                  <v-alert
                    type="info"
                    variant="tonal"
                    class="mb-6"
                  >
                    <div class="d-flex align-center">
                      <v-icon size="32" class="mr-3">mdi-information</v-icon>
                      <div>
                        <div class="font-weight-bold mb-1">Système de Gestion RSE/ESG Complet</div>
                        <div class="text-body-2">
                          Accédez au tableau de bord complet pour gérer vos rapports RSE, 
                          suivre vos indicateurs de performance ESG et soumettre vos données annuelles.
                        </div>
                      </div>
                    </div>
                  </v-alert>

                  <!-- Quick Stats (placeholder) -->
                  <v-row class="mb-6">
                    <v-col cols="12" md="4">
                      <v-card color="green-lighten-5" class="pa-4 text-center">
                        <v-icon color="green-darken-2" size="32">mdi-file-document-check</v-icon>
                        <div class="text-h6 font-weight-bold text-green-darken-2 mt-2">
                          {{ companyRSEStats.reportsCount }}
                        </div>
                        <div class="text-caption">Rapports publiés</div>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-card color="blue-lighten-5" class="pa-4 text-center">
                        <v-icon color="blue-darken-2" size="32">mdi-chart-line</v-icon>
                        <div class="text-h6 font-weight-bold text-blue-darken-2 mt-2">
                          {{ companyRSEStats.latestScore || 'N/A' }}
                        </div>
                        <div class="text-caption">Score RSE actuel</div>
                      </v-card>
                    </v-col>
                    <v-col cols="12" md="4">
                      <v-card color="orange-lighten-5" class="pa-4 text-center">
                        <v-icon color="orange-darken-2" size="32">mdi-calendar-clock</v-icon>
                        <div class="text-h6 font-weight-bold text-orange-darken-2 mt-2">
                          {{ companyRSEStats.latestYear || new Date().getFullYear() - 1 }}
                        </div>
                        <div class="text-caption">Dernière année</div>
                      </v-card>
                    </v-col>
                  </v-row>

                  <!-- Main Actions -->
                  <div class="d-flex flex-column gap-3">
                    <v-btn
                      color="primary"
                      size="x-large"
                      variant="flat"
                      prepend-icon="mdi-view-dashboard"
                      @click="goToRSEDashboard"
                      block
                    >
                      Accéder au Tableau de Bord RSE Complet
                    </v-btn>

                    <v-divider class="my-2" />

                    <!-- Quick Actions -->
                    <v-list density="compact" class="pa-0">
                      <v-list-item
                        prepend-icon="mdi-plus-circle"
                        title="Créer un nouveau rapport RSE"
                        subtitle="Soumettre les données pour une nouvelle année"
                        @click="createNewRSEReport"
                      >
                        <template #append>
                          <v-icon>mdi-chevron-right</v-icon>
                        </template>
                      </v-list-item>
                      
                      <v-divider />
                      
                      <v-list-item
                        prepend-icon="mdi-file-document-multiple"
                        title="Consulter les rapports historiques"
                        subtitle="Voir tous vos rapports RSE passés"
                        @click="goToRSEDashboard"
                      >
                        <template #append>
                          <v-icon>mdi-chevron-right</v-icon>
                        </template>
                      </v-list-item>
                      
                      <v-divider />
                      
                      <v-list-item
                        prepend-icon="mdi-earth"
                        title="Objectifs de Développement Durable"
                        subtitle="Gérer votre contribution aux ODD"
                        @click="goToRSEDashboard"
                      >
                        <template #append>
                          <v-chip color="success" size="small">17 ODD</v-chip>
                        </template>
                      </v-list-item>
                    </v-list>
                  </div>

                  <!-- Features Info -->
                  <v-card class="mt-6" color="grey-lighten-4" flat>
                    <v-card-text>
                      <h4 class="text-subtitle-1 font-weight-bold mb-3">
                        <v-icon start>mdi-check-circle</v-icon>
                        Fonctionnalités du système RSE/ESG
                      </h4>
                      <v-row dense>
                        <v-col cols="12" sm="6">
                          <div class="d-flex align-center mb-2">
                            <v-icon size="small" color="success" class="mr-2">mdi-check</v-icon>
                            <span class="text-body-2">Gouvernance & ODD</span>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="d-flex align-center mb-2">
                            <v-icon size="small" color="success" class="mr-2">mdi-check</v-icon>
                            <span class="text-body-2">Indicateurs Sociaux</span>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="d-flex align-center mb-2">
                            <v-icon size="small" color="success" class="mr-2">mdi-check</v-icon>
                            <span class="text-body-2">Communautés & Achats locaux</span>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="d-flex align-center mb-2">
                            <v-icon size="small" color="success" class="mr-2">mdi-check</v-icon>
                            <span class="text-body-2">Environnement & Énergie</span>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="d-flex align-center mb-2">
                            <v-icon size="small" color="success" class="mr-2">mdi-check</v-icon>
                            <span class="text-body-2">Bilan Carbone (Scope 1, 2, 3)</span>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="d-flex align-center mb-2">
                            <v-icon size="small" color="success" class="mr-2">mdi-check</v-icon>
                            <span class="text-body-2">Gestion des Déchets</span>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="d-flex align-center mb-2">
                            <v-icon size="small" color="success" class="mr-2">mdi-check</v-icon>
                            <span class="text-body-2">Score RSE automatique (0-100)</span>
                          </div>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <div class="d-flex align-center mb-2">
                            <v-icon size="small" color="success" class="mr-2">mdi-check</v-icon>
                            <span class="text-body-2">Export & Documents justificatifs</span>
                          </div>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>
                </v-card-text>
              </v-card>
            </v-window-item>

            <!-- Équipe -->
            <v-window-item value="team">
              <v-card elevation="2">
                <v-card-title class="bg-purple-darken-2 text-white pa-4 d-flex justify-space-between align-center">
                  <div>
                    <v-icon start>mdi-account-group</v-icon>
                    Équipe ({{ companyMembers.length }} membres)
                  </div>
                  <v-btn
                    size="small"
                    color="white"
                    variant="outlined"
                    prepend-icon="mdi-account-plus"
                    @click="showInviteDialog = true"
                  >
                    Inviter
                  </v-btn>
                </v-card-title>
                <v-card-text class="pa-0">
                  <!-- Demandes d'adhésion en attente -->
                  <v-alert
                    v-if="joinRequests.length > 0"
                    type="info"
                    variant="tonal"
                    class="ma-4"
                  >
                    <div class="d-flex align-center justify-space-between">
                      <span>{{ joinRequests.length }} demande(s) d'adhésion en attente</span>
                      <v-btn size="small" variant="text" @click="showJoinRequestsDialog = true">
                        Voir
                      </v-btn>
                    </div>
                  </v-alert>

                  <!-- Liste des membres -->
                  <v-list v-if="companyMembers.length > 0" lines="two">
                    <v-list-item
                      v-for="member in companyMembers"
                      :key="member.id"
                      class="py-3"
                    >
                      <template #prepend>
                        <v-avatar :color="getRoleColor(member.role)" class="mr-3">
                          <v-img v-if="member.user?.avatar_url" :src="member.user.avatar_url" />
                          <span v-else class="text-white text-h6">
                            {{ getInitials(member.user) }}
                          </span>
                        </v-avatar>
                      </template>
                      <v-list-item-title class="font-weight-bold">
                        {{ member.user?.first_name }} {{ member.user?.last_name }}
                        <v-chip
                          size="x-small"
                          :color="getRoleColor(member.role)"
                          class="ml-2"
                        >
                          {{ getRoleLabel(member.role) }}
                        </v-chip>
                      </v-list-item-title>
                      <v-list-item-subtitle>
                        {{ member.user?.email }}
                        <span v-if="member.position"> • {{ member.position }}</span>
                      </v-list-item-subtitle>
                      <template #append>
                        <v-menu v-if="member.role !== 'owner'">
                          <template v-slot:activator="{ props }">
                            <v-btn icon="mdi-dots-vertical" variant="text" v-bind="props" />
                          </template>
                          <v-list density="compact">
                            <v-list-item @click="changeMemberRole(member)">
                              <v-list-item-title>Changer le rôle</v-list-item-title>
                            </v-list-item>
                            <v-list-item @click="removeMember(member)" class="text-red">
                              <v-list-item-title>Retirer</v-list-item-title>
                            </v-list-item>
                          </v-list>
                        </v-menu>
                      </template>
                    </v-list-item>
                  </v-list>

                  <!-- Aucun membre -->
                  <div v-else class="text-center py-8">
                    <v-icon size="64" color="grey-lighten-1">mdi-account-group-outline</v-icon>
                    <p class="text-body-1 text-grey mt-4">Vous êtes le seul membre</p>
                    <v-btn
                      color="purple-darken-2"
                      variant="flat"
                      prepend-icon="mdi-account-plus"
                      class="mt-4"
                      @click="showInviteDialog = true"
                    >
                      Inviter des collaborateurs
                    </v-btn>
                  </div>
                </v-card-text>
              </v-card>
            </v-window-item>

            <!-- Paramètres -->
            <v-window-item value="settings">
              <v-card elevation="2">
                <v-card-title class="bg-orange-darken-2 text-white pa-4">
                  <v-icon start>mdi-cog</v-icon>
                  Paramètres
                </v-card-title>
                <v-card-text class="pa-6">
                  <p class="text-body-1 mb-4">Configuration de votre compte entreprise</p>
                  <v-btn color="orange-darken-2" variant="flat" prepend-icon="mdi-cog">
                    Configurer
                  </v-btn>
                </v-card-text>
              </v-card>
            </v-window-item>
          </v-window>
        </v-col>

        <!-- Sidebar -->
        <v-col cols="12" lg="4">
          <!-- Tableau de Bord RSE -->
          <v-card class="mb-6" elevation="2">
            <v-card-title class="pa-4">
              <v-icon start>mdi-chart-box</v-icon>
              Tableau de Bord RSE
            </v-card-title>
            <v-card-text class="pa-4">
              <template v-if="rseDashboardStats.hasData">
                <v-row class="text-center">
                  <v-col cols="6">
                    <div class="text-h4 font-weight-bold text-green-darken-2">{{ rseDashboardStats.rseScore || 0 }}%</div>
                    <div class="text-body-2">Score RSE global</div>
                  </v-col>
                  <v-col cols="6">
                    <div class="text-h4 font-weight-bold text-blue-darken-2">{{ rseDashboardStats.certifications }}</div>
                    <div class="text-body-2">Certifications</div>
                  </v-col>
                  <v-col cols="6">
                    <div class="text-h4 font-weight-bold text-purple-darken-2">{{ formatNumber(rseDashboardStats.co2Avoided) }}</div>
                    <div class="text-body-2">Tonnes CO² évitées</div>
                  </v-col>
                  <v-col cols="6">
                    <div class="text-h4 font-weight-bold text-orange-darken-2">{{ rseDashboardStats.socialImpact || 0 }}</div>
                    <div class="text-body-2">Employés</div>
                  </v-col>
                </v-row>
              </template>
              <template v-else>
                <div class="text-center py-4">
                  <v-icon size="48" color="grey-lighten-1">mdi-chart-box-outline</v-icon>
                  <p class="text-body-2 text-grey mt-2">Aucune donnée RSE disponible</p>
                  <v-btn
                    size="small"
                    color="green-darken-2"
                    variant="outlined"
                    class="mt-2"
                    @click="goToRSEDashboard"
                  >
                    Créer un rapport RSE
                  </v-btn>
                </div>
              </template>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
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

    <!-- Dialog: Demandes d'adhésion -->
    <v-dialog v-model="showJoinRequestsDialog" max-width="600">
      <v-card>
        <v-card-title class="bg-purple-darken-2 text-white">
          <v-icon start>mdi-account-clock</v-icon>
          Demandes d'adhésion
        </v-card-title>
        <v-card-text class="pa-0">
          <v-list v-if="joinRequests.length > 0">
            <v-list-item
              v-for="request in joinRequests"
              :key="request.id"
              class="py-4"
            >
              <template #prepend>
                <v-avatar color="purple-lighten-4" class="mr-3">
                  <v-img v-if="request.user?.avatar_url" :src="request.user.avatar_url" />
                  <span v-else class="text-purple-darken-2">
                    {{ getInitials(request.user) }}
                  </span>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold">
                {{ request.user?.first_name }} {{ request.user?.last_name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ request.user?.email }}
                <div v-if="request.message" class="text-grey-darken-1 mt-1">
                  "{{ request.message }}"
                </div>
              </v-list-item-subtitle>
              <template #append>
                <v-btn
                  size="small"
                  color="green"
                  variant="flat"
                  class="mr-2"
                  :loading="processingRequest === request.id"
                  @click="handleApproveRequest(request)"
                >
                  Accepter
                </v-btn>
                <v-btn
                  size="small"
                  color="red"
                  variant="outlined"
                  :loading="processingRequest === request.id"
                  @click="handleRejectRequest(request)"
                >
                  Refuser
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
          <div v-else class="text-center py-8">
            <v-icon size="48" color="grey-lighten-1">mdi-account-check</v-icon>
            <p class="text-grey mt-2">Aucune demande en attente</p>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="showJoinRequestsDialog = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog: Inviter un membre -->
    <v-dialog v-model="showInviteDialog" max-width="500">
      <v-card>
        <v-card-title class="bg-purple-darken-2 text-white">
          <v-icon start>mdi-account-plus</v-icon>
          Inviter un collaborateur
        </v-card-title>
        <v-card-text class="pa-6">
          <v-text-field
            v-model="inviteEmail"
            label="Email du collaborateur"
            placeholder="exemple@entreprise.com"
            variant="outlined"
            prepend-inner-icon="mdi-email"
            :rules="[v => !!v || 'Email requis', v => /.+@.+\..+/.test(v) || 'Email invalide']"
          />
          <v-select
            v-model="inviteRole"
            :items="memberRoles"
            label="Rôle"
            variant="outlined"
            prepend-inner-icon="mdi-account-cog"
          />
          <v-alert type="info" variant="tonal" density="compact" class="mt-2">
            Un email d'invitation sera envoyé à cette adresse.
          </v-alert>
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="showInviteDialog = false">Annuler</v-btn>
          <v-btn
            color="purple-darken-2"
            variant="flat"
            :loading="sendingInvite"
            @click="sendInvitation"
          >
            Envoyer l'invitation
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { companyService } from '@/services/companyService'
import { supabase } from '@/lib/supabase'

const router = useRouter()
const authStore = useAuthStore()

// Reactive data
const activeTab = ref('profile')
const profileFormValid = ref(false)
const saving = ref(false)
const loading = ref(true)
const currentCompany = ref(null)

const companyProfile = ref({
  name: '',
  sector: 'Énergies renouvelables',
  country: 'Sénégal',
  city: '',
  size: 'pme',
  description: '',
  logo_url: null
})

// Upload logo
const logoFile = ref(null)
const uploadingLogo = ref(false)

// RSE Stats (will be loaded from API)
const companyRSEStats = ref({
  reportsCount: 0,
  latestScore: null,
  latestYear: null
})

// RSE Dashboard Stats (données réelles du tableau de bord)
const rseDashboardStats = ref({
  rseScore: null,
  certifications: 0,
  co2Avoided: 0,
  socialImpact: null,
  hasData: false
})

const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

// Team management
const companyMembers = ref([])
const joinRequests = ref([])
const showInviteDialog = ref(false)
const showJoinRequestsDialog = ref(false)
const inviteEmail = ref('')
const inviteRole = ref('member')
const sendingInvite = ref(false)
const processingRequest = ref(null)

const memberRoles = [
  { title: 'Membre', value: 'member' },
  { title: 'Manager', value: 'manager' },
  { title: 'Administrateur', value: 'admin' }
]

// Static data - Secteurs harmonisés (ordre alphabétique, "Autres" à la fin)
const sectors = [
  'Agroalimentaire',
  'Agriculture durable',
  'Bilan carbone',
  'Communication d\'impact',
  'Construction écologique',
  'Eau et assainissement',
  'Éco-matériaux',
  'Écotourisme',
  'Énergies renouvelables',
  'Équipementiers',
  'Gestion des déchets',
  'RSE/ESG',
  'Technologies propres',
  'Transformation agroalimentaire',
  'Transport vert',
  'Valorisation des déchets',
  'Autres'
]

const companySizes = [
  { title: 'TPME (1-10 employés)', value: 'tpme' },
  { title: 'PME (11-50 employés)', value: 'pme' },
  { title: 'Moyenne (51-250 employés)', value: 'moyenne' },
  { title: 'Grande (250+ employés)', value: 'grande' }
]

const countries = [
  'Sénégal',
  'Ghana',
  'Côte d\'Ivoire',
  'Nigeria',
  'Kenya',
  'Maroc',
  'Tunisie',
  'Afrique du Sud',
  'Cameroun',
  'Mali',
  'Burkina Faso',
  'Rwanda',
  'Éthiopie'
]

const rules = {
  required: value => !!value || 'Ce champ est requis'
}

// Methods
const loadCompanyData = async () => {
  try {
    loading.value = true
    const user = authStore.user
    
    if (!user) {
      showMessage('Utilisateur non connecté', 'error')
      return
    }

    // Récupérer l'entreprise de l'utilisateur
    const company = await companyService.getUserMainCompany(user.id)
    
    if (company) {
      currentCompany.value = company
      companyProfile.value = {
        name: company.name || '',
        sector: company.industry || 'Énergies renouvelables',
        country: company.country || 'Sénégal',
        city: company.city || '',
        size: company.size || 'pme',
        description: company.description || '',
        logo_url: company.logo_url || null
      }

      // Charger les stats RSE
      try {
        const stats = await companyService.getCompanyRSEStats(company.id)
        companyRSEStats.value = stats
        
        // Charger les stats RSE pour le dashboard (données réelles)
        const dashboardStats = await companyService.getCompanyRSEDashboardStats(company.id)
        rseDashboardStats.value = dashboardStats
      } catch (rseError) {
        console.warn('Impossible de charger les stats RSE:', rseError)
        // Stats par défaut si la table n'existe pas encore
        companyRSEStats.value = {
          reportsCount: 0,
          latestYear: null,
          latestScore: null
        }
        rseDashboardStats.value = {
          rseScore: null,
          certifications: 0,
          co2Avoided: 0,
          socialImpact: null,
          hasData: false
        }
      }
    } else {
      showMessage('Aucune entreprise trouvée pour cet utilisateur', 'warning')
    }
  } catch (error) {
    console.error('Erreur lors du chargement des données:', error)
    showMessage('Erreur lors du chargement des données', 'error')
  } finally {
    loading.value = false
  }
}

const saveProfile = async () => {
  if (!profileFormValid.value) return
  
  if (!currentCompany.value) {
    showMessage('Aucune entreprise à mettre à jour', 'error')
    return
  }
  
  try {
    saving.value = true
    
    // Sauvegarder dans Supabase
    await companyService.updateCompany(currentCompany.value.id, {
      name: companyProfile.value.name,
      sector: companyProfile.value.sector,
      country: companyProfile.value.country,
      city: companyProfile.value.city,
      size: companyProfile.value.size,
      description: companyProfile.value.description
    })
    
    showMessage('Profil sauvegardé avec succès !', 'success')
    
    // Recharger les données pour refléter les changements
    await loadCompanyData()
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
    showMessage('Erreur lors de la sauvegarde: ' + error.message, 'error')
  } finally {
    saving.value = false
  }
}

const showMessage = (message, color = 'success') => {
  snackbar.value = {
    show: true,
    message,
    color
  }
}

// Formater les nombres (ex: 1234 -> 1.2K)
const formatNumber = (num) => {
  if (num === null || num === undefined) return '0'
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}

// Upload logo entreprise
const uploadLogo = async (file) => {
  if (!file || !file[0]) return
  
  const selectedFile = file[0]
  
  // Vérifier la taille (max 2MB)
  if (selectedFile.size > 2 * 1024 * 1024) {
    showMessage('Le fichier est trop volumineux (max 2MB)', 'error')
    logoFile.value = null
    return
  }
  
  // Vérifier le type
  if (!selectedFile.type.startsWith('image/')) {
    showMessage('Veuillez sélectionner une image', 'error')
    logoFile.value = null
    return
  }
  
  uploadingLogo.value = true
  
  try {
    const fileExt = selectedFile.name.split('.').pop()
    const fileName = `company-logos/${currentCompany.value.id}-${Date.now()}.${fileExt}`
    
    // Upload vers Supabase Storage
    const { data, error } = await supabase.storage
      .from('avatars')
      .upload(fileName, selectedFile, {
        cacheControl: '3600',
        upsert: true
      })
    
    if (error) throw error
    
    // Récupérer l'URL publique
    const { data: urlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)
    
    // Mettre à jour le profil entreprise
    companyProfile.value.logo_url = urlData.publicUrl
    
    // Sauvegarder en base
    await companyService.updateCompany(currentCompany.value.id, {
      logo_url: urlData.publicUrl
    })
    
    showMessage('Logo mis à jour avec succès', 'success')
  } catch (error) {
    console.error('Erreur upload logo:', error)
    showMessage('Erreur lors de l\'upload du logo', 'error')
  } finally {
    uploadingLogo.value = false
    logoFile.value = null
  }
}

// RSE Methods
const goToRSEDashboard = () => {
  if (!currentCompany.value) {
    showMessage('Aucune entreprise trouvée', 'error')
    return
  }
  
  router.push({
    name: 'RSEDashboard',
    params: { companyId: currentCompany.value.id },
    query: { name: companyProfile.value.name }
  })
}

const createNewRSEReport = () => {
  if (!currentCompany.value) {
    showMessage('Aucune entreprise trouvée', 'error')
    return
  }
  
  router.push({
    name: 'RSEReportForm',
    params: { companyId: currentCompany.value.id },
    query: { year: new Date().getFullYear() - 1 }
  })
}

// Team management methods
const loadCompanyMembers = async () => {
  if (!currentCompany.value) return
  
  try {
    companyMembers.value = await companyService.getCompanyMembers(currentCompany.value.id)
    joinRequests.value = await companyService.getCompanyJoinRequests(currentCompany.value.id)
  } catch (error) {
    console.warn('Erreur chargement membres:', error)
  }
}

const getInitials = (user) => {
  if (!user) return '?'
  const first = user.first_name?.charAt(0) || ''
  const last = user.last_name?.charAt(0) || ''
  return (first + last).toUpperCase() || '?'
}

const getRoleColor = (role) => {
  const colors = {
    owner: 'purple-darken-2',
    admin: 'blue-darken-2',
    manager: 'green-darken-2',
    member: 'grey-darken-1'
  }
  return colors[role] || 'grey'
}

const getRoleLabel = (role) => {
  const labels = {
    owner: 'Propriétaire',
    admin: 'Administrateur',
    manager: 'Manager',
    member: 'Membre'
  }
  return labels[role] || role
}

const handleApproveRequest = async (request) => {
  try {
    processingRequest.value = request.id
    await companyService.approveJoinRequest(request.id, 'member')
    showMessage(`${request.user?.first_name} a rejoint l'équipe !`, 'success')
    await loadCompanyMembers()
  } catch (error) {
    showMessage('Erreur: ' + error.message, 'error')
  } finally {
    processingRequest.value = null
  }
}

const handleRejectRequest = async (request) => {
  try {
    processingRequest.value = request.id
    await companyService.rejectJoinRequest(request.id)
    showMessage('Demande refusée', 'info')
    await loadCompanyMembers()
  } catch (error) {
    showMessage('Erreur: ' + error.message, 'error')
  } finally {
    processingRequest.value = null
  }
}

const sendInvitation = async () => {
  if (!inviteEmail.value || !currentCompany.value) return
  
  try {
    sendingInvite.value = true
    
    // Rechercher l'utilisateur par email
    const { data: users } = await supabase
      .from('pev_profiles')
      .select('id, first_name, last_name, email')
      .eq('email', inviteEmail.value)
      .single()
    
    if (!users) {
      showMessage('Utilisateur non trouvé. Il doit d\'abord créer un compte.', 'warning')
      return
    }
    
    await companyService.inviteMemberToCompany(
      currentCompany.value.id,
      users.id,
      inviteRole.value,
      authStore.user.id
    )
    
    showMessage(`Invitation envoyée à ${inviteEmail.value}`, 'success')
    showInviteDialog.value = false
    inviteEmail.value = ''
    inviteRole.value = 'member'
    await loadCompanyMembers()
  } catch (error) {
    showMessage('Erreur: ' + error.message, 'error')
  } finally {
    sendingInvite.value = false
  }
}

const changeMemberRole = async (member) => {
  // TODO: Implémenter le dialog de changement de rôle
  showMessage('Fonctionnalité à venir', 'info')
}

const removeMember = async (member) => {
  if (!confirm(`Retirer ${member.user?.first_name} ${member.user?.last_name} de l'équipe ?`)) return
  
  try {
    await companyService.removeMemberFromCompany(currentCompany.value.id, member.id)
    showMessage('Membre retiré', 'success')
    await loadCompanyMembers()
  } catch (error) {
    showMessage('Erreur: ' + error.message, 'error')
  }
}

onMounted(async () => {
  await loadCompanyData()
  await loadCompanyMembers()
})
</script>

<style scoped>
.company-management {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.v-card {
  border-radius: 12px !important;
}

.v-btn {
  border-radius: 8px !important;
}

.v-tab {
  text-transform: none !important;
}
</style>
