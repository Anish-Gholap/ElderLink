import axios from 'axios'
const baseUrl = '/api/search'

const getEventsByDistance = async (lat, long) => {
    const response = await axios.get(`${baseUrl}`, {
        params: {
            lat: lat,
            long: long
        }
    })

    return response.data
}

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