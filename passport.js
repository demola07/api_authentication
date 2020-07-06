const passport = require('passport')
const jwtStrategy = require('passport-jwt').Strategy
const localStrategy = require('passport-local').Strategy
const { ExtractJwt } = require('passport-jwt')

const User = require('./models/User')

// JSON WEB TOKEN STRATEGY
passport.use(
  new jwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader('authorization'),
      secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
      try {
        // Find the users specified in token
        const user = User.findById(payload.sub)

        // Check if user exists
        if (!user) {
          return done(null, false)
        }
        // console.log('user', user)
        // return user
        done(null, user)
      } catch (error) {
        if (error) {
          const error = new Error('Not Authorized')
          error.statusCode = 401
          done(err, false)
          throw error
        }
      }
    }
  )
)

// LOCAL STRATEGY
passport.use(
  new localStrategy(
    {
      usernameField: 'email'
    },
    async (email, password, done) => {
      // Find the user with email
      const user = await User.findOne({ email })

      if (!user) {
        done(null, false)
      }

      //Validate password

      // return user
    }
  )
)
