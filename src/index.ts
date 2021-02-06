import { Server } from "http";
const server: Server = require('http').createServer();
const io: SocketIO.Server = require('socket.io')(server);

io.on('connection', client => {
  client.on('event', data => { /* … */ });
  client.on('disconnect', () => { /* … */ });
});

server.listen(3000);