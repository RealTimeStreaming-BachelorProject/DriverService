import { ICoordinateData } from "../interfaces/driver.interfaces";
import { pub, redis } from "../persistence";

export const saveCoordinates = (coordinateData: ICoordinateData) => {
  const { coordinate, driverID } = coordinateData;
  const key = `driver-${driverID}`;
  pub.set(key, JSON.stringify(coordinate));
  pub.publish(key, JSON.stringify(coordinate));
};
