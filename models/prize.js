const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const PrizeSchema = new Schema({
    prizeName: { type: String, required: true },
    prizeUrl: { type: String },
    prizeImageUrl: { type: String }
})

const Prize = Model("Prize", PrizeSchema);

module.exports = Prize;
