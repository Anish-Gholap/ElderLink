const eventsRouter = require('express').Router()
const {getAllEvents, getEventById, addEvent} = require('../controllers/events')


// GET all events
eventsRouter.get('/', getAllEvents)

// GET event by id
eventsRouter.get('/:id', getEventById)

/*
Protected routes:
User authentication required
*/

// POST event to DB
eventsRouter.post('/', addEvent)






module.exports = eventsRouter