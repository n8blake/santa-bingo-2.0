const db = require("../models");
const Game = db.Game;
const GameType = db.GameType;
const Card = db.Card;

const randomInt = require('../utils/randomInt');

module.exports = {
    clearAllGames: async function(){
        return Game.deleteMany({});
    },
    getPopulatedGame: async function(game) {
        const populatedGame = await Game.findOne({_id: game._id})
        .populate({ path: 'creator', select: '-email -created -__v'})
        .populate('numbers')
        .populate({
            path: 'players',
            populate: { path: 'player',
                        select: '-email -created -__v', 
                        model: 'User' }
        })
        .populate({
            path: 'gameTypeHistory',
            populate: { path: 'gameType', 
                        model: 'GameType'}
        })
        return populatedGame;
    },
    startNewGame: async function(room){
        const joinedPlayers = [];
        room.players.map(async (player) => {
            const cards = await Card.find({player: player._id, active: true}).select('_id').limit(3);
            //const cards = [];
            // cardObjects.map(card => {
            //     cards.push(card._id);
            // })
            const joinedPlayer = {
                joined: new Date(),
                player: player._id,
                cards: cards
            }
            joinedPlayers.push(joinedPlayer);
        })

        const type = await GameType.findOne({type: 'bingo'});
        const newGame = {
            start_time: new Date(),
            inGame: true,
            numbers: [{number: 0}],
            creator: room.creator,
            name: 'First Bingo game',
            code: 'A2BY0',
            numberOfCardsAllowed: 3,
            gameTypeHistory: [{gameType: type._id}],
            players: joinedPlayers,
        }
        return Game.create(newGame);
    },
    callNumber: async function(game){
        const _game = await Game.findOne({_id: game._id});
        // get list of numbers
        const calledNumbers = [];
        _game.numbers.map(numberObject => {
            calledNumbers.push(numberObject.number);
        });

        // call a random number that hasn't been called yet
        let nextNumber = randomInt(1, 75);
        while(calledNumbers.indexOf(nextNumber) > -1){
            nextNumber = randomInt(1, 75);
        }
        
        const nextNumberObject = {
            number: nextNumber
        }

        _game.numbers.push(nextNumberObject);

        return Game.findOneAndUpdate({_id: _game._id}, _game, {returnDocument: 'after'});

    }

};
