import express from "express";
import { Server } from "socket.io";
import cors from "cors";
import { configureIOServer } from "./listeners";
import * as RedisNotifier from "./listeners/util/redisNotifier";
import { getHealthCheck } from "./util/healthCheck";
import logger from "./util/logger";

const PORT = process.env["EXPRESS_PORT"] ?? 5001;

const io = new Server({
  cors: {
    origin: "*",
    methods: ["GET", "PUT"],
  },
});
const app = express();

/* Express Routes */
app.use(cors());
app.get("/health", (_, res) => {
  res.json(getHealthCheck(io));
});

RedisNotifier.startListening();
configureIOServer(io);

app.listen(PORT, () => {
  logger.info("🚀 Express server started");
});
