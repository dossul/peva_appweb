import { Hono } from 'hono'
import { renderer } from '../renderer'

const resources = new Hono()

resources.use('*', renderer)

// Page principale de la bibliothèque de ressources
resources.get('/', (c) => {
  return c.render(
    <div className="space-y-6">

      {/* En-tête de la section Resources */}
      <div className="bg-gradient-to-r from-peva-green-600 to-peva-green-700 text-white p-6 rounded-lg">

        <div className="flex items-center justify-between">

          <div>
            <h1 className="text-2xl font-bold mb-2">

              <i className="fas fa-book-open mr-2"></i>
              Bibliothèque de Ressources
            </h1>
            <p className="text-peva-green-100">

              Découvrez notre collection de guides, rapports, outils et formations pour l'économie verte en Afrique
            </p>
          </div>
          <a href="/resources/submit" className="bg-white text-peva-green-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">

            <i className="fas fa-plus mr-2"></i>
            Proposer une Ressource
          </a>
        </div>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">

          <div className="flex items-center">

            <i className="fas fa-file-alt text-blue-600 text-2xl mr-3"></i>
            <div>
              <p className="text-sm text-gray-600">Guides</p>
              <p className="text-xl font-bold text-gray-900">156</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">

          <div className="flex items-center">

            <i className="fas fa-chart-line text-green-600 text-2xl mr-3"></i>
            <div>
              <p className="text-sm text-gray-600">Rapports</p>
              <p className="text-xl font-bold text-gray-900">89</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">

          <div className="flex items-center">

            <i className="fas fa-tools text-purple-600 text-2xl mr-3"></i>
            <div>
              <p className="text-sm text-gray-600">Outils</p>
              <p className="text-xl font-bold text-gray-900">67</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">

          <div className="flex items-center">

            <i className="fas fa-graduation-cap text-orange-600 text-2xl mr-3"></i>
            <div>
              <p className="text-sm text-gray-600">Formations</p>
              <p className="text-xl font-bold text-gray-900">34</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filtres de recherche */}
      <div className="bg-white p-6 rounded-lg shadow">

        <h2 className="text-lg font-medium text-gray-900 mb-4">Filtrer les Ressources</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rechercher</label>
            <div className="relative">

              <input type="text" placeholder="Mots-clés, titre, auteur..." 
                     className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peva-green-500 focus:border-transparent" />
              <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Type de Ressource</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peva-green-500 focus:border-transparent">

              <option value="">Tous les types</option>
              <option value="guide">Guides Pratiques</option>
              <option value="rapport">Rapports & Études</option>
              <option value="outil">Outils & Templates</option>
              <option value="formation">Formations</option>
              <option value="video">Vidéos</option>
              <option value="webinar">Webinaires</option>
              <option value="podcast">Podcasts</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Secteur</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peva-green-500 focus:border-transparent">

              <option value="">Tous les secteurs</option>
              <option value="energie_renouvelable">Énergie Renouvelable</option>
              <option value="agriculture_durable">Agriculture Durable</option>
              <option value="gestion_dechets">Gestion des Déchets</option>
              <option value="transport_vert">Transport Vert</option>
              <option value="construction_durable">Construction Durable</option>
              <option value="finance_verte">Finance Verte</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Niveau</label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peva-green-500 focus:border-transparent">

              <option value="">Tous niveaux</option>
              <option value="debutant">Débutant</option>
              <option value="intermediaire">Intermédiaire</option>
              <option value="avance">Avancé</option>
              <option value="expert">Expert</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-4">

          <div className="flex items-center space-x-4">

            <label className="flex items-center">

              <input type="checkbox" className="rounded border-gray-300 text-peva-green-600 focus:ring-peva-green-500" />
              <span className="ml-2 text-sm text-gray-700">Gratuit uniquement</span>
            </label>
            <label className="flex items-center">

              <input type="checkbox" className="rounded border-gray-300 text-peva-green-600 focus:ring-peva-green-500" />
              <span className="ml-2 text-sm text-gray-700">Certifié PEVA</span>
            </label>
            <label className="flex items-center">

              <input type="checkbox" className="rounded border-gray-300 text-peva-green-600 focus:ring-peva-green-500" />
              <span className="ml-2 text-sm text-gray-700">Nouveautés (30j)</span>
            </label>
          </div>
          <div className="flex items-center space-x-2">

            <button className="px-4 py-2 text-peva-green-600 border border-peva-green-600 rounded-lg hover:bg-peva-green-50 transition-colors">

              Réinitialiser
            </button>
            <button className="px-4 py-2 bg-peva-green-600 text-white rounded-lg hover:bg-peva-green-700 transition-colors">

              <i className="fas fa-filter mr-2"></i>
              Filtrer
            </button>
          </div>
        </div>
      </div>

      {/* Ressources populaires */}
      <div className="bg-white p-6 rounded-lg shadow">

        <div className="flex items-center justify-between mb-4">

          <h2 className="text-lg font-medium text-gray-900">Ressources Populaires</h2>
          <a href="/resources/popular" className="text-peva-green-600 hover:text-peva-green-700 text-sm font-medium">

            Voir toutes →
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Ressource populaire 1 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">

            <div className="flex items-start justify-between mb-3">

              <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">Guide</span>
              <div className="flex items-center text-sm text-gray-500">

                <i className="fas fa-eye mr-1"></i>
                2.3k vues
              </div>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">

              <a href="/resources/guide-financement-startup-verte" className="hover:text-peva-green-600">

                Guide du Financement pour Startups Vertes
              </a>
            </h3>
            <p className="text-sm text-gray-600 mb-3">

              Un guide complet pour comprendre les différentes options de financement disponibles pour les entreprises vertes en Afrique.
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">

              <span>Par PEVA Team</span>
              <div className="flex items-center">

                <i className="fas fa-star text-yellow-400 mr-1"></i>
                4.8 (156 avis)
              </div>
            </div>
          </div>

          {/* Ressource populaire 2 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">

            <div className="flex items-start justify-between mb-3">

              <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded">Rapport</span>
              <div className="flex items-center text-sm text-gray-500">

                <i className="fas fa-eye mr-1"></i>
                1.8k vues
              </div>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">

              <a href="/resources/rapport-energie-solaire-afrique-2024" className="hover:text-peva-green-600">

                État de l'Énergie Solaire en Afrique 2024
              </a>
            </h3>
            <p className="text-sm text-gray-600 mb-3">

              Rapport détaillé sur l'évolution du marché de l'énergie solaire en Afrique avec projections et opportunités.
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">

              <span>Par Dr. Amina Kone</span>
              <div className="flex items-center">

                <i className="fas fa-star text-yellow-400 mr-1"></i>
                4.9 (89 avis)
              </div>
            </div>
          </div>

          {/* Ressource populaire 3 */}
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">

            <div className="flex items-start justify-between mb-3">

              <span className="bg-purple-100 text-purple-800 text-xs font-medium px-2 py-1 rounded">Outil</span>
              <div className="flex items-center text-sm text-gray-500">

                <i className="fas fa-download mr-1"></i>
                945 téléch.
              </div>
            </div>
            <h3 className="font-medium text-gray-900 mb-2">

              <a href="/resources/calculateur-empreinte-carbone" className="hover:text-peva-green-600">

                Calculateur d'Empreinte Carbone
              </a>
            </h3>
            <p className="text-sm text-gray-600 mb-3">

              Outil Excel pour calculer facilement l'empreinte carbone de votre entreprise ou projet.
            </p>
            <div className="flex items-center justify-between text-xs text-gray-500">

              <span>Par Green Analytics</span>
              <div className="flex items-center">

                <i className="fas fa-star text-yellow-400 mr-1"></i>
                4.7 (67 avis)
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Catégories de ressources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Guides Pratiques */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">

          <div className="flex items-center mb-4">

            <div className="bg-blue-100 p-3 rounded-lg mr-4">

              <i className="fas fa-book text-blue-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Guides Pratiques</h3>
              <p className="text-sm text-gray-500">156 ressources</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">

            Des guides étape par étape pour vous accompagner dans vos projets d'économie verte.
          </p>
          <a href="/resources/category/guides" className="text-peva-green-600 hover:text-peva-green-700 font-medium text-sm">

            Explorer les guides →
          </a>
        </div>

        {/* Rapports & Études */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">

          <div className="flex items-center mb-4">

            <div className="bg-green-100 p-3 rounded-lg mr-4">

              <i className="fas fa-chart-line text-green-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Rapports & Études</h3>
              <p className="text-sm text-gray-500">89 ressources</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">

            Analyses de marché, études sectorielles et recherches sur l'économie verte en Afrique.
          </p>
          <a href="/resources/category/rapports" className="text-peva-green-600 hover:text-peva-green-700 font-medium text-sm">

            Consulter les rapports →
          </a>
        </div>

        {/* Formations */}
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">

          <div className="flex items-center mb-4">

            <div className="bg-orange-100 p-3 rounded-lg mr-4">

              <i className="fas fa-graduation-cap text-orange-600 text-xl"></i>
            </div>
            <div>
              <h3 className="font-medium text-gray-900">Formations</h3>
              <p className="text-sm text-gray-500">34 ressources</p>
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-4">

            Cours en ligne, webinaires et programmes de formation certifiés.
          </p>
          <a href="/resources/category/formations" className="text-peva-green-600 hover:text-peva-green-700 font-medium text-sm">

            Voir les formations →
          </a>
        </div>
      </div>
    </div>
  )
})

// Page de soumission de ressource
resources.get('/submit', (c) => {
  return c.render(
    <div className="max-w-4xl mx-auto">

      <div className="bg-white shadow rounded-lg">

        <div className="px-6 py-4 border-b border-gray-200">

          <h1 className="text-xl font-semibold text-gray-900">

            <i className="fas fa-plus-circle mr-2 text-peva-green-600"></i>
            Proposer une Ressource
          </h1>
          <p className="mt-1 text-sm text-gray-600">

            Partagez vos connaissances avec la communauté PEVA
          </p>
        </div>

        <form className="px-6 py-6 space-y-6">

          {/* Informations de base */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations de Base</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Titre *</label>
                <input type="text" required
                       placeholder="Ex: Guide du financement vert"
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peva-green-500 focus:border-transparent" />

              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type de Ressource *</label>
                <select required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peva-green-500 focus:border-transparent">

                  <option value="">Sélectionner un type</option>
                  <option value="guide">Guide Pratique</option>
                  <option value="rapport">Rapport & Étude</option>
                  <option value="outil">Outil & Template</option>
                  <option value="formation">Formation</option>
                  <option value="video">Vidéo</option>
                  <option value="webinar">Webinaire</option>
                  <option value="podcast">Podcast</option>
                </select>
              </div>
            </div>

            <div className="mt-4">

              <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
              <textarea rows="4" required
                        placeholder="Décrivez votre ressource, son contenu et sa valeur ajoutée..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peva-green-500 focus:border-transparent"></textarea>
            </div>
          </div>

          {/* Catégorisation */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Catégorisation</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secteur Principal *</label>
                <select required className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peva-green-500 focus:border-transparent">

                  <option value="">Sélectionner un secteur</option>
                  <option value="energie_renouvelable">Énergie Renouvelable</option>
                  <option value="agriculture_durable">Agriculture Durable</option>
                  <option value="gestion_dechets">Gestion des Déchets</option>
                  <option value="transport_vert">Transport Vert</option>
                  <option value="construction_durable">Construction Durable</option>
                  <option value="finance_verte">Finance Verte</option>
                  <option value="economie_circulaire">Économie Circulaire</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Niveau de Difficulté</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peva-green-500 focus:border-transparent">

                  <option value="">Sélectionner un niveau</option>
                  <option value="debutant">Débutant</option>
                  <option value="intermediaire">Intermédiaire</option>
                  <option value="avance">Avancé</option>
                  <option value="expert">Expert</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Langue</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peva-green-500 focus:border-transparent">

                  <option value="fr">Français</option>
                  <option value="en">Anglais</option>
                  <option value="ar">Arabe</option>
                  <option value="pt">Portugais</option>
                  <option value="es">Espagnol</option>
                </select>
              </div>
            </div>

            <div className="mt-4">

              <label className="block text-sm font-medium text-gray-700 mb-2">Mots-clés</label>
              <input type="text" 
                     placeholder="Séparez les mots-clés par des virgules"
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peva-green-500 focus:border-transparent" />

              <p className="mt-1 text-xs text-gray-500">Ex: financement, startup, énergie solaire, Afrique</p>
            </div>
          </div>

          {/* Fichiers et liens */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Fichiers et Liens</h3>
            
            <div className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fichier Principal</label>
                <div className="border-2 border-gray-300 border-dashed rounded-lg p-6 text-center">

                  <input type="file" id="file-upload" className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx" />
                  <label for="file-upload" className="cursor-pointer">

                    <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                    <p className="text-sm text-gray-600">

                      Cliquez pour sélectionner ou glissez-déposez votre fichier
                    </p>
                    <p className="text-xs text-gray-500 mt-1">

                      PDF, Word, Excel, PowerPoint (max. 50MB)
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Lien Externe (optionnel)</label>
                <input type="url" 
                       placeholder="https://example.com/resource"
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peva-green-500 focus:border-transparent" />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image de Couverture (optionnelle)</label>
                <input type="file" accept="image/*" 
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peva-green-500 focus:border-transparent" />

              </div>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Informations Supplémentaires</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Auteur/Organisation</label>
                <input type="text" 
                       placeholder="Nom de l'auteur ou organisation"
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peva-green-500 focus:border-transparent" />

              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Date de Publication</label>
                <input type="date" 
                       className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peva-green-500 focus:border-transparent" />

              </div>
            </div>

            <div className="mt-4 space-y-4">

              <label className="flex items-center">

                <input type="checkbox" className="rounded border-gray-300 text-peva-green-600 focus:ring-peva-green-500" />
                <span className="ml-2 text-sm text-gray-700">Cette ressource est gratuite</span>
              </label>

              <label className="flex items-center">

                <input type="checkbox" className="rounded border-gray-300 text-peva-green-600 focus:ring-peva-green-500" />
                <span className="ml-2 text-sm text-gray-700">Je détiens les droits de cette ressource</span>
              </label>

              <label className="flex items-center">

                <input type="checkbox" className="rounded border-gray-300 text-peva-green-600 focus:ring-peva-green-500" />
                <span className="ml-2 text-sm text-gray-700">Autoriser le téléchargement</span>
              </label>
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

                <a href="/resources" className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">

                  Annuler
                </a>
                <button type="submit" className="px-6 py-2 bg-peva-green-600 text-white rounded-lg hover:bg-peva-green-700 transition-colors">

                  <i className="fas fa-paper-plane mr-2"></i>
                  Soumettre pour Révision
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
})

// Page de détail d'une ressource
resources.get('/:id', (c) => {
  const resourceId = c.req.param('id')
  
  return c.render(
    <div className="max-w-6xl mx-auto">

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Contenu principal */}
        <div className="lg:col-span-2 space-y-6">

          {/* En-tête de la ressource */}
          <div className="bg-white rounded-lg shadow p-6">

            <div className="flex items-start justify-between mb-4">

              <div className="flex items-center space-x-3">

                <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">Guide Pratique</span>
                <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">Gratuit</span>
                <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">Certifié PEVA</span>
              </div>
              <div className="flex items-center space-x-2">

                <button className="p-2 text-gray-400 hover:text-peva-green-600 transition-colors" title="Ajouter aux favoris">
                  <i className="far fa-heart"></i>
                </button>
                <button className="p-2 text-gray-400 hover:text-peva-green-600 transition-colors" title="Partager">
                  <i className="fas fa-share-alt"></i>
                </button>
              </div>
            </div>

            <h1 className="text-2xl font-bold text-gray-900 mb-3">

              Guide du Financement pour Startups Vertes en Afrique
            </h1>

            <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">

              <div className="flex items-center">

                <i className="fas fa-user mr-2"></i>
                Par Dr. Amina Koné
              </div>
              <div className="flex items-center">

                <i className="fas fa-calendar mr-2"></i>
                15 Mars 2024
              </div>
              <div className="flex items-center">

                <i className="fas fa-eye mr-2"></i>
                2,341 vues
              </div>
              <div className="flex items-center">

                <i className="fas fa-download mr-2"></i>
                892 téléchargements
              </div>
            </div>

            <div className="flex items-center space-x-4 mb-6">

              <div className="flex items-center">

                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fas fa-star ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                ))}
                <span className="ml-2 text-sm text-gray-600">4.8 (156 avis)</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-600">Niveau: Intermédiaire</span>
              <span className="text-gray-300">|</span>
              <span className="text-sm text-gray-600">45 pages</span>
            </div>

            <p className="text-gray-700 leading-relaxed">

              Ce guide complet explore les différentes options de financement disponibles pour les startups vertes en Afrique. 
              Il couvre les sources de financement traditionnelles et innovantes, les critères d'éligibilité, les processus de 
              candidature et les meilleures pratiques pour maximiser vos chances de succès.
            </p>
          </div>

          {/* Aperçu du contenu */}
          <div className="bg-white rounded-lg shadow p-6">

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Table des Matières</h2>
            <div className="space-y-3">

              <div className="flex items-center p-3 bg-gray-50 rounded-lg">

                <i className="fas fa-file-alt text-blue-600 mr-3"></i>
                <div>
                  <h4 className="font-medium text-gray-900">1. Introduction à l'écosystème de financement vert</h4>
                  <p className="text-sm text-gray-600">Vue d'ensemble du paysage financier pour l'économie verte en Afrique</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">

                <i className="fas fa-file-alt text-blue-600 mr-3"></i>
                <div>
                  <h4 className="font-medium text-gray-900">2. Sources de financement traditionnelles</h4>
                  <p className="text-sm text-gray-600">Banques, institutions financières et programmes gouvernementaux</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">

                <i className="fas fa-file-alt text-blue-600 mr-3"></i>
                <div>
                  <h4 className="font-medium text-gray-900">3. Financement innovant et impact investing</h4>
                  <p className="text-sm text-gray-600">Capital-risque vert, crowdfunding et financements participatifs</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">

                <i className="fas fa-file-alt text-blue-600 mr-3"></i>
                <div>
                  <h4 className="font-medium text-gray-900">4. Préparer sa demande de financement</h4>
                  <p className="text-sm text-gray-600">Business plan, pitch deck et documents requis</p>
                </div>
              </div>
              <div className="flex items-center p-3 bg-gray-50 rounded-lg">

                <i className="fas fa-file-alt text-blue-600 mr-3"></i>
                <div>
                  <h4 className="font-medium text-gray-900">5. Études de cas et success stories</h4>
                  <p className="text-sm text-gray-600">Exemples concrets de startups financées avec succès</p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions de téléchargement */}
          <div className="bg-white rounded-lg shadow p-6">

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Télécharger cette Ressource</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

              <button className="flex items-center justify-center p-4 border-2 border-peva-green-600 text-peva-green-600 rounded-lg hover:bg-peva-green-50 transition-colors">

                <i className="fas fa-file-pdf text-2xl mr-3"></i>
                <div className="text-left">

                  <div className="font-medium">Télécharger PDF</div>
                  <div className="text-sm">Version complète (8.5 MB)</div>
                </div>
              </button>
              <button className="flex items-center justify-center p-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors">

                <i className="fas fa-eye text-2xl mr-3"></i>
                <div className="text-left">

                  <div className="font-medium">Lire en Ligne</div>
                  <div className="text-sm">Aperçu interactif</div>
                </div>
              </button>
            </div>
          </div>

          {/* Commentaires et avis */}
          <div className="bg-white rounded-lg shadow p-6">

            <h2 className="text-xl font-semibold text-gray-900 mb-4">Avis et Commentaires</h2>
            
            {/* Formulaire d'avis */}
            <div className="bg-gray-50 p-4 rounded-lg mb-6">

              <h3 className="font-medium text-gray-900 mb-3">Laisser un Avis</h3>
              <div className="flex items-center mb-3">

                <span className="text-sm text-gray-700 mr-3">Note:</span>
                <div className="flex items-center space-x-1">

                  {[...Array(5)].map((_, i) => (
                    <button key={i} className="text-gray-300 hover:text-yellow-400 transition-colors">

                      <i className="fas fa-star"></i>
                    </button>
                  ))}
                </div>
              </div>
              <textarea rows="3" placeholder="Partagez votre expérience avec cette ressource..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-peva-green-500 focus:border-transparent mb-3"></textarea>
              <button className="px-4 py-2 bg-peva-green-600 text-white rounded-lg hover:bg-peva-green-700 transition-colors">

                <i className="fas fa-paper-plane mr-2"></i>
                Publier l'Avis
              </button>
            </div>

            {/* Liste des commentaires */}
            <div className="space-y-4">

              <div className="border-b border-gray-200 pb-4">

                <div className="flex items-start space-x-3">

                  <img src="https://ui-avatars.com/api/?name=Marie+Diop&background=10b981&color=fff" 
                       alt="Marie Diop" className="w-10 h-10 rounded-full" />

                  <div className="flex-1">

                    <div className="flex items-center space-x-2 mb-1">

                      <h4 className="font-medium text-gray-900">Marie Diop</h4>
                      <div className="flex items-center">

                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`fas fa-star text-sm ${i < 5 ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">il y a 2 jours</span>
                    </div>
                    <p className="text-gray-700">

                      Excellent guide ! Très complet et bien structuré. Les études de cas sont particulièrement utiles 
                      pour comprendre les enjeux concrets du financement vert en Afrique.
                    </p>
                  </div>
                </div>
              </div>

              <div className="border-b border-gray-200 pb-4">

                <div className="flex items-start space-x-3">

                  <img src="https://ui-avatars.com/api/?name=Ahmed+Ben+Ali&background=3b82f6&color=fff" 
                       alt="Ahmed Ben Ali" className="w-10 h-10 rounded-full" />

                  <div className="flex-1">

                    <div className="flex items-center space-x-2 mb-1">

                      <h4 className="font-medium text-gray-900">Ahmed Ben Ali</h4>
                      <div className="flex items-center">

                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`fas fa-star text-sm ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}></i>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">il y a 1 semaine</span>
                    </div>
                    <p className="text-gray-700">

                      Ressource très pratique qui m'a aidé à préparer ma demande de financement. 
                      Je recommande particulièrement le chapitre sur la préparation du business plan.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <button className="mt-4 text-peva-green-600 hover:text-peva-green-700 font-medium">

              Voir tous les avis (156) →
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Informations de l'auteur */}
          <div className="bg-white rounded-lg shadow p-6">

            <h3 className="font-semibold text-gray-900 mb-4">À Propos de l'Auteur</h3>
            <div className="flex items-center space-x-3 mb-4">

              <img src="https://ui-avatars.com/api/?name=Amina+Kone&background=10b981&color=fff" 
                   alt="Dr. Amina Koné" className="w-12 h-12 rounded-full" />

              <div>
                <h4 className="font-medium text-gray-900">Dr. Amina Koné</h4>
                <p className="text-sm text-gray-600">Expert en Finance Verte</p>
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-4">

              Dr. Amina Koné est une experte reconnue en finance verte avec plus de 15 ans d'expérience 
              dans l'accompagnement d'entreprises vertes en Afrique.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">

              <span><i className="fas fa-file-alt mr-1"></i>23 ressources</span>
              <span><i className="fas fa-star mr-1"></i>4.9 moyenne</span>
            </div>
          </div>

          {/* Ressources similaires */}
          <div className="bg-white rounded-lg shadow p-6">

            <h3 className="font-semibold text-gray-900 mb-4">Ressources Similaires</h3>
            <div className="space-y-4">

              <a href="/resources/guide-business-plan-vert" className="block border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">

                <h4 className="font-medium text-gray-900 mb-1">Guide Business Plan Vert</h4>
                <p className="text-xs text-gray-600 mb-2">Par Green Consulting Africa</p>
                <div className="flex items-center text-xs text-gray-500">

                  <i className="fas fa-star text-yellow-400 mr-1"></i>
                  4.7 (89 avis)
                </div>
              </a>

              <a href="/resources/rapport-investissements-verts-2024" className="block border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">

                <h4 className="font-medium text-gray-900 mb-1">Rapport Investissements Verts 2024</h4>
                <p className="text-xs text-gray-600 mb-2">Par African Green Fund</p>
                <div className="flex items-center text-xs text-gray-500">

                  <i className="fas fa-star text-yellow-400 mr-1"></i>
                  4.6 (67 avis)
                </div>
              </a>

              <a href="/resources/template-pitch-deck-startup" className="block border border-gray-200 rounded-lg p-3 hover:shadow-md transition-shadow">

                <h4 className="font-medium text-gray-900 mb-1">Template Pitch Deck Startup</h4>
                <p className="text-xs text-gray-600 mb-2">Par PEVA Team</p>
                <div className="flex items-center text-xs text-gray-500">

                  <i className="fas fa-star text-yellow-400 mr-1"></i>
                  4.8 (134 avis)
                </div>
              </a>
            </div>
          </div>

          {/* Tags */}
          <div className="bg-white rounded-lg shadow p-6">

            <h3 className="font-semibold text-gray-900 mb-4">Mots-clés</h3>
            <div className="flex flex-wrap gap-2">

              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">financement</span>
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">startup</span>
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">économie verte</span>
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">Afrique</span>
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">investissement</span>
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">business plan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

// Page des catégories
resources.get('/category/:category', (c) => {
  const category = c.req.param('category')
  
  return c.render(
    <div className="space-y-6">

      {/* En-tête de catégorie */}
      <div className="bg-white rounded-lg shadow p-6">

        <div className="flex items-center mb-4">

          <i className="fas fa-book text-blue-600 text-2xl mr-3"></i>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Guides Pratiques</h1>
            <p className="text-gray-600">156 ressources disponibles</p>
          </div>
        </div>
        <p className="text-gray-700">

          Des guides étape par étape pour vous accompagner dans vos projets d'économie verte. 
          Chaque guide est rédigé par des experts et validé par la communauté PEVA.
        </p>
      </div>

      {/* Filtres de catégorie */}
      <div className="bg-white rounded-lg shadow p-6">

        <div className="flex items-center justify-between mb-4">

          <h2 className="text-lg font-medium text-gray-900">Filtrer par</h2>
          <div className="flex items-center space-x-2">

            <span className="text-sm text-gray-600">Trier par:</span>
            <select className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-peva-green-500 focus:border-transparent">

              <option value="recent">Plus récent</option>
              <option value="popular">Plus populaire</option>
              <option value="rating">Mieux noté</option>
              <option value="downloads">Plus téléchargé</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">

          <button className="bg-peva-green-600 text-white px-3 py-1 rounded-full text-sm">Tous</button>
          <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors">Énergie</button>
          <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors">Agriculture</button>
          <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors">Finance</button>
          <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors">Transport</button>
          <button className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors">Déchets</button>
        </div>
      </div>

      {/* Grille des ressources */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* Exemple de ressources */}
        {[...Array(12)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow border-l-4 border-blue-500">

            <div className="p-6">

              <div className="flex items-start justify-between mb-3">

                <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">Guide</span>
                <div className="flex items-center text-sm text-gray-500">

                  <i className="fas fa-eye mr-1"></i>
                  {(Math.random() * 3000).toFixed(0)} vues
                </div>
              </div>
              
              <h3 className="font-medium text-gray-900 mb-2">

                <a href={`/resources/guide-${i + 1}`} className="hover:text-peva-green-600">

                  Guide {i === 0 ? "du Financement pour Startups Vertes" : 
                         i === 1 ? "de la Certification Environnementale" :
                         i === 2 ? "de l'Éco-Innovation en Entreprise" :
                         `Pratique ${i + 1}`}
                </a>
              </h3>
              
              <p className="text-sm text-gray-600 mb-3">

                Description détaillée du guide avec les points clés abordés et la valeur ajoutée pour les lecteurs.
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">

                <span>Par {i % 3 === 0 ? "PEVA Team" : i % 3 === 1 ? "Dr. Expert" : "Green Consulting"}</span>
                <div className="flex items-center">

                  <i className="fas fa-star text-yellow-400 mr-1"></i>
                  {(4.5 + Math.random() * 0.5).toFixed(1)}
                </div>
              </div>
              
              <div className="flex items-center justify-between">

                <span className="text-sm font-medium text-peva-green-600">Gratuit</span>
                <button className="text-peva-green-600 hover:text-peva-green-700 text-sm font-medium">

                  Voir plus →
                </button>
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
        <button className="px-3 py-2 bg-peva-green-600 text-white rounded-lg">1</button>
        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">2</button>
        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">3</button>
        <span className="px-3 py-2 text-gray-500">...</span>
        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">12</button>
        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">

          <i className="fas fa-chevron-right"></i>
        </button>
      </div>
    </div>
  )
})

export default resources