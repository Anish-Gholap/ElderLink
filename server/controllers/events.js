const Event = require('../models/event')
const User = require('../models/user')

//handle get all events
const handleGetAllEvents = async (request, response) => {
    const {createdBy} = request.query

    const filter = {}
    if (createdBy) {
        filter.createdBy = createdBy
    }

    const events = await Event.find(filter).populate('createdBy', {username: 1, name: 1})
    response.json(events)
}

// handle get event by id
const handleGetEventById = async (request, response) => {
    const eventId = request.params.id
    const event = await Event.findById(eventId)

    if (event) {
        response.json(event)
    } else {
        // return 404 not found
        response.status(404).end()
    }
}





module.exports = {
    handleGetAllEvents,
    handleGetEventById
}
