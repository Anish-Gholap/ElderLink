const notificationsEmitter = require('./notificationsEmitter')
const {deletedMessage, amendedMessage} = require('../controllers/notifications')

// event name mappings
const EVENT_DELETED = 'event:deleted'
const EVENT_EDITED = 'event:edited'

// Listener Functions
const handleEventDeleted = async ({eventId, attendeeIds, eventTitle}) => {
    console.log(`LISTENER: Received ${EVENT_DELETED} for event: ${eventTitle} (ID: ${eventId})`)

    if(!attendeeIds || attendeeIds.length === 0) {
        console.log('LISTENER: No attendees to notify')
        return
    }

    try {
        const message = `The event "${eventTitle}" has been cancelled by the event host`

        const notificationPromises = attendeeIds.map(attendeeId => {
            deletedMessage(
                attendeeId,
                eventId,
                message,
            ).catch(err => {
                console.error(`LISTENER: Error sending notifications to attendee ${attendeeId} for event ${eventId}: `, err)
            })
        })

        await Promise.all(notificationPromises)
        console.log(`LISTENER: Attempted to send deletion notifications to ${attendeeIds.length} attendees for event ${eventId}`)

    } catch (error) {
        console.error(`LISTENER: Error when handling notifications for event delete`, error)
    }
}

const handleEventEdited = async ({eventId, attendeeIds, eventTitle}) => {
    console.log(`LISTENER: Received ${EVENT_EDITED} for event: ${eventTitle} (ID: ${eventId})`)

    if(!attendeeIds || attendeeIds.length === 0) {
        console.log('LISTENER: No attendees to notify')
        return
    }

    try {
        const message = `The event "${eventTitle}" has been edited by the event host. Check event page for latest changes`

        const notificationPromises = attendeeIds.map(attendeeId => {
            amendedMessage(
                attendeeId,
                eventId,
                message,
            ).catch(err => {
                console.error(`LISTENER: Error sending notifications to attendee ${attendeeId} for event ${eventId}: `, err)
            })
        })

        await Promise.all(notificationPromises)
        console.log(`LISTENER: Attempted to send edited notifications to ${attendeeIds.length} attendees for event ${eventId}`)

    } catch (error) {
        console.error(`LISTENER: Error when handling notifications for event edit`, error)
    }
}

const setupNotificationsListeners = () => {
    if (!setupNotificationsListeners.initialized) {
        notificationsEmitter.on(EVENT_DELETED, handleEventDeleted)
        console.log("Listener registered for event delete")

        notificationsEmitter.on(EVENT_EDITED, handleEventEdited)
        console.log("Listener registered for event edit")

        setupNotificationsListeners.initialized = true
    }
}

module.exports = {setupNotificationsListeners}