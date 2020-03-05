const PLAYERS = {};

const normalize = player => {
  const { id, x, y } = player;
  return { id, x, y };
};

module.exports = io => {
  io.sockets.on("connection", socket => {
    console.log(`Player [${socket.id}] Connected!`);
    
    socket.on("new player", player => {
      PLAYERS[player.id] = player;
      for (let i in PLAYERS) {
        const player = PLAYERS[i];
        io.emit("add player", player);
      }
    });

    socket.on("update player", player => {
      io.emit("update player", player);
    });

    socket.on("disconnect", () => {
      io.emit("delete player", socket.id);
      console.log(`Player [${socket.id}] Disconnected...`);
      delete PLAYERS[socket.id];
    });
  });
};
