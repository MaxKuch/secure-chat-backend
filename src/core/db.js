import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config()

//mongoose.connect('mongodb+srv://max:max12345@cluster0.qnxux.azure.mongodb.net/<dbname>?retryWrites=true&w=majority', {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false})
mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false})