import { ICoordinateData } from "../../../interfaces/driver.interfaces";
import { createRedisClient } from "../../../persistence";
import { promisify } from "util";


const redisCoordinateClient = createRedisClient(0);
const redisPackagesClient = createRedisClient(1);
const getPackageAsync = promisify(redisPackagesClient.get).bind(redisPackagesClient);

export const saveCoordinates = (coordinateData: ICoordinateData) => {
  const { coordinate, driverID } = coordinateData;
  const key = `driver-${driverID}`;
  redisCoordinateClient.set(key, JSON.stringify(coordinate));
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
  return await getPackageAsync(packageID);
};

export const removePackage = async (packageID: string) => {
  redisPackagesClient.del(packageID);
}
