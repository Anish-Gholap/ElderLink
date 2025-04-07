const User = require('../models/user')
const usersController = require('../controllers/users')

const forgotPassword = async (request, response) => {
  try {
    const body = request.body

    if (!body.otp) {
      return response.status(403).json({error: "OTP required"})
    }

    try {
      const updatedUser = usersController.changePassword()
    }
  }
}

