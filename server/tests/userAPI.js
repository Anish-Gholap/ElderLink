const { test, after, beforeEach, describe, afterEach } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')
const Event = require('../models/event')
const User = require('../models/user')
const {usersInDB, eventsInDB} = require("./testHelper");

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('usersTest', 10)
  const user = new User({username: 'usersTest', passwordHash, phoneNumber: "87789988"})

  await user.save()
  console.log('DEBUG: ',user.username, ' added to DB')
})

afterEach(async () => {
  const users = await usersInDB()
  console.log('DEBUG: User Currently in DB:')
  await users.forEach((user) => console.log(user.username))
})

describe('when there is only one user in the db at the start', () => {
  test('new user created with a different username', async () => {
    const usersAtStart = await usersInDB()

    const newUser = {
      username: "anish",
      name: "Anish Gholap",
      password: "anish",
      phoneNumber: "99999999"
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDB()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(user => user.username)
    assert(usernames.includes(newUser.username))
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await usersInDB()

    const newUser = {
      username: 'usersTest',
      name: 'Superuser',
      password: 'salainen',
      phoneNumber: "88888888"
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await usersInDB()
    assert(result.body.error.includes('expected `username` to be unique'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper status code if username is less than 3 characters long', async () => {
    const usersAtStart = await usersInDB()

    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: 'salainen',
      phoneNumber: "98989898"
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)


    const usersAtEnd = await usersInDB()
    assert(result.body.error.includes('Username must be at least 3 characters long'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })

  test('creation fails with proper status code if password is less than 3 characters long', async () => {
    const usersAtStart = await usersInDB()

    const newUser = {
      username: 'roo',
      name: 'Superuser',
      password: 'sa',
      phoneNumber: "98890099"
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)


    const usersAtEnd = await usersInDB()
    assert(result.body.error.includes('Password must be at least 3 characters long'))

    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

after(async () => {
  await mongoose.connection.close()
})