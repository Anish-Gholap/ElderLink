const locationsRouter = require('express').Router()
const {getAllLocations, getAllLocationNames, refreshLocationsCache} = require('../controllers/locations')

/**
 * Route to get all locations.
 * @name GET /
 * @function
 * @memberof module:locationsRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
locationsRouter.get('/', getAllLocations)

/**
 * Route to get all location names.
 * @name GET /names
 * @function
 * @memberof module:locationsRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
locationsRouter.get('/names', getAllLocationNames)

/**
 * Route to refresh the locations cache.
 * @name POST /refresh-cache
 * @function
 * @memberof module:locationsRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
locationsRouter.post('/refresh-cache', refreshLocationsCache)

module.exports = locationsRouter