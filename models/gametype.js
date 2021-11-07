const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const GameTypeSchema = new Schema({
    type: { type: String, required: true, default: 'bingo'},
});

const GameType = Model("GameType", GameTypeSchema);

module.exports = GameType;