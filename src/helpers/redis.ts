import { ICoordinateData } from "../interfaces/driver.interfaces";
import { cluster } from "../persistence";

export const saveCoordinates = (coordinateData: ICoordinateData) => {
  const { coordinate, driverID } = coordinateData;
  const key = `driver-${driverID}`;
  cluster.set(key, JSON.stringify(coordinate));
  cluster.publish(key, JSON.stringify(coordinate));
};

export const associatePackagesToDriver = (
  packages: string[],
  driverID: string
) => {
  for (const packageID of packages) {
    // For each package point it to the driver
    var key = `package-${packageID}`;
    cluster.set(
      key,
      driverID,
      "NX" // Redis will only insert key if it does not already exist
    );
  }
};

export const retrieveDriverID = async (packageID: string) => {
  const driverID = await cluster.get(`package-${packageID}`)
  if (!driverID) throw new Error("Unable to find Driver based on packageID")
  return driverID;
};

export const removePackage = async (packageID: string) => {
  cluster.del(`package-${packageID}`);
}
