const User = require('../models/user')

// Get all users
const getAllUsers = async (request, response) => {
    try {
        const users = await User.find({})
        response.status(200).json(users)
    } catch (error) {
        console.log(error.message)
        response.status(500).json({ error: 'Server error occurred' })
    }
}

// Edit user
const editUser = async (request, response) => {
    const body = request.body
    const userToEditId = request.user.id

    try {
        const updatedUser = await User.findByIdAndUpdate(
            userToEditId,
            body,
            { new: true, runValidators: true }
        )

        response.status(200).json({
            success: true,
            data: {
                id: updatedUser._id,
                name: updatedUser.name,
                phoneNumber: updatedUser.phoneNumber
            }
        })
    } catch (error) {
        response.status(500).json({
            success: false,
            message: 'An error occurred while updating the user',
            error: error.message
        })
    }
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
}

module.exports = {
    getAllUsers,
    editUser
}