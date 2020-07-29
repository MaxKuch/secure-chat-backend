import express from 'express'
import socket from 'socket.io'
import Controller from './Controller'
import { DialogModel, MessageModel } from '../Models'


class DialogController extends Controller{
  constructor(io: socket.Server){
    super(io)
  }
  index(req: any, res: any){
    const userId: string | null = req.user._id
    DialogModel.find({$or: [{author: userId}, {partner: userId}]}).populate(["author", "partner", {path: "lastMessage", populate: "user"}]).exec((err, dialogs) => {
      if(err){
        return res.status(404).json({
          message: 'Dialogs not found'
        })
      }
      return res.json(dialogs)
    })
  }

  delete(req: express.Request, res: express.Response){
    const id:string = req.params.id
    DialogModel.findOneAndRemove({_id: id}, (err, dialog) => {
      if(err){
        res.status(404).json({
          message: 'Dialog not found'
        })
      }
      res.json({
        message: `Dialog ${dialog?._id} deleted`
      })
    })
  }

  create = (req: any, res: express.Response) => {
    const postData = {
      author: req.user._id,
      partner: req.body.partner,
    }
    const dialog = new DialogModel(postData)
    dialog.save((err, dialog) => {
      if (err) return res.json(err);
      const message = new MessageModel({
        text: req.body.text,
        dialog: dialog._id,
        user: postData.author
      })
      message.save((err, message) => {
        if (err) return res.json(err);
        
        message.populate("user").execPopulate().then((message) => {
          dialog.populate("partner").populate("author").execPopulate().then((dialog:any) => {
            this.io.emit('SERVER:DIALOG_CREATED', {...dialog._doc, unreaded: 1, lastMessage: message})
            res.json({...dialog._doc, unreaded: 1, lastMessage: message})
          })
        })
      })
    })
  }
}

export default DialogController