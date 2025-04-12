const EventEmitter = require('events')
/**
 * Custom event emitter for handling notifications.
 * Extends the Node.js EventEmitter class to emit and listen for notification-related events.
 */
class notificationsEventEmitter extends EventEmitter {}
/**
 * Instance of the NotificationsEventEmitter class.
 * Used to emit and listen for notification events across the application.
 */
const notificationsEmitter =  new notificationsEventEmitter()

module.exports = notificationsEmitter