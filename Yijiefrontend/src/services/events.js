import axios from 'axios'
const baseUrl = "/api/events"

const getAllEvents = async () => {
    const response = await axios.get(baseUrl)//search
    return response.data
}

const getUserEvents = async (userId) => {
  const response = await axios.get(`${baseUrl}?createdBy=${userId}`)
  return response.data
}

const createEvent = async (eventData, token) => {
  const response = await axios.post(baseUrl, eventData, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

const deleteEvent = async (eventId, token) => {
  console.log("From eventsService ", eventId)

  // backend checks token validity
  const response = await axios.delete(`${baseUrl}/${eventId}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

const getEventById = async (eventId) => {
  const response = await axios.get(`${baseUrl}/${eventId}`)
  return response.data
}

const editEvent = async (eventId, updatedEvent, token) => {
  const response = await axios.patch(`${baseUrl}/${eventId}`, updatedEvent, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  })

  return response.data
}

const joinEvent = async (eventId, userId, token) => {
  console.log("events service", userId)
  const response = await axios.post(`${baseUrl}/${eventId}/attendees`, {userId}, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"

    }
  })

  return response.data
}

export default {
  getAllEvents,
  getUserEvents,
  createEvent,
  deleteEvent,
  getEventById,
  editEvent, 
  joinEvent
}