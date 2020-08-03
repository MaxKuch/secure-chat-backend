import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI: string = process.env.MONGO_URI_DEV || ''

mongoose.connect(MONGO_URI, 
  {
    useNewUrlParser: true, 
    useCreateIndex: true, useUnifiedTopology: true, 
    useFindAndModify: false
  }
)