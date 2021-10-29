const GameStatusHandler = require("./gameStatusHandler");

module.exports = (io, socket) => {
    GameStatusHandler(io, socket);
}
