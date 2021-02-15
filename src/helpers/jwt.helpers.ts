import { verify } from "jsonwebtoken";
import { IDecodedJWT } from "../interfaces/authentication.interfaces";
import connections from "./connections";

const JWT_KEY: string = process.env["JWT_KEY"] ?? "developmentjwtkey";

export function jwtDecoded(token: string): IDecodedJWT | null {
  let decodedJWT: IDecodedJWT | null = null;
  verify(token, JWT_KEY, (err, decoded) => {
    if (err) {
      throw err;
    }
    if (decoded !== undefined) {
      decodedJWT = decoded as IDecodedJWT;
    }
  });
  return decodedJWT;
}

export function findDriverID(clientSocketID: string): string {
  const driverID = connections.get(clientSocketID);
  if (driverID === undefined) {
    // TODO Handle this scenario where driverID and connectionid has not been properly saved. Should never happen
    throw new Error("Could not find driver as a connected client");
  }
  return driverID;
}
