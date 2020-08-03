import http from 'http'
import socket from 'socket.io'
import { MessageModel, UserModel, DialogModel } from '../Models'
import { verifyJWToken } from '../utils'
import { IUser } from '../Models/User'

export default (http: http.Server) => {
  
  const io = socket(http)

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
              dialog.unreaded = 0
              dialog.save()
            }
          }
        })
      })
    })

    socket.on('MESSAGE_TYPING', obj => {
      socket.broadcast.emit('MESSAGE_TYPING', obj)
    })

  })

  return io
}