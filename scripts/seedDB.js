const mongoose = require("mongoose");
const db = require("../models");
const GameRoom = db.GameRoom;
//const User = db.User;
//const Card = db.Card;
const Game = db.Game;
//const { v4: uuidv4 } = require('uuid');

mongoose.connect(
    process.env.MONGODB_URI ||
    "mongodb://localhost/santa-bingo-n8blake", {useNewUrlParser: true, useUnifiedTopology: true}
);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

const createGameTypes = require('./CreateGameTypes');
const createUsers = require('./CreateUsers');
const createCards = require('./CreateCards');
const createRoom = require('./CreateRoom');
const addPlayerToRoom = require('./AddPlayerToRoom');
const GamePlayer = require('./PlayGame');

const seed = async function(){

    console.log("\n\tseeding database... \n")

    const gameTypes = await createGameTypes();
    gameTypes.length ? console.log(`${gameTypes.length} game types created.`) : () => {
        console.error("No game types created");
        process.exit(1);
    };

    // Create New Users
    const users = await createUsers();
    users.length ? console.log(`${users.length} users created.`) : () => {
        console.error("No users created");
        process.exit(1);
    };

    // Give Each user 3 - 5 cards
    const cards = await createCards(users);
    cards.length ? console.log(`${cards.length} cards created.`) : () => {
        console.error("No cards created");
        process.exit(1);
    };

    // Have User 1 Create a Game room
    const creatorID = users[0]._id;
    const roomName = `${users[0].firstName}'s Game`;
    let room = await createRoom(creatorID, roomName);
    console.log(room);
    room.roomName ? console.log(`${room.roomName} created.`) : () => {
        console.error("No room created");
        process.exit(1);
    }

    // Have Users 2, 3 and 4 Join the game room    
    const addUser2 = await addPlayerToRoom(room._id, users[1]._id);
    const addUser3 = await addPlayerToRoom(room._id, users[2]._id);
    const addUser4 = await addPlayerToRoom(room._id, users[3]._id);

    room = await GameRoom.findOne({_id: room._id});
    room.players.length ? console.log(`${room.players.length} players added to ${room.roomName}.`) : () => {
        console.error("No players added.");
        process.exit(1);
    }

    let game = await GamePlayer.clearAllGames();
    // start the game of type 'bingo' and 3 cards per user
    // select 3 random cards from each users' cards list for this game
    game = await GamePlayer.startNewGame(room);
    game.inGame ? console.log(`Game started.\n`) : () => {
        console.error("GamePlayer error");
        //console.log(game);
        process.exit(1);
    } 

    // output first populated game object
    await logGameStatus(game, 'players');

    // until a user gets Bingo...
        // call number
    let gameUpdate = await GamePlayer.callNumber(game);
    console.log(`Game updated.`);
    await logGameStatus(game, 'numbers');
        // mark for each user that number being called
        // check for bingo
    // once a user gets bingo
    // end the game

    // save the game history

}

const logGameStatus = async (game, property) => {
    const populatedGame = await GamePlayer.getPopulatedGame(game);
    
    if(property) {
        console.log('\x1b[33m%s\x1b[0m', `\n ${property} Status\n`);
        console.log('\x1b[36m%s\x1b[0m', JSON.stringify(populatedGame[property], null, 1));
    } else {
        console.log('\x1b[33m%s\x1b[0m', "\n Game Status\n");
        console.log(JSON.stringify(populatedGame, null, 1));
    };
    
    return populatedGame;
}

seed().then(result => {
    //console.log(result);
    process.exit(0);
})
.catch(error => {
    console.error('\x1b[31m%s\x1b[0m', error);
    process.exit(1);
});