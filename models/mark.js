const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const MarkSchema = new Schema({
    player: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    card: { type: Schema.Types.ObjectId, required: true, ref: 'Card' },
    game: { type: Schema.Types.ObjectId, required: true, ref: 'Game' },
    locked: { type: Boolean, required: true, default: false },
    number: { type: Number, required: true },
    column: { type: Number, required: true },
    row: { type: Number, required: true },
    timestamp: { type: Date, required: true, default: new Date()}
});

const Mark = Model("Mark", MarkSchema);

module.exports = Mark;