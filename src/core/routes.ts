import express from 'express'
import socket from 'socket.io'
import dotenv from 'dotenv'
import bodyParser from 'body-parser'
import cors from 'cors'
import { UserController, DialogController, MessagesController} from '../controller'
import { checkAuth } from '../middlewares'
import { loginValidation, registrationValidation } from '../utils/validations'

dotenv.config()

export default (app: express.Express, io: socket.Server) => {

  const User = new UserController(io)
  const Dialog = new DialogController(io)
  const Messages = new MessagesController(io)

  const corsOptions = {
    origin: process.env.ORIGIN_DEV,
    credentials: true
  }

  app.use(cors(corsOptions), bodyParser.json(), checkAuth)

  app.get('/user/me', User.getMe);
  app.get('/user/find', User.find);
  app.get('/user/:id', User.show);
  app.delete('/user/:id', User.delete);
  app.post('/user/registration', registrationValidation, User.create);
  app.post('/user/login', loginValidation, User.login);

  app.get('/dialogs', Dialog.index);
  app.delete('/dialogs/:id',  Dialog.delete);
  app.post('/dialogs',  Dialog.create);

  app.get('/messages/:id',  Messages.index)
  app.post('/messages', Messages.create)
  app.delete('/messages/:id', Messages.delete)
}