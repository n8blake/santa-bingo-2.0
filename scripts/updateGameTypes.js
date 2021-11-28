const mongoose = require("mongoose");
const createGameTypes = require('./CreateGameTypes');

mongoose.connect(
    process.env.MONGODB_URI ||
    "mongodb://localhost/santa-bingo-n8blake"
);

createGameTypes().then(result => {
    process.exit(0);
})
.catch(error => {
    console.error(error);
    process.exit(1);
})