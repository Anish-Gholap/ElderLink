// controllers/usersController.js
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
    try {
        const body = request.body
        const userToEditId = request.user.id

        const updatedUser = await User.findByIdAndUpdate(
          userToEditId,
          body,
          { new: true, runValidators: true }
        )

        if (!updatedUser) {
            return response.status(404).json({ error: 'User not found' })
        }

        response.status(200).json({
            success: true,
            data: {
                id: updatedUser._id,
                name: updatedUser.name,
                phoneNumber: updatedUser.phoneNumber
            }
        })
    } catch (error) {
        console.log(error.message)
        response.status(500).json({ error: 'Server error occurred' })
    }
}

module.exports = {
    getAllUsers,
    editUser
}