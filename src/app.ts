import { Server } from "socket.io";
import { configureIOServer } from "./listeners";
import * as RedisNotifier from './listeners/util/redisNotifier'
// import './persistence'

const PORT = 5001;
const io: Server = new Server(PORT, {
    cors: {
        origin: "*",
        methods: ["GET", "PUT"]
    }
})

RedisNotifier.startListening();
configureIOServer(io);