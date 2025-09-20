import { Hono } from 'hono'

const app = new Hono()

// Directory main page
app.get('/', (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50 py-8">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900">Annuaire PEVA</h1>
          <p className="mt-2 text-gray-600">Découvrez les acteurs de l'économie verte en Afrique</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Filters Sidebar */}
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
                  <div className="relative">

                    <input
                      type="text"
                      placeholder="ex: Fatoumata Traoré, SolarBurkina, énergie solaire..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                      <i className="fas fa-search text-gray-400"></i>
                    </div>
                  </div>
                </div>

                {/* Profile Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type de profil</label>
                  <div className="space-y-2">

                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Entrepreneur (124)</span>
                    </label>
                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Investisseur (78)</span>
                    </label>
                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Expert (156)</span>
                    </label>
                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Organisation (89)</span>
                    </label>
                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Recruteur (34)</span>
                    </label>
                  </div>
                </div>

                {/* Country */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                  <select className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm">
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
                    <option value="DZ">🇩🇿 Algérie</option>
                  </select>
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
                      <span className="ml-2 text-sm text-gray-700">Gestion de l'Eau</span>
                    </label>
                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Transport Vert</span>
                    </label>
                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Construction Écologique</span>
                    </label>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-peva-green-600 hover:bg-peva-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-peva-green-500"
                >
                  <i className="fas fa-search mr-2"></i>
                  Appliquer les filtres
                </button>
              </form>
            </div>
          </div>

          {/* Results */}
          <div className="flex-1">

            {/* Results Header */}
            <div className="bg-white rounded-lg shadow p-4 mb-6">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">

                <div className="flex items-center space-x-4">

                  <span className="text-sm text-gray-700">

                    <strong>481</strong> profils trouvés
                  </span>
                  <div className="flex items-center space-x-2">

                    <button onclick="changerVueAffichage('grid')" data-view="grid"
                            className="view-button p-2 text-peva-green-600 bg-peva-green-50 rounded hover:bg-peva-green-100">

                      <i className="fas fa-th-large"></i>
                    </button>
                    <button onclick="changerVueAffichage('list')" data-view="list"
                            className="view-button p-2 text-gray-400 hover:text-peva-green-600 rounded hover:bg-peva-green-50">

                      <i className="fas fa-list"></i>
                    </button>
                    <button onclick="changerVueAffichage('map')" data-view="map"
                            className="view-button p-2 text-gray-400 hover:text-peva-green-600 rounded hover:bg-peva-green-50">

                      <i className="fas fa-map-marked-alt"></i>
                    </button>
                  </div>
                </div>
                <div className="mt-3 sm:mt-0">

                  <select className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm">

                    <option>Trier par pertinence</option>
                    <option>Nom (A-Z)</option>
                    <option>Nom (Z-A)</option>
                    <option>Pays</option>
                    <option>Date d'inscription</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Profile Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {/* Profile Card 1 */}
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200" data-user-id="user_001">

                <div className="p-6">

                  <div className="flex items-start space-x-4">

                    <div className="relative">

                      <div className="h-12 w-12 rounded-full bg-peva-green-100 flex items-center justify-center">
                        <span className="text-peva-green-600 font-semibold">FD</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full ring-2 ring-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">

                      <h3 className="text-lg font-medium text-gray-900 truncate">

                        <a href="/profile/user_001" className="hover:text-peva-green-600">Fatou Diallo</a>
                      </h3>
                      <p className="text-sm text-gray-600">Entrepreneure - Énergie Renouvelable</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">

                        <i className="fas fa-map-marker-alt mr-1"></i>
                        <span>Ouagadougou, Burkina Faso</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">

                      <button onclick="toggleFavoriteProfil('user_001', 'Fatou Diallo')"
                              className="text-gray-400 hover:text-red-500 transition-colors">

                        <i className="fas fa-heart"></i>
                      </button>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-700 line-clamp-2">

                    Entrepreneure spécialisée dans l'énergie solaire en Afrique de l'Ouest. 
                    Fondatrice de SolarTech Innovations.
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">

                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">

                      Énergie Solaire
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">

                      Innovation
                    </span>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">

                    <div className="flex space-x-2">

                      <button onclick="connecterUtilisateur('user_001', 'Fatou Diallo')"
                              class="connect-button inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-peva-green-600 hover:bg-peva-green-700">

                        <i className="fas fa-user-plus mr-1"></i>
                        Connecter
                      </button>
                      <button onclick="envoyerMessage('user_001', 'Fatou Diallo')"
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">

                        <i className="fas fa-envelope mr-1"></i>
                        Message
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <i className="fas fa-users mr-1"></i>
                      247
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Card 2 */}
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200" data-user-id="user_002">

                <div className="p-6">

                  <div className="flex items-start space-x-4">

                    <div className="relative">

                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-semibold">KA</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full ring-2 ring-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">

                      <h3 className="text-lg font-medium text-gray-900 truncate">

                        <a href="/profile/user_002" className="hover:text-peva-green-600">Kwame Asante</a>
                      </h3>
                      <p className="text-sm text-gray-600">Expert</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">

                        <i className="fas fa-map-marker-alt mr-1"></i>
                        <span>Accra, Ghana</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">

                      <button onclick="toggleFavoriteProfil('user_002', 'Kwame Asante')"
                              className="text-gray-400 hover:text-red-500 transition-colors">

                        <i className="fas fa-heart"></i>
                      </button>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-700 line-clamp-2">

                    Expert en agriculture durable et permaculture. 15 ans d'expérience 
                    en développement rural.
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">

                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">

                      Agriculture
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">

                      Eau
                    </span>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">

                    <div className="flex space-x-2">

                      <button onclick="connecterUtilisateur('user_002', 'Kwame Asante')"
                              class="connect-button inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-peva-green-600 hover:bg-peva-green-700">

                        <i className="fas fa-user-plus mr-1"></i>
                        Connecter
                      </button>
                      <button onclick="envoyerMessage('user_002', 'Kwame Asante')"
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">

                        <i className="fas fa-envelope mr-1"></i>
                        Message
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <i className="fas fa-users mr-1"></i>
                      189
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Card 3 */}
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200" data-user-id="user_003">

                <div className="p-6">

                  <div className="flex items-start space-x-4">

                    <div className="relative">

                      <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center">
                        <span className="text-purple-600 font-semibold">PD</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-yellow-400 rounded-full ring-2 ring-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">

                      <h3 className="text-lg font-medium text-gray-900 truncate">

                        <a href="/profile/user_003" className="hover:text-peva-green-600">Pierre Dubois</a>
                      </h3>
                      <p className="text-sm text-gray-600">Investisseur</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">

                        <i className="fas fa-map-marker-alt mr-1"></i>
                        <span>Paris, France</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">

                      <button onclick="toggleFavoriteProfil('user_003', 'Pierre Dubois')"
                              className="text-red-500 hover:text-red-600 transition-colors">

                        <i className="fas fa-heart"></i>
                      </button>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-700 line-clamp-2">

                    Investisseur impact spécialisé dans les solutions climatiques en Afrique. 
                    Managing Partner chez GreenFund Africa.
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">

                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">

                      Énergie
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">

                      Fintech
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">

                      Transport
                    </span>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">

                    <div className="flex space-x-2">

                      <button onclick="connecterUtilisateur('user_003', 'Pierre Dubois')"
                              class="connect-button inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-peva-green-600 hover:bg-peva-green-700">

                        <i className="fas fa-user-plus mr-1"></i>
                        Connecter
                      </button>
                      <button onclick="envoyerMessage('user_003', 'Pierre Dubois')"
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">

                        <i className="fas fa-envelope mr-1"></i>
                        Message
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <i className="fas fa-users mr-1"></i>
                      342
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Card 4 */}
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200" data-user-id="user_004">

                <div className="p-6">

                  <div className="flex items-start space-x-4">

                    <div className="relative">

                      <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                        <span className="text-orange-600 font-semibold">FD</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-400 rounded-full ring-2 ring-white"></div>
                    </div>
                    <div className="flex-1 min-w-0">

                      <h3 className="text-lg font-medium text-gray-900 truncate">

                        <a href="/profile/user_004" className="hover:text-peva-green-600">Fatou Diallo</a>
                      </h3>
                      <p className="text-sm text-gray-600">Investisseur</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">

                        <i className="fas fa-map-marker-alt mr-1"></i>
                        <span>Dakar, Sénégal</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">

                      <button onclick="toggleFavoriteProfil('user_004', 'Fatou Diallo (Dakar)')"
                              className="text-gray-400 hover:text-red-500 transition-colors">

                        <i className="fas fa-heart"></i>
                      </button>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-700 line-clamp-2">

                    Directrice Développement Durable chez EcoBank. Experte en financement 
                    vert et microfinance.
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">

                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">

                      Fintech
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">

                      Agriculture
                    </span>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">

                    <div className="flex space-x-2">

                      <button onclick="connecterUtilisateur('user_004', 'Fatou Diallo (Dakar)')"
                              class="connect-button inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-peva-green-600 hover:bg-peva-green-700">

                        <i className="fas fa-user-plus mr-1"></i>
                        Connecter
                      </button>
                      <button onclick="envoyerMessage('user_004', 'Fatou Diallo (Dakar)')"
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">

                        <i className="fas fa-envelope mr-1"></i>
                        Message
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <i className="fas fa-users mr-1"></i>
                      156
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

                    Affichage de <span className="font-medium">1</span> à <span className="font-medium">20</span> sur{' '}
                    <span className="font-medium">481</span> résultats
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    <a href="#" className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">

                      <i className="fas fa-chevron-left"></i>
                    </a>
                    <a href="#" className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-900">

                      1
                    </a>
                    <a href="#" className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">

                      2
                    </a>
                    <a href="#" className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">

                      3
                    </a>
                    <span className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700">

                      ...
                    </span>
                    <a href="#" className="relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50">

                      25
                    </a>
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
    </div>, { title: 'Annuaire - PEVA' }
  )
})

// Map view
app.get('/map', (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <div className="bg-white shadow-sm border-b p-4">

        <div className="max-w-7xl mx-auto flex items-center justify-between">

          <div className="flex items-center space-x-4">

            <h1 className="text-2xl font-bold text-gray-900">Carte Interactive</h1>
            <a href="/directory" className="text-peva-green-600 hover:text-peva-green-500 text-sm">

              <i className="fas fa-list mr-1"></i>
              Retour à la liste
            </a>
          </div>
          
          <div className="flex items-center space-x-4">

            {/* Quick filters */}
            <select className="border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 text-sm">

              <option value="">Tous les profils</option>
              <option value="entrepreneur">Entrepreneurs</option>
              <option value="investisseur">Investisseurs</option>
              <option value="expert">Experts</option>
              <option value="organisation">Organisations</option>
            </select>
            
            <select className="border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 text-sm">
              <option value="">Tous les pays</option>
              <option value="BF">🇧🇫 Burkina Faso</option>
              <option value="CI">🇨🇮 Côte d'Ivoire</option>
              <option value="SN">🇸🇳 Sénégal</option>
              <option value="ML">🇲🇱 Mali</option>
              <option value="NE">🇳🇪 Niger</option>
              <option value="TG">🇹🇬 Togo</option>
              <option value="BJ">🇧🇯 Bénin</option>
              <option value="GW">🇬🇼 Guinée-Bissau</option>
              <option value="GH">🇬🇭 Ghana</option>
              <option value="NG">🇳🇬 Nigeria</option>
              <option value="GN">🇬🇳 Guinée</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">

        {/* Map placeholder (would integrate with Leaflet/Mapbox) */}
        <div className="absolute inset-0 bg-gray-200 flex items-center justify-center">

          <div className="text-center">

            <i className="fas fa-map-marked-alt text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-900">Carte Interactive</h3>
            <p className="text-gray-500">La carte interactive serait intégrée ici avec Leaflet/Mapbox</p>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-md mx-auto">

              <div className="bg-white rounded-lg p-4 shadow">

                <div className="flex items-center space-x-2">

                  <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                  <span className="text-sm">Entrepreneurs (124)</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">

                <div className="flex items-center space-x-2">

                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-sm">Investisseurs (78)</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">

                <div className="flex items-center space-x-2">

                  <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                  <span className="text-sm">Experts (156)</span>
                </div>
              </div>
              <div className="bg-white rounded-lg p-4 shadow">

                <div className="flex items-center space-x-2">

                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span className="text-sm">Organisations (89)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Map Controls */}
        <div className="absolute top-4 left-4 space-y-2">

          <button className="bg-white p-2 rounded-md shadow hover:bg-gray-50">

            <i className="fas fa-plus text-gray-700"></i>
          </button>
          <button className="bg-white p-2 rounded-md shadow hover:bg-gray-50">

            <i className="fas fa-minus text-gray-700"></i>
          </button>
          <button className="bg-white p-2 rounded-md shadow hover:bg-gray-50">

            <i className="fas fa-location-arrow text-gray-700"></i>
          </button>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow p-4">

          <h4 className="font-medium text-gray-900 mb-2">Légende</h4>
          <div className="space-y-2">

            <div className="flex items-center space-x-2">

              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Entrepreneur</span>
            </div>
            <div className="flex items-center space-x-2">

              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Investisseur</span>
            </div>
            <div className="flex items-center space-x-2">

              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Expert</span>
            </div>
            <div className="flex items-center space-x-2">

              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-sm text-gray-700">Organisation</span>
            </div>
          </div>
        </div>

        {/* Search Box */}
        <div className="absolute top-4 right-4 w-80">

          <div className="bg-white rounded-lg shadow p-4">

            <div className="relative">

              <input
                type="text"
                placeholder="Rechercher par nom, ville ou secteur..."
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                <i className="fas fa-search text-gray-400"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>, { title: 'Carte Interactive - PEVA' }
  )
})

// Saved searches
app.get('/saved-searches', (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50 py-8">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900">Recherches Sauvegardées</h1>
          <p className="mt-2 text-gray-600">Gérez vos recherches et configurez des alertes</p>
        </div>

        {/* Create New Search Alert */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">

          <h2 className="text-lg font-semibold text-gray-900 mb-4">Créer une alerte</h2>
          <form className="space-y-4">

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <div>
                <label className="block text-sm font-medium text-gray-700">Nom de l'alerte</label>
                <input
                  type="text"
                  placeholder="Ex: Investisseurs énergie solaire Afrique"
                  className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Fréquence</label>
                <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm">

                  <option>Immédiat</option>
                  <option>Quotidien</option>
                  <option>Hebdomadaire</option>
                </select>
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-peva-green-600 hover:bg-peva-green-700"
            >
              <i className="fas fa-plus mr-2"></i>
              Créer l'alerte
            </button>
          </form>
        </div>

        {/* Saved Searches List */}
        <div className="space-y-4">

          {/* Saved Search Item */}
          <div className="bg-white rounded-lg shadow p-6">

            <div className="flex items-start justify-between">

              <div className="flex-1">

                <h3 className="text-lg font-medium text-gray-900">Entrepreneurs énergie solaire</h3>
                <p className="mt-1 text-sm text-gray-500">

                  Type: Entrepreneur • Secteur: Énergie Renouvelable • Pays: Côte d'Ivoire, Sénégal
                </p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">

                  <span>47 résultats</span>
                  <span>•</span>
                  <span>Alerte quotidienne</span>
                  <span>•</span>
                  <span>Dernière exécution: Il y a 2 heures</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">

                <button className="text-peva-green-600 hover:text-peva-green-500">

                  <i className="fas fa-play"></i>
                </button>
                <button className="text-gray-400 hover:text-gray-500">

                  <i className="fas fa-edit"></i>
                </button>
                <button className="text-red-400 hover:text-red-500">

                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Saved Search Item */}
          <div className="bg-white rounded-lg shadow p-6">

            <div className="flex items-start justify-between">

              <div className="flex-1">

                <h3 className="text-lg font-medium text-gray-900">Experts agriculture durable</h3>
                <p className="mt-1 text-sm text-gray-500">

                  Type: Expert • Secteur: Agriculture Durable • Tous pays
                </p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">

                  <span>23 résultats</span>
                  <span>•</span>
                  <span>Alerte hebdomadaire</span>
                  <span>•</span>
                  <span>Dernière exécution: Il y a 3 jours</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">

                <button className="text-peva-green-600 hover:text-peva-green-500">

                  <i className="fas fa-play"></i>
                </button>
                <button className="text-gray-400 hover:text-gray-500">

                  <i className="fas fa-edit"></i>
                </button>
                <button className="text-red-400 hover:text-red-500">

                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Saved Search Item */}
          <div className="bg-white rounded-lg shadow p-6">

            <div className="flex items-start justify-between">

              <div className="flex-1">

                <h3 className="text-lg font-medium text-gray-900">Investisseurs fintech verte</h3>
                <p className="mt-1 text-sm text-gray-500">

                  Type: Investisseur • Secteur: Fintech Verte • Pays: France
                </p>
                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">

                  <span>12 résultats</span>
                  <span>•</span>
                  <span>Alerte immédiate</span>
                  <span>•</span>
                  <span>Dernière exécution: Il y a 1 jour</span>
                </div>
              </div>
              <div className="flex items-center space-x-2">

                <button className="text-peva-green-600 hover:text-peva-green-500">

                  <i className="fas fa-play"></i>
                </button>
                <button className="text-gray-400 hover:text-gray-500">

                  <i className="fas fa-edit"></i>
                </button>
                <button className="text-red-400 hover:text-red-500">

                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>, { title: 'Recherches Sauvegardées - PEVA' }
  )
})

export default app