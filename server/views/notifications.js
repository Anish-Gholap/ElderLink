const notificationsRouter = require('express').Router()
const {getNotifications, amendedMessage, deletedMessage, removeNotifications} = require('../controllers/notifications')

// Retrieve all the notifications for the user
notificationsRouter.get('/:userId', getNotifications)

// Create a notification for an amended event
notificationsRouter.post('/amended/:userId', amendedMessage)

// Create a notification for a deleted event
notificationsRouter.post('/deleted/:userId', deletedMessage)

// Delete a specific notification for the user
notificationsRouter.delete('/:userId/:notificationId', removeNotifications)

module.exports = notificationsRouter