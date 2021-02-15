import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import { configureIOServer } from "./listeners";
import * as RedisNotifier from "./persistence/redisNotifier";
import { getHealthCheck } from "./util/healthCheck";
import logger from "./util/logger";
import { createServer } from "http";
import socketIoMetricsCollector from "./metrics/socketioCollector";
import { listenForShutdownSignals } from "./helpers/shutdown";

/* IO Server */
const ioServer = createServer();
const io = new Server(ioServer, {
  cors: {
    origin: "*",
    methods: ["GET", "PUT"],
  },
});

const SOCKETIO_PORT = process.env["SOCKETIO_PORT"] ?? 5002;

RedisNotifier.startListening();
configureIOServer(io);

const socketIoCollector = new socketIoMetricsCollector(io, true);

/* Express */
const app = express();
const EXPRESS_PORT = process.env["EXPRESS_PORT"] ?? 5001;

app.use(cors());
app.get("/health", (_, res) => {
  res.json(getHealthCheck(io));
});

app.get("/metrics", async (_, res) => {
  res.send(await socketIoCollector.getMetrics());
});

ioServer.listen(SOCKETIO_PORT, () => {
  logger.info("🚀 Socket IO server started");
});

const expressServer = app.listen(EXPRESS_PORT, () => {
  logger.info("🚀 Express server started");
});

listenForShutdownSignals(io, expressServer);





