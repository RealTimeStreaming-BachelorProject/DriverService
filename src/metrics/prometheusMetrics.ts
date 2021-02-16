import { Counter, Gauge } from "prom-client";

export default class PrometheusMetrics {
  concurrentConnections = new Gauge({
    name: "socket_io_concurrent_connections",
    help: "Drivers",
  });

  totalDisconnects = new Counter({
    name: "socket_io_total_disconnects",
    help: "Drivers",
  });

  totalTransmittedEvents = new Counter({
    name: "socket_io_total_transmitted_events",
    help: "The total number of events sent from the server",
  });

  totalTransmittedBytes = new Counter({
    name: "socket_io_total_transmitted_bytes",
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

  totalErrors = new Counter({
    name: "socket_io_total_errors",
    help: "The total number of errors thrown on the server",
  });
}
