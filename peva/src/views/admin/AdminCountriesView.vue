<template>
  <div class="admin-countries-view">
    <v-container fluid>
      <!-- En-tête -->
      <div class="d-flex justify-space-between align-center mb-6">
        <div>
          <h1 class="text-h4 font-weight-bold mb-2">Gestion des Pays</h1>
          <p class="text-body-1 text-grey-darken-1">
            {{ countries.length }} pays {{ countries.length > 1 ? 'enregistrés' : 'enregistré' }}
          </p>
        </div>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          @click="openCreateDialog"
        >
          Ajouter un pays
        </v-btn>
      </div>

      <!-- Filtres -->
      <v-card class="mb-6">
        <v-card-text>
          <v-row>
            <v-col cols="12" md="4">
              <v-text-field
                v-model="searchQuery"
                label="Rechercher un pays"
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                clearable
                hide-details
              ></v-text-field>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="filterContinent"
                :items="continents"
                label="Filtrer par continent"
                variant="outlined"
                density="compact"
                clearable
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" md="3">
              <v-select
                v-model="filterStatus"
                :items="statusOptions"
                label="Statut"
                variant="outlined"
                density="compact"
                clearable
                hide-details
              ></v-select>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>

      <!-- Table des pays -->
      <v-card>
        <v-data-table
          :headers="headers"
          :items="filteredCountries"
          :loading="loading"
          :items-per-page="20"
          class="elevation-0"
        >
          <template #item.flag_emoji="{ item }">
            <span style="font-size: 24px;">{{ item.flag_emoji || '🌍' }}</span>
          </template>

          <template #item.is_active="{ item }">
            <v-chip
              :color="item.is_active ? 'success' : 'error'"
              size="small"
              variant="flat"
            >
              {{ item.is_active ? 'Actif' : 'Inactif' }}
            </v-chip>
          </template>

          <template #item.actions="{ item }">
            <v-btn
              icon="mdi-pencil"
              variant="text"
              size="small"
              @click="editCountry(item)"
            ></v-btn>
            <v-btn
              icon="mdi-delete"
              variant="text"
              size="small"
              color="error"
              @click="confirmDelete(item)"
            ></v-btn>
          </template>
        </v-data-table>
      </v-card>
    </v-container>

    <!-- Dialog Créer/Modifier -->
    <v-dialog v-model="dialog" max-width="600px">
      <v-card>
        <v-card-title class="text-h5 pa-6 bg-primary text-white">
          {{ editMode ? 'Modifier le pays' : 'Ajouter un pays' }}
        </v-card-title>

        <v-card-text class="pa-6">
          <v-form ref="form" v-model="formValid">
            <v-text-field
              v-model="formData.name"
              label="Nom du pays *"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-4"
            ></v-text-field>

            <v-text-field
              v-model="formData.code"
              label="Code ISO (ex: BF, SN, CI)"
              hint="Code à 2 lettres"
              :rules="[rules.code]"
              variant="outlined"
              class="mb-4"
            ></v-text-field>

            <v-select
              v-model="formData.continent"
              :items="continents"
              label="Continent *"
              :rules="[rules.required]"
              variant="outlined"
              class="mb-4"
            ></v-select>

            <v-text-field
              v-model="formData.flag_emoji"
              label="Emoji drapeau (ex: 🇧🇫)"
              hint="Coller l'emoji du drapeau"
              variant="outlined"
              class="mb-4"
            ></v-text-field>

            <v-text-field
              v-model.number="formData.display_order"
              label="Ordre d'affichage"
              type="number"
              variant="outlined"
              class="mb-4"
            ></v-text-field>

            <v-switch
              v-model="formData.is_active"
              label="Pays actif"
              color="success"
            ></v-switch>
          </v-form>
        </v-card-text>

        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeDialog">Annuler</v-btn>
          <v-btn
            color="primary"
            :loading="saving"
            :disabled="!formValid"
            @click="saveCountry"
          >
            {{ editMode ? 'Modifier' : 'Créer' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Confirmation suppression -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5 pa-6">
          Confirmer la suppression
        </v-card-title>
        <v-card-text class="pa-6">
          Êtes-vous sûr de vouloir supprimer le pays <strong>{{ countryToDelete?.name }}</strong> ?
          Cette action est irréversible.
        </v-card-text>
        <v-card-actions class="pa-6">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="deleteDialog = false">Annuler</v-btn>
          <v-btn
            color="error"
            :loading="deleting"
            @click="deleteCountry"
          >
            Supprimer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
      {{ snackbarMessage }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

// État
const countries = ref([])
const loading = ref(false)
const dialog = ref(false)
const deleteDialog = ref(false)
const editMode = ref(false)
const formValid = ref(false)
const saving = ref(false)
const deleting = ref(false)
const searchQuery = ref('')
const filterContinent = ref(null)
const filterStatus = ref(null)
const countryToDelete = ref(null)
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Données du formulaire
const formData = ref({
  name: '',
  code: '',
  continent: 'Afrique',
  flag_emoji: '',
  display_order: 0,
  is_active: true
})

// Headers du tableau
const headers = [
  { title: 'Drapeau', key: 'flag_emoji', sortable: false, width: '80px' },
  { title: 'Nom', key: 'name', sortable: true },
  { title: 'Code', key: 'code', sortable: true },
  { title: 'Continent', key: 'continent', sortable: true },
  { title: 'Ordre', key: 'display_order', sortable: true },
  { title: 'Statut', key: 'is_active', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
]

// Options
const continents = ['Afrique', 'Europe', 'Asie', 'Amérique', 'Océanie', 'Autre']
const statusOptions = [
  { title: 'Actif', value: true },
  { title: 'Inactif', value: false }
]

// Règles de validation
const rules = {
  required: v => !!v || 'Ce champ est requis',
  code: v => !v || (v.length === 2 && /^[A-Z]+$/.test(v)) || 'Code ISO à 2 lettres majuscules (ex: BF)'
}

// Pays filtrés
const filteredCountries = computed(() => {
  let result = [...countries.value]

  if (searchQuery.value) {
    const search = searchQuery.value.toLowerCase()
    result = result.filter(c =>
      c.name.toLowerCase().includes(search) ||
      (c.code && c.code.toLowerCase().includes(search))
    )
  }

  if (filterContinent.value) {
    result = result.filter(c => c.continent === filterContinent.value)
  }

  if (filterStatus.value !== null) {
    result = result.filter(c => c.is_active === filterStatus.value)
  }

  return result.sort((a, b) => {
    if (a.continent === 'Autre' && b.continent !== 'Autre') return 1
    if (a.continent !== 'Autre' && b.continent === 'Autre') return -1
    return a.name.localeCompare(b.name, 'fr')
  })
})

// Charger les pays
const loadCountries = async () => {
  loading.value = true
  try {
    const { data, error } = await supabase
      .from('pev_countries')
      .select('*')
      .order('name')

    if (error) throw error
    countries.value = data || []
  } catch (error) {
    console.error('Erreur chargement pays:', error)
    showSnackbar('Erreur lors du chargement des pays', 'error')
  } finally {
    loading.value = false
  }
}

// Ouvrir dialog création
const openCreateDialog = () => {
  editMode.value = false
  formData.value = {
    name: '',
    code: '',
    continent: 'Afrique',
    flag_emoji: '',
    display_order: countries.value.length,
    is_active: true
  }
  dialog.value = true
}

// Éditer un pays
const editCountry = (country) => {
  editMode.value = true
  formData.value = { ...country }
  dialog.value = true
}

// Fermer dialog
const closeDialog = () => {
  dialog.value = false
  formData.value = {
    name: '',
    code: '',
    continent: 'Afrique',
    flag_emoji: '',
    display_order: 0,
    is_active: true
  }
}

// Sauvegarder
const saveCountry = async () => {
  if (!formValid.value) return

  saving.value = true
  try {
    if (editMode.value) {
      // Mise à jour
      const { error } = await supabase
        .from('pev_countries')
        .update({
          name: formData.value.name,
          code: formData.value.code?.toUpperCase() || null,
          continent: formData.value.continent,
          flag_emoji: formData.value.flag_emoji || null,
          display_order: formData.value.display_order,
          is_active: formData.value.is_active
        })
        .eq('id', formData.value.id)

      if (error) throw error
      showSnackbar('Pays modifié avec succès', 'success')
    } else {
      // Création
      const { error } = await supabase
        .from('pev_countries')
        .insert([{
          name: formData.value.name,
          code: formData.value.code?.toUpperCase() || null,
          continent: formData.value.continent,
          flag_emoji: formData.value.flag_emoji || null,
          display_order: formData.value.display_order,
          is_active: formData.value.is_active
        }])

      if (error) throw error
      showSnackbar('Pays créé avec succès', 'success')
    }

    closeDialog()
    loadCountries()
  } catch (error) {
    console.error('Erreur sauvegarde:', error)
    showSnackbar('Erreur lors de la sauvegarde', 'error')
  } finally {
    saving.value = false
  }
}

// Confirmer suppression
const confirmDelete = (country) => {
  countryToDelete.value = country
  deleteDialog.value = true
}

// Supprimer
const deleteCountry = async () => {
  if (!countryToDelete.value) return

  deleting.value = true
  try {
    const { error } = await supabase
      .from('pev_countries')
      .delete()
      .eq('id', countryToDelete.value.id)

    if (error) throw error
    showSnackbar('Pays supprimé avec succès', 'success')
    deleteDialog.value = false
    loadCountries()
  } catch (error) {
    console.error('Erreur suppression:', error)
    showSnackbar('Erreur lors de la suppression', 'error')
  } finally {
    deleting.value = false
  }
}

// Snackbar
const showSnackbar = (message, color = 'success') => {
  snackbarMessage.value = message
  snackbarColor.value = color
  snackbar.value = true
}

// Initialisation
onMounted(() => {
  loadCountries()
})
</script>

<style scoped>
.admin-countries-view {
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 24px;
}
</style>
