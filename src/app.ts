import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import { configureIOServer } from "./listeners";
import * as RedisNotifier from "./persistence/redisNotifier";
import { getHealthCheck } from "./util/healthCheck";
import logger from "./util/logger";
import { collectDefaultMetrics, register } from "prom-client";
import { createServer } from "http";

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
ioServer.listen(SOCKETIO_PORT, () => {
  logger.info("🚀 Socket IO server started");
});

/* Express */
const app = express();
const EXPRESS_PORT = process.env["EXPRESS_PORT"] ?? 5001;

app.use(cors());
app.get("/health", (_, res) => {
  res.json(getHealthCheck(io));
});

collectDefaultMetrics({
  gcDurationBuckets: [0.001, 0.01, 0.1, 1, 2, 5], // These are the default buckets.
});

app.get("/metrics", (_, res) => {
  // res.set("Content-Type", client.register.contentType);
  register.metrics().then((data) => res.send(data));
});

app.listen(EXPRESS_PORT, () => {
  logger.info("🚀 Express server started");
});
