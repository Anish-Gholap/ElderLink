const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

/**
 * Log in a user by verifying their credentials and generating a JWT token.
 * @param {Object} request - Express request object.
 * @param {Object} request.body - The request body containing username and password.
 * @param {string} request.body.username - The username of the user.
 * @param {string} request.body.password - The password of the user.
 * @param {Object} response - Express response object.
 * @returns {Promise<void>} Responds with a JWT token and user details if login is successful, or an error message if login fails.
 */
const loginUser = async (request, response) => {
  const {username, password} = request.body

  const user = await User.findOne({username})
  const isPasswordCorrect = user !== null ? await bcrypt.compare(password, user.passwordHash) : false

  if(!(user && isPasswordCorrect)) {
    return response.status(401).json({error: 'Invalid username or password!'})
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: 60 * 60})
  const tokenExpiresAt = Date.now() + 60 * 60 * 1000

  response.status(200).send({token, username: user.username, name: user.name, id: user.id, tokenExpiresAt, message: "Log in Successful!"})
}

module.exports = {
  loginUser
}