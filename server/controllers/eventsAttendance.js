const User = require('../models/user')
const Event = require('../models/event')
const {request, response} = require("express");

// handle user events attending
const getEventsAttending = async (request, response) => {
    const user = request.user
    const eventIds = user.eventsAttending
    const events = await Event.find({
        '_id': {$in: eventIds}
    })

    return response.status(201).json(events)
}

// handle User joining an event
const joinEvent = async (request, response) => {
    const eventId = request.params.id
    const user = request.user

    const event = await Event.findById(eventId)

    if (!event) {
        return response.status(404).json({error: "Event not found"})
    }

    if (event.createdBy.toString() === user.id) {
        return response.status(403).json({error: "Cannot join your own event"})
    }

    if (event.attendees.includes(user.id)) {
        return response.status(403).json({error: "You have already joined this event"})
    }

    if (event.attendees.length + 1 > event.numAttendees - 1) {
        return response.status(403).json("Event Full")
    }

    event.attendees = event.attendees.concat(user.id)
    await event.save()

    user.eventsAttending = user.eventsAttending.concat(eventId)
    await user.save()

    response.status(200).json({message: "Joined event successfully"})
}

// handle user withdrawing from event
const withdrawEvent = async (request, response) => {
    const eventId = request.params.id
    const user = request.user

    const event = await Event.findById(eventId)

    if (!event) {
        return response.status(404).json({error: "Event not found"})
    }

    if (!event.attendees.includes(user.id)) {
        return response.status(403).json({error: "Can't withdraw from event that you have not joined"})
    }

    event.attendees = event.attendees.filter(id => id.toString() !== user.id)
    await event.save()

    user.eventsAttending = user.eventsAttending.filter(id => id.toString() !== eventId)
    await user.save()

    response.status(200).json({message: "Withdrew from event successfully"})
}

module.exports = {
    getEventsAttending,
    joinEvent,
    withdrawEvent
}