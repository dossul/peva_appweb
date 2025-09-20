import { Hono } from 'hono'
import { renderer } from '../renderer'

const groups = new Hono()

groups.use('*', renderer)

// Page principale des groupes
groups.get('/', (c) => {
  return c.render(
    <div className="space-y-6">

      {/* En-tête Groups */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-700 text-white p-6 rounded-lg">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold mb-2">

              <i className="fas fa-users mr-2"></i>
              Communautés PEVA
            </h1>
            <p className="text-teal-100">

              Rejoignez des groupes thématiques et connectez-vous avec des professionnels de votre secteur
            </p>
          </div>
          <a href="/groups/create" className="bg-white text-teal-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">

            <i className="fas fa-plus mr-2"></i>
            Créer un Groupe
          </a>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">

          <div className="flex items-center">

            <i className="fas fa-layer-group text-blue-600 text-2xl mr-3"></i>
            <div>
              <p className="text-sm text-gray-600">Groupes actifs</p>
              <p className="text-xl font-bold text-gray-900">127</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">

          <div className="flex items-center">

            <i className="fas fa-user-friends text-green-600 text-2xl mr-3"></i>
            <div>
              <p className="text-sm text-gray-600">Total membres</p>
              <p className="text-xl font-bold text-gray-900">12,456</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">

          <div className="flex items-center">

            <i className="fas fa-comments text-purple-600 text-2xl mr-3"></i>
            <div>
              <p className="text-sm text-gray-600">Discussions cette semaine</p>
              <p className="text-xl font-bold text-gray-900">896</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">

          <div className="flex items-center">

            <i className="fas fa-calendar text-orange-600 text-2xl mr-3"></i>
            <div>
              <p className="text-sm text-gray-600">Événements programmés</p>
              <p className="text-xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation et filtres */}
      <div className="bg-white rounded-lg shadow p-6">

        <div className="flex items-center justify-between mb-6">

          <div className="flex items-center space-x-6">

            <button className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium">

              <i className="fas fa-th-large mr-2"></i>
              Tous les Groupes
            </button>
            <a href="/groups/my-groups" className="text-gray-600 hover:text-teal-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">

              <i className="fas fa-user mr-2"></i>
              Mes Groupes
            </a>
            <a href="/groups/recommended" className="text-gray-600 hover:text-teal-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">

              <i className="fas fa-star mr-2"></i>
              Recommandés
            </a>
            <a href="/groups/popular" className="text-gray-600 hover:text-teal-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">

              <i className="fas fa-fire mr-2"></i>
              Populaires
            </a>
          </div>

          <div className="flex items-center space-x-3">

            <div className="relative">

              <input type="text" placeholder="Rechercher un groupe..." 
                     className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-teal-500 focus:border-transparent">

              <option value="all">Toutes catégories</option>
              <option value="energie">Énergie Renouvelable</option>
              <option value="agriculture">Agriculture Durable</option>
              <option value="finance">Finance Verte</option>
              <option value="transport">Transport Vert</option>
              <option value="tech">Innovation & Tech</option>
            </select>
          </div>
        </div>

        {/* Filtres avancés */}
        <div className="flex flex-wrap gap-2 mb-4">

          <button className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm">Tous</button>
          <button className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors">Publics</button>
          <button className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors">Privés</button>
          <button className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors">Nouveaux</button>
          <button className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors">Actifs</button>
          <button className="bg-gray-100 text-gray-600 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors">Par pays</button>
        </div>
      </div>

      {/* Groupes recommandés */}
      <div className="bg-white rounded-lg shadow p-6">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-lg font-semibold text-gray-900">

            <i className="fas fa-star mr-2 text-yellow-500"></i>
            Groupes Recommandés pour Vous
          </h2>
          <a href="/groups/recommended" className="text-teal-600 hover:text-teal-700 text-sm font-medium">

            Voir tous →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Groupe recommandé 1 */}
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">

            <div className="flex items-start justify-between mb-4">

              <div className="flex items-center space-x-3">

                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center">

                  <i className="fas fa-solar-panel text-white text-lg"></i>
                </div>
                <div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">Recommandé</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-teal-600 transition-colors">

                <i className="far fa-bookmark"></i>
              </button>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2">

              <a href="/groups/solaire-afrique-ouest" className="hover:text-teal-600">

                Énergie Solaire Afrique de l'Ouest
              </a>
            </h3>

            <p className="text-sm text-gray-600 mb-4">

              Communauté dédiée au développement de l'énergie solaire en Afrique de l'Ouest. 
              Partage d'expériences, opportunités business et support technique.
            </p>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">

              <div className="flex items-center space-x-4">

                <span><i className="fas fa-users mr-1"></i>2,341 membres</span>
                <span><i className="fas fa-comments mr-1"></i>156 posts/semaine</span>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Public</span>
            </div>

            <div className="flex items-center justify-between">

              <div className="flex -space-x-2">

                <img className="w-6 h-6 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=User1&background=10b981&color=fff" alt="" />
                <img className="w-6 h-6 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=User2&background=3b82f6&color=fff" alt="" />
                <img className="w-6 h-6 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=User3&background=f59e0b&color=fff" alt="" />
                <span className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600">+5</span>
              </div>
              
              <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">

                Rejoindre
              </button>
            </div>
          </div>

          {/* Groupe recommandé 2 */}
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">

            <div className="flex items-start justify-between mb-4">

              <div className="flex items-center space-x-3">

                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">

                  <i className="fas fa-coins text-white text-lg"></i>
                </div>
                <div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">Recommandé</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-teal-600 transition-colors">

                <i className="far fa-bookmark"></i>
              </button>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2">

              <a href="/groups/fintech-verte-afrique" className="hover:text-teal-600">

                FinTech Verte Afrique
              </a>
            </h3>

            <p className="text-sm text-gray-600 mb-4">

              Innovation financière pour l'économie verte africaine. Blockchain, paiements carbone, 
              microfinance environnementale et nouvelles technologies.
            </p>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">

              <div className="flex items-center space-x-4">

                <span><i className="fas fa-users mr-1"></i>1,876 membres</span>
                <span><i className="fas fa-comments mr-1"></i>89 posts/semaine</span>
              </div>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Privé</span>
            </div>

            <div className="flex items-center justify-between">

              <div className="flex -space-x-2">

                <img className="w-6 h-6 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=User4&background=8b5cf6&color=fff" alt="" />
                <img className="w-6 h-6 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=User5&background=ef4444&color=fff" alt="" />
                <img className="w-6 h-6 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=User6&background=06b6d4&color=fff" alt="" />
                <span className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600">+12</span>
              </div>
              
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">

                Demander l'accès
              </button>
            </div>
          </div>

          {/* Groupe recommandé 3 */}
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">

            <div className="flex items-start justify-between mb-4">

              <div className="flex items-center space-x-3">

                <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center">

                  <i className="fas fa-seedling text-white text-lg"></i>
                </div>
                <div>
                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">Recommandé</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-teal-600 transition-colors">

                <i className="far fa-bookmark"></i>
              </button>
            </div>

            <h3 className="font-semibold text-gray-900 mb-2">

              <a href="/groups/agritech-innovation" className="hover:text-teal-600">

                AgriTech & Innovation
              </a>
            </h3>

            <p className="text-sm text-gray-600 mb-4">

              Technologies agricoles durables, IoT, drones, IA pour l'agriculture. 
              Startups, chercheurs et agriculteurs innovants se rencontrent ici.
            </p>

            <div className="flex items-center justify-between text-sm text-gray-600 mb-4">

              <div className="flex items-center space-x-4">

                <span><i className="fas fa-users mr-1"></i>3,124 membres</span>
                <span><i className="fas fa-comments mr-1"></i>234 posts/semaine</span>
              </div>
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Public</span>
            </div>

            <div className="flex items-center justify-between">

              <div className="flex -space-x-2">

                <img className="w-6 h-6 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=User7&background=f59e0b&color=fff" alt="" />
                <img className="w-6 h-6 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=User8&background=10b981&color=fff" alt="" />
                <img className="w-6 h-6 rounded-full border-2 border-white" src="https://ui-avatars.com/api/?name=User9&background=3b82f6&color=fff" alt="" />
                <span className="w-6 h-6 rounded-full border-2 border-white bg-gray-100 flex items-center justify-center text-xs text-gray-600">+8</span>
              </div>
              
              <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">

                Rejoindre
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Groupes par catégorie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Groupes populaires */}
        <div className="bg-white rounded-lg shadow p-6">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-lg font-semibold text-gray-900">

              <i className="fas fa-fire mr-2 text-orange-500"></i>
              Groupes Populaires
            </h2>
            <a href="/groups/popular" className="text-teal-600 hover:text-teal-700 text-sm font-medium">

              Voir tous →
            </a>
          </div>

          <div className="space-y-4">

            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">

              <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-red-500 rounded-lg flex items-center justify-center">

                <i className="fas fa-recycle text-white"></i>
              </div>
              <div className="flex-1">

                <h3 className="font-medium text-gray-900">Économie Circulaire Afrique</h3>
                <div className="flex items-center space-x-3 text-sm text-gray-600">

                  <span>4,567 membres</span>
                  <span>•</span>
                  <span>Public</span>
                  <span>•</span>
                  <span className="text-orange-600 font-medium">🔥 Tendance</span>
                </div>
              </div>
              <button className="text-teal-600 hover:text-teal-700 font-medium text-sm">

                Rejoindre
              </button>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">

              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-lg flex items-center justify-center">

                <i className="fas fa-charging-station text-white"></i>
              </div>
              <div className="flex-1">

                <h3 className="font-medium text-gray-900">Mobilité Électrique Afrique</h3>
                <div className="flex items-center space-x-3 text-sm text-gray-600">

                  <span>2,890 membres</span>
                  <span>•</span>
                  <span>Public</span>
                  <span>•</span>
                  <span className="text-green-600 font-medium">Actif</span>
                </div>
              </div>
              <button className="text-teal-600 hover:text-teal-700 font-medium text-sm">

                Rejoindre
              </button>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">

              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-teal-500 rounded-lg flex items-center justify-center">

                <i className="fas fa-leaf text-white"></i>
              </div>
              <div className="flex-1">

                <h3 className="font-medium text-gray-900">Entrepreneurs Verts</h3>
                <div className="flex items-center space-x-3 text-sm text-gray-600">

                  <span>6,123 membres</span>
                  <span>•</span>
                  <span>Public</span>
                  <span>•</span>
                  <span className="text-blue-600 font-medium">Très actif</span>
                </div>
              </div>
              <button className="text-teal-600 hover:text-teal-700 font-medium text-sm">

                Rejoindre
              </button>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">

              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center">

                <i className="fas fa-female text-white"></i>
              </div>
              <div className="flex-1">

                <h3 className="font-medium text-gray-900">Women in Green Tech</h3>
                <div className="flex items-center space-x-3 text-sm text-gray-600">

                  <span>1,987 membres</span>
                  <span>•</span>
                  <span>Privé</span>
                  <span>•</span>
                  <span className="text-purple-600 font-medium">Exclusif</span>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">

                Demander
              </button>
            </div>
          </div>
        </div>

        {/* Groupes récents */}
        <div className="bg-white rounded-lg shadow p-6">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-lg font-semibold text-gray-900">

              <i className="fas fa-plus-circle mr-2 text-green-500"></i>
              Nouveaux Groupes
            </h2>
            <a href="/groups/recent" className="text-teal-600 hover:text-teal-700 text-sm font-medium">

              Voir tous →
            </a>
          </div>

          <div className="space-y-4">

            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">

              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">

                <i className="fas fa-chart-line text-white"></i>
              </div>
              <div className="flex-1">

                <h3 className="font-medium text-gray-900">Carbon Trading Africa</h3>
                <div className="flex items-center space-x-3 text-sm text-gray-600">

                  <span>234 membres</span>
                  <span>•</span>
                  <span>Public</span>
                  <span>•</span>
                  <span className="text-green-600 font-medium">Nouveau</span>
                </div>
              </div>
              <button className="text-teal-600 hover:text-teal-700 font-medium text-sm">

                Rejoindre
              </button>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">

              <div className="w-10 h-10 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-lg flex items-center justify-center">

                <i className="fas fa-water text-white"></i>
              </div>
              <div className="flex-1">

                <h3 className="font-medium text-gray-900">Water Tech Innovation</h3>
                <div className="flex items-center space-x-3 text-sm text-gray-600">

                  <span>156 membres</span>
                  <span>•</span>
                  <span>Public</span>
                  <span>•</span>
                  <span className="text-green-600 font-medium">Nouveau</span>
                </div>
              </div>
              <button className="text-teal-600 hover:text-teal-700 font-medium text-sm">

                Rejoindre
              </button>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">

              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-red-500 rounded-lg flex items-center justify-center">

                <i className="fas fa-city text-white"></i>
              </div>
              <div className="flex-1">

                <h3 className="font-medium text-gray-900">Smart Cities Africa</h3>
                <div className="flex items-center space-x-3 text-sm text-gray-600">

                  <span>89 membres</span>
                  <span>•</span>
                  <span>Privé</span>
                  <span>•</span>
                  <span className="text-green-600 font-medium">Nouveau</span>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">

                Demander
              </button>
            </div>

            <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">

              <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-green-500 rounded-lg flex items-center justify-center">

                <i className="fas fa-microscope text-white"></i>
              </div>
              <div className="flex-1">

                <h3 className="font-medium text-gray-900">Green Research Network</h3>
                <div className="flex items-center space-x-3 text-sm text-gray-600">

                  <span>67 membres</span>
                  <span>•</span>
                  <span>Privé</span>
                  <span>•</span>
                  <span className="text-green-600 font-medium">Nouveau</span>
                </div>
              </div>
              <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">

                Demander
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Groupes par pays */}
      <div className="bg-white rounded-lg shadow p-6">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-lg font-semibold text-gray-900">

            <i className="fas fa-globe-africa mr-2 text-blue-600"></i>
            Groupes par Pays
          </h2>
          <a href="/groups/by-country" className="text-teal-600 hover:text-teal-700 text-sm font-medium">

            Voir tous →
          </a>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">

            <div className="flex items-center space-x-3 mb-3">

              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white font-bold text-sm">

                🇳🇬
              </div>
              <h3 className="font-medium text-gray-900">Nigeria</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-1">

              <div>23 groupes actifs</div>
              <div>4,567 membres</div>
              <div className="text-green-600 font-medium">🔥 Très actif</div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">

            <div className="flex items-center space-x-3 mb-3">

              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center text-white font-bold text-sm">

                🇰🇪
              </div>
              <h3 className="font-medium text-gray-900">Kenya</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-1">

              <div>18 groupes actifs</div>
              <div>3,234 membres</div>
              <div className="text-blue-600 font-medium">Actif</div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">

            <div className="flex items-center space-x-3 mb-3">

              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center text-white font-bold text-sm">

                🇲🇦
              </div>
              <h3 className="font-medium text-gray-900">Maroc</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-1">

              <div>15 groupes actifs</div>
              <div>2,890 membres</div>
              <div className="text-blue-600 font-medium">Actif</div>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">

            <div className="flex items-center space-x-3 mb-3">

              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-600 flex items-center justify-center text-white font-bold text-sm">

                🇬🇭
              </div>
              <h3 className="font-medium text-gray-900">Ghana</h3>
            </div>
            <div className="text-sm text-gray-600 space-y-1">

              <div>12 groupes actifs</div>
              <div>1,967 membres</div>
              <div className="text-green-600 font-medium">En croissance</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

// Page de création de groupe
groups.get('/create', (c) => {
  return c.render(
    <div className="max-w-4xl mx-auto">

      <div className="bg-white shadow rounded-lg">

        <div className="px-6 py-4 border-b border-gray-200">

          <h1 className="text-xl font-semibold text-gray-900">

            <i className="fas fa-plus-circle mr-2 text-teal-600"></i>
            Créer un Nouveau Groupe
          </h1>
          <p className="mt-1 text-sm text-gray-600">

            Créez votre propre communauté thématique et connectez des professionnels autour de vos centres d'intérêt
          </p>
        </div>

        <form className="px-6 py-6 space-y-8">

          {/* Informations de base */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de Base</h3>
            
            <div className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom du Groupe *</label>
                <input type="text" required
                       placeholder="Ex: Énergie Solaire Côte d'Ivoire"
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

                <p className="mt-1 text-xs text-gray-500">

                  Choisissez un nom clair et descriptif qui reflète le thème de votre groupe
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie Principale *</label>
                  <select required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">

                    <option value="">Sélectionner une catégorie</option>
                    <option value="energie_renouvelable">Énergie Renouvelable</option>
                    <option value="agriculture_durable">Agriculture Durable</option>
                    <option value="finance_verte">Finance Verte</option>
                    <option value="transport_vert">Transport Vert</option>
                    <option value="economie_circulaire">Économie Circulaire</option>
                    <option value="innovation_tech">Innovation & Tech</option>
                    <option value="politique_environnementale">Politique Environnementale</option>
                    <option value="formation_education">Formation & Éducation</option>
                    <option value="recherche_developpement">Recherche & Développement</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pays/Région de Focus</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                    <option value="">Toute l'Afrique</option>
                    <option value="cedeao_uemoa">CEDEAO/UEMOA</option>
                    <option value="afrique_ouest">Afrique de l'Ouest</option>
                    <option value="afrique_est">Afrique de l'Est</option>
                    <option value="afrique_centrale">Afrique Centrale</option>
                    <option value="afrique_nord">Afrique du Nord</option>
                    <option value="afrique_australe">Afrique Australe</option>
                    
                    {/* Pays UEMOA (prioritaires) */}
                    <option value="burkina_faso">🇧🇫 Burkina Faso</option>
                    <option value="cote_ivoire">🇨🇮 Côte d'Ivoire</option>
                    <option value="senegal">🇸🇳 Sénégal</option>
                    <option value="mali">🇲🇱 Mali</option>
                    <option value="niger">🇳🇪 Niger</option>
                    <option value="togo">🇹🇬 Togo</option>
                    <option value="benin">🇧🇯 Bénin</option>
                    <option value="guinee_bissau">🇬🇼 Guinée-Bissau</option>
                    
                    {/* Autres pays CEDEAO */}
                    <option value="ghana">🇬🇭 Ghana</option>
                    <option value="nigeria">🇳🇬 Nigeria</option>
                    <option value="guinee">🇬🇳 Guinée</option>
                    <option value="liberia">🇱🇷 Libéria</option>
                    <option value="sierra_leone">🇸🇱 Sierra Leone</option>
                    <option value="cap_vert">🇨🇻 Cap-Vert</option>
                    <option value="gambie">🇬🇲 Gambie</option>
                    
                    {/* Autres pays africains */}
                    <option value="kenya">🇰🇪 Kenya</option>
                    <option value="maroc">🇲🇦 Maroc</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description du Groupe *</label>
                <textarea rows="4" required
                          placeholder="Décrivez l'objectif de votre groupe, les sujets abordés, et le type de membres recherchés..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"></textarea>
                <p className="mt-1 text-xs text-gray-500">

                  Une description claire aide les membres potentiels à comprendre la valeur de votre groupe
                </p>
              </div>
            </div>
          </div>

          {/* Configuration du groupe */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Configuration et Visibilité</h3>
            
            <div className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Type de Groupe *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <label className="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">

                    <input type="radio" name="group_type" value="public" className="mt-1 text-teal-600 focus:ring-teal-500" />
                    <div className="ml-3">

                      <div className="font-medium text-gray-900">Public</div>
                      <div className="text-sm text-gray-600">

                        Visible par tous, n'importe qui peut rejoindre et voir le contenu
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-start p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">

                    <input type="radio" name="group_type" value="private" className="mt-1 text-teal-600 focus:ring-teal-500" />
                    <div className="ml-3">

                      <div className="font-medium text-gray-900">Privé</div>
                      <div className="text-sm text-gray-600">

                        Visible par tous, mais adhésion sur approbation des modérateurs
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Tags du Groupe</label>
                <input type="text" 
                       placeholder="solaire, installation, côte-d'ivoire, formation, business"
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

                <p className="mt-1 text-xs text-gray-500">

                  Séparez les tags par des virgules. Ils aideront les membres à trouver votre groupe
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Langue Principale</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">

                    <option value="fr">Français</option>
                    <option value="en">Anglais</option>
                    <option value="ar">Arabe</option>
                    <option value="pt">Portugais</option>
                    <option value="es">Espagnol</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Taille Cible</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent">

                    <option value="small">Petit (&lt; 100 membres)</option>
                    <option value="medium">Moyen (100-1000 membres)</option>
                    <option value="large">Grand (&gt; 1000 membres)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Image et personnalisation */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Image et Personnalisation</h3>
            
            <div className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo/Avatar du Groupe</label>
                <div className="flex items-center space-x-6">

                  <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">

                    <i className="fas fa-image text-gray-400 text-2xl"></i>
                  </div>
                  <div className="flex-1">

                    <input type="file" accept="image/*" 
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

                    <p className="mt-1 text-xs text-gray-500">

                      JPG, PNG (max. 2MB) - Recommandé: 400x400px
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image de Couverture (optionnelle)</label>
                <div className="border-2 border-gray-300 border-dashed rounded-lg p-6 text-center">

                  <input type="file" id="cover-upload" className="hidden" accept="image/*" />
                  <label for="cover-upload" className="cursor-pointer">

                    <i className="fas fa-image text-4xl text-gray-400 mb-2"></i>
                    <p className="text-sm text-gray-600">

                      Cliquez pour sélectionner une image de couverture
                    </p>
                    <p className="text-xs text-gray-500 mt-1">

                      JPG, PNG (max. 5MB) - Recommandé: 1200x400px
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Couleur Thématique</label>
                <div className="flex items-center space-x-3">

                  <input type="color" value="#14b8a6" 
                         className="w-12 h-8 border border-gray-300 rounded cursor-pointer" />

                  <span className="text-sm text-gray-600">Couleur principale pour l'identité visuelle du groupe</span>
                </div>
              </div>
            </div>
          </div>

          {/* Règles et modération */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Règles et Modération</h3>
            
            <div className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Règles du Groupe</label>
                <textarea rows="6" 
                          placeholder="1. Restez dans le sujet (énergie solaire en Côte d'Ivoire)&#10;2. Soyez respectueux et constructifs&#10;3. Pas de spam ou de contenu commercial non-sollicité&#10;4. Partagez vos expériences et aidez les autres&#10;5. Utilisez la fonction recherche avant de poser une question"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"></textarea>
                <p className="mt-1 text-xs text-gray-500">

                  Définissez des règles claires pour maintenir un environnement de qualité
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Co-Modérateurs (optionnel)</label>
                <div className="space-y-2">

                  <input type="text" 
                         placeholder="Nom d'utilisateur ou email du co-modérateur"
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent" />

                  <button type="button" className="text-teal-600 hover:text-teal-700 text-sm font-medium">

                    <i className="fas fa-plus mr-1"></i>
                    Ajouter un Co-Modérateur
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">

                  Invitez d'autres membres PEVA à vous aider dans la modération
                </p>
              </div>

              <div className="space-y-4">

                <h4 className="font-medium text-gray-900">Options de Modération</h4>
                
                <label className="flex items-center">

                  <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                  <span className="ml-2 text-sm text-gray-700">Approbation manuelle des nouveaux membres</span>
                </label>

                <label className="flex items-center">

                  <input type="checkbox" checked className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                  <span className="ml-2 text-sm text-gray-700">Modération des posts avant publication</span>
                </label>

                <label className="flex items-center">

                  <input type="checkbox" className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                  <span className="ml-2 text-sm text-gray-700">Permettre aux membres d'inviter d'autres personnes</span>
                </label>

                <label className="flex items-center">

                  <input type="checkbox" checked className="rounded border-gray-300 text-teal-600 focus:ring-teal-500" />
                  <span className="ml-2 text-sm text-gray-700">Notifications d'activité pour les modérateurs</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 pt-6">

            <div className="flex items-center justify-between">

              <div className="text-sm text-gray-600">

                <i className="fas fa-info-circle mr-2"></i>
                Votre groupe sera soumis à révision avant publication
              </div>
              <div className="flex items-center space-x-3">

                <a href="/groups" className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">

                  Annuler
                </a>
                <button type="submit" className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">

                  <i className="fas fa-plus mr-2"></i>
                  Créer le Groupe
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
})

// Page de détail d'un groupe
groups.get('/:id', (c) => {
  const groupId = c.req.param('id')
  
  return c.render(
    <div className="max-w-6xl mx-auto">

      {/* Header du groupe */}
      <div className="bg-white rounded-lg shadow overflow-hidden mb-6">

        {/* Image de couverture */}
        <div className="h-48 bg-gradient-to-r from-green-400 via-green-500 to-green-600 relative">

          <div className="absolute inset-0 bg-black bg-opacity-20"></div>
          <div className="absolute bottom-6 left-6 flex items-end space-x-4">

            <div className="w-20 h-20 bg-white rounded-lg shadow-lg flex items-center justify-center">

              <i className="fas fa-solar-panel text-green-600 text-2xl"></i>
            </div>
            <div className="text-white">

              <h1 className="text-2xl font-bold">Énergie Solaire Afrique de l'Ouest</h1>
              <div className="flex items-center space-x-4 mt-2">

                <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm">Public</span>
                <span className="flex items-center"><i className="fas fa-users mr-1"></i>2,341 membres</span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation et actions */}
        <div className="p-6 border-b border-gray-200">

          <div className="flex items-center justify-between">

            <div className="flex items-center space-x-6">

              <a href="/groups/solaire-afrique-ouest" className="text-teal-600 border-b-2 border-teal-600 pb-2 text-sm font-medium">

                <i className="fas fa-home mr-1"></i>Accueil
              </a>
              <a href="/groups/solaire-afrique-ouest/discussions" className="text-gray-600 hover:text-teal-600 pb-2 text-sm font-medium transition-colors">

                <i className="fas fa-comments mr-1"></i>Discussions
              </a>
              <a href="/groups/solaire-afrique-ouest/members" className="text-gray-600 hover:text-teal-600 pb-2 text-sm font-medium transition-colors">

                <i className="fas fa-users mr-1"></i>Membres
              </a>
              <a href="/groups/solaire-afrique-ouest/events" className="text-gray-600 hover:text-teal-600 pb-2 text-sm font-medium transition-colors">

                <i className="fas fa-calendar mr-1"></i>Événements
              </a>
              <a href="/groups/solaire-afrique-ouest/resources" className="text-gray-600 hover:text-teal-600 pb-2 text-sm font-medium transition-colors">

                <i className="fas fa-folder mr-1"></i>Ressources
              </a>
            </div>

            <div className="flex items-center space-x-3">

              <button className="text-gray-600 hover:text-teal-600 p-2 rounded-lg transition-colors" title="Partager">
                <i className="fas fa-share-alt"></i>
              </button>
              <button className="text-gray-600 hover:text-teal-600 p-2 rounded-lg transition-colors" title="Notifications">
                <i className="far fa-bell"></i>
              </button>
              <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors">

                <i className="fas fa-check mr-2"></i>
                Membre
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">

          {/* Message d'accueil */}
          <div className="bg-white rounded-lg shadow p-6">

            <h2 className="text-lg font-semibold text-gray-900 mb-4">

              <i className="fas fa-info-circle mr-2 text-teal-600"></i>
              À Propos de ce Groupe
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">

              Communauté dédiée au développement de l'énergie solaire en Afrique de l'Ouest. 
              Nous rassemblons entrepreneurs, installateurs, ingénieurs, investisseurs et passionnés 
              de l'énergie solaire pour partager des expériences, créer des opportunités business 
              et fournir un support technique mutuel.
            </p>

            <div className="flex flex-wrap gap-2 mb-4">

              <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">#solaire</span>
              <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">#afrique-ouest</span>
              <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">#installation</span>
              <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">#business</span>
              <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">#formation</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

              <div className="flex items-center text-gray-600">

                <i className="fas fa-calendar-plus mr-2"></i>
                Créé le 15 Janvier 2023
              </div>
              <div className="flex items-center text-gray-600">

                <i className="fas fa-comments mr-2"></i>
                156 discussions cette semaine
              </div>
              <div className="flex items-center text-gray-600">

                <i className="fas fa-map-marker-alt mr-2"></i>
                Afrique de l'Ouest
              </div>
            </div>
          </div>

          {/* Publication */}
          <div className="bg-white rounded-lg shadow p-6">

            <div className="flex items-start space-x-3 mb-4">

              <img src="https://ui-avatars.com/api/?name=You&background=3b82f6&color=fff" 
                   alt="Votre profil" className="w-10 h-10 rounded-full" />

              <div className="flex-1">

                <textarea rows="3" placeholder="Partagez vos dernières nouvelles, posez une question, ou démarrez une discussion..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"></textarea>
                <div className="flex items-center justify-between mt-3">

                  <div className="flex items-center space-x-4">

                    <button className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors">

                      <i className="fas fa-image"></i>
                      <span className="text-sm">Photo</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors">

                      <i className="fas fa-link"></i>
                      <span className="text-sm">Lien</span>
                    </button>
                    <button className="flex items-center space-x-2 text-gray-600 hover:text-teal-600 transition-colors">

                      <i className="fas fa-poll"></i>
                      <span className="text-sm">Sondage</span>
                    </button>
                  </div>
                  <button className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">

                    Publier
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Posts du groupe */}
          <div className="space-y-6">

            {/* Post épinglé */}
            <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">

              <div className="flex items-center space-x-2 mb-3">

                <i className="fas fa-thumbtack text-yellow-500"></i>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">Épinglé</span>
                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">Annonce</span>
              </div>
              
              <div className="flex items-start space-x-3">

                <img src="https://ui-avatars.com/api/?name=Admin&background=10b981&color=fff" 
                     alt="Admin" className="w-12 h-12 rounded-full" />

                <div className="flex-1">

                  <div className="flex items-center space-x-2 mb-2">

                    <h3 className="font-medium text-gray-900">Modérateur Groupe</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Admin</span>
                    <span className="text-sm text-gray-500">il y a 2 jours</span>
                  </div>
                  
                  <h4 className="font-semibold text-gray-900 mb-2">

                    📋 Règles et Guidelines du Groupe - À lire obligatoirement !
                  </h4>
                  
                  <p className="text-gray-700 mb-3">

                    Bienvenue dans notre communauté ! Pour maintenir un environnement de qualité, 
                    merci de respecter ces règles simples...
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600">

                    <button className="flex items-center space-x-1 hover:text-teal-600 transition-colors">

                      <i className="far fa-thumbs-up"></i>
                      <span>89</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-teal-600 transition-colors">

                      <i className="far fa-comment"></i>
                      <span>23 commentaires</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-teal-600 transition-colors">

                      <i className="fas fa-share"></i>
                      <span>Partager</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Post normal */}
            <div className="bg-white rounded-lg shadow p-6">

              <div className="flex items-start space-x-3">

                <img src="https://ui-avatars.com/api/?name=Amina+Kone&background=3b82f6&color=fff" 
                     alt="Amina Koné" className="w-12 h-12 rounded-full" />

                <div className="flex-1">

                  <div className="flex items-center space-x-2 mb-2">

                    <h3 className="font-medium text-gray-900">Amina Koné</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Entrepreneur</span>
                    <span className="text-sm text-gray-500">il y a 3 heures</span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">

                    Salut la communauté ! 👋 Je recherche des retours d'expérience sur les meilleurs 
                    fournisseurs de panneaux solaires pour le marché ivoirien. Budget 50-100kW pour 
                    installation industrielle. Des recommandations ?
                  </p>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">

                    <button className="flex items-center space-x-1 hover:text-teal-600 transition-colors">

                      <i className="far fa-thumbs-up"></i>
                      <span>12</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-teal-600 transition-colors">

                      <i className="far fa-comment"></i>
                      <span>8 commentaires</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-teal-600 transition-colors">

                      <i className="fas fa-share"></i>
                      <span>Partager</span>
                    </button>
                  </div>

                  {/* Commentaires */}
                  <div className="border-t border-gray-200 pt-4 space-y-3">

                    <div className="flex items-start space-x-3">

                      <img src="https://ui-avatars.com/api/?name=Ahmed&background=f59e0b&color=fff" 
                           alt="Ahmed" className="w-8 h-8 rounded-full" />

                      <div className="flex-1">

                        <div className="flex items-center space-x-2 mb-1">

                          <h4 className="font-medium text-gray-900 text-sm">Ahmed Ben Ali</h4>
                          <span className="text-xs text-gray-500">il y a 2h</span>
                        </div>
                        <p className="text-sm text-gray-700">

                          Salut Amina ! Je recommande fortement les panneaux JinkoSolar ou Canadian Solar. 
                          Excellente qualité/prix pour l'Afrique. J'ai fait une install de 80kW au Maroc l'année dernière. 
                          MP moi si tu veux plus de détails ! 👍
                        </p>
                        <button className="text-xs text-gray-500 hover:text-teal-600 mt-1">

                          <i className="far fa-thumbs-up mr-1"></i>4
                        </button>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">

                      <img src="https://ui-avatars.com/api/?name=Marie&background=8b5cf6&color=fff" 
                           alt="Marie" className="w-8 h-8 rounded-full" />

                      <div className="flex-1">

                        <div className="flex items-center space-x-2 mb-1">

                          <h4 className="font-medium text-gray-900 text-sm">Marie Diop</h4>
                          <span className="text-xs text-gray-500">il y a 1h</span>
                        </div>
                        <p className="text-sm text-gray-700">

                          Pour la Côte d'Ivoire spécifiquement, regarde du côté de SOLEKTRA. 
                          Ils ont un bureau local à Abidjan et font de l'excellent travail ! 🔥
                        </p>
                        <button className="text-xs text-gray-500 hover:text-teal-600 mt-1">

                          <i className="far fa-thumbs-up mr-1"></i>2
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Post avec image */}
            <div className="bg-white rounded-lg shadow p-6">

              <div className="flex items-start space-x-3">

                <img src="https://ui-avatars.com/api/?name=Kwame&background=10b981&color=fff" 
                     alt="Kwame" className="w-12 h-12 rounded-full" />

                <div className="flex-1">

                  <div className="flex items-center space-x-2 mb-2">

                    <h3 className="font-medium text-gray-900">Kwame Asante</h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Installateur</span>
                    <span className="text-sm text-gray-500">il y a 6 heures</span>
                  </div>
                  
                  <p className="text-gray-700 mb-3">

                    Installation terminée ! 25kW pour un hôtel à Accra. Système off-grid avec stockage batteries. 
                    Le client est ravi, économies immédiates de 70% sur sa facture électrique ! ⚡️
                  </p>
                  
                  <div className="bg-gray-100 rounded-lg p-4 mb-3">

                    <div className="flex items-center justify-center h-48 text-gray-500">

                      <div className="text-center">

                        <i className="fas fa-image text-4xl mb-2"></i>
                        <p>Photo de l'installation solaire</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6 text-sm text-gray-600">

                    <button className="flex items-center space-x-1 hover:text-teal-600 transition-colors">

                      <i className="far fa-thumbs-up"></i>
                      <span>34</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-teal-600 transition-colors">

                      <i className="far fa-comment"></i>
                      <span>15 commentaires</span>
                    </button>
                    <button className="flex items-center space-x-1 hover:text-teal-600 transition-colors">

                      <i className="fas fa-share"></i>
                      <span>Partager</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Statistiques du groupe */}
          <div className="bg-white rounded-lg shadow p-6">

            <h3 className="font-semibold text-gray-900 mb-4">Statistiques</h3>
            <div className="space-y-3">

              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-600">Membres:</span>
                <span className="font-semibold text-gray-900">2,341</span>
              </div>
              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-600">Posts cette semaine:</span>
                <span className="font-semibold text-gray-900">156</span>
              </div>
              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-600">Discussions actives:</span>
                <span className="font-semibold text-gray-900">89</span>
              </div>
              <div className="flex items-center justify-between">

                <span className="text-sm text-gray-600">Nouveaux membres (7j):</span>
                <span className="font-semibold text-gray-900">47</span>
              </div>
            </div>
          </div>

          {/* Modérateurs */}
          <div className="bg-white rounded-lg shadow p-6">

            <h3 className="font-semibold text-gray-900 mb-4">Modérateurs</h3>
            <div className="space-y-3">

              <div className="flex items-center space-x-3">

                <img src="https://ui-avatars.com/api/?name=Admin1&background=10b981&color=fff" 
                     alt="Admin" className="w-10 h-10 rounded-full" />

                <div>
                  <h4 className="font-medium text-gray-900">Dr. Solar Expert</h4>
                  <p className="text-sm text-gray-600">Fondateur • Expert</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">

                <img src="https://ui-avatars.com/api/?name=Mod1&background=3b82f6&color=fff" 
                     alt="Mod" className="w-10 h-10 rounded-full" />

                <div>
                  <h4 className="font-medium text-gray-900">Marie Diop</h4>
                  <p className="text-sm text-gray-600">Modérateur</p>
                </div>
              </div>
            </div>
          </div>

          {/* Événements du groupe */}
          <div className="bg-white rounded-lg shadow p-6">

            <div className="flex items-center justify-between mb-4">

              <h3 className="font-semibold text-gray-900">Événements à Venir</h3>
              <a href="/groups/solaire-afrique-ouest/events" className="text-teal-600 hover:text-teal-700 text-sm">

                Voir tous →
              </a>
            </div>
            
            <div className="space-y-3">

              <div className="border border-gray-200 rounded-lg p-3">

                <div className="flex items-center space-x-3 mb-2">

                  <div className="bg-teal-100 p-2 rounded">

                    <i className="fas fa-calendar text-teal-600"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Workshop Installation Solaire</h4>
                    <p className="text-xs text-gray-600">25 Mars • Abidjan</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">

                  <span className="text-xs text-gray-600">23 participants</span>
                  <button className="text-teal-600 hover:text-teal-700 text-xs font-medium">

                    S'inscrire
                  </button>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-3">

                <div className="flex items-center space-x-3 mb-2">

                  <div className="bg-blue-100 p-2 rounded">

                    <i className="fas fa-video text-blue-600"></i>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 text-sm">Webinaire Financement Vert</h4>
                    <p className="text-xs text-gray-600">28 Mars • En ligne</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">

                  <span className="text-xs text-gray-600">156 participants</span>
                  <button className="text-teal-600 hover:text-teal-700 text-xs font-medium">

                    S'inscrire
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Membres actifs */}
          <div className="bg-white rounded-lg shadow p-6">

            <div className="flex items-center justify-between mb-4">

              <h3 className="font-semibold text-gray-900">Membres Actifs</h3>
              <a href="/groups/solaire-afrique-ouest/members" className="text-teal-600 hover:text-teal-700 text-sm">

                Voir tous →
              </a>
            </div>
            
            <div className="space-y-3">

              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-3">

                  <img src={`https://ui-avatars.com/api/?name=Member${i}&background=${i % 2 === 0 ? '10b981' : '3b82f6'}&color=fff`} 
                       alt="Member" className="w-8 h-8 rounded-full" />

                  <div className="flex-1">

                    <h4 className="font-medium text-gray-900 text-sm">Membre Actif {i + 1}</h4>
                    <p className="text-xs text-gray-600">

                      {i === 0 ? 'Expert Solar' : i === 1 ? 'Entrepreneur' : i === 2 ? 'Installateur' : i === 3 ? 'Investisseur' : 'Consultant'}
                    </p>
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Ressources partagées */}
          <div className="bg-white rounded-lg shadow p-6">

            <div className="flex items-center justify-between mb-4">

              <h3 className="font-semibold text-gray-900">Ressources Partagées</h3>
              <a href="/groups/solaire-afrique-ouest/resources" className="text-teal-600 hover:text-teal-700 text-sm">

                Voir toutes →
              </a>
            </div>
            
            <div className="space-y-3">

              <div className="flex items-center space-x-3">

                <div className="bg-red-100 p-2 rounded">

                  <i className="fas fa-file-pdf text-red-600"></i>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">Guide Installation Solaire CI</h4>
                  <p className="text-xs text-gray-600">Par Expert Solar • 2.3k téléch.</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">

                <div className="bg-green-100 p-2 rounded">

                  <i className="fas fa-calculator text-green-600"></i>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">Calculateur Dimensionnement</h4>
                  <p className="text-xs text-gray-600">Par Marie D. • 1.8k téléch.</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">

                <div className="bg-blue-100 p-2 rounded">

                  <i className="fas fa-chart-line text-blue-600"></i>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 text-sm">Étude de Marché 2024</h4>
                  <p className="text-xs text-gray-600">Par Research Team • 967 vues</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default groups