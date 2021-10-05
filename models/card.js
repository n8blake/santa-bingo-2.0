const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const CardSchema = new Schema({
    player: { type: String, required: true },
    column_0: { type: Array, required: true },
    column_1: { type: Array, required: true },
    column_2: { type: Array, required: true },
    column_3: { type: Array, required: true },
    column_4: { type: Array, required: true },
});

const Card = Model("Card", CardSchema);

module.exports = Card;