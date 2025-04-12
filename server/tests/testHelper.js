const Event = require('../models/event')
const User = require('../models/user')

const initialEvents = [
    {
        title: "Chess",
        description: "Chess",
        date: "2025-03-18T11:00:00Z",
        location: "Nanyang CC",
        numAttendees: 2
    },

    {
        title: "Mahjong",
        description: "Mahjong",
        date: "2025-03-19T16:00:00Z",
        location: "Jurong West CC",
        numAttendees: 4
    }
]

const usersInDB = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

const eventsInDB = async () => {
    const events = await Event.find({})
    return events.map(event => event.toJSON())
}

module.exports = {
    initialEvents,
    usersInDB: usersInDB,
    eventsInDB
}