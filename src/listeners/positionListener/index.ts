import redisClient from '../../persistence'
import { onKeyChange } from '../util/redisSubscribe';

export const setup = (client: SocketIO.Socket) => {
  
  const driverId = 1;

  onKeyChange(`driver-${driverId}`, (key, value) => {
    console.log(`Key ${key} was changed`);
    client.emit("last-position", value);
  })

  client.on("set-position", ({coordinates, driverId}) => {
    redisClient.set(`driver-${driverId}`, coordinates)
  });

  client.on("get-position", (driverId) => {
    const lastPosition = redisClient.get(`driver-${driverId}`)
    client.emit("last-position", lastPosition);
  });
};
