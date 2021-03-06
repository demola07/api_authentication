const jwt = require('jsonwebtoken')

const User = require('../models/User')

exports.signUp = async (req, res, next) => {
  const { email, password } = req.value.body

  // Check if user already exists
  const foundUser = await User.findOne({ 'local.email': email })

  if (foundUser) {
    return res.status(403).json({
      success: false,
      error: 'User already exists'
    })
  }

  // Create new user
  const newUser = await User.create({
    method: 'local',
    local: {
      email,
      password
    }
  })

  // Generate token
  const token = signToken(newUser)

  //Respond with token
  res.status(201).json({
    success: true,
    message: 'User created',
    token
  })
}
exports.signIn = async (req, res, next) => {
  const token = signToken(req.user)
  res.status(200).json({
    success: true,
    token
  })
}

exports.googleOauth = async (req, res, next) => {
  // Generate token and send response
  generateOauthToken(req, res, 200)
}

exports.facebookOauth = async (req, res, next) => {
  // Generate token and send response
  generateOauthToken(req, res, 200)
}

exports.secret = async (req, res, next) => {
  res.json({
    message: 'You have reached the protected route'
  })
}

const generateOauthToken = (req, res, statusCode) => {
  const token = signToken(req.user)

  res.status(200).json({
    success: true,
    token
  })
}

const signToken = (user) => {
  return jwt.sign(
    {
      iss: 'apiauth',
      sub: user._id,
      iat: new Date().getTime(),
      exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
    },
    process.env.JWT_SECRET
  )
}
