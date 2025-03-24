const mongoose = require('mongoose')

const notificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',  // Reference to the User model
    required: true,
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Event',  // Reference to the Event model
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  notificationType: {
    type: String,
    enum: ['Amended', 'Deleted'],  // Types of notifications
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  read: {
    type: Boolean,
    default: false,  // Whether the notification has been read
  },
})

const Notification = mongoose.model('Notification', notificationSchema)

module.exports = Notification
