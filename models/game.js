const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const GameSchema = new Schema({
    start_time: { type: Date, required: true },
    end_time: { type: Date },
    numbers: { type: Array }
});

const Game = Model("Game", GameSchema);

module.exports = Game;