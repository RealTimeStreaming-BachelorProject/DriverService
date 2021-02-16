import { Server as ioServer, Socket } from "socket.io";
import { dataToBytes } from "../helpers/metrichelpers";
import PrometheusMetrics from "./prometheusMetrics";
import { collectDefaultMetrics, register } from "prom-client";
import { DRIVER_NAMESPACE, USER_NAMESPACE } from "../routes";
import { LATENCY_RESULT } from "../events";

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
    this.collectTotalSendEventsFromServer();
    this.collectSocketMetrics();
    if (collectDefault) {
      collectDefaultMetrics();
    }
  }

  collectTotalSendEventsFromServer() {
    const orginalServerEmit = this.io.emit;
    this.io.emit = (event: string, ...args: any[]) => {
      this.metrics.totalSendEvents.inc();
      this.metrics.totalSendBytes.inc(dataToBytes(args));
      return orginalServerEmit.apply(this.io, [event, ...args]);
    };
  }

  collectSocketMetrics(): void {
    // For every connection to the server collecting the following metrics from the connection
    this.io.of(DRIVER_NAMESPACE).on("connection", (socket: Socket) => {
      this.collectConcurrentDriverConnections(socket);
      this.collectTotalSendMessagesFromSocket(socket);
      this.collectTotalReceivedMessages(socket);
      this.collectResponseTime(socket);
    });
    this.io.of(USER_NAMESPACE).on("connection", (socket: Socket) => {
      this.collectConcurrentUserConnections(socket);
      this.collectTotalSendMessagesFromSocket(socket);
      this.collectTotalReceivedMessages(socket);
    });
  }

  collectConcurrentDriverConnections(socket: Socket) {
    socket.on("disconnect", () => {
      this.metrics.concurrentDriverConnections.dec();
    });
    this.metrics.concurrentDriverConnections.inc();
  }

  collectConcurrentUserConnections(socket: Socket) {
    socket.on("disconnect", () => {
      this.metrics.concurrentUserConnections.dec();
    });
    this.metrics.concurrentUserConnections.inc();
  }

  collectTotalSendMessagesFromSocket(socket: Socket) {
    const orginalEmit = socket.emit;
    socket.emit = (event: string, ...args: any[]) => {
      if (!this.blacklistedEvents.has(event)) {
        this.metrics.totalSendEvents.inc();
        this.metrics.totalSendBytes.inc(dataToBytes(args));
      }
      return orginalEmit.apply(socket, [event, ...args]);
    };
  }

  collectTotalReceivedMessages(socket: any) {
    const org_onevent = socket.onevent;
    socket.onevent = (packet: any) => {
      if (packet && packet.data) {
        const [event, data] = packet.data;

        if (!this.blacklistedEvents.has(event)) {
          this.metrics.totalReceivedBytes.inc(dataToBytes(data));
          this.metrics.totalReceivedEvents.inc();
        }
      }

      return org_onevent.call(socket, packet);
    };
  }

  collectResponseTime(socket: Socket) {
    // The server automatically sends heartbeat requests, the client will then send the ping result back to the server for metrics.
    socket.on(LATENCY_RESULT, (latency: number) => {
      this.metrics.latency.labels("SocketIO Server").observe(latency);
    });
  }

  async getMetrics(): Promise<string> {
    return await register.metrics();
  }
}
