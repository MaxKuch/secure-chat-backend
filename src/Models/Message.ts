import mongoose, { Schema, Document } from 'mongoose'
import DialogModel, { IDialog } from './Dialog'

export interface IMessage extends Document {
  _id: string,
  text: string;
  user: string | null;
  dialog: IDialog['_id'];
  isReaded: boolean;
}


const MessageSchema = new Schema(
  {
    text: {
      type: String,
    },
    user: {
      type:  Schema.Types.ObjectId,
      ref: 'User'
    },
    dialog: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Dialog"
    },
    //attachments:,
    //audio:,
    isReaded: {
      type: Boolean,
      default: false
    },
    
  },
  {
    timestamps: true
  }
)

MessageSchema.pre('save', function(this: IMessage, next) {
  DialogModel.findById(this.dialog).exec((err, dialog) => {
    if (!err && dialog){
      dialog.lastMessage= this._id
      dialog.unreaded++
      dialog.save()
    }
    next();
  })
})

const MessageModel = mongoose.model<IMessage>("Message", MessageSchema)

export default MessageModel

