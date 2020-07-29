import mongoose, { Schema, Document } from 'mongoose'
import { IUser } from './User'
import { IMessage } from './Message'

export interface IDialog extends Document {
  _id: string;
  partner: IUser['_id'];
  author: IUser['_id'];
  lastMessage: IMessage['_id'] | object;
  unreaded: number;
}

const DialogSchema = new Schema( 
  {
    author: {
      type: Schema.Types.ObjectId, ref: "User"
    },
    partner: {
      type: Schema.Types.ObjectId, ref: "User"
    },
    lastMessage: {
      type: Schema.Types.ObjectId, ref: "Message"
    },
    unreaded: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

const DialogModel = mongoose.model<IDialog>("Dialog", DialogSchema)

export default DialogModel

