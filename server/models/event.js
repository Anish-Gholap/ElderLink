const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    dateTime: String,
    location: String,
    description: String,
    numAttendees: Number,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

eventSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Event = mongoose.model('Event', eventSchema)

module.exports = Event