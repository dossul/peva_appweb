import { Hono } from 'hono'
import { renderer } from '../renderer'

const forum = new Hono()

forum.use('*', renderer)

// Page principale du forum
forum.get('/', (c) => {
  return c.render(
    <div className="space-y-6">

      {/* En-tête Forum */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white p-6 rounded-lg">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold mb-2">

              <i className="fas fa-comments mr-2"></i>
              Forum PEVA
            </h1>
            <p className="text-indigo-100">

              Échangez, partagez et débattez avec la communauté de l'économie verte africaine
            </p>
          </div>
          <a href="/forum/new-topic" className="bg-white text-indigo-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">

            <i className="fas fa-plus mr-2"></i>
            Nouveau Sujet
          </a>
        </div>
      </div>

      {/* Statistiques du forum */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">

          <div className="flex items-center">

            <i className="fas fa-comments text-blue-600 text-2xl mr-3"></i>
            <div>
              <p className="text-sm text-gray-600">Discussions actives</p>
              <p className="text-xl font-bold text-gray-900">1,247</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">

          <div className="flex items-center">

            <i className="fas fa-users text-green-600 text-2xl mr-3"></i>
            <div>
              <p className="text-sm text-gray-600">Membres actifs</p>
              <p className="text-xl font-bold text-gray-900">3,456</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">

          <div className="flex items-center">

            <i className="fas fa-reply text-purple-600 text-2xl mr-3"></i>
            <div>
              <p className="text-sm text-gray-600">Réponses aujourd'hui</p>
              <p className="text-xl font-bold text-gray-900">89</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">

          <div className="flex items-center">

            <i className="fas fa-fire text-orange-600 text-2xl mr-3"></i>
            <div>
              <p className="text-sm text-gray-600">Sujets tendance</p>
              <p className="text-xl font-bold text-gray-900">12</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation des catégories */}
      <div className="bg-white rounded-lg shadow p-6">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-lg font-medium text-gray-900">Catégories du Forum</h2>
          <div className="flex items-center space-x-3">

            <div className="relative">

              <input type="text" placeholder="Rechercher dans le forum..." 
                     className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent">

              <option value="recent">Plus récent</option>
              <option value="popular">Plus populaire</option>
              <option value="replies">Plus de réponses</option>
              <option value="views">Plus vues</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Énergie Renouvelable */}
          <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border border-orange-200 rounded-lg p-6 hover:shadow-md transition-shadow">

            <div className="flex items-center mb-4">

              <div className="bg-orange-100 p-3 rounded-lg mr-4">

                <i className="fas fa-solar-panel text-orange-600 text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Énergie Renouvelable</h3>
                <p className="text-sm text-gray-600">Solar, éolien, hydroélectrique</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">

              <span>234 discussions</span>
              <span>1,567 messages</span>
            </div>
            <div className="text-xs text-gray-500">

              <strong>Dernier:</strong> Installation panneau solaire au Sénégal
              <div className="mt-1">Par Ahmed_Solar • il y a 2h</div>
            </div>
            <a href="/forum/category/energie-renouvelable" className="block mt-3 text-orange-600 hover:text-orange-700 font-medium text-sm">

              Explorer →
            </a>
          </div>

          {/* Agriculture Durable */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6 hover:shadow-md transition-shadow">

            <div className="flex items-center mb-4">

              <div className="bg-green-100 p-3 rounded-lg mr-4">

                <i className="fas fa-seedling text-green-600 text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Agriculture Durable</h3>
                <p className="text-sm text-gray-600">Permaculture, irrigation, tech</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">

              <span>189 discussions</span>
              <span>1,234 messages</span>
            </div>
            <div className="text-xs text-gray-500">

              <strong>Dernier:</strong> IoT pour l'irrigation intelligente
              <div className="mt-1">Par Marie_AgriTech • il y a 4h</div>
            </div>
            <a href="/forum/category/agriculture-durable" className="block mt-3 text-green-600 hover:text-green-700 font-medium text-sm">

              Explorer →
            </a>
          </div>

          {/* Finance Verte */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6 hover:shadow-md transition-shadow">

            <div className="flex items-center mb-4">

              <div className="bg-blue-100 p-3 rounded-lg mr-4">

                <i className="fas fa-coins text-blue-600 text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Finance Verte</h3>
                <p className="text-sm text-gray-600">Investissement, financement</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">

              <span>156 discussions</span>
              <span>987 messages</span>
            </div>
            <div className="text-xs text-gray-500">

              <strong>Dernier:</strong> Lever des fonds pour projet vert
              <div className="mt-1">Par Sarah_Investor • il y a 1h</div>
            </div>
            <a href="/forum/category/finance-verte" className="block mt-3 text-blue-600 hover:text-blue-700 font-medium text-sm">

              Explorer →
            </a>
          </div>

          {/* Transport Vert */}
          <div className="bg-gradient-to-br from-purple-50 to-violet-50 border border-purple-200 rounded-lg p-6 hover:shadow-md transition-shadow">

            <div className="flex items-center mb-4">

              <div className="bg-purple-100 p-3 rounded-lg mr-4">

                <i className="fas fa-charging-station text-purple-600 text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Transport Vert</h3>
                <p className="text-sm text-gray-600">Électrique, mobilité durable</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">

              <span>98 discussions</span>
              <span>654 messages</span>
            </div>
            <div className="text-xs text-gray-500">

              <strong>Dernier:</strong> Bornes de recharge au Ghana
              <div className="mt-1">Par Kwame_EV • il y a 3h</div>
            </div>
            <a href="/forum/category/transport-vert" className="block mt-3 text-purple-600 hover:text-purple-700 font-medium text-sm">

              Explorer →
            </a>
          </div>

          {/* Économie Circulaire */}
          <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-lg p-6 hover:shadow-md transition-shadow">

            <div className="flex items-center mb-4">

              <div className="bg-teal-100 p-3 rounded-lg mr-4">

                <i className="fas fa-recycle text-teal-600 text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Économie Circulaire</h3>
                <p className="text-sm text-gray-600">Recyclage, réutilisation</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">

              <span>123 discussions</span>
              <span>789 messages</span>
            </div>
            <div className="text-xs text-gray-500">

              <strong>Dernier:</strong> Startup de recyclage plastique
              <div className="mt-1">Par Fatima_Recycle • il y a 5h</div>
            </div>
            <a href="/forum/category/economie-circulaire" className="block mt-3 text-teal-600 hover:text-teal-700 font-medium text-sm">

              Explorer →
            </a>
          </div>

          {/* Innovation & Tech */}
          <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-200 rounded-lg p-6 hover:shadow-md transition-shadow">

            <div className="flex items-center mb-4">

              <div className="bg-pink-100 p-3 rounded-lg mr-4">

                <i className="fas fa-lightbulb text-pink-600 text-xl"></i>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Innovation & Tech</h3>
                <p className="text-sm text-gray-600">IA, IoT, blockchain</p>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">

              <span>167 discussions</span>
              <span>1,123 messages</span>
            </div>
            <div className="text-xs text-gray-500">

              <strong>Dernier:</strong> IA pour prédiction climatique
              <div className="mt-1">Par Dr_AI_Green • il y a 30min</div>
            </div>
            <a href="/forum/category/innovation-tech" className="block mt-3 text-pink-600 hover:text-pink-700 font-medium text-sm">

              Explorer →
            </a>
          </div>
        </div>
      </div>

      {/* Discussions populaires et récentes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Discussions populaires */}
        <div className="bg-white rounded-lg shadow p-6">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-lg font-semibold text-gray-900">

              <i className="fas fa-fire mr-2 text-orange-500"></i>
              Discussions Populaires
            </h2>
            <a href="/forum/popular" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">

              Voir toutes →
            </a>
          </div>

          <div className="space-y-4">

            <div className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">

              <div className="flex items-start space-x-3">

                <img src="https://ui-avatars.com/api/?name=Amina+Kone&background=10b981&color=fff" 
                     alt="Amina Koné" className="w-10 h-10 rounded-full" />
                <div className="flex-1">

                  <h3 className="font-medium text-gray-900 mb-1">

                    <a href="/forum/topic/financement-startup-solaire-cote-ivoire" className="hover:text-indigo-600">

                      Conseils pour financer une startup solaire en Côte d'Ivoire 🔥
                    </a>
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">

                    <span>Par Amina_Entrepreneur</span>
                    <span>•</span>
                    <span>Finance Verte</span>
                    <span>•</span>
                    <span>47 réponses</span>
                    <span>•</span>
                    <span>2.3k vues</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">

                    Je lance une startup de panneaux solaires résidentiels en Côte d'Ivoire. 
                    Quelqu'un a de l'expérience avec les investisseurs verts locaux ?
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">

              <div className="flex items-start space-x-3">

                <img src="https://ui-avatars.com/api/?name=Ahmed+Ben+Ali&background=3b82f6&color=fff" 
                     alt="Ahmed Ben Ali" className="w-10 h-10 rounded-full" />
                <div className="flex-1">

                  <h3 className="font-medium text-gray-900 mb-1">

                    <a href="/forum/topic/ia-agriculture-prediction-rendements" className="hover:text-indigo-600">

                      IA pour prédiction des rendements agricoles au Maroc
                    </a>
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">

                    <span>Par Ahmed_AgriAI</span>
                    <span>•</span>
                    <span>Innovation & Tech</span>
                    <span>•</span>
                    <span>32 réponses</span>
                    <span>•</span>
                    <span>1.8k vues</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">

                    Développement d'un système IA pour prédire les rendements des cultures. 
                    Retours d'expérience sur datasets et modèles performants ?
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">

              <div className="flex items-start space-x-3">

                <img src="https://ui-avatars.com/api/?name=Sarah+Okoye&background=8b5cf6&color=fff" 
                     alt="Sarah Okoye" className="w-10 h-10 rounded-full" />
                <div className="flex-1">

                  <h3 className="font-medium text-gray-900 mb-1">

                    <a href="/forum/topic/recyclage-plastique-startup-lagos" className="hover:text-indigo-600">

                      Startup recyclage plastique à Ouagadougou - Recherche partenaires
                    </a>
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">

                    <span>Par Sarah_EcoPlastic</span>
                    <span>•</span>
                    <span>Économie Circulaire</span>
                    <span>•</span>
                    <span>28 réponses</span>
                    <span>•</span>
                    <span>1.5k vues</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">

                    Nous transformons les déchets plastiques en granulés. 
                    Recherche partenaires techniques et distributeurs en Afrique de l'Ouest.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Discussions récentes */}
        <div className="bg-white rounded-lg shadow p-6">

          <div className="flex items-center justify-between mb-6">

            <h2 className="text-lg font-semibold text-gray-900">

              <i className="fas fa-clock mr-2 text-green-500"></i>
              Discussions Récentes
            </h2>
            <a href="/forum/recent" className="text-indigo-600 hover:text-indigo-700 text-sm font-medium">

              Voir toutes →
            </a>
          </div>

          <div className="space-y-4">

            <div className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">

              <div className="flex items-start space-x-3">

                <img src="https://ui-avatars.com/api/?name=Marie+Diop&background=f59e0b&color=fff" 
                     alt="Marie Diop" className="w-10 h-10 rounded-full" />
                <div className="flex-1">

                  <h3 className="font-medium text-gray-900 mb-1">

                    <a href="/forum/topic/formation-certification-carbone-ghana" className="hover:text-indigo-600">

                      Formation certification carbone au Ghana
                    </a>
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">

                    <span>Par Marie_Carbon</span>
                    <span>•</span>
                    <span>Finance Verte</span>
                    <span>•</span>
                    <span>il y a 30 min</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">

                    Quelqu'un connaît des organismes sérieux pour se former à la certification carbone au Ghana ?
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">

              <div className="flex items-start space-x-3">

                <img src="https://ui-avatars.com/api/?name=Kwame+Asante&background=ef4444&color=fff" 
                     alt="Kwame Asante" className="w-10 h-10 rounded-full" />
                <div className="flex-1">

                  <h3 className="font-medium text-gray-900 mb-1">

                    <a href="/forum/topic/bornes-recharge-vehicules-electriques" className="hover:text-indigo-600">

                      Installation bornes de recharge véhicules électriques
                    </a>
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">

                    <span>Par Kwame_EV</span>
                    <span>•</span>
                    <span>Transport Vert</span>
                    <span>•</span>
                    <span>il y a 1h</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">

                    Projet d'installation de bornes de recharge rapide. Conseils sur réglementation et fournisseurs ?
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">

              <div className="flex items-start space-x-3">

                <img src="https://ui-avatars.com/api/?name=Fatima+Hassan&background=06b6d4&color=fff" 
                     alt="Fatima Hassan" className="w-10 h-10 rounded-full" />
                <div className="flex-1">

                  <h3 className="font-medium text-gray-900 mb-1">

                    <a href="/forum/topic/iot-irrigation-intelligente-senegal" className="hover:text-indigo-600">

                      IoT pour irrigation intelligente au Sénégal
                    </a>
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">

                    <span>Par Fatima_IoT</span>
                    <span>•</span>
                    <span>Agriculture Durable</span>
                    <span>•</span>
                    <span>il y a 2h</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">

                    Développement capteurs IoT pour optimiser l'irrigation. Qui utilise déjà ces technologies ?
                  </p>
                </div>
              </div>
            </div>

            <div className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">

              <div className="flex items-start space-x-3">

                <img src="https://ui-avatars.com/api/?name=John+Mbeki&background=10b981&color=fff" 
                     alt="John Mbeki" className="w-10 h-10 rounded-full" />
                <div className="flex-1">

                  <h3 className="font-medium text-gray-900 mb-1">

                    <a href="/forum/topic/mini-grid-solaire-rural-kenya" className="hover:text-indigo-600">

                      Mini-grid solaire en zone rurale au Kenya
                    </a>
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">

                    <span>Par John_Solar</span>
                    <span>•</span>
                    <span>Énergie Renouvelable</span>
                    <span>•</span>
                    <span>il y a 3h</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">

                    Implémentation mini-grid solaire pour village isolé. Retours d'expérience sur modèles économiques ?
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Membres actifs et experts */}
      <div className="bg-white rounded-lg shadow p-6">

        <h2 className="text-lg font-semibold text-gray-900 mb-6">

          <i className="fas fa-users mr-2 text-indigo-600"></i>
          Membres Actifs de la Communauté
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="text-center">

            <img src="https://ui-avatars.com/api/?name=Dr.+Expert&background=10b981&color=fff" 
                 alt="Expert" className="w-16 h-16 rounded-full mx-auto mb-3" />
            <h3 className="font-medium text-gray-900">Dr. Amina Koné</h3>
            <p className="text-sm text-gray-600 mb-2">Expert Finance Verte</p>
            <div className="flex items-center justify-center space-x-3 text-xs text-gray-500">

              <span><i className="fas fa-comments mr-1"></i>247 posts</span>
              <span><i className="fas fa-heart mr-1"></i>1.2k likes</span>
            </div>
            <div className="mt-2">

              <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Expert Certifié</span>
            </div>
          </div>

          <div className="text-center">

            <img src="https://ui-avatars.com/api/?name=Marie+Startup&background=3b82f6&color=fff" 
                 alt="Marie" className="w-16 h-16 rounded-full mx-auto mb-3" />
            <h3 className="font-medium text-gray-900">Marie Diop</h3>
            <p className="text-sm text-gray-600 mb-2">Entrepreneure AgriTech</p>
            <div className="flex items-center justify-center space-x-3 text-xs text-gray-500">

              <span><i className="fas fa-comments mr-1"></i>189 posts</span>
              <span><i className="fas fa-heart mr-1"></i>956 likes</span>
            </div>
            <div className="mt-2">

              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Contributeur</span>
            </div>
          </div>

          <div className="text-center">

            <img src="https://ui-avatars.com/api/?name=Ahmed+Tech&background=8b5cf6&color=fff" 
                 alt="Ahmed" className="w-16 h-16 rounded-full mx-auto mb-3" />
            <h3 className="font-medium text-gray-900">Ahmed Ben Ali</h3>
            <p className="text-sm text-gray-600 mb-2">Développeur IoT</p>
            <div className="flex items-center justify-center space-x-3 text-xs text-gray-500">

              <span><i className="fas fa-comments mr-1"></i>156 posts</span>
              <span><i className="fas fa-heart mr-1"></i>743 likes</span>
            </div>
            <div className="mt-2">

              <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Modérateur</span>
            </div>
          </div>

          <div className="text-center">

            <img src="https://ui-avatars.com/api/?name=Sarah+Invest&background=f59e0b&color=fff" 
                 alt="Sarah" className="w-16 h-16 rounded-full mx-auto mb-3" />
            <h3 className="font-medium text-gray-900">Sarah Okoye</h3>
            <p className="text-sm text-gray-600 mb-2">Investisseuse Impact</p>
            <div className="flex items-center justify-center space-x-3 text-xs text-gray-500">

              <span><i className="fas fa-comments mr-1"></i>134 posts</span>
              <span><i className="fas fa-heart mr-1"></i>892 likes</span>
            </div>
            <div className="mt-2">

              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Mentor</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

// Page de création de nouveau sujet
forum.get('/new-topic', (c) => {
  return c.render(
    <div className="max-w-4xl mx-auto">

      <div className="bg-white shadow rounded-lg">

        <div className="px-6 py-4 border-b border-gray-200">

          <h1 className="text-xl font-semibold text-gray-900">

            <i className="fas fa-plus-circle mr-2 text-indigo-600"></i>
            Créer un Nouveau Sujet
          </h1>
          <p className="mt-1 text-sm text-gray-600">

            Partagez vos questions, expériences et idées avec la communauté PEVA
          </p>
        </div>

        <form className="px-6 py-6 space-y-6">

          {/* Informations de base */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Catégorie *</label>
                <select required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">

                  <option value="">Sélectionner une catégorie</option>
                  <option value="energie_renouvelable">Énergie Renouvelable</option>
                  <option value="agriculture_durable">Agriculture Durable</option>
                  <option value="finance_verte">Finance Verte</option>
                  <option value="transport_vert">Transport Vert</option>
                  <option value="economie_circulaire">Économie Circulaire</option>
                  <option value="innovation_tech">Innovation & Tech</option>
                  <option value="politique_environnementale">Politique Environnementale</option>
                  <option value="formations_carrieres">Formations & Carrières</option>
                  <option value="general">Général</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de Discussion</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent">

                  <option value="question">Question</option>
                  <option value="discussion">Discussion</option>
                  <option value="partage_experience">Partage d'Expérience</option>
                  <option value="recherche_partenaire">Recherche Partenaire</option>
                  <option value="offre_emploi">Offre d'Emploi</option>
                  <option value="annonce">Annonce</option>
                </select>
              </div>
            </div>

            <div className="mt-4">

              <label className="block text-sm font-medium text-gray-700 mb-2">Titre du Sujet *</label>
              <input type="text" required
                     placeholder="Ex: Conseils pour financer une startup solaire en Côte d'Ivoire"
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
              <p className="mt-1 text-xs text-gray-500">

                Soyez précis et descriptif pour attirer les bonnes réponses
              </p>
            </div>
          </div>

          {/* Contenu */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
            <div className="border border-gray-300 rounded-lg">

              {/* Barre d'outils de formatage */}
              <div className="border-b border-gray-200 p-3">

                <div className="flex items-center space-x-2">

                  <button type="button" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="Gras">
                    <i className="fas fa-bold"></i>
                  </button>
                  <button type="button" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="Italique">
                    <i className="fas fa-italic"></i>
                  </button>
                  <button type="button" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="Souligné">
                    <i className="fas fa-underline"></i>
                  </button>
                  <div className="border-l border-gray-300 h-6 mx-2"></div>
                  <button type="button" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="Liste">
                    <i className="fas fa-list-ul"></i>
                  </button>
                  <button type="button" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="Liste numérotée">
                    <i className="fas fa-list-ol"></i>
                  </button>
                  <div className="border-l border-gray-300 h-6 mx-2"></div>
                  <button type="button" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="Lien">
                    <i className="fas fa-link"></i>
                  </button>
                  <button type="button" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="Image">
                    <i className="fas fa-image"></i>
                  </button>
                  <button type="button" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="Code">
                    <i className="fas fa-code"></i>
                  </button>
                </div>
              </div>
              
              <textarea rows="12" required
                        placeholder="Décrivez votre question, partagez votre expérience, ou lancez une discussion...&#10;&#10;Conseils:&#10;- Soyez précis et détaillé&#10;- Mentionnez votre contexte (pays, secteur, taille entreprise...)&#10;- Partagez des exemples concrets&#10;- Posez des questions spécifiques"
                        className="w-full px-4 py-3 border-0 focus:ring-0 resize-none"></textarea>
            </div>
            <p className="mt-1 text-xs text-gray-500">

              Markdown supporté. Utilisez ** pour le gras, * pour l'italique, `code` pour le code inline.
            </p>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags (optionnel)</label>
            <input type="text" 
                   placeholder="startup, financement, solaire, côte-d'ivoire"
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
            <p className="mt-1 text-xs text-gray-500">

              Séparez les tags par des virgules. Maximum 5 tags.
            </p>
          </div>

          {/* Pièces jointes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Pièces Jointes (optionnel)</label>
            <div className="border-2 border-gray-300 border-dashed rounded-lg p-4">

              <input type="file" multiple accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                     className="w-full" />
              <p className="text-xs text-gray-500 mt-1">

                Images, PDF, Word, Excel (max. 10MB par fichier, 5 fichiers maximum)
              </p>
            </div>
          </div>

          {/* Options */}
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Options</h3>
            <div className="space-y-3">

              <label className="flex items-center">

                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="ml-2 text-sm text-gray-700">Recevoir des notifications par email pour les réponses</span>
              </label>

              <label className="flex items-center">

                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="ml-2 text-sm text-gray-700">Épingler ce sujet (modérateurs uniquement)</span>
              </label>

              <label className="flex items-center">

                <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                <span className="ml-2 text-sm text-gray-700">Fermer les commentaires après 30 jours</span>
              </label>
            </div>
          </div>

          {/* Aperçu et publication */}
          <div className="border-t border-gray-200 pt-6">

            <div className="flex items-center justify-between">

              <div className="flex items-center space-x-3">

                <button type="button" className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">

                  <i className="fas fa-eye mr-2"></i>
                  Aperçu
                </button>
                <button type="button" className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">

                  <i className="fas fa-save mr-2"></i>
                  Enregistrer Brouillon
                </button>
              </div>
              <div className="flex items-center space-x-3">

                <a href="/forum" className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">

                  Annuler
                </a>
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">

                  <i className="fas fa-paper-plane mr-2"></i>
                  Publier le Sujet
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
})

// Page de détail d'un sujet de forum
forum.get('/topic/:id', (c) => {
  const topicId = c.req.param('id')
  
  return c.render(
    <div className="max-w-6xl mx-auto">

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Contenu principal */}
        <div className="lg:col-span-3 space-y-6">

          {/* Navigation breadcrumb */}
          <nav className="text-sm text-gray-600">

            <a href="/forum" className="hover:text-indigo-600">Forum</a>
            <span className="mx-2">›</span>
            <a href="/forum/category/finance-verte" className="hover:text-indigo-600">Finance Verte</a>
            <span className="mx-2">›</span>
            <span className="text-gray-900">Conseils pour financer une startup solaire</span>
          </nav>

          {/* En-tête du sujet */}
          <div className="bg-white rounded-lg shadow p-6">

            <div className="flex items-start justify-between mb-4">

              <div className="flex items-center space-x-3">

                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">Finance Verte</span>
                <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">Question</span>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">Résolu</span>
              </div>
              <div className="flex items-center space-x-2">

                <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors" title="Suivre">
                  <i className="far fa-bell"></i>
                </button>
                <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors" title="Partager">
                  <i className="fas fa-share-alt"></i>
                </button>
                <button className="p-2 text-gray-400 hover:text-indigo-600 transition-colors" title="Plus d'options">
                  <i className="fas fa-ellipsis-v"></i>
                </button>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-4">

              Conseils pour financer une startup solaire en Côte d'Ivoire 🔥
            </h1>

            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-6">

              <div className="flex items-center">

                <i className="fas fa-eye mr-2"></i>
                2,341 vues
              </div>
              <div className="flex items-center">

                <i className="fas fa-reply mr-2"></i>
                47 réponses
              </div>
              <div className="flex items-center">

                <i className="fas fa-heart mr-2"></i>
                89 likes
              </div>
              <div className="flex items-center">

                <i className="fas fa-clock mr-2"></i>
                Créé il y a 3 jours
              </div>
            </div>

            {/* Message original */}
            <div className="border-l-4 border-indigo-500 pl-6">

              <div className="flex items-start space-x-3 mb-4">

                <img src="https://ui-avatars.com/api/?name=Amina+Kone&background=10b981&color=fff" 
                     alt="Amina Koné" className="w-12 h-12 rounded-full" />

                <div>
                  <div className="flex items-center space-x-2">

                    <h3 className="font-medium text-gray-900">Amina Koné</h3>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Auteur</span>
                    <span className="text-sm text-gray-500">il y a 3 jours</span>
                  </div>
                  <p className="text-sm text-gray-600">Entrepreneure • Abidjan, Côte d'Ivoire • 156 posts</p>
                </div>
              </div>

              <div className="prose max-w-none">

                <p className="text-gray-700 leading-relaxed mb-4">

                  Bonjour la communauté PEVA ! 👋
                </p>
                
                <p className="text-gray-700 leading-relaxed mb-4">

                  Je lance une startup de panneaux solaires résidentiels en Côte d'Ivoire et je recherche des conseils 
                  pour le financement. Nous avons développé un business plan solide et identifié un marché prometteur, 
                  mais nous avons besoin de <strong>500k EUR</strong> pour démarrer les opérations.
                </p>

                <p className="text-gray-700 leading-relaxed mb-4">

                  <strong>Notre projet:</strong>
                </p>
                <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">

                  <li>Installation et maintenance de systèmes solaires résidentiels</li>
                  <li>Financement participatif pour les ménages (pay-as-you-go)</li>
                  <li>Partenariats avec constructeurs locaux</li>
                  <li>Formation technique des installateurs locaux</li>
                </ul>

                <p className="text-gray-700 leading-relaxed mb-4">

                  <strong>Questions spécifiques:</strong>
                </p>
                <ol className="list-decimal list-inside text-gray-700 mb-4 space-y-1">

                  <li>Quelqu'un a de l'expérience avec les <strong>investisseurs verts</strong> en Afrique de l'Ouest ?</li>
                  <li>Quels sont les <strong>critères principaux</strong> qu'ils regardent ?</li>
                  <li>Y a-t-il des <strong>subventions gouvernementales</strong> spécifiques en Côte d'Ivoire ?</li>
                  <li>Des retours sur les <strong>fonds d'impact</strong> comme Oikocredit ou I&P ?</li>
                </ol>

                <p className="text-gray-700 leading-relaxed">

                  Merci d'avance pour vos conseils ! N'hésitez pas à me contacter en privé si vous avez des 
                  contacts ou des informations confidentielles à partager. 🙏
                </p>
              </div>

              <div className="flex items-center space-x-6 mt-6 pt-4 border-t border-gray-200">

                <button className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">

                  <i className="far fa-thumbs-up"></i>
                  <span>Like (89)</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">

                  <i className="fas fa-reply"></i>
                  <span>Répondre</span>
                </button>
                <button className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">

                  <i className="fas fa-quote-right"></i>
                  <span>Citer</span>
                </button>
              </div>
            </div>
          </div>

          {/* Réponses */}
          <div className="bg-white rounded-lg shadow p-6">

            <div className="flex items-center justify-between mb-6">

              <h2 className="text-lg font-semibold text-gray-900">47 Réponses</h2>
              <div className="flex items-center space-x-2">

                <span className="text-sm text-gray-600">Trier par:</span>
                <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent">

                  <option value="recent">Plus récent</option>
                  <option value="popular">Plus populaire</option>
                  <option value="oldest">Plus ancien</option>
                </select>
              </div>
            </div>

            <div className="space-y-6">

              {/* Réponse 1 - Meilleure réponse */}
              <div className="border-l-4 border-green-500 pl-6 bg-green-50 p-4 rounded-r-lg">

                <div className="flex items-start justify-between mb-3">

                  <div className="flex items-start space-x-3">

                    <img src="https://ui-avatars.com/api/?name=Sarah+Investor&background=3b82f6&color=fff" 
                         alt="Sarah Okoye" className="w-10 h-10 rounded-full" />
                    <div>
                      <div className="flex items-center space-x-2">

                        <h4 className="font-medium text-gray-900">Sarah Okoye</h4>
                        <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Meilleure Réponse</span>
                        <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Expert Certifié</span>
                        <span className="text-sm text-gray-500">il y a 2 jours</span>
                      </div>
                      <p className="text-sm text-gray-600">Investisseuse Impact • Ouagadougou, Burkina Faso • 287 posts</p>
                    </div>
                  </div>
                  <button className="text-green-600 hover:text-green-700">

                    <i className="fas fa-check-circle"></i>
                  </button>
                </div>

                <div className="prose max-w-none">

                  <p className="text-gray-700 mb-3">

                    Salut Amina ! 👋 Excellente initiative, le marché solaire résidentiel en Côte d'Ivoire est très prometteur.
                  </p>
                  
                  <p className="text-gray-700 mb-3">

                    <strong>Pour répondre à tes questions :</strong>
                  </p>

                  <p className="text-gray-700 mb-2">

                    <strong>1. Investisseurs verts en Afrique de l'Ouest :</strong>
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mb-3 ml-4">

                    <li><strong>I&P (Investisseurs & Partenaires)</strong> - Excellent pour l'Afrique francophone</li>
                    <li><strong>Oikocredit</strong> - Spécialisés dans l'inclusion financière et l'énergie</li>
                    <li><strong>Persistent Energy Capital</strong> - Focus sur l'énergie distribuée</li>
                    <li><strong>Energy Access Ventures</strong> - Early stage, parfait pour ton profil</li>
                  </ul>

                  <p className="text-gray-700 mb-2">

                    <strong>2. Critères principaux :</strong>
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mb-3 ml-4">

                    <li>Impact social mesurable (nb de foyers électrifiés)</li>
                    <li>Modèle économique viable (unit economics solides)</li>
                    <li>Équipe expérimentée avec track record</li>
                    <li>Partenariats locaux solides</li>
                    <li>Plan de scale réaliste</li>
                  </ul>

                  <p className="text-gray-700 mb-3">

                    <strong>3. Subventions CI :</strong> Le gouvernement ivoirien a lancé le programme PERAC 
                    (Programme d'Électrification Rurale par l'Approche Communautaire). Contacte aussi l'ANARE 
                    (Autorité Nationale de Régulation de l'Électricité).
                  </p>

                  <p className="text-gray-700">

                    Je peux te faire une intro avec quelques contacts chez I&P si tu veux. Écris-moi en privé ! 📧
                  </p>
                </div>

                <div className="flex items-center space-x-6 mt-4 pt-3 border-t border-green-200">

                  <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">

                    <i className="far fa-thumbs-up"></i>
                    <span>Like (34)</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-green-600 transition-colors">

                    <i className="fas fa-reply"></i>
                    <span>Répondre</span>
                  </button>
                </div>
              </div>

              {/* Réponse 2 */}
              <div className="border-l-4 border-gray-200 pl-6">

                <div className="flex items-start space-x-3 mb-3">

                  <img src="https://ui-avatars.com/api/?name=Ahmed+Expert&background=f59e0b&color=fff" 
                       alt="Ahmed Ben Ali" className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="flex items-center space-x-2">

                      <h4 className="font-medium text-gray-900">Ahmed Ben Ali</h4>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Modérateur</span>
                      <span className="text-sm text-gray-500">il y a 2 jours</span>
                    </div>
                    <p className="text-sm text-gray-600">Entrepreneur Solar • Casablanca, Maroc • 198 posts</p>
                  </div>
                </div>

                <div className="prose max-w-none">

                  <p className="text-gray-700 mb-3">

                    Super projet Amina ! J'ai levé 300k EUR l'année dernière pour une activité similaire au Maroc. 
                    Quelques conseils complémentaires :
                  </p>

                  <p className="text-gray-700 mb-2">

                    <strong>Prépare ton dossier :</strong>
                  </p>
                  <ul className="list-disc list-inside text-gray-700 mb-3 ml-4">

                    <li>Projections financières sur 5 ans avec scénarios conservateur/optimiste</li>
                    <li>Étude de marché locale détaillée (tarifs électricité, pouvoir d'achat...)</li>
                    <li>Pilote avec 10-20 installations pour prouver le concept</li>
                    <li>Partenariats signés (fournisseurs, distributeurs, financeurs pay-as-you-go)</li>
                  </ul>

                  <p className="text-gray-700 mb-3">

                    <strong>Timeline réaliste :</strong> Compte 6-12 mois pour lever. Commence par des grants 
                    (50-100k EUR) pour financer ton pilote, puis lève ensuite.
                  </p>

                  <p className="text-gray-700">

                    N'hésite pas si tu as des questions sur la structuration ! 💪
                  </p>
                </div>

                <div className="flex items-center space-x-6 mt-4 pt-3 border-t border-gray-200">

                  <button className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">

                    <i className="far fa-thumbs-up"></i>
                    <span>Like (18)</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">

                    <i className="fas fa-reply"></i>
                    <span>Répondre</span>
                  </button>
                </div>
              </div>

              {/* Réponse 3 */}
              <div className="border-l-4 border-gray-200 pl-6">

                <div className="flex items-start space-x-3 mb-3">

                  <img src="https://ui-avatars.com/api/?name=Marie+Finance&background=8b5cf6&color=fff" 
                       alt="Marie Diop" className="w-10 h-10 rounded-full" />
                  <div>
                    <div className="flex items-center space-x-2">

                      <h4 className="font-medium text-gray-900">Marie Diop</h4>
                      <span className="text-sm text-gray-500">il y a 1 jour</span>
                    </div>
                    <p className="text-sm text-gray-600">Consultante Finance • Dakar, Sénégal • 89 posts</p>
                  </div>
                </div>

                <div className="prose max-w-none">

                  <p className="text-gray-700 mb-3">

                    Amina, regarde aussi du côté de la <strong>BOAD</strong> (Banque Ouest Africaine de Développement) 
                    et du <strong>Fonds Vert pour le Climat</strong>. Ils financent spécifiquement ce type de projets 
                    en Afrique de l'Ouest.
                  </p>

                  <p className="text-gray-700">

                    La <strong>BAfD</strong> a aussi un programme d'électrification rurale avec des conditions 
                    très avantageuses. Ton business model pay-as-you-go devrait les intéresser ! 🎯
                  </p>
                </div>

                <div className="flex items-center space-x-6 mt-4 pt-3 border-t border-gray-200">

                  <button className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">

                    <i className="far fa-thumbs-up"></i>
                    <span>Like (12)</span>
                  </button>
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-indigo-600 transition-colors">

                    <i className="fas fa-reply"></i>
                    <span>Répondre</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Plus de réponses */}
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">

              <button className="text-indigo-600 hover:text-indigo-700 font-medium">

                Voir les 44 autres réponses →
              </button>
            </div>
          </div>

          {/* Formulaire de réponse */}
          <div className="bg-white rounded-lg shadow p-6">

            <h3 className="text-lg font-semibold text-gray-900 mb-4">Ajouter une Réponse</h3>
            
            <form className="space-y-4">

              <div className="border border-gray-300 rounded-lg">

                {/* Barre d'outils simplifiée */}
                <div className="border-b border-gray-200 p-3">

                  <div className="flex items-center space-x-2">

                    <button type="button" className="p-1 text-gray-600 hover:text-gray-900 rounded" title="Gras">
                      <i className="fas fa-bold"></i>
                    </button>
                    <button type="button" className="p-1 text-gray-600 hover:text-gray-900 rounded" title="Italique">
                      <i className="fas fa-italic"></i>
                    </button>
                    <button type="button" className="p-1 text-gray-600 hover:text-gray-900 rounded" title="Lien">
                      <i className="fas fa-link"></i>
                    </button>
                    <button type="button" className="p-1 text-gray-600 hover:text-gray-900 rounded" title="Code">
                      <i className="fas fa-code"></i>
                    </button>
                  </div>
                </div>
                
                <textarea rows="6" 
                          placeholder="Partagez votre expérience, vos conseils ou posez une question de suivi..."
                          className="w-full px-4 py-3 border-0 focus:ring-0 resize-none"></textarea>
              </div>
              
              <div className="flex items-center justify-between">

                <label className="flex items-center">

                  <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                  <span className="ml-2 text-sm text-gray-700">Recevoir les notifications de réponses</span>
                </label>
                
                <button type="submit" className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">

                  <i className="fas fa-reply mr-2"></i>
                  Publier la Réponse
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Informations du sujet */}
          <div className="bg-white rounded-lg shadow p-6">

            <h3 className="font-semibold text-gray-900 mb-4">Informations</h3>
            <div className="space-y-3 text-sm">

              <div className="flex items-center justify-between">

                <span className="text-gray-600">Auteur:</span>
                <span className="font-medium text-gray-900">Amina Koné</span>
              </div>
              <div className="flex items-center justify-between">

                <span className="text-gray-600">Créé:</span>
                <span className="font-medium text-gray-900">15 Mars 2024</span>
              </div>
              <div className="flex items-center justify-between">

                <span className="text-gray-600">Dernière activité:</span>
                <span className="font-medium text-gray-900">il y a 2h</span>
              </div>
              <div className="flex items-center justify-between">

                <span className="text-gray-600">Participants:</span>
                <span className="font-medium text-gray-900">23 membres</span>
              </div>
            </div>
          </div>

          {/* Sujets similaires */}
          <div className="bg-white rounded-lg shadow p-6">

            <h3 className="font-semibold text-gray-900 mb-4">Sujets Similaires</h3>
            <div className="space-y-3">

              <a href="/forum/topic/subventions-energie-solaire-ghana" className="block text-sm">

                <h4 className="font-medium text-gray-900 hover:text-indigo-600 mb-1">

                  Subventions énergie solaire au Ghana
                </h4>
                <p className="text-xs text-gray-500">12 réponses • 456 vues</p>
              </a>
              
              <a href="/forum/topic/business-plan-startup-verte" className="block text-sm">

                <h4 className="font-medium text-gray-900 hover:text-indigo-600 mb-1">

                  Template business plan startup verte
                </h4>
                <p className="text-xs text-gray-500">28 réponses • 1.2k vues</p>
              </a>
              
              <a href="/forum/topic/investisseurs-afrique-francophone" className="block text-sm">

                <h4 className="font-medium text-gray-900 hover:text-indigo-600 mb-1">

                  Liste investisseurs Afrique francophone
                </h4>
                <p className="text-xs text-gray-500">67 réponses • 3.4k vues</p>
              </a>
            </div>
          </div>

          {/* Tags du sujet */}
          <div className="bg-white rounded-lg shadow p-6">

            <h3 className="font-semibold text-gray-900 mb-4">Tags</h3>
            <div className="flex flex-wrap gap-2">

              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">#startup</span>
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">#financement</span>
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">#solaire</span>
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">#côte-d'ivoire</span>
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">#investisseurs</span>
            </div>
          </div>

          {/* Membres qui suivent */}
          <div className="bg-white rounded-lg shadow p-6">

            <h3 className="font-semibold text-gray-900 mb-4">Membres qui Suivent</h3>
            <div className="space-y-3">

              <div className="flex items-center space-x-2">

                <img src="https://ui-avatars.com/api/?name=User1&background=10b981&color=fff" 
                     alt="Follower" className="w-6 h-6 rounded-full" />

                <img src="https://ui-avatars.com/api/?name=User2&background=3b82f6&color=fff" 
                     alt="Follower" className="w-6 h-6 rounded-full" />

                <img src="https://ui-avatars.com/api/?name=User3&background=f59e0b&color=fff" 
                     alt="Follower" className="w-6 h-6 rounded-full" />

                <span className="text-sm text-gray-600">+15 autres</span>
              </div>
              <button className="w-full px-3 py-2 text-sm border border-indigo-600 text-indigo-600 rounded hover:bg-indigo-50 transition-colors">

                <i className="fas fa-bell mr-2"></i>
                Suivre ce Sujet
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

// Page de catégorie de forum
forum.get('/category/:category', (c) => {
  const category = c.req.param('category')
  
  return c.render(
    <div className="space-y-6">

      {/* En-tête de catégorie */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 p-6 rounded-lg">

        <div className="flex items-center mb-4">

          <div className="bg-orange-100 p-3 rounded-lg mr-4">

            <i className="fas fa-solar-panel text-orange-600 text-2xl"></i>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Énergie Renouvelable</h1>
            <p className="text-gray-600">Solaire, éolien, hydroélectrique et innovations énergétiques</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">

          <div>
            <span className="text-gray-600">Discussions:</span>
            <span className="font-semibold text-gray-900 ml-2">234</span>
          </div>
          <div>
            <span className="text-gray-600">Messages:</span>
            <span className="font-semibold text-gray-900 ml-2">1,567</span>
          </div>
          <div>
            <span className="text-gray-600">Membres actifs:</span>
            <span className="font-semibold text-gray-900 ml-2">456</span>
          </div>
        </div>
      </div>

      {/* Filtres et tri */}
      <div className="bg-white rounded-lg shadow p-4">

        <div className="flex items-center justify-between">

          <div className="flex items-center space-x-4">

            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent">

              <option value="all">Tous les sujets</option>
              <option value="questions">Questions</option>
              <option value="discussions">Discussions</option>
              <option value="solved">Résolus</option>
              <option value="unsolved">Non résolus</option>
            </select>
            
            <div className="flex items-center space-x-2">

              <span className="text-sm text-gray-600">Tags:</span>
              <button className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded hover:bg-orange-200 transition-colors">#solaire</button>
              <button className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded hover:bg-gray-200 transition-colors">#éolien</button>
              <button className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded hover:bg-gray-200 transition-colors">#hydroélectrique</button>
            </div>
          </div>

          <div className="flex items-center space-x-3">

            <div className="relative">

              <input type="text" placeholder="Rechercher..." 
                     className="w-48 pl-8 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent" />

              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
            <select className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent">

              <option value="recent">Plus récent</option>
              <option value="popular">Plus populaire</option>
              <option value="replies">Plus de réponses</option>
              <option value="views">Plus vues</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des sujets */}
      <div className="bg-white rounded-lg shadow">

        <div className="divide-y divide-gray-200">

          {/* Sujet épinglé */}
          <div className="p-6 bg-yellow-50">

            <div className="flex items-start space-x-4">

              <i className="fas fa-thumbtack text-yellow-600 mt-1"></i>
              <div className="flex-1">

                <div className="flex items-center space-x-2 mb-2">

                  <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-1 rounded">Épinglé</span>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">Annonce</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">

                  <a href="/forum/topic/regles-bonnes-pratiques-energie-renouvelable" className="hover:text-orange-600">

                    📋 Règles et bonnes pratiques - Catégorie Énergie Renouvelable
                  </a>
                </h3>
                <p className="text-gray-600 text-sm mb-3">

                  Merci de lire ces guidelines avant de poster dans cette catégorie. 
                  Elles vous aideront à obtenir de meilleures réponses de la communauté.
                </p>
                <div className="flex items-center space-x-4 text-sm text-gray-500">

                  <span>Par PEVA_Moderator</span>
                  <span>•</span>
                  <span>23 réponses</span>
                  <span>•</span>
                  <span>2.1k vues</span>
                  <span>•</span>
                  <span>Mis à jour il y a 1 semaine</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sujets normaux */}
          {[...Array(15)].map((_, i) => (
            <div key={i} className="p-6 hover:bg-gray-50 transition-colors">

              <div className="flex items-start space-x-4">

                <img src={`https://ui-avatars.com/api/?name=User${i}&background=${i % 2 === 0 ? '10b981' : '3b82f6'}&color=fff`} 
                     alt="User" className="w-10 h-10 rounded-full" />
                <div className="flex-1">

                  <div className="flex items-start justify-between mb-2">

                    <div>
                      <div className="flex items-center space-x-2 mb-1">

                        <span className={`text-xs font-medium px-2 py-1 rounded ${
                          i % 3 === 0 ? 'bg-green-100 text-green-800' :
                          i % 3 === 1 ? 'bg-blue-100 text-blue-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {i % 3 === 0 ? 'Résolu' : i % 3 === 1 ? 'Question' : 'Discussion'}
                        </span>
                        {i < 3 && <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded">Tendance</span>}
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">

                        <a href={`/forum/topic/sujet-${i + 1}`} className="hover:text-orange-600">

                          {i === 0 ? "Installation panneau solaire 3kW au Sénégal - Conseils ?" :
                           i === 1 ? "Comparatif onduleurs pour système off-grid" :
                           i === 2 ? "Financement micro-hydro en zone rurale" :
                           i === 3 ? "Maintenance préventive éoliennes domestiques" :
                           i === 4 ? "Stockage batteries lithium vs plomb - Retours d'expérience" :
                           `Sujet énergie renouvelable ${i + 1}`}
                        </a>
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">

                        {i === 0 ? "Je prévois installer un système solaire 3kW pour ma maison à Dakar. Quelqu'un a des recommandations pour les fournisseurs locaux ?" :
                         i === 1 ? "Recherche retours d'expérience sur les meilleurs onduleurs pour système autonome. Budget 2-3k EUR max." :
                         "Description du sujet avec questions et contexte détaillé pour avoir de bonnes réponses de la communauté..."}
                      </p>
                    </div>
                    <div className="text-right text-sm text-gray-500">

                      <div>{i < 5 ? 'il y a ' + (i + 1) + 'h' : 'il y a ' + (i + 1) + ' jours'}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">

                    <div className="flex items-center space-x-4 text-sm text-gray-500">

                      <span>Par {i % 4 === 0 ? 'Moussa_Solar' : i % 4 === 1 ? 'Fatou_Energie' : i % 4 === 2 ? 'Kofi_Green' : 'Aisha_Tech'}</span>
                      <span>•</span>
                      <span>{Math.floor(Math.random() * 50) + 5} réponses</span>
                      <span>•</span>
                      <span>{Math.floor(Math.random() * 2000) + 100} vues</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">

                      {[...Array(3)].map((_, j) => (
                        <img key={j} src={`https://ui-avatars.com/api/?name=R${j}&background=f3f4f6&color=6b7280`} 
                             alt="Participant" className="w-6 h-6 rounded-full border-2 border-white -ml-2" />

                      ))}
                      <span className="text-xs text-gray-500">+{Math.floor(Math.random() * 10) + 2}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="border-t border-gray-200 px-6 py-4">

          <div className="flex items-center justify-between">

            <div className="text-sm text-gray-600">

              Affichage 1-15 sur 234 sujets
            </div>
            <div className="flex items-center space-x-2">

              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">

                <i className="fas fa-chevron-left"></i>
              </button>
              <button className="px-3 py-2 bg-orange-600 text-white rounded-lg text-sm">1</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">2</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">3</button>
              <span className="px-3 py-2 text-gray-500 text-sm">...</span>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">16</button>
              <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm">

                <i className="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default forum