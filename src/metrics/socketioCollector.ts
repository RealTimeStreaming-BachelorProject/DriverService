import { Server as ioServer, Socket } from "socket.io";
import { dataToBytes } from "../helpers/metrichelpers";
import PrometheusMetrics from "./prometheusMetrics";
import { collectDefaultMetrics, register } from "prom-client";

export default class SocketIoCollector {
  io: ioServer;
  metrics: PrometheusMetrics;
  // Events not to listen to
  blacklistedEvents = new Set([
    "error",
    "connect",
    "disconnect",
    "disconnecting",
    "newListener",
    "removeListener",
  ]);

  constructor(io: ioServer, collectDefault: boolean) {
    this.metrics = new PrometheusMetrics();
    this.io = io;
    this.collectTotalTransmittedEventsFromServer();
    this.collectSocketMetrics();
    if (collectDefault) {
      collectDefaultMetrics();
    }
  }

  collectTotalTransmittedEventsFromServer() {
    const orginalServerEmit = this.io.emit;
    this.io.emit = (event: string, ...args: any[]) => {
      this.metrics.totalTransmittedEvents.inc();
      this.metrics.totalTransmittedBytes.inc(dataToBytes(args));
      return orginalServerEmit.apply(this.io, [event, ...args]);
    };
  }

  collectSocketMetrics(): void {
    // For every connection to the server collecting the following metrics from the connection
    this.io.on("connection", (socket: Socket) => {
      this.collectConcurrentConnections(socket);
      this.collectTotalSendMessagesFromSocket(socket);
      this.collectTotalReceivedMessages(socket);
    });
  }

  collectConcurrentConnections(socket: Socket) {
    socket.on("disconnect", () => {
      this.metrics.concurrentConnections.dec();
    });
    this.metrics.concurrentConnections.inc();
  }

  collectTotalSendMessagesFromSocket(socket: Socket) {
    const orginalEmit = socket.emit;
    socket.emit = (event: string, ...args: any[]) => {
      if (!this.blacklistedEvents.has(event)) {
        this.metrics.totalTransmittedEvents.inc();
        this.metrics.totalTransmittedBytes.inc(dataToBytes(args));
      }
      return orginalEmit.apply(socket, [event, ...args]);
    };
  }

  collectTotalReceivedMessages(socket: any) {
    const orginal_onevent = socket.onevent;
    socket.onevent = (packet: any) => {
      if (packet && packet.data) {
        const [event, data] = packet.data;
        
        if (event === 'error') {
          this.metrics.concurrentConnections.set((this.io.engine as any).clientsCount);
          this.metrics.totalErrors.inc();
        }
        else if (!this.blacklistedEvents.has(event)) {
          this.metrics.totalReceivedBytes.inc(dataToBytes(data));
          this.metrics.totalReceivedEvents.inc();
        }
      }

      return orginal_onevent.call(socket, packet);
    };
  }

  async getMetrics(): Promise<string> {
    return await register.metrics();
  }
}
