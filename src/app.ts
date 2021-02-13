import express from "express";
const app = express();
const server = require("http").createServer(app);
const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "PUT"],
  },
});
import cors from "cors";
import { configureIOServer } from "./listeners";
import * as RedisNotifier from "./listeners/util/redisNotifier";
import { getHealthCheck } from "./util/healthCheck";
const PORT = 5001;

/* Express Routes */
app.use(cors());
app.get("/health", (_, res) => {
  res.json(getHealthCheck(io));
});

RedisNotifier.startListening();
configureIOServer(io);

server.listen(PORT);
