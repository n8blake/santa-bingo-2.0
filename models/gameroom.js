const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;
//const Game = require("./game");
const { v4: uuidv4 } = require('uuid');

const GameRoomSchema = new Schema({
    inGame: { type: Boolean, required: true, default: false},
    uuid: { type: String, required: true, default: uuidv4 },
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    roomName: { type: String, required: true },
    code: { type: String },
    gameManagers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    prizeManagers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    players: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    games: [{type: Schema.Types.ObjectId, ref: 'Game'}]
});

const GameRoom = Model("GameRoom", GameRoomSchema);

module.exports = GameRoom;