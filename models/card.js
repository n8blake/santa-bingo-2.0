const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;
const { v4: uuidv4 } = require('uuid');

const CardSchema = new Schema({
    player: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    column_0: { type: Array, of: Number, required: true },
    column_1: { type: Array, of: Number, required: true },
    column_2: { type: Array, of: Number, required: true },
    column_3: { type: Array, of: Number, required: true },
    column_4: { type: Array, of: Number, required: true },
    created: { type: Date, required: true, default: new Date() },
    active: { type: Boolean, require: true, default: true },
    uuid: { type: String, required: true, default: uuidv4, index: { unique: true }},
});

const Card = Model("Card", CardSchema);

module.exports = Card;