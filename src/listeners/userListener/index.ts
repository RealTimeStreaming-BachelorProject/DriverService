import { Socket } from "socket.io";
import { addSubscriber, removeSubscriber } from "../util/redisNotifier";

export const setupUserListeners = (client: Socket) => {
  client.on("subscribe-to-driver-coordinates", (driverId) => {
    const userId = "1"
    console.log(`User with id (${userId}) subscribing to driver with id (${driverId})`)

    const subscriber = {
      userId, // Users own Id. Will be used to unsubscribe later.
      onChange: (value: string) => {
        const coordinates = JSON.parse(value)
        client.emit("latest-coordinates", coordinates);
      },
    };

    addSubscriber(`driver-${driverId}`, subscriber);
  });

  client.on("disconnect", (socket: Socket) => {
    const userId = "1";
    console.log(`User ${userId} disconnected`);
    removeSubscriber(userId);
  });
};
