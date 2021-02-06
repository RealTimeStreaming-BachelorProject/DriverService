export const setup = (client: SocketIO.Socket) => {
  client.on("position", ()  => {
    console.log("Position event")
    const response = "this is the new position";
    client.emit("new-position", response)
  });
};
