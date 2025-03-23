const eventsAttendanceRouter = require('express').Router()
const {joinEvent, withdrawEvent} = require('../controllers/eventsAttendance')

// POST to join event
eventsAttendanceRouter.post('/:id/attendees', joinEvent)

// DELETE to withdraw from event
eventsAttendanceRouter.delete('/:id/attendees', withdrawEvent)

module.exports = eventsAttendanceRouter