const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model; 

const StagedCardsSchema = new Schema({
    gameRoom: { type: Schema.Types.ObjectId, required: true, ref: 'GameRoom'},
    player: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    cards: { type: Array, of: Schema.Types.ObjectId, required: true, ref: 'Card'}
});

const StagedCards = Model("StagedCards", StagedCardsSchema);

module.exports = StagedCards;