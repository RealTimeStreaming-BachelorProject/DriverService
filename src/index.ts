import { Server } from "http";
import { setupListeners as setupSocketIO } from "./listeners";
const server: Server = require('http').createServer();

setupSocketIO(server);

server.listen(3000);