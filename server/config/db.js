const mongoose = require('mongoose')

const connectDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    const conn = await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  } else {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true
    })

    console.log(`MongoDB Connected: ${conn.connection.host}`)
  }
}

module.exports = connectDB
