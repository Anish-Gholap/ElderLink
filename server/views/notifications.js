const notificationsRouter = require('express').Router()
const {getNotifications, amendedMessage, deletedMessage, removeNotifications} = require('../controllers/notifications')

/**
 * Route to retrieve all notifications for a user.
 * @name GET /:userId
 * @function
 * @memberof module:notificationsRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {string} req.params.userId - The ID of the user.
 * @param {Object} res - Express response object.
 */
notificationsRouter.get('/:userId', getNotifications)

/**
 * Route to create a notification for an amended event.
 * @name POST /amended/:userId
 * @function
 * @memberof module:notificationsRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {string} req.params.userId - The ID of the user.
 * @param {Object} res - Express response object.
 */
notificationsRouter.post('/amended/:userId', amendedMessage)

/**
 * Route to create a notification for a deleted event.
 * @name POST /deleted/:userId
 * @function
 * @memberof module:notificationsRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {string} req.params.userId - The ID of the user.
 * @param {Object} res - Express response object.
 */
notificationsRouter.post('/deleted/:userId', deletedMessage)

/**
 * Route to delete a specific notification for a user.
 * @name DELETE /:userId/:notificationId
 * @function
 * @memberof module:notificationsRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {string} req.params.userId - The ID of the user.
 * @param {string} req.params.notificationId - The ID of the notification to delete.
 * @param {Object} res - Express response object.
 */
notificationsRouter.delete('/:userId/:notificationId', removeNotifications)

module.exports = notificationsRouter