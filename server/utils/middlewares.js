const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')
const Event = require('../models/event')


/**
 * Middleware to log incoming HTTP requests.
 * Logs the HTTP method, path, and body of the request.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const requestLogger = (request, response, next) => {
    logger.info('Method: ', request.method)
    logger.info('Path: ', request.path)
    logger.info('Body: ', request.body)
    logger.info('---------------')

    // pass control to next middleware or router in middleware chain
    next()
}

/**
 * Middleware to handle requests to unknown endpoints.
 * Responds with a 404 status and an error message.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 */
const unknownEndpoint = (request, response) => {
    response.status(404).send({error: 'unknown endpoint'})
}

/**
 * Middleware to handle errors in the application.
 * Handles specific errors such as validation errors, token errors, and database errors.
 * @param {Error} error - The error object.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const errorHandler = (error, request, response, next) => {
    //logger.error(error)

    //handle specific errors
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'MongoServerError' && error.message.includes('E11000 duplicate key error')) {
        return response.status(400).json({ error: 'Username not available' })
    } else if (error.name ===  'JsonWebTokenError') {
        return response.status(401).json({ error: 'token invalid' })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({
            error: 'token expired'
        })
    }

    next(error)
}

/**
 * Middleware to extract the user from the JWT token.
 * Verifies the token and attaches the user object to the request.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const userExtractor = async (request, response, next) => {
    try {
        const authorization = request.get('authorization')

        //if no token sent with request
        if (!authorization || !authorization.startsWith('Bearer ')){
            request.token = null
            request.user = null
            return next()
        }

        request.token = authorization.replace('Bearer ', '')

        try {
            const decodedToken = jwt.verify(request.token, process.env.SECRET)

            if(!decodedToken || !decodedToken.id){
                return response.status(401).json({error: "token invalid or missing user id"})
            }

            const user = await User.findById(decodedToken.id)

            if(!user) {
                return response.status(401).json({error: "user not found"})
            }

            request.user = user

        } catch (tokenError) {
            return response.status(401).json({error: 'token invalid or expired', details: tokenError.message})
        }

        next()

    } catch (error) {
        next(error)
    }
}

/**
 * Middleware to check if the authenticated user is the owner of the event.
 * Verifies the event ID and checks if the user is the creator of the event.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const checkEventOwner = async (request, response, next) => {
    try {
        const eventId = request.params.id

        if (!eventId) {
            return response.status(400).json({error: "Event ID is required"})
        }

        if (!request.user) {
            return response.status(401).json({error: "Authentication required"})
        }

        const event = await Event.findById(eventId)

        if(!event) {
            return response.status(404).json({error: "Event not found"})
        }

        if (!event.createdBy.equals(request.user._id)) {
            return response.status(403).json({error: "Request Denied! You do not have the required permissions"})
        }

        request.event = event
        next()
    } catch (error) {
        next(error)
    }
}


module.exports = {
    requestLogger,
    errorHandler,
    unknownEndpoint,
    userExtractor,
    checkEventOwner
}