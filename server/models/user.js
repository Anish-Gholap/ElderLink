const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: [3, "Username must be at least 3 characters long"],
        unique: true
    },
    name: String,
    passwordHash: String,
    eventsCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    phoneNumber: {
        type: String,
        required: true,
        minLength: [8, "Enter SG phone number without +65 prefix"]
    },
    eventsAttending: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }]
})

userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User