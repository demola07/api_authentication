const dotenv = require('dotenv')
const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const passport = require('passport')

const connectDB = require('./config/db')

//load env files
dotenv.config({ path: './config/config.env' })

// Initialize express
const app = express()

app.use(passport.initialize())

// Connect to database
connectDB()

// middleware
app.use(morgan('dev'))
app.use(bodyParser.json())

// Route files
const userRoutes = require('./routes/users')

// routes
app.use('/users', userRoutes)

app.use((error, req, res, next) => {
  const status = error.statusCode || 500
  const message = error.message
  res.status(status).json({
    success: false,
    error: message
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`)
})
