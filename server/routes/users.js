const express = require('express')
const router = require('express-promise-router')()
const passport = require('passport')

const passportStrategy = require('../passport')
const { schemas, validateBody } = require('../util/routeHelper')
const { signIn, secret, signUp, googleOauth, facebookOauth } = require('../controllers/users')
const {
  authenticateWithPassport,
  authenticateWithPassport_facebook
} = require('../middleware/passportAuth')

// passport.authenticate('googleToken', { session: false })

router.route('/signup').post(validateBody(schemas.authSchema), signUp)

router.route('/signin').post(validateBody(schemas.authSchema), authenticateWithPassport, signIn)

router.route('/oauth/google').post(authenticateWithPassport, googleOauth)

router.route('/oauth/facebook').post(authenticateWithPassport_facebook, facebookOauth)

router.route('/secret').get(authenticateWithPassport, secret)

module.exports = router
