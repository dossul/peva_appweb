import { ref, onMounted, onUnmounted, nextTick } from 'vue'

/**
 * Composable pour optimiser les performances des vues PEVA
 */
export function usePerformance() {
  const isLoading = ref(false)
  const loadingStates = ref({})
  
  /**
   * Gère l'état de chargement global
   */
  const setLoading = (loading) => {
    isLoading.value = loading
  }

  /**
   * Gère l'état de chargement par composant
   */
  const setComponentLoading = (componentName, loading) => {
    loadingStates.value[componentName] = loading
  }

  /**
   * Debounce pour les recherches
   */
  const debounce = (func, wait) => {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }

  /**
   * Throttle pour les événements fréquents
   */
  const throttle = (func, limit) => {
    let inThrottle
    return function() {
      const args = arguments
      const context = this
      if (!inThrottle) {
        func.apply(context, args)
        inThrottle = true
        setTimeout(() => inThrottle = false, limit)
      }
    }
  }

  /**
   * Lazy loading pour les images
   */
  const lazyLoadImages = () => {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target
          img.src = img.dataset.src
          img.classList.remove('lazy')
          observer.unobserve(img)
        }
      })
    })

    const lazyImages = document.querySelectorAll('img[data-src]')
    lazyImages.forEach(img => imageObserver.observe(img))

    return () => {
      lazyImages.forEach(img => imageObserver.unobserve(img))
    }
  }

  /**
   * Pagination virtuelle pour les grandes listes
   */
  const useVirtualScroll = (items, itemHeight = 100, containerHeight = 400) => {
    const scrollTop = ref(0)
    const visibleStart = ref(0)
    const visibleEnd = ref(Math.ceil(containerHeight / itemHeight))

    const onScroll = throttle((event) => {
      scrollTop.value = event.target.scrollTop
      visibleStart.value = Math.floor(scrollTop.value / itemHeight)
      visibleEnd.value = Math.min(
        visibleStart.value + Math.ceil(containerHeight / itemHeight) + 1,
        items.length
      )
    }, 16)

    const visibleItems = computed(() => {
      return items.slice(visibleStart.value, visibleEnd.value).map((item, index) => ({
        ...item,
        index: visibleStart.value + index
      }))
    })

    const totalHeight = computed(() => items.length * itemHeight)
    const offsetY = computed(() => visibleStart.value * itemHeight)

    return {
      visibleItems,
      totalHeight,
      offsetY,
      onScroll
    }
  }

  /**
   * Cache simple pour les données
   */
  const cache = new Map()
  
  const getCached = (key) => {
    const cached = cache.get(key)
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) { // 5 minutes
      return cached.data
    }
    return null
  }

  const setCache = (key, data) => {
    cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  /**
   * Préchargement des données critiques
   */
  const preloadCriticalData = async (dataLoaders) => {
    const promises = Object.entries(dataLoaders).map(async ([key, loader]) => {
      try {
        const cached = getCached(key)
        if (cached) return { [key]: cached }
        
        const data = await loader()
        setCache(key, data)
        return { [key]: data }
      } catch (error) {
        console.error(`Erreur lors du préchargement de ${key}:`, error)
        return { [key]: null }
      }
    })

    const results = await Promise.allSettled(promises)
    return results.reduce((acc, result) => {
      if (result.status === 'fulfilled') {
        Object.assign(acc, result.value)
      }
      return acc
    }, {})
  }

  /**
   * Optimisation des re-rendus
   */
  const useOptimizedRender = (dependencies) => {
    const shouldUpdate = ref(true)
    const lastDeps = ref(JSON.stringify(dependencies))

    const checkShouldUpdate = () => {
      const currentDeps = JSON.stringify(dependencies)
      if (currentDeps !== lastDeps.value) {
        lastDeps.value = currentDeps
        shouldUpdate.value = true
        nextTick(() => {
          shouldUpdate.value = false
        })
      }
    }

    return {
      shouldUpdate,
      checkShouldUpdate
    }
  }

  /**
   * Nettoyage automatique des ressources
   */
  const cleanup = ref([])
  
  const addCleanup = (cleanupFn) => {
    cleanup.value.push(cleanupFn)
  }

  onUnmounted(() => {
    cleanup.value.forEach(fn => {
      try {
        fn()
      } catch (error) {
        console.error('Erreur lors du nettoyage:', error)
      }
    })
    cleanup.value = []
    cache.clear()
  })

  return {
    // États
    isLoading,
    loadingStates,
    
    // Méthodes de chargement
    setLoading,
    setComponentLoading,
    
    // Optimisations
    debounce,
    throttle,
    lazyLoadImages,
    useVirtualScroll,
    
    // Cache
    getCached,
    setCache,
    preloadCriticalData,
    
    // Rendu optimisé
    useOptimizedRender,
    
    // Nettoyage
    addCleanup
  }
}

/**
 * Composable spécialisé pour les listes paginées
 */
export function usePaginatedList(initialItems = [], itemsPerPage = 10) {
  const items = ref(initialItems)
  const currentPage = ref(1)
  const searchQuery = ref('')
  const filters = ref({})
  const sortBy = ref('')
  const sortOrder = ref('asc')

  const filteredItems = computed(() => {
    let filtered = items.value

    // Recherche
    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(item => 
        Object.values(item).some(value => 
          String(value).toLowerCase().includes(query)
        )
      )
    }

    // Filtres
    Object.entries(filters.value).forEach(([key, value]) => {
      if (value && value !== '' && value !== 'all') {
        if (Array.isArray(value) && value.length > 0) {
          filtered = filtered.filter(item => 
            value.some(v => item[key]?.includes(v))
          )
        } else {
          filtered = filtered.filter(item => item[key] === value)
        }
      }
    })

    // Tri
    if (sortBy.value) {
      filtered.sort((a, b) => {
        const aVal = a[sortBy.value]
        const bVal = b[sortBy.value]
        
        if (typeof aVal === 'string') {
          return sortOrder.value === 'asc' 
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal)
        }
        
        return sortOrder.value === 'asc' 
          ? aVal - bVal 
          : bVal - aVal
      })
    }

    return filtered
  })

  const totalPages = computed(() => 
    Math.ceil(filteredItems.value.length / itemsPerPage)
  )

  const paginatedItems = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage
    const end = start + itemsPerPage
    return filteredItems.value.slice(start, end)
  })

  const startIndex = computed(() => 
    (currentPage.value - 1) * itemsPerPage + 1
  )

  const endIndex = computed(() => 
    Math.min(currentPage.value * itemsPerPage, filteredItems.value.length)
  )

  const setItems = (newItems) => {
    items.value = newItems
    currentPage.value = 1
  }

  const updateFilter = (key, value) => {
    filters.value[key] = value
    currentPage.value = 1
  }

  const updateSort = (field, order = 'asc') => {
    sortBy.value = field
    sortOrder.value = order
  }

  const resetFilters = () => {
    filters.value = {}
    searchQuery.value = ''
    currentPage.value = 1
  }

  return {
    // Données
    items,
    filteredItems,
    paginatedItems,
    
    // Pagination
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    
    // Filtres et recherche
    searchQuery,
    filters,
    sortBy,
    sortOrder,
    
    // Méthodes
    setItems,
    updateFilter,
    updateSort,
    resetFilters
  }
}
