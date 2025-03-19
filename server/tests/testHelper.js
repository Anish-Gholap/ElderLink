const Event = require('../models/event')
const User = require('../models/user')


const initialEvents = [
    {
        title: "Chess",
        description: "Chess",
        dateTime: "18/03/25",
        location: "Nanyang CC",
        numAttendees: 2
    },

    {
        title: "Mahjong",
        description: "Mahjong",
        dateTime: "19/03/25",
        location: "Jurong West CC",
        numAttendees: 4
    }
]

const usersinDB = async () => {
    const users = await User.find({})
    return users.map(user => user.toJSON())
}

module.exports = {
    initialEvents,
    usersinDB
}