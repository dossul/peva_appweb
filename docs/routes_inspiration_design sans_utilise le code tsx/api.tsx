import { Hono } from 'hono'
import { cors } from 'hono/cors'

const api = new Hono()

// Enable CORS for all API routes
api.use('*', cors({
  origin: ['http://localhost:3000', 'https://*.pages.dev'],
  allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}))

// API Documentation endpoint
api.get('/', (c) => {
  return c.json({
    name: 'PEVA API',
    version: '1.0.0',
    description: 'API REST pour la Plateforme Économie Verte Afrique',
    documentation: '/api/docs',
    endpoints: {
      auth: '/api/auth/*',
      profiles: '/api/profiles/*',
      opportunities: '/api/opportunities/*',
      resources: '/api/resources/*',
      events: '/api/events/*',
      forum: '/api/forum/*',
      messages: '/api/messages/*',
      groups: '/api/groups/*',
      search: '/api/search/*',
      notifications: '/api/notifications/*'
    },
    status: 'active',
    timestamp: new Date().toISOString()
  })
})

// API Documentation
api.get('/docs', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="fr">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>PEVA API Documentation</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css" rel="stylesheet">
    </head>
    <body class="bg-gray-100">
        <div class="min-h-screen">
            <header class="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6">
                <div class="max-w-6xl mx-auto">
                    <h1 class="text-3xl font-bold mb-2">
                        <i class="fas fa-code mr-2"></i>
                        PEVA API Documentation
                    </h1>
                    <p class="text-blue-100">
                        API REST complète pour la Plateforme Économie Verte Afrique
                    </p>
                </div>
            </header>

            <div class="max-w-6xl mx-auto p-6">
                <div class="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Vue d'Ensemble</h2>
                    <p class="text-gray-700 mb-4">
                        L'API PEVA fournit un accès programmatique à toutes les fonctionnalités de la plateforme 
                        d'économie verte africaine. Toutes les réponses sont au format JSON et suivent les conventions REST.
                    </p>
                    
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div class="bg-blue-50 p-4 rounded-lg">
                            <h3 class="font-semibold text-blue-900 mb-2">Base URL</h3>
                            <code class="text-sm text-blue-700">https://your-domain.com/api</code>
                        </div>
                        <div class="bg-green-50 p-4 rounded-lg">
                            <h3 class="font-semibold text-green-900 mb-2">Format</h3>
                            <code class="text-sm text-green-700">JSON</code>
                        </div>
                        <div class="bg-purple-50 p-4 rounded-lg">
                            <h3 class="font-semibold text-purple-900 mb-2">Authentication</h3>
                            <code class="text-sm text-purple-700">Bearer Token</code>
                        </div>
                    </div>
                </div>

                <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    ${generateApiSection('Authentication', 'shield-alt', 'blue', [
                      { method: 'POST', path: '/auth/login', description: 'Connexion utilisateur' },
                      { method: 'POST', path: '/auth/register', description: 'Inscription utilisateur' },
                      { method: 'POST', path: '/auth/logout', description: 'Déconnexion' },
                      { method: 'POST', path: '/auth/refresh', description: 'Renouveler le token' }
                    ])}

                    ${generateApiSection('Profiles', 'user', 'green', [
                      { method: 'GET', path: '/profiles', description: 'Liste des profils' },
                      { method: 'GET', path: '/profiles/:id', description: 'Détail d\'un profil' },
                      { method: 'PUT', path: '/profiles/:id', description: 'Modifier un profil' },
                      { method: 'POST', path: '/profiles', description: 'Créer un profil' }
                    ])}

                    ${generateApiSection('Opportunities', 'briefcase', 'purple', [
                      { method: 'GET', path: '/opportunities', description: 'Liste des opportunités' },
                      { method: 'GET', path: '/opportunities/:id', description: 'Détail d\'une opportunité' },
                      { method: 'POST', path: '/opportunities', description: 'Créer une opportunité' },
                      { method: 'POST', path: '/opportunities/:id/apply', description: 'Postuler à une opportunité' }
                    ])}

                    ${generateApiSection('Events', 'calendar', 'orange', [
                      { method: 'GET', path: '/events', description: 'Liste des événements' },
                      { method: 'GET', path: '/events/:id', description: 'Détail d\'un événement' },
                      { method: 'POST', path: '/events', description: 'Créer un événement' },
                      { method: 'POST', path: '/events/:id/register', description: 'S\'inscrire à un événement' }
                    ])}

                    ${generateApiSection('Resources', 'book', 'red', [
                      { method: 'GET', path: '/resources', description: 'Liste des ressources' },
                      { method: 'GET', path: '/resources/:id', description: 'Détail d\'une ressource' },
                      { method: 'POST', path: '/resources', description: 'Ajouter une ressource' },
                      { method: 'GET', path: '/resources/:id/download', description: 'Télécharger une ressource' }
                    ])}

                    ${generateApiSection('Forum', 'comments', 'indigo', [
                      { method: 'GET', path: '/forum/topics', description: 'Liste des sujets' },
                      { method: 'GET', path: '/forum/topics/:id', description: 'Détail d\'un sujet' },
                      { method: 'POST', path: '/forum/topics', description: 'Créer un sujet' },
                      { method: 'POST', path: '/forum/topics/:id/replies', description: 'Répondre à un sujet' }
                    ])}
                </div>

                <div class="bg-white rounded-lg shadow p-6 mt-6">
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Codes de Réponse</h2>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <h3 class="font-semibold text-green-900 mb-2">Succès</h3>
                            <ul class="space-y-1 text-sm">
                                <li><code class="bg-green-100 text-green-800 px-2 py-1 rounded">200</code> OK - Succès</li>
                                <li><code class="bg-green-100 text-green-800 px-2 py-1 rounded">201</code> Created - Ressource créée</li>
                                <li><code class="bg-green-100 text-green-800 px-2 py-1 rounded">204</code> No Content - Suppression réussie</li>
                            </ul>
                        </div>
                        <div>
                            <h3 class="font-semibold text-red-900 mb-2">Erreurs</h3>
                            <ul class="space-y-1 text-sm">
                                <li><code class="bg-red-100 text-red-800 px-2 py-1 rounded">400</code> Bad Request - Requête invalide</li>
                                <li><code class="bg-red-100 text-red-800 px-2 py-1 rounded">401</code> Unauthorized - Non authentifié</li>
                                <li><code class="bg-red-100 text-red-800 px-2 py-1 rounded">403</code> Forbidden - Accès refusé</li>
                                <li><code class="bg-red-100 text-red-800 px-2 py-1 rounded">404</code> Not Found - Ressource non trouvée</li>
                                <li><code class="bg-red-100 text-red-800 px-2 py-1 rounded">500</code> Internal Error - Erreur serveur</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <script>
            function generateApiSection(title, icon, color, endpoints) {
              return \`
                <div class="bg-white rounded-lg shadow p-6">
                    <h3 class="text-lg font-semibold text-gray-900 mb-4">
                        <i class="fas fa-\${icon} mr-2 text-\${color}-600"></i>
                        \${title}
                    </h3>
                    <div class="space-y-2">
                        \${endpoints.map(endpoint => \`
                            <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                                <div class="flex items-center space-x-3">
                                    <span class="bg-\${getMethodColor(endpoint.method)}-100 text-\${getMethodColor(endpoint.method)}-800 text-xs font-mono px-2 py-1 rounded">
                                        \${endpoint.method}
                                    </span>
                                    <code class="text-sm text-gray-700">\${endpoint.path}</code>
                                </div>
                                <span class="text-sm text-gray-600">\${endpoint.description}</span>
                            </div>
                        \`).join('')}
                    </div>
                </div>
              \`;
            }

            function getMethodColor(method) {
              const colors = {
                'GET': 'blue',
                'POST': 'green', 
                'PUT': 'yellow',
                'DELETE': 'red',
                'PATCH': 'purple'
              };
              return colors[method] || 'gray';
            }
        </script>
    </body>
    </html>
  `)
})

// Authentication endpoints
api.post('/auth/login', (c) => {
  return c.json({
    success: true,
    message: 'Connexion réussie',
    data: {
      user: {
        id: 'user_123',
        email: 'user@example.com',
        name: 'Utilisateur Test',
        type: 'entrepreneur'
      },
      token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      refreshToken: 'refresh_token_example',
      expiresIn: 3600
    }
  })
})

api.post('/auth/register', (c) => {
  return c.json({
    success: true,
    message: 'Inscription réussie',
    data: {
      user: {
        id: 'user_new',
        email: 'newuser@example.com',
        name: 'Nouvel Utilisateur',
        type: 'entrepreneur',
        status: 'pending_verification'
      }
    }
  }, 201)
})

api.post('/auth/logout', (c) => {
  return c.json({
    success: true,
    message: 'Déconnexion réussie'
  })
})

api.post('/auth/refresh', (c) => {
  return c.json({
    success: true,
    data: {
      token: 'new_jwt_token_here',
      expiresIn: 3600
    }
  })
})

// Profile endpoints
api.get('/profiles', (c) => {
  const page = c.req.query('page') || '1'
  const limit = c.req.query('limit') || '10'
  const search = c.req.query('search') || ''
  const type = c.req.query('type') || ''
  const country = c.req.query('country') || ''

  return c.json({
    success: true,
    data: {
      profiles: [
        {
          id: 'prof_1',
          name: 'Amina Koné',
          email: 'amina.kone@example.com',
          type: 'entrepreneur',
          country: 'CI',
          bio: 'Entrepreneure spécialisée dans l\'énergie solaire',
          avatar_url: 'https://ui-avatars.com/api/?name=Amina+Kone',
          verified: true,
          created_at: '2024-01-15T10:30:00Z'
        },
        // ... more profiles
      ],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 1250,
        pages: 125
      },
      filters: { search, type, country }
    }
  })
})

api.get('/profiles/:id', (c) => {
  const profileId = c.req.param('id')
  
  return c.json({
    success: true,
    data: {
      profile: {
        id: profileId,
        name: 'Amina Koné',
        email: 'amina.kone@example.com',
        type: 'entrepreneur',
        country: 'CI',
        bio: 'Entrepreneure spécialisée dans l\'énergie solaire en Afrique de l\'Ouest',
        avatar_url: 'https://ui-avatars.com/api/?name=Amina+Kone',
        cover_url: null,
        verified: true,
        sectors: ['energie_renouvelable', 'agriculture_durable'],
        languages: ['fr', 'en'],
        socials: {
          linkedin: 'https://linkedin.com/in/aminakone',
          twitter: '@aminakone_ci'
        },
        stats: {
          connections: 245,
          posts: 67,
          resources_shared: 12
        },
        created_at: '2024-01-15T10:30:00Z',
        updated_at: '2024-03-15T14:20:00Z'
      }
    }
  })
})

api.put('/profiles/:id', (c) => {
  const profileId = c.req.param('id')
  
  return c.json({
    success: true,
    message: 'Profil mis à jour avec succès',
    data: {
      profile: {
        id: profileId,
        name: 'Amina Koné',
        // ... updated data
        updated_at: new Date().toISOString()
      }
    }
  })
})

// Opportunities endpoints
api.get('/opportunities', (c) => {
  const page = c.req.query('page') || '1'
  const limit = c.req.query('limit') || '10'
  const type = c.req.query('type') || ''
  const sector = c.req.query('sector') || ''
  const location = c.req.query('location') || ''

  return c.json({
    success: true,
    data: {
      opportunities: [
        {
          id: 'opp_1',
          title: 'Développeur Senior Energy Tech',
          type: 'emploi',
          sector: 'energie_renouvelable',
          organization: 'GreenTech Solutions',
          location: 'Ouagadougou, Burkina Faso',
          remote_allowed: true,
          budget_min: 80000,
          budget_max: 120000,
          currency: 'USD',
          description: 'Nous recherchons un développeur senior...',
          requirements: ['5+ ans d\'expérience', 'React/Node.js', 'Énergie solaire'],
          benefits: ['Télétravail', 'Formation continue', 'Impact environnemental'],
          application_deadline: '2024-04-15T23:59:59Z',
          created_at: '2024-03-01T09:00:00Z',
          applications_count: 23,
          views: 456,
          featured: true
        }
        // ... more opportunities
      ],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 89,
        pages: 9
      },
      filters: { type, sector, location }
    }
  })
})

api.get('/opportunities/:id', (c) => {
  const oppId = c.req.param('id')
  
  return c.json({
    success: true,
    data: {
      opportunity: {
        id: oppId,
        title: 'Développeur Senior Energy Tech',
        type: 'emploi',
        sector: 'energie_renouvelable',
        organization: {
          id: 'org_123',
          name: 'GreenTech Solutions',
          logo_url: 'https://ui-avatars.com/api/?name=GreenTech',
          verified: true
        },
        location: 'Ouagadougou, Burkina Faso',
        remote_allowed: true,
        budget_min: 80000,
        budget_max: 120000,
        currency: 'USD',
        description: 'Nous recherchons un développeur senior pour rejoindre notre équipe...',
        requirements: [
          '5+ ans d\'expérience en développement web',
          'Maîtrise de React, Node.js, TypeScript',
          'Expérience dans le secteur de l\'énergie renouvelable',
          'Anglais courant, français apprécié'
        ],
        benefits: [
          'Télétravail flexible',
          'Formation continue',
          'Impact environnemental positif',
          'Package santé complet'
        ],
        application_process: 'Envoyez CV + lettre de motivation',
        application_deadline: '2024-04-15T23:59:59Z',
        contact_email: 'jobs@greentech.com',
        created_at: '2024-03-01T09:00:00Z',
        updated_at: '2024-03-10T15:30:00Z',
        stats: {
          applications_count: 23,
          views: 456,
          saves: 67
        },
        featured: true,
        status: 'active'
      }
    }
  })
})

api.post('/opportunities', (c) => {
  return c.json({
    success: true,
    message: 'Opportunité créée avec succès',
    data: {
      opportunity: {
        id: 'opp_new',
        title: 'Nouvelle Opportunité',
        status: 'pending_review',
        created_at: new Date().toISOString()
      }
    }
  }, 201)
})

api.post('/opportunities/:id/apply', (c) => {
  const oppId = c.req.param('id')
  
  return c.json({
    success: true,
    message: 'Candidature envoyée avec succès',
    data: {
      application: {
        id: 'app_new',
        opportunity_id: oppId,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      }
    }
  }, 201)
})

// Events endpoints
api.get('/events', (c) => {
  const page = c.req.query('page') || '1'
  const limit = c.req.query('limit') || '10'
  const type = c.req.query('type') || ''
  const location = c.req.query('location') || ''
  const date_from = c.req.query('date_from') || ''
  const date_to = c.req.query('date_to') || ''

  return c.json({
    success: true,
    data: {
      events: [
        {
          id: 'evt_1',
          title: 'Intelligence Artificielle et Économie Verte en Afrique',
          type: 'conference',
          format: 'presentiel',
          start_date: '2024-03-25T09:00:00Z',
          end_date: '2024-03-25T17:00:00Z',
          timezone: 'WAT',
          location: {
            venue: 'Centre International de Conférences de Ouagadougou (CICO)',
            city: 'Ouagadougou',
            country: 'Burkina Faso',
            address: 'Avenue de la Nation, Zone du Bois'
          },
          description: 'Une journée dédiée à l\'exploration des applications de l\'IA...',
          organizer: {
            id: 'org_peva',
            name: 'PEVA',
            type: 'platform'
          },
          capacity: 280,
          registered_count: 245,
          price: 0,
          currency: 'USD',
          registration_required: true,
          registration_deadline: '2024-03-23T23:59:59Z',
          featured: true,
          status: 'active',
          created_at: '2024-02-15T10:00:00Z'
        }
        // ... more events
      ],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 67,
        pages: 7
      },
      filters: { type, location, date_from, date_to }
    }
  })
})

api.get('/events/:id', (c) => {
  const eventId = c.req.param('id')
  
  return c.json({
    success: true,
    data: {
      event: {
        id: eventId,
        title: 'Intelligence Artificielle et Économie Verte en Afrique',
        type: 'conference',
        category: 'innovation_tech',
        format: 'presentiel',
        start_date: '2024-03-25T09:00:00Z',
        end_date: '2024-03-25T17:00:00Z',
        timezone: 'WAT',
        location: {
          venue: 'Centre International de Conférences de Ouagadougou (CICO)',
          city: 'Ouagadougou',
          country: 'Burkina Faso',
          address: 'Avenue de la Nation, Zone du Bois',
          coordinates: {
            latitude: 12.3714,
            longitude: -1.5197
          }
        },
        description: 'Une journée dédiée à l\'exploration des applications de l\'IA dans les secteurs verts...',
        agenda: [
          {
            time: '09:00',
            title: 'Accueil et Café',
            description: 'Enregistrement des participants'
          },
          {
            time: '09:30',
            title: 'Conférence d\'ouverture',
            description: 'L\'IA au Service de l\'Afrique Verte',
            speaker: 'Dr. Amina Koné'
          }
        ],
        speakers: [
          {
            id: 'speaker_1',
            name: 'Dr. Amina Koné',
            title: 'Directrice Innovation, Green Tech Africa',
            bio: 'Experte en IA appliquée au développement durable',
            avatar_url: 'https://ui-avatars.com/api/?name=Dr.+Amina+Kone'
          }
        ],
        organizer: {
          id: 'org_peva',
          name: 'PEVA',
          type: 'platform',
          contact_email: 'events@peva.africa'
        },
        capacity: 280,
        registered_count: 245,
        price: 0,
        currency: 'USD',
        registration_required: true,
        registration_open: true,
        registration_deadline: '2024-03-23T23:59:59Z',
        requirements: 'Aucun prérequis technique',
        benefits: ['Certificat de participation', 'Networking', 'Supports de formation'],
        social_media: {
          hashtag: '#AIGreenAfrica2024',
          twitter: '@peva_events'
        },
        featured: true,
        status: 'active',
        created_at: '2024-02-15T10:00:00Z',
        updated_at: '2024-03-10T14:20:00Z'
      }
    }
  })
})

api.post('/events', (c) => {
  return c.json({
    success: true,
    message: 'Événement créé avec succès',
    data: {
      event: {
        id: 'evt_new',
        title: 'Nouvel Événement',
        status: 'pending_review',
        created_at: new Date().toISOString()
      }
    }
  }, 201)
})

api.post('/events/:id/register', (c) => {
  const eventId = c.req.param('id')
  
  return c.json({
    success: true,
    message: 'Inscription confirmée',
    data: {
      registration: {
        id: 'reg_new',
        event_id: eventId,
        status: 'confirmed',
        registered_at: new Date().toISOString(),
        ticket_number: 'PEVA-2024-001234'
      }
    }
  }, 201)
})

// Resources endpoints
api.get('/resources', (c) => {
  const page = c.req.query('page') || '1'
  const limit = c.req.query('limit') || '10'
  const type = c.req.query('type') || ''
  const sector = c.req.query('sector') || ''
  const level = c.req.query('level') || ''
  const free_only = c.req.query('free_only') || ''

  return c.json({
    success: true,
    data: {
      resources: [
        {
          id: 'res_1',
          title: 'Guide du Financement pour Startups Vertes',
          type: 'guide',
          sector: 'finance_verte',
          level: 'intermediaire',
          description: 'Un guide complet pour comprendre les différentes options de financement...',
          author: {
            id: 'auth_1',
            name: 'PEVA Team',
            type: 'platform'
          },
          language: 'fr',
          pages: 45,
          file_size: '8.5 MB',
          format: 'pdf',
          free: true,
          certified: true,
          download_count: 892,
          views: 2341,
          rating: 4.8,
          reviews_count: 156,
          tags: ['financement', 'startup', 'économie-verte'],
          created_at: '2024-02-01T10:00:00Z',
          updated_at: '2024-03-01T15:30:00Z'
        }
        // ... more resources
      ],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 234,
        pages: 24
      },
      filters: { type, sector, level, free_only }
    }
  })
})

api.get('/resources/:id', (c) => {
  const resourceId = c.req.param('id')
  
  return c.json({
    success: true,
    data: {
      resource: {
        id: resourceId,
        title: 'Guide du Financement pour Startups Vertes',
        type: 'guide',
        sector: 'finance_verte',
        level: 'intermediaire',
        description: 'Ce guide complet explore les différentes options de financement disponibles...',
        content_preview: 'Introduction à l\'écosystème de financement vert en Afrique...',
        author: {
          id: 'auth_1',
          name: 'PEVA Team',
          type: 'platform',
          bio: 'Équipe éditoriale de PEVA'
        },
        language: 'fr',
        pages: 45,
        file_size: '8.5 MB',
        format: 'pdf',
        free: true,
        certified: true,
        download_url: '/api/resources/res_1/download',
        external_url: null,
        cover_image_url: 'https://example.com/covers/guide-financement.jpg',
        table_of_contents: [
          'Introduction à l\'écosystème de financement vert',
          'Sources de financement traditionnelles',
          'Financement innovant et impact investing',
          'Préparer sa demande de financement',
          'Études de cas et success stories'
        ],
        stats: {
          download_count: 892,
          views: 2341,
          saves: 234,
          shares: 67
        },
        rating: 4.8,
        reviews_count: 156,
        tags: ['financement', 'startup', 'économie-verte', 'afrique'],
        related_resources: ['res_12', 'res_34', 'res_56'],
        created_at: '2024-02-01T10:00:00Z',
        updated_at: '2024-03-01T15:30:00Z'
      }
    }
  })
})

api.get('/resources/:id/download', (c) => {
  const resourceId = c.req.param('id')
  
  // In real implementation, this would stream the actual file
  return c.json({
    success: true,
    message: 'Téléchargement initié',
    data: {
      download_url: `https://cdn.peva.africa/resources/${resourceId}/file.pdf`,
      expires_at: new Date(Date.now() + 3600000).toISOString() // 1 hour
    }
  })
})

// Forum endpoints
api.get('/forum/topics', (c) => {
  const page = c.req.query('page') || '1'
  const limit = c.req.query('limit') || '10'
  const category = c.req.query('category') || ''
  const search = c.req.query('search') || ''
  const sort = c.req.query('sort') || 'recent'

  return c.json({
    success: true,
    data: {
      topics: [
        {
          id: 'topic_1',
          title: 'Conseils pour financer une startup solaire en Côte d\'Ivoire',
          category: 'finance_verte',
          type: 'question',
          author: {
            id: 'user_1',
            name: 'Amina Koné',
            avatar_url: 'https://ui-avatars.com/api/?name=Amina+Kone',
            type: 'entrepreneur'
          },
          content_preview: 'Bonjour la communauté PEVA ! Je lance une startup de panneaux solaires...',
          stats: {
            replies: 47,
            views: 2341,
            likes: 89,
            participants: 23
          },
          tags: ['startup', 'financement', 'solaire', 'côte-d\'ivoire'],
          pinned: false,
          solved: true,
          locked: false,
          created_at: '2024-03-12T10:00:00Z',
          updated_at: '2024-03-15T16:45:00Z',
          last_activity_at: '2024-03-15T16:45:00Z',
          last_reply_by: {
            id: 'user_expert',
            name: 'Sarah Okoye',
            avatar_url: 'https://ui-avatars.com/api/?name=Sarah+Okoye'
          }
        }
        // ... more topics
      ],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 1247,
        pages: 125
      },
      filters: { category, search, sort }
    }
  })
})

api.get('/forum/topics/:id', (c) => {
  const topicId = c.req.param('id')
  
  return c.json({
    success: true,
    data: {
      topic: {
        id: topicId,
        title: 'Conseils pour financer une startup solaire en Côte d\'Ivoire',
        category: 'finance_verte',
        type: 'question',
        author: {
          id: 'user_1',
          name: 'Amina Koné',
          avatar_url: 'https://ui-avatars.com/api/?name=Amina+Kone',
          type: 'entrepreneur',
          posts_count: 156
        },
        content: 'Bonjour la communauté PEVA ! Je lance une startup de panneaux solaires résidentiels...',
        stats: {
          replies: 47,
          views: 2341,
          likes: 89,
          participants: 23,
          subscribers: 67
        },
        tags: ['startup', 'financement', 'solaire', 'côte-d\'ivoire'],
        pinned: false,
        solved: true,
        locked: false,
        featured: false,
        created_at: '2024-03-12T10:00:00Z',
        updated_at: '2024-03-15T16:45:00Z'
      },
      replies: [
        {
          id: 'reply_1',
          author: {
            id: 'user_expert',
            name: 'Sarah Okoye',
            avatar_url: 'https://ui-avatars.com/api/?name=Sarah+Okoye',
            type: 'expert',
            verified: true
          },
          content: 'Salut Amina ! Excellente initiative, le marché solaire résidentiel en Côte d\'Ivoire...',
          best_answer: true,
          likes: 34,
          created_at: '2024-03-13T09:30:00Z',
          updated_at: '2024-03-13T09:30:00Z'
        }
        // ... more replies
      ]
    }
  })
})

// Search endpoints
api.get('/search', (c) => {
  const query = c.req.query('q') || ''
  const type = c.req.query('type') || 'all'
  const page = c.req.query('page') || '1'
  const limit = c.req.query('limit') || '10'

  return c.json({
    success: true,
    data: {
      query,
      results: {
        profiles: type === 'all' || type === 'profiles' ? [
          {
            id: 'prof_1',
            type: 'profile',
            name: 'Amina Koné',
            title: 'Entrepreneur - Énergie Solaire',
            avatar_url: 'https://ui-avatars.com/api/?name=Amina+Kone',
            location: 'Côte d\'Ivoire',
            relevance: 0.95
          }
        ] : [],
        opportunities: type === 'all' || type === 'opportunities' ? [
          {
            id: 'opp_1',
            type: 'opportunity',
            title: 'Développeur Senior Energy Tech',
            organization: 'GreenTech Solutions',
            location: 'Ouagadougou, Burkina Faso',
            opportunity_type: 'emploi',
            relevance: 0.87
          }
        ] : [],
        events: type === 'all' || type === 'events' ? [
          {
            id: 'evt_1',
            type: 'event',
            title: 'Intelligence Artificielle et Économie Verte',
            date: '2024-03-25',
            location: 'Ouagadougou, Burkina Faso',
            relevance: 0.82
          }
        ] : [],
        resources: type === 'all' || type === 'resources' ? [
          {
            id: 'res_1',
            type: 'resource',
            title: 'Guide du Financement pour Startups Vertes',
            author: 'PEVA Team',
            resource_type: 'guide',
            relevance: 0.79
          }
        ] : [],
        forum_topics: type === 'all' || type === 'forum' ? [
          {
            id: 'topic_1',
            type: 'forum_topic',
            title: 'Conseils pour financer une startup solaire',
            author: 'Amina Koné',
            category: 'finance_verte',
            relevance: 0.91
          }
        ] : []
      },
      stats: {
        total_results: 47,
        by_type: {
          profiles: 12,
          opportunities: 8,
          events: 5,
          resources: 15,
          forum_topics: 7
        }
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: 47,
        pages: 5
      }
    }
  })
})

// Error handler
api.notFound((c) => {
  return c.json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'Endpoint non trouvé',
      path: c.req.path
    }
  }, 404)
})

api.onError((err, c) => {
  console.error(err)
  return c.json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: 'Erreur interne du serveur',
      ...(process.env.NODE_ENV === 'development' && { details: err.message })
    }
  }, 500)
})

function generateApiSection(title: string, icon: string, color: string, endpoints: any[]) {
  return `
    <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">
            <i class="fas fa-${icon} mr-2 text-${color}-600"></i>
            ${title}
        </h3>
        <div class="space-y-2">
            ${endpoints.map(endpoint => `
                <div class="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                    <div class="flex items-center space-x-3">
                        <span class="bg-${getMethodColor(endpoint.method)}-100 text-${getMethodColor(endpoint.method)}-800 text-xs font-mono px-2 py-1 rounded">
                            ${endpoint.method}
                        </span>
                        <code class="text-sm text-gray-700">${endpoint.path}</code>
                    </div>
                    <span class="text-sm text-gray-600">${endpoint.description}</span>
                </div>
            `).join('')}
        </div>
    </div>
  `
}

function getMethodColor(method: string) {
  const colors: Record<string, string> = {
    'GET': 'blue',
    'POST': 'green', 
    'PUT': 'yellow',
    'DELETE': 'red',
    'PATCH': 'purple'
  }
  return colors[method] || 'gray'
}

export default api