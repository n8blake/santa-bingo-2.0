const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;
const { v4: uuidv4 } = require('uuid');

const GameSchema = new Schema({
    start_time: { type: Date },
    end_time: { type: Date },
    numbers: { type: Array },
    uuid: { type: String, required: true, default: uuidv4 },
    creator: { type: String },
    name: { type: String, required: true },
    code: { type: String },
    gameManagers: { type: Array },
    prizeManagers: { type: Array },
    players: { type: Array }
});

const Game = Model("Game", GameSchema);

module.exports = Game;