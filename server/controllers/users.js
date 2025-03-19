const User = require('../models/user')
const bcrypt = require('bcryptjs')
const {response} = require("express");

//handle user creation for registration
const createUser = async (request, response) => {
    const {username, name, phoneNumber, password} = request.body

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
    response.status(201).json(savedUser)
}

// handle GET all users
const getAllUsers = async (request, response) => {
    const users = await User.find({})
    response.status(200).json(users)
}

module.exports = {
    createUser,
    getAllUsers
}