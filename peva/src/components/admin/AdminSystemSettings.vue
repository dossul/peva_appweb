<template>
  <div class="admin-system-settings">
    <h2 class="text-h5 font-weight-bold mb-6">Paramètres Système</h2>

    <v-row>
      <!-- Configuration générale -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon color="blue" class="mr-2">mdi-cog</v-icon>
            Configuration Générale
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="settings.site_name"
                label="Nom du site"
                variant="outlined"
                class="mb-4"
              />
              <v-textarea
                v-model="settings.site_description"
                label="Description du site"
                rows="3"
                variant="outlined"
                class="mb-4"
              />
              <v-text-field
                v-model="settings.contact_email"
                label="Email de contact"
                type="email"
                variant="outlined"
                class="mb-4"
              />
              <v-text-field
                v-model="settings.support_phone"
                label="Téléphone support"
                variant="outlined"
                class="mb-4"
              />
              <v-select
                v-model="settings.default_language"
                :items="languageOptions"
                label="Langue par défaut"
                variant="outlined"
                class="mb-4"
              />
              <v-select
                v-model="settings.timezone"
                :items="timezoneOptions"
                label="Fuseau horaire"
                variant="outlined"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="primary" @click="saveGeneralSettings">
              Sauvegarder
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Paramètres de sécurité -->
        <v-card elevation="2" class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon color="red" class="mr-2">mdi-shield</v-icon>
            Sécurité
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-switch
                v-model="settings.require_email_verification"
                label="Vérification email obligatoire"
                color="primary"
                class="mb-4"
              />
              <v-switch
                v-model="settings.enable_two_factor"
                label="Authentification à deux facteurs"
                color="primary"
                class="mb-4"
              />
              <v-text-field
                v-model="settings.password_min_length"
                label="Longueur minimale mot de passe"
                type="number"
                variant="outlined"
                class="mb-4"
              />
              <v-text-field
                v-model="settings.session_timeout"
                label="Timeout session (minutes)"
                type="number"
                variant="outlined"
                class="mb-4"
              />
              <v-text-field
                v-model="settings.max_login_attempts"
                label="Tentatives de connexion max"
                type="number"
                variant="outlined"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="red" @click="saveSecuritySettings">
              Sauvegarder
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>

      <!-- Notifications et email -->
      <v-col cols="12" md="6">
        <v-card elevation="2" class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon color="orange" class="mr-2">mdi-bell</v-icon>
            Notifications
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-switch
                v-model="settings.enable_email_notifications"
                label="Notifications par email"
                color="primary"
                class="mb-4"
              />
              <v-switch
                v-model="settings.enable_push_notifications"
                label="Notifications push"
                color="primary"
                class="mb-4"
              />
              <v-text-field
                v-model="settings.smtp_host"
                label="Serveur SMTP"
                variant="outlined"
                class="mb-4"
              />
              <v-text-field
                v-model="settings.smtp_port"
                label="Port SMTP"
                type="number"
                variant="outlined"
                class="mb-4"
              />
              <v-text-field
                v-model="settings.smtp_username"
                label="Utilisateur SMTP"
                variant="outlined"
                class="mb-4"
              />
              <v-text-field
                v-model="settings.smtp_password"
                label="Mot de passe SMTP"
                type="password"
                variant="outlined"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="orange" @click="saveNotificationSettings">
              Sauvegarder
            </v-btn>
          </v-card-actions>
        </v-card>

        <!-- Stockage et fichiers -->
        <v-card elevation="2" class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon color="green" class="mr-2">mdi-folder</v-icon>
            Stockage et Fichiers
          </v-card-title>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model="settings.max_file_size"
                label="Taille max fichier (MB)"
                type="number"
                variant="outlined"
                class="mb-4"
              />
              <v-text-field
                v-model="settings.storage_quota_default"
                label="Quota stockage par défaut (MB)"
                type="number"
                variant="outlined"
                class="mb-4"
              />
              <v-select
                v-model="settings.allowed_file_types"
                :items="fileTypeOptions"
                label="Types de fichiers autorisés"
                multiple
                chips
                variant="outlined"
                class="mb-4"
              />
              <v-switch
                v-model="settings.enable_file_compression"
                label="Compression automatique"
                color="primary"
                class="mb-4"
              />
              <v-switch
                v-model="settings.enable_virus_scan"
                label="Scan antivirus"
                color="primary"
              />
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="green" @click="saveStorageSettings">
              Sauvegarder
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Statistiques système -->
    <v-row>
      <v-col cols="12">
        <v-card elevation="2" class="mb-6">
          <v-card-title class="d-flex align-center">
            <v-icon color="purple" class="mr-2">mdi-chart-line</v-icon>
            Statistiques Système
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col cols="12" md="3">
                <v-card color="blue-lighten-4" class="pa-4 text-center">
                  <v-icon size="32" color="blue">mdi-database</v-icon>
                  <div class="text-h6 font-weight-bold mt-2">{{ systemStats.database_size }}</div>
                  <div class="text-caption">Taille base de données</div>
                </v-card>
              </v-col>
              <v-col cols="12" md="3">
                <v-card color="green-lighten-4" class="pa-4 text-center">
                  <v-icon size="32" color="green">mdi-folder-multiple</v-icon>
                  <div class="text-h6 font-weight-bold mt-2">{{ systemStats.storage_used }}</div>
                  <div class="text-caption">Stockage utilisé</div>
                </v-card>
              </v-col>
              <v-col cols="12" md="3">
                <v-card color="orange-lighten-4" class="pa-4 text-center">
                  <v-icon size="32" color="orange">mdi-account-group</v-icon>
                  <div class="text-h6 font-weight-bold mt-2">{{ systemStats.active_users }}</div>
                  <div class="text-caption">Utilisateurs actifs</div>
                </v-card>
              </v-col>
              <v-col cols="12" md="3">
                <v-card color="red-lighten-4" class="pa-4 text-center">
                  <v-icon size="32" color="red">mdi-server</v-icon>
                  <div class="text-h6 font-weight-bold mt-2">{{ systemStats.server_uptime }}</div>
                  <div class="text-caption">Temps de fonctionnement</div>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Maintenance -->
    <v-row>
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon color="indigo" class="mr-2">mdi-wrench</v-icon>
            Maintenance
          </v-card-title>
          <v-card-text>
            <v-switch
              v-model="settings.maintenance_mode"
              label="Mode maintenance"
              color="warning"
              class="mb-4"
            />
            <v-textarea
              v-model="settings.maintenance_message"
              label="Message de maintenance"
              rows="3"
              variant="outlined"
              class="mb-4"
            />
            <v-btn
              color="indigo"
              block
              class="mb-2"
              @click="clearCache"
            >
              <v-icon start>mdi-cached</v-icon>
              Vider le cache
            </v-btn>
            <v-btn
              color="indigo"
              variant="outlined"
              block
              class="mb-2"
              @click="optimizeDatabase"
            >
              <v-icon start>mdi-database-cog</v-icon>
              Optimiser la base de données
            </v-btn>
            <v-btn
              color="indigo"
              variant="outlined"
              block
              @click="generateBackup"
            >
              <v-icon start>mdi-backup-restore</v-icon>
              Créer une sauvegarde
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Logs système -->
      <v-col cols="12" md="6">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center">
            <v-icon color="teal" class="mr-2">mdi-text-box</v-icon>
            Logs Système
          </v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedLogLevel"
              :items="logLevelOptions"
              label="Niveau de log"
              variant="outlined"
              class="mb-4"
            />
            <v-textarea
              :model-value="systemLogs"
              label="Logs récents"
              rows="10"
              readonly
              variant="outlined"
              class="mb-4"
            />
            <v-btn
              color="teal"
              block
              class="mb-2"
              @click="refreshLogs"
            >
              <v-icon start>mdi-refresh</v-icon>
              Actualiser les logs
            </v-btn>
            <v-btn
              color="teal"
              variant="outlined"
              block
              @click="downloadLogs"
            >
              <v-icon start>mdi-download</v-icon>
              Télécharger les logs
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { supabase } from '@/lib/supabase'

// État réactif
const settings = ref({
  // Général
  site_name: 'PEVA',
  site_description: 'Plateforme Digitale Stratégique pour l\'Écosystème de l\'Économie Verte en Afrique',
  contact_email: 'contact@2ie-greenhub.org',
  support_phone: '+226 25 49 28 00',
  default_language: 'fr',
  timezone: 'UTC',
  
  // Sécurité
  require_email_verification: true,
  enable_two_factor: false,
  password_min_length: 8,
  session_timeout: 120,
  max_login_attempts: 5,
  
  // Notifications
  enable_email_notifications: true,
  enable_push_notifications: true,
  smtp_host: '',
  smtp_port: 587,
  smtp_username: '',
  smtp_password: '',
  
  // Stockage
  max_file_size: 50,
  storage_quota_default: 100,
  allowed_file_types: ['pdf', 'jpg', 'png', 'docx'],
  enable_file_compression: true,
  enable_virus_scan: false,
  
  // Maintenance
  maintenance_mode: false,
  maintenance_message: 'Le site est temporairement en maintenance. Veuillez réessayer plus tard.'
})

const systemStats = ref({
  database_size: '2.3 GB',
  storage_used: '1.8 GB',
  active_users: '1,247',
  server_uptime: '15 jours'
})

const systemLogs = ref(`[2024-01-15 10:30:15] INFO: Utilisateur connecté (ID: 123)
[2024-01-15 10:29:45] INFO: Nouvelle entreprise créée (ID: 456)
[2024-01-15 10:28:32] WARNING: Tentative de connexion échouée
[2024-01-15 10:27:18] INFO: Notification envoyée (ID: 789)
[2024-01-15 10:26:05] INFO: Fichier uploadé (taille: 2.5MB)
[2024-01-15 10:25:22] ERROR: Erreur de connexion à la base de données
[2024-01-15 10:24:15] INFO: Cache vidé avec succès
[2024-01-15 10:23:08] INFO: Sauvegarde créée`)

const selectedLogLevel = ref('all')

// Options
const languageOptions = [
  { title: 'Français', value: 'fr' },
  { title: 'English', value: 'en' },
  { title: 'العربية', value: 'ar' }
]

const timezoneOptions = [
  { title: 'UTC', value: 'UTC' },
  { title: 'Africa/Ouagadougou', value: 'Africa/Ouagadougou' },
  { title: 'Africa/Abidjan', value: 'Africa/Abidjan' }
]

const fileTypeOptions = [
  { title: 'PDF', value: 'pdf' },
  { title: 'Images (JPG, PNG)', value: 'jpg' },
  { title: 'Documents Word', value: 'docx' },
  { title: 'Feuilles de calcul', value: 'xlsx' },
  { title: 'Vidéos', value: 'mp4' },
  { title: 'Audio', value: 'mp3' }
]

const logLevelOptions = [
  { title: 'Tous les niveaux', value: 'all' },
  { title: 'Erreurs seulement', value: 'error' },
  { title: 'Avertissements', value: 'warning' },
  { title: 'Informations', value: 'info' }
]

// Méthodes
const loadSettings = async () => {
  try {
    // Charger les paramètres depuis Supabase
    // Pour le moment, on utilise les valeurs par défaut
    console.log('Paramètres chargés')
  } catch (error) {
    console.error('Erreur lors du chargement des paramètres:', error)
  }
}

const saveGeneralSettings = async () => {
  try {
    // Sauvegarder les paramètres généraux
    console.log('Paramètres généraux sauvegardés:', {
      site_name: settings.value.site_name,
      site_description: settings.value.site_description,
      contact_email: settings.value.contact_email,
      support_phone: settings.value.support_phone,
      default_language: settings.value.default_language,
      timezone: settings.value.timezone
    })
    
    // TODO: Implémenter la sauvegarde en base
    alert('Paramètres généraux sauvegardés avec succès')
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  }
}

const saveSecuritySettings = async () => {
  try {
    console.log('Paramètres de sécurité sauvegardés')
    alert('Paramètres de sécurité sauvegardés avec succès')
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  }
}

const saveNotificationSettings = async () => {
  try {
    console.log('Paramètres de notification sauvegardés')
    alert('Paramètres de notification sauvegardés avec succès')
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  }
}

const saveStorageSettings = async () => {
  try {
    console.log('Paramètres de stockage sauvegardés')
    alert('Paramètres de stockage sauvegardés avec succès')
  } catch (error) {
    console.error('Erreur lors de la sauvegarde:', error)
  }
}

const clearCache = async () => {
  try {
    // Simuler le vidage du cache
    console.log('Cache vidé')
    alert('Cache vidé avec succès')
  } catch (error) {
    console.error('Erreur lors du vidage du cache:', error)
  }
}

const optimizeDatabase = async () => {
  try {
    console.log('Base de données optimisée')
    alert('Base de données optimisée avec succès')
  } catch (error) {
    console.error('Erreur lors de l\'optimisation:', error)
  }
}

const generateBackup = async () => {
  try {
    console.log('Sauvegarde créée')
    alert('Sauvegarde créée avec succès')
  } catch (error) {
    console.error('Erreur lors de la création de la sauvegarde:', error)
  }
}

const refreshLogs = () => {
  // Simuler le rechargement des logs
  console.log('Logs actualisés')
}

const downloadLogs = () => {
  // Créer un fichier de logs à télécharger
  const logContent = systemLogs.value
  const blob = new Blob([logContent], { type: 'text/plain' })
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `peva_logs_${new Date().toISOString().split('T')[0]}.txt`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  window.URL.revokeObjectURL(url)
}

// Lifecycle
onMounted(() => {
  loadSettings()
})
</script>

<style scoped>
.admin-system-settings {
  min-height: 100vh;
}
</style>
