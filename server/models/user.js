const mongoose = require('mongoose')

/**
 * Mongoose schema for the User model.
 * Represents a user in the system, including details such as username, name, password hash, phone number, events, and notifications.
 */
const userSchema = new mongoose.Schema({
    /**
     * The username of the user.
     * @type {string}
     * @required
     * @minLength 3 - Must be at least 3 characters long.
     * @maxLength 12 - Cannot exceed 12 characters.
     * @unique
     * @validate {function} Ensures the username contains only letters and numbers.
     */
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
    /**
     * The full name of the user.
     * @type {string}
     * @required
     * @minLength 3 - Must be at least 3 characters long.
     * @validate {function} Ensures the name contains only alphabets and spaces.
     */
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
    /**
     * The hashed password of the user.
     * @type {string}
     */
    passwordHash: String,
    /**
     * The list of events created by the user.
     * @type {Array<mongoose.Schema.Types.ObjectId>}
     * @ref 'Event'
     */
    eventsCreated: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    /**
     * The phone number of the user.
     * @type {string}
     * @required
     * @unique
     * @validate {function} Ensures the phone number is exactly 8 digits (Singapore format).
     */
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
    /**
     * The list of events the user is attending.
     * @type {Array<mongoose.Schema.Types.ObjectId>}
     * @ref 'Event'
     */
    eventsAttending: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
    }],
    /**
     * The list of notifications associated with the user.
     * @type {Array<mongoose.Schema.Types.ObjectId>}
     * @ref 'Notification'
     */
    notifications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Notification'
    }]
})

/**
 * Transform the JSON representation of the user.
 * Converts `_id` to `id` and removes sensitive fields like `passwordHash` and `__v`.
 */
userSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})
/**
 * Mongoose model for the User schema.
 */
const User = mongoose.model('User', userSchema)

module.exports = User