import redisClient from '../../persistence'

export const setup = (client: SocketIO.Socket) => {
  client.on("set-position", (position) => {
    console.log(position);
    redisClient.set(`driver-${client.id}`, position)
  });
  client.on("get-position", (driverId) => {
    const lastPosition = redisClient.get(`driver-${driverId}`)
    client.emit("last-position", lastPosition);
  });
};
