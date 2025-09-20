import { Hono } from 'hono'

const app = new Hono()

// Page principale de l'annuaire des entreprises
app.get('/', (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50 py-8">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <i className="fas fa-building mr-3 text-blue-600"></i>
            Annuaire des Entreprises
          </h1>
          <p className="mt-2 text-gray-600">
            Découvrez les entreprises de l'économie verte en Afrique et consultez leurs rapports RSE
          </p>
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
                      placeholder="ex: SolarTech, Énergie solaire, Burkina Faso..."
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                      <i className="fas fa-search text-gray-400"></i>
                    </div>
                  </div>
                </div>

                {/* Company Size */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Taille d'entreprise</label>
                  <div className="space-y-2">

                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Startup (1-10)</span>
                    </label>
                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">PME (11-50)</span>
                    </label>
                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">ETI (51-250)</span>
                    </label>
                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">Grande entreprise (250+)</span>
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
                  </select>
                </div>

                {/* Sectors */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Secteurs</label>
                  <div className="space-y-2 max-h-48 overflow-y-auto">

                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">⚡ Énergie Renouvelable</span>
                    </label>
                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">🌱 Agriculture Durable</span>
                    </label>
                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">💧 Gestion de l'Eau</span>
                    </label>
                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">🚗 Transport Vert</span>
                    </label>
                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">🏗️ Construction Écologique</span>
                    </label>
                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">♻️ Gestion des Déchets</span>
                    </label>
                    <label className="flex items-center">

                      <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                      <span className="ml-2 text-sm text-gray-700">💳 Fintech Verte</span>
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

                    <strong>127</strong> entreprises trouvées
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
                    <option>Taille d'entreprise</option>
                    <option>Secteur d'activité</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Company Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

              {/* Company Card 1 */}
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200" data-company-id="company_001">

                <div className="p-6">

                  <div className="flex items-start space-x-4">

                    <div className="relative">

                      <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">ST</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-green-400 rounded-full ring-2 ring-white flex items-center justify-center">
                        <i className="fas fa-building text-xs text-white"></i>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">

                      <h3 className="text-lg font-medium text-gray-900 truncate">

                        <a href="/companies/solartech-innovations" className="hover:text-peva-green-600">SolarTech Innovations</a>
                      </h3>
                      <p className="text-sm text-gray-600">PME - Énergie Renouvelable</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">

                        <i className="fas fa-map-marker-alt mr-1"></i>
                        <span>Ouagadougou, Burkina Faso</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">

                      <button onclick="ajouterEntrepriseFavoris('company_001', 'SolarTech Innovations')"
                              className="text-gray-400 hover:text-yellow-500 transition-colors">

                        <i className="fas fa-star"></i>
                      </button>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-700 line-clamp-2">

                    Solutions d'énergie solaire pour les communautés rurales en Afrique de l'Ouest. 
                    Systèmes innovants et accessibles pour démocratiser l'énergie propre.
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">

                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">

                      ⚡ Énergie Solaire
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">

                      🌱 PME
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">

                      📊 3 Rapports RSE
                    </span>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">

                    <div className="flex space-x-2">

                      <button onclick="voirFicheEntreprise('company_001')"
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-peva-green-600 hover:bg-peva-green-700">

                        <i className="fas fa-eye mr-1"></i>
                        Voir la fiche
                      </button>
                      <button onclick="contacterEntreprise('company_001', 'SolarTech Innovations')"
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">

                        <i className="fas fa-envelope mr-1"></i>
                        Contacter
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <i className="fas fa-users mr-1"></i>
                      45 employés
                    </div>
                  </div>

                  {/* Gestion pour les employés */}
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-blue-600 font-medium">
                        <i className="fas fa-user-tie mr-1"></i>
                        Vous êtes Administrateur
                      </span>
                      <button onclick="ouvrirGestionnaireEntreprise('company_001')"
                              className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                        <i className="fas fa-cog mr-1"></i>
                        Gérer
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Card 2 */}
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200" data-company-id="company_002">

                <div className="p-6">

                  <div className="flex items-start space-x-4">

                    <div className="relative">

                      <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">AV</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-blue-400 rounded-full ring-2 ring-white flex items-center justify-center">
                        <i className="fas fa-building text-xs text-white"></i>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">

                      <h3 className="text-lg font-medium text-gray-900 truncate">

                        <a href="/companies/aqua-verde" className="hover:text-peva-green-600">AquaVerde Solutions</a>
                      </h3>
                      <p className="text-sm text-gray-600">Startup - Gestion de l'Eau</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">

                        <i className="fas fa-map-marker-alt mr-1"></i>
                        <span>Dakar, Sénégal</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">

                      <button onclick="ajouterEntrepriseFavoris('company_002', 'AquaVerde Solutions')"
                              className="text-gray-400 hover:text-yellow-500 transition-colors">

                        <i className="fas fa-star"></i>
                      </button>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-700 line-clamp-2">

                    Technologies innovantes pour la purification et la distribution d'eau potable 
                    dans les zones urbaines et périurbaines d'Afrique.
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">

                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">

                      💧 Gestion de l'Eau
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">

                      🚀 Startup
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">

                      📊 2 Rapports
                    </span>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">

                    <div className="flex space-x-2">

                      <button onclick="voirFicheEntreprise('company_002')"
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-peva-green-600 hover:bg-peva-green-700">

                        <i className="fas fa-eye mr-1"></i>
                        Voir la fiche
                      </button>
                      <button onclick="contacterEntreprise('company_002', 'AquaVerde Solutions')"
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">

                        <i className="fas fa-envelope mr-1"></i>
                        Contacter
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <i className="fas fa-users mr-1"></i>
                      12 employés
                    </div>
                  </div>
                </div>
              </div>

              {/* Company Card 3 */}
              <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow duration-200" data-company-id="company_003">

                <div className="p-6">

                  <div className="flex items-start space-x-4">

                    <div className="relative">

                      <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                        <span className="text-white font-bold text-xl">GF</span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-purple-400 rounded-full ring-2 ring-white flex items-center justify-center">
                        <i className="fas fa-building text-xs text-white"></i>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">

                      <h3 className="text-lg font-medium text-gray-900 truncate">

                        <a href="/companies/greenfund-africa" className="hover:text-peva-green-600">GreenFund Africa</a>
                      </h3>
                      <p className="text-sm text-gray-600">Grande entreprise - Fintech Verte</p>
                      <div className="flex items-center mt-1 text-sm text-gray-500">

                        <i className="fas fa-map-marker-alt mr-1"></i>
                        <span>Abidjan, Côte d'Ivoire</span>
                      </div>
                    </div>
                    <div className="flex-shrink-0">

                      <button onclick="ajouterEntrepriseFavoris('company_003', 'GreenFund Africa')"
                              className="text-yellow-500 hover:text-yellow-600 transition-colors">

                        <i className="fas fa-star"></i>
                      </button>
                    </div>
                  </div>
                  
                  <p className="mt-4 text-sm text-gray-700 line-clamp-2">

                    Plateforme de financement participatif spécialisée dans les projets 
                    d'économie verte en Afrique subsaharienne.
                  </p>
                  
                  <div className="mt-4 flex flex-wrap gap-2">

                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">

                      💳 Fintech Verte
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">

                      🏢 Grande entreprise
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">

                      📊 5 Rapports RSE
                    </span>
                  </div>
                  
                  <div className="mt-6 flex items-center justify-between">

                    <div className="flex space-x-2">

                      <button onclick="voirFicheEntreprise('company_003')"
                              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-white bg-peva-green-600 hover:bg-peva-green-700">

                        <i className="fas fa-eye mr-1"></i>
                        Voir la fiche
                      </button>
                      <button onclick="contacterEntreprise('company_003', 'GreenFund Africa')"
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50">

                        <i className="fas fa-envelope mr-1"></i>
                        Contacter
                      </button>
                    </div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <i className="fas fa-users mr-1"></i>
                      340 employés
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
                    <span className="font-medium">127</span> résultats
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

                      7
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
    </div>, { title: 'Annuaire des Entreprises - PEVA' }
  )
})

export default app