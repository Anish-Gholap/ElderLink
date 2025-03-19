const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const {username, password} = request.body

  const user = await User.findOne({username})
  const isPasswordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)
  
  if (!(user && isPasswordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  // creates a token for the user
  const userForToken = {
    username: user.username,
    id: user.id
  }
  const token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: 60 * 60})
  const tokenExpiresAt = Date.now() + 60 * 60 * 1000 //60 mins

  response.status(200).send({token, username: user.username, name: user.name, id: user.id, tokenExpiresAt})
})

module.exports = loginRouter