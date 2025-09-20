import { Hono } from 'hono'
import { renderer } from '../renderer'

const admin = new Hono()

admin.use('*', renderer)

// Dashboard admin principal
admin.get('/', (c) => {
  return c.render(
    <div className="space-y-6">

      {/* En-tête Admin */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 rounded-lg">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold mb-2">

              <i className="fas fa-shield-alt mr-2"></i>
              Administration PEVA
            </h1>
            <p className="text-red-100">

              Tableau de bord administrateur - Gestion de la plateforme et modération
            </p>
          </div>
          <div className="flex items-center space-x-3">

            <span className="bg-white bg-opacity-20 px-3 py-2 rounded-lg text-sm">

              <i className="fas fa-clock mr-2"></i>
              Dernière connexion: Aujourd'hui 09:15
            </span>
            <button className="bg-white text-red-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">

              <i className="fas fa-cog mr-2"></i>
              Paramètres
            </button>
          </div>
        </div>
      </div>

      {/* Alertes et notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">

          <div className="flex items-center">

            <i className="fas fa-exclamation-triangle text-yellow-600 text-xl mr-3"></i>
            <div>
              <h3 className="font-medium text-yellow-800">Actions Requises</h3>
              <p className="text-sm text-yellow-700">12 éléments nécessitent une révision</p>
            </div>
          </div>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-lg p-4">

          <div className="flex items-center">

            <i className="fas fa-flag text-red-600 text-xl mr-3"></i>
            <div>
              <h3 className="font-medium text-red-800">Signalements</h3>
              <p className="text-sm text-red-700">3 nouveaux signalements à traiter</p>
            </div>
          </div>
        </div>
      </div>

      {/* Métriques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-blue-500">

          <div className="flex items-center">

            <i className="fas fa-users text-blue-600 text-3xl mr-4"></i>
            <div>
              <p className="text-sm text-gray-600">Utilisateurs Total</p>
              <p className="text-2xl font-bold text-gray-900">23,456</p>
              <p className="text-xs text-green-600">+5.2% ce mois</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-green-500">

          <div className="flex items-center">

            <i className="fas fa-user-plus text-green-600 text-3xl mr-4"></i>
            <div>
              <p className="text-sm text-gray-600">Nouveaux Membres</p>
              <p className="text-2xl font-bold text-gray-900">1,234</p>
              <p className="text-xs text-green-600">Cette semaine</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-purple-500">

          <div className="flex items-center">

            <i className="fas fa-comments text-purple-600 text-3xl mr-4"></i>
            <div>
              <p className="text-sm text-gray-600">Messages</p>
              <p className="text-2xl font-bold text-gray-900">89,567</p>
              <p className="text-xs text-green-600">+12% ce mois</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow border-l-4 border-orange-500">

          <div className="flex items-center">

            <i className="fas fa-flag text-orange-600 text-3xl mr-4"></i>
            <div>
              <p className="text-sm text-gray-600">Signalements</p>
              <p className="text-2xl font-bold text-gray-900">47</p>
              <p className="text-xs text-red-600">En attente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Admin */}
      <div className="bg-white rounded-lg shadow p-6">

        <h2 className="text-lg font-semibold text-gray-900 mb-6">Actions Rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <a href="/admin/users" className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">

            <div className="bg-blue-100 p-3 rounded-lg mr-4">

              <i className="fas fa-users text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Gestion Utilisateurs</h3>
              <p className="text-sm text-gray-600">Membres, rôles, permissions</p>
            </div>
          </a>

          <a href="/admin/moderation" className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">

            <div className="bg-red-100 p-3 rounded-lg mr-4">

              <i className="fas fa-gavel text-red-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Modération</h3>
              <p className="text-sm text-gray-600">Signalements, sanctions</p>
            </div>
          </a>

          <a href="/admin/content" className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">

            <div className="bg-green-100 p-3 rounded-lg mr-4">

              <i className="fas fa-file-alt text-green-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Gestion Contenu</h3>
              <p className="text-sm text-gray-600">Posts, ressources, événements</p>
            </div>
          </a>

          <a href="/admin/analytics" className="flex items-center p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">

            <div className="bg-purple-100 p-3 rounded-lg mr-4">

              <i className="fas fa-chart-line text-purple-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Analytics</h3>
              <p className="text-sm text-gray-600">Statistiques, rapports</p>
            </div>
          </a>
        </div>
      </div>

      {/* Activité récente et signalements */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Activité récente */}
        <div className="bg-white rounded-lg shadow p-6">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-lg font-semibold text-gray-900">

              <i className="fas fa-clock mr-2 text-blue-600"></i>
              Activité Récente
            </h2>
            <a href="/admin/activity" className="text-blue-600 hover:text-blue-700 text-sm font-medium">

              Voir tout →
            </a>
          </div>

          <div className="space-y-4">

            <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">

              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div className="flex-1">

                <p className="text-sm text-gray-900">

                  <strong>Nouvelle inscription:</strong> Marie Diop (Entrepreneure - Sénégal)
                </p>
                <p className="text-xs text-gray-600">il y a 5 minutes</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg">

              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div className="flex-1">

                <p className="text-sm text-gray-900">

                  <strong>Signalement:</strong> Contenu inapproprié dans le forum Énergie Solaire
                </p>
                <p className="text-xs text-gray-600">il y a 15 minutes</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-blue-50 rounded-lg">

              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div className="flex-1">

                <p className="text-sm text-gray-900">

                  <strong>Nouveau groupe:</strong> "Water Tech Innovation" créé par Ahmed Ben Ali
                </p>
                <p className="text-xs text-gray-600">il y a 1 heure</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-purple-50 rounded-lg">

              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div className="flex-1">

                <p className="text-sm text-gray-900">

                  <strong>Événement publié:</strong> "Workshop AgriTech" par Green Innovation Hub
                </p>
                <p className="text-xs text-gray-600">il y a 2 heures</p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">

              <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
              <div className="flex-1">

                <p className="text-sm text-gray-900">

                  <strong>Action modérateur:</strong> Utilisateur suspendu pour spam
                </p>
                <p className="text-xs text-gray-600">il y a 3 heures</p>
              </div>
            </div>
          </div>
        </div>

        {/* Signalements prioritaires */}
        <div className="bg-white rounded-lg shadow p-6">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-lg font-semibold text-gray-900">

              <i className="fas fa-flag mr-2 text-red-600"></i>
              Signalements Prioritaires
            </h2>
            <a href="/admin/moderation" className="text-red-600 hover:text-red-700 text-sm font-medium">

              Voir tout →
            </a>
          </div>

          <div className="space-y-4">

            <div className="border border-red-200 rounded-lg p-4">

              <div className="flex items-start justify-between mb-2">

                <div>
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">Urgent</span>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded ml-2">Contenu inapproprié</span>
                </div>
                <span className="text-xs text-gray-500">il y a 15min</span>
              </div>
              <p className="text-sm text-gray-900 mb-2">

                Post du forum contenant des propos offensants
              </p>
              <div className="flex items-center justify-between">

                <span className="text-xs text-gray-600">

                  Signalé par: 3 utilisateurs
                </span>
                <div className="space-x-2">

                  <button className="bg-red-600 text-white px-3 py-1 rounded text-xs hover:bg-red-700 transition-colors">

                    Traiter
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-yellow-200 rounded-lg p-4">

              <div className="flex items-start justify-between mb-2">

                <div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">Moyen</span>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded ml-2">Spam</span>
                </div>
                <span className="text-xs text-gray-500">il y a 1h</span>
              </div>
              <p className="text-sm text-gray-900 mb-2">

                Utilisateur envoyant des messages promotionnels en masse
              </p>
              <div className="flex items-center justify-between">

                <span className="text-xs text-gray-600">

                  Signalé par: 8 utilisateurs
                </span>
                <div className="space-x-2">

                  <button className="bg-yellow-600 text-white px-3 py-1 rounded text-xs hover:bg-yellow-700 transition-colors">

                    Traiter
                  </button>
                </div>
              </div>
            </div>

            <div className="border border-orange-200 rounded-lg p-4">

              <div className="flex items-start justify-between mb-2">

                <div>
                  <span className="bg-orange-100 text-orange-800 text-xs font-medium px-2 py-1 rounded">Normal</span>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded ml-2">Hors sujet</span>
                </div>
                <span className="text-xs text-gray-500">il y a 2h</span>
              </div>
              <p className="text-sm text-gray-900 mb-2">

                Discussion non liée à l'économie verte dans le forum
              </p>
              <div className="flex items-center justify-between">

                <span className="text-xs text-gray-600">

                  Signalé par: 2 utilisateurs
                </span>
                <div className="space-x-2">

                  <button className="bg-orange-600 text-white px-3 py-1 rounded text-xs hover:bg-orange-700 transition-colors">

                    Traiter
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Statistiques détaillées */}
      <div className="bg-white rounded-lg shadow p-6">

        <h2 className="text-lg font-semibold text-gray-900 mb-6">

          <i className="fas fa-chart-bar mr-2 text-purple-600"></i>
          Statistiques de la Plateforme
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {/* Utilisateurs */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Utilisateurs</h3>
            <div className="space-y-2">

              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-600">Entrepreneurs:</span>
                <span className="font-medium text-gray-900">12,345</span>
              </div>
              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-600">Investisseurs:</span>
                <span className="font-medium text-gray-900">3,456</span>
              </div>
              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-600">Experts:</span>
                <span className="font-medium text-gray-900">2,789</span>
              </div>
              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-600">Organisations:</span>
                <span className="font-medium text-gray-900">1,234</span>
              </div>
            </div>
          </div>

          {/* Contenu */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Contenu</h3>
            <div className="space-y-2">

              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-600">Posts forum:</span>
                <span className="font-medium text-gray-900">45,678</span>
              </div>
              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-600">Ressources:</span>
                <span className="font-medium text-gray-900">1,567</span>
              </div>
              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-600">Événements:</span>
                <span className="font-medium text-gray-900">789</span>
              </div>
              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-600">Opportunités:</span>
                <span className="font-medium text-gray-900">2,345</span>
              </div>
            </div>
          </div>

          {/* Activité */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Activité (7j)</h3>
            <div className="space-y-2">

              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-600">Connexions:</span>
                <span className="font-medium text-gray-900">15,678</span>
              </div>
              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-600">Messages:</span>
                <span className="font-medium text-gray-900">8,234</span>
              </div>
              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-600">Recherches:</span>
                <span className="font-medium text-gray-900">12,456</span>
              </div>
              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-600">Téléchargements:</span>
                <span className="font-medium text-gray-900">3,567</span>
              </div>
            </div>
          </div>

          {/* Modération */}
          <div>
            <h3 className="font-medium text-gray-900 mb-3">Modération (30j)</h3>
            <div className="space-y-2">

              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-600">Signalements:</span>
                <span className="font-medium text-gray-900">234</span>
              </div>
              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-600">Actions prises:</span>
                <span className="font-medium text-gray-900">189</span>
              </div>
              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-600">Utilisateurs suspendus:</span>
                <span className="font-medium text-red-600">12</span>
              </div>
              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-600">Contenu supprimé:</span>
                <span className="font-medium text-red-600">67</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

// Gestion des utilisateurs
admin.get('/users', (c) => {
  return c.render(
    <div className="space-y-6">

      {/* En-tête */}
      <div className="flex items-center justify-between">

        <h1 className="text-2xl font-bold text-gray-900">

          <i className="fas fa-users mr-2 text-blue-600"></i>
          Gestion des Utilisateurs
        </h1>
        <div className="flex items-center space-x-3">

          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">

            <i className="fas fa-user-plus mr-2"></i>
            Créer Utilisateur
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">

            <i className="fas fa-download mr-2"></i>
            Exporter
          </button>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-lg shadow p-6">

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">

          <div>
            <input type="text" placeholder="Rechercher un utilisateur..." 
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

          </div>
          <div>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">

              <option value="">Tous les types</option>
              <option value="entrepreneur">Entrepreneur</option>
              <option value="investisseur">Investisseur</option>
              <option value="expert">Expert</option>
              <option value="organisation">Organisation</option>
            </select>
          </div>
          <div>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">

              <option value="">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="pending">En attente</option>
              <option value="suspended">Suspendu</option>
              <option value="banned">Banni</option>
            </select>
          </div>
          <div>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="">Tous les pays</option>
              
              {/* Pays UEMOA (prioritaires) */}
              <option value="BF">🇧🇫 Burkina Faso</option>
              <option value="CI">🇨🇮 Côte d'Ivoire</option>
              <option value="SN">🇸🇳 Sénégal</option>
              <option value="ML">🇲🇱 Mali</option>
              <option value="NE">🇳🇪 Niger</option>
              <option value="TG">🇹🇬 Togo</option>
              <option value="BJ">🇧🇯 Bénin</option>
              <option value="GW">🇬🇼 Guinée-Bissau</option>
              
              {/* Autres pays CEDEAO */}
              <option value="GH">🇬🇭 Ghana</option>
              <option value="NG">🇳🇬 Nigeria</option>
              <option value="GN">🇬🇳 Guinée</option>
              <option value="LR">🇱🇷 Libéria</option>
              <option value="SL">🇸🇱 Sierra Leone</option>
              <option value="CV">🇨🇻 Cap-Vert</option>
              <option value="GM">🇬🇲 Gambie</option>
              
              {/* Autres pays africains */}
              <option value="KE">🇰🇪 Kenya</option>
              <option value="ZA">🇿🇦 Afrique du Sud</option>
              <option value="MA">🇲🇦 Maroc</option>
              <option value="TN">🇹🇳 Tunisie</option>
              <option value="EG">🇪🇬 Égypte</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table des utilisateurs */}
      <div className="bg-white rounded-lg shadow overflow-hidden">

        <div className="overflow-x-auto">

          <table className="w-full">

            <thead className="bg-gray-50">

              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                  Utilisateur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                  Pays
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                  Inscription
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">

                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">

              {/* Utilisateur 1 */}
              <tr className="hover:bg-gray-50">

                <td className="px-6 py-4 whitespace-nowrap">

                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">

                  <div className="flex items-center">

                    <img className="h-10 w-10 rounded-full" src="https://ui-avatars.com/api/?name=Amina+Kone&background=10b981&color=fff" alt="" />
                    <div className="ml-4">

                      <div className="text-sm font-medium text-gray-900">Amina Koné</div>
                      <div className="text-sm text-gray-500">amina.kone@example.com</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">

                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">

                    Entrepreneur
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">

                  Côte d'Ivoire
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">

                  15 Mars 2024
                </td>
                <td className="px-6 py-4 whitespace-nowrap">

                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">

                    Actif
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">

                  <div className="flex items-center space-x-2">

                    <button className="text-blue-600 hover:text-blue-900">Voir</button>
                    <button className="text-green-600 hover:text-green-900">Modifier</button>
                    <button className="text-red-600 hover:text-red-900">Suspendre</button>
                  </div>
                </td>
              </tr>

              {/* Autres utilisateurs */}
              {[...Array(9)].map((_, i) => (
                <tr key={i} className="hover:bg-gray-50">

                  <td className="px-6 py-4 whitespace-nowrap">

                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">

                    <div className="flex items-center">

                      <img className="h-10 w-10 rounded-full" src={`https://ui-avatars.com/api/?name=User+${i+2}&background=${i % 3 === 0 ? '3b82f6' : i % 3 === 1 ? 'f59e0b' : '8b5cf6'}&color=fff`} alt="" />
                      <div className="ml-4">

                        <div className="text-sm font-medium text-gray-900">

                          {i === 0 ? 'Ahmed Ben Ali' : i === 1 ? 'Sarah Okoye' : i === 2 ? 'Marie Diop' : `Utilisateur ${i+2}`}
                        </div>
                        <div className="text-sm text-gray-500">

                          {i === 0 ? 'ahmed@example.com' : i === 1 ? 'sarah@example.com' : i === 2 ? 'marie@example.com' : `user${i+2}@example.com`}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">

                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      i % 4 === 0 ? 'bg-green-100 text-green-800' :
                      i % 4 === 1 ? 'bg-purple-100 text-purple-800' :
                      i % 4 === 2 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-pink-100 text-pink-800'
                    }`}>
                      {i % 4 === 0 ? 'Investisseur' : i % 4 === 1 ? 'Expert' : i % 4 === 2 ? 'Organisation' : 'Entrepreneur'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">

                    {i % 5 === 0 ? 'Nigeria' : i % 5 === 1 ? 'Kenya' : i % 5 === 2 ? 'Ghana' : i % 5 === 3 ? 'Sénégal' : 'Maroc'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">

                    {i < 3 ? 'Aujourd\'hui' : i < 6 ? 'Hier' : 'Il y a 3 jours'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">

                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      i % 4 === 0 ? 'bg-green-100 text-green-800' :
                      i % 4 === 1 ? 'bg-yellow-100 text-yellow-800' :
                      i % 4 === 2 ? 'bg-red-100 text-red-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {i % 4 === 0 ? 'Actif' : i % 4 === 1 ? 'En attente' : i % 4 === 2 ? 'Suspendu' : 'Actif'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">

                    <div className="flex items-center space-x-2">

                      <button className="text-blue-600 hover:text-blue-900">Voir</button>
                      <button className="text-green-600 hover:text-green-900">Modifier</button>
                      <button className="text-red-600 hover:text-red-900">

                        {i % 4 === 2 ? 'Réactiver' : 'Suspendre'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">

          <div className="flex items-center justify-between">

            <div className="flex-1 flex justify-between sm:hidden">

              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">

                Précédent
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">

                Suivant
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">

              <div>
                <p className="text-sm text-gray-700">

                  Affichage <span className="font-medium">1</span> à <span className="font-medium">10</span> sur{' '}
                  <span className="font-medium">23,456</span> utilisateurs
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">

                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">

                    <i className="fas fa-chevron-left"></i>
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">

                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">

                    2
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">

                    3
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">

                    <i className="fas fa-chevron-right"></i>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

// Modération
admin.get('/moderation', (c) => {
  return c.render(
    <div className="space-y-6">

      {/* En-tête */}
      <div className="flex items-center justify-between">

        <h1 className="text-2xl font-bold text-gray-900">

          <i className="fas fa-gavel mr-2 text-red-600"></i>
          Centre de Modération
        </h1>
        <div className="flex items-center space-x-3">

          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent">

            <option value="all">Tous les signalements</option>
            <option value="urgent">Urgent</option>
            <option value="pending">En attente</option>
            <option value="resolved">Résolus</option>
          </select>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">

            <i className="fas fa-download mr-2"></i>
            Rapport
          </button>
        </div>
      </div>

      {/* Statistiques modération */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">

          <div className="flex items-center">

            <i className="fas fa-exclamation-triangle text-red-600 text-2xl mr-3"></i>
            <div>
              <p className="text-sm text-gray-600">Signalements Urgents</p>
              <p className="text-xl font-bold text-gray-900">3</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">

          <div className="flex items-center">

            <i className="fas fa-clock text-yellow-600 text-2xl mr-3"></i>
            <div>
              <p className="text-sm text-gray-600">En Attente</p>
              <p className="text-xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">

          <div className="flex items-center">

            <i className="fas fa-check text-green-600 text-2xl mr-3"></i>
            <div>
              <p className="text-sm text-gray-600">Résolus (7j)</p>
              <p className="text-xl font-bold text-gray-900">89</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">

          <div className="flex items-center">

            <i className="fas fa-user-slash text-blue-600 text-2xl mr-3"></i>
            <div>
              <p className="text-sm text-gray-600">Sanctions Actives</p>
              <p className="text-xl font-bold text-gray-900">15</p>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des signalements */}
      <div className="bg-white rounded-lg shadow">

        <div className="px-6 py-4 border-b border-gray-200">

          <h2 className="text-lg font-semibold text-gray-900">Signalements à Traiter</h2>
        </div>

        <div className="divide-y divide-gray-200">

          {/* Signalement urgent */}
          <div className="p-6 bg-red-50">

            <div className="flex items-start justify-between">

              <div className="flex-1">

                <div className="flex items-center space-x-3 mb-3">

                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">Urgent</span>
                  <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">Contenu inapproprié</span>
                  <span className="text-xs text-gray-500">Signalé il y a 15 minutes</span>
                </div>

                <h3 className="font-medium text-gray-900 mb-2">

                  Post contenant des propos offensants dans le forum Énergie Solaire
                </h3>

                <div className="bg-gray-100 p-3 rounded-lg mb-3">

                  <p className="text-sm text-gray-700 italic">

                    "Ce post contient des propos discriminatoires et offensants envers certains membres de la communauté..."
                  </p>
                </div>

                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">

                  <span><strong>Auteur:</strong> utilisateur_problematique</span>
                  <span><strong>Signalé par:</strong> 3 utilisateurs</span>
                  <span><strong>Catégorie:</strong> Forum &gt; Énergie Renouvelable</span>
                </div>
              </div>

              <div className="ml-6 flex flex-col space-y-2">

                <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm">

                  <i className="fas fa-trash mr-2"></i>
                  Supprimer
                </button>
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm">

                  <i className="fas fa-user-lock mr-2"></i>
                  Suspendre
                </button>
                <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm">

                  <i className="fas fa-eye mr-2"></i>
                  Examiner
                </button>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm">

                  <i className="fas fa-times mr-2"></i>
                  Rejeter
                </button>
              </div>
            </div>
          </div>

          {/* Autres signalements */}
          {[...Array(5)].map((_, i) => (
            <div key={i} className="p-6">

              <div className="flex items-start justify-between">

                <div className="flex-1">

                  <div className="flex items-center space-x-3 mb-3">

                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      i % 3 === 0 ? 'bg-yellow-100 text-yellow-800' :
                      i % 3 === 1 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {i % 3 === 0 ? 'Moyen' : i % 3 === 1 ? 'Normal' : 'Info'}
                    </span>
                    <span className="bg-gray-100 text-gray-800 text-xs font-medium px-2 py-1 rounded">

                      {i % 4 === 0 ? 'Spam' : i % 4 === 1 ? 'Hors sujet' : i % 4 === 2 ? 'Contenu dupliqué' : 'Informations incorrectes'}
                    </span>
                    <span className="text-xs text-gray-500">

                      Signalé il y a {i + 1}h
                    </span>
                  </div>

                  <h3 className="font-medium text-gray-900 mb-2">

                    {i === 0 ? 'Messages promotionnels répétés dans les groupes' :
                     i === 1 ? 'Discussion politique dans le forum technique' :
                     i === 2 ? 'Contenu identique posté plusieurs fois' :
                     i === 3 ? 'Informations techniques incorrectes partagées' :
                     'Comportement inapproprié en messagerie'}
                  </h3>

                  <div className="flex items-center space-x-6 text-sm text-gray-600">

                    <span><strong>Auteur:</strong> utilisateur_{i + 5}</span>
                    <span><strong>Signalé par:</strong> {Math.floor(Math.random() * 5) + 1} utilisateur(s)</span>
                    <span><strong>Type:</strong> {i % 3 === 0 ? 'Messages' : i % 3 === 1 ? 'Forum' : 'Ressources'}</span>
                  </div>
                </div>

                <div className="ml-6 flex flex-col space-y-2">

                  <button className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors">

                    Traiter
                  </button>
                  <button className="text-gray-600 hover:text-gray-800 text-xs">

                    Détails
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
})

export default admin