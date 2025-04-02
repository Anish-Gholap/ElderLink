import axios from 'axios'
const baseUrl = '/api/search'

const getEventsByDistance = async (lat, long) => {
    console.log("Search service called")
    const response = await axios.get(`${baseUrl}`, {
        params: {
            lat: lat,
            long: long
        }
    })

    return response.data
}

export default {getEventsByDistance}