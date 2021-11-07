const mongoose = require("mongoose");
const db = require("../models");
const GameRoom = db.GameRoom;
const PlayerMark = db.PlayerMark;
//const Card = db.Card;
const Game = db.Game;

//const { v4: uuidv4 } = require('uuid');
const isEqual = require('lodash.isequal');

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
const checkForWin = require('../utils/checkForWin');

const seed = async () => {

    console.log("\n\tseeding database... \n");

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
    //console.log(room);
    room.roomName ? console.log(`${room.roomName} created.`) : () => {
        console.error("No room created");
        process.exit(1);
    };

    // Have Users 2, 3 and 4 Join the game room    
    const addUser2 = await addPlayerToRoom(room._id, users[1]._id);
    const addUser3 = await addPlayerToRoom(room._id, users[2]._id);
    const addUser4 = await addPlayerToRoom(room._id, users[3]._id);

    room = await GameRoom.findOne({ _id: room._id });
    room.players.length ? console.log(`${room.players.length} players added to ${room.roomName}.`) : () => {
        console.error("No players added.");
        process.exit(1);
    };

    let game = await GamePlayer.clearAllGames();
    // start the game of type 'bingo' and 3 cards per user
    // select 3 random cards from each users' cards list for this game
    game = await GamePlayer.startNewGame(room);
    game.inGame ? console.log(`Game started.\n`) : () => {
        console.error("GamePlayer error");
        //console.log(game);
        process.exit(1);
    };

    // call number
    //let gameUpdate = await GamePlayer.callNumber(game);
    // mark for each user that number being called
    //const round1Marks = await GamePlayer.markCards(game);
    
    // until a user gets Bingo...
    // once a user gets bingo
    // end the game

    let round = 0;
    let playerWon = false;
    while(round < 76 && !playerWon){
        try {

            // call a number
            let populatedGame;
            if(round === 0){
                populatedGame = await GamePlayer.getPopulatedGame(game);
            } else {
                populatedGame = await GamePlayer.callNumber(game);
            }
            const number = populatedGame.numbers[populatedGame.numbers.length - 1].number;
            
            // mark for each user that number being called
            const playersAsyncArray = populatedGame.players.map(async (player) => {
                const playerCardsAsyncArray = player.cards.map(async (card) => {
                    await GamePlayer.markCardForPlayer(game, player.player, card, number);
                    
                    // get the marks for a give card
                    const marks = await PlayerMark.find({card: card._id})
                                        .populate('player')
                                        .populate('card')
                                        .populate({
                                            path: 'game',
                                            model: 'Game',
                                            populate: { 
                                                path: 'gameTypeHistory',
                                                populate: { path: 'gameType', 
                                                            model: 'GameType'}
                                            }
                                        });
                    // console.log('\x1b[33m%s\x1b[0m', `CARD ID: ${card._id}`); 
                    // marks.map(mark => {
                    //     console.log('\x1b[36m%s\x1b[0m', `MARK CARD ID: ${mark.card._id}`);
                    //     if(!isEqual(card._id, mark.card._id)){
                    //         console.log(mark.card._id);
                    //         console.log(card._id);
                    //         console.log('\x1b[31m%s\x1b[0m', 'missmatch')
                    //     } else {
                    //         console.log('\x1b[32m%s\x1b[0m', 'match')
                    //     }
                    // })
                    const currentGameType = populatedGame.gameTypeHistory[populatedGame.gameTypeHistory.length - 1].gameType.type;
                    const check = checkForWin(currentGameType, card, marks);
                    if(check.win){
                        console.log('\x1b[32m%s\x1b[0m', `\n${currentGameType}`);
                        console.log(`${player.player.firstName} ${player.player.lastName} got ${currentGameType} on Card: ${card._id}`)
                        const printCardResults = false;
                        if(printCardResults){
                            for(let i = 0; i < check.columns.length; i++){
                                if(check.columns[i]){
                                    console.log(`in column: ${i}`)
                                }
                            }
                            for(let i = 0; i < check.rows.length; i++){
                                if(check.rows[i]){
                                    console.log(`on row: ${i}`)
                                }
                            }
                            for(let i = 0; i < check.diagonals.length; i++){
                                if(check.diagonals[i]){
                                    console.log(`on diagonals: ${i}`)
                                }
                            }
                        }
                        //playerWon = true;
                    }
                })
                Promise.all(playerCardsAsyncArray)
                    .then(() => {})
                    .catch( error => {
                        console.error('\x1b[31m%s\x1b[0m', error);
                    })
            })
            Promise.all(playersAsyncArray)
                .then(() => {})
                .catch( error => {
                    console.error('\x1b[31m%s\x1b[0m', error);
                })

            // check for a win base on current game type
            
            if(round % 5 === 0 ){
                console.log(`Round ${round}`);
                //logGameStatus(game, 'numbers');
            }
            
            if(round === 75){
                console.log(`${populatedGame.numbers.length} numbers called.`);
            }
        } catch (error){
            console.error(error);
        }
            //await GamePlayer.markCards(game);
        round = round + 1;
    }

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