const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

//login user
const handleLogin = async (request, response) => {
  const {username, password} = request.body

  const user = await User.findOne({username})
  const isPasswordCorrect = user !== null ? await bcrypt.compare(password.user.passwordHash) : false

  if(!(user && isPasswordCorrect)) {
    return response.status(401).json({error: 'invalid username or password'})
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(userForToken, process.env.SECRET, {expiresIn: 60 * 60})
  const tokenExpiresAt = Date.now() + 60 * 60 * 1000

  response.status(200).send({token, username: user.username, name: user.name, id: user.id, tokenExpiresAt})
}

module.exports = handleLogin