const authRouter = require('express').Router()
const {createUser, findUserWithPhoneNumber, changePassword, loginUser} = require('../controllers/authController')

authRouter.post('/', createUser)

authRouter.post('/login', loginUser)

authRouter.post('/find-by-phone', findUserWithPhoneNumber)

authRouter.post('/change-password', changePassword)

module.exports = authRouter