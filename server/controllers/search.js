const Event = require('../models/event')
const {getLocations} = require('../services/locationsCache')

//TODO: Use google Maps API to handle get events by distance

const toRadians = (degrees) => {
    return degrees * (Math.PI / 180)
}

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

const getCCCords = async (communityClub) => {
    const ccDetails = await getLocations()
    const cc = ccDetails.find(cc => cc.name === communityClub)
    console.log(cc)
    const lat = cc.coordinates.latitude
    const long = cc.coordinates.longitude
    return [lat, long]
}

// GET Events with filter
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