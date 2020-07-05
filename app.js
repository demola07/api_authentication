const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')

const userRoutes = require('./routes/users')

// Initialize express
const app = express()

// middleware
app.use(morgan('dev'))
app.use(bodyParser.json())

// routes
app.use('/users', userRoutes)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Server listening on PORT: ${PORT}`)
})
