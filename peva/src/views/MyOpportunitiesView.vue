<template>
  <v-container class="py-8">
    <!-- Header -->
    <div class="d-flex justify-space-between align-center mb-6">
      <div>
        <h1 class="text-h4 font-weight-bold">Mes Opportunités</h1>
        <p class="text-grey-darken-1">Gérez vos brouillons et opportunités publiées</p>
      </div>
      <v-btn
        color="primary"
        prepend-icon="mdi-plus"
        to="/opportunities/create"
      >
        Nouvelle opportunité
      </v-btn>
    </div>

    <!-- Tabs pour filtrer par statut -->
    <v-tabs v-model="activeTab" color="primary" class="mb-6">
      <v-tab value="all">
        <v-icon start>mdi-view-list</v-icon>
        Toutes ({{ opportunities.length }})
      </v-tab>
      <v-tab value="draft">
        <v-icon start>mdi-file-edit</v-icon>
        Brouillons ({{ drafts.length }})
      </v-tab>
      <v-tab value="in_review">
        <v-icon start>mdi-clock-outline</v-icon>
        En attente ({{ inReview.length }})
      </v-tab>
      <v-tab value="published">
        <v-icon start>mdi-check-circle</v-icon>
        Publiées ({{ published.length }})
      </v-tab>
    </v-tabs>

    <!-- Loading -->
    <v-progress-linear v-if="loading" indeterminate color="primary" class="mb-4" />

    <!-- Liste vide -->
    <v-card v-if="!loading && filteredOpportunities.length === 0" class="pa-8 text-center">
      <v-icon size="80" color="grey-lighten-1" class="mb-4">mdi-briefcase-off-outline</v-icon>
      <h3 class="text-h6 mb-2">Aucune opportunité</h3>
      <p class="text-grey-darken-1 mb-4">
        {{ activeTab === 'draft' ? 'Vous n\'avez pas de brouillon en cours.' : 'Commencez par créer votre première opportunité.' }}
      </p>
      <v-btn color="primary" to="/opportunities/create">
        Créer une opportunité
      </v-btn>
    </v-card>

    <!-- Liste des opportunités -->
    <v-row v-else>
      <v-col
        v-for="opportunity in filteredOpportunities"
        :key="opportunity.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="h-100" :class="{ 'border-warning': opportunity.status === 'draft' }">
          <!-- Status badge -->
          <div class="pa-3 pb-0">
            <v-chip
              :color="getStatusColor(opportunity.status)"
              size="small"
              label
            >
              <v-icon start size="small">{{ getStatusIcon(opportunity.status) }}</v-icon>
              {{ getStatusLabel(opportunity.status) }}
            </v-chip>
            <v-chip
              v-if="opportunity.promote_premium"
              color="amber"
              size="small"
              label
              class="ml-2"
            >
              <v-icon start size="small">mdi-star</v-icon>
              Premium
            </v-chip>
          </div>

          <v-card-title class="text-h6">
            {{ opportunity.title || 'Sans titre' }}
          </v-card-title>

          <v-card-subtitle>
            <v-icon size="small" class="mr-1">mdi-tag</v-icon>
            {{ opportunity.type || 'Non défini' }}
            <span v-if="opportunity.location" class="ml-3">
              <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
              {{ opportunity.location }}
            </span>
          </v-card-subtitle>

          <v-card-text>
            <p class="text-body-2 text-grey-darken-1 mb-2" style="min-height: 40px;">
              {{ truncateText(opportunity.description, 100) }}
            </p>
            
            <!-- Dates -->
            <div class="d-flex flex-wrap ga-2 text-caption text-grey">
              <span v-if="opportunity.deadline">
                <v-icon size="x-small">mdi-calendar-clock</v-icon>
                Limite: {{ formatDate(opportunity.deadline) }}
              </span>
              <span>
                <v-icon size="x-small">mdi-update</v-icon>
                Modifié: {{ formatDate(opportunity.updated_at) }}
              </span>
            </div>

            <!-- Fichiers joints -->
            <div v-if="opportunity.attachments && opportunity.attachments.length > 0" class="mt-2">
              <v-chip size="x-small" color="info" variant="tonal">
                <v-icon start size="x-small">mdi-paperclip</v-icon>
                {{ opportunity.attachments.length }} fichier(s)
              </v-chip>
            </div>
          </v-card-text>

          <v-divider />

          <v-card-actions>
            <!-- Brouillon: Continuer / Supprimer -->
            <template v-if="opportunity.status === 'draft'">
              <v-btn
                color="primary"
                variant="text"
                :to="`/opportunities/edit/${opportunity.id}`"
              >
                <v-icon start>mdi-pencil</v-icon>
                Continuer
              </v-btn>
              <v-spacer />
              <v-btn
                color="error"
                variant="text"
                @click="confirmDelete(opportunity)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>

            <!-- En attente de modération: Voir + Supprimer -->
            <template v-else-if="opportunity.status === 'in_review'">
              <v-btn
                color="primary"
                variant="text"
                @click="viewDetails(opportunity)"
              >
                <v-icon start>mdi-eye</v-icon>
                Voir
              </v-btn>
              <v-spacer />
              <v-btn
                color="error"
                variant="text"
                @click="confirmDelete(opportunity)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>

            <!-- Publiée: Voir / Candidatures / Stats + Supprimer -->
            <template v-else>
              <v-btn
                color="primary"
                variant="text"
                @click="viewDetails(opportunity)"
              >
                <v-icon start>mdi-eye</v-icon>
                Voir
              </v-btn>
              <v-btn
                color="secondary"
                variant="tonal"
                size="small"
                :to="`/opportunities/${opportunity.id}/applications`"
              >
                <v-icon start size="small">mdi-account-group</v-icon>
                {{ opportunity.applications_count || 0 }} candidature{{ (opportunity.applications_count || 0) > 1 ? 's' : '' }}
              </v-btn>
              <v-spacer />
              <span class="text-caption text-grey mr-2">
                <v-icon size="small">mdi-eye</v-icon>
                {{ opportunity.views_count || 0 }}
              </span>
              <v-btn
                color="error"
                variant="text"
                size="small"
                @click="confirmDelete(opportunity)"
              >
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </template>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dialog de confirmation de suppression -->
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title class="text-h6">
          <v-icon color="error" class="mr-2">mdi-alert</v-icon>
          Confirmer la suppression
        </v-card-title>
        <v-card-text>
          <p class="mb-3">
            Êtes-vous sûr de vouloir supprimer <strong>"{{ opportunityToDelete?.title }}"</strong> ?
          </p>
          <v-alert 
            v-if="opportunityToDelete?.status === 'published'" 
            type="warning" 
            density="compact" 
            class="mb-3"
          >
            Cette opportunité est publiée. Les candidats seront notifiés par email.
          </v-alert>
          <v-textarea
            v-model="deleteReason"
            label="Raison de la suppression (optionnel)"
            variant="outlined"
            rows="2"
            density="compact"
            placeholder="Ex: Poste pourvu, Offre expirée..."
          />
          <p class="text-caption text-grey">Cette action est irréversible.</p>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="deleteDialog = false">Annuler</v-btn>
          <v-btn color="error" variant="flat" @click="deleteOpportunity" :loading="deleting">
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog de détails -->
    <v-dialog v-model="detailsDialog" max-width="700">
      <v-card v-if="selectedOpportunity">
        <v-card-title class="d-flex align-center">
          {{ selectedOpportunity.title }}
          <v-spacer />
          <v-btn icon variant="text" @click="detailsDialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider />
        <v-card-text class="pa-4">
          <v-chip :color="getStatusColor(selectedOpportunity.status)" size="small" class="mb-4">
            {{ getStatusLabel(selectedOpportunity.status) }}
          </v-chip>

          <h4 class="mb-2">Description</h4>
          <p class="text-body-2 mb-4">{{ selectedOpportunity.description || 'Aucune description' }}</p>

          <div v-if="selectedOpportunity.detailed_description" class="mb-4">
            <h4 class="mb-2">Description détaillée</h4>
            <p class="text-body-2">{{ selectedOpportunity.detailed_description }}</p>
          </div>

          <v-row>
            <v-col cols="6">
              <strong>Type:</strong> {{ selectedOpportunity.type }}
            </v-col>
            <v-col cols="6">
              <strong>Secteur:</strong> {{ selectedOpportunity.category || 'Non spécifié' }}
            </v-col>
            <v-col cols="6" v-if="selectedOpportunity.organization">
              <strong>Organisation:</strong> {{ selectedOpportunity.organization }}
            </v-col>
            <v-col cols="6">
              <strong>Localisation:</strong> {{ selectedOpportunity.location || 'Non spécifié' }}
            </v-col>
            <v-col cols="6">
              <strong>Pays:</strong> {{ selectedOpportunity.country || 'Non spécifié' }}
            </v-col>
            <v-col cols="6" v-if="selectedOpportunity.region">
              <strong>Région:</strong> {{ selectedOpportunity.region }}
            </v-col>
            <v-col cols="6" v-if="selectedOpportunity.city">
              <strong>Ville:</strong> {{ selectedOpportunity.city }}
            </v-col>
            <v-col cols="6">
              <strong>Date limite:</strong> {{ formatDate(selectedOpportunity.deadline) || 'Non spécifié' }}
            </v-col>
            <v-col cols="6">
              <strong>Télétravail:</strong> {{ selectedOpportunity.is_remote ? 'Oui' : 'Non' }}
            </v-col>
            <v-col cols="6" v-if="selectedOpportunity.budget_salary">
              <strong>Budget/Salaire:</strong> {{ selectedOpportunity.budget_salary }}
            </v-col>
            <v-col cols="6" v-if="selectedOpportunity.salary_min || selectedOpportunity.salary_max">
              <strong>Salaire:</strong> 
              {{ selectedOpportunity.salary_min ? selectedOpportunity.salary_min.toLocaleString() : '?' }} 
              - {{ selectedOpportunity.salary_max ? selectedOpportunity.salary_max.toLocaleString() : '?' }} 
              {{ selectedOpportunity.currency || 'XOF' }}
            </v-col>
            <v-col cols="6" v-if="selectedOpportunity.promote_premium">
              <strong>Premium:</strong> <v-chip color="amber" size="x-small">Activé</v-chip>
            </v-col>
          </v-row>

          <!-- Contact -->
          <div v-if="selectedOpportunity.contact_email || selectedOpportunity.contact_phone" class="mt-4">
            <h4 class="mb-2">Contact</h4>
            <v-row>
              <v-col cols="6" v-if="selectedOpportunity.contact_email">
                <strong>Email:</strong> {{ selectedOpportunity.contact_email }}
              </v-col>
              <v-col cols="6" v-if="selectedOpportunity.contact_phone">
                <strong>Téléphone:</strong> {{ selectedOpportunity.contact_phone }}
              </v-col>
            </v-row>
          </div>

          <!-- Compétences requises -->
          <div v-if="selectedOpportunity.required_skills && selectedOpportunity.required_skills.length > 0" class="mt-4">
            <h4 class="mb-2">Compétences requises</h4>
            <v-chip v-for="skill in selectedOpportunity.required_skills" :key="skill" size="small" class="mr-1 mb-1">{{ skill }}</v-chip>
          </div>

          <!-- Détails Financement -->
          <div v-if="selectedOpportunity.funding_amount || selectedOpportunity.funding_type" class="mt-4">
            <h4 class="mb-2">Détails Financement</h4>
            <v-row>
              <v-col cols="6" v-if="selectedOpportunity.funding_amount">
                <strong>Montant:</strong> {{ selectedOpportunity.funding_amount.toLocaleString() }} €
              </v-col>
              <v-col cols="6" v-if="selectedOpportunity.funding_type">
                <strong>Type:</strong> {{ selectedOpportunity.funding_type }}
              </v-col>
              <v-col cols="6" v-if="selectedOpportunity.equity_percentage">
                <strong>Équité:</strong> {{ selectedOpportunity.equity_percentage }}%
              </v-col>
              <v-col cols="6" v-if="selectedOpportunity.stage">
                <strong>Stade:</strong> {{ selectedOpportunity.stage }}
              </v-col>
            </v-row>
          </div>

          <!-- Détails Emploi -->
          <div v-if="selectedOpportunity.job_title || selectedOpportunity.contract_type" class="mt-4">
            <h4 class="mb-2">Détails Emploi</h4>
            <v-row>
              <v-col cols="6" v-if="selectedOpportunity.job_title">
                <strong>Poste:</strong> {{ selectedOpportunity.job_title }}
              </v-col>
              <v-col cols="6" v-if="selectedOpportunity.contract_type">
                <strong>Contrat:</strong> {{ selectedOpportunity.contract_type }}
              </v-col>
            </v-row>
          </div>

          <!-- Détails Partenariat -->
          <div v-if="selectedOpportunity.partnership_type || selectedOpportunity.partnership_benefits" class="mt-4">
            <h4 class="mb-2">Détails Partenariat</h4>
            <v-row>
              <v-col cols="6" v-if="selectedOpportunity.partnership_type">
                <strong>Type:</strong> {{ selectedOpportunity.partnership_type }}
              </v-col>
              <v-col cols="6" v-if="selectedOpportunity.duration">
                <strong>Durée:</strong> {{ selectedOpportunity.duration }}
              </v-col>
              <v-col cols="12" v-if="selectedOpportunity.partnership_benefits">
                <strong>Bénéfices:</strong> {{ selectedOpportunity.partnership_benefits }}
              </v-col>
            </v-row>
          </div>

          <!-- Détails Mission -->
          <div v-if="selectedOpportunity.mission_duration || selectedOpportunity.daily_rate" class="mt-4">
            <h4 class="mb-2">Détails Mission</h4>
            <v-row>
              <v-col cols="6" v-if="selectedOpportunity.mission_duration">
                <strong>Durée:</strong> {{ selectedOpportunity.mission_duration }}
              </v-col>
              <v-col cols="6" v-if="selectedOpportunity.daily_rate">
                <strong>Tarif journalier:</strong> {{ selectedOpportunity.daily_rate.toLocaleString() }} €
              </v-col>
            </v-row>
          </div>

          <!-- Exigences -->
          <div v-if="selectedOpportunity.requirements" class="mt-4">
            <h4 class="mb-2">Exigences / Qualifications</h4>
            <p class="text-body-2">{{ selectedOpportunity.requirements }}</p>
          </div>

          <!-- Fichiers joints -->
          <div v-if="selectedOpportunity.attachments && selectedOpportunity.attachments.length > 0" class="mt-4">
            <h4 class="mb-2">Fichiers joints</h4>
            <v-list density="compact">
              <v-list-item
                v-for="(file, index) in selectedOpportunity.attachments"
                :key="index"
                :href="file.url"
                target="_blank"
              >
                <template v-slot:prepend>
                  <v-icon>mdi-file-document</v-icon>
                </template>
                <v-list-item-title>{{ file.filename }}</v-list-item-title>
                <v-list-item-subtitle>{{ formatFileSize(file.size) }}</v-list-item-subtitle>
              </v-list-item>
            </v-list>
          </div>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { opportunitiesService } from '@/services/opportunitiesService'

const authStore = useAuthStore()

// State
const loading = ref(true)
const opportunities = ref([])
const activeTab = ref('all')
const deleteDialog = ref(false)
const detailsDialog = ref(false)
const opportunityToDelete = ref(null)
const selectedOpportunity = ref(null)
const deleting = ref(false)
const deleteReason = ref('')
const snackbar = ref({ show: false, message: '', color: 'success' })

// Computed
const drafts = computed(() => opportunities.value.filter(o => o.status === 'draft'))
const inReview = computed(() => opportunities.value.filter(o => o.status === 'in_review'))
const published = computed(() => opportunities.value.filter(o => o.status === 'published'))

const filteredOpportunities = computed(() => {
  switch (activeTab.value) {
    case 'draft': return drafts.value
    case 'in_review': return inReview.value
    case 'published': return published.value
    default: return opportunities.value
  }
})

// Methods
const loadOpportunities = async () => {
  loading.value = true
  try {
    const result = await opportunitiesService.getUserOpportunities(authStore.user?.id)
    if (result.success) {
      opportunities.value = result.data
    }
  } catch (error) {
    console.error('Erreur chargement:', error)
    showMessage('Erreur lors du chargement', 'error')
  } finally {
    loading.value = false
  }
}

const confirmDelete = (opportunity) => {
  opportunityToDelete.value = opportunity
  deleteDialog.value = true
}

const deleteOpportunity = async () => {
  if (!opportunityToDelete.value) return
  
  deleting.value = true
  try {
    // Utiliser deleteOpportunity pour tous statuts (avec notification candidats)
    const result = await opportunitiesService.deleteOpportunity(
      opportunityToDelete.value.id,
      authStore.user?.id,
      deleteReason.value || 'Opportunité retirée par le créateur'
    )
    
    if (result.success) {
      opportunities.value = opportunities.value.filter(o => o.id !== opportunityToDelete.value.id)
      const msg = result.notifiedCount > 0 
        ? `Opportunité supprimée. ${result.notifiedCount} candidat(s) notifié(s).`
        : 'Opportunité supprimée'
      showMessage(msg, 'success')
    } else {
      showMessage('Erreur: ' + result.error, 'error')
    }
  } catch (error) {
    showMessage('Erreur lors de la suppression', 'error')
  } finally {
    deleting.value = false
    deleteDialog.value = false
    opportunityToDelete.value = null
    deleteReason.value = ''
  }
}

const viewDetails = (opportunity) => {
  selectedOpportunity.value = opportunity
  detailsDialog.value = true
}

const showMessage = (message, color = 'success') => {
  snackbar.value = { show: true, message, color }
}

// Helpers
const getStatusColor = (status) => {
  const colors = {
    draft: 'grey',
    in_review: 'orange',
    published: 'success',
    rejected: 'error',
    archived: 'blue-grey'
  }
  return colors[status] || 'grey'
}

const getStatusIcon = (status) => {
  const icons = {
    draft: 'mdi-file-edit',
    in_review: 'mdi-clock-outline',
    published: 'mdi-check-circle',
    rejected: 'mdi-close-circle',
    archived: 'mdi-archive'
  }
  return icons[status] || 'mdi-help-circle'
}

const getStatusLabel = (status) => {
  const labels = {
    draft: 'Brouillon',
    in_review: 'En modération',
    published: 'Publiée',
    rejected: 'Refusée',
    archived: 'Archivée'
  }
  return labels[status] || status
}

const truncateText = (text, maxLength) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

const formatDate = (date) => {
  if (!date) return null
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

// Lifecycle
onMounted(() => {
  loadOpportunities()
})
</script>

<style scoped>
.border-warning {
  border-left: 4px solid #FFC107 !important;
}
</style>
