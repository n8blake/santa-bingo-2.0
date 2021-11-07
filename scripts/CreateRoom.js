const { GameRoom } = require("../models");

const createRoom = async function(creatorID, roomName) {
    return GameRoom.deleteMany({})
        .then(() => {
            const room = {
                roomName: roomName,
                creator: creatorID
            }
            return GameRoom.create(room);
        })
        .catch(error => {
            return error;
        })
}

module.exports = createRoom;