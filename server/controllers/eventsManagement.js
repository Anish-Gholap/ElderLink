const Event = require('../models/event')
const User = require('../models/user')
const {AmendedMessage, DeletedMessage } = require('../controllers/notifications')
const notificationsEmitter = require('../services/notificationsEmitter')

/**
 * Get all events, optionally filtered by the creator.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @returns {Promise<void>} Responds with a list of events.
 */
const getAllEvents = async (request, response) => {
    const {createdBy} = request.query

    const filter = {}
    if (createdBy) {
        filter.createdBy = createdBy
    }

    const events = await Event.find(filter)
        .populate('createdBy', {username: 1})
        .populate('attendees', {username: 1})
    response.json(events)
}

/**
 * Get a specific event by its ID.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @returns {Promise<void>} Responds with the event or a 404 status if not found.
 */
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

/**
 * Add a new event.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @returns {Promise<void>} Responds with the created event.
 */
const addEvent = async (request, response) => {
    const body = request.body
    const user = request.user

    console.log(user)

    const eventDate = new Date(body.date)

    const event = new Event({
        ...body,
        date: eventDate,
        createdBy: user.id
    })

    const savedEvent = await event.save()

    user.eventsCreated = user.eventsCreated.concat(savedEvent._id)

    await user.save()

    response.status(201).json(savedEvent)
}
/**
 * Remove an event.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @returns {Promise<void>} Responds with a 204 status on successful deletion.
 */
const removeEvent = async (request, response) => {
    const eventToDelete = request.event
    const user = request.user
    const eventAttendeesId = eventToDelete.attendees

    await Event.findByIdAndDelete(eventToDelete._id)

    // Remove event from host eventsCreated
    user.eventsCreated = user.eventsCreated.filter(({ _id }) => eventToDelete._id.toString() !== _id.toString());
    await user.save();
    
    // Remove event from users attending list
    if (eventAttendeesId.length > 0) {
        await User.updateMany(
            { _id: { $in: eventAttendeesId } },
            { $pull: { eventsAttending: eventToDelete._id } }
        )
    }

    // Emit the event
    notificationsEmitter.emit('event:deleted', {
        eventId: eventToDelete._id,
        attendeeIds: eventAttendeesId,
        eventTitle: eventToDelete.title
    })

    response.status(204).end()
}
/**
 * Edit an existing event.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @returns {Promise<void>} Responds with a 200 status on successful update.
 */
const editEvent = async (request, response) => {
    const eventId = request.event.id
    const eventAttendeesId = request.event.attendees
    const body = request.body

    const updateData = {...body}

    if (updateData.date) {
        updateData.date = new Date(updateData.date)
      }

    const updatedEvent = await Event.findByIdAndUpdate(
        eventId,
        updateData,
        {new: true, runValidators: true}
    )

    // console.log("eventToAmend object:", request.event);
    // for (const attendeeId of eventAttendeesId) {
    //     await AmendedMessage(
    //         attendeeId,  // userId of each attendee
    //         eventId,  // eventId
    //         `The event ${request.event.title} has been updated by the event host. Please review the latest details.`,  // message
    //         'Amended'  // notificationType
    //     );
    // }

    // Emit the event
    notificationsEmitter.emit('event:edited', {
        eventId: eventId,
        attendeeIds: eventAttendeesId,
        eventTitle: updatedEvent.title
    })

    response.status(200).end()
}


module.exports = {
    getAllEvents,
    getEventById,
    addEvent,
    removeEvent,
    editEvent
}
