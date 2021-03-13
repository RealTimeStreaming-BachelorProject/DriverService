import { Server, Socket } from "socket.io";
import logger from "../helpers/logger";
import connections from "../helpers/connections";
import { jwtDecoded } from "../helpers/jwt.helpers";
import { IDecodedJWT } from "../interfaces/authentication.interfaces";
import { DRIVER_NAMESPACE, USER_NAMESPACE } from "../constants/routes";
import { driverListeners, userListeners } from "./listeners";
import { authorize } from "socketio-jwt";
import { AUTHENTICATED } from "../constants/events";
const JWT_KEY: string = process.env["JWT_KEY"] ?? "developmentjwtkey";

export const configureIOServer = (io: Server) => {
  io.of(DRIVER_NAMESPACE)
    .on(
      "connection",
      authorize({
        secret: JWT_KEY,
        timeout: 15000,
      })
    )
    .on(AUTHENTICATED, (socket: any) => {
      logger.info(`Driver ${socket.id} connected and authenticated`);
      connections.set(socket.id, socket.decoded_token.driverID);
      
      for (const listener of driverListeners) {
        listener(socket);
      }
    });

  // TODO: Figure out what to do upon the event of driver disconnecting. Clean up packages in redis? Clean up all their subsribers? Something something
  io.of(USER_NAMESPACE).on("connection", (socket: Socket) => {
    console.log(`User ${socket.id} connected`);
    for (const listener of userListeners) {
      listener(socket);
    }
  });
};
