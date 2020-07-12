const passport = require('passport')

function authenticateJwt(req, res, next) {
  passport.authenticate(['jwt', 'local'], { session: false }, function (err, user, info) {
    if (err) return next(new Error(err))
    if (!user) {
      error = new Error('User is not authenticated.')
      error.statusCode = 401
      next(error)
    }
    req.user = user
    next()
  })(req, res, next)
}

module.exports = authenticateJwt
