import { setupCoordinateListener } from "./coordinateListener/coordinateListener";
import { setupUserListeners } from "./userListener";

export const driverListeners = [setupCoordinateListener];
export const userListeners = [setupUserListeners];
