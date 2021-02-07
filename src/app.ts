import { Server } from "socket.io";
import { configureIOServer } from "./listeners";
// import './persistence'

const PORT = 5001;
const io: Server = new Server(PORT, {
    cors: {
        origin: "*",
        methods: ["GET", "PUT"]
    }
})

configureIOServer(io);