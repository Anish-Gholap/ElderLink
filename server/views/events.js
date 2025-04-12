const eventsRouter = require('express').Router()
const {getAllEvents, getEventById, addEvent, removeEvent, editEvent} = require('../controllers/eventsManagement')
const {checkEventOwner} = require('../utils/middlewares')

/**
 * Route to get all events.
 * @name GET /
 * @function
 * @memberof module:eventsRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
eventsRouter.get('/', getAllEvents)

/**
 * Route to get an event by its ID.
 * @name GET /:id
 * @function
 * @memberof module:eventsRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
eventsRouter.get('/:id', getEventById)

/*
Protected routes:
User authentication required
*/

/**
 * Route to add a new event.
 * Protected route: User authentication required.
 * @name POST /
 * @function
 * @memberof module:eventsRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
eventsRouter.post('/', addEvent)

/**
 * Route to delete an event by its ID.
 * Protected route: User authentication and ownership required.
 * @name DELETE /:id
 * @function
 * @memberof module:eventsRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
eventsRouter.delete('/:id', checkEventOwner, removeEvent)

/**
 * Route to edit an event by its ID.
 * Protected route: User authentication and ownership required.
 * @name PATCH /:id
 * @function
 * @memberof module:eventsRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
eventsRouter.patch('/:id', checkEventOwner, editEvent)

module.exports = eventsRouter