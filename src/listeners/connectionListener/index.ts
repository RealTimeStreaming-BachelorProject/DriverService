import { Socket } from "socket.io";

export const setup = (io: SocketIO.Server, listeners: Array<(client: SocketIO.Socket) => void>) => {
  io.on("connection", (client) => {
    console.log(`Client ${client.id} connected`)

    // Pass the client to all listeners
    listeners.forEach(listener => {
      listener(client);
    })
  });
};
