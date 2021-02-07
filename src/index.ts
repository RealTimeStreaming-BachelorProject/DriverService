import { Server } from "http";
import { setupListeners as setupSocketIO } from "./listeners";
import * as RedisNotifier from "./listeners/util/redisNotifier";
import './persistence'
const PORT = 5001;
const server: Server = require('http').createServer();

RedisNotifier.startListening()
setupSocketIO(server);

server.listen(PORT);