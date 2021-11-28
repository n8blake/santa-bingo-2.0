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

CardSchema.methods.getRow = function(rowIndex){
    const row = [];
    for(let i = 0; i < 5; i++){
        row.push(this[`column_${i}`][rowIndex]);
    }
    return row;
}

CardSchema.methods.getDiagonal = function(diagIndex){
    const diag = [];
    for(let i = 0; i < 5; i++){
        if(diagIndex === 0){
            diag.push(this[`column_${i}`][i]);
        } else {
            diag.push(this[`column_${i}`][4 - i]);
        }
    }
    return diag;
}

const Card = Model("Card", CardSchema);

module.exports = Card;