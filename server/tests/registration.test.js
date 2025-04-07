// Test file for user registration validation
const { test, after, beforeEach, describe } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const User = require('../models/user')
const { usersInDB } = require('./testHelper')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})
})

describe('User Registration', () => {

  describe('Name validation', () => {
    test('allows valid name format', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: 'anishG',
        name: 'Anish',
        password: 'Anish!',
        confirmPassword: 'Anish!',
        phoneNumber: '98689602'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDB()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const names = usersAtEnd.map(user => user.name)
      assert(names.includes(newUser.name))

      assert(result.body.message.includes('User Registered Successfully!'))
    })

    test('rejects name with numbers', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: 'anishG',
        name: 'Anish0',
        password: 'Anish!',
        confirmPassword: 'Anish!',
        phoneNumber: '98689602'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDB()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)

      assert(result.body.error.includes("User validation failed: name: Name can only contain alphabets"))
    })

    test('rejects name with special characters', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: 'anishG',
        name: 'Anish!',
        password: 'Anish!',
        confirmPassword: 'Anish!',
        phoneNumber: '98689602'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDB()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)

      assert(result.body.error.includes("User validation failed: name: Name can only contain alphabets"))
    })
  })

  describe('Username validation', () => {
    test('allows valid username format', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: 'anishG',
        name: 'Anish',
        password: 'Anish!',
        confirmPassword: 'Anish!',
        phoneNumber: '98689602'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDB()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const usernames = usersAtEnd.map(user => user.username)
      assert(usernames.includes(newUser.username))

      assert(result.body.message.includes('User Registered Successfully!'))
    })

    test('rejects username that is too short', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: 'an',
        name: 'Anish',
        password: 'Anish!',
        confirmPassword: 'Anish!',
        phoneNumber: '98689602'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDB()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)

      assert(result.body.error.includes("User validation failed: username: Username must be at least 3 characters long"))
    })

    test('rejects username that is too long', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: 'anishGholapStudentofNTU',
        name: 'Anish',
        password: 'Anish!',
        confirmPassword: 'Anish!',
        phoneNumber: '98689602'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDB()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)

      assert(result.body.error.includes("User validation failed: username: Username cannot exceed 12 characters"))
    })

    test('rejects username with special characters', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: '@nishG',
        name: 'Anish',
        password: 'Anish!',
        confirmPassword: 'Anish!',
        phoneNumber: '98689602'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDB()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)

      assert(result.body.error.includes("User validation failed: username: Username can only contain letters and numbers, no special characters"))
    })

    test('rejects non-unique username', async () => {
      const firstUser = {
        username: 'anishG',
        name: 'Anish',
        password: 'Anish!',
        confirmPassword: 'Anish!',
        phoneNumber: '98689602'
      }

      await api
        .post('/api/users')
        .send(firstUser)
        .expect(201)

      const usersAfterFirst = await usersInDB()

      const secondUser = {
        username: 'anishG',
        name: 'User',
        password: 'User2!',
        confirmPassword: 'User2!',
        phoneNumber: '99992222'
      }

      const result = await api
        .post('/api/users')
        .send(secondUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDB()
      assert.strictEqual(usersAtEnd.length, usersAfterFirst.length)

      assert(result.body.error.includes("Username not available"))
    })
  })

  describe('PhoneNumber validation', () => {
    test('allows valid phone number format', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: 'anishG',
        name: 'Anish',
        password: 'Anish!',
        confirmPassword: 'Anish!',
        phoneNumber: '98689602'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDB()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      const phoneNumbers = usersAtEnd.map(user => user.phoneNumber)
      assert(phoneNumbers.includes(newUser.phoneNumber))

      assert(result.body.message.includes('User Registered Successfully!'))
    })

    test('rejects phone number that is too short', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: 'anishG',
        name: 'Anish',
        password: 'Anish!',
        confirmPassword: 'Anish!',
        phoneNumber: '986896'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDB()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)

      assert(result.body.error.includes("User validation failed: phoneNumber: Phone number must be exactly 8 digits"))
    })

    test('rejects phone number that is too long', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: 'anishG',
        name: 'Anish',
        password: 'Anish!',
        confirmPassword: 'Anish!',
        phoneNumber: '986896024'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDB()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)

      assert(result.body.error.includes("User validation failed: phoneNumber: Phone number must be exactly 8 digits"))
    })
  })

  // Password validation
  describe('Password validation', () => {
    test('allows valid password format', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: 'anishG',
        name: 'Anish',
        password: 'Anish!',
        confirmPassword: 'Anish!',
        phoneNumber: '98689602'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDB()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

      assert(result.body.message.includes('User Registered Successfully!'))
    })

    test('rejects password that is too short', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: 'anishG',
        name: 'Anish',
        password: 'ani',
        confirmPassword: 'ani',
        phoneNumber: '98689602'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDB()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)

      assert(result.body.error.includes("Password must be at least 5 characters long"))
    })

    test('rejects password without special character', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: 'anishG',
        name: 'Anish',
        password: 'Anish',
        confirmPassword: 'Anish',
        phoneNumber: '98689602'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDB()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)

      assert(result.body.error.includes("Password must contain at least one special character"))
    })

    test('rejects password without uppercase letter', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: 'anishG',
        name: 'Anish',
        password: 'anish!',
        confirmPassword: 'anish!',
        phoneNumber: '98689602'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDB()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)

      assert(result.body.error.includes("Password must contain at least one uppercase letter"))
    })

    test('rejects password without lowercase letter', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: 'anishG',
        name: 'Anish',
        password: 'ANISH!',
        confirmPassword: 'ANISH!',
        phoneNumber: '98689602'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDB()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)

      assert(result.body.error.includes("Password must contain at least one lowercase letter"))
    })
  })

  describe('Password confirmation validation', () => {
    test('rejects when passwords do not match', async () => {
      const usersAtStart = await usersInDB()

      const newUser = {
        username: 'anishG',
        name: 'Anish',
        password: 'Anish!',
        confirmPassword: 'Anish',
        phoneNumber: '98689602'
      }

      const result = await api
        .post('/api/users')
        .send(newUser)
        .expect(400)
        .expect('Content-Type', /application\/json/)

      const usersAtEnd = await usersInDB()
      assert.strictEqual(usersAtEnd.length, usersAtStart.length)

      assert(result.body.error.includes("Passwords must match!"))
    })
  })
})

after(async () => {
  await mongoose.connection.close()
})