const express = require('express')
const router = require('express-promise-router')()
const passport = require('passport')

const passportStrategy = require('../passport')
const { schemas, validateBody } = require('../util/routeHelper')
const { signIn, secret, signUp } = require('../controllers/users')
const authenticateJwt = require('../middleware/passportJwt')

router.route('/signup').post(validateBody(schemas.authSchema), signUp)

router.route('/signin').post(signIn)

router.route('/secret').get(authenticateJwt, secret)

module.exports = router
