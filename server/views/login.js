const loginRouter = require('express').Router
const {handleLogin} = require("../controllers/login")

// POST to log in user
loginRouter.POST("/login", handleLogin)

module.exports = loginRouter