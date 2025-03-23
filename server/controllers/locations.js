const {getLocations, getLocationNames, refreshCache} = require('../services/locations')

const getAllLocations = async (request, response) => {
    try {
        const locations = await getLocations()
        response.json(locations)

    } catch (error) {
        console.error('Error fetching locations: ', error)
        response.status(500).json({error: 'Failed to fetch locations'})
    }
}

const getAllLocationNames = async (request, response) => {
    try {
        const locations = await getLocationNames()
        response.json(locations)

    } catch (error) {
        console.error('Error fetching locations: ', error)
        response.status(500).json({error: 'Failed to fetch locations'})
    }
}

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