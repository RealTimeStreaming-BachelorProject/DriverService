import { Socket } from "socket.io";
import { NEW_COORDINATES } from "../../events";
import { findDriverID } from "../../helpers/jwt.helpers";
import { ICoordinateData } from "../../interfaces/driver.interfaces";
import { saveCoordinates } from "../../helpers/redis";

export const setupCoordinateListener = (clientSocket: Socket) => {
  newCoordinates(clientSocket);
};

function newCoordinates(clientSocket: Socket) {
  clientSocket.on(NEW_COORDINATES, (coordinateData: ICoordinateData) => {
    const driverID = findDriverID(clientSocket.id);

    coordinateData.driverID = driverID;
    saveCoordinates(coordinateData);
  });
}
