// import redisClient from '../../persistence'

import { Socket } from "socket.io";
import { NEW_COORDINATES } from "../../events";
import { ICoordinateData } from "../../interfaces/driverinterfaces";

export const setupCoordinateListener = (clientSocket: Socket) => {
  clientSocket.on(NEW_COORDINATES, (coordinateData: ICoordinateData) => {
    console.log(coordinateData)
  })

  // client.on("set-position", (position) => {
  //   console.log(position);
  //   redisClient.set(`driver-${client.id}`, position)
  // });
  // client.on("get-position", (driverId) => {
  //   const lastPosition = redisClient.get(`driver-${driverId}`)
  //   client.emit("last-position", lastPosition);
  // });
};
