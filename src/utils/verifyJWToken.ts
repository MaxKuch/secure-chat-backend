import jwt, { VerifyErrors } from "jsonwebtoken";
import { IUser } from "../Models/User";

export interface DecodedData {
  data: IUser;
}

export default (token: string): Promise<DecodedData | null> =>
  new Promise(
    (
      resolve: (decodedData: DecodedData) => void,
      reject: (err: VerifyErrors) => void
    ) => {
      jwt.verify(
        token,
        process.env.JWT_SECRET || "",
        (err: any, decodedData) => {
          if (err || !decodedData) {
            return reject(err);
          }
          resolve(decodedData as DecodedData);
        }
      );
    }
  );