const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const GameTypeSchema = new Schema({
    type: { type: String, required: true, default: 'bingo'},
    // define win conditions
    columns: {type: Array, of: Number },
    rows: {type: Array, of: Number },
    diagonals: {type: Array, of: Number },
    operator: {type: String, required: true}
});

const GameType = Model("GameType", GameTypeSchema);

module.exports = GameType;