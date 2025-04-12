const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const eventsRouter = require('./views/events')
const loginRouter = require('./views/login')
const usersRouter = require('./views/users')
const notificationsRouter = require ('./views/notifications')
const eventsAttendanceRouter = require('./views/eventsAttendance')
const locationsRouter = require('./views/locations')
const searchRouter = require('./views/search')
const authRouter = require('./views/auth')
const middlewares = require('./utils/middlewares')
const {initializeCache} = require('./services/locationsCache')
const notificationsEmitter = require('./services/notificationsEmitter')
const {setupNotificationsListeners} = require('./services/notificationsListener')
const chatbotBackendService = require('./services/chatbotBackend')
const chatbotRouter = require('./views/chatbot')

// Check if we're running in test mode
const isTestEnvironment = process.env.NODE_ENV === 'test';

// MongoDB Connection
mongoose.set('strictQuery', false)
logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
      logger.info('connected to MongoDB')
  })
  .catch((error) => {
      logger.error('error connecting to MongoDB', error.message)
  })

const startCache = async () => {
    try {
        await initializeCache()

    } catch (error) {
        console.error('Failed to initialize location cache: ', error)
    }
}

// Locations Cache
startCache()

// Chatbot backend
if (!isTestEnvironment) {
    logger.info('Initializing chatbot backend')
    chatbotBackendService.initialize()
} else {
    logger.info('Running in test environment - skipping chatbot backend initialization')
}

// Middlewares
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middlewares.requestLogger)
app.use(middlewares.userExtractor)

// Event Listeners
setupNotificationsListeners()

app.use('/api/login', loginRouter)
app.use('/api/events', eventsRouter)
app.use('/api/users', usersRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/events/', eventsAttendanceRouter)
app.use('/api/locations', locationsRouter)
app.use('/api/search', searchRouter)
app.use('/api/auth', authRouter)
app.use('/api/chatbot', chatbotRouter)

app.use(middlewares.unknownEndpoint)
app.use(middlewares.errorHandler)


if (!isTestEnvironment) {
    process.on('SIGINT', () => {
        chatbotBackendService.stopAIBackend()
        process.exit(0)
    })

    process.on('SIGTERM', () => {
        chatbotBackendService.stopAIBackend()
        process.exit(0)
    })
}

module.exports = app