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
const middlewares = require('./utils/middlewares')
const {userExtractor} = require("./utils/middlewares");
const {initializeCache} = require('./services/locations')


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

startCache()

// Middlewares
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middlewares.requestLogger)
app.use(middlewares.userExtractor)

app.use('/api/login', loginRouter)
app.use('/api/events', eventsRouter)
app.use('/api/users', usersRouter)
app.use('/api/notifications', notificationsRouter)
app.use('/api/events/', eventsAttendanceRouter)
app.use('/api/locations', locationsRouter)
app.use('/api/search', searchRouter)

app.use(middlewares.unknownEndpoint)
app.use(middlewares.errorHandler)

module.exports = app