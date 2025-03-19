const usersRouter = require('express').Router()
const {createUser, getAllUsers} = require('../controllers/users')

// GET all users in DB
usersRouter.get('/', getAllUsers)

// POST user to DB
usersRouter.post('/', createUser)

module.exports = usersRouter