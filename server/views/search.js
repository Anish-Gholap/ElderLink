const {getEvents}  = require('../controllers/search')
const searchRouter = require('express').Router()

/**
 * Route to search for events.
 * @name GET /
 * @function
 * @memberof module:searchRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
searchRouter.get('/', getEvents)


module.exports = searchRouter