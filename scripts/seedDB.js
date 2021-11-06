const mongoose = require("mongoose");
const db = require("../models");
//const User = db.User;
const Card = db.Card;
const Game = db.Game;
const { v4: uuidv4 } = require('uuid');

mongoose.connect(
    process.env.MONGODB_URI ||
    "mongodb://localhost/santa-bingo-n8blake"
);

const createUsers = require('./CreateUsers');
const createCards = require('./CreateCards');

const seed = async function(){

    // Create New Users
    const users = await createUsers();
    users.length ? console.log(`${users.length} users created`) : () => {
        console.error("No users created");
        process.exit(1);
    };

    const cards = await createCards(users);
    cards.length ? console.log(`${cards.length} cards created`) : () => {
        console.error("No cards created");
        process.exit(1);
    };

}

seed().then(result => {
    //console.log(result);
    process.exit(0);
});

// Give Each user 3 - 5 cards
// const { generateCard } = require('../utils/CardGenerator')
// const generateCards = function(users){
    
// }


// Have User 1 Create a Game room
    // 3 cards per user

// Have Users 2 and 3 Join the game room
    // select 3 random cards from each users' cards list for this game

// start the game
    // until a user gets Bingo...
        // call number
        // mark for each user that number being called
        // check for bingo
    // once a user gets bingo
// end the game

// save the game history

//process.exit(0);