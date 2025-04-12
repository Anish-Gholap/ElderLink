const loginRouter = require('express').Router()
const {loginUser} = require("../controllers/login")

/**
 * Route to log in a user.
 * @name POST /
 * @function
 * @memberof module:loginRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
loginRouter.post("/", loginUser)

module.exports = loginRouter