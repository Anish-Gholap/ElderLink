const eventsAttendanceRouter = require('express').Router()
const {joinEvent, withdrawEvent} = require('../controllers/eventsAttendance')
const { userExtractor } = require('../utils/middlewares')

// POST to join event
eventsAttendanceRouter.post('/:id/attendees', userExtractor, joinEvent)

// DELETE to withdraw from event
eventsAttendanceRouter.delete('/:id/attendees', withdrawEvent)

module.exports = eventsAttendanceRouter