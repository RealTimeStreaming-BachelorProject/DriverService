import { ICoordinateData } from "../../../interfaces/driver.interfaces";
import { createRedisClient, RedisDB } from "../../../persistence";

const redisCoordinateClient = createRedisClient(RedisDB.Coordinates);
const redisPackagesClient = createRedisClient(RedisDB.Packages);

export const saveCoordinates = (coordinateData: ICoordinateData) => {
  const { coordinate, driverID } = coordinateData;
  const key = `driver-${driverID}`;
  redisCoordinateClient.set(key, JSON.stringify(coordinate));
  redisCoordinateClient.publish(key, JSON.stringify(coordinate));
};

export const associatePackagesToDriver = (
  packages: string[],
  driverID: string
) => {
  for (const packageID of packages) {
    // For each package point it to the driver
    redisPackagesClient.set(
      packageID,
      driverID,
      "NX" // Redis will only insert key if it does not already exist
    );
  }
};

export const retrieveDriverID = async (packageID: string) => {
  return await redisPackagesClient.get(packageID)
};

export const removePackage = async (packageID: string) => {
  redisPackagesClient.del(packageID);
}
