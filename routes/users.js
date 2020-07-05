const express = require('express')
const router = require('express-promise-router')()

const { signIn, secret, signUp } = require('../controllers/users')

router.route('/signup').post(signUp)

router.route('/signin').post(signIn)

router.route('/secret').get(secret)

module.exports = router
