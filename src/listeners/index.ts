import { Server, Socket } from "socket.io";
import { DRIVER_AUTH } from "../events";
import { IDriverAuth } from "../interfaces/driverinterfaces";
import { DRIVER_NAMESPACE, USER_NAMESPACE } from "../routes";
import { driverListeners, userListeners } from "./listeners";

export const configureIOServer = (io: Server) => {
  io.of(DRIVER_NAMESPACE).on("connection", (socket: Socket) => {
    console.log(`Driver ${socket.id} connected`);

    socket.on(DRIVER_AUTH, (authdata: IDriverAuth) => {
      if (jwtIsInvalid(authdata.jwt)) {
        socket.disconnect();
      } else {
        console.log("Driver authenticated");
        
        for (const listener of driverListeners) {
          listener(socket);
        }
      }
    });
  });

  io.of(USER_NAMESPACE).on("connection", (socket: Socket) => {
    console.log(`User ${socket.id} connected`);
    for (const listener of userListeners) {
      listener(socket);
    }
  });
};

function jwtIsInvalid(jwt: string) {
  return jwt !== "gibberishUntilProperlyImplemented";
}
