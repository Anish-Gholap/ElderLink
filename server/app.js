const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const logger = require('./utils/logger')
const eventsRouter = require('./views/events')
const loginRouter = require('./views/login')
const middlewares = require('./utils/middlewares')

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

// Middlewares
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())
app.use(middlewares.requestLogger)
app.use(middlewares.userExtractor)

app.use('/login', loginRouter)
app.use('/events', eventsRouter)

app.use(middlewares.unknownEndpoint)
app.use(middlewares.errorHandler)

module.exports = app