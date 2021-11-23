const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const GameTypeSubSchema = new Schema({
    gameType: { type: Schema.Types.ObjectId, required:true, ref: 'GameType'},
    start_time: { type: Date, required: true, default: new Date()},
    end_time: { type: Date }
});

const ManagerSubSchema = new Schema({
    manager: { type: Schema.Types.ObjectId, required: true, ref: 'User'},
    added: { type: Date, required: true, default: new Date()},
    removed: {type: Date}
})

const GameSettingsSchema = new Schema({
    gameManagers: { type: Array, of: ManagerSubSchema },
    prizeManagers: { type: Array, of: ManagerSubSchema },
    gameTypeHistory: { type: Array, of: GameTypeSubSchema, required: true },
    freeSpaceAllowed: {type: Boolean, required: true, default: true},
    numberOfCardsAllowed: { type: Number, required: true, default: 3 },
});

const GameSettings = Model("GameSettings", GameSettingsSchema);

module.exports = GameSettings; 