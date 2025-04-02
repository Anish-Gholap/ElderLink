const mongoose = require('mongoose')

const eventSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        validate: {
            validator: function(value) {
                return /^[a-zA-Z0-9\s]+$/.test(value);
            },
            message: 'Title can only contain letters, numbers, and spaces'
        }
    },
    date: {
        type: Date,
        required: true,
        validate: {
            validator: function(value) {
                if (isNaN(value.getTime())) {
                    return false;
                }

                // Check if date is during CC operating hours
                const hours = value.getHours();
                return hours >= 10 && hours < 22;
            },
            message: 'Date must be valid and during CC operating hours (10am-10pm)'
        }
    },
    location: String,
    description: {
        type: String,
        minLength: [50, "Description must be at least 50 characters long"]
    },
    numAttendees: {
        type: Number,
        validate: [
            {
                validator: function(value) {
                    return value > 0;
                },
                message: 'Number of attendees must be positive and not zero'
            },
            {
                validator: function(value) {
                    return value <= 10;
                },
                message: 'Number of attendees cannot exceed 10'
            }
        ]
    },
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