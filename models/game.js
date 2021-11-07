const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;
const { v4: uuidv4 } = require('uuid');

const GameTypeSubSchema = new Schema({
    gameType: { type: Schema.Types.ObjectId, required:true, ref: 'GameType'},
    start_time: { type: Date, required: true, default: new Date()},
    end_time: { type: Date }
});

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
    numberOfCardsAllowed: { type: Number, required: true, default: 3 },
    gameTypeHistory: { type: Array, of: GameTypeSubSchema },
    freeSpaceAllowed: {type: Boolean, required: true, default: true},
    gameManagers: { type: Array },
    prizeManagers: { type: Array },
    players: { type: Array, of: PlayerSubSchema }
});

const Game = Model("Game", GameSchema);

module.exports = Game;