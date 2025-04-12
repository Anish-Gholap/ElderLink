const Notification = require('../models/notifications')
const User = require('../models/user')  
const Event = require('../models/event')  

/**
 * Retrieve all notifications for a user.
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.userId - The ID of the user.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Responds with the user's notifications or an error message.
 */
const getNotifications = async (req, res) => {
  try {
    
    const userId = req.params.userId || req.userId;  

    
    const user = await User.findById(userId).populate('notifications');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.notifications.length === 0) {
      return res.status(200).json({ message: 'No notifications found' });
    }

    res.status(200).json(user.notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


/**
 * Create a notification for an amended event.
 * @param {string} userId - The ID of the user to notify.
 * @param {string} eventId - The ID of the amended event.
 * @param {string} message - The notification message.
 * @returns {Promise<void>} Creates and saves the notification in the database.
 */
const amendedMessage = async (userId, eventId, message) => {
  try {

    // Create a new notification
    const newNotification = new Notification({
      userId: userId,  
      eventId: eventId,
      message: message,
      notificationType: 'Edited',
    });

    // Save the notification to the database
    await newNotification.save();

    // Update the user's notifications array with the new notification ID
    await User.findByIdAndUpdate(
      userId,
      { $push: { notifications: newNotification._id } },  // Add notification to user's notifications array
      { new: true }  // Return the updated user document
    );

    // Optionally log success (you can remove this if not needed)
    console.log('Notification sent successfully');

  } catch (error) {
    console.error(error);
    throw new Error('Server error');
  }
};



/**
 * Create a notification for a deleted event.
 * @param {string} userId - The ID of the user to notify.
 * @param {string} eventId - The ID of the deleted event.
 * @param {string} message - The notification message.
 * @returns {Promise<void>} Creates and saves the notification in the database.
 */
const deletedMessage = async (userId, eventId, message) => {
  try {

    // Create the notification for the "Deleted" event
    const notification = new Notification({
      userId,
      eventId,
      message,
      notificationType: 'Deleted',
    });

    // Save the notification to the database
    await notification.save();

    // Update the user's notifications array with the new notification's ID
    await User.findByIdAndUpdate(
      userId,
      { $push: { notifications: notification._id } },  // Add the new notification to the user's notifications array
      { new: true }  // Return the updated user document
    );

    console.log('Notification created and added to user notifications');
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};



/**
 * Remove a specific notification for a user.
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Request parameters.
 * @param {string} req.params.userId - The ID of the user.
 * @param {string} req.params.notificationId - The ID of the notification to remove.
 * @param {Object} res - Express response object.
 * @returns {Promise<void>} Responds with a success message or an error message.
 */
const removeNotifications = async (req, res) => {
  try {
    const { userId, notificationId } = req.params;  // userId and notificationId from URL

    // Find the user by userId
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the notification exists in the user's notifications array
    const notificationIndex = user.notifications.indexOf(notificationId);
    if (notificationIndex === -1) {
      return res.status(404).json({ message: 'Notification not found in user\'s notifications' });
    }

    // Remove the notification from the user's notifications array
    user.notifications.splice(notificationIndex, 1);
    await user.save();

    // Delete the notification from the Notification collection
    await Notification.findByIdAndDelete(notificationId);

    // Respond with success
    res.status(200).json({ message: 'Notification deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


module.exports = { getNotifications, amendedMessage, deletedMessage, removeNotifications }
