import axios from 'axios'
const baseUrl = '/api/notifications'

const getNotifications = async (userId) => {
    const response = await axios.get(`${baseUrl}/${userId}`)
    return response.data
}

const createAmendedNotification = async (userId, data) => {
    const response = await axios.post(`${baseUrl}/amended/${userId}`, data)
    return response.data
}

const createDeletedNotification = async (userId, data) => {
    const response = await axios.post(`${baseUrl}/deleted/${userId}`, data)
    return response.data
}

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