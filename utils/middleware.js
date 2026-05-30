const {info, error} = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (req, res, next) => {
  info('Method:', req.method)
  info('Path:  ', req.path)
  info('Body:  ', req.body)
  info('---')
  next()
}

const unknownEndpoint = (req, res) => {
  res.status(404).send({error: 'unknown endpoint'})
}

const errorHandler = (err, req, res, next) => {
  error(err.message)

  if (err.name === 'CastError') {
    return res.status(400).send({error: 'malformatted id'})
  }
  else if (err.name === 'ValidationError') {
    return res.status(400).json({error: err.message})
  }
  else if (err.name === 'MongoServerError' && err.message.includes('E11000 duplicate key error')) {
    return res.status(400).json({error: 'username must be unique'})
  }
  else if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({error: 'invalid token'})
  }
  else if (err.name === 'TokenExpiredError') {
    return res.status(401).json({error: 'token expired'})
  }

  next(err)
}

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)
  } else {
    request.token = null
  }
  next()
}

const userExtractor = async (request, response, next) => {
  try {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({error: 'token missing or invalid'})
    }
    request.user = await User.findById(decodedToken.id)
    next()
  } catch (err) {
    next(err)
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  tokenExtractor,
  userExtractor
}
