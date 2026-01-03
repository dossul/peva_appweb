<template>
  <div class="admin-email-templates">
    <!-- Header -->
    <div class="page-header bg-orange-darken-1 text-white py-6 mb-6">
      <v-container>
        <div class="d-flex align-center justify-space-between">
          <div class="d-flex align-center">
            <v-icon size="32" class="mr-3">mdi-email-edit</v-icon>
            <div>
              <h1 class="text-h4 font-weight-bold mb-1">Templates d'Emails</h1>
              <p class="text-body-2 ma-0 opacity-80">Gérer les modèles d'emails de la plateforme</p>
            </div>
          </div>
          <v-btn color="white" variant="flat" class="text-orange-darken-1" prepend-icon="mdi-plus" @click="openCreateDialog">
            Nouveau template
          </v-btn>
        </div>
      </v-container>
    </div>

    <v-container>
      <!-- Statistiques -->
      <v-row class="mb-6">
        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-4 text-center">
            <v-icon color="orange" size="32" class="mb-2">mdi-email-multiple</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.totalTemplates }}</div>
            <div class="text-body-2 text-grey">Templates totaux</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-4 text-center">
            <v-icon color="green" size="32" class="mb-2">mdi-check-circle</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.activeTemplates }}</div>
            <div class="text-body-2 text-grey">Actifs</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-4 text-center">
            <v-icon color="blue" size="32" class="mb-2">mdi-cog</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.systemTemplates }}</div>
            <div class="text-body-2 text-grey">Système</div>
          </v-card>
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-card class="pa-4 text-center">
            <v-icon color="purple" size="32" class="mb-2">mdi-folder</v-icon>
            <div class="text-h4 font-weight-bold">{{ stats.totalCategories }}</div>
            <div class="text-body-2 text-grey">Catégories</div>
          </v-card>
        </v-col>
      </v-row>

      <!-- Tabs -->
      <v-card>
        <v-tabs v-model="activeTab" color="orange-darken-1">
          <v-tab value="templates">
            <v-icon class="mr-2">mdi-email</v-icon>
            Templates
          </v-tab>
          <v-tab value="categories">
            <v-icon class="mr-2">mdi-folder</v-icon>
            Catégories
          </v-tab>
        </v-tabs>

        <v-divider />

        <v-tabs-window v-model="activeTab">
          <!-- Tab Templates -->
          <v-tabs-window-item value="templates">
            <v-card-text>
              <!-- Filtres -->
              <v-row class="mb-4">
                <v-col cols="12" md="4">
                  <v-text-field
                    v-model="searchQuery"
                    placeholder="Rechercher un template..."
                    prepend-inner-icon="mdi-magnify"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="filterCategory"
                    :items="categoryOptions"
                    label="Catégorie"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                  />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select
                    v-model="filterStatus"
                    :items="statusOptions"
                    label="Statut"
                    variant="outlined"
                    density="compact"
                    hide-details
                    clearable
                  />
                </v-col>
              </v-row>

              <!-- Liste des templates -->
              <v-data-table
                :headers="templateHeaders"
                :items="filteredTemplates"
                :loading="loading"
                class="elevation-0"
              >
                <template v-slot:item.category="{ item }">
                  <v-chip
                    v-if="item.category"
                    :color="item.category.color"
                    size="small"
                    :prepend-icon="item.category.icon"
                  >
                    {{ item.category.name }}
                  </v-chip>
                </template>

                <template v-slot:item.is_active="{ item }">
                  <v-chip :color="item.is_active ? 'green' : 'grey'" size="small">
                    {{ item.is_active ? 'Actif' : 'Inactif' }}
                  </v-chip>
                </template>

                <template v-slot:item.is_system="{ item }">
                  <v-icon v-if="item.is_system" color="blue" size="small">mdi-lock</v-icon>
                  <v-icon v-else color="grey" size="small">mdi-lock-open</v-icon>
                </template>

                <template v-slot:item.actions="{ item }">
                  <v-btn icon size="small" variant="text" @click="previewTemplate(item)" title="Prévisualiser">
                    <v-icon>mdi-eye</v-icon>
                  </v-btn>
                  <v-btn icon size="small" variant="text" @click="editTemplate(item)" title="Modifier">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon size="small" variant="text" @click="testTemplate(item)" title="Tester">
                    <v-icon color="orange">mdi-send</v-icon>
                  </v-btn>
                  <v-btn 
                    v-if="!item.is_system" 
                    icon 
                    size="small" 
                    variant="text" 
                    @click="confirmDeleteTemplate(item)"
                    title="Supprimer"
                  >
                    <v-icon color="red">mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-tabs-window-item>

          <!-- Tab Catégories -->
          <v-tabs-window-item value="categories">
            <v-card-text>
              <div class="d-flex justify-end mb-4">
                <v-btn color="orange-darken-1" prepend-icon="mdi-plus" @click="openCategoryDialog">
                  Nouvelle catégorie
                </v-btn>
              </div>

              <v-data-table
                :headers="categoryHeaders"
                :items="categories"
                :loading="loading"
                class="elevation-0"
              >
                <template v-slot:item.icon="{ item }">
                  <v-icon :color="item.color">{{ item.icon }}</v-icon>
                </template>

                <template v-slot:item.color="{ item }">
                  <v-chip :color="item.color" size="small">{{ item.color }}</v-chip>
                </template>

                <template v-slot:item.is_active="{ item }">
                  <v-switch
                    :model-value="item.is_active"
                    color="green"
                    hide-details
                    density="compact"
                    @update:model-value="toggleCategoryActive(item)"
                  />
                </template>

                <template v-slot:item.actions="{ item }">
                  <v-btn icon size="small" variant="text" @click="editCategory(item)">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn icon size="small" variant="text" @click="confirmDeleteCategory(item)">
                    <v-icon color="red">mdi-delete</v-icon>
                  </v-btn>
                </template>
              </v-data-table>
            </v-card-text>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-card>
    </v-container>

    <!-- Dialog Template -->
    <v-dialog v-model="templateDialog" max-width="1200" persistent>
      <v-card>
        <v-card-title class="bg-orange-darken-1 text-white">
          <v-icon class="mr-2">{{ editingTemplate?.id ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
          {{ editingTemplate?.id ? 'Modifier le template' : 'Nouveau template' }}
        </v-card-title>

        <v-card-text class="pa-6">
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="editingTemplate.name"
                label="Nom du template *"
                variant="outlined"
                :rules="[v => !!v || 'Requis']"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="editingTemplate.code"
                label="Code unique *"
                variant="outlined"
                :rules="[v => !!v || 'Requis']"
                :disabled="editingTemplate?.is_system"
                hint="ex: new_message, welcome, password_reset"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-select
                v-model="editingTemplate.category_id"
                :items="categories"
                item-title="name"
                item-value="id"
                label="Catégorie"
                variant="outlined"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="editingTemplate.subject"
                label="Sujet de l'email *"
                variant="outlined"
                :rules="[v => !!v || 'Requis']"
                hint="Utilisez {{variable}} pour les variables"
              />
            </v-col>
            <v-col cols="12">
              <v-textarea
                v-model="editingTemplate.description"
                label="Description"
                variant="outlined"
                rows="2"
              />
            </v-col>
            <v-col cols="12">
              <v-tabs v-model="contentTab" color="orange-darken-1">
                <v-tab value="html">HTML</v-tab>
                <v-tab value="text">Texte brut</v-tab>
                <v-tab value="preview">Prévisualisation</v-tab>
              </v-tabs>

              <v-tabs-window v-model="contentTab" class="mt-4">
                <v-tabs-window-item value="html">
                  <v-textarea
                    v-model="editingTemplate.html_content"
                    label="Contenu HTML *"
                    variant="outlined"
                    rows="15"
                    :rules="[v => !!v || 'Requis']"
                    style="font-family: monospace;"
                  />
                </v-tabs-window-item>

                <v-tabs-window-item value="text">
                  <v-textarea
                    v-model="editingTemplate.text_content"
                    label="Version texte (fallback)"
                    variant="outlined"
                    rows="15"
                    style="font-family: monospace;"
                  />
                </v-tabs-window-item>

                <v-tabs-window-item value="preview">
                  <v-card variant="outlined" class="pa-4">
                    <div class="text-subtitle-2 mb-2">Sujet: {{ editingTemplate.subject }}</div>
                    <v-divider class="mb-4" />
                    <div v-html="editingTemplate.html_content" class="email-preview"></div>
                  </v-card>
                </v-tabs-window-item>
              </v-tabs-window>
            </v-col>
            <v-col cols="12">
              <v-combobox
                v-model="editingTemplate.variables"
                label="Variables disponibles"
                variant="outlined"
                multiple
                chips
                hint="Variables utilisables: {{nom_variable}}"
              />
            </v-col>
            <v-col cols="12" md="6">
              <v-switch
                v-model="editingTemplate.is_active"
                label="Template actif"
                color="green"
              />
            </v-col>
          </v-row>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="templateDialog = false">Annuler</v-btn>
          <v-btn color="orange-darken-1" variant="flat" @click="saveTemplate" :loading="saving">
            {{ editingTemplate?.id ? 'Mettre à jour' : 'Créer' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Test Email -->
    <v-dialog v-model="testDialog" max-width="500">
      <v-card>
        <v-card-title class="bg-orange-darken-1 text-white">
          <v-icon class="mr-2">mdi-send</v-icon>
          Tester l'envoi
        </v-card-title>

        <v-card-text class="pa-6">
          <v-text-field
            v-model="testEmail"
            label="Email de test"
            variant="outlined"
            type="email"
            :rules="[v => !!v || 'Requis', v => /.+@.+/.test(v) || 'Email invalide']"
          />
          <v-alert type="info" variant="tonal" class="mt-4">
            Un email de test sera envoyé avec des données fictives.
          </v-alert>
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="testDialog = false">Annuler</v-btn>
          <v-btn color="orange-darken-1" variant="flat" @click="sendTestEmail" :loading="sendingTest">
            Envoyer le test
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Catégorie -->
    <v-dialog v-model="categoryDialog" max-width="500">
      <v-card>
        <v-card-title class="bg-orange-darken-1 text-white">
          {{ editingCategory?.id ? 'Modifier la catégorie' : 'Nouvelle catégorie' }}
        </v-card-title>

        <v-card-text class="pa-6">
          <v-text-field
            v-model="editingCategory.name"
            label="Nom *"
            variant="outlined"
            class="mb-4"
          />
          <v-text-field
            v-model="editingCategory.slug"
            label="Slug *"
            variant="outlined"
            class="mb-4"
          />
          <v-textarea
            v-model="editingCategory.description"
            label="Description"
            variant="outlined"
            rows="2"
            class="mb-4"
          />
          <v-text-field
            v-model="editingCategory.icon"
            label="Icône (mdi-xxx)"
            variant="outlined"
            class="mb-4"
          />
          <v-select
            v-model="editingCategory.color"
            :items="colorOptions"
            label="Couleur"
            variant="outlined"
          />
        </v-card-text>

        <v-card-actions class="pa-4">
          <v-spacer />
          <v-btn variant="text" @click="categoryDialog = false">Annuler</v-btn>
          <v-btn color="orange-darken-1" variant="flat" @click="saveCategory" :loading="saving">
            Enregistrer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Dialog Prévisualisation -->
    <v-dialog v-model="previewDialog" max-width="700">
      <v-card>
        <v-card-title class="bg-grey-lighten-4">
          <v-icon class="mr-2">mdi-eye</v-icon>
          Prévisualisation: {{ previewingTemplate?.name }}
        </v-card-title>

        <v-card-text class="pa-0">
          <div class="pa-4 bg-grey-lighten-5">
            <strong>Sujet:</strong> {{ previewingTemplate?.subject }}
          </div>
          <v-divider />
          <div v-html="previewingTemplate?.html_content" class="pa-4 email-preview"></div>
        </v-card-text>

        <v-card-actions>
          <v-spacer />
          <v-btn variant="text" @click="previewDialog = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Snackbar -->
    <v-snackbar v-model="snackbar.show" :color="snackbar.color" :timeout="3000">
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { emailTemplatesService } from '@/services/admin/emailTemplatesService'

// State
const loading = ref(false)
const saving = ref(false)
const sendingTest = ref(false)
const activeTab = ref('templates')
const contentTab = ref('html')
const searchQuery = ref('')
const filterCategory = ref(null)
const filterStatus = ref(null)

// Data
const templates = ref([])
const categories = ref([])
const stats = ref({
  totalTemplates: 0,
  activeTemplates: 0,
  systemTemplates: 0,
  customTemplates: 0,
  totalCategories: 0
})

// Dialogs
const templateDialog = ref(false)
const categoryDialog = ref(false)
const testDialog = ref(false)
const previewDialog = ref(false)

// Editing
const editingTemplate = ref({})
const editingCategory = ref({})
const previewingTemplate = ref(null)
const testEmail = ref('')
const testingTemplate = ref(null)

// Snackbar
const snackbar = ref({ show: false, message: '', color: 'success' })

// Options
const statusOptions = [
  { title: 'Actif', value: true },
  { title: 'Inactif', value: false }
]

const colorOptions = ['blue', 'green', 'red', 'orange', 'purple', 'teal', 'grey', 'indigo']

const categoryOptions = computed(() => [
  { title: 'Toutes', value: null },
  ...categories.value.map(c => ({ title: c.name, value: c.id }))
])

// Headers
const templateHeaders = [
  { title: 'Nom', key: 'name', sortable: true },
  { title: 'Code', key: 'code', sortable: true },
  { title: 'Catégorie', key: 'category', sortable: false },
  { title: 'Statut', key: 'is_active', sortable: true },
  { title: 'Système', key: 'is_system', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
]

const categoryHeaders = [
  { title: 'Icône', key: 'icon', sortable: false },
  { title: 'Nom', key: 'name', sortable: true },
  { title: 'Slug', key: 'slug', sortable: true },
  { title: 'Couleur', key: 'color', sortable: false },
  { title: 'Actif', key: 'is_active', sortable: true },
  { title: 'Actions', key: 'actions', sortable: false, align: 'end' }
]

// Computed
const filteredTemplates = computed(() => {
  let filtered = templates.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(query) ||
      t.code.toLowerCase().includes(query) ||
      t.subject.toLowerCase().includes(query)
    )
  }

  if (filterCategory.value) {
    filtered = filtered.filter(t => t.category_id === filterCategory.value)
  }

  if (filterStatus.value !== null) {
    filtered = filtered.filter(t => t.is_active === filterStatus.value)
  }

  return filtered
})

// Methods
const loadData = async () => {
  loading.value = true
  try {
    const [templatesRes, categoriesRes, statsRes] = await Promise.all([
      emailTemplatesService.getTemplates(),
      emailTemplatesService.getCategories(),
      emailTemplatesService.getStats()
    ])

    if (templatesRes.success) templates.value = templatesRes.data
    if (categoriesRes.success) categories.value = categoriesRes.data
    if (statsRes.success) stats.value = statsRes.data
  } catch (error) {
    showSnackbar('Erreur de chargement', 'error')
  }
  loading.value = false
}

const openCreateDialog = () => {
  editingTemplate.value = {
    name: '',
    code: '',
    category_id: null,
    subject: '',
    description: '',
    html_content: '',
    text_content: '',
    variables: [],
    is_active: true
  }
  contentTab.value = 'html'
  templateDialog.value = true
}

const editTemplate = (template) => {
  editingTemplate.value = { ...template }
  if (typeof template.variables === 'string') {
    editingTemplate.value.variables = JSON.parse(template.variables)
  }
  contentTab.value = 'html'
  templateDialog.value = true
}

const saveTemplate = async () => {
  saving.value = true
  try {
    const data = {
      ...editingTemplate.value,
      variables: JSON.stringify(editingTemplate.value.variables || [])
    }

    let result
    if (editingTemplate.value.id) {
      result = await emailTemplatesService.updateTemplate(editingTemplate.value.id, data)
    } else {
      result = await emailTemplatesService.createTemplate(data)
    }

    if (result.success) {
      showSnackbar('Template enregistré avec succès', 'success')
      templateDialog.value = false
      loadData()
    } else {
      showSnackbar(result.error || 'Erreur', 'error')
    }
  } catch (error) {
    showSnackbar('Erreur lors de l\'enregistrement', 'error')
  }
  saving.value = false
}

const confirmDeleteTemplate = (template) => {
  if (confirm(`Supprimer le template "${template.name}" ?`)) {
    deleteTemplate(template.id)
  }
}

const deleteTemplate = async (id) => {
  const result = await emailTemplatesService.deleteTemplate(id)
  if (result.success) {
    showSnackbar('Template supprimé', 'success')
    loadData()
  } else {
    showSnackbar(result.error || 'Erreur', 'error')
  }
}

const previewTemplate = (template) => {
  previewingTemplate.value = template
  previewDialog.value = true
}

const testTemplate = (template) => {
  testingTemplate.value = template
  testEmail.value = ''
  testDialog.value = true
}

const sendTestEmail = async () => {
  if (!testEmail.value) return

  sendingTest.value = true
  try {
    const testVariables = {
      recipient_name: 'Utilisateur Test',
      sender_name: 'Jean Dupont',
      sender_organization: 'Test Company',
      message_preview: 'Ceci est un message de test...',
      action_url: window.location.origin,
      event_title: 'Événement Test',
      event_date: new Date().toLocaleDateString('fr-FR'),
      event_location: 'Lieu Test',
      user_name: 'Utilisateur Test',
      opportunity_title: 'Opportunité Test',
      opportunity_type: 'Type Test',
      opportunity_sector: 'Secteur Test',
      deadline: new Date().toLocaleDateString('fr-FR')
    }

    const result = await emailTemplatesService.sendTemplateEmail(
      testingTemplate.value.code,
      testEmail.value,
      testVariables
    )

    if (result.success) {
      showSnackbar('Email de test envoyé !', 'success')
      testDialog.value = false
    } else {
      showSnackbar(result.error || 'Erreur d\'envoi', 'error')
    }
  } catch (error) {
    showSnackbar('Erreur lors de l\'envoi', 'error')
  }
  sendingTest.value = false
}

// Catégories
const openCategoryDialog = () => {
  editingCategory.value = {
    name: '',
    slug: '',
    description: '',
    icon: 'mdi-email',
    color: 'blue',
    is_active: true
  }
  categoryDialog.value = true
}

const editCategory = (category) => {
  editingCategory.value = { ...category }
  categoryDialog.value = true
}

const saveCategory = async () => {
  saving.value = true
  try {
    let result
    if (editingCategory.value.id) {
      result = await emailTemplatesService.updateCategory(editingCategory.value.id, editingCategory.value)
    } else {
      result = await emailTemplatesService.createCategory(editingCategory.value)
    }

    if (result.success) {
      showSnackbar('Catégorie enregistrée', 'success')
      categoryDialog.value = false
      loadData()
    } else {
      showSnackbar(result.error || 'Erreur', 'error')
    }
  } catch (error) {
    showSnackbar('Erreur', 'error')
  }
  saving.value = false
}

const toggleCategoryActive = async (category) => {
  await emailTemplatesService.updateCategory(category.id, { is_active: !category.is_active })
  loadData()
}

const confirmDeleteCategory = (category) => {
  if (confirm(`Supprimer la catégorie "${category.name}" ?`)) {
    deleteCategory(category.id)
  }
}

const deleteCategory = async (id) => {
  const result = await emailTemplatesService.deleteCategory(id)
  if (result.success) {
    showSnackbar('Catégorie supprimée', 'success')
    loadData()
  } else {
    showSnackbar(result.error || 'Erreur', 'error')
  }
}

const showSnackbar = (message, color) => {
  snackbar.value = { show: true, message, color }
}

// Init
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.admin-email-templates {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  background: linear-gradient(135deg, #e65100 0%, #ef6c00 100%);
}

.email-preview {
  max-height: 500px;
  overflow-y: auto;
}

.email-preview img {
  max-width: 100%;
}
</style>
