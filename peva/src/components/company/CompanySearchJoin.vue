<template>
  <v-card>
    <v-card-title class="bg-green-darken-2 text-white pa-4">
      <v-icon start>mdi-magnify</v-icon>
      Rechercher une entreprise existante
    </v-card-title>
    
    <v-card-text class="pa-6">
      <v-alert type="info" variant="tonal" class="mb-6">
        <v-icon start>mdi-lightbulb</v-icon>
        Avant de créer une nouvelle entreprise, vérifiez si elle existe déjà sur la plateforme.
        Vous pourrez alors demander à la rejoindre.
      </v-alert>

      <!-- Recherche -->
      <v-text-field
        v-model="searchQuery"
        label="Nom de l'entreprise"
        placeholder="Tapez le nom de votre entreprise..."
        variant="outlined"
        prepend-inner-icon="mdi-magnify"
        :loading="searching"
        clearable
        @input="debouncedSearch"
      />

      <!-- Résultats -->
      <div v-if="searchResults.exact.length > 0 || searchResults.similar.length > 0" class="mt-4">
        <!-- Correspondances exactes -->
        <div v-if="searchResults.exact.length > 0">
          <h4 class="text-subtitle-2 text-red-darken-2 mb-2">
            <v-icon start size="small">mdi-alert-circle</v-icon>
            Entreprise trouvée avec ce nom exact
          </h4>
          <v-list density="compact" class="rounded border mb-4">
            <v-list-item
              v-for="company in searchResults.exact"
              :key="company.id"
              class="py-3"
            >
              <template #prepend>
                <v-avatar color="green-lighten-4" class="mr-3">
                  <v-img v-if="company.logo_url" :src="company.logo_url" />
                  <v-icon v-else color="green-darken-2">mdi-domain</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title class="font-weight-bold">
                {{ company.name }}
              </v-list-item-title>
              <v-list-item-subtitle>
                {{ company.industry }} • {{ company.country }}
              </v-list-item-subtitle>
              <template #append>
                <v-btn
                  size="small"
                  color="green-darken-2"
                  variant="flat"
                  :loading="joiningCompany === company.id"
                  @click="requestToJoin(company)"
                >
                  Demander à rejoindre
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </div>

        <!-- Suggestions similaires -->
        <div v-if="searchResults.similar.length > 0">
          <h4 class="text-subtitle-2 text-grey-darken-1 mb-2">
            <v-icon start size="small">mdi-lightbulb-outline</v-icon>
            Entreprises avec des noms similaires
          </h4>
          <v-list density="compact" class="rounded border">
            <v-list-item
              v-for="company in searchResults.similar"
              :key="company.id"
              class="py-3"
            >
              <template #prepend>
                <v-avatar color="grey-lighten-3" class="mr-3">
                  <v-img v-if="company.logo_url" :src="company.logo_url" />
                  <v-icon v-else color="grey">mdi-domain</v-icon>
                </v-avatar>
              </template>
              <v-list-item-title>{{ company.name }}</v-list-item-title>
              <v-list-item-subtitle>
                {{ company.industry }} • {{ company.country }}
              </v-list-item-subtitle>
              <template #append>
                <v-btn
                  size="small"
                  variant="outlined"
                  :loading="joiningCompany === company.id"
                  @click="requestToJoin(company)"
                >
                  Rejoindre
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
        </div>
      </div>

      <!-- Aucun résultat -->
      <div v-else-if="searchQuery && searchQuery.length >= 3 && !searching" class="text-center py-6">
        <v-icon size="48" color="grey-lighten-1">mdi-domain-plus</v-icon>
        <p class="text-body-1 text-grey mt-3">
          Aucune entreprise trouvée avec ce nom
        </p>
        <v-btn
          color="green-darken-2"
          variant="flat"
          class="mt-4"
          @click="$emit('create-new', searchQuery)"
        >
          <v-icon start>mdi-plus</v-icon>
          Créer "{{ searchQuery }}"
        </v-btn>
      </div>

      <!-- Instructions -->
      <div v-else-if="!searchQuery" class="text-center py-6 text-grey">
        <v-icon size="48" color="grey-lighten-2">mdi-magnify</v-icon>
        <p class="mt-3">Entrez au moins 3 caractères pour rechercher</p>
      </div>
    </v-card-text>

    <!-- Dialog: Demande d'adhésion -->
    <v-dialog v-model="showJoinDialog" max-width="500">
      <v-card>
        <v-card-title class="bg-green-darken-2 text-white">
          <v-icon start>mdi-account-plus</v-icon>
          Rejoindre {{ selectedCompany?.name }}
        </v-card-title>
        <v-card-text class="pa-6">
          <p class="text-body-1 mb-4">
            Votre demande sera envoyée aux administrateurs de l'entreprise pour validation.
          </p>
          <v-textarea
            v-model="joinMessage"
            label="Message (optionnel)"
            placeholder="Présentez-vous brièvement..."
            variant="outlined"
            rows="3"
          />
        </v-card-text>
        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="showJoinDialog = false">Annuler</v-btn>
          <v-btn
            color="green-darken-2"
            variant="flat"
            :loading="submittingRequest"
            @click="submitJoinRequest"
          >
            Envoyer la demande
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color">
      {{ snackbar.message }}
    </v-snackbar>
  </v-card>
</template>

<script setup>
import { ref } from 'vue'
import { companyService } from '@/services/companyService'
import { useAuthStore } from '@/stores/auth'

const emit = defineEmits(['create-new', 'joined'])
const authStore = useAuthStore()

// Search state
const searchQuery = ref('')
const searching = ref(false)
const searchResults = ref({ exact: [], similar: [] })
let searchTimeout = null

// Join request state
const showJoinDialog = ref(false)
const selectedCompany = ref(null)
const joinMessage = ref('')
const joiningCompany = ref(null)
const submittingRequest = ref(false)

// Snackbar
const snackbar = ref({
  show: false,
  message: '',
  color: 'success'
})

const debouncedSearch = () => {
  clearTimeout(searchTimeout)
  
  if (!searchQuery.value || searchQuery.value.length < 3) {
    searchResults.value = { exact: [], similar: [] }
    return
  }
  
  searchTimeout = setTimeout(async () => {
    searching.value = true
    try {
      searchResults.value = await companyService.findSimilarCompanies(searchQuery.value)
    } catch (error) {
      console.error('Erreur recherche:', error)
    } finally {
      searching.value = false
    }
  }, 300)
}

const requestToJoin = (company) => {
  selectedCompany.value = company
  joinMessage.value = ''
  showJoinDialog.value = true
}

const submitJoinRequest = async () => {
  if (!selectedCompany.value || !authStore.user) return
  
  try {
    submittingRequest.value = true
    joiningCompany.value = selectedCompany.value.id
    
    await companyService.requestToJoinCompany(
      selectedCompany.value.id,
      authStore.user.id,
      joinMessage.value
    )
    
    snackbar.value = {
      show: true,
      message: 'Demande envoyée ! Vous serez notifié de la réponse.',
      color: 'success'
    }
    
    showJoinDialog.value = false
    emit('joined', selectedCompany.value)
  } catch (error) {
    snackbar.value = {
      show: true,
      message: error.message,
      color: 'error'
    }
  } finally {
    submittingRequest.value = false
    joiningCompany.value = null
  }
}
</script>
