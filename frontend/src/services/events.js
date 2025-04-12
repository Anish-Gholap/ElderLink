import axios from 'axios'
const baseUrl = "/api/events"

/**
 * Fetch all events.
 * @async
 * @returns {Promise<Array<Object>>} A list of all events.
 */
const getAllEvents = async () => {
    const response = await axios.get(baseUrl) // Implement search instead from Server-HTTPRequests/getEventswQuery
    return response.data
}

/**
 * Fetch events created by a specific user.
 * @async
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Array<Object>>} A list of events created by the user.
 */
const getUserEvents = async (userId) => {
  const response = await axios.get(`${baseUrl}?createdBy=${userId}`)
  return response.data
}

/**
 * Fetch events the user is attending.
 * @async
 * @param {string} userId - The ID of the user.
 * @param {string} token - The authentication token.
 * @returns {Promise<Array<Object>>} A list of events the user is attending.
 */
const getUserAttendingEvents = async (userId, token) => {
  console.log("getUserAttendingEvents is running")
  const response = await axios.get(`${baseUrl}/${userId}/attending`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return response.data
}

/**
 * Create a new event.
 * @async
 * @param {Object} eventData - The data for the new event.
 * @param {string} token - The authentication token.
 * @returns {Promise<Object>} The created event data.
 * @throws {string} An error message if the creation fails.
 */
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

/**
 * Delete an event.
 * @async
 * @param {string} eventId - The ID of the event to delete.
 * @param {string} token - The authentication token.
 * @returns {Promise<Object>} A success message if the event is deleted.
 * @throws {string} An error message if the deletion fails.
 */
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

/**
 * Fetch details of a specific event by its ID.
 * @async
 * @param {string} eventId - The ID of the event.
 * @returns {Promise<Object>} The event details.
 */
const getEventById = async (eventId) => {
  const response = await axios.get(`${baseUrl}/${eventId}`)
  return response.data
}

/**
 * Edit an existing event.
 * @async
 * @param {string} eventId - The ID of the event to edit.
 * @param {Object} updatedEvent - The updated event data.
 * @param {string} token - The authentication token.
 * @returns {Promise<Object>} The updated event data.
 * @throws {string} An error message if the update fails.
 */
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

/**
 * Join an event.
 * @async
 * @param {string} eventId - The ID of the event to join.
 * @param {string} userId - The ID of the user joining the event.
 * @param {string} token - The authentication token.
 * @returns {Promise<Object>} A success message if the user joins the event.
 * @throws {string} An error message if the join fails.
 */
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

/**
 * Withdraw from an event (remove user from attendees).
 * @async
 * @param {string} eventId - The ID of the event to withdraw from.
 * @param {string} userId - The ID of the user withdrawing from the event.
 * @param {string} token - The authentication token.
 * @returns {Promise<Object>} A success message if the user withdraws from the event.
 * @throws {string} An error message if the withdrawal fails.
 */
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