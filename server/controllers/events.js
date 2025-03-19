const Event = require('../models/event')
const User = require('../models/user')

//handle get all events
const getAllEvents = async (request, response) => {
    const {createdBy} = request.query

    const filter = {}
    if (createdBy) {
        filter.createdBy = createdBy
    }

    const events = await Event.find(filter).populate('createdBy', {username: 1, name: 1})
    response.json(events)
}

// handle get event by id
const getEventById = async (request, response) => {
    const eventId = request.params.id
    const event = await Event.findById(eventId)

    if (event) {
        response.json(event)
    } else {
        // return 404 not found
        response.status(404).end()
    }
}

/*
Protected routes:
User authentication required. Token must be sent in request body for verification
Retrieve user from request body added by the userExtractor middleware.
*/

const addEvent = async (request, response) => {
    const body = request.body
    const user = request.user

    const event = new Event({
        ...body,
        createdBy: user._id
    })

    const savedEvent = await event.save()

    user.eventsCreated = user.eventsCreated.concat(savedEvent._id)
    // add here is user should be added to his own event attendees list
    // user.attendees = user.attendees.concat(user._id)
    await user.save()

    response.status(201).json(savedEvent)
}




module.exports = {
    getAllEvents,
    getEventById,
    addEvent
}
