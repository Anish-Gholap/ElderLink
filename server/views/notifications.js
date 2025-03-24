const notificationsRouter = require('express').Router()
const {getNotifications, AmendedMessage, DeletedMessage, removeNotifications} = require('../controllers/notifications')

// Retrieve all the notifications for the user
notificationsRouter.get('/:userId', getNotifications)

// Create a notification for an amended event
notificationsRouter.post('/amended/:userId', AmendedMessage)

// Create a notification for a deleted event
notificationsRouter.post('/deleted/:userId', DeletedMessage)

// Delete a specific notification for the user
notificationsRouter.delete('/:userId/:notificationId', removeNotifications)

module.exports = notificationsRouter