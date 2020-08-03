import mongoose, { Schema, Document } from 'mongoose'
import validator from 'validator'

export interface IUser extends Document {
  _id: string | null;
  email: string;
  avatar: string;
  fullname:  string;
  password:  string;
  confirmed:  boolean;
  last_seen:  Date;
}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      required: 'Email is required',
      validate: [validator.isEmail, 'Invalid email'],
      unique: true
    },
    avatar: String,
    fullname: {
      type: String,
      required: 'Fullname is required'
    },
    password: {
      type: String,
      required: 'Password is required'
    },
    confirmed: {
      type: Boolean,
      default: false
    }, 
    isOnline: {
      type: Boolean,
      default: true
    },
    last_seen: {
      type: Date,
      default: new Date()
    }
  },
  {
    timestamps: true
  }
)

UserSchema.set("toJSON", {
  virtuals: true,
});

 const UserModel = mongoose.model<IUser>("User", UserSchema)

 export default UserModel