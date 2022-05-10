import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

const MONGO_URI: string = process.env.NODE_ENV != 'production' ? 
  (process.env.MONGO_URI_DEV || '') : 
  'mongodb+srv://max:i8cFLuw1@cluster0.qnxux.azure.mongodb.net/chat?retryWrites=true&w=majority'

mongoose.connect(MONGO_URI, 
  {
    useNewUrlParser: true, 
    useCreateIndex: true, useUnifiedTopology: true, 
    useFindAndModify: false
  }
)