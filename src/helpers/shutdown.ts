import { Server } from "http";
import { Server as ioServer } from "socket.io";

// The signals we want to handle
var signals = {
  SIGHUP: 1,
  SIGINT: 2,
  SIGTERM: 15,
};

export function listenForShutdownSignals(
  ioServer: ioServer,
  expressServer: Server
) {
  // Create a listener for each of the signals that we want to handle
  Object.keys(signals).forEach((signal) => {
    process.on(signal, () => {
      shutdown(signal, (signals as any)[signal], ioServer, expressServer);
    });
  });
}
// Do any necessary shutdown logic for our application here
const shutdown = (
  signal: any,
  value: any,
  ioServer: ioServer,
  expressServer: Server
) => {
  console.log(`\nServer stopped by ${signal} with value ${value}`);
  ioServer.close();
  expressServer.close();
  process.exit(0);
};
