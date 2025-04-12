const {fetchCCFromAPI} = require('../API/communityClubsAPI')

let locationsCache = null
let lastFetchTime = null
const CACHE_TTL = 60 * 60 * 1000 // 1 hour in ms

/**
 * Initialize the locations cache by refreshing it.
 * @async
 * @returns {Promise<void>} Resolves when the cache is initialized successfully.
 */
const initializeCache = async () => {
    await refreshCache()
}

/**
 * Refresh the locations cache by fetching data from the API.
 * Updates the cache and the last fetch time.
 * @async
 * @returns {Promise<void>} Resolves when the cache is refreshed successfully.
 * @throws {Error} Throws an error if the API fetch fails and the cache is empty.
 */
const refreshCache = async () => {
    try {
        locationsCache = await fetchCCFromAPI()
        lastFetchTime = Date.now()
        console.log('Locations cache refreshed successfully')

    } catch (error) {
        console.error('Failed to refresh locations cache: ', error)
        if (!locationsCache) throw error
    }
}

/**
 * Get all locations from the cache.
 * If the cache is expired or uninitialized, it refreshes the cache before returning the data.
 * @async
 * @returns {Promise<Object[]>} A list of all locations.
 */
const getLocations = async () => {
    if (!locationsCache || Date.now() - lastFetchTime > CACHE_TTL) {
        await refreshCache()
    }

    return locationsCache
}

/**
 * Get the names of all locations from the cache.
 * If the cache is expired or uninitialized, it refreshes the cache before returning the data.
 * @async
 * @returns {Promise<string[]>} A list of all location names.
 */
const getLocationNames = async () => {
    if (!locationsCache || Date.now() - lastFetchTime > CACHE_TTL) {
        await refreshCache()
    }

    return locationsCache.map(location => location.name)
}

module.exports = {
    initializeCache,
    refreshCache,
    getLocations,
    getLocationNames
}