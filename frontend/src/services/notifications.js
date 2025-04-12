import axios from 'axios'
const baseUrl = '/api/notifications'

/**
 * Fetch all notifications for a specific user.
 * @async
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array<Object>>} A list of notifications for the user.
 * @throws {Error} Throws an error if the request fails.
 */
const getNotifications = async (userId) => {
    const response = await axios.get(`${baseUrl}/${userId}`)
    return response.data
}

/**
 * Create a notification for an amended event.
 * @async
 * @param {string} userId - The ID of the user to notify.
 * @param {Object} data - The notification data.
 * @returns {Promise<Object>} The created notification.
 * @throws {Error} Throws an error if the request fails.
 */
const createAmendedNotification = async (userId, data) => {
    const response = await axios.post(`${baseUrl}/amended/${userId}`, data)
    return response.data
}

/**
 * Create a notification for a deleted event.
 * @async
 * @param {string} userId - The ID of the user to notify.
 * @param {Object} data - The notification data.
 * @returns {Promise<Object>} The created notification.
 * @throws {Error} Throws an error if the request fails.
 */
const createDeletedNotification = async (userId, data) => {
    const response = await axios.post(`${baseUrl}/deleted/${userId}`, data)
    return response.data
}

/**
 * Remove a specific notification for a user.
 * @async
 * @param {string} userId - The ID of the user.
 * @param {string} notificationId - The ID of the notification to remove.
 * @returns {Promise<Object>} A success message if the notification is removed.
 * @throws {Error} Throws an error if the request fails.
 */
const removeNotification = async (userId, notificationId) => {
    const response = await axios.delete(`${baseUrl}/${userId}/${notificationId}`)
    return response.data
}


export default {
    getNotifications,
    createAmendedNotification,
    createDeletedNotification,
    removeNotification
}