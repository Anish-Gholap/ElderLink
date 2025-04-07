const usersRouter = require('express').Router()
const {createUser, getAllUsers, editUser} = require('../controllers/users')

// GET all users in DB
usersRouter.get('/', getAllUsers)

// POST user to DB
// usersRouter.post('/', createUser)

// PATCH user in DB
usersRouter.patch('/profile', editUser)

module.exports = usersRouter