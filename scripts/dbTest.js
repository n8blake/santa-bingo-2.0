const mongoose = require("mongoose");
const db = require("../models");
const GameRoom = db.GameRoom;
const PlayerMark = db.PlayerMark;
//const Card = db.Card;
const Game = db.Game;

//const { v4: uuidv4 } = require('uuid');
const isEqual = require('lodash.isequal');
const chalk = require('chalk');

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
const recordUniqueWin = require("./recordUniqueWin");
const { printCard } = require("../utils/CardGenerator");

const seed = async () => {

    let resolveReturn = function(val){
        console.log(chalk.green('resolved'));
        return val;
    };
    let rejectReturn = function(val){
        console.log(chalk.red('rejected'));
        return val;
    };;
    let returnPromise;
    // let returnPromise = new Promise((resolveReturn, rejectReturn) => {

    // });

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
    game = await GamePlayer.startNewGame(room, 'bingo');
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
    let winCount = 0;
    returnPromise = new Promise(async (resolveReturn, rejectReturn) => {
    while(round < 76 && winCount < 3){
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
                    const marks = await PlayerMark.find({card: card._id, player:player.player._id, game: game._id})
                                        //.populate('player')
                                        //.populate('card')
                                        // .populate({
                                        //     path: 'game',
                                        //     model: 'Game',
                                        //     populate: { 
                                        //         path: 'gameTypeHistory',
                                        //         populate: { path: 'gameType', 
                                        //                     model: 'GameType'}
                                        //     }
                                        // });

                    const currentGameType = populatedGame.gameTypeHistory[populatedGame.gameTypeHistory.length - 1].gameType;
                    const check = checkForWin(currentGameType, card, marks);
                    
                    //const record = await recordUniqueWin(check, card, player.player, game);
                    recordUniqueWin(check, card, player.player, game).then((record) => {
                        //console.log(record);
                        if(record){
                            console.log(chalk.keyword('orange')('recorded'));
                            console.log(record);
                            playerWon = true;
                            winCount++;
                            const calledNumbers = populatedGame.numbers.map(calledNumber => {
                                return calledNumber.number;
                            }).sort(function(a, b) {
                                return a - b;
                            });
                            console.log(chalk.cyan(`${calledNumbers.length} Numbers Called:`));
                            console.log(chalk.yellow(calledNumbers));
                            console.log(chalk.bgGreen(" " + chalk.black(currentGameType.type) + " "));
                            console.log(`${player.player.firstName} ${player.player.lastName} got ${currentGameType.type} on Card: ${card._id}`);
                            printCard(card, marks);
                            console.log();
                        }
                    })
                    .catch(error => {
                        console.error(chalk.red(error));
                    })
                    
                         

                    
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
            console.error(chalk.red(error));
            rejectReturn();
        }
            //await GamePlayer.markCards(game);
        round = round + 1;
    }
    resolveReturn('done');
    

    });
    return returnPromise;
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
    console.log(result);
    process.exit(0);
})
.catch(error => {
    console.error('\x1b[31m%s\x1b[0m', error);
    process.exit(1);
});