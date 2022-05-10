import express from 'express'
import socket from 'socket.io'
import dotenv from 'dotenv'
import { UserController, DialogController, MessagesController} from '../controller'
import path from 'path'

import { loginValidation, registrationValidation } from '../utils/validations'

dotenv.config()

export default (app: express.Express, io: socket.Server) => {

  const User = new UserController(io)
  const Dialog = new DialogController(io)
  const Messages = new MessagesController(io)

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

  app.get('/*', (_, res) => {
    res.sendFile(path.join(__dirname, '../static', 'index.html'))
  })
}