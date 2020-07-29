import dotenv from 'dotenv'
import http from 'http'
import express from 'express'
import "./core/db"
import createRoutes from './core/routes'
import createSocket from './core/socket'
import { MessageModel, UserModel, DialogModel } from './Models'
import { verifyJWToken } from './utils'
import { IUser } from './Models/User'
dotenv.config()

const app = express();
const server = http.createServer(app);
const io = createSocket(server)

createRoutes(app, io)

server.listen(process.env.PORT, () => {
  io.on('connection', (socket) => {
    const token = socket.handshake.query.token
    let user: IUser | null = null
    if(token){
      verifyJWToken(token).then((data) => {
        if(data && data.data){
          user = data.data
          UserModel.findOneAndUpdate({email: user.email}, {isOnline: true}, (err, user) => {
            if(!err && user)
              socket.broadcast.emit('USER_CONNECTED', user._id)
          })
          
        }     
      })
    }
    socket.on('disconnect', (reason) => {
      console.log(reason)
      if(user){
        UserModel.findOneAndUpdate({email: user.email},  {isOnline: false, last_seen: new Date()}, (err, user) => {
          if(!err && user)
            socket.broadcast.emit('USER_DISCONNECTED', user._id)
        })
      }
    })
    socket.on('DIALOG_ENTERED', ({dialog_id, partner_id}) => {
      MessageModel.updateMany({$and: [{dialog: dialog_id}, {user: partner_id}]}, { isReaded: true }, (err) => {
        if(err){
          console.log(err)
        }
        socket.broadcast.emit('SERVER:MESSAGES_READED',{dialog_id, partner_id})
        DialogModel.findById(dialog_id).populate('lastMessage').exec((err, dialog: any) => {
          if(!err && dialog){
            if(dialog.lastMessage.user.toString() === partner_id){
              console.log('!!!')
              dialog.unreaded = 0
              dialog.save()
            }
          }
        })
      })
    })
      
  })
  
  console.log(`Server: http://localhost:${process.env.PORT}`)
})