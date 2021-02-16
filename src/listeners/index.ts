import { Server, Socket } from "socket.io";
import logger from "../util/logger";
import connections from "../helpers/connections";
import { jwtDecoded } from "../helpers/jwt.helpers";
import { IDecodedJWT } from "../interfaces/authentication.interfaces";
import { DRIVER_NAMESPACE, USER_NAMESPACE } from "../routes";
import { driverListeners, userListeners } from "./listeners";

export const configureIOServer = (io: Server) => {
  // note: middleware is only executed once per connection
  // only drivers need to authorize
  io.of(DRIVER_NAMESPACE).use((socket: Socket, next: any) => {
    try {
      const token: string = socket.handshake.query.token as string;
      const decodedjwt: IDecodedJWT = jwtDecoded(token);
      connections.set(socket.id, decodedjwt.driverID);
      next();
    } catch (error) {
      // All middlewares will be stopped if next is called with an error
      next(error);
    }
  });

  io.of(DRIVER_NAMESPACE).on("connection", (socket: Socket) => {
    logger.info(`Driver ${socket.id} connected`);
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
