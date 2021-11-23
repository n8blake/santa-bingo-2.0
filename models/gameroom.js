const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const GameRoomSchema = new Schema({
    inGame: { type: Boolean, required: true, default: false},
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    roomName: { type: String, required: true },
    code: { type: String },
    active: { type: Boolean, required: true, default: true },
    public: { type: Boolean, required: true, default: true },
    settings: { type: Schema.Types.ObjectId, required: true, ref: 'GameSettings'},
    players: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    games: [{type: Schema.Types.ObjectId, ref: 'Game'}]
});

const GameRoom = Model("GameRoom", GameRoomSchema);

module.exports = GameRoom;