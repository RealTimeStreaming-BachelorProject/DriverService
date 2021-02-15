import { Server as ioServer, Socket } from "socket.io";
import { dataToBytes } from "../helpers/metrichelpers";
import PrometheusMetrics from "./prometheusMetrics";
import { collectDefaultMetrics, register } from "prom-client";
import { DRIVER_NAMESPACE, USER_NAMESPACE } from "../routes";

export default class SocketIoCollector {
  io: ioServer;
  metrics: PrometheusMetrics;

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
    this.io.emit = (event: string, ...args: any[]): boolean => {
      this.metrics.totalSendEvents.inc();
      this.metrics.totalSendBytes.inc(dataToBytes(args));
      return orginalServerEmit.apply(this.io, [event, ...args]);
    };
  }

  collectSocketMetrics(): void {
    // For every connection to the server collecting the following metrics from the connection
    this.io.of(DRIVER_NAMESPACE, (socket: Socket) => {
      this.collectConcurrentDriverConnections(socket);
      this.collectTotalSendMessagesFromSocket(socket);
      this.collectTotalReceivedMessages(socket);
    });
    this.io.of(USER_NAMESPACE, (socket: Socket) => {
      this.collectConcurrentUserConnections(socket);
      this.collectTotalSendMessagesFromSocket(socket);
      this.collectTotalReceivedMessages(socket);
    });
  }

  collectConcurrentDriverConnections(socket: Socket): void {
    socket.on("disconnect", () => {
      this.metrics.concurrentDriverConnections.dec();
    });
    this.metrics.concurrentDriverConnections.inc();
  }

  collectConcurrentUserConnections(socket: Socket): void {
    socket.on("disconnect", () => {
      this.metrics.concurrentUserConnections.dec();
    });
    this.metrics.concurrentUserConnections.inc();
  }

  collectTotalSendMessagesFromSocket(socket: Socket): void {
    const orginalEmit = socket.emit;
    socket.emit = (event: string, ...args: any[]): boolean => {
      this.metrics.totalSendEvents.inc();
      this.metrics.totalSendBytes.inc(dataToBytes(args));
      return orginalEmit.apply(socket, [event, ...args]);
    };
  }

  collectTotalReceivedMessages(socket: Socket): void {
    socket.onAny((...args: any[]) => {
      const [message] = args;

      this.metrics.totalReceivedEvents.inc();
      this.metrics.totalReceivedBytes.inc(dataToBytes(message));
    });
  }

  async getMetrics(): Promise<string> {
    return await register.metrics();
  }
}
