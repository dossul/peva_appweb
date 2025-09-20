import { Hono } from 'hono'
import { renderer } from '../renderer'

const events = new Hono()

events.use('*', renderer)

// Page principale des événements avec calendrier
events.get('/', (c) => {
  return c.render(
    <div className="space-y-6">

      {/* En-tête Events */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-6 rounded-lg">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold mb-2">

              <i className="fas fa-calendar-alt mr-2"></i>
              Événements PEVA
            </h1>
            <p className="text-purple-100">

              Découvrez les conférences, ateliers, formations et networking de l'écosystème vert africain
            </p>
          </div>
          <a href="/events/create" className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">

            <i className="fas fa-plus mr-2"></i>
            Créer un Événement
          </a>
        </div>
      </div>

      {/* Navigation des vues */}
      <div className="bg-white rounded-lg shadow p-4">

        <div className="flex items-center justify-between">

          <div className="flex items-center space-x-4">

            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium">

              <i className="fas fa-calendar mr-2"></i>
              Calendrier
            </button>
            <a href="/events/list" className="text-gray-600 hover:text-purple-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">

              <i className="fas fa-list mr-2"></i>
              Liste
            </a>
            <a href="/events/map" className="text-gray-600 hover:text-purple-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">

              <i className="fas fa-map mr-2"></i>
              Carte
            </a>
            <a href="/events/my-events" className="text-gray-600 hover:text-purple-600 px-4 py-2 rounded-lg text-sm font-medium transition-colors">

              <i className="fas fa-user mr-2"></i>
              Mes Événements
            </a>
          </div>

          <div className="flex items-center space-x-3">

            <div className="relative">

              <input type="text" placeholder="Rechercher un événement..." 
                     className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <button className="p-2 text-gray-600 hover:text-purple-600 border border-gray-300 rounded-lg transition-colors">

              <i className="fas fa-filter"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">

          <div className="flex items-center">

            <i className="fas fa-calendar-check text-blue-600 text-2xl mr-3"></i>
            <div>
              <p className="text-sm text-gray-600">Événements à venir</p>
              <p className="text-xl font-bold text-gray-900">24</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">

          <div className="flex items-center">

            <i className="fas fa-users text-green-600 text-2xl mr-3"></i>
            <div>
              <p className="text-sm text-gray-600">Participants inscrits</p>
              <p className="text-xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">

          <div className="flex items-center">

            <i className="fas fa-video text-purple-600 text-2xl mr-3"></i>
            <div>
              <p className="text-sm text-gray-600">Événements virtuels</p>
              <p className="text-xl font-bold text-gray-900">8</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">

          <div className="flex items-center">

            <i className="fas fa-map-marker-alt text-orange-600 text-2xl mr-3"></i>
            <div>
              <p className="text-sm text-gray-600">Villes actives</p>
              <p className="text-xl font-bold text-gray-900">15</p>
            </div>
          </div>
        </div>
      </div>

      {/* Calendrier principal */}
      <div className="bg-white rounded-lg shadow">

        {/* En-tête du calendrier */}
        <div className="border-b border-gray-200 p-6">

          <div className="flex items-center justify-between">

            <div className="flex items-center space-x-4">

              <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-colors">

                <i className="fas fa-chevron-left"></i>
              </button>
              <h2 className="text-xl font-semibold text-gray-900">Mars 2024</h2>
              <button className="p-2 text-gray-600 hover:text-purple-600 hover:bg-gray-100 rounded-lg transition-colors">

                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
            
            <div className="flex items-center space-x-2">

              <button className="bg-purple-600 text-white px-3 py-1 rounded text-sm">Mois</button>
              <button className="text-gray-600 hover:text-purple-600 px-3 py-1 rounded text-sm transition-colors">Semaine</button>
              <button className="text-gray-600 hover:text-purple-600 px-3 py-1 rounded text-sm transition-colors">Jour</button>
            </div>
          </div>
        </div>

        {/* Grille du calendrier */}
        <div className="p-6">

          {/* En-têtes des jours */}
          <div className="grid grid-cols-7 gap-1 mb-2">

            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(day => (
              <div key={day} className="p-3 text-center text-sm font-medium text-gray-500">

                {day}
              </div>
            ))}
          </div>

          {/* Grille des dates */}
          <div className="grid grid-cols-7 gap-1">

            {/* Exemple de dates avec événements */}
            {[...Array(35)].map((_, i) => {
              const date = i - 4 // Pour commencer par les derniers jours du mois précédent
              const isCurrentMonth = date >= 1 && date <= 31
              const isToday = date === 15
              const hasEvent = [3, 8, 12, 15, 22, 25, 28].includes(date)
              
              return (
                <div key={i} className={`
                  h-24 border border-gray-100 p-1 cursor-pointer hover:bg-gray-50 transition-colors
                  ${!isCurrentMonth ? 'text-gray-300 bg-gray-50' : ''}
                  ${isToday ? 'bg-purple-50 border-purple-200' : ''}
                `}>
                  <div className={`
                    text-sm font-medium mb-1 
                    ${isToday ? 'text-purple-600' : isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
                  `}>
                    {date > 0 ? date : 31 + date}
                  </div>
                  
                  {hasEvent && isCurrentMonth && (
                    <div className="space-y-1">

                      {date === 15 && (
                        <>
                          <div className="bg-blue-500 text-white text-xs px-1 py-0.5 rounded truncate">

                            Conférence IA Verte
                          </div>
                          <div className="bg-green-500 text-white text-xs px-1 py-0.5 rounded truncate">

                            Workshop Solar
                          </div>
                        </>
                      )}
                      {date === 22 && (
                        <div className="bg-purple-500 text-white text-xs px-1 py-0.5 rounded truncate">

                          Pitch Day
                        </div>
                      )}
                      {date === 25 && (
                        <div className="bg-orange-500 text-white text-xs px-1 py-0.5 rounded truncate">

                          Formation Impact
                        </div>
                      )}
                      {[3, 8, 12, 28].includes(date) && (
                        <div className="bg-gray-500 text-white text-xs px-1 py-0.5 rounded truncate">

                          Événement
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Événements à venir */}
      <div className="bg-white rounded-lg shadow p-6">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-xl font-semibold text-gray-900">Prochains Événements</h2>
          <a href="/events/list" className="text-purple-600 hover:text-purple-700 font-medium">

            Voir tous →
          </a>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Événement 1 */}
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">

            <div className="flex items-start justify-between mb-4">

              <div className="flex items-center space-x-3">

                <div className="bg-blue-100 p-3 rounded-lg">

                  <i className="fas fa-microchip text-blue-600 text-xl"></i>
                </div>
                <div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">Conférence</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded ml-2">Gratuit</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-purple-600 transition-colors">

                <i className="far fa-bookmark"></i>
              </button>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">

              <a href="/events/ia-verte-conference-2024" className="hover:text-purple-600">

                Intelligence Artificielle et Économie Verte en Afrique
              </a>
            </h3>

            <div className="flex items-center text-sm text-gray-600 mb-3 space-x-4">

              <div className="flex items-center">

                <i className="fas fa-calendar mr-2"></i>
                15 Mars 2024
              </div>
              <div className="flex items-center">

                <i className="fas fa-clock mr-2"></i>
                09:00 - 17:00
              </div>
              <div className="flex items-center">

                <i className="fas fa-map-marker-alt mr-2"></i>
                Ouagadougou, Burkina Faso
              </div>
            </div>

            <p className="text-gray-700 mb-4">

              Une journée dédiée à l'exploration des applications de l'IA dans les secteurs verts en Afrique. 
              Conférences, tables rondes et démonstrations technologiques.
            </p>

            <div className="flex items-center justify-between">

              <div className="flex items-center space-x-2 text-sm text-gray-600">

                <i className="fas fa-users"></i>
                <span>245 participants</span>
                <span className="text-gray-400">•</span>
                <span>35 places restantes</span>
              </div>
              <a href="/events/ia-verte-conference-2024" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">

                S'inscrire
              </a>
            </div>
          </div>

          {/* Événement 2 */}
          <div className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">

            <div className="flex items-start justify-between mb-4">

              <div className="flex items-center space-x-3">

                <div className="bg-green-100 p-3 rounded-lg">

                  <i className="fas fa-solar-panel text-green-600 text-xl"></i>
                </div>
                <div>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">Workshop</span>
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded ml-2">Payant</span>
                </div>
              </div>
              <button className="text-gray-400 hover:text-purple-600 transition-colors">

                <i className="far fa-bookmark"></i>
              </button>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">

              <a href="/events/workshop-solaire-pratique" className="hover:text-purple-600">

                Workshop Pratique: Installation Solaire Résidentielle
              </a>
            </h3>

            <div className="flex items-center text-sm text-gray-600 mb-3 space-x-4">

              <div className="flex items-center">

                <i className="fas fa-calendar mr-2"></i>
                22 Mars 2024
              </div>
              <div className="flex items-center">

                <i className="fas fa-clock mr-2"></i>
                09:00 - 12:00
              </div>
              <div className="flex items-center">

                <i className="fas fa-map-marker-alt mr-2"></i>
                Accra, Ghana
              </div>
            </div>

            <p className="text-gray-700 mb-4">

              Formation pratique pour apprendre les bases de l'installation de panneaux solaires résidentiels. 
              Matériel fourni et certification à la clé.
            </p>

            <div className="flex items-center justify-between">

              <div className="flex items-center space-x-2 text-sm text-gray-600">

                <i className="fas fa-users"></i>
                <span>15 participants</span>
                <span className="text-gray-400">•</span>
                <span className="text-orange-600 font-medium">5 places restantes</span>
              </div>
              <a href="/events/workshop-solaire-pratique" className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">

                150€ - S'inscrire
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Types d'événements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">

          <div className="flex items-center mb-4">

            <div className="bg-blue-100 p-3 rounded-lg mr-4">

              <i className="fas fa-microphone text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Conférences</h3>
              <p className="text-sm text-gray-500">12 événements</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">

            Conférences et keynotes par les experts de l'économie verte.
          </p>
          <a href="/events/type/conferences" className="text-purple-600 hover:text-purple-700 font-medium text-sm">

            Voir les conférences →
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">

          <div className="flex items-center mb-4">

            <div className="bg-green-100 p-3 rounded-lg mr-4">

              <i className="fas fa-tools text-green-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Workshops</h3>
              <p className="text-sm text-gray-500">8 événements</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">

            Ateliers pratiques et formations techniques spécialisées.
          </p>
          <a href="/events/type/workshops" className="text-purple-600 hover:text-purple-700 font-medium text-sm">

            Voir les workshops →
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">

          <div className="flex items-center mb-4">

            <div className="bg-purple-100 p-3 rounded-lg mr-4">

              <i className="fas fa-handshake text-purple-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Networking</h3>
              <p className="text-sm text-gray-500">6 événements</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">

            Événements de networking et rencontres professionnelles.
          </p>
          <a href="/events/type/networking" className="text-purple-600 hover:text-purple-700 font-medium text-sm">

            Voir le networking →
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">

          <div className="flex items-center mb-4">

            <div className="bg-orange-100 p-3 rounded-lg mr-4">

              <i className="fas fa-graduation-cap text-orange-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Formations</h3>
              <p className="text-sm text-gray-500">4 événements</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">

            Formations certifiantes et programmes d'apprentissage.
          </p>
          <a href="/events/type/formations" className="text-purple-600 hover:text-purple-700 font-medium text-sm">

            Voir les formations →
          </a>
        </div>
      </div>
    </div>
  )
})

// Page de création d'événement
events.get('/create', (c) => {
  return c.render(
    <div className="max-w-4xl mx-auto">

      <div className="bg-white shadow rounded-lg">

        <div className="px-6 py-4 border-b border-gray-200">

          <h1 className="text-xl font-semibold text-gray-900">

            <i className="fas fa-plus-circle mr-2 text-purple-600"></i>
            Créer un Événement
          </h1>
          <p className="mt-1 text-sm text-gray-600">

            Organisez votre événement et touchez la communauté PEVA
          </p>
        </div>

        <form className="px-6 py-6 space-y-8">

          {/* Informations de base */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de Base</h3>
            
            <div className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre de l'Événement *</label>
                <input type="text" required
                       placeholder="Ex: Conférence Intelligence Artificielle et Économie Verte"
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type d'Événement *</label>
                  <select required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">

                    <option value="">Sélectionner un type</option>
                    <option value="conference">Conférence</option>
                    <option value="workshop">Workshop</option>
                    <option value="formation">Formation</option>
                    <option value="networking">Networking</option>
                    <option value="pitch_day">Pitch Day</option>
                    <option value="salon">Salon/Exposition</option>
                    <option value="webinar">Webinaire</option>
                    <option value="hackathon">Hackathon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie Principale *</label>
                  <select required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">

                    <option value="">Sélectionner une catégorie</option>
                    <option value="energie_renouvelable">Énergie Renouvelable</option>
                    <option value="agriculture_durable">Agriculture Durable</option>
                    <option value="finance_verte">Finance Verte</option>
                    <option value="transport_vert">Transport Vert</option>
                    <option value="economie_circulaire">Économie Circulaire</option>
                    <option value="innovation_technologique">Innovation Technologique</option>
                    <option value="politique_environnementale">Politique Environnementale</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea rows="4" required
                          placeholder="Décrivez votre événement, son programme et ses objectifs..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"></textarea>
              </div>
            </div>
          </div>

          {/* Date et horaires */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Date et Horaires</h3>
            
            <div className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de Début *</label>
                  <input type="date" required
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heure de Début *</label>
                  <input type="time" required
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date de Fin</label>
                  <input type="date"
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

                  <p className="mt-1 text-xs text-gray-500">Laissez vide si événement sur une seule journée</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Heure de Fin</label>
                  <input type="time"
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuseau Horaire</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">

                  <option value="GMT">GMT (Heure de Greenwich)</option>
                  <option value="WAT">WAT (Heure d'Afrique de l'Ouest)</option>
                  <option value="CAT">CAT (Heure d'Afrique Centrale)</option>
                  <option value="EAT">EAT (Heure d'Afrique de l'Est)</option>
                  <option value="SAST">SAST (Heure d'Afrique du Sud)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Lieu et format */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Lieu et Format</h3>
            
            <div className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Format de l'Événement *</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">

                    <input type="radio" name="format" value="presentiel" className="text-purple-600 focus:ring-purple-500" />
                    <div className="ml-3">

                      <div className="font-medium text-gray-900">Présentiel</div>
                      <div className="text-sm text-gray-600">En personne</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">

                    <input type="radio" name="format" value="virtuel" className="text-purple-600 focus:ring-purple-500" />
                    <div className="ml-3">

                      <div className="font-medium text-gray-900">Virtuel</div>
                      <div className="text-sm text-gray-600">En ligne</div>
                    </div>
                  </label>
                  
                  <label className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">

                    <input type="radio" name="format" value="hybride" className="text-purple-600 focus:ring-purple-500" />
                    <div className="ml-3">

                      <div className="font-medium text-gray-900">Hybride</div>
                      <div className="text-sm text-gray-600">Présentiel + Virtuel</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* Lieu physique */}
              <div id="lieu-presentiel" className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom du Lieu</label>
                    <input type="text" placeholder="Ex: Centre de Convention de Ouagadougou"
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                    <input type="text" placeholder="Ex: Ouagadougou"
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pays *</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">
                      <option value="">Sélectionner un pays</option>
                      
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
                      <option value="EG">🇪🇬 Égypte</option>
                      <option value="MA">🇲🇦 Maroc</option>
                      <option value="ET">🇪🇹 Éthiopie</option>
                      <option value="TN">🇹🇳 Tunisie</option>
                      <option value="DZ">🇩🇿 Algérie</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse Complète</label>
                    <input type="text" placeholder="Adresse, code postal"
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

                  </div>
                </div>
              </div>

              {/* Lieu virtuel */}
              <div id="lieu-virtuel" className="space-y-4 hidden">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Plateforme</label>
                    <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">

                      <option value="zoom">Zoom</option>
                      <option value="teams">Microsoft Teams</option>
                      <option value="meet">Google Meet</option>
                      <option value="webex">Cisco Webex</option>
                      <option value="autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Lien de Connexion</label>
                    <input type="url" placeholder="https://zoom.us/j/..."
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Inscription et capacité */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Inscription et Capacité</h3>
            
            <div className="space-y-6">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Capacité Maximum</label>
                  <input type="number" min="1" placeholder="100"
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type d'Inscription</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent">

                    <option value="gratuit">Gratuit</option>
                    <option value="payant">Payant</option>
                    <option value="sur_invitation">Sur Invitation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prix (si payant)</label>
                  <div className="relative">

                    <input type="number" min="0" step="0.01" placeholder="0.00"
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

                    <select className="absolute right-0 top-0 h-full px-3 border-l border-gray-300 bg-gray-50 text-sm">

                      <option value="EUR">EUR</option>
                      <option value="USD">USD</option>
                      <option value="XOF">XOF</option>
                      <option value="GHS">GHS</option>
                      <option value="NGN">NGN</option>
                      <option value="KES">KES</option>
                      <option value="ZAR">ZAR</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ouverture des Inscriptions</label>
                  <input type="datetime-local"
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fermeture des Inscriptions</label>
                  <input type="datetime-local"
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

                </div>
              </div>

              <div className="space-y-4">

                <label className="flex items-center">

                  <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  <span className="ml-2 text-sm text-gray-700">Inscription obligatoire</span>
                </label>

                <label className="flex items-center">

                  <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  <span className="ml-2 text-sm text-gray-700">Approbation manuelle des inscriptions</span>
                </label>

                <label className="flex items-center">

                  <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                  <span className="ml-2 text-sm text-gray-700">Envoyer des rappels automatiques</span>
                </label>
              </div>
            </div>
          </div>

          {/* Programme et intervenants */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Programme et Intervenants</h3>
            
            <div className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Agenda Détaillé</label>
                <textarea rows="6" 
                          placeholder="09:00 - Accueil et café&#10;09:30 - Conférence d'ouverture&#10;10:30 - Table ronde: IA et Agriculture&#10;12:00 - Pause déjeuner&#10;..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Intervenants Principaux</label>
                <div className="space-y-3">

                  <div className="flex items-center space-x-3">

                    <input type="text" placeholder="Nom de l'intervenant"
                           className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

                    <input type="text" placeholder="Titre/Fonction"
                           className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

                    <button type="button" className="p-2 text-red-600 hover:text-red-700 transition-colors">

                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  <button type="button" className="text-purple-600 hover:text-purple-700 text-sm font-medium">

                    <i className="fas fa-plus mr-1"></i>
                    Ajouter un Intervenant
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prérequis</label>
                <textarea rows="3" 
                          placeholder="Connaissances de base en développement durable, expérience en startup recommandée..."
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"></textarea>
              </div>
            </div>
          </div>

          {/* Médias et documents */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Médias et Documents</h3>
            
            <div className="space-y-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image de Couverture</label>
                <div className="border-2 border-gray-300 border-dashed rounded-lg p-6 text-center">

                  <input type="file" id="cover-upload" className="hidden" accept="image/*" />
                  <label for="cover-upload" className="cursor-pointer">

                    <i className="fas fa-image text-4xl text-gray-400 mb-2"></i>
                    <p className="text-sm text-gray-600">

                      Cliquez pour sélectionner une image de couverture
                    </p>
                    <p className="text-xs text-gray-500 mt-1">

                      JPG, PNG (max. 5MB) - Recommandé: 1200x630px
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Documents Annexes</label>
                <div className="border border-gray-300 rounded-lg p-4">

                  <input type="file" multiple accept=".pdf,.doc,.docx,.ppt,.pptx"
                         className="w-full" />

                  <p className="text-xs text-gray-500 mt-1">

                    Programme détaillé, présentations, formulaires d'inscription... (PDF, Word, PowerPoint)
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Site Web</label>
                  <input type="url" placeholder="https://example.com"
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Contact Organisateur</label>
                  <input type="email" placeholder="contact@example.com"
                         className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent" />

                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 pt-6">

            <div className="flex items-center justify-between">

              <button type="button" className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">

                <i className="fas fa-save mr-2"></i>
                Enregistrer en Brouillon
              </button>
              <div className="flex items-center space-x-3">

                <a href="/events" className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">

                  Annuler
                </a>
                <button type="submit" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">

                  <i className="fas fa-calendar-plus mr-2"></i>
                  Publier l'Événement
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
})

// Page de détail d'un événement
events.get('/:id', (c) => {
  const eventId = c.req.param('id')
  
  return c.render(
    <div className="max-w-6xl mx-auto">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">

          {/* Header de l'événement */}
          <div className="bg-white rounded-lg shadow overflow-hidden">

            {/* Image de couverture */}
            <div className="h-64 bg-gradient-to-r from-blue-600 to-purple-600 relative">

              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute bottom-4 left-6 text-white">

                <div className="flex items-center space-x-3 mb-2">

                  <span className="bg-blue-500 px-3 py-1 rounded-full text-sm font-medium">Conférence</span>
                  <span className="bg-green-500 px-3 py-1 rounded-full text-sm font-medium">Gratuit</span>
                  <span className="bg-yellow-500 px-3 py-1 rounded-full text-sm font-medium">Places Limitées</span>
                </div>
                <h1 className="text-2xl font-bold">Intelligence Artificielle et Économie Verte en Afrique</h1>
              </div>
            </div>

            <div className="p-6">

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">

                <div className="flex items-center text-sm text-gray-600">

                  <i className="fas fa-calendar mr-3 text-purple-600"></i>
                  <div>
                    <div className="font-medium text-gray-900">15 Mars 2024</div>
                    <div>09:00 - 17:00 WAT</div>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">

                  <i className="fas fa-map-marker-alt mr-3 text-purple-600"></i>
                  <div>
                    <div className="font-medium text-gray-900">Ouagadougou, Burkina Faso</div>
                    <div>Centre International de Conférences de Ouagadougou (CICO)</div>
                  </div>
                </div>
                
                <div className="flex items-center text-sm text-gray-600">

                  <i className="fas fa-users mr-3 text-purple-600"></i>
                  <div>
                    <div className="font-medium text-gray-900">245 Participants</div>
                    <div className="text-orange-600">35 places restantes</div>
                  </div>
                </div>
              </div>

              <div className="prose max-w-none">

                <p className="text-gray-700 leading-relaxed mb-4">

                  Rejoignez-nous pour une journée exceptionnelle dédiée à l'exploration des applications de l'Intelligence 
                  Artificielle dans les secteurs de l'économie verte en Afrique. Cet événement unique rassemble experts, 
                  entrepreneurs, investisseurs et décideurs politiques pour découvrir comment l'IA peut accélérer la 
                  transition vers une économie durable sur le continent africain.
                </p>
                
                <p className="text-gray-700 leading-relaxed">

                  Au programme : conférences inspirantes, tables rondes interactives, démonstrations technologiques 
                  et opportunités de networking exceptionnelles. Découvrez les dernières innovations, rencontrez 
                  les acteurs clés de l'écosystème et développez votre réseau professionnel.
                </p>
              </div>
            </div>
          </div>

          {/* Programme */}
          <div className="bg-white rounded-lg shadow p-6">

            <h2 className="text-xl font-semibold text-gray-900 mb-6">Programme de la Journée</h2>
            
            <div className="space-y-6">

              <div className="flex items-start space-x-4">

                <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-lg text-sm font-medium min-w-fit">

                  08:30 - 09:00
                </div>
                <div className="flex-1">

                  <h3 className="font-medium text-gray-900 mb-1">Accueil et Café de Bienvenue</h3>
                  <p className="text-sm text-gray-600">Enregistrement des participants et networking matinal</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">

                <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-lg text-sm font-medium min-w-fit">

                  09:00 - 09:45
                </div>
                <div className="flex-1">

                  <h3 className="font-medium text-gray-900 mb-1">Conférence d'Ouverture</h3>
                  <p className="text-sm text-gray-600 mb-2">

                    "L'IA au Service de l'Afrique Verte: Vision et Opportunités"
                  </p>
                  <div className="flex items-center text-sm text-gray-500">

                    <img src="https://ui-avatars.com/api/?name=Dr.+Amina+Kone&background=10b981&color=fff" 
                         alt="Dr. Amina Koné" className="w-6 h-6 rounded-full mr-2" />

                    Dr. Amina Koné, Directrice Innovation chez Green Tech Africa
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">

                <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-lg text-sm font-medium min-w-fit">

                  10:00 - 11:30
                </div>
                <div className="flex-1">

                  <h3 className="font-medium text-gray-900 mb-1">Table Ronde: IA et Agriculture Durable</h3>
                  <p className="text-sm text-gray-600 mb-2">

                    Applications de l'IA pour optimiser les rendements agricoles et réduire l'impact environnemental
                  </p>
                  <div className="text-sm text-gray-500">

                    Modérée par Marie Diop (AgriTech Innovations) • 4 experts panélistes
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">

                <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-medium min-w-fit">

                  11:30 - 12:00
                </div>
                <div className="flex-1">

                  <h3 className="font-medium text-gray-900 mb-1">Pause Café & Networking</h3>
                  <p className="text-sm text-gray-600">Démonstrations technologiques en parallèle</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">

                <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-lg text-sm font-medium min-w-fit">

                  12:00 - 13:00
                </div>
                <div className="flex-1">

                  <h3 className="font-medium text-gray-900 mb-1">Sessions Parallèles</h3>
                  <div className="space-y-2 text-sm text-gray-600">

                    <div>• <strong>Track 1:</strong> IA et Énergies Renouvelables</div>
                    <div>• <strong>Track 2:</strong> Smart Cities et Transport Vert</div>
                    <div>• <strong>Track 3:</strong> Finance Verte et IA Prédictive</div>
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">

                <div className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-sm font-medium min-w-fit">

                  13:00 - 14:00
                </div>
                <div className="flex-1">

                  <h3 className="font-medium text-gray-900 mb-1">Déjeuner Networking</h3>
                  <p className="text-sm text-gray-600">Buffet déjeuner et rencontres B2B</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">

                <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-lg text-sm font-medium min-w-fit">

                  14:00 - 15:30
                </div>
                <div className="flex-1">

                  <h3 className="font-medium text-gray-900 mb-1">Pitch Session: Startups IA Verte</h3>
                  <p className="text-sm text-gray-600 mb-2">

                    8 startups africaines présentent leurs solutions IA pour l'environnement
                  </p>
                  <div className="text-sm text-gray-500">

                    Jury d'investisseurs • Prix du Public • Prix de l'Innovation
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">

                <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-lg text-sm font-medium min-w-fit">

                  15:45 - 16:30
                </div>
                <div className="flex-1">

                  <h3 className="font-medium text-gray-900 mb-1">Panel Investisseurs</h3>
                  <p className="text-sm text-gray-600 mb-2">

                    "Financer l'Innovation IA Verte en Afrique: Défis et Opportunités"
                  </p>
                  <div className="text-sm text-gray-500">

                    5 fonds d'investissement spécialisés • Session Q&A
                  </div>
                </div>
              </div>

              <div className="flex items-start space-x-4">

                <div className="bg-purple-100 text-purple-600 px-3 py-1 rounded-lg text-sm font-medium min-w-fit">

                  16:30 - 17:00
                </div>
                <div className="flex-1">

                  <h3 className="font-medium text-gray-900 mb-1">Conclusion et Remise des Prix</h3>
                  <p className="text-sm text-gray-600">Synthèse de la journée et perspectives d'avenir</p>
                </div>
              </div>
            </div>
          </div>

          {/* Intervenants */}
          <div className="bg-white rounded-lg shadow p-6">

            <h2 className="text-xl font-semibold text-gray-900 mb-6">Intervenants Principaux</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div className="flex items-start space-x-4">

                <img src="https://ui-avatars.com/api/?name=Dr.+Amina+Kone&background=10b981&color=fff" 
                     alt="Dr. Amina Koné" className="w-16 h-16 rounded-full" />

                <div>
                  <h3 className="font-semibold text-gray-900">Dr. Amina Koné</h3>
                  <p className="text-sm text-purple-600 mb-2">Directrice Innovation, Green Tech Africa</p>
                  <p className="text-sm text-gray-600">

                    Experte en IA appliquée au développement durable avec 15 ans d'expérience 
                    dans l'écosystème tech africain.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">

                <img src="https://ui-avatars.com/api/?name=Marie+Diop&background=3b82f6&color=fff" 
                     alt="Marie Diop" className="w-16 h-16 rounded-full" />

                <div>
                  <h3 className="font-semibold text-gray-900">Marie Diop</h3>
                  <p className="text-sm text-purple-600 mb-2">CEO, AgriTech Innovations</p>
                  <p className="text-sm text-gray-600">

                    Pionnière de l'agriculture intelligente en Afrique de l'Ouest, 
                    spécialiste des solutions IoT et IA pour l'agriculture.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">

                <img src="https://ui-avatars.com/api/?name=Ahmed+Ben+Ali&background=f59e0b&color=fff" 
                     alt="Ahmed Ben Ali" className="w-16 h-16 rounded-full" />

                <div>
                  <h3 className="font-semibold text-gray-900">Ahmed Ben Ali</h3>
                  <p className="text-sm text-purple-600 mb-2">CTO, SolarAI Solutions</p>
                  <p className="text-sm text-gray-600">

                    Architecte des systèmes d'IA prédictive pour l'optimisation 
                    des réseaux d'énergie renouvelable.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">

                <img src="https://ui-avatars.com/api/?name=Sarah+Okoye&background=8b5cf6&color=fff" 
                     alt="Sarah Okoye" className="w-16 h-16 rounded-full" />

                <div>
                  <h3 className="font-semibold text-gray-900">Sarah Okoye</h3>
                  <p className="text-sm text-purple-600 mb-2">Partner, Green Ventures Fund</p>
                  <p className="text-sm text-gray-600">

                    Investisseuse spécialisée dans les technologies propres, 
                    avec un portfolio de 50+ startups vertes africaines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Inscription */}
          <div className="bg-white rounded-lg shadow p-6">

            <div className="text-center mb-6">

              <div className="text-3xl font-bold text-purple-600 mb-1">Gratuit</div>
              <div className="text-sm text-gray-600">Inscription obligatoire</div>
            </div>

            <div className="space-y-4 mb-6">

              <div className="flex items-center justify-between text-sm">

                <span className="text-gray-600">Places disponibles:</span>
                <span className="font-medium text-orange-600">35 / 280</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">

                <div className="bg-gradient-to-r from-orange-500 to-red-500 h-2 rounded-full" style={{ width: '87%' }}></div>
              </div>
              <div className="text-xs text-gray-500 text-center">

                87% des places réservées
              </div>
            </div>

            <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-medium mb-3">

              <i className="fas fa-ticket-alt mr-2"></i>
              S'Inscrire Maintenant
            </button>

            <div className="flex items-center justify-between text-sm text-gray-600">

              <span>Fermeture inscriptions:</span>
              <span>12 Mars 2024</span>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">

              <div className="flex items-center justify-center space-x-4">

                <button className="text-gray-400 hover:text-purple-600 transition-colors" title="Ajouter au calendrier">
                  <i className="fas fa-calendar-plus"></i>
                </button>
                <button className="text-gray-400 hover:text-purple-600 transition-colors" title="Partager">
                  <i className="fas fa-share-alt"></i>
                </button>
                <button className="text-gray-400 hover:text-purple-600 transition-colors" title="Ajouter aux favoris">
                  <i className="far fa-heart"></i>
                </button>
              </div>
            </div>
          </div>

          {/* Informations pratiques */}
          <div className="bg-white rounded-lg shadow p-6">

            <h3 className="font-semibold text-gray-900 mb-4">Informations Pratiques</h3>
            
            <div className="space-y-4">

              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">

                  <i className="fas fa-map-marker-alt mr-2 text-purple-600"></i>
                  <span className="font-medium">Lieu</span>
                </div>
                <p className="text-sm text-gray-900 ml-6">

                  Centre de Convention Eko Hotel<br />
                  1415 Adetokunbo Ademola Street<br />
                  Victoria Island, Lagos, Nigeria
                </p>
              </div>

              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">

                  <i className="fas fa-parking mr-2 text-purple-600"></i>
                  <span className="font-medium">Parking</span>
                </div>
                <p className="text-sm text-gray-900 ml-6">

                  Parking gratuit disponible sur site
                </p>
              </div>

              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">

                  <i className="fas fa-utensils mr-2 text-purple-600"></i>
                  <span className="font-medium">Restauration</span>
                </div>
                <p className="text-sm text-gray-900 ml-6">

                  Petit-déjeuner, déjeuner et pauses inclus
                </p>
              </div>

              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">

                  <i className="fas fa-wifi mr-2 text-purple-600"></i>
                  <span className="font-medium">WiFi</span>
                </div>
                <p className="text-sm text-gray-900 ml-6">

                  WiFi gratuit haut débit
                </p>
              </div>

              <div>
                <div className="flex items-center text-sm text-gray-600 mb-1">

                  <i className="fas fa-language mr-2 text-purple-600"></i>
                  <span className="font-medium">Langues</span>
                </div>
                <p className="text-sm text-gray-900 ml-6">

                  Français, Anglais (traduction simultanée)
                </p>
              </div>
            </div>
          </div>

          {/* Organisateur */}
          <div className="bg-white rounded-lg shadow p-6">

            <h3 className="font-semibold text-gray-900 mb-4">Organisé par</h3>
            
            <div className="flex items-center space-x-3 mb-4">

              <img src="https://ui-avatars.com/api/?name=PEVA&background=10b981&color=fff" 
                   alt="PEVA" className="w-12 h-12 rounded-full" />

              <div>
                <h4 className="font-medium text-gray-900">PEVA</h4>
                <p className="text-sm text-gray-600">Plateforme Économie Verte Afrique</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-700 mb-4">

              PEVA organise régulièrement des événements pour connecter les acteurs 
              de l'économie verte africaine et favoriser les collaborations.
            </p>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600">

              <span><i className="fas fa-calendar mr-1"></i>12 événements</span>
              <span><i className="fas fa-star mr-1"></i>4.9 note</span>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-200">

              <a href="mailto:events@peva.africa" className="text-purple-600 hover:text-purple-700 text-sm font-medium">

                <i className="fas fa-envelope mr-2"></i>
                Contacter l'Organisateur
              </a>
            </div>
          </div>

          {/* Événements similaires */}
          <div className="bg-white rounded-lg shadow p-6">

            <h3 className="font-semibold text-gray-900 mb-4">Événements Similaires</h3>
            
            <div className="space-y-4">

              <a href="/events/workshop-blockchain-carbon" className="block border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">

                <h4 className="font-medium text-gray-900 mb-1">Workshop Blockchain & Carbone</h4>
                <p className="text-xs text-gray-600 mb-2">28 Mars 2024 • Casablanca</p>
                <div className="flex items-center text-xs text-gray-500">

                  <i className="fas fa-users mr-1"></i>
                  45 participants
                </div>
              </a>

              <a href="/events/forum-finance-verte" className="block border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">

                <h4 className="font-medium text-gray-900 mb-1">Forum Finance Verte Afrique</h4>
                <p className="text-xs text-gray-600 mb-2">05 Avril 2024 • Nairobi</p>
                <div className="flex items-center text-xs text-gray-500">

                  <i className="fas fa-users mr-1"></i>
                  200 participants
                </div>
              </a>

              <a href="/events/hackathon-climat" className="block border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">

                <h4 className="font-medium text-gray-900 mb-1">Hackathon Climat 2024</h4>
                <p className="text-xs text-gray-600 mb-2">12-14 Avril 2024 • Le Cap</p>
                <div className="flex items-center text-xs text-gray-500">

                  <i className="fas fa-users mr-1"></i>
                  100 participants
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

// Page liste des événements
events.get('/list', (c) => {
  return c.render(
    <div className="space-y-6">

      {/* En-tête */}
      <div className="flex items-center justify-between">

        <h1 className="text-2xl font-bold text-gray-900">

          <i className="fas fa-list mr-2 text-purple-600"></i>
          Tous les Événements
        </h1>
        <div className="flex items-center space-x-3">

          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">

            <option value="upcoming">À venir</option>
            <option value="past">Passés</option>
            <option value="all">Tous</option>
          </select>
          <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">

            <option value="date">Date</option>
            <option value="popularity">Popularité</option>
            <option value="location">Lieu</option>
          </select>
        </div>
      </div>

      {/* Liste des événements */}
      <div className="space-y-6">

        {/* Événement de liste exemple */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">

          <div className="flex items-start space-x-4">

            <div className="bg-purple-100 text-purple-600 text-center p-3 rounded-lg min-w-fit">

              <div className="text-2xl font-bold">15</div>
              <div className="text-sm">MAR</div>
            </div>
            
            <div className="flex-1">

              <div className="flex items-start justify-between mb-3">

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">

                    <a href="/events/ia-verte-conference-2024" className="hover:text-purple-600">

                      Intelligence Artificielle et Économie Verte en Afrique
                    </a>
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">

                    <span><i className="fas fa-clock mr-1"></i>09:00 - 17:00</span>
                    <span><i className="fas fa-map-marker-alt mr-1"></i>Ouagadougou, Burkina Faso</span>
                    <span><i className="fas fa-users mr-1"></i>245 participants</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">

                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">Conférence</span>
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">Gratuit</span>
                </div>
              </div>
              
              <p className="text-gray-700 mb-4">

                Une journée dédiée à l'exploration des applications de l'IA dans les secteurs verts en Afrique. 
                Conférences, tables rondes et démonstrations technologiques.
              </p>
              
              <div className="flex items-center justify-between">

                <div className="text-sm text-gray-600">

                  <span className="text-orange-600 font-medium">35 places restantes</span>
                </div>
                <a href="/events/ia-verte-conference-2024" 
                   className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">

                  S'inscrire
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Répétez pour d'autres événements... */}
        {[...Array(8)].map((_, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">

            <div className="flex items-start space-x-4">

              <div className="bg-purple-100 text-purple-600 text-center p-3 rounded-lg min-w-fit">

                <div className="text-2xl font-bold">{22 + i}</div>
                <div className="text-sm">MAR</div>
              </div>
              
              <div className="flex-1">

                <div className="flex items-start justify-between mb-3">

                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">

                      <a href={`/events/event-${i + 2}`} className="hover:text-purple-600">

                        {i % 4 === 0 ? "Workshop Énergie Solaire Pratique" :
                         i % 4 === 1 ? "Forum Finance Verte Afrique" :
                         i % 4 === 2 ? "Hackathon Innovation Climat" :
                         "Formation Certification Carbone"}
                      </a>
                    </h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">

                      <span><i className="fas fa-clock mr-1"></i>{i % 2 === 0 ? "09:00 - 12:00" : "14:00 - 18:00"}</span>
                      <span><i className="fas fa-map-marker-alt mr-1"></i>
                        {i % 3 === 0 ? "Accra, Ghana" : i % 3 === 1 ? "Nairobi, Kenya" : "Casablanca, Maroc"}
                      </span>
                      <span><i className="fas fa-users mr-1"></i>{Math.floor(Math.random() * 200) + 50} participants</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">

                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      i % 4 === 0 ? 'bg-green-100 text-green-800' :
                      i % 4 === 1 ? 'bg-blue-100 text-blue-800' :
                      i % 4 === 2 ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {i % 4 === 0 ? 'Workshop' : i % 4 === 1 ? 'Forum' : i % 4 === 2 ? 'Hackathon' : 'Formation'}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded ${
                      i % 2 === 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {i % 2 === 0 ? 'Gratuit' : 'Payant'}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">

                  Description de l'événement avec les informations essentielles sur le contenu, 
                  les objectifs et la valeur ajoutée pour les participants.
                </p>
                
                <div className="flex items-center justify-between">

                  <div className="text-sm text-gray-600">

                    {Math.random() > 0.5 ? (
                      <span className="text-orange-600 font-medium">{Math.floor(Math.random() * 50)} places restantes</span>
                    ) : (
                      <span className="text-green-600 font-medium">Places disponibles</span>
                    )}
                  </div>
                  <a href={`/events/event-${i + 2}`} 
                     className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium">

                    {i % 2 === 0 ? 'S\'inscrire' : `${Math.floor(Math.random() * 200) + 50}€ - S'inscrire`}
                  </a>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2">

        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">

          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="px-3 py-2 bg-purple-600 text-white rounded-lg">1</button>
        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">2</button>
        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">3</button>
        <span className="px-3 py-2 text-gray-500">...</span>
        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">8</button>
        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">

          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  )
})

export default events