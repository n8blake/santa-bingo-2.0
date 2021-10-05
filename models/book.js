const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Model = mongoose.model;

const BookSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    link: { type: String },
    image: { type: String },
    authors: { type: Array },
    color: {type: String},
    googleBooksId: {type: String, required: true }
});

const Book = Model("Book", BookSchema);

module.exports = Book;