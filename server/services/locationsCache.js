const {fetchCCFromAPI} = require('../API/communityClubsAPI')

let locationsCache = null
let lastFetchTime = null
const CACHE_TTL = 60 * 60 * 1000 // 1 hour in ms

const initializeCache = async () => {
    await refreshCache()
}

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

const getLocations = async () => {
    if (!locationsCache || Date.now() - lastFetchTime > CACHE_TTL) {
        await refreshCache()
    }

    return locationsCache
}

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