import { Hono } from 'hono'

const app = new Hono()

// Page principale de partage social
app.get('/', (c) => {
  return c.render(
    <div className="min-h-screen bg-gray-50 py-8">

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-8">

          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <i className="fas fa-share-alt mr-3 text-blue-600"></i>
            Partage depuis les Réseaux Sociaux
          </h1>
          <p className="mt-2 text-gray-600">
            Importez et partagez du contenu public depuis LinkedIn, Twitter, YouTube et d'autres plateformes
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* Actions principales */}
          <div className="lg:col-span-2 space-y-6">

            {/* Nouveau partage */}
            <div className="bg-white rounded-lg shadow p-6">

              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <i className="fas fa-plus-circle mr-2 text-green-600"></i>
                Nouveau partage
              </h2>
              
              <p className="text-gray-600 mb-6">
                Collez le lien d'un contenu public depuis un réseau social pour l'importer sur PEVA
              </p>
              
              <div className="space-y-4">
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    URL du contenu à partager
                  </label>
                  <div className="flex space-x-2">
                    <input
                      type="url"
                      placeholder="https://linkedin.com/posts/..."
                      className="flex-1 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                    />
                    <button
                      onclick="ouvrirPartageReseauxSociaux()"
                      className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                    >
                      <i className="fas fa-search mr-2"></i>
                      Analyser
                    </button>
                  </div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-2">
                    <i className="fas fa-info-circle mr-2"></i>
                    Comment ça fonctionne ?
                  </h3>
                  <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
                    <li>Copiez le lien d'un post public depuis un réseau social</li>
                    <li>Collez-le dans le champ ci-dessus et cliquez sur "Analyser"</li>
                    <li>Prévisualisez le contenu extrait</li>
                    <li>Choisissez la catégorie PEVA appropriée</li>
                    <li>Publiez sur la plateforme PEVA</li>
                  </ol>
                </div>

                <button
                  onclick="ouvrirPartageReseauxSociaux()"
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  <i className="fas fa-magic mr-2"></i>
                  Démarrer le partage social
                </button>
              </div>
            </div>

            {/* Plateformes supportées */}
            <div className="bg-white rounded-lg shadow p-6">

              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <i className="fas fa-globe mr-2 text-purple-600"></i>
                Plateformes supportées
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                
                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <span className="text-2xl mr-3">💼</span>
                  <div>
                    <div className="font-medium text-gray-900">LinkedIn</div>
                    <div className="text-xs text-gray-500">Posts, articles</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <span className="text-2xl mr-3">🐦</span>
                  <div>
                    <div className="font-medium text-gray-900">Twitter/X</div>
                    <div className="text-xs text-gray-500">Tweets, threads</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <span className="text-2xl mr-3">🎥</span>
                  <div>
                    <div className="font-medium text-gray-900">YouTube</div>
                    <div className="text-xs text-gray-500">Vidéos publiques</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <span className="text-2xl mr-3">👥</span>
                  <div>
                    <div className="font-medium text-gray-900">Facebook</div>
                    <div className="text-xs text-gray-500">Posts publics</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <span className="text-2xl mr-3">📸</span>
                  <div>
                    <div className="font-medium text-gray-900">Instagram</div>
                    <div className="text-xs text-gray-500">Posts publics</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <span className="text-2xl mr-3">📝</span>
                  <div>
                    <div className="font-medium text-gray-900">Medium</div>
                    <div className="text-xs text-gray-500">Articles</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <span className="text-2xl mr-3">💻</span>
                  <div>
                    <div className="font-medium text-gray-900">GitHub</div>
                    <div className="text-xs text-gray-500">Repositories</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <span className="text-2xl mr-3">🎵</span>
                  <div>
                    <div className="font-medium text-gray-900">TikTok</div>
                    <div className="text-xs text-gray-500">Vidéos publiques</div>
                  </div>
                </div>
                
                <div className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                  <span className="text-2xl mr-3">📰</span>
                  <div>
                    <div className="font-medium text-gray-900">Substack</div>
                    <div className="text-xs text-gray-500">Newsletters</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exemples d'utilisation */}
            <div className="bg-white rounded-lg shadow p-6">

              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <i className="fas fa-lightbulb mr-2 text-yellow-600"></i>
                Exemples d'utilisation
              </h2>
              
              <div className="space-y-4">
                
                <div className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                  <h4 className="font-medium text-green-900 mb-2">
                    <i className="fas fa-briefcase mr-2"></i>
                    Opportunités d'affaires
                  </h4>
                  <p className="text-green-800 text-sm">
                    Partagez des posts LinkedIn sur des levées de fonds, des appels d'offres ou des partenariats stratégiques dans l'économie verte
                  </p>
                </div>
                
                <div className="border-l-4 border-blue-500 bg-blue-50 p-4 rounded-r-lg">
                  <h4 className="font-medium text-blue-900 mb-2">
                    <i className="fas fa-graduation-cap mr-2"></i>
                    Ressources éducatives
                  </h4>
                  <p className="text-blue-800 text-sm">
                    Importez des articles Medium ou Substack sur les meilleures pratiques en développement durable
                  </p>
                </div>
                
                <div className="border-l-4 border-purple-500 bg-purple-50 p-4 rounded-r-lg">
                  <h4 className="font-medium text-purple-900 mb-2">
                    <i className="fas fa-video mr-2"></i>
                    Contenu vidéo
                  </h4>
                  <p className="text-purple-800 text-sm">
                    Partagez des documentaires YouTube ou des conférences TED sur l'innovation verte en Afrique
                  </p>
                </div>
                
                <div className="border-l-4 border-orange-500 bg-orange-50 p-4 rounded-r-lg">
                  <h4 className="font-medium text-orange-900 mb-2">
                    <i className="fas fa-trophy mr-2"></i>
                    Success stories
                  </h4>
                  <p className="text-orange-800 text-sm">
                    Mettez en avant des réussites entrepreneuriales ou des projets innovants depuis Instagram ou Facebook
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">

            {/* Historique récent */}
            <div className="bg-white rounded-lg shadow p-6">

              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                  <i className="fas fa-history mr-2 text-gray-600"></i>
                  Historique récent
                </h3>
                <button
                  onclick="afficherHistoriquePartagesSociaux()"
                  className="text-blue-600 hover:text-blue-700 text-sm"
                >
                  Voir tout
                </button>
              </div>
              
              <div id="recent-shares-preview" className="space-y-3">
                <div className="text-center py-8 text-gray-500">
                  <i className="fas fa-share-alt text-2xl mb-2"></i>
                  <p className="text-sm">Aucun partage récent</p>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-lg shadow p-6">

              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="fas fa-chart-bar mr-2 text-indigo-600"></i>
                Vos statistiques
              </h3>
              
              <div className="space-y-4">
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Contenus partagés</span>
                  <span className="font-semibold text-gray-900" id="total-shares-count">0</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Ce mois</span>
                  <span className="font-semibold text-green-600" id="monthly-shares-count">0</span>
                </div>
                
                <div className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Plateforme préférée</span>
                  <span className="font-semibold text-blue-600" id="preferred-platform">LinkedIn</span>
                </div>
                
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-gray-600">Catégorie fréquente</span>
                  <span className="font-semibold text-purple-600" id="frequent-category">Opportunités</span>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow p-6">

              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <i className="fas fa-bolt mr-2 text-yellow-600"></i>
                Actions rapides
              </h3>
              
              <div className="space-y-3">
                
                <button
                  onclick="ouvrirPartageReseauxSociaux()"
                  className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center"
                >
                  <i className="fas fa-plus mr-3 text-green-600"></i>
                  <span className="text-sm">Nouveau partage</span>
                </button>
                
                <button
                  onclick="afficherHistoriquePartagesSociaux()"
                  className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center"
                >
                  <i className="fas fa-list mr-3 text-blue-600"></i>
                  <span className="text-sm">Voir l'historique</span>
                </button>
                
                <a href="/opportunities"
                   className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center"
                >
                  <i className="fas fa-handshake mr-3 text-purple-600"></i>
                  <span className="text-sm">Mes opportunités</span>
                </a>
                
                <a href="/resources"
                   className="w-full text-left px-3 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center"
                >
                  <i className="fas fa-book mr-3 text-indigo-600"></i>
                  <span className="text-sm">Mes ressources</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>, { title: 'Partage Social - PEVA' }
  )
})

export default app