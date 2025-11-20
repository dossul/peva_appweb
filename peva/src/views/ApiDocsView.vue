<template>
  <div class="api-docs-view">
    <!-- Header -->
    <v-app-bar color="primary" dark>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>mdi-arrow-left</v-icon>
      </v-btn>
      <v-toolbar-title>API & Développeurs</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn color="accent" href="#" target="_blank">
        <v-icon left>mdi-github</v-icon>
        GitHub
      </v-btn>
    </v-app-bar>

    <v-container fluid class="pa-6">
      <!-- Introduction -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-card>
            <v-card-text>
              <h1 class="text-h4 mb-4">API PEVA - Documentation Développeurs</h1>
              <p class="text-h6 mb-4">
                Intégrez les données et fonctionnalités de PEVA dans vos applications
              </p>
              <p class="text-body-1">
                L'API PEVA vous permet d'accéder aux données de la plateforme, de créer des intégrations 
                personnalisées et de développer des applications tierces. Cette documentation vous guide 
                à travers les différents endpoints disponibles.
              </p>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Informations API -->
      <v-row class="mb-6">
        <v-col cols="12" md="4">
          <v-card color="primary" dark>
            <v-card-text>
              <div class="text-center">
                <v-icon size="48" class="mb-2">mdi-api</v-icon>
                <div class="text-h6">Version API</div>
                <div class="text-h4">v1.0</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="success" dark>
            <v-card-text>
              <div class="text-center">
                <v-icon size="48" class="mb-2">mdi-server</v-icon>
                <div class="text-h6">Base URL</div>
                <div class="text-body-2">https://api.peva.africa/v1</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
        <v-col cols="12" md="4">
          <v-card color="info" dark>
            <v-card-text>
              <div class="text-center">
                <v-icon size="48" class="mb-2">mdi-key</v-icon>
                <div class="text-h6">Authentification</div>
                <div class="text-body-2">Bearer Token</div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- Navigation des sections -->
      <v-row class="mb-6">
        <v-col cols="12">
          <v-tabs v-model="activeTab" color="primary">
            <v-tab value="getting-started">Démarrage</v-tab>
            <v-tab value="authentication">Authentification</v-tab>
            <v-tab value="endpoints">Endpoints</v-tab>
            <v-tab value="examples">Exemples</v-tab>
            <v-tab value="sdks">SDKs</v-tab>
          </v-tabs>
        </v-col>
      </v-row>

      <!-- Contenu des onglets -->
      <v-row>
        <v-col cols="12">
          <!-- Démarrage -->
          <div v-if="activeTab === 'getting-started'">
            <v-card>
              <v-card-title>Guide de démarrage rapide</v-card-title>
              <v-card-text>
                <h3 class="text-h6 mb-3">1. Obtenir une clé API</h3>
                <p class="mb-4">
                  Pour utiliser l'API PEVA, vous devez d'abord obtenir une clé API depuis votre tableau de bord.
                </p>
                
                <h3 class="text-h6 mb-3">2. Faire votre première requête</h3>
                <v-code class="mb-4">
curl -H "Authorization: Bearer YOUR_API_KEY" \
     https://api.peva.africa/v1/companies
                </v-code>
                
                <h3 class="text-h6 mb-3">3. Gérer les réponses</h3>
                <p class="mb-4">
                  Toutes les réponses sont au format JSON avec une structure cohérente.
                </p>
                
                <v-alert type="info" class="mb-4">
                  <strong>Limite de taux:</strong> 1000 requêtes par heure par clé API
                </v-alert>
              </v-card-text>
            </v-card>
          </div>

          <!-- Authentification -->
          <div v-if="activeTab === 'authentication'">
            <v-card>
              <v-card-title>Authentification</v-card-title>
              <v-card-text>
                <h3 class="text-h6 mb-3">Bearer Token</h3>
                <p class="mb-4">
                  L'API PEVA utilise l'authentification par Bearer Token. Incluez votre token dans l'en-tête Authorization.
                </p>
                
                <v-code class="mb-4">
Authorization: Bearer YOUR_API_KEY
                </v-code>
                
                <h3 class="text-h6 mb-3">Obtenir un token</h3>
                <v-code class="mb-4">
POST /auth/token
Content-Type: application/json

{
  "email": "your@email.com",
  "password": "your_password"
}
                </v-code>
                
                <h3 class="text-h6 mb-3">Réponse</h3>
                <v-code class="mb-4">
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 3600
}
                </v-code>
              </v-card-text>
            </v-card>
          </div>

          <!-- Endpoints -->
          <div v-if="activeTab === 'endpoints'">
            <div class="mb-4">
              <v-text-field
                v-model="endpointSearch"
                label="Rechercher un endpoint..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                clearable
              ></v-text-field>
            </div>
            
            <v-expansion-panels multiple>
              <v-expansion-panel
                v-for="category in filteredEndpoints"
                :key="category.name"
              >
                <v-expansion-panel-title>
                  <v-icon class="mr-3">{{ category.icon }}</v-icon>
                  {{ category.name }}
                  <v-spacer></v-spacer>
                  <v-chip size="small">{{ category.endpoints.length }} endpoints</v-chip>
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  <div
                    v-for="endpoint in category.endpoints"
                    :key="endpoint.path"
                    class="mb-4"
                  >
                    <v-card variant="outlined">
                      <v-card-text>
                        <div class="d-flex align-center mb-2">
                          <v-chip
                            :color="getMethodColor(endpoint.method)"
                            size="small"
                            class="mr-3"
                          >
                            {{ endpoint.method }}
                          </v-chip>
                          <code class="text-h6">{{ endpoint.path }}</code>
                        </div>
                        <p class="text-body-2 mb-3">{{ endpoint.description }}</p>
                        
                        <v-divider class="mb-3"></v-divider>
                        
                        <h4 class="text-subtitle-1 mb-2">Exemple de requête:</h4>
                        <v-code class="mb-3">{{ endpoint.example }}</v-code>
                        
                        <h4 class="text-subtitle-1 mb-2">Réponse:</h4>
                        <v-code>{{ endpoint.response }}</v-code>
                      </v-card-text>
                    </v-card>
                  </div>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>

          <!-- Exemples -->
          <div v-if="activeTab === 'examples'">
            <v-row>
              <v-col
                v-for="example in codeExamples"
                :key="example.title"
                cols="12"
                md="6"
              >
                <v-card>
                  <v-card-title>
                    <v-icon class="mr-2">{{ example.icon }}</v-icon>
                    {{ example.title }}
                  </v-card-title>
                  <v-card-text>
                    <p class="mb-3">{{ example.description }}</p>
                    <v-code>{{ example.code }}</v-code>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn variant="text" @click="copyCode(example.code)">
                      <v-icon left>mdi-content-copy</v-icon>
                      Copier
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- SDKs -->
          <div v-if="activeTab === 'sdks'">
            <v-row>
              <v-col
                v-for="sdk in sdks"
                :key="sdk.name"
                cols="12"
                md="4"
              >
                <v-card>
                  <v-card-text class="text-center">
                    <v-icon :color="sdk.color" size="64" class="mb-4">
                      {{ sdk.icon }}
                    </v-icon>
                    <h3 class="text-h6 mb-2">{{ sdk.name }}</h3>
                    <p class="text-body-2 mb-4">{{ sdk.description }}</p>
                    <v-code class="mb-4">{{ sdk.install }}</v-code>
                  </v-card-text>
                  <v-card-actions>
                    <v-btn :color="sdk.color" block :href="sdk.github" target="_blank">
                      <v-icon left>mdi-github</v-icon>
                      Voir sur GitHub
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'ApiDocsView',
  setup() {
    const activeTab = ref('getting-started')
    const endpointSearch = ref('')

    const apiEndpoints = [
      {
        name: 'Entreprises',
        icon: 'mdi-domain',
        endpoints: [
          {
            method: 'GET',
            path: '/companies',
            description: 'Récupérer la liste des entreprises',
            example: 'curl -H "Authorization: Bearer TOKEN" https://api.peva.africa/v1/companies',
            response: '{\n  "data": [\n    {\n      "id": 1,\n      "name": "EcoTech Solutions",\n      "sector": "Technologies Propres"\n    }\n  ]\n}'
          },
          {
            method: 'POST',
            path: '/companies',
            description: 'Créer une nouvelle entreprise',
            example: 'curl -X POST -H "Authorization: Bearer TOKEN" -d \'{"name":"Ma Société"}\' https://api.peva.africa/v1/companies',
            response: '{\n  "data": {\n    "id": 123,\n    "name": "Ma Société",\n    "created_at": "2024-01-16T10:00:00Z"\n  }\n}'
          }
        ]
      },
      {
        name: 'Opportunités',
        icon: 'mdi-briefcase',
        endpoints: [
          {
            method: 'GET',
            path: '/opportunities',
            description: 'Récupérer les opportunités disponibles',
            example: 'curl -H "Authorization: Bearer TOKEN" https://api.peva.africa/v1/opportunities',
            response: '{\n  "data": [\n    {\n      "id": 1,\n      "title": "Financement projet solaire",\n      "type": "funding"\n    }\n  ]\n}'
          }
        ]
      },
      {
        name: 'Événements',
        icon: 'mdi-calendar',
        endpoints: [
          {
            method: 'GET',
            path: '/events',
            description: 'Récupérer les événements à venir',
            example: 'curl -H "Authorization: Bearer TOKEN" https://api.peva.africa/v1/events',
            response: '{\n  "data": [\n    {\n      "id": 1,\n      "title": "Conférence Énergie Verte",\n      "date": "2024-02-15"\n    }\n  ]\n}'
          }
        ]
      }
    ]

    const codeExamples = [
      {
        title: 'JavaScript/Node.js',
        icon: 'mdi-nodejs',
        description: 'Exemple d\'utilisation avec JavaScript',
        code: `const axios = require('axios');

const api = axios.create({
  baseURL: 'https://api.peva.africa/v1',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});

// Récupérer les entreprises
const companies = await api.get('/companies');
console.log(companies.data);`
      },
      {
        title: 'Python',
        icon: 'mdi-language-python',
        description: 'Exemple d\'utilisation avec Python',
        code: `import requests

headers = {
    'Authorization': 'Bearer YOUR_API_KEY'
}

# Récupérer les entreprises
response = requests.get(
    'https://api.peva.africa/v1/companies',
    headers=headers
)

companies = response.json()
print(companies)`
      },
      {
        title: 'PHP',
        icon: 'mdi-language-php',
        description: 'Exemple d\'utilisation avec PHP',
        code: `<?php
$headers = [
    'Authorization: Bearer YOUR_API_KEY',
    'Content-Type: application/json'
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, 'https://api.peva.africa/v1/companies');
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($ch);
$companies = json_decode($response, true);
curl_close($ch);
?>`
      },
      {
        title: 'cURL',
        icon: 'mdi-console',
        description: 'Exemples de commandes cURL',
        code: `# Récupérer les entreprises
curl -H "Authorization: Bearer YOUR_API_KEY" \\
     https://api.peva.africa/v1/companies

# Créer une entreprise
curl -X POST \\
     -H "Authorization: Bearer YOUR_API_KEY" \\
     -H "Content-Type: application/json" \\
     -d '{"name":"Ma Société","sector":"Tech"}' \\
     https://api.peva.africa/v1/companies`
      }
    ]

    const sdks = [
      {
        name: 'JavaScript SDK',
        icon: 'mdi-nodejs',
        color: 'yellow',
        description: 'SDK officiel pour JavaScript/Node.js',
        install: 'npm install @peva/sdk-js',
        github: 'https://github.com/peva-africa/sdk-js'
      },
      {
        name: 'Python SDK',
        icon: 'mdi-language-python',
        color: 'blue',
        description: 'SDK officiel pour Python',
        install: 'pip install peva-sdk',
        github: 'https://github.com/peva-africa/sdk-python'
      },
      {
        name: 'PHP SDK',
        icon: 'mdi-language-php',
        color: 'purple',
        description: 'SDK officiel pour PHP',
        install: 'composer require peva/sdk-php',
        github: 'https://github.com/peva-africa/sdk-php'
      }
    ]

    const filteredEndpoints = computed(() => {
      if (!endpointSearch.value) return apiEndpoints
      
      return apiEndpoints.filter(category =>
        category.name.toLowerCase().includes(endpointSearch.value.toLowerCase()) ||
        category.endpoints.some(endpoint =>
          endpoint.path.toLowerCase().includes(endpointSearch.value.toLowerCase()) ||
          endpoint.description.toLowerCase().includes(endpointSearch.value.toLowerCase())
        )
      )
    })

    const getMethodColor = (method) => {
      const colors = {
        'GET': 'success',
        'POST': 'primary',
        'PUT': 'warning',
        'DELETE': 'error'
      }
      return colors[method] || 'grey'
    }

    const copyCode = (code) => {
      navigator.clipboard.writeText(code)
      console.log('Code copié dans le presse-papiers')
    }

    return {
      activeTab,
      endpointSearch,
      apiEndpoints,
      codeExamples,
      sdks,
      filteredEndpoints,
      getMethodColor,
      copyCode
    }
  }
}
</script>

<style scoped>
.api-docs-view {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.v-code {
  background-color: #f5f5f5;
  padding: 16px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  white-space: pre-wrap;
  overflow-x: auto;
}
</style>
