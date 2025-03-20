const eventsRouter = require('express').Router()
const {getAllEvents, getEventById, addEvent, removeEvent, editEvent} = require('../controllers/eventsManagement')
const {checkEventOwner} = require('../utils/middlewares')

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

// DELETE event in DB
eventsRouter.delete('/:id', checkEventOwner, removeEvent)

// PATCH event in DB
eventsRouter.patch('/:id', checkEventOwner, editEvent)




module.exports = eventsRouter