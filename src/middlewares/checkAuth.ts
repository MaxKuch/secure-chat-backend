import express from 'express'
import { verifyJWToken } from '../utils'
import { DecodedData } from "../utils/verifyJWToken";
import { UserModel } from '../Models'

export default (
  req: any,
  res: express.Response,
  next: express.NextFunction
): void => {
  if (
    req.path === "/user/login" ||
    req.path === "/user/registration"
  ) {
    return next();
  }

  const token: string | null =
    "token" in req.headers ? (req.headers.token as string) : null;

  if (token) {
    verifyJWToken(token)
      .then((user: DecodedData | null) => {
        if (user) {
          
          UserModel.findOne({email: user.data.email}).exec((err, user) => {
            if(err) throw err
            req.user = user
            next();
          });
        }
      })
      .catch(() => {
        res.status(403).json({ message: "Invalid auth token provided." });
      })
  }
  else{
    next()
  }
};