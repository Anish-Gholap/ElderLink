const eventsRouter = require('express').Router()
const {handleGetAllEvents, handleGetEventById} = require('../controllers/events')


// GET all events
eventsRouter.get('/', handleGetAllEvents)

// GET event by id
eventsRouter.get('/:id', handleGetEventById)









module.exports = eventsRouter