const {getEvents}  = require('../controllers/search')
const searchRouter = require('express').Router()

searchRouter.get('/', getEvents)


module.exports = searchRouter