/**
 * @file authController.js
 * @description Handles user authentication including registration, login, password validation and reset.
 */
const User = require('../models/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

/**
 * Validates password strength based on length and character requirements.
 * @param {string} password - The password to validate.
 * @returns {{isValid: boolean, message: string}} Validation result and message.
 */
const validatePassword = (password) => {

  const result = {
    isValid: true,
    message: ''
  };

  if (!password || password.length < 5) {
    result.isValid = false
    result.message = 'Password must be at least 5 characters long'
    return result
  }

  if (!/[A-Z]/.test(password)) {
    result.isValid = false
    result.message = 'Password must contain at least one uppercase letter'
    return result
  }

  if (!/[a-z]/.test(password)) {
    result.isValid = false
    result.message = 'Password must contain at least one lowercase letter'
    return result
  }


  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    result.isValid = false
    result.message = 'Password must contain at least one special character'
    return result
  }

  return result
}

/**
 * Registers a new user.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @returns {Object} JSON response with user data or error.
 */
const createUser = async (request, response) => {

    const {username, name, phoneNumber, password, confirmPassword} = request.body

    if (confirmPassword !== undefined && confirmPassword !== password) {
      return response.status(400).json({error: "Passwords must match!"})
    }


    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return response.status(400).json({ error: passwordValidation.message });
    }

    //hash password
    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
      username: username,
      name: name,
      phoneNumber: phoneNumber,
      passwordHash: passwordHash
    })

    const savedUser = await user.save()
    response.status(201).json({
      user: savedUser.toJSON(),
      message: "User Registered Successfully!"
    })
}

/**
 * Logs in a user and returns a JWT token on success.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @returns {Object} JSON response with token and user info or error.
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

/**
 * Finds a user by phone number.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @returns {Object} JSON response with user data or error.
 */
const findUserWithPhoneNumber = async (request, response) => {
  console.log(request.body)
  try {
    const {phoneNumber} = request.body
    const user = await User.findOne({phoneNumber})

    if (!user) {
      return response.status(404).json({error: "Wrong phone number"})
    }

    return response.status(200).json(user)
  } catch (error) {
    console.log(error.message)
    response.status(500).json({ error: 'Server error occurred' })
  }
}

/**
 * Changes a user's password after verifying OTP and validating new password.
 * @param {Object} request - Express request object.
 * @param {Object} response - Express response object.
 * @returns {Object} JSON response with success message or error.
 */
const changePassword = async (request, response) => {
  try {
    const {username, password, confirmPassword, otp} = request.body

    if (!otp) {
      return response.status(403).json({error: "OTP required"})
    }

    if (confirmPassword !== undefined && confirmPassword !== password) {
      return response.status(400).json({error: "Passwords must match!"})
    }

    // validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return response.status(400).json({ error: passwordValidation.message });
    }

    const userToUpdate = await User.findOne({username})
    if (!userToUpdate) {
      return response.status(404).json({error: "User not found"})
    }

    //hash password
    const saltRounds = 10
    userToUpdate.passwordHash = await bcrypt.hash(password, saltRounds)
    await userToUpdate.save()

    return response.status(200).json({message: "Password changed successfully"})
  } catch (error) {
    console.log(error.message)
    response.status(500).json({ error: error.message })
  }
}

module.exports = {
  createUser,
  findUserWithPhoneNumber,
  changePassword,
  loginUser
}