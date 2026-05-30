const { test, beforeEach, after } = require('node:test')
const assert = require('node:assert')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const helper = require('./blog_helper')
const bcrypt = require('bcrypt')
const mongoose = require('mongoose')

const api = supertest(app)

beforeEach(async () => {
  await User.deleteMany({})

  const passwordHash = await bcrypt.hash('sekret', 10)
  const user = new User({
    username: 'root',
    name: 'Superuser',
    passwordHash: passwordHash
  })

  await user.save()
})

test('valid user is created', async () => {

  const usersAtStart = await helper.usersInDb()
  const newUser = {
    username: 'testuser',
    name: 'Test User',
    password: 'secret123'
  }

  await api
    .post('/api/users')
    .send(newUser)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  
  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)
  const usernames = usersAtEnd.map(u => u.username)
  assert.strictEqual(usernames.includes(newUser.username), true)

  

})

test('invalid user is not created', async () => {
  const usersAtStart = await helper.usersInDb()
  const newUser = {
    username: 'testuser',
    password: 's3',
    name: 'Test User'
  }
  await api
    .post('/api/users')
    .send(newUser)
    .expect(400)
  
  const usersAtEnd = await helper.usersInDb()
  assert.strictEqual(usersAtEnd.length, usersAtStart.length)
})

after(async () => {
  await mongoose.connection.close()
}
)