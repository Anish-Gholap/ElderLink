const Notification = require('../models/notifications')
const User = require('../models/user')  // Assuming you need to check for user existence
const Event = require('../models/event')  // Assuming you need to check for event existence

// Retrieve all notifications for a user
const getNotifications = async (req, res) => {
  try {
    // Extract userId from URL or request body (based on your approach)
    const userId = req.params.userId || req.userId;  // Use req.params if userId is in the URL, else use req.userId from middleware

    // Find the user by ID and populate the notifications field with the Notification details
    const user = await User.findById(userId).populate('notifications');

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user has any notifications
    if (user.notifications.length === 0) {
      return res.status(404).json({ message: 'No notifications found' });
    }

    // Send the populated notifications back in the response
    res.status(200).json(user.notifications);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};





// Create a notification for an amended event
const AmendedMessage = async (req, res) => {
  const { userId } = req.params;  // userId from URL
  const { eventId, message, notificationType } = req.body;

  try {
    if (!userId) {
      return res.status(400).json({ error: 'UserId is required' });
    }

    // Create a new notification
    const newNotification = new Notification({
      userId: userId,  // userId from URL
      eventId: eventId,
      message: message,
      notificationType: notificationType,
    });

    // Save the notification to the database
    await newNotification.save();

    // Now, update the user's notifications array with the new notification ID
    await User.findByIdAndUpdate(
      userId,
      { $push: { notifications: newNotification._id } },  // Add notification to user's notifications array
      { new: true }  // Return the updated user document
    );

    // Respond with success
    res.status(201).json({ message: 'Notification sent successfully', newNotification });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};


// Create a notification for a deleted event
const DeletedMessage = async (req, res) => {
  try {
    const { eventId, message } = req.body;
    const userId = req.params.userId;  // Get userId from the URL params

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

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

    // Respond with the created notification
    res.status(201).json({ message: 'Notification created and added to user notifications', notification });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};


// Remove a specific notification for the user
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


module.exports = { getNotifications, AmendedMessage, DeletedMessage, removeNotifications }
