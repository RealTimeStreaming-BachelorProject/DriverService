import { Server, Socket } from "socket.io";
import { DRIVER_INIT } from "../events";
import connections from "../helpers/connections";
import { jwtDecoded } from "../helpers/jwt.helpers";
import { IDecodedJWT } from "../interfaces/authentication.interfaces";
import { IDriverInitData } from "../interfaces/driver.interfaces";
import { DRIVER_NAMESPACE, USER_NAMESPACE } from "../routes";
import { driverListeners, userListeners } from "./listeners";
import { removeSubscriber } from "./util/redisNotifier";

export const configureIOServer = (io: Server) => {
  io.of(DRIVER_NAMESPACE).on("connection", (socket: Socket) => {
    console.log(`Driver ${socket.id} connected`);

    socket.on(DRIVER_INIT, (driverInitData: IDriverInitData) => {
      try {
        const decodedjwt: IDecodedJWT | null = jwtDecoded(driverInitData.jwt);
        if (decodedjwt !== null) {
          connections.set(socket.id, decodedjwt.driverID);
          // Pass the authenticated driver socket to all relevant listernes
          for (const listener of driverListeners) {
            listener(socket);
          }
        } else {
          console.log("json web token not verified");
        }
      } catch (error) {
        // If the sender hasn't sent a proper JWT they are disconnected
        // This is easily exploited by DDOS attacks, this could be improved in the future by blacklisting
        console.log(`Driver ${socket.id} disconnected`);
        socket.disconnect();
      }
    });
  });

  // TODO: Figure out what to do upon the event of driver disconnecting. Clean up packages in redis? Clean up all their subsribers? Something something

  io.of(USER_NAMESPACE).on("connection", (socket: Socket) => {
    console.log(`User ${socket.id} connected`);
    for (const listener of userListeners) {
      listener(socket);
    }
  });
};
