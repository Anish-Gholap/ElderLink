const { test, after, before, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const Event = require('../models/event')

const api = supertest(app)

let authToken
let userId

before (async () => {
  await User.deleteMany({})

  const user = {
    "username": "testUser",
    "name": "TestUser",
    "phoneNumber": "99989999",
    "password": "TestUser!"
  }

  await api
    .post('/api/auth')
    .send(user)

  const loginResponse = await api
    .post('/api/auth/login')
    .send({
      username: "testUser",
      password: "TestUser!"
    })

  authToken = loginResponse.body.token
  userId = loginResponse.body.id
})



beforeEach(async () => {
  await Event.deleteMany()
})

describe("Create Event Validation", () => {

  // Event Title Validation
  describe("Event Title Validation", () => {
    test('allows valid title format', async () => {
      const eventsAtStart = await Event.find({})

      const newEvent = {
        title: 'Mahjong',
        location: 'Aljunied CC',
        numAttendees: 4,
        date: '2025-04-15T11:00:00.000Z',
        description: 'This is a brief description of the mahjong event.!',
      }

      const result = await api
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newEvent)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const eventsAtEnd = await Event.find({})
      assert.strictEqual(eventsAtEnd.length, eventsAtStart.length + 1)

      const titles = eventsAtEnd.map(event => event.title)
      assert(titles.includes(newEvent.title))
    })

    test('rejects title with special characters', async () => {
      const eventsAtStart = await Event.find({})

      const newEvent = {
        title: 'M@hjong',
        location: 'Aljunied CC',
        numAttendees: 4,
        date: '2025-04-15T11:00:00.000Z',
        description: 'This is a brief description of the mahjong event.!',
      }

      const result = await api
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newEvent)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const eventsAtEnd = await Event.find({})
      assert.strictEqual(eventsAtEnd.length, eventsAtStart.length)

      console.log(result.body.error)
      assert(result.body.error.includes("Event validation failed: title: Title can only contain letters, numbers, and spaces"))
    })
  })

  // Number of Attendees
  describe("Event Number of Attendees Validation", () => {
    test('allows valid number of attendees (1)', async () => {
      const eventsAtStart = await Event.find({})

      const newEvent = {
        title: 'Mahjong',
        location: 'Aljunied CC',
        numAttendees: 1,
        date: '2025-04-11T14:00:00.000', // 11/04/25 02:00 PM
        description: 'This is a brief description of the mahjong event.!'
      }

      const result = await api
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newEvent)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const eventsAtEnd = await Event.find({})
      assert.strictEqual(eventsAtEnd.length, eventsAtStart.length + 1)
    })

    test('allows valid number of attendees (10)', async () => {
      const eventsAtStart = await Event.find({})

      const newEvent = {
        title: 'Mahjong',
        location: 'Aljunied CC',
        numAttendees: 10,
        date: '2025-04-11T14:00:00.000', // 11/04/25 02:00 PM
        description: 'This is a brief description of the mahjong event.!'
      }

      const result = await api
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newEvent)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const eventsAtEnd = await Event.find({})
      assert.strictEqual(eventsAtEnd.length, eventsAtStart.length + 1)
    })

    test('rejects negative number of attendees', async () => {
      const eventsAtStart = await Event.find({})

      const newEvent = {
        title: 'Mahjong',
        location: 'Aljunied CC',
        numAttendees: -1,
        date: '2025-04-11T14:00:00.000', // 11/04/25 02:00 PM
        description: 'This is a brief description of the mahjong event.!'
      }

      const result = await api
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newEvent)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const eventsAtEnd = await Event.find({})
      assert.strictEqual(eventsAtEnd.length, eventsAtStart.length)

      assert(result.body.error.includes("Event validation failed: numAttendees: Number of attendees must be positive and not zero"))
    })

    test('rejects zero as number of attendees', async () => {
      const eventsAtStart = await Event.find({})

      const newEvent = {
        title: 'Mahjong',
        location: 'Aljunied CC',
        numAttendees: 0,
        date: '2025-04-11T14:00:00.000', // 11/04/25 02:00 PM
        description: 'This is a brief description of the mahjong event.!'
      }

      const result = await api
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newEvent)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const eventsAtEnd = await Event.find({})
      assert.strictEqual(eventsAtEnd.length, eventsAtStart.length)

      assert(result.body.error.includes("Event validation failed: numAttendees: Number of attendees must be positive and not zero"))
    })

    test('rejects number of attendees exceeding maximum (11)', async () => {
      const eventsAtStart = await Event.find({})

      const newEvent = {
        title: 'Mahjong',
        location: 'Aljunied CC',
        numAttendees: 11,
        date: '2025-04-11T14:00:00.000', // 11/04/25 02:00 PM
        description: 'This is a brief description of the mahjong event.!'
      }

      const result = await api
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newEvent)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const eventsAtEnd = await Event.find({})
      assert.strictEqual(eventsAtEnd.length, eventsAtStart.length)

      assert(result.body.error.includes("Event validation failed: numAttendees: Number of attendees cannot exceed 10"))
    })
  })
  // Date Time
  describe("Event Date and Time Validation", () => {
    test('allows valid event date and time', async () => {
      const eventsAtStart = await Event.find({})

      const newEvent = {
        title: 'Mahjong',
        location: 'Aljunied CC',
        numAttendees: 4,
        date: '2025-04-15T11:00:00.000', // 15/04/2025 11:00 AM
        description: 'This is a brief description of the mahjong event.!'
      }

      const result = await api
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newEvent)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const eventsAtEnd = await Event.find({})
      assert.strictEqual(eventsAtEnd.length, eventsAtStart.length + 1)
    })

    test('allows event time within CC operating hours (at 10 AM)', async () => {
      const eventsAtStart = await Event.find({})

      const newEvent = {
        title: 'Mahjong',
        location: 'Aljunied CC',
        numAttendees: 4,
        date: '2025-04-15T10:00:00.000', // 15/04/2025 10:00 AM
        description: 'This is a brief description of the mahjong event.!'
      }

      const result = await api
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newEvent)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const eventsAtEnd = await Event.find({})
      assert.strictEqual(eventsAtEnd.length, eventsAtStart.length + 1)
    })

    test('rejects event time outside CC operating hours (9 AM)', async () => {
      const eventsAtStart = await Event.find({})

      const newEvent = {
        title: 'Mahjong',
        location: 'Aljunied CC',
        numAttendees: 4,
        date: '2025-04-15T09:00:00.000', // 15/04/2025 09:00 AM
        description: 'This is a brief description of the mahjong event.!'
      }

      const result = await api
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newEvent)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const eventsAtEnd = await Event.find({})
      assert.strictEqual(eventsAtEnd.length, eventsAtStart.length)

      assert(result.body.error.includes("Event validation failed: date: Date must be valid and during CC operating hours (10am-10pm)"))
    })

    test('rejects event time outside CC operating hours (11 PM)', async () => {
      const eventsAtStart = await Event.find({})

      const newEvent = {
        title: 'Mahjong',
        location: 'Aljunied CC',
        numAttendees: 4,
        date: '2025-04-15T23:00:00.000', // 15/04/2025 11:00 PM
        description: 'This is a brief description of the mahjong event.!'
      }

      const result = await api
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newEvent)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const eventsAtEnd = await Event.find({})
      assert.strictEqual(eventsAtEnd.length, eventsAtStart.length)

      assert(result.body.error.includes("Event validation failed: date: Date must be valid and during CC operating hours (10am-10pm)"))
    })

    test('rejects invalid date (day does not exist)', async () => {
      const eventsAtStart = await Event.find({})

      const newEvent = {
        title: 'Mahjong',
        location: 'Aljunied CC',
        numAttendees: 4,
        date: '2025-04-32T11:00:00.000', // 32/04/2025 11:00 AM - Invalid day
        description: 'This is a brief description of the mahjong event.!'
      }

      const result = await api
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newEvent)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const eventsAtEnd = await Event.find({})
      assert.strictEqual(eventsAtEnd.length, eventsAtStart.length)

      assert(result.body.error.includes("Event validation failed: date: Cast to date failed for value \"Invalid Date\" (type Date) at path \"date\""))
    })
  })

  describe("Event Description Validation", () => {
    test('allows valid description (50+ characters)', async () => {
      const eventsAtStart = await Event.find({})

      const newEvent = {
        title: 'Mahjong',
        location: 'Aljunied CC',
        numAttendees: 4,
        date: '2025-04-11T14:00:00.000', // 11/04/25 02:00 PM
        description: 'This is a brief description of the mahjong event.!'  // Exactly 50 characters
      }

      const result = await api
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newEvent)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const eventsAtEnd = await Event.find({})
      assert.strictEqual(eventsAtEnd.length, eventsAtStart.length + 1)
    })

    test('rejects short description (less than 50 characters)', async () => {
      const eventsAtStart = await Event.find({})

      const newEvent = {
        title: 'Mahjong',
        location: 'Aljunied CC',
        numAttendees: 4,
        date: '2025-04-11T14:00:00.000', // 11/04/25 02:00 PM
        description: 'Short description.'
      }

      const result = await api
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newEvent)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const eventsAtEnd = await Event.find({})
      assert.strictEqual(eventsAtEnd.length, eventsAtStart.length)

      assert(result.body.error.includes("Event validation failed: description: Description must be at least 50 characters long"))
    })

    test('rejects blank description', async () => {
      const eventsAtStart = await Event.find({})

      const newEvent = {
        title: 'Mahjong',
        location: 'Aljunied CC',
        numAttendees: 4,
        date: '2025-04-11T14:00:00.000', // 11/04/25 02:00 PM
        description: ''
      }

      const result = await api
        .post('/api/events')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newEvent)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const eventsAtEnd = await Event.find({})
      assert.strictEqual(eventsAtEnd.length, eventsAtStart.length)

      assert(result.body.error.includes("Event validation failed: description: Description must be at least 50 characters long"))
    })
  })
})


after(async () => {
  await mongoose.connection.close()
})