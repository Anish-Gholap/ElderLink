const eventsAttendanceRouter = require('express').Router()
const {joinEvent, withdrawEvent, getEventsAttending} = require('../controllers/eventsAttendance')
const { userExtractor } = require('../utils/middlewares')

/**
 * Route to join an event.
 * Protected route: User authentication required.
 * @name POST /:id/attendees
 * @function
 * @memberof module:eventsAttendanceRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
eventsAttendanceRouter.post('/:id/attendees', joinEvent)

/**
 * Route to withdraw from an event.
 * Protected route: User authentication required.
 * @name DELETE /:id/attendees
 * @function
 * @memberof module:eventsAttendanceRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
eventsAttendanceRouter.delete('/:id/attendees', withdrawEvent)

/**
 * Route to get all events a user is attending.
 * Protected route: User authentication required.
 * @name GET /:id/attending
 * @function
 * @memberof module:eventsAttendanceRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
eventsAttendanceRouter.get('/:id/attending', getEventsAttending)

module.exports = eventsAttendanceRouter