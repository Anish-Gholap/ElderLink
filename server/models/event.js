const mongoose = require('mongoose')

/**
 * Mongoose schema for the Event model.
 * Represents an event created by a user, including details such as title, date, location, description, and attendees.
 */
const eventSchema = new mongoose.Schema({
    /**
     * The title of the event.
     * @type {string}
     * @required
     * @validate {function} Ensures the title contains only letters, numbers, and spaces.
     */
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
    /**
     * The date and time of the event.
     * @type {Date}
     * @required
     * @validate {function} Ensures the date is valid and falls within CC operating hours (10am-10pm).
     */
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
    /**
     * The location of the event.
     * @type {string}
     */
    location: String,
    /**
     * A description of the event.
     * @type {string}
     * @minimumLength 50 - Ensures the description is at least 50 characters long.
     */
    description: {
        type: String,
        minLength: [50, "Description must be at least 50 characters long"]
    },
    /**
     * The number of attendees for the event.
     * @type {number}
     * @validate {function} Ensures the number of attendees is positive and does not exceed 10.
     */
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
    /**
     * The user who created the event.
     * @type {mongoose.Schema.Types.ObjectId}
     * @ref 'User'
     */
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    /**
     * The list of users attending the event.
     * @type {Array<mongoose.Schema.Types.ObjectId>}
     * @ref 'User'
     */
    attendees: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})
/**
 * Transform the JSON representation of the event.
 * Converts `_id` to `id` and removes `__v` from the returned object.
 */
eventSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})
/**
 * Mongoose model for the Event schema.
 */
const Event = mongoose.model('Event', eventSchema)

module.exports = Event