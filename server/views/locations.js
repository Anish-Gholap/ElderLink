const locationsRouter = require('express').Router()
const {getAllLocations, getAllLocationNames, refreshLocationsCache} = require('../controllers/locations')

// GET all locations
locationsRouter.get('/', getAllLocations)

// GET all locations names
locationsRouter.get('/names', getAllLocationNames)

// POST to refresh locations cache
locationsRouter.post('/refresh-cache', refreshLocationsCache)

module.exports = locationsRouter