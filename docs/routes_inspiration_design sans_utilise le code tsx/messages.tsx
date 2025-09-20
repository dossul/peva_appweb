import { Hono } from 'hono'
import { renderer } from '../renderer'

const messages = new Hono()

messages.use('*', renderer)

// Page principale de messagerie
messages.get('/', (c) => {
  return c.render(
    <div className="h-[calc(100vh-200px)] flex bg-white rounded-lg shadow overflow-hidden">

      {/* Sidebar des conversations */}
      <div className="w-1/3 border-r border-gray-200 flex flex-col">

        {/* En-tête sidebar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">

          <div className="flex items-center justify-between mb-3">

            <h1 className="text-lg font-semibold text-gray-900">

              <i className="fas fa-comments mr-2 text-blue-600"></i>
              Messages
            </h1>
            <a href="/messages/compose" className="text-blue-600 hover:text-blue-700 transition-colors">

              <i className="fas fa-edit text-lg"></i>
            </a>
          </div>
          
          {/* Recherche */}
          <div className="relative">

            <input type="text" placeholder="Rechercher une conversation..." 
                   className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
          </div>
        </div>

        {/* Filtres */}
        <div className="p-3 border-b border-gray-200">

          <div className="flex items-center space-x-2">

            <button className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">Toutes</button>
            <button className="text-gray-600 hover:text-blue-600 px-3 py-1 rounded-full text-sm transition-colors">Non lues</button>
            <button className="text-gray-600 hover:text-blue-600 px-3 py-1 rounded-full text-sm transition-colors">Favoris</button>
            <button className="text-gray-600 hover:text-blue-600 px-3 py-1 rounded-full text-sm transition-colors">Groupes</button>
          </div>
        </div>

        {/* Liste des conversations */}
        <div className="flex-1 overflow-y-auto">

          {/* Conversation active */}
          <div className="p-4 bg-blue-50 border-l-4 border-blue-600 cursor-pointer">

            <div className="flex items-start space-x-3">

              <div className="relative">

                <img src="https://ui-avatars.com/api/?name=Sarah+Okoye&background=10b981&color=fff" 
                     alt="Sarah Okoye" className="w-12 h-12 rounded-full" />

                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">

                <div className="flex items-center justify-between mb-1">

                  <h3 className="font-medium text-gray-900 truncate">Sarah Okoye</h3>
                  <span className="text-xs text-gray-500">14:32</span>
                </div>
                <p className="text-sm text-gray-600 truncate">

                  Salut ! J'ai vu ton message sur le forum à propos du financement...
                </p>
                <div className="flex items-center justify-between mt-2">

                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">2</span>
                  <div className="flex items-center text-xs text-gray-500">

                    <i className="fas fa-star text-yellow-400 mr-1"></i>
                    <span>Favori</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Autres conversations */}
          <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">

            <div className="flex items-start space-x-3">

              <div className="relative">

                <img src="https://ui-avatars.com/api/?name=Ahmed+Ben+Ali&background=3b82f6&color=fff" 
                     alt="Ahmed Ben Ali" className="w-12 h-12 rounded-full" />

                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-gray-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">

                <div className="flex items-center justify-between mb-1">

                  <h3 className="font-medium text-gray-900 truncate">Ahmed Ben Ali</h3>
                  <span className="text-xs text-gray-500">hier</span>
                </div>
                <p className="text-sm text-gray-600 truncate">

                  Merci pour tes conseils sur l'installation solaire ! 👍
                </p>
                <div className="flex items-center justify-between mt-2">

                  <i className="fas fa-check-double text-blue-600"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">

            <div className="flex items-start space-x-3">

              <div className="relative">

                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">

                  <i className="fas fa-users text-white"></i>
                </div>
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white"></div>
              </div>
              <div className="flex-1 min-w-0">

                <div className="flex items-center justify-between mb-1">

                  <h3 className="font-medium text-gray-900 truncate">Groupe Énergie Solaire CI</h3>
                  <span className="text-xs text-gray-500">09:15</span>
                </div>
                <p className="text-sm text-gray-600 truncate">

                  <strong>Marie:</strong> Quelqu'un connaît un bon installateur à Abidjan ?
                </p>
                <div className="flex items-center justify-between mt-2">

                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">5</span>
                  <span className="text-xs text-gray-500">12 membres</span>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">

            <div className="flex items-start space-x-3">

              <img src="https://ui-avatars.com/api/?name=Marie+Diop&background=f59e0b&color=fff" 
                   alt="Marie Diop" className="w-12 h-12 rounded-full" />

              <div className="flex-1 min-w-0">

                <div className="flex items-center justify-between mb-1">

                  <h3 className="font-medium text-gray-900 truncate">Marie Diop</h3>
                  <span className="text-xs text-gray-500">mar</span>
                </div>
                <p className="text-sm text-gray-600 truncate">

                  Super présentation à la conférence ! On peut collaborer ?
                </p>
                <div className="flex items-center justify-between mt-2">

                  <i className="fas fa-check text-gray-400"></i>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors">

            <div className="flex items-start space-x-3">

              <img src="https://ui-avatars.com/api/?name=Kwame+Asante&background=8b5cf6&color=fff" 
                   alt="Kwame Asante" className="w-12 h-12 rounded-full" />

              <div className="flex-1 min-w-0">

                <div className="flex items-center justify-between mb-1">

                  <h3 className="font-medium text-gray-900 truncate">Kwame Asante</h3>
                  <span className="text-xs text-gray-500">lun</span>
                </div>
                <p className="text-sm text-gray-600 truncate">

                  Documents de certification carbone en pièce jointe
                </p>
                <div className="flex items-center justify-between mt-2">

                  <div className="flex items-center text-xs text-gray-500">

                    <i className="fas fa-paperclip mr-1"></i>
                    <span>3 fichiers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Zone de conversation */}
      <div className="flex-1 flex flex-col">

        {/* En-tête conversation */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">

          <div className="flex items-center justify-between">

            <div className="flex items-center space-x-3">

              <img src="https://ui-avatars.com/api/?name=Sarah+Okoye&background=10b981&color=fff" 
                   alt="Sarah Okoye" className="w-10 h-10 rounded-full" />

              <div>
                <h2 className="font-semibold text-gray-900">Sarah Okoye</h2>
                <div className="flex items-center space-x-2 text-sm text-gray-600">

                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span>En ligne</span>
                  <span>•</span>
                  <span>Investisseuse Impact</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">

              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Appel audio">
                <i className="fas fa-phone"></i>
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Appel vidéo">
                <i className="fas fa-video"></i>
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Informations">
                <i className="fas fa-info-circle"></i>
              </button>
              <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title="Plus d'options">
                <i className="fas fa-ellipsis-v"></i>
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">

          {/* Message de l'autre personne */}
          <div className="flex items-start space-x-3">

            <img src="https://ui-avatars.com/api/?name=Sarah+Okoye&background=10b981&color=fff" 
                 alt="Sarah Okoye" className="w-8 h-8 rounded-full" />

            <div className="flex-1 max-w-2xl">

              <div className="bg-gray-100 rounded-lg p-3">

                <p className="text-gray-900">

                  Salut Amina ! J'ai vu ton message sur le forum à propos du financement pour ta startup solaire en Côte d'Ivoire. 
                  C'est exactement le type de projet qui nous intéresse chez nous ! 👋
                </p>
              </div>
              <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">

                <span>14:28</span>
                <span>•</span>
                <span>Lu</span>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3">

            <img src="https://ui-avatars.com/api/?name=Sarah+Okoye&background=10b981&color=fff" 
                 alt="Sarah Okoye" className="w-8 h-8 rounded-full" />

            <div className="flex-1 max-w-2xl">

              <div className="bg-gray-100 rounded-lg p-3">

                <p className="text-gray-900 mb-2">

                  Je peux te faire une intro avec quelques contacts chez I&P si tu veux. 
                  Ils sont très actifs en Afrique francophone et financent beaucoup de projets d'énergie verte.
                </p>
                <p className="text-gray-900">

                  Tu as déjà un business plan finalisé ? Et quel est ton timeline pour lever les fonds ?
                </p>
              </div>
              <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">

                <span>14:30</span>
                <span>•</span>
                <span>Lu</span>
              </div>
            </div>
          </div>

          {/* Mes messages */}
          <div className="flex items-start space-x-3 flex-row-reverse">

            <img src="https://ui-avatars.com/api/?name=Amina+Kone&background=3b82f6&color=fff" 
                 alt="Amina Koné" className="w-8 h-8 rounded-full" />

            <div className="flex-1 max-w-2xl">

              <div className="bg-blue-600 text-white rounded-lg p-3">

                <p>
                  Merci beaucoup Sarah ! C'est super gentil de proposer ton aide. 🙏
                </p>
              </div>
              <div className="flex items-center justify-end space-x-2 mt-1 text-xs text-gray-500">

                <span>Lu</span>
                <span>•</span>
                <span>14:31</span>
              </div>
            </div>
          </div>

          <div className="flex items-start space-x-3 flex-row-reverse">

            <img src="https://ui-avatars.com/api/?name=Amina+Kone&background=3b82f6&color=fff" 
                 alt="Amina Koné" className="w-8 h-8 rounded-full" />

            <div className="flex-1 max-w-2xl">

              <div className="bg-blue-600 text-white rounded-lg p-3">

                <p className="mb-2">

                  Oui, j'ai un business plan complet avec projections sur 5 ans. 
                  On vise 500k EUR en seed round, idéalement dans les 6 prochains mois.
                </p>
                <p>
                  Une intro chez I&P serait parfaite ! Je peux t'envoyer notre deck si tu veux jeter un œil ? 📊
                </p>
              </div>
              <div className="flex items-center justify-end space-x-2 mt-1 text-xs text-gray-500">

                <span>Lu</span>
                <span>•</span>
                <span>14:32</span>
              </div>
            </div>
          </div>

          {/* Indicateur de frappe */}
          <div className="flex items-start space-x-3">

            <img src="https://ui-avatars.com/api/?name=Sarah+Okoye&background=10b981&color=fff" 
                 alt="Sarah Okoye" className="w-8 h-8 rounded-full" />

            <div className="bg-gray-100 rounded-lg p-3">

              <div className="flex space-x-1">

                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Zone de saisie */}
        <div className="p-4 border-t border-gray-200">

          <div className="flex items-end space-x-3">

            <div className="flex-1">

              <div className="border border-gray-300 rounded-lg">

                <div className="flex items-center space-x-2 p-2 border-b border-gray-200">

                  <button className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Pièce jointe">
                    <i className="fas fa-paperclip"></i>
                  </button>
                  <button className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Image">
                    <i className="fas fa-image"></i>
                  </button>
                  <button className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="Emoji">
                    <i className="far fa-smile"></i>
                  </button>
                  <button className="p-1 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="GIF">
                    <i className="fas fa-gift"></i>
                  </button>
                </div>
                <textarea rows="3" placeholder="Tapez votre message..." 
                          className="w-full p-3 border-0 focus:ring-0 resize-none"></textarea>
              </div>
            </div>
            
            <button className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-colors">

              <i className="fas fa-paper-plane"></i>
            </button>
          </div>
          
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">

            <div className="flex items-center space-x-4">

              <label className="flex items-center">

                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2" />
                Appuyer sur Entrée pour envoyer
              </label>
            </div>
            <span>Shift+Entrée pour nouvelle ligne</span>
          </div>
        </div>
      </div>
    </div>
  )
})

// Page de composition de nouveau message
messages.get('/compose', (c) => {
  return c.render(
    <div className="max-w-4xl mx-auto">

      <div className="bg-white shadow rounded-lg">

        <div className="px-6 py-4 border-b border-gray-200">

          <h1 className="text-xl font-semibold text-gray-900">

            <i className="fas fa-edit mr-2 text-blue-600"></i>
            Nouveau Message
          </h1>
          <p className="mt-1 text-sm text-gray-600">

            Envoyez un message privé à un membre de la communauté PEVA
          </p>
        </div>

        <form className="px-6 py-6 space-y-6">

          {/* Destinataires */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Destinataire(s) *</label>
            <div className="relative">

              <input type="text" 
                     placeholder="Tapez le nom d'un membre ou son email..."
                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

              <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg mt-1 shadow-lg hidden">

                {/* Suggestions utilisateurs */}
                <div className="p-2 space-y-1">

                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">

                    <img src="https://ui-avatars.com/api/?name=Sarah+Okoye&background=10b981&color=fff" 
                         alt="Sarah Okoye" className="w-8 h-8 rounded-full" />

                    <div>
                      <div className="font-medium text-gray-900">Sarah Okoye</div>
                      <div className="text-sm text-gray-600">Investisseuse Impact</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded cursor-pointer">

                    <img src="https://ui-avatars.com/api/?name=Ahmed+Ben+Ali&background=3b82f6&color=fff" 
                         alt="Ahmed Ben Ali" className="w-8 h-8 rounded-full" />

                    <div>
                      <div className="font-medium text-gray-900">Ahmed Ben Ali</div>
                      <div className="text-sm text-gray-600">CTO, SolarAI Solutions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">

              Vous pouvez ajouter plusieurs destinataires en les séparant par des virgules
            </p>
          </div>

          {/* Sujet */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sujet *</label>
            <input type="text" required
                   placeholder="Ex: Collaboration pour projet solaire en Côte d'Ivoire"
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

          </div>

          {/* Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Message *</label>
            <div className="border border-gray-300 rounded-lg">

              {/* Barre d'outils */}
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
                  <button type="button" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="Lien">
                    <i className="fas fa-link"></i>
                  </button>
                  <button type="button" className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded transition-colors" title="Emoji">
                    <i className="far fa-smile"></i>
                  </button>
                </div>
              </div>
              
              <textarea rows="12" required
                        placeholder="Rédigez votre message...&#10;&#10;Conseils:&#10;- Soyez clair sur l'objet de votre message&#10;- Présentez-vous brièvement&#10;- Proposez une valeur ou posez une question précise"
                        className="w-full px-4 py-3 border-0 focus:ring-0 resize-none"></textarea>
            </div>
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

                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700">Demander un accusé de réception</span>
              </label>

              <label className="flex items-center">

                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <span className="ml-2 text-sm text-gray-700">Marquer comme prioritaire</span>
              </label>

              <label className="flex items-center">

                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" checked />
                <span className="ml-2 text-sm text-gray-700">Recevoir des notifications pour les réponses</span>
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

                <a href="/messages" className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">

                  Annuler
                </a>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">

                  <i className="fas fa-paper-plane mr-2"></i>
                  Envoyer le Message
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
})

// Page des notifications
messages.get('/notifications', (c) => {
  return c.render(
    <div className="max-w-4xl mx-auto space-y-6">

      {/* En-tête */}
      <div className="bg-white rounded-lg shadow p-6">

        <div className="flex items-center justify-between mb-4">

          <h1 className="text-2xl font-bold text-gray-900">

            <i className="fas fa-bell mr-2 text-yellow-600"></i>
            Notifications
          </h1>
          <div className="flex items-center space-x-3">

            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">

              <i className="fas fa-check-double mr-1"></i>
              Tout marquer comme lu
            </button>
            <a href="/messages/notifications/settings" className="text-gray-600 hover:text-gray-900 text-sm">

              <i className="fas fa-cog"></i>
            </a>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex items-center space-x-4">

          <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm">Toutes</button>
          <button className="text-gray-600 hover:text-yellow-600 px-4 py-2 rounded-lg text-sm transition-colors">Non lues</button>
          <button className="text-gray-600 hover:text-yellow-600 px-4 py-2 rounded-lg text-sm transition-colors">Messages</button>
          <button className="text-gray-600 hover:text-yellow-600 px-4 py-2 rounded-lg text-sm transition-colors">Forum</button>
          <button className="text-gray-600 hover:text-yellow-600 px-4 py-2 rounded-lg text-sm transition-colors">Événements</button>
          <button className="text-gray-600 hover:text-yellow-600 px-4 py-2 rounded-lg text-sm transition-colors">Système</button>
        </div>
      </div>

      {/* Liste des notifications */}
      <div className="bg-white rounded-lg shadow divide-y divide-gray-200">

        {/* Notification non lue */}
        <div className="p-6 bg-blue-50 border-l-4 border-blue-600">

          <div className="flex items-start space-x-4">

            <div className="relative">

              <img src="https://ui-avatars.com/api/?name=Sarah+Okoye&background=10b981&color=fff" 
                   alt="Sarah Okoye" className="w-12 h-12 rounded-full" />

              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full"></div>
            </div>
            <div className="flex-1">

              <div className="flex items-start justify-between">

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">

                    <i className="fas fa-envelope mr-2 text-blue-600"></i>
                    Nouveau message de Sarah Okoye
                  </h3>
                  <p className="text-gray-700 mb-2">

                    "Parfait ! Je peux te faire une intro avec I&P. Envoie-moi ton deck par email..."
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">

                    <span>il y a 5 minutes</span>
                    <a href="/messages" className="text-blue-600 hover:text-blue-700 font-medium">

                      Voir le message →
                    </a>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">

                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification forum */}
        <div className="p-6 hover:bg-gray-50 transition-colors">

          <div className="flex items-start space-x-4">

            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center">

              <i className="fas fa-comments text-white"></i>
            </div>
            <div className="flex-1">

              <div className="flex items-start justify-between">

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">

                    <i className="fas fa-reply mr-2 text-indigo-600"></i>
                    Nouvelle réponse sur votre sujet de forum
                  </h3>
                  <p className="text-gray-700 mb-2">

                    Ahmed Ben Ali a répondu à "Conseils pour financer une startup solaire en Côte d'Ivoire"
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">

                    <span>il y a 2 heures</span>
                    <a href="/forum/topic/financement-startup-solaire-cote-ivoire" className="text-indigo-600 hover:text-indigo-700 font-medium">

                      Voir la réponse →
                    </a>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">

                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification événement */}
        <div className="p-6 hover:bg-gray-50 transition-colors">

          <div className="flex items-start space-x-4">

            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">

              <i className="fas fa-calendar text-white"></i>
            </div>
            <div className="flex-1">

              <div className="flex items-start justify-between">

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">

                    <i className="fas fa-bell mr-2 text-purple-600"></i>
                    Rappel d'événement
                  </h3>
                  <p className="text-gray-700 mb-2">

                    "Intelligence Artificielle et Économie Verte en Afrique" commence demain à 09:00
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">

                    <span>il y a 4 heures</span>
                    <a href="/events/ia-verte-conference-2024" className="text-purple-600 hover:text-purple-700 font-medium">

                      Voir l'événement →
                    </a>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">

                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification connexion */}
        <div className="p-6 hover:bg-gray-50 transition-colors">

          <div className="flex items-start space-x-4">

            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">

              <i className="fas fa-user-plus text-white"></i>
            </div>
            <div className="flex-1">

              <div className="flex items-start justify-between">

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">

                    <i className="fas fa-handshake mr-2 text-green-600"></i>
                    Nouvelle demande de connexion
                  </h3>
                  <p className="text-gray-700 mb-2">

                    Marie Diop souhaite se connecter avec vous
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">

                    <span>hier</span>
                    <div className="flex items-center space-x-2">

                      <button className="text-green-600 hover:text-green-700 font-medium">

                        Accepter
                      </button>
                      <span>•</span>
                      <button className="text-gray-600 hover:text-gray-700">

                        Refuser
                      </button>
                    </div>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">

                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification système */}
        <div className="p-6 hover:bg-gray-50 transition-colors">

          <div className="flex items-start space-x-4">

            <div className="w-12 h-12 bg-gray-600 rounded-full flex items-center justify-center">

              <i className="fas fa-cog text-white"></i>
            </div>
            <div className="flex-1">

              <div className="flex items-start justify-between">

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">

                    <i className="fas fa-info-circle mr-2 text-gray-600"></i>
                    Mise à jour du profil
                  </h3>
                  <p className="text-gray-700 mb-2">

                    Votre profil a été mis à jour avec succès. Les nouvelles informations sont maintenant visibles.
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">

                    <span>il y a 2 jours</span>
                    <a href="/profile" className="text-gray-600 hover:text-gray-700 font-medium">

                      Voir le profil →
                    </a>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">

                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification opportunité */}
        <div className="p-6 hover:bg-gray-50 transition-colors">

          <div className="flex items-start space-x-4">

            <div className="w-12 h-12 bg-yellow-600 rounded-full flex items-center justify-center">

              <i className="fas fa-briefcase text-white"></i>
            </div>
            <div className="flex-1">

              <div className="flex items-start justify-between">

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">

                    <i className="fas fa-star mr-2 text-yellow-600"></i>
                    Nouvelle opportunité recommandée
                  </h3>
                  <p className="text-gray-700 mb-2">

                    "Développeur Senior Energy Tech" chez GreenTech Solutions correspond à votre profil
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">

                    <span>il y a 3 jours</span>
                    <a href="/opportunities/dev-senior-energy-tech" className="text-yellow-600 hover:text-yellow-700 font-medium">

                      Voir l'opportunité →
                    </a>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">

                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification ressource */}
        <div className="p-6 hover:bg-gray-50 transition-colors">

          <div className="flex items-start space-x-4">

            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">

              <i className="fas fa-book text-white"></i>
            </div>
            <div className="flex-1">

              <div className="flex items-start justify-between">

                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">

                    <i className="fas fa-download mr-2 text-blue-600"></i>
                    Nouvelle ressource disponible
                  </h3>
                  <p className="text-gray-700 mb-2">

                    "Guide Certification Carbone 2024" - Une ressource qui pourrait vous intéresser
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">

                    <span>il y a 1 semaine</span>
                    <a href="/resources/guide-certification-carbone-2024" className="text-blue-600 hover:text-blue-700 font-medium">

                      Voir la ressource →
                    </a>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">

                  <i className="fas fa-times"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2">

        <button className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">

          <i className="fas fa-chevron-left"></i>
        </button>
        <button className="px-3 py-2 bg-yellow-600 text-white rounded-lg">1</button>
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

// Page des paramètres de notifications
messages.get('/notifications/settings', (c) => {
  return c.render(
    <div className="max-w-4xl mx-auto">

      <div className="bg-white shadow rounded-lg">

        <div className="px-6 py-4 border-b border-gray-200">

          <h1 className="text-xl font-semibold text-gray-900">

            <i className="fas fa-cog mr-2 text-gray-600"></i>
            Paramètres des Notifications
          </h1>
          <p className="mt-1 text-sm text-gray-600">

            Gérez vos préférences de notifications pour rester informé selon vos besoins
          </p>
        </div>

        <form className="px-6 py-6 space-y-8">

          {/* Messages privés */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">

              <i className="fas fa-envelope mr-2 text-blue-600"></i>
              Messages Privés
            </h3>
            <div className="space-y-4">

              <div className="flex items-center justify-between">

                <div>
                  <h4 className="font-medium text-gray-900">Nouveaux messages</h4>
                  <p className="text-sm text-gray-600">Recevoir une notification pour chaque nouveau message</p>
                </div>
                <div className="flex items-center space-x-4">

                  <label className="flex items-center">

                    <input type="checkbox" checked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center">

                    <input type="checkbox" checked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Push</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">

                <div>
                  <h4 className="font-medium text-gray-900">Mentions dans les groupes</h4>
                  <p className="text-sm text-gray-600">Quand quelqu'un vous mentionne dans un groupe</p>
                </div>
                <div className="flex items-center space-x-4">

                  <label className="flex items-center">

                    <input type="checkbox" checked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center">

                    <input type="checkbox" checked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Push</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">

                <div>
                  <h4 className="font-medium text-gray-900">Demandes de connexion</h4>
                  <p className="text-sm text-gray-600">Nouvelles demandes de connexion réseau</p>
                </div>
                <div className="flex items-center space-x-4">

                  <label className="flex items-center">

                    <input type="checkbox" checked className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center">

                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                    <span className="ml-2 text-sm text-gray-700">Push</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Forum */}
          <div className="border-t border-gray-200 pt-8">

            <h3 className="text-lg font-medium text-gray-900 mb-4">

              <i className="fas fa-comments mr-2 text-indigo-600"></i>
              Forum et Discussions
            </h3>
            <div className="space-y-4">

              <div className="flex items-center justify-between">

                <div>
                  <h4 className="font-medium text-gray-900">Réponses à mes sujets</h4>
                  <p className="text-sm text-gray-600">Quand quelqu'un répond à un sujet que j'ai créé</p>
                </div>
                <div className="flex items-center space-x-4">

                  <label className="flex items-center">

                    <input type="checkbox" checked className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="ml-2 text-sm text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center">

                    <input type="checkbox" checked className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="ml-2 text-sm text-gray-700">Push</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">

                <div>
                  <h4 className="font-medium text-gray-900">Mentions dans le forum</h4>
                  <p className="text-sm text-gray-600">Quand quelqu'un me mentionne dans une discussion</p>
                </div>
                <div className="flex items-center space-x-4">

                  <label className="flex items-center">

                    <input type="checkbox" checked className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="ml-2 text-sm text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center">

                    <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="ml-2 text-sm text-gray-700">Push</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">

                <div>
                  <h4 className="font-medium text-gray-900">Digest hebdomadaire</h4>
                  <p className="text-sm text-gray-600">Résumé des discussions populaires de la semaine</p>
                </div>
                <div className="flex items-center space-x-4">

                  <label className="flex items-center">

                    <input type="checkbox" checked className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="ml-2 text-sm text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center">

                    <input type="checkbox" className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    <span className="ml-2 text-sm text-gray-700">Push</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Événements */}
          <div className="border-t border-gray-200 pt-8">

            <h3 className="text-lg font-medium text-gray-900 mb-4">

              <i className="fas fa-calendar mr-2 text-purple-600"></i>
              Événements
            </h3>
            <div className="space-y-4">

              <div className="flex items-center justify-between">

                <div>
                  <h4 className="font-medium text-gray-900">Rappels d'événements</h4>
                  <p className="text-sm text-gray-600">Rappels pour les événements auxquels je suis inscrit</p>
                </div>
                <div className="flex items-center space-x-4">

                  <label className="flex items-center">

                    <input type="checkbox" checked className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                    <span className="ml-2 text-sm text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center">

                    <input type="checkbox" checked className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                    <span className="ml-2 text-sm text-gray-700">Push</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">

                <div>
                  <h4 className="font-medium text-gray-900">Nouveaux événements</h4>
                  <p className="text-sm text-gray-600">Événements recommandés selon mes intérêts</p>
                </div>
                <div className="flex items-center space-x-4">

                  <label className="flex items-center">

                    <input type="checkbox" checked className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                    <span className="ml-2 text-sm text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center">

                    <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" />
                    <span className="ml-2 text-sm text-gray-700">Push</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Opportunités */}
          <div className="border-t border-gray-200 pt-8">

            <h3 className="text-lg font-medium text-gray-900 mb-4">

              <i className="fas fa-briefcase mr-2 text-green-600"></i>
              Opportunités
            </h3>
            <div className="space-y-4">

              <div className="flex items-center justify-between">

                <div>
                  <h4 className="font-medium text-gray-900">Nouvelles opportunités</h4>
                  <p className="text-sm text-gray-600">Opportunités correspondant à mon profil</p>
                </div>
                <div className="flex items-center space-x-4">

                  <label className="flex items-center">

                    <input type="checkbox" checked className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center">

                    <input type="checkbox" className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-700">Push</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-between">

                <div>
                  <h4 className="font-medium text-gray-900">Candidatures</h4>
                  <p className="text-sm text-gray-600">Mises à jour sur mes candidatures</p>
                </div>
                <div className="flex items-center space-x-4">

                  <label className="flex items-center">

                    <input type="checkbox" checked className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-700">Email</span>
                  </label>
                  <label className="flex items-center">

                    <input type="checkbox" checked className="rounded border-gray-300 text-green-600 focus:ring-green-500" />
                    <span className="ml-2 text-sm text-gray-700">Push</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Fréquence des notifications */}
          <div className="border-t border-gray-200 pt-8">

            <h3 className="text-lg font-medium text-gray-900 mb-4">

              <i className="fas fa-clock mr-2 text-gray-600"></i>
              Fréquence des Notifications
            </h3>
            <div className="space-y-4">

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notifications par email</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">

                  <option value="instant">Instantané</option>
                  <option value="hourly">Toutes les heures</option>
                  <option value="daily" selected>Quotidien (9h00)</option>
                  <option value="weekly">Hebdomadaire (lundi 9h00)</option>
                  <option value="never">Jamais</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Mode silencieux</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">De</label>
                    <input type="time" value="22:00" 
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">À</label>
                    <input type="time" value="08:00" 
                           className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />

                  </div>
                </div>
                <p className="mt-1 text-xs text-gray-500">

                  Aucune notification push ne sera envoyée pendant ces heures
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 pt-6">

            <div className="flex items-center justify-between">

              <button type="button" className="text-red-600 hover:text-red-700 text-sm font-medium">

                <i className="fas fa-bell-slash mr-2"></i>
                Désactiver toutes les notifications
              </button>
              <div className="flex items-center space-x-3">

                <a href="/messages/notifications" className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">

                  Annuler
                </a>
                <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">

                  <i className="fas fa-save mr-2"></i>
                  Enregistrer les Paramètres
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
})

export default messages