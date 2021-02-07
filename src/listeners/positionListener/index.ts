import redisClient from "../../persistence";
import { addSubscriber } from "../util/redisNotifier";

export const setup = (client: SocketIO.Socket) => {
  client.on("subscribe-to-driver", (driverId) => {
    const subscriber = {
      userId: "1", // Users own Id. Will be used to unsubscribe later.
      onChange: (value: any) => {
        client.emit("last-position", value);
      },
    };
    addSubscriber(`driver-${driverId}`, subscriber);
  });

  client.on("set-position", ({ coordinates, driverId }) => {
    redisClient.set(`driver-${driverId}`, coordinates);
  });

  client.on("get-position", (driverId) => {
    const lastPosition = redisClient.get(`driver-${driverId}`);
    client.emit("last-position", lastPosition);
  });
};
