const eventsAttendanceRouter = require('express').Router()
const {joinEvent, withdrawEvent, getEventsAttending} = require('../controllers/eventsAttendance')
const { userExtractor } = require('../utils/middlewares')

// POST to join event
eventsAttendanceRouter.post('/:id/attendees', joinEvent)

// DELETE to withdraw from event
eventsAttendanceRouter.delete('/:id/attendees', withdrawEvent)

//GET events attending
eventsAttendanceRouter.get('/:id/attending', getEventsAttending)

module.exports = eventsAttendanceRouter