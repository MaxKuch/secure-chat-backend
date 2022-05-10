import express from 'express'
import { validationResult } from 'express-validator'
import socket from 'socket.io'
import bcrypt from 'bcryptjs'
import { UserModel,  } from '../Models'
import { IUser } from '../Models/User'
import { createJWTToken } from '../utils'
import Controller from './Controller'

class UserController extends Controller{
  constructor(io: socket.Server){
    super(io)
  }

  find(req: any, res: any){
    const userId: string | null = req.user._id
    const query: string = req.query.query
    const isOnline: boolean = req.query.online

    const conditinObj: {
      $and: ({
          _id: {
              $not: {
                  $eq: string | null;
              };
          };
          $or?: undefined;
      } | {
          $or: ({
              fullname: RegExp;
              email?: undefined;
          } | {
              email: RegExp;
              fullname?: undefined;
          })[];
          _id?: undefined;
      } | {
        isOnline: {
          $eq: boolean;
        }
      })[];
    } = {
      $and: [
        { _id: { $not: { $eq: userId } } }, 
        { $or: [
          { fullname: new RegExp(query, "i") },
          { email: new RegExp(query, "i") },
        ]}
      ]
    }
    if(isOnline !== undefined) {
      conditinObj.$and.push({ isOnline: { $eq: isOnline }  })
    }
    UserModel.find(conditinObj)
      .then((users: IUser[]) => res.json(users))
      .catch((err: any) => {
        return res.status(404).json({
          status: "error",
          message: err,
        });
      });
  }
  

  show(req: express.Request, res: express.Response){
    const id:string = req.params.id
    UserModel.findById(id, (err, user: IUser) => {
      if(err){
        return res.status(404).json({
          message: 'Not found'
        })
      }
      res.json(user)
    })
  }

  getMe(req: any, res: any){
    const userId: string | null = req.user ? req.user._id : null
    if(userId){
      UserModel.findById(userId).exec((err, user) => {
        if(err || !user){
          return res.status(404).json({
            message: 'User not found'
          })
        }
        return res.json(user)
      })
    }
    else res.json({status: 'error', message: 'Вы не авторизованы'})
  }

  login = (req: express.Request, res: express.Response) => {
    const postData = {
      email: req.body.email,
      password: req.body.password
    }
    const errors = validationResult(req)
    if (!errors.isEmpty) {
      return res.status(422).json({status: 'error', errors: errors.array()})
    }
    UserModel.findOne({ email: postData.email}, (err, user) => {
      
      if (err || !user){
        res.json({
          status: 'error',
          message: 'incorrect password or email'
        })
        
      } else if (bcrypt.compareSync(postData.password, user.password)){
        const token = createJWTToken(postData)
        this.io.emit('USER_CONNECTED', user._id)
        res.json({
          status: 'success',
          token
        })
      }
      else {
        res.json({
          status: 'error',
          message: 'incorrect password or email'
        })
      }
      
    })
  }

  delete(req: express.Request, res: express.Response){
    const id:string = req.params.id
    UserModel.findByIdAndRemove(id, (err, user) => {
      if(err){
        return res.status(404).json({
          message: 'Not found'
        })
      }
      res.json({
        message: `User ${user?.fullname} deleted`
      })
    })
  }

  create(req: express.Request, res: express.Response) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);
    
    const postData = {
      email: req.body.email,
      fullname: req.body.name,
      password: hash
    }

    const errors = validationResult(req)
    if (!errors.isEmpty) {
      return res.status(422).json({status: 'error', errors: errors.array()})
    }

    const user = new UserModel(postData)
    user.save((err: any, user) => {
      if (err) {
        return res.status(500).json({
          status: 'error',
          message: err
        });
      }
      const token = createJWTToken({email: user.email, password: user.password})
      res.json({
        status: 'success',
        token})
    })
  }
}

export default UserController