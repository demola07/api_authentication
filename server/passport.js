require('dotenv').config()
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const { ExtractJwt } = require('passport-jwt')

const User = require('./models/User')

// JSON WEB TOKEN STRATEGY
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
      try {
        // Find the users specified in token
        const user = await User.findById(payload.sub)
        console.log(user)

        // Check if user exists
        if (!user) {
          return done('User does not exist', false)
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
  new LocalStrategy(
    {
      usernameField: 'email'
    },
    async (email, password, done) => {
      try {
        // Find the user with email
        const user = await User.findOne({ email })

        if (!user) {
          return done('User does not exist', false)
        }
        //Validate password
        const isMatchPassword = await user.isValidPassword(password)
        if (!isMatchPassword) {
          return done('Invalid Credentials', false)
        }
        // return user
        done(null, user)
      } catch (err) {
        done(err, false)
      }
    }
  )
)
