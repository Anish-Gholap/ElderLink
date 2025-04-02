const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minLength: [3, "Username must be at least 3 characters long"],
        maxLength: [12, "Username cannot exceed 12 characters"],
        unique: true,
        validate: {
            validator: function(value) {
                return /^[a-zA-Z0-9]+$/.test(value); // No special characters
            },
            message: 'Username can only contain letters and numbers, no special characters'
        }
    },
    name: {
        type: String,
        required: true,
        minLength: [3, "Name must be at least 3 characters long"],
        validate: {
            validator: function(value) {
                return /^[a-zA-Z\s]+$/.test(value); // Alphabets only
            },
            message: 'Name can only contain alphabets'
        }
    },
    passwordHash: String,
    eventsCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    phoneNumber: {
        type: String,
        required: true,
        unique: true,
        validate: [
            {
                validator: function(value) {
                    return /^\d{8}$/.test(value); // 8 Digits only (SG number)
                },
                message: 'Phone number must be exactly 8 digits'
            }
        ]
    },
    eventsAttending: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
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