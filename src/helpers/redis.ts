import { ICoordinateData } from "../interfaces/driver.interfaces";
import { cluster } from "../persistence";

export const saveCoordinates = (coordinateData: ICoordinateData) => {
  const { coordinate, driverID } = coordinateData;
  const key = `driver-${driverID}`;
  cluster.set(key, JSON.stringify(coordinate));
  cluster.publish(key, JSON.stringify(coordinate));
};
