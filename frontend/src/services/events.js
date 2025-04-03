import axios from 'axios'
const baseUrl = "/api/events"

const getAllEvents = async () => {
    const response = await axios.get(baseUrl) // Implement search instead from Server-HTTPRequests/getEventswQuery
    return response.data
}

const getUserEvents = async (userId) => {
  const response = await axios.get(`${baseUrl}?createdBy=${userId}`)
  return response.data
}

const getUserAttendingEvents = async (userId, token) => {
  console.log("getUserAttendingEvents is running")
  const response = await axios.get(`${baseUrl}/${userId}/attending`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

const createEvent = async (eventData, token) => {
  try {
    const response = await axios.post(baseUrl, eventData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return response.data

  } catch (error) {
    throw error.response.data.error
  }
}

const deleteEvent = async (eventId, token) => {
  console.log("From eventsService ", eventId)

  // backend checks token validity
  try {
    const response = await axios.delete(`${baseUrl}/${eventId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return response.data

  } catch (error) {
    throw error.response.data.error
  }
}

const getEventById = async (eventId) => {
  const response = await axios.get(`${baseUrl}/${eventId}`)
  return response.data
}

const editEvent = async (eventId, updatedEvent, token) => {
  try {
    const response = await axios.patch(`${baseUrl}/${eventId}`, updatedEvent, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    })

    return response.data

  } catch (error) {
    throw error.response.data.error
  }
}

const joinEvent = async (eventId, userId, token) => {
  try {
    console.log("events service", userId)
    const response = await axios.post(`${baseUrl}/${eventId}/attendees`, {userId}, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"

      }
    })

    return response.data
  } catch (error) {
    throw error.response.data.error
  }
}

// Withdraw from an event (remove user from attendees)
const withdrawEvent = async (eventId, userId, token) => {
  try {
    console.log("Withdrawing user", userId, "from event", eventId);
    const response = await axios.delete(`${baseUrl}/${eventId}/attendees`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      data: { userId }  // Send the userId in the body for the withdrawal
    });
    return response.data;

  } catch (error) {
    throw error.response.data.error
  }
};

export default {
  getAllEvents,
  getUserEvents,
  createEvent,
  deleteEvent,
  getEventById,
  editEvent,
  joinEvent,
  withdrawEvent,
  getUserAttendingEvents
}