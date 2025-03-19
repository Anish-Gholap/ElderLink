const { test, after, beforeEach, describe, afterEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')
const Event = require('../models/event')
const helper = require('./testHelper')
const User = require('../models/user')

const api = supertest(app)


// Database Management
beforeEach(async () => {
    await Event.deleteMany({})
    await User.deleteMany({})

    await Event.insertMany(helper.initialEvents)

    const passwordHash = await bcrypt.hash('eventsTest', 10)
    const user = new User ({
        username: 'eventsTest',
        passwordHash: passwordHash
    })
    await user.save()

    console.log("DEBUG: ", user.username, 'added to test DB')
})