import { Hono } from 'hono'

const app = new Hono()

// Opportunities listing
app.get('/', (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50 py-8">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8">

          <div className="flex justify-between items-center">

            <div>
              <h1 className="text-3xl font-bold text-gray-900">Place de Marché des Opportunités</h1>
              <p className="mt-2 text-gray-600">Découvrez des opportunités de financement, emploi et partenariats</p>
            </div>
            <a 
              href="/opportunities/create" 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-peva-green-600 hover:bg-peva-green-700"
            >
              <i className="fas fa-plus mr-2"></i>
              Publier une opportunité
            </a>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Filters */}
          <div className="lg:w-80 flex-shrink-0">

            <div className="bg-white rounded-lg shadow p-6 sticky top-4">

              <div className="flex items-center justify-between mb-4">

                <h2 className="text-lg font-semibold text-gray-900">Filtres</h2>
                <button className="text-sm text-peva-green-600 hover:text-peva-green-500">

                  Réinitialiser
                </button>
              </div>

              <form className="space-y-6">

                {/* Search */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recherche</label>
                  <input
                    type="text"
                    placeholder="ex: financement BCEAO, développeur Ouagadougou, agriculture Sahel..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-500 focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                  />
                </div>

                {/* Opportunity Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type d'opportunité</label>
                  <div className="space-y-2">

                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Financement (47)</span>
                    </label>
                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Emploi (124)</span>
                    </label>
                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Partenariat (89)</span>
                    </label>
                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Mission (67)</span>
                    </label>
                  </div>
                </div>

                {/* Sectors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secteurs</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">

                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Énergie Renouvelable</span>
                    </label>
                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Agriculture Durable</span>
                    </label>
                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Fintech Verte</span>
                    </label>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Localisation</label>
                  <select className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm">
                    <option value="">Toutes les localisations</option>
                    
                    {/* Pays UEMOA (prioritaires) */}
                    <option>🇧🇫 Burkina Faso</option>
                    <option>🇨🇮 Côte d'Ivoire</option>
                    <option>🇸🇳 Sénégal</option>
                    <option>🇲🇱 Mali</option>
                    <option>🇳🇪 Niger</option>
                    <option>🇹🇬 Togo</option>
                    <option>🇧🇯 Bénin</option>
                    <option>🇬🇼 Guinée-Bissau</option>
                    
                    {/* Autres pays CEDEAO */}
                    <option>🇬🇭 Ghana</option>
                    <option>🇳🇬 Nigeria</option>
                    <option>🇬🇳 Guinée</option>
                    <option>🇱🇷 Libéria</option>
                    <option>🇸🇱 Sierra Leone</option>
                    <option>🇨🇻 Cap-Vert</option>
                    <option>🇬🇲 Gambie</option>
                  </select>
                </div>

                {/* Amount Range */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Montant</label>
                  <div className="grid grid-cols-2 gap-2">

                    <input
                      type="number"
                      placeholder="Min"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-peva-green-600 hover:bg-peva-green-700"
                >
                  Appliquer les filtres
                </button>
              </form>
            </div>
          </div>

          {/* Opportunities List */}
          <div className="flex-1">

            {/* Results Header */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center space-x-4">

                  <span className="text-sm text-gray-700">

                    <strong>327</strong> opportunités trouvées
                  </span>
                </div>
                <div className="mt-3 sm:mt-0">

                  <select className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm">

                    <option>Trier par pertinence</option>
                    <option>Date de publication</option>
                    <option>Montant (croissant)</option>
                    <option>Montant (décroissant)</option>
                    <option>Date limite</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Opportunity Cards */}
            <div className="space-y-6">

              {/* Opportunity Card 1 - Financement */}
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 border-l-4 border-blue-500">

                <div className="p-6">

                  <div className="flex items-start justify-between">

                    <div className="flex-1">

                      <div className="flex items-center space-x-2 mb-2">

                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">

                          <i className="fas fa-coins mr-1"></i>
                          Financement
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">

                          <i className="fas fa-clock mr-1"></i>
                          Urgent
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">

                        <a href="/opportunities/1" className="hover:text-peva-green-600">

                          Financement Série A - SolarTech Innovations
                        </a>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">

                        Recherche d'investisseurs pour lever 2M€ pour accélérer le déploiement de nos solutions 
                        d'énergie solaire abordables en Afrique de l'Ouest. Modèle économique prouvé, équipe expérimentée.
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">

                        <div className="flex items-center">

                          <i className="fas fa-euro-sign mr-1"></i>
                          <span className="font-medium">2M€</span>
                        </div>
                        <div className="flex items-center">

                          <i className="fas fa-map-marker-alt mr-1"></i>
                          <span>Abidjan, Côte d'Ivoire</span>
                        </div>
                        <div className="flex items-center">

                          <i className="fas fa-calendar mr-1"></i>
                          <span>Deadline: 31 Déc 2025</span>
                        </div>
                        <div className="flex items-center">

                          <i className="fas fa-users mr-1"></i>
                          <span>3 candidatures</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">

                        <div className="flex items-center space-x-2">

                          <img className="h-6 w-6 rounded-full" src="https://ui-avatars.com/api/?name=Ibrahim+Sawadogo&background=16a34a&color=fff" alt="Ibrahim" />
                          <span className="text-sm text-gray-700">Ibrahim Sawadogo</span>
                        </div>
                        <span className="text-sm text-gray-500">Il y a 2 jours</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">

                      <button className="text-gray-400 hover:text-red-500 transition-colors">

                        <i className="fas fa-bookmark"></i>
                      </button>
                      <button className="text-gray-400 hover:text-blue-500 transition-colors">

                        <i className="fas fa-share"></i>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">

                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">

                      Énergie Solaire
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">

                      Startup
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">

                      Impact Social
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">

                    <div className="flex space-x-3">

                      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-peva-green-600 hover:bg-peva-green-700">

                        <i className="fas fa-paper-plane mr-2"></i>
                        Postuler
                      </button>
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">

                        <i className="fas fa-info-circle mr-2"></i>
                        Détails
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">

                      <i className="fas fa-eye mr-1"></i>
                      247 vues
                    </div>
                  </div>
                </div>
              </div>

              {/* Opportunity Card 2 - Emploi */}
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 border-l-4 border-green-500">

                <div className="p-6">

                  <div className="flex items-start justify-between">

                    <div className="flex-1">

                      <div className="flex items-center space-x-2 mb-2">

                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">

                          <i className="fas fa-briefcase mr-1"></i>
                          Emploi
                        </span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">

                          <i className="fas fa-star mr-1"></i>
                          Featured
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">

                        <a href="/opportunities/2" className="hover:text-peva-green-600">

                          Développeur Full-Stack - Solutions Vertes
                        </a>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">

                        Recherche d'un développeur full-stack passionné par l'impact environnemental pour rejoindre 
                        notre équipe tech. Stack: React, Node.js, PostgreSQL, AWS.
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">

                        <div className="flex items-center">

                          <i className="fas fa-euro-sign mr-1"></i>
                          <span className="font-medium">45k€/an</span>
                        </div>
                        <div className="flex items-center">

                          <i className="fas fa-map-marker-alt mr-1"></i>
                          <span>Accra, Ghana</span>
                        </div>
                        <div className="flex items-center">

                          <i className="fas fa-calendar mr-1"></i>
                          <span>Deadline: 15 Oct 2025</span>
                        </div>
                        <div className="flex items-center">

                          <i className="fas fa-users mr-1"></i>
                          <span>8 candidatures</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">

                        <div className="flex items-center space-x-2">

                          <img className="h-6 w-6 rounded-full" src="https://via.placeholder.com/24" alt="Kwame" />
                          <span className="text-sm text-gray-700">Kwame Asante</span>
                        </div>
                        <span className="text-sm text-gray-500">Il y a 5 jours</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">

                      <button className="text-red-500 hover:text-red-600 transition-colors">

                        <i className="fas fa-bookmark"></i>
                      </button>
                      <button className="text-gray-400 hover:text-blue-500 transition-colors">

                        <i className="fas fa-share"></i>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">

                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">

                      React
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">

                      Node.js
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">

                      Agriculture
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">

                    <div className="flex space-x-3">

                      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-peva-green-600 hover:bg-peva-green-700">

                        <i className="fas fa-paper-plane mr-2"></i>
                        Postuler
                      </button>
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">

                        <i className="fas fa-info-circle mr-2"></i>
                        Détails
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">

                      <i className="fas fa-eye mr-1"></i>
                      156 vues
                    </div>
                  </div>
                </div>
              </div>

              {/* Opportunity Card 3 - Partenariat */}
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200 border-l-4 border-purple-500">

                <div className="p-6">

                  <div className="flex items-start justify-between">

                    <div className="flex-1">

                      <div className="flex items-center space-x-2 mb-2">

                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">

                          <i className="fas fa-handshake mr-1"></i>
                          Partenariat
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">

                        <a href="/opportunities/3" className="hover:text-peva-green-600">

                          Partenariat Distribution - Énergie Solaire
                        </a>
                      </h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">

                        Recherche de partenaires locaux pour la distribution de nos kits solaires dans les zones rurales. 
                        Opportunité de développer un réseau de distribution.
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-4">

                        <div className="flex items-center">

                          <i className="fas fa-handshake mr-1"></i>
                          <span className="font-medium">Commission</span>
                        </div>
                        <div className="flex items-center">

                          <i className="fas fa-map-marker-alt mr-1"></i>
                          <span>Dakar, Sénégal</span>
                        </div>
                        <div className="flex items-center">

                          <i className="fas fa-calendar mr-1"></i>
                          <span>Deadline: 30 Nov 2025</span>
                        </div>
                        <div className="flex items-center">

                          <i className="fas fa-users mr-1"></i>
                          <span>2 candidatures</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">

                        <div className="flex items-center space-x-2">

                          <img className="h-6 w-6 rounded-full" src="https://ui-avatars.com/api/?name=Ibrahim+Sawadogo&background=16a34a&color=fff" alt="Ibrahim" />
                          <span className="text-sm text-gray-700">Ibrahim Sawadogo</span>
                        </div>
                        <span className="text-sm text-gray-500">Il y a 1 semaine</span>
                      </div>
                    </div>
                    <div className="flex flex-col space-y-2 ml-4">

                      <button className="text-gray-400 hover:text-red-500 transition-colors">

                        <i className="fas fa-bookmark"></i>
                      </button>
                      <button className="text-gray-400 hover:text-blue-500 transition-colors">

                        <i className="fas fa-share"></i>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">

                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">

                      Énergie Solaire
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">

                      Distribution
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">

                      Rural
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">

                    <div className="flex space-x-3">

                      <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-peva-green-600 hover:bg-peva-green-700">

                        <i className="fas fa-paper-plane mr-2"></i>
                        Postuler
                      </button>
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">

                        <i className="fas fa-info-circle mr-2"></i>
                        Détails
                      </button>
                    </div>
                    <div className="text-sm text-gray-500">

                      <i className="fas fa-eye mr-1"></i>
                      89 vues
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-between bg-white px-4 py-3 rounded-lg shadow sm:px-6">

              <div className="flex flex-1 justify-between sm:hidden">

                <a href="#" className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">

                  Précédent
                </a>
                <a href="#" className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">

                  Suivant
                </a>
              </div>
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">

                <div>
                  <p className="text-sm text-gray-700">

                    Affichage de <span className="font-medium">1</span> à <span className="font-medium">15</span> sur{' '}
                    <span className="font-medium">327</span> résultats
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm">

                    <a href="#" className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">

                      <i className="fas fa-chevron-left"></i>
                    </a>
                    <a href="#" className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900">1</a>
                    <a href="#" className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">2</a>
                    <a href="#" className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">3</a>
                    <a href="#" className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">

                      <i className="fas fa-chevron-right"></i>
                    </a>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>, { title: 'Opportunités - PEVA' }
  )
})

// Create opportunity
app.get('/create', (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Publier une Opportunité</h1>
          <p className="mt-2 text-gray-600">Créez une nouvelle opportunité de financement, emploi, partenariat ou mission</p>
        </div>

        <div className="bg-white rounded-lg shadow">
          {/* Progress Steps */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center space-x-8">
                  <div id="step1-btn" className="flex items-center cursor-pointer">
                    <div id="step1-indicator" className="flex items-center justify-center w-8 h-8 bg-peva-green-600 text-white rounded-full text-sm font-medium">1</div>
                    <span id="step1-label" className="ml-2 text-sm font-medium text-peva-green-600">Informations de base</span>
                  </div>
                  <div id="step2-btn" className="flex items-center cursor-pointer">
                    <div id="step2-indicator" className="flex items-center justify-center w-8 h-8 bg-gray-300 text-gray-500 rounded-full text-sm font-medium">2</div>
                    <span id="step2-label" className="ml-2 text-sm font-medium text-gray-500">Détails spécifiques</span>
                  </div>
                  <div id="step3-btn" className="flex items-center cursor-pointer">
                    <div id="step3-indicator" className="flex items-center justify-center w-8 h-8 bg-gray-300 text-gray-500 rounded-full text-sm font-medium">3</div>
                    <span id="step3-label" className="ml-2 text-sm font-medium text-gray-500">Critères & Publication</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <form id="opportunityForm" className="p-6">
            
            {/* Step 1: Basic Information */}
            <div id="step1" className="step-content space-y-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">1. Informations de base</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Titre de l'opportunité *</label>
                  <input
                    id="title"
                    type="text"
                    required
                    placeholder="Ex: Financement Série A pour startup EdTech"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">100 caractères maximum</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type d'opportunité *</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <label className="relative flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="opportunity_type" value="financement" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300" />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <i className="fas fa-coins text-blue-500 mr-2"></i>
                          <span className="text-sm font-medium text-gray-900">Financement</span>
                        </div>
                        <span className="text-xs text-gray-500">Levée de fonds, investissement</span>
                      </div>
                    </label>
                    
                    <label className="relative flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="opportunity_type" value="emploi" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300" />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <i className="fas fa-briefcase text-green-500 mr-2"></i>
                          <span className="text-sm font-medium text-gray-900">Emploi</span>
                        </div>
                        <span className="text-xs text-gray-500">Poste, stage, mission</span>
                      </div>
                    </label>
                    
                    <label className="relative flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="opportunity_type" value="partenariat" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300" />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <i className="fas fa-handshake text-purple-500 mr-2"></i>
                          <span className="text-sm font-medium text-gray-900">Partenariat</span>
                        </div>
                        <span className="text-xs text-gray-500">Collaboration, alliance</span>
                      </div>
                    </label>
                    
                    <label className="relative flex items-center p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="radio" name="opportunity_type" value="mission" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300" />
                      <div className="ml-3">
                        <div className="flex items-center">
                          <i className="fas fa-tasks text-orange-500 mr-2"></i>
                          <span className="text-sm font-medium text-gray-900">Mission</span>
                        </div>
                        <span className="text-xs text-gray-500">Consulting, freelance</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Description courte *</label>
                  <textarea
                    id="description"
                    rows={3}
                    required
                    placeholder="Décrivez brièvement votre opportunité..."
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">300 caractères maximum - sera affiché dans la liste</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secteurs d'activité *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    <label className="flex items-center">
                      <input type="checkbox" name="sectors" value="energie" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Énergie Renouvelable</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="sectors" value="agriculture" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Agriculture Durable</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="sectors" value="eau" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Gestion de l'Eau</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="sectors" value="transport" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Transport Vert</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="sectors" value="fintech" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Fintech Verte</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" name="sectors" value="construction" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Construction Écologique</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Specific Details */}
            <div id="step2" className="step-content space-y-6" style={{display: 'none'}}>
              <h2 className="text-lg font-medium text-gray-900 mb-4">2. Détails spécifiques</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description complète *</label>
                  <textarea
                    rows={8}
                    required
                    placeholder="Décrivez en détail votre opportunité, les objectifs, les défis, les exigences..."
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Budget/Salaire</label>
                    <input
                      type="text"
                      placeholder="Ex: 500 000 - 2 000 000 FCFA CFA"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Localisation</label>
                    <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm">
                      <option>Sélectionner un pays</option>
                      
                      {/* Pays UEMOA (prioritaires) */}
                      <option>🇧🇫 Burkina Faso</option>
                      <option>🇨🇮 Côte d'Ivoire</option>
                      <option>🇸🇳 Sénégal</option>
                      <option>🇲🇱 Mali</option>
                      <option>🇳🇪 Niger</option>
                      <option>🇹🇬 Togo</option>
                      <option>🇧🇯 Bénin</option>
                      <option>🇬🇼 Guinée-Bissau</option>
                      
                      {/* Autres pays CEDEAO */}
                      <option>🇬🇭 Ghana</option>
                      <option>🇳🇬 Nigeria</option>
                      <option>🇬🇳 Guinée</option>
                      <option>🇱🇷 Libéria</option>
                      <option>🇸🇱 Sierra Leone</option>
                      <option>🇨🇻 Cap-Vert</option>
                      <option>🇬🇲 Gambie</option>
                      
                      {/* Autres pays africains */}
                      <option>🇰🇪 Kenya</option>
                      <option>🇲🇦 Maroc</option>
                      <option>🇿🇦 Afrique du Sud</option>
                      
                      <option>🌐 Télétravail</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Compétences requises</label>
                  <input
                    type="text"
                    placeholder="Ex: Business Development, Finance, Marketing Digital..."
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                  />
                  <p className="mt-1 text-sm text-gray-500">Séparez les compétences par des virgules</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Date limite</label>
                  <input
                    type="date"
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Step 3: Criteria & Publication */}
            <div id="step3" className="step-content space-y-6" style={{display: 'none'}}>
              <h2 className="text-lg font-medium text-gray-900 mb-4">3. Critères & Publication</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Contact</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="email"
                      placeholder="Email de contact"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                    />
                    <input
                      type="tel"
                      placeholder="Téléphone (optionnel)"
                      className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">Visibilité</label>
                  <div className="mt-2 space-y-2">
                    <label className="flex items-center">
                      <input type="radio" name="visibility" value="public" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300" />
                      <span className="ml-2 text-sm text-gray-700">Public - Visible par tous les membres</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="visibility" value="members" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300" />
                      <span className="ml-2 text-sm text-gray-700">Membres uniquement</span>
                    </label>
                    <label className="flex items-center">
                      <input type="radio" name="visibility" value="premium" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300" />
                      <span className="ml-2 text-sm text-gray-700">Membres Premium</span>
                    </label>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-3">Options de publication</h3>
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Promouvoir cette opportunité (Option Premium)</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Recevoir des notifications par email</span>
                    </label>
                    <label className="flex items-center">
                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Partager automatiquement sur les réseaux sociaux</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-6 border-t border-gray-200 mt-8">
              <div>
                <a href="/opportunities" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <i className="fas fa-arrow-left mr-2"></i>
                  Annuler
                </a>
              </div>
              <div className="flex space-x-3">
                <button type="button" id="prevBtn" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50" style={{display: 'none'}}>
                  <i className="fas fa-arrow-left mr-2"></i>
                  Précédent
                </button>
                <button type="button" className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  <i className="fas fa-save mr-2"></i>
                  Sauvegarder le brouillon
                </button>
                <button type="button" id="nextBtn" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-peva-green-600 hover:bg-peva-green-700">
                  <span id="nextBtnText">Continuer</span>
                  <i className="fas fa-arrow-right ml-2"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* JavaScript for step navigation */}
      <script dangerouslySetInnerHTML={{__html: `
        let currentStep = 1;
        const totalSteps = 3;

        function setStep(step) {
          if (step < 1 || step > totalSteps) return;
          
          // Hide all steps
          for (let i = 1; i <= totalSteps; i++) {
            document.getElementById('step' + i).style.display = 'none';
            
            // Reset step indicators
            const indicator = document.getElementById('step' + i + '-indicator');
            const label = document.getElementById('step' + i + '-label');
            
            if (i < step) {
              // Completed step
              indicator.className = 'flex items-center justify-center w-8 h-8 bg-peva-green-600 text-white rounded-full text-sm font-medium';
              label.className = 'ml-2 text-sm font-medium text-peva-green-600';
            } else if (i === step) {
              // Current step
              indicator.className = 'flex items-center justify-center w-8 h-8 bg-peva-green-600 text-white rounded-full text-sm font-medium';
              label.className = 'ml-2 text-sm font-medium text-peva-green-600';
            } else {
              // Future step
              indicator.className = 'flex items-center justify-center w-8 h-8 bg-gray-300 text-gray-500 rounded-full text-sm font-medium';
              label.className = 'ml-2 text-sm font-medium text-gray-500';
            }
          }
          
          // Show current step
          document.getElementById('step' + step).style.display = 'block';
          currentStep = step;
          
          // Update navigation buttons
          updateNavigationButtons();
        }

        function changeStep(direction) {
          if (direction > 0 && currentStep < totalSteps) {
            // Validate current step before proceeding
            if (validateCurrentStep()) {
              setStep(currentStep + 1);
            }
          } else if (direction < 0 && currentStep > 1) {
            setStep(currentStep - 1);
          }
        }

        function validateCurrentStep() {
          if (currentStep === 1) {
            const title = document.getElementById('title').value;
            const type = document.querySelector('input[name="opportunity_type"]:checked');
            const description = document.getElementById('description').value;
            const sectors = document.querySelectorAll('input[name="sectors"]:checked');
            
            if (!title || !type || !description || sectors.length === 0) {
              alert('Veuillez remplir tous les champs obligatoires de l\\'étape 1');
              return false;
            }
          }
          return true;
        }

        function updateNavigationButtons() {
          const prevBtn = document.getElementById('prevBtn');
          const nextBtn = document.getElementById('nextBtn');
          const nextBtnText = document.getElementById('nextBtnText');
          
          // Show/hide previous button
          prevBtn.style.display = currentStep === 1 ? 'none' : 'inline-flex';
          
          // Update next button text
          if (currentStep === totalSteps) {
            nextBtnText.textContent = 'Publier l\\'opportunité';
          } else {
            nextBtnText.textContent = 'Continuer';
          }
        }

        // Initialize when DOM is loaded
        document.addEventListener('DOMContentLoaded', function() {
          // Set up event listeners for step buttons
          document.getElementById('step1-btn').addEventListener('click', () => setStep(1));
          document.getElementById('step2-btn').addEventListener('click', () => setStep(2));
          document.getElementById('step3-btn').addEventListener('click', () => setStep(3));
          
          // Set up navigation buttons
          document.getElementById('prevBtn').addEventListener('click', () => changeStep(-1));
          document.getElementById('nextBtn').addEventListener('click', () => changeStep(1));
          
          // Initialize the form
          setStep(1);
        });
      `}} />
    </div>, { title: 'Créer une Opportunité - PEVA' }
  )
})

export default app