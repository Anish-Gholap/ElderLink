const chatbotRouter = require('express').Router()
const chatbotController = require('../controllers/chatbotController')

chatbotRouter.post('/chat', chatbotController.chat)


module.exports = chatbotRouter