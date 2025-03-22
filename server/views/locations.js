const locationsRouter = require('express').Router()
const {getAllLocations, refreshLocationsCache} = require('../controllers/locations')

// GET all locations
locationsRouter.get('/', getAllLocations)

// POST to refresh locations cache
locationsRouter.post('/refresh-cache', refreshLocationsCache)

module.exports = locationsRouter