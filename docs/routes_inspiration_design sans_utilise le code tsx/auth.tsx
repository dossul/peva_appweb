import { Hono } from 'hono'

const app = new Hono()

// Login page
app.get('/login', (c) => {
  return c.render(
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">

      <div className="max-w-md w-full space-y-8">

        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-peva-green-100">

            <i className="fas fa-leaf text-peva-green-600 text-xl"></i>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">

            Connexion à votre compte
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">

            Ou{' '}
            <a href="/auth/register" className="font-medium text-peva-green-600 hover:text-peva-green-500">

              créer un nouveau compte
            </a>
          </p>
        </div>
        
        <form className="mt-8 space-y-6">

          <div className="rounded-md shadow-sm -space-y-px">

            <div>
              <label htmlFor="email" className="sr-only">Adresse email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-peva-green-500 focus:border-peva-green-500 focus:z-10 sm:text-sm"
                placeholder="ex: fatou.diallo@faso-vert.bf"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-peva-green-500 focus:border-peva-green-500 focus:z-10 sm:text-sm"
                placeholder="Mot de passe"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">

            <div className="flex items-center">

              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">

                Se souvenir de moi
              </label>
            </div>

            <div className="text-sm">

              <a href="/auth/forgot-password" className="font-medium text-peva-green-600 hover:text-peva-green-500">

                Mot de passe oublié ?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-peva-green-600 hover:bg-peva-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-peva-green-500"
            >
              <i className="fas fa-sign-in-alt mr-2"></i>
              Se connecter
            </button>
          </div>

          <div className="mt-6">

            <div className="relative">

              <div className="absolute inset-0 flex items-center">

                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">

                <span className="px-2 bg-gray-50 text-gray-500">Ou continuer avec</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">

              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">

                <i className="fab fa-google text-red-500"></i>
                <span className="ml-2">Google</span>
              </button>
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">

                <i className="fab fa-linkedin text-blue-600"></i>
                <span className="ml-2">LinkedIn</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>, { title: 'Connexion - PEVA' }
  )
})

// Register page
app.get('/register', (c) => {
  return c.render(
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">

      <div className="max-w-md w-full space-y-8">

        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-peva-green-100">

            <i className="fas fa-leaf text-peva-green-600 text-xl"></i>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">

            Créer votre compte PEVA
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">

            Déjà membre ?{' '}
            <a href="/auth/login" className="font-medium text-peva-green-600 hover:text-peva-green-500">

              Se connecter
            </a>
          </p>
        </div>
        
        <form className="mt-8 space-y-6">

          <div className="space-y-4">

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nom complet</label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                placeholder="ex: Fatoumata Traoré"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                placeholder="fatoumata.traore@faso-vert.bf"
              />
            </div>
            
            <div>
              <label htmlFor="country" className="block text-sm font-medium text-gray-700">Pays</label>
              <select
                id="country"
                name="country"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
              >
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
                <option value="DZ">🇩🇿 Algérie</option>
                <option value="MA">🇲🇦 Maroc</option>
                <option value="TN">🇹🇳 Tunisie</option>
                <option value="EG">🇪🇬 Égypte</option>
                <option value="KE">🇰🇪 Kenya</option>
                <option value="UG">🇺🇬 Ouganda</option>
                <option value="TZ">🇹🇿 Tanzanie</option>
                <option value="ZA">🇿🇦 Afrique du Sud</option>
                <option value="ZW">🇿🇼 Zimbabwe</option>
                <option value="ZM">🇿🇲 Zambie</option>
                <option value="MW">🇲🇼 Malawi</option>
                <option value="MZ">🇲🇿 Mozambique</option>
                <option value="AO">🇦🇴 Angola</option>
                <option value="CD">🇨🇩 RD Congo</option>
                <option value="CG">🇨🇬 Congo</option>
                <option value="CM">🇨🇲 Cameroun</option>
                <option value="GA">🇬🇦 Gabon</option>
                <option value="GQ">🇬🇶 Guinée Équatoriale</option>
                <option value="CF">🇨🇫 République Centrafricaine</option>
                <option value="TD">🇹🇩 Tchad</option>
                <option value="DJ">🇩🇯 Djibouti</option>
                <option value="ER">🇪🇷 Érythrée</option>
                <option value="ET">🇪🇹 Éthiopie</option>
                <option value="SO">🇸🇴 Somalie</option>
                <option value="SS">🇸🇸 Soudan du Sud</option>
                <option value="SD">🇸🇩 Soudan</option>
                <option value="LY">🇱🇾 Libye</option>
                <option value="MR">🇲🇷 Mauritanie</option>
                <option value="RW">🇷🇼 Rwanda</option>
                <option value="BI">🇧🇮 Burundi</option>
                <option value="MG">🇲🇬 Madagascar</option>
                <option value="MU">🇲🇺 Maurice</option>
                <option value="SC">🇸🇨 Seychelles</option>
                <option value="KM">🇰🇲 Comores</option>
                <option value="SZ">🇸🇿 Eswatini</option>
                <option value="LS">🇱🇸 Lesotho</option>
                <option value="BW">🇧🇼 Botswana</option>
                <option value="NA">🇳🇦 Namibie</option>
                
                {/* Partenaires internationaux */}
                <option value="FR">🇫🇷 France</option>
                <option value="BE">🇧🇪 Belgique</option>
                <option value="CH">🇨🇭 Suisse</option>
                <option value="CA">🇨🇦 Canada</option>
                <option value="US">🇺🇸 États-Unis</option>
                <option value="DE">🇩🇪 Allemagne</option>
                <option value="NL">🇳🇱 Pays-Bas</option>
                <option value="GB">🇬🇧 Royaume-Uni</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Type de profil</label>
              <div className="space-y-2">

                <label className="flex items-center">

                  <input type="radio" name="user_type" value="entrepreneur" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300" />
                  <span className="ml-2 text-sm text-gray-700">Entrepreneur / Porteur de projet</span>
                </label>
                <label className="flex items-center">

                  <input type="radio" name="user_type" value="investisseur" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300" />
                  <span className="ml-2 text-sm text-gray-700">Investisseur / Bailleur</span>
                </label>
                <label className="flex items-center">

                  <input type="radio" name="user_type" value="expert" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300" />
                  <span className="ml-2 text-sm text-gray-700">Expert / Consultant</span>
                </label>
                <label className="flex items-center">

                  <input type="radio" name="user_type" value="organisation" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300" />
                  <span className="ml-2 text-sm text-gray-700">Organisation / Institution</span>
                </label>
                <label className="flex items-center">

                  <input type="radio" name="user_type" value="recruteur" className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300" />
                  <span className="ml-2 text-sm text-gray-700">Recruteur / RH</span>
                </label>
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                placeholder="Minimum 8 caractères"
              />
            </div>
            
            <div>
              <label htmlFor="password_confirm" className="block text-sm font-medium text-gray-700">Confirmer le mot de passe</label>
              <input
                id="password_confirm"
                name="password_confirm"
                type="password"
                required
                className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
                placeholder="Confirmer votre mot de passe"
              />
            </div>
          </div>

          <div className="space-y-4">

            <div className="flex items-center">

              <input
                id="accept-terms"
                name="accept-terms"
                type="checkbox"
                required
                className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded"
              />
              <label htmlFor="accept-terms" className="ml-2 block text-sm text-gray-900">

                J'accepte les{' '}
                <a href="/terms" className="text-peva-green-600 hover:text-peva-green-500">

                  conditions d'utilisation
                </a>{' '}
                et la{' '}
                <a href="/privacy" className="text-peva-green-600 hover:text-peva-green-500">

                  politique de confidentialité
                </a>
              </label>
            </div>
            
            <div className="flex items-center">

              <input
                id="newsletter"
                name="newsletter"
                type="checkbox"
                className="h-4 w-4 text-peva-green-600 focus:ring-peva-green-500 border-gray-300 rounded"
              />
              <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-900">

                Je souhaite recevoir la newsletter PEVA (optionnel)
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-peva-green-600 hover:bg-peva-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-peva-green-500"
            >
              <i className="fas fa-user-plus mr-2"></i>
              Créer mon compte
            </button>
          </div>

          <div className="mt-6">

            <div className="relative">

              <div className="absolute inset-0 flex items-center">

                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">

                <span className="px-2 bg-gray-50 text-gray-500">Ou s'inscrire avec</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">

              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">

                <i className="fab fa-google text-red-500"></i>
                <span className="ml-2">Google</span>
              </button>
              <button className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">

                <i className="fab fa-linkedin text-blue-600"></i>
                <span className="ml-2">LinkedIn</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>, { title: 'Inscription - PEVA' }
  )
})

// Forgot password page
app.get('/forgot-password', (c) => {
  return c.render(
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">

      <div className="max-w-md w-full space-y-8">

        <div>
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-peva-green-100">

            <i className="fas fa-key text-peva-green-600 text-xl"></i>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">

            Mot de passe oublié
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">

            Saisissez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
        </div>
        
        <form className="mt-8 space-y-6">

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Adresse email</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-peva-green-500 focus:border-peva-green-500 sm:text-sm"
              placeholder="votre@email.com"
            />
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-peva-green-600 hover:bg-peva-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-peva-green-500"
            >
              <i className="fas fa-paper-plane mr-2"></i>
              Envoyer le lien de réinitialisation
            </button>
          </div>

          <div className="text-center">

            <a href="/auth/login" className="font-medium text-peva-green-600 hover:text-peva-green-500">

              <i className="fas fa-arrow-left mr-1"></i>
              Retour à la connexion
            </a>
          </div>
        </form>
      </div>
    </div>, { title: 'Mot de passe oublié - PEVA' }
  )
})

// Email verification page
app.get('/verify', (c) => {
  return c.render(
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">

      <div className="max-w-md w-full space-y-8 text-center">

        <div>
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100">

            <i className="fas fa-envelope-open-text text-blue-600 text-2xl"></i>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">

            Vérifiez votre email
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">

            Nous avons envoyé un email de confirmation à <strong>amina.kone@example.com</strong>
          </p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">

          <div className="text-sm text-gray-700 space-y-4">

            <p>Pour activer votre compte :</p>
            <ol className="list-decimal list-inside space-y-2 text-left">

              <li>Vérifiez votre boîte de réception</li>
              <li>Cliquez sur le lien dans l'email reçu</li>
              <li>Votre compte sera activé automatiquement</li>
            </ol>
            <div className="border-t pt-4">

              <p className="text-xs text-gray-500">

                Vous n'avez pas reçu l'email ? Vérifiez vos spams ou{' '}
                <button className="text-peva-green-600 hover:text-peva-green-500 font-medium">

                  renvoyer l'email
                </button>
              </p>
            </div>
          </div>
        </div>

        <div>
          <a href="/auth/login" className="font-medium text-peva-green-600 hover:text-peva-green-500">

            <i className="fas fa-arrow-left mr-1"></i>
            Retour à la connexion
          </a>
        </div>
      </div>
    </div>, { title: 'Vérification email - PEVA' }
  )
})

export default app