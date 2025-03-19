const { test, after, beforeEach, describe, afterEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')
const Event = require('../models/event')
const helper = require('./testHelper')
const User = require('../models/user')
const {usersinDB, eventsInDB} = require("./testHelper");

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

afterEach(async () => {
    const users = await helper.usersinDB()
    console.log("Users currently in test DB")
    await users.forEach((user) => console.log(user.username))
})

// TESTS

// GET all events test
describe("testing GET /events", () => {
    test("events returned as JSON with status code 200", async() => {
        await api
            .get('/events')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test("correct number of events returned", async() => {
        const response = await api.get('/events')
        assert.strictEqual(response.body.length, helper.initialEvents.length)
    })
})

describe("testing POST /events", () => {
})

after(async () => {
    //console.log("END: Users in DB: ", await usersinDB().length, "Events in DB: ", await eventsInDB().length)
    await mongoose.connection.close()
})
