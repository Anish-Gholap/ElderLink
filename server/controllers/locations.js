const {getLocations, getLocationNames, refreshCache} = require('../services/locationsCache')

/**
 * Get all locations from the cache.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @returns {Promise<void>} Responds with a list of all locations.
 */
const getAllLocations = async (request, response) => {
    try {
        const locations = await getLocations()
        response.json(locations)

    } catch (error) {
        console.error('Error fetching locations: ', error)
        response.status(500).json({error: 'Failed to fetch locations'})
    }
}
/**
 * Get all location names from the cache.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @returns {Promise<void>} Responds with a list of all location names.
 */
const getAllLocationNames = async (request, response) => {
    try {
        const locations = await getLocationNames()
        response.json(locations)

    } catch (error) {
        console.error('Error fetching locations: ', error)
        response.status(500).json({error: 'Failed to fetch locations'})
    }
}
/**
 * Refresh the locations cache.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @returns {Promise<void>} Responds with a success message if the cache is refreshed successfully.
 */
const refreshLocationsCache = async (request, response) => {
    try {
        await refreshCache()
        response.json({success: true, message: "Locations Cache refreshed"})

    } catch (error) {
        response.status(500).json({error: 'Failed to refresh location cache'})
    }
}

module.exports = {
    getAllLocations,
    getAllLocationNames,
    refreshLocationsCache
}