require('dotenv').config()
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const GoogleTokenStrategy = require('passport-google-plus-token')
const FacebookTokenStrategy = require('passport-facebook-token')
const { ExtractJwt } = require('passport-jwt')

const User = require('./models/User')

// JSON WEB TOKEN STRATEGY
passport.use(
  'jwt',
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
      try {
        // Find the users specified in token
        const user = await User.findById(payload.sub)

        // Check if user exists
        if (!user) {
          const error = new Error('User does not exist')
          return done(error, false)
        }
        done(null, user)
      } catch (err) {
        done(err, false)
      }
    }
  )
)

// LOCAL STRATEGY
passport.use(
  'local',
  new LocalStrategy(
    {
      usernameField: 'email'
    },
    async (email, password, done) => {
      try {
        // Find the user with email
        const user = await User.findOne({ 'local.email': email })

        if (!user) {
          const error = new Error('User does not exist')
          return done(error, false)
        }
        //Validate password
        const isMatchPassword = await user.isValidPassword(password)
        if (!isMatchPassword) {
          const error = new Error('Invalid Credentials')
          return done(error, false)
        }
        // return user
        done(null, user)
      } catch (err) {
        done(err, false)
      }
    }
  )
)

// GOOGLE OAUTH STRATEGY
passport.use(
  'googleToken',
  new GoogleTokenStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // check if current user exists in database
        const existingUser = await User.findOne({ 'google.id': profile.id })
        if (existingUser) return done(null, existingUser)

        // if new user
        const newUser = await User.create({
          method: 'google',
          google: {
            id: profile.id,
            email: profile.emails[0].value
          }
        })

        done(null, newUser)
      } catch (err) {
        done(err, false)
      }
    }
  )
)

// FACEBOOK OAUTH STRATEGY
passport.use(
  'facebookToken',
  new FacebookTokenStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // check if current user exists in database
        const existingUser = await User.findOne({ 'facebook.id': profile.id })
        if (existingUser) return done(null, existingUser)

        // if new user
        const newUser = await User.create({
          method: 'facebook',
          facebook: {
            id: profile.id,
            email: profile.emails[0].value
          }
        })

        done(null, newUser)
      } catch (err) {
        done(err, false, err.message)
      }
    }
  )
)
