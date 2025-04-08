// Test file for user login functionality
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const app = require('../app')
const User = require('../models/user')
const { usersInDB } = require('./testHelper')

const api = supertest(app)

describe('User Login', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    // Create a test user before each test
    const passwordHash = await bcrypt.hash('Anish!', 10)
    const user = new User({
      username: 'anishG',
      name: 'Anish',
      passwordHash,
      phoneNumber: '98689602'
    })

    await user.save()
  })

  test('succeeds with correct credentials', async () => {
    const loginUser = {
      username: 'anishG',
      password: 'Anish!'
    }

    const result = await api
      .post('/api/auth/login')
      .send(loginUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    assert(result.body.token)
    assert(result.body.username === 'anishG')
    console.log(result.body.message)
    assert(result.body.message.includes('Log in Successful!'))
  })

  test('fails with non-existent username', async () => {
    const loginUser = {
      username: 'anish',
      password: 'Anish!'
    }

    const result = await api
      .post('/api/auth/login')
      .send(loginUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    console.log(result.body.error)
    assert(!result.body.token)
    assert(result.body.error.includes('Invalid username or password!'))
  })

  test('fails with incorrect password', async () => {
    const loginUser = {
      username: 'anishG',
      password: 'Anish'
    }

    const result = await api
      .post('/api/auth/login')
      .send(loginUser)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    assert(!result.body.token)
    assert(result.body.error.includes('Invalid username or password!'))
  })
})

after(async () => {
  await mongoose.connection.close()
})