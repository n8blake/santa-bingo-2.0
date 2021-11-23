const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;
const { v4: uuidv4 } = require('uuid');

const CalledNumberSubSchema = new Schema({
    number: { type: Number, required: true },
    timestamp: { type: Date, required: true, default: new Date()}
})

const PlayerSubSchema = new Schema({
    player: { type: Schema.Types.ObjectId, required: true, ref: 'User'},
    joined: { type: Date, required: true, default: new Date()},
    left: {type: Date},
    cards: [{type: Schema.Types.ObjectId, required: true, ref: 'Card'}]
})

const GameSchema = new Schema({
    start_time: { type: Date, required: true, default: new Date() },
    end_time: { type: Date },
    inGame: { type: Boolean, required: true, default: false},
    numbers: { type: Array, of: CalledNumberSubSchema },
    uuid: { type: String, required: true, default: uuidv4 },
    creator: { type: Schema.Types.ObjectId, required:true, ref: 'User' },
    name: { type: String },
    code: { type: String },
    gameSettings: { type: Schema.Types.ObjectId, required: true, ref: 'GameSettingsSchema'},
    players: { type: Array, of: PlayerSubSchema }
});

const Game = Model("Game", GameSchema);

module.exports = Game;