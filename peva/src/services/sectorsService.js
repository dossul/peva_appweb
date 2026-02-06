/**
 * Service centralisé pour les secteurs d'activité
 * Source unique de données depuis pev_sectors
 */
import { supabase } from '@/lib/supabase'

// Cache local pour éviter les requêtes répétées
let sectorsCache = null
let lastFetch = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Récupère tous les secteurs actifs depuis la BDD
 * @returns {Promise<Array>} Liste des secteurs
 */
export async function getSectors() {
  // Vérifier le cache
  if (sectorsCache && lastFetch && (Date.now() - lastFetch < CACHE_DURATION)) {
    return sectorsCache
  }

  try {
    const { data, error } = await supabase
      .from('pev_sectors')
      .select('id, name, slug, icon, color, sort_order')
      .eq('is_active', true)
      .order('sort_order')

    if (error) {
      console.error('Erreur chargement secteurs:', error)
      return []
    }

    sectorsCache = data
    lastFetch = Date.now()
    return data
  } catch (error) {
    console.error('Erreur sectorsService:', error)
    return []
  }
}

/**
 * Récupère uniquement les noms des secteurs (pour les v-select)
 * @returns {Promise<Array<string>>} Liste des noms
 */
export async function getSectorNames() {
  const sectors = await getSectors()
  return sectors.map(s => s.name)
}

/**
 * Récupère les secteurs formatés pour v-select avec label/value
 * @returns {Promise<Array>} Liste formatée
 */
export async function getSectorOptions() {
  const sectors = await getSectors()
  return sectors.map(s => ({
    title: s.name,
    value: s.slug
  }))
}

/**
 * Récupère la couleur d'un secteur par son nom
 * @param {string} sectorName Nom du secteur
 * @returns {Promise<string>} Couleur hex
 */
export async function getSectorColor(sectorName) {
  const sectors = await getSectors()
  const sector = sectors.find(s => 
    s.name.toLowerCase() === sectorName?.toLowerCase() ||
    s.slug === sectorName?.toLowerCase()
  )
  return sector?.color || '#9ca3af'
}

/**
 * Récupère l'icône d'un secteur par son nom
 * @param {string} sectorName Nom du secteur
 * @returns {Promise<string>} Icône MDI
 */
export async function getSectorIcon(sectorName) {
  const sectors = await getSectors()
  const sector = sectors.find(s => 
    s.name.toLowerCase() === sectorName?.toLowerCase() ||
    s.slug === sectorName?.toLowerCase()
  )
  return sector?.icon || 'mdi-briefcase'
}

/**
 * Invalide le cache (à appeler après une modification)
 */
export function invalidateCache() {
  sectorsCache = null
  lastFetch = null
}

export default {
  getSectors,
  getSectorNames,
  getSectorOptions,
  getSectorColor,
  getSectorIcon,
  invalidateCache
}
