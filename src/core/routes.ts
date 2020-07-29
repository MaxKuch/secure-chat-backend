import express from 'express'
import socket from 'socket.io'
import bodyParser from 'body-parser'
import cors from 'cors'
import { UserController, DialogController, MessagesController} from '../controller'
import { checkAuth } from '../middlewares'
import { loginValidation, registrationValidation } from '../utils/validations'

export default (app: express.Express, io: socket.Server) => {

  const User = new UserController(io)
  const Dialog = new DialogController(io)
  const Messages = new MessagesController(io)

  

  var corsOptions = {
    origin: 'https://whispering-dawn-05999.herokuapp.com',
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