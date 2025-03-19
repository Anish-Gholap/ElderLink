const loginRouter = require('express').Router()
const {loginUser} = require("../controllers/login")

// POST to log in user
loginRouter.post("/", loginUser)

module.exports = loginRouter