import { Server } from "http";
import { setup as positionSetup } from "./positionListener/";
import { setup as connectionSetup } from "./connectionListener/";

export const setupListeners = (server: Server) => {
  const io: SocketIO.Server = require("socket.io")(server, {
    cors: { origin: "*" },
  });
  connectionSetup(io, [positionSetup]);
};
