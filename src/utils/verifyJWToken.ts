import jwt, { VerifyErrors } from "jsonwebtoken";
import { IUser } from "../Models/User";

export interface DecodedData {
  data: IUser;
}

export default (token: string | string[] | undefined): Promise<DecodedData | null> =>
  new Promise(
    (
      resolve: (decodedData: DecodedData) => void,
      reject: (err: VerifyErrors) => void
    ) => {
      if(token === undefined)
        token = ''
      if(token instanceof Array)
        token = token[0]
      try {
        const decodedData = jwt.verify(
            token,
            process.env.JWT_SECRET || ""
          );
          resolve(decodedData as DecodedData);
      }
      catch(err) {
        reject(err as VerifyErrors)
      }
    }
  );