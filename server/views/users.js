const usersRouter = require('express').Router()
const {createUser, getAllUsers, editUser} = require('../controllers/users')

/**
 * Route to get all users in the database.
 * @name GET /
 * @function
 * @memberof module:usersRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
usersRouter.get('/', getAllUsers)

/**
 * Route to create a new user in the database.
 * @name POST /
 * @function
 * @memberof module:usersRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
// usersRouter.post('/', createUser)

/**
 * Route to edit a user's profile in the database.
 * @name PATCH /profile
 * @function
 * @memberof module:usersRouter
 * @inner
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 */
// PATCH user in DB
usersRouter.patch('/profile', editUser)

module.exports = usersRouter