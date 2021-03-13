import { ICoordinateData } from "../interfaces/driver.interfaces";
import { redis_pub, redis_sub } from "../persistence";

export const saveCoordinates = (coordinateData: ICoordinateData) => {
  const { coordinate, driverID } = coordinateData;
  const key = `driver-${driverID}`;
  redis_pub.set(key, JSON.stringify(coordinate));
  redis_pub.publish(key, JSON.stringify(coordinate));
};
