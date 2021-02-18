import { Socket } from "socket.io";
import {
  DELIVERY_START,
  NEW_COORDINATES,
  PACKAGE_DELIVERED,
} from "../../events";
import { findDriverID } from "../../helpers/jwt.helpers";
import {
  ICoordinateData,
  IDeliveryStartData,
} from "../../interfaces/driver.interfaces";
import {
  associatePackagesToDriver,
  removePackage,
  saveCoordinates,
} from "./util/redis";

export const setupCoordinateListener = (clientSocket: Socket) => {
  newCoordinates(clientSocket);
  deliveryStart(clientSocket);
  packageDelivered(clientSocket);
};

function newCoordinates(clientSocket: Socket) {
  clientSocket.on(NEW_COORDINATES, (coordinateData: ICoordinateData) => {
    console.log(coordinateData)
    const driverID = findDriverID(clientSocket.id);

    coordinateData.driverID = driverID;
    saveCoordinates(coordinateData);
  });
}

function deliveryStart(clientSocket: Socket) {
  clientSocket.on(DELIVERY_START, (deliveryStartData: IDeliveryStartData) => {
    const driverID = findDriverID(clientSocket.id);
    associatePackagesToDriver(deliveryStartData.packages, driverID);
  });
}
// This event will trigger when the deliveryman delivers a package
function packageDelivered(clientSocket: Socket) {
  clientSocket.on(PACKAGE_DELIVERED, (packageId: string) => {
    removePackage(packageId);
  });
}
