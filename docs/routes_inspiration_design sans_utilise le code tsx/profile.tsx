import { Hono } from 'hono'

const app = new Hono()

// My profile page
app.get('/me', (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50 py-8">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="mt-2 text-gray-600">Gérez vos informations personnelles et préférences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">

            <nav className="bg-white rounded-lg shadow p-6">

              <ul className="space-y-2">

                <li>
                  <a href="/profile/me" className="flex items-center px-3 py-2 text-sm font-medium text-peva-green-600 bg-peva-green-50 rounded-md">

                    <i className="fas fa-user mr-3"></i>
                    Informations générales
                  </a>
                </li>
                <li>
                  <a href="/profile/settings" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">

                    <i className="fas fa-cog mr-3"></i>
                    Paramètres du compte
                  </a>
                </li>
                <li>
                  <a href="/profile/notifications" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">

                    <i className="fas fa-bell mr-3"></i>
                    Notifications
                  </a>
                </li>
                <li>
                  <a href="/profile/privacy" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">

                    <i className="fas fa-shield-alt mr-3"></i>
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="/profile/security" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">

                    <i className="fas fa-lock mr-3"></i>
                    Sécurité
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2">

            <form className="space-y-8">

              {/* Profile Photo */}
              <div className="bg-white rounded-lg shadow p-6">

                <h2 className="text-lg font-medium text-gray-900 mb-4">Photo de profil</h2>
                <div className="flex items-center space-x-6">

                  <div className="shrink-0">

                    <img className="h-24 w-24 object-cover rounded-full" src="https://via.placeholder.com/96" alt="Photo de profil" />
                  </div>
                  <div className="flex-1">

                    <div className="flex items-center space-x-4">

                      <button type="button" className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-peva-green-500">

                        <i className="fas fa-upload mr-2"></i>
                        Changer
                      </button>
                      <button type="button" className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-peva-green-500">

                        <i className="fas fa-trash mr-2"></i>
                        Supprimer
                      </button>
                    </div>
                    <p className="mt-2 text-sm text-gray-500">JPG, PNG jusqu'à 2MB</p>
                  </div>
                </div>
              </div>

              {/* Basic Information */}
              <div className="bg-white rounded-lg shadow p-6">

                <h2 className="text-lg font-medium text-gray-900 mb-4">Informations de base</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom complet</label>
                    <input
                      type="text"
                      defaultValue="Amina Koné"
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                      type="email"
                      defaultValue="amina.kone@example.com"
                      disabled
                      className="mt-1 block w-full border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500 sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type de profil</label>
                    <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm">

                      <option selected>Entrepreneur</option>
                      <option>Investisseur</option>
                      <option>Expert</option>
                      <option>Organisation</option>
                      <option>Recruteur</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Pays</label>
                    <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm">
                      {/* Pays UEMOA (prioritaires) */}
                      <option selected>🇧🇫 Burkina Faso</option>
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
                      <option>🇿🇦 Afrique du Sud</option>
                      <option>🇲🇦 Maroc</option>
                      <option>🇹🇳 Tunisie</option>
                      <option>🇪🇬 Égypte</option>
                      <option>🇩🇿 Algérie</option>
                      
                      {/* Partenaires internationaux */}
                      <option>🇫🇷 France</option>
                      <option>🇧🇪 Belgique</option>
                      <option>🇨🇭 Suisse</option>
                      <option>🇨🇦 Canada</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Bio & Description */}
              <div className="bg-white rounded-lg shadow p-6">

                <h2 className="text-lg font-medium text-gray-900 mb-4">Description</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Bio professionnelle</label>
                  <textarea
                    rows={4}
                    defaultValue="Entrepreneure spécialisée dans l'énergie solaire en Afrique de l'Ouest. Fondatrice de SolarTech Innovations, une startup qui développe des solutions d'énergie solaire abordables pour les communautés rurales."
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                  />
                  <p className="mt-2 text-sm text-gray-500">

                    Décrivez votre parcours, vos compétences et vos projets. Maximum 500 caractères.
                  </p>
                </div>
              </div>

              {/* Sectors of Interest */}
              <div className="bg-white rounded-lg shadow p-6">

                <h2 className="text-lg font-medium text-gray-900 mb-4">Secteurs d'activité</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

                  <label className="flex items-center">

                    <input type="checkbox" checked className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
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

                    <input type="checkbox" checked className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-700">Transport Vert</span>
                  </label>
                  <label className="flex items-center">

                    <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-700">Construction Écologique</span>
                  </label>
                  <label className="flex items-center">

                    <input type="checkbox" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded" />
                    <span className="ml-2 text-sm text-gray-700">Recyclage & Déchets</span>
                  </label>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-lg shadow p-6">

                <h2 className="text-lg font-medium text-gray-900 mb-4">Réseaux sociaux</h2>
                <div className="space-y-4">

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Site web</label>
                    <div className="mt-1 relative rounded-md shadow-sm">

                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                        <i className="fas fa-globe text-gray-400"></i>
                      </div>
                      <input
                        type="url"
                        placeholder="https://votre-site.com"
                        className="block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                        defaultValue="https://solartech-innovations.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">LinkedIn</label>
                    <div className="mt-1 relative rounded-md shadow-sm">

                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                        <i className="fab fa-linkedin text-gray-400"></i>
                      </div>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/votre-profil"
                        className="block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                        defaultValue="https://linkedin.com/in/aminakone"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Twitter</label>
                    <div className="mt-1 relative rounded-md shadow-sm">

                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">

                        <i className="fab fa-twitter text-gray-400"></i>
                      </div>
                      <input
                        type="text"
                        placeholder="@votre_compte"
                        className="block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex justify-end">

                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-peva-green-600 hover:bg-peva-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-peva-green-500"
                >
                  <i className="fas fa-save mr-2"></i>
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>, { title: 'Mon Profil - PEVA' }
  )
})

// Public profile view
app.get('/:id', (c) => {
  const userId = c.req.param('id')
  
  return c.render(
    <div className="min-h-screen bg-gray-50 py-8">

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow mb-8">

          <div className="relative h-48 bg-gradient-to-r from-peva-green-400 to-peva-green-600 rounded-t-lg">

            <div className="absolute bottom-0 left-0 right-0 p-6">

              <div className="flex items-end space-x-6">

                <div className="relative">

                  <img 
                    className="h-24 w-24 rounded-full ring-4 ring-white object-cover" 
                    src="https://via.placeholder.com/96" 
                    alt="Amina Koné" 
                  />
                  <div className="absolute bottom-0 right-0 h-6 w-6 bg-green-400 rounded-full ring-2 ring-white"></div>
                </div>
                <div className="flex-1 min-w-0 pb-1">

                  <h1 className="text-2xl font-bold text-white truncate">Amina Koné</h1>
                  <p className="text-peva-green-100">Entrepreneur • Énergie Solaire</p>
                  <div className="flex items-center mt-1 text-peva-green-100">

                    <i className="fas fa-map-marker-alt mr-1"></i>
                    <span>Abidjan, Côte d'Ivoire</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="px-6 py-4 border-b border-gray-200">

            <div className="flex flex-wrap items-center justify-between">

              <div className="flex space-x-4">

                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-peva-green-600 hover:bg-peva-green-700">

                  <i className="fas fa-user-plus mr-2"></i>
                  Se connecter
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">

                  <i className="fas fa-envelope mr-2"></i>
                  Envoyer un message
                </button>
                <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">

                  <i className="fas fa-heart mr-2"></i>
                  Ajouter aux favoris
                </button>
              </div>
              
              <div className="flex items-center space-x-6 text-sm text-gray-500">

                <div className="text-center">

                  <div className="text-lg font-semibold text-gray-900">247</div>
                  <div>Connexions</div>
                </div>
                <div className="text-center">

                  <div className="text-lg font-semibold text-gray-900">12</div>
                  <div>Opportunités</div>
                </div>
                <div className="text-center">

                  <div className="text-lg font-semibold text-gray-900">1.2k</div>
                  <div>Vues profil</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">

            {/* About */}
            <div className="bg-white rounded-lg shadow p-6">

              <h2 className="text-lg font-semibold text-gray-900 mb-4">À propos</h2>
              <p className="text-gray-700 text-sm leading-relaxed">

                Entrepreneure spécialisée dans l'énergie solaire en Afrique de l'Ouest. 
                Fondatrice de SolarTech Innovations, une startup qui développe des solutions 
                d'énergie solaire abordables pour les communautés rurales. Passionnée par 
                l'impact social et environnemental des technologies vertes.
              </p>
            </div>

            {/* Sectors */}
            <div className="bg-white rounded-lg shadow p-6">

              <h2 className="text-lg font-semibold text-gray-900 mb-4">Secteurs d'expertise</h2>
              <div className="flex flex-wrap gap-2">

                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">

                  <i className="fas fa-sun mr-1"></i>
                  Énergie Solaire
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">

                  <i className="fas fa-seedling mr-1"></i>
                  Développement Durable
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">

                  <i className="fas fa-lightbulb mr-1"></i>
                  Innovation Tech
                </span>
              </div>
            </div>

            {/* Social Links */}
            <div className="bg-white rounded-lg shadow p-6">

              <h2 className="text-lg font-semibold text-gray-900 mb-4">Liens</h2>
              <div className="space-y-3">

                <a href="https://solartech-innovations.com" className="flex items-center text-sm text-gray-700 hover:text-peva-green-600">

                  <i className="fas fa-globe w-5 mr-3 text-gray-400"></i>
                  solartech-innovations.com
                </a>
                <a href="https://linkedin.com/in/aminakone" className="flex items-center text-sm text-gray-700 hover:text-peva-green-600">

                  <i className="fab fa-linkedin w-5 mr-3 text-gray-400"></i>
                  linkedin.com/in/aminakone
                </a>
                <div className="flex items-center text-sm text-gray-700">

                  <i className="fas fa-envelope w-5 mr-3 text-gray-400"></i>
                  amina.kone@example.com
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow">

              <div className="p-6 border-b border-gray-200">

                <h2 className="text-lg font-semibold text-gray-900">Activités récentes</h2>
              </div>
              <div className="p-6">

                <div className="flow-root">

                  <ul className="-mb-8">

                    <li>
                      <div className="relative pb-8">

                        <div className="relative flex space-x-3">

                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">

                            <i className="fas fa-briefcase text-white text-xs"></i>
                          </div>
                          <div className="flex-1 min-w-0">

                            <div>
                              <div className="text-sm text-gray-500">

                                <span className="font-medium text-gray-900">Opportunité publiée</span>
                                <span className="ml-1">Financement Série A - SolarTech Innovations</span>
                              </div>
                              <p className="mt-0.5 text-xs text-gray-400">Il y a 2 jours</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="relative pb-8">

                        <div className="relative flex space-x-3">

                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500">

                            <i className="fas fa-calendar text-white text-xs"></i>
                          </div>
                          <div className="flex-1 min-w-0">

                            <div>
                              <div className="text-sm text-gray-500">

                                <span className="font-medium text-gray-900">Participation confirmée</span>
                                <span className="ml-1">Sommet de l'Économie Verte Africaine 2025</span>
                              </div>
                              <p className="mt-0.5 text-xs text-gray-400">Il y a 1 semaine</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                    <li>
                      <div className="relative">

                        <div className="relative flex space-x-3">

                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500">

                            <i className="fas fa-users text-white text-xs"></i>
                          </div>
                          <div className="flex-1 min-w-0">

                            <div>
                              <div className="text-sm text-gray-500">

                                <span className="font-medium text-gray-900">Nouveau membre</span>
                                <span className="ml-1">Entrepreneurs Verts Afrique</span>
                              </div>
                              <p className="mt-0.5 text-xs text-gray-400">Il y a 2 semaines</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Opportunities Created */}
            <div className="bg-white rounded-lg shadow">

              <div className="p-6 border-b border-gray-200">

                <div className="flex justify-between items-center">

                  <h2 className="text-lg font-semibold text-gray-900">Opportunités créées</h2>
                  <a href="/opportunities?author={userId}" className="text-sm text-peva-green-600 hover:text-peva-green-500">

                    Voir toutes
                  </a>
                </div>
              </div>
              <div className="divide-y divide-gray-200">

                <div className="p-6 hover:bg-gray-50">

                  <div className="flex items-start space-x-4">

                    <div className="flex-shrink-0">

                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">

                        <i className="fas fa-coins text-blue-600"></i>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">

                      <h3 className="text-sm font-medium text-gray-900">

                        <a href="/opportunities/1" className="hover:text-peva-green-600">

                          Financement Série A - SolarTech Innovations
                        </a>
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">

                        Recherche d'investisseurs pour lever 2M€ pour accélérer le déploiement...
                      </p>
                      <div className="flex items-center mt-2 text-xs text-gray-400">

                        <span>2M€</span>
                        <span className="mx-1">•</span>
                        <span>Financement</span>
                        <span className="mx-1">•</span>
                        <span>5 candidatures</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>, { title: 'Amina Koné - PEVA' }
  )
})

// Profile settings
app.get('/settings', (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50 py-8">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900">Paramètres du compte</h1>
          <p className="mt-2 text-gray-600">Gérez vos préférences et paramètres de sécurité</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Sidebar */}
          <div className="lg:col-span-1">

            <nav className="bg-white rounded-lg shadow p-6">

              <ul className="space-y-2">

                <li>
                  <a href="/profile/me" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">

                    <i className="fas fa-user mr-3"></i>
                    Informations générales
                  </a>
                </li>
                <li>
                  <a href="/profile/settings" className="flex items-center px-3 py-2 text-sm font-medium text-peva-green-600 bg-peva-green-50 rounded-md">

                    <i className="fas fa-cog mr-3"></i>
                    Paramètres du compte
                  </a>
                </li>
                <li>
                  <a href="/profile/notifications" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">

                    <i className="fas fa-bell mr-3"></i>
                    Notifications
                  </a>
                </li>
                <li>
                  <a href="/profile/privacy" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">

                    <i className="fas fa-shield-alt mr-3"></i>
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="/profile/security" className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-md">

                    <i className="fas fa-lock mr-3"></i>
                    Sécurité
                  </a>
                </li>
              </ul>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">

            {/* Language & Preferences */}
            <div className="bg-white rounded-lg shadow p-6">

              <h2 className="text-lg font-medium text-gray-900 mb-4">Préférences générales</h2>
              <div className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700">Langue d'interface</label>
                  <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm">

                    <option selected>Français</option>
                    <option>English</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Fuseau horaire</label>
                  <select className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm">

                    <option selected>UTC+0 (GMT, Abidjan, Dakar)</option>
                    <option>UTC+1 (CET, Paris, Ouagadougou)</option>
                    <option>UTC+2 (CAT, Le Cap, Le Caire)</option>
                    <option>UTC+3 (EAT, Nairobi, Addis Abeba)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Account Actions */}
            <div className="bg-white rounded-lg shadow p-6">

              <h2 className="text-lg font-medium text-gray-900 mb-4">Actions du compte</h2>
              <div className="space-y-4">

                <div className="flex items-center justify-between py-2">

                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Exporter mes données</h3>
                    <p className="text-sm text-gray-500">Télécharger une copie de toutes vos données (RGPD)</p>
                  </div>
                  <button className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-peva-green-500">

                    <i className="fas fa-download mr-1"></i>
                    Exporter
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">

                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Désactiver le compte</h3>
                    <p className="text-sm text-gray-500">Suspendre temporairement votre compte</p>
                  </div>
                  <button className="inline-flex items-center px-3 py-2 border border-yellow-300 shadow-sm text-sm leading-4 font-medium rounded-md text-yellow-700 bg-yellow-50 hover:bg-yellow-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500">

                    <i className="fas fa-pause mr-1"></i>
                    Désactiver
                  </button>
                </div>
                <div className="flex items-center justify-between py-2">

                  <div>
                    <h3 className="text-sm font-medium text-gray-900">Supprimer le compte</h3>
                    <p className="text-sm text-gray-500">Suppression définitive de votre compte et données</p>
                  </div>
                  <button className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm leading-4 font-medium rounded-md text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">

                    <i className="fas fa-trash mr-1"></i>
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>, { title: 'Paramètres - PEVA' }
  )
})

export default app