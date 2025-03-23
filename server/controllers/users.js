const User = require('../models/user')
const bcrypt = require('bcryptjs')
const {response} = require("express");

//handle user creation for registration
const createUser = async (request, response) => {
    const {username, name, phoneNumber, password} = request.body

    // validate password
    if (password.length < 3) {
        return response.status(400).json({error: "Password must be at least 3 characters long"})
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
    response.status(201).json(savedUser)
}

// handle GET all users
const getAllUsers = async (request, response) => {
    const users = await User.find({})
    response.status(200).json(users)
}

// edit user
const editUser = async (request, response) => {
    const body = request.body
    const userToEditId = request.user.id

    const updatedUser = await User.findByIdAndUpdate(
        userToEditId,
        body,
        {new: true, runValidators: true}
    )

    response.status(200).json({
        success:true,
        data: {
            id: updatedUser._id,
            name: updatedUser.name,
            phoneNumber: updatedUser.phoneNumber
        }
    })
}

// TODO: Remove user. Try Mongoose hooks to update Events tied to user to delete

module.exports = {
    createUser,
    getAllUsers,
    editUser
}