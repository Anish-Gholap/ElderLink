const mongoose = require('mongoose')
/**
 * Mongoose schema for the Notification model.
 * Represents a notification sent to a user, including details such as the user, event, message, type, and status.
 */
const notificationSchema = new mongoose.Schema({
  /**
   * The ID of the user receiving the notification.
   * @type {mongoose.Schema.Types.ObjectId}
   * @ref 'User'
   * @required
   */
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true,
  },
  /**
   * The ID of the event associated with the notification.
   * @type {mongoose.Schema.Types.ObjectId}
   * @ref 'Event'
   * @required
   */
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',  // Reference to the Event model
    required: true,
  },
  /**
   * The message content of the notification.
   * @type {string}
   * @required
   */
  message: {
    type: String,
    required: true,
  },
  /**
   * The type of the notification (e.g., Edited, Deleted).
   * @type {string}
   * @enum ['Edited', 'Deleted']
   * @required
   */
  notificationType: {
    type: String,
    enum: ['Edited', 'Deleted'],  // Types of notifications
    required: true,
  },
  /**
   * The timestamp when the notification was created.
   * @type {Date}
   * @default Date.now
   */
  createdAt: {
    type: Date,
    default: Date.now,
  },
  /**
   * Whether the notification has been read by the user.
   * @type {boolean}
   * @default false
   */
  read: {
    type: Boolean,
    default: false,  // Whether the notification has been read
  },
})

/**
 * Mongoose model for the Notification schema.
 */
const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification
