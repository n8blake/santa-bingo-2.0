const { GameRoom } = require("../models");

const addPlayerToRoom = async function(gameRoomID, playerID) {
    return GameRoom.findOne({_id: gameRoomID})
        .then((room) => {
            const players = room.players;
            players.push(playerID);
            room.players = players;
            return GameRoom.updateOne({_id: gameRoomID}, room);
        })
        .catch(error => {
            return error;
        })
}

module.exports = addPlayerToRoom;