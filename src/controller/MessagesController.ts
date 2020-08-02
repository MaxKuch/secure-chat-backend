import express from 'express'
import socket from 'socket.io'
import Controller from './Controller'
import { MessageModel, DialogModel} from '../Models'

class MessagesController extends Controller{
  constructor(io: socket.Server){
    super(io)
  }
  index = (req: any, res: express.Response) => {
    const dialogId:string = req.params.id
    
    MessageModel.find({dialog: dialogId}).populate(["dialog", "user"]).exec((err, dialogs) => {
      if(err){
        return res.status(404).json({
          message: 'Messages not found'
        })
      }
      return res.json(dialogs)
    })
  }

  delete = (req: express.Request, res: express.Response) => {
    const id:string = req.params.id
    MessageModel.findOneAndRemove({_id: id}, (err, message) => {
      if(err){
        res.status(404).json({
          message: 'Message not found'
        })
      }
      res.json({
        message: `Dialog ${message?._id} deleted`
      })
    })
  }

  create = (req: any, res: express.Response) => {
    const userId = req.user._id
    const postData = {
      text: req.body.text,
      user: userId,
      dialog: req.body.dialog
    }
    const message = new MessageModel(postData)
    message.save((err: any, message) => {
      if (err) return res.json(err);
      message.populate("dialog").populate("user").execPopulate().then(msg => {
        this.io.emit('SERVER:MESSAGE_CREATED', msg)
        DialogModel.update({_id: postData.dialog}, {lastMessage: message._id})
        res.json(msg)
      })
      
    })
    
  }
}

export default MessagesController