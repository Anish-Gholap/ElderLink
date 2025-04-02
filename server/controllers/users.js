const User = require('../models/user')
const bcrypt = require('bcryptjs')
const {response} = require("express");

//handle user creation for registration
const createUser = async (request, response) => {
    const {username, name, phoneNumber, password} = request.body

    // validate password
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


const validatePassword = (password) => {
    // Initialize result object
    const result = {
        isValid: true,
        message: ''
    };

    // Check minimum length (6 characters)
    if (!password || password.length < 6) {
        result.isValid = false
        result.message = 'Password must be at least 6 characters long'
        return result
    }

    // Check for at least 1 uppercase letter
    if (!/[A-Z]/.test(password)) {
        result.isValid = false
        result.message = 'Password must contain at least one uppercase letter'
        return result
    }

    // Check for at least 1 lowercase letter
    if (!/[a-z]/.test(password)) {
        result.isValid = false
        result.message = 'Password must contain at least one lowercase letter'
        return result
    }

    // Check for at least 1 special character
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        result.isValid = false
        result.message = 'Password must contain at least one special character'
        return result
    }

    return result
}

module.exports = {
    createUser,
    getAllUsers,
    editUser
}