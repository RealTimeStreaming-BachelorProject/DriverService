import express from "express";
import cors from "cors";
import { configureIOServer } from "./listeners";
import * as RedisNotifier from "./persistence/redisNotifier";
import { getHealthCheck } from "./helpers/healthCheck";
import logger from "./helpers/logger";
import { createServer } from "http";
import { listenForShutdownSignals } from "./helpers/shutdown";
import socketIoMetricsCollector from "./metrics/socketioCollector";
import { registerDriverService, registerLoadBalancer } from "./helpers/coordinator";
require("dotenv").config();

export const EXPRESS_PORT = process.env["EXPRESS_PORT"] ?? 5001;
export const SOCKETIO_PORT = process.env["SOCKETIO_PORT"] ?? 5002;

const init = async () => {
  // registerLoadBalancer()
  // await registerDriverService(); // Wait to check if Coordinator is responding
  setupServer();
} 

const setupServer = () => {
  /* IO Server */
  const ioServer = createServer();
  const io = require("socket.io")(ioServer, {
    cors: {
      origin: "*",
      methods: ["GET", "PUT"],
    },
  });

  RedisNotifier.coordinateListening();
  configureIOServer(io);

  const socketIoCollector = new socketIoMetricsCollector(io, true);

  /* Express */
  const app = express();

  app.use(cors());
  app.get("/health", (_, res) => {
    res.json(getHealthCheck(io));
  });

  app.get("/metrics", async (_, res) => {
    res.send(await socketIoCollector.getMetrics());
  });

  ioServer.listen(SOCKETIO_PORT, () => {
    logger.info(`🚀 Socket IO server started at port ${SOCKETIO_PORT}`);
  });

  const expressServer = app.listen(EXPRESS_PORT, () => {
    logger.info(`🚀 Express server started at port ${EXPRESS_PORT}`);
  });

  listenForShutdownSignals(io, expressServer);
};

init();