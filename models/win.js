const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const winDataIndexSubschema = {
    '0': {type: Array, of: Number },
    '1': {type: Array, of: Number },
    '2': {type: Array, of: Number },
    '3': {type: Array, of: Number },
    '4': {type: Array, of: Number },
}

const winDataSubschema = {
    columns: {type: winDataIndexSubschema },
    rows: {type: winDataIndexSubschema },
    diagonals: {type: winDataIndexSubschema },
}

const WinSchema = new Schema({
    player: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    card: { type: Schema.Types.ObjectId, required: true, ref: 'Card' },
    marks: [{ type: Schema.Types.ObjectId, required: true, ref: 'Mark' }], 
    game: { type: Schema.Types.ObjectId, required: true, ref: 'Game' },
    timestamp: { type: Date, required: true, default: new Date()}
});

const Win = Model("Win", WinSchema);

module.exports = Win;