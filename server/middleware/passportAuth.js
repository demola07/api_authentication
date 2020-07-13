const passport = require('passport')

function authenticateWithPassport(req, res, next) {
  passport.authenticate(['jwt', 'local', 'googleToken'], { session: false }, function (
    err,
    user,
    info
  ) {
    if (err) {
      const error = new Error(err.message)
      error.statusCode = 400
      return next(error)
    }
    if (!user) {
      error = new Error('User is not authenticated.')
      error.statusCode = 401
      return next(error)
    }

    req.user = user
    next()
  })(req, res, next)
}

module.exports = authenticateWithPassport
