const chatbotRouter = require('express').Router()
const chatbotController = require('../controllers/chatbotController')
/**
 * Route to handle chatbot interactions.
 * @name POST /chat
 * @function
 * @memberof module:chatbotRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
chatbotRouter.post('/chat', chatbotController.chat)

module.exports = chatbotRouter