import { supabase } from '@/lib/supabase'

/**
 * Service pour gérer les pays
 */
class CountriesService {
  /**
   * Récupérer tous les pays actifs (triés alphabétiquement)
   * @param {Object} options - Options de filtrage
   * @returns {Promise<Array>}
   */
  async getActiveCountries(options = {}) {
    try {
      let query = supabase
        .from('pev_countries')
        .select('*')
        .eq('is_active', true)

      // Filtrer par continent si spécifié
      if (options.continent) {
        query = query.eq('continent', options.continent)
      }

      const { data, error } = await query.order('display_order').order('name')

      if (error) throw error

      // Trier: "Autre" à la fin, puis alphabétique
      return (data || []).sort((a, b) => {
        if (a.continent === 'Autre' && b.continent !== 'Autre') return 1
        if (a.continent !== 'Autre' && b.continent === 'Autre') return -1
        return a.name.localeCompare(b.name, 'fr')
      })
    } catch (error) {
      console.error('Erreur lors de la récupération des pays:', error)
      return this.getFallbackCountries()
    }
  }

  /**
   * Récupérer uniquement les noms des pays actifs
   * @returns {Promise<Array<string>>}
   */
  async getCountryNames() {
    const countries = await this.getActiveCountries()
    return countries.map(c => c.name)
  }

  /**
   * Récupérer les pays africains uniquement
   * @returns {Promise<Array>}
   */
  async getAfricanCountries() {
    return this.getActiveCountries({ continent: 'Afrique' })
  }

  /**
   * Récupérer les noms des pays africains
   * @returns {Promise<Array<string>>}
   */
  async getAfricanCountryNames() {
    const countries = await this.getAfricanCountries()
    return countries.map(c => c.name)
  }

  /**
   * Récupérer un pays par son nom
   * @param {string} name - Nom du pays
   * @returns {Promise<Object|null>}
   */
  async getCountryByName(name) {
    try {
      const { data, error } = await supabase
        .from('pev_countries')
        .select('*')
        .eq('name', name)
        .eq('is_active', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération du pays:', error)
      return null
    }
  }

  /**
   * Récupérer un pays par son code ISO
   * @param {string} code - Code ISO du pays (ex: BF, SN)
   * @returns {Promise<Object|null>}
   */
  async getCountryByCode(code) {
    try {
      const { data, error } = await supabase
        .from('pev_countries')
        .select('*')
        .eq('code', code.toUpperCase())
        .eq('is_active', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Erreur lors de la récupération du pays:', error)
      return null
    }
  }

  /**
   * Liste de fallback si la BDD n'est pas disponible
   * @returns {Array<string>}
   */
  getFallbackCountries() {
    return [
      'Afrique du Sud', 'Algérie', 'Angola', 'Bénin', 'Botswana', 'Burkina Faso', 'Burundi',
      'Cameroun', 'Cap-Vert', 'Comores', 'Côte d\'Ivoire', 'Djibouti',
      'Égypte', 'Érythrée', 'Eswatini', 'Éthiopie',
      'Gabon', 'Gambie', 'Ghana', 'Guinée', 'Guinée équatoriale', 'Guinée-Bissau',
      'Kenya', 'Lesotho', 'Libéria', 'Libye',
      'Madagascar', 'Malawi', 'Mali', 'Maroc', 'Maurice', 'Mauritanie', 'Mozambique',
      'Namibie', 'Niger', 'Nigéria', 'Ouganda',
      'République centrafricaine', 'République démocratique du Congo', 'République du Congo', 'Rwanda',
      'São Tomé-et-Príncipe', 'Sénégal', 'Seychelles', 'Sierra Leone', 'Somalie', 'Soudan', 'Soudan du Sud',
      'Tanzanie', 'Tchad', 'Togo', 'Tunisie',
      'Zambie', 'Zimbabwe',
      'Autre'
    ]
  }

  /**
   * Récupérer la liste des continents disponibles
   * @returns {Promise<Array<string>>}
   */
  async getContinents() {
    try {
      const { data, error } = await supabase
        .from('pev_countries')
        .select('continent')
        .eq('is_active', true)

      if (error) throw error

      // Extraire les continents uniques et trier
      const continents = [...new Set(data.map(c => c.continent))]
      return continents.sort((a, b) => {
        if (a === 'Autre') return 1
        if (b === 'Autre') return -1
        return a.localeCompare(b, 'fr')
      })
    } catch (error) {
      console.error('Erreur lors de la récupération des continents:', error)
      return ['Afrique', 'Autre']
    }
  }
}

// Instance singleton
const countriesService = new CountriesService()
export default countriesService
