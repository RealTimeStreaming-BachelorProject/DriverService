import { Socket } from "socket.io";
import { NEW_COORDINATES } from "../../events";
import { ICoordinateData } from "../../interfaces/driverinterfaces";
import { saveCoordinates } from "./util/redis";

export const setupCoordinateListener = (clientSocket: Socket) => {
  clientSocket.on(NEW_COORDINATES, (coordinateData: ICoordinateData) => {
    console.log(coordinateData)
    saveCoordinates(coordinateData)
  })
};