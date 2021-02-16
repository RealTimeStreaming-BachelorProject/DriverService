import { Counter, Gauge, Histogram } from "prom-client";

export default class PrometheusMetrics {
  concurrentDriverConnections = new Gauge({
    name: "socket_io_concurrent_driver_connections",
    help: "Drivers",
  });

  concurrentUserConnections = new Gauge({
    name: "socket_io_concurrent_user_connections",
    help: "Users",
  });

  totalSendEvents = new Counter({
    name: "socket_io_total_sents_events",
    help: "The total number of events sent from the server",
  });

  totalSendBytes = new Counter({
    name: "socket_io_total_sents_bytes",
    help: "The total number of bytes sents from the server",
  });

  totalReceivedEvents = new Counter({
    name: "socket_io_total_received_events",
    help: "The total number of events from connected clients",
  });

  totalReceivedBytes = new Counter({
    name: "socket_io_total_received_bytes",
    help: "The total number of bytes received from connected clients",
  });

  latency = new Histogram({
    name: "socket_io_latency",
    help: "Latency",
    labelNames: ["Instance"]
  })

  // TODO: Calculate some sort of error rate
}
