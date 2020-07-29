import express from 'express'
import { UserModel } from '../Models'

export default (req: any, res: express.Response, next: express.NextFunction) => {
  if (req.user) {
    UserModel.findOneAndUpdate(
      { _id: req.user.id },
      {
        last_seen: new Date(),
      },
      { new: true },
      (err) => {
        if(err)
          res.status(500).json({message: 'something went wrong'})
      }
    );
  }
  next()
}