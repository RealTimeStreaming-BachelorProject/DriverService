import { Socket } from "socket.io";
import { LATEST_COORDINATES, SUBSCRIBE_TO_DRIVER } from "../../constants/events";
import { addSubscriber, removeSubscriber } from "../../persistence/redisNotifier";

export const setupUserListeners = (clientSocket: Socket) => {
  clientSocket.on(SUBSCRIBE_TO_DRIVER, async (driverID: string) => {
    try {
      const userId = clientSocket.id;
      console.log(
        `User with id (${userId}) subscribing to driver with id (${driverID})`
      );

      const subscriber = {
        userId, // Used to unsubscribe upon disconnection
        onChange: (value: string) => {
          const coordinates = JSON.parse(value); // TODO: Research if JSON.stringify and JSON.parse is needed here or if an array can be saved directly in redis
          clientSocket.emit(LATEST_COORDINATES, coordinates);
          console.log(coordinates)
        },
      };

      addSubscriber(`driver-${driverID}`, subscriber);
    } catch (error) {
      console.log(error);
    }
  });

  clientSocket.on("disconnect", () => {
    console.log(`User ${clientSocket.id} disconnected`);
    removeSubscriber(clientSocket.id);
  });
};
