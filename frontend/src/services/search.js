import axios from 'axios'
const baseUrl = '/api/search'

/**
 * Fetch events based on the user's geographical location.
 * @async
 * @param {number} lat - The latitude of the user's location.
 * @param {number} long - The longitude of the user's location.
 * @returns {Promise<Array<Object>>} A list of events sorted by distance.
 * @throws {Error} Throws an error if the request fails.
 */
const getEventsByDistance = async (lat, long) => {
    const response = await axios.get(`${baseUrl}`, {
        params: {
            lat: lat,
            long: long
        }
    })

    return response.data
}

/**
 * Search for events based on query parameters.
 * @async
 * @param {Object} params - The search parameters.
 * @param {string} [params.name] - The name of the event to search for.
 * @param {string} [params.location] - The location of the event to search for.
 * @param {string} [params.date] - The date of the event to search for.
 * @returns {Promise<Array<Object>>} A list of events matching the search criteria.
 * @throws {Error} Throws an error if the request fails.
 */
const searchEvents = async (params) => {
    const response = await axios.get(`${baseUrl}`, {
        params: params
    })

    return response.data
}

export default {
    getEventsByDistance,
    searchEvents
}