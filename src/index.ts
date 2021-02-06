import { Server } from "http";
import { setupListeners as setupSocketIO } from "./listeners";
import './persistence'
const PORT = 5001;
const server: Server = require('http').createServer();

setupSocketIO(server);

server.listen(PORT);