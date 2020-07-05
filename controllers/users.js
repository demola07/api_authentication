exports.signUp = async (req, res, next) => {
  console.log('req.body', req.body)
  console.log('req.value.body', req.value.body)
  console.log('SignUp route reached')
  res.send('Signup working')
}
exports.signIn = async (req, res, next) => {
  console.log('SignIn route reached')
  res.send('Signin working')
}
exports.secret = async (req, res, next) => {
  console.log('Secret route reached')
  res.send('secret working')
}
