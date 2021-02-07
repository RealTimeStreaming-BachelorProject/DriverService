import { ICoordinateData } from "../../../interfaces/driverinterfaces";
import { createRedisClient } from "../../../persistence";
export const saveCoordinates = (coordinateData: ICoordinateData) => {
    const redisClient = createRedisClient();
    const {coordinate, userid} = coordinateData;
    const key = `driver-${userid}`
    redisClient.set(key, JSON.stringify(coordinate));
};
