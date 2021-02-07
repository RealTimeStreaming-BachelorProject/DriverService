import { Socket } from "socket.io";
import { addSubscriber } from "../util/redisNotifier";

export const setupUserListeners = (client: Socket) => {
  client.on("subscribe-to-driver-coordinates", (driverId) => {

    console.log("Subscribing")

    const subscriber = {
      userId: "1", // Users own Id. Will be used to unsubscribe later.
      onChange: (value: string) => {
        const coordinates = JSON.parse(value)
        client.emit("latest-coordinates", coordinates);
      },
    };

    addSubscriber(`driver-${driverId}`, subscriber);
  });
};
