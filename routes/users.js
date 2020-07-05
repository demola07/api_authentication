const express = require('express')
const router = require('express-promise-router')()

const { schemas, validateBody } = require('../util/routeHelper')
const { signIn, secret, signUp } = require('../controllers/users')

router.route('/signup').post(validateBody(schemas.authSchema), signUp)

router.route('/signin').post(signIn)

router.route('/secret').get(secret)

module.exports = router
