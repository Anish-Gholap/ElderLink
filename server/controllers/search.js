const Event = require('../models/event')
const {getLocations} = require('../services/locationsCache')

//TODO: Use google Maps API to handle get events by distance
/**
 * Convert degrees to radians.
 * @param {number} degrees - The value in degrees.
 * @returns {number} The value in radians.
 */
const toRadians = (degrees) => {
    return degrees * (Math.PI / 180)
}

/**
 * Calculate the distance between two geographical points using the Haversine formula.
 * @param {number} lat1 - Latitude of the first point.
 * @param {number} long1 - Longitude of the first point.
 * @param {number} lat2 - Latitude of the second point.
 * @param {number} long2 - Longitude of the second point.
 * @returns {number} The distance in kilometers.
 */
const calculateDistance = (lat1, long1, lat2, long2) => {
    const R = 6371

    const dLat = toRadians(lat2 - lat1)
    const dLong = toRadians(long2 - long1)

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
        Math.sin(dLong / 2) * Math.sin(dLong / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}
/**
 * Get the coordinates of a community club by its name.
 * @param {string} communityClub - The name of the community club.
 * @returns {Promise<number[]>} An array containing the latitude and longitude of the community club.
 */
const getCCCords = async (communityClub) => {
    const ccDetails = await getLocations()
    const cc = ccDetails.find(cc => cc.name === communityClub)
    console.log(cc)
    const lat = cc.coordinates.latitude
    const long = cc.coordinates.longitude
    return [lat, long]
}
/**
 * Get events with optional filters such as location, search term, date, and distance.
 * @param {Object} request - Express request object.
 * @param {Object} request.query - Query parameters for filtering events.
 * @param {number} [request.query.lat] - Latitude for distance filtering.
 * @param {number} [request.query.long] - Longitude for distance filtering.
 * @param {string} [request.query.searchTerm] - Search term for event titles.
 * @param {string} [request.query.date] - Date to filter events.
 * @param {string} [request.query.communityClub] - Community club name for filtering.
 * @param {number} [request.query.limit=10] - Number of events per page.
 * @param {number} [request.query.page=1] - Page number for pagination.
 * @param {Object} response - Express response object.
 * @returns {Promise<void>} Responds with a list of events, optionally sorted by distance.
 */
const getEvents = async (request, response) => {
    try {
        const {
            lat,
            long,
            searchTerm,
            date,
            communityClub,
            limit = 10,
            page = 1
        } = request.query

        const filter = {}

        // by incremental search query
        if (searchTerm) {
            filter.title= {$regex: searchTerm, $options: 'i'}
        }

        // by date
        if(date) {
            const startDate = new Date(date)
            startDate.setHours(0, 0, 0, 0)

            const endDate = new Date(date)
            endDate.setHours(23, 59, 59, 999)

            console.log(startDate, endDate)

            filter.date = {
                $gte: startDate,
                $lte: endDate
            }
        }

        if (communityClub) {
            filter.location = {$regex: communityClub, $options: 'i'}
        }

        const events = await Event.find(filter)
            .skip((page-1) * limit)
            .limit(limit)

        const ccDetails = await getLocations()

        if (lat && long) {
            const distancePromises = events.map(async (event) => {
                const [ccLat, ccLong] = await getCCCords(event.location)
              // const { _id, ...restProps } = event._doc;
                // return {
                //     ...restProps,
                //     id: _id,  // Rename _id to id
                //     distance
                // }
                event.distance = calculateDistance(lat, long, ccLat, ccLong)
                return event
            })

            const eventsWDistance = await Promise.all(distancePromises)

            const eventsByDistance = await eventsWDistance.sort((a, b) => a.distance - b.distance)
            //console.log(eventsByDistance)

            return response.status(200).json(eventsByDistance)
        }

        return response.status(200).json(events)


    } catch (error) {
        response.status(500).json({error: error.message})
    }
}

module.exports = {
    getEvents
}