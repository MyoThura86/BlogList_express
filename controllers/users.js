const bcrypt = require('bcrypt')
const User = require('../models/user')
const usersRouter = require('express').Router()

usersRouter.get('/', async (request, response) =>{
  const users = await User.find({}).populate('blogs', {
    url: 1,
    title: 1,
    author: 1
  })
  response.json(users)
})
usersRouter.post('/', async (request, response, next) => {
  const { username, password, name } = request.body

  //check missing fields
  if (!username || !password) {
    return response.status(400).json({
      error: 'username and password are required'
    })
  }
  //check length
  if (username.length < 3 || password.length < 3) {
    return response.status(400).json({
      error: 'username and password must be at least 3 characters long'
    })
  }
  const saltRounds =10

  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,  
    passwordHash,
    name
  })

  try{
    const savedUser = await user.save()
    response.status(201).json(savedUser)
  }
  catch(error){
    next(error)
  }
})

module.exports = usersRouter