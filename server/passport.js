require('dotenv').config()
const passport = require('passport')
const JwtStrategy = require('passport-jwt').Strategy
const LocalStrategy = require('passport-local').Strategy
const GoogleTokenStrategy = require('passport-google-plus-token')
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
  'local',
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
        console.log('accessToken', accessToken)
        console.log('refreshToken', refreshToken)
        console.log('profile', profile)

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
