const authRouter = require('express').Router()
const {createUser, findUserWithPhoneNumber, changePassword, loginUser} = require('../controllers/authController')
/**
 * Route to create a new user.
 * @name POST /
 * @function
 * @memberof module:authRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
authRouter.post('/', createUser)

/**
 * Route to log in a user.
 * @name POST /login
 * @function
 * @memberof module:authRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
authRouter.post('/login', loginUser)

/**
 * Route to find a user by their phone number.
 * @name POST /find-by-phone
 * @function
 * @memberof module:authRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
authRouter.post('/find-by-phone', findUserWithPhoneNumber)

/**
 * Route to change a user's password.
 * @name POST /change-password
 * @function
 * @memberof module:authRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
authRouter.post('/change-password', changePassword)

module.exports = authRouter