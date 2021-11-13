const db = require("../models");
const Game = db.Game;
const GameType = db.GameType;
const Card = db.Card;
const PlayerMark = db.PlayerMark;
const Win = db.Win;
const randomInt = require('../utils/randomInt');

module.exports = {
    clearAllGames: async function(){
        // clear old marks
        await PlayerMark.deleteMany({});
        // clear old wins
        await Win.deleteMany({});
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
            path: 'players',
            populate: { path: 'cards',
                        select: '-created -__v', 
                        model: 'Card' }
        })
        .populate({
            path: 'gameTypeHistory',
            populate: { path: 'gameType', 
                        model: 'GameType'}
        })
        return populatedGame;
    },
    startNewGame: async function(room, gameType){
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

        let _type = 'bingo';
        if(gameType){
            _type = gameType;
        }
        
        const type = await GameType.findOne({type: _type});
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
        
        function nextNumber() {
            const _nextNumber = randomInt(1, 76);
            if(calledNumbers.indexOf(_nextNumber) === -1){
                return _nextNumber;
            } else {
                return nextNumber();
            }
        }
        const number = nextNumber();

        const nextNumberObject = {
            number: number
        }

        _game.numbers.push(nextNumberObject);
        //return number;
        return Game.findOneAndUpdate({_id: _game._id}, _game, {returnDocument: 'after'})
                .then(() => {
                    return this.getPopulatedGame(_game);
                })
                .catch(error => { return error });
    },
    markCardForPlayer: async function(game, player, card, number){
        const playersMarks = await PlayerMark.find({player: player._id, card: card._id, game: game._id});
        // Number is valid if: 
        // it is not already marked on the card...
        let markValidInPlayersMarksList = false;
        const marks = playersMarks.map(mark => {
            return mark.number;
        });
        if(marks.indexOf(number) === -1){
            markValidInPlayersMarksList = true;
        }

        // AND
        // it has been called in the game
        // get the game in its latest state
        const _game = await Game.findOne({_id: game._id});
        let markValidInGameNumberList = false;
        const gameNumbers = _game.numbers.map(numberObject => {
            return numberObject.number;
        })
        if(gameNumbers.indexOf(number) !== -1){
            markValidInGameNumberList = true;
        }

        // AND 
        // it appears on the card trying to be marked
        let markValidInCardNumbersList = false;
        let column;
        let row;
        if(number > 0 && number <= 15) {
            // check column 0
            if(card.column_0.indexOf(number) !== -1) {
                column = 0;
                row = card.column_0.indexOf(number);
                markValidInCardNumbersList = true
            };
        } else if(number >= 16 && number <= 30) {
            // check column 1
            if(card.column_1.indexOf(number) !== -1) {
                column = 1;
                row = card.column_1.indexOf(number);
                markValidInCardNumbersList = true
            };
        } else if(number >= 31 && number <= 45 || number === 0) {
            // check column 2
            if(card.column_2.indexOf(number) !== -1) {
                column = 2;
                row = card.column_2.indexOf(number);
                markValidInCardNumbersList = true
            };
        } else if(number >= 46 && number <= 60) {
            // check column 3
            if(card.column_3.indexOf(number) !== -1) {
                column = 3;
                row = card.column_3.indexOf(number);
                markValidInCardNumbersList = true
            };
        } else if(number >= 61 && number <= 75) {
            // check column 4
            if(card.column_4.indexOf(number) !== -1) {
                column = 4;
                row = card.column_4.indexOf(number);
                markValidInCardNumbersList = true
            };
        }

        if(markValidInPlayersMarksList && 
            markValidInGameNumberList && 
            markValidInCardNumbersList ){
            // Make new mark
            //console.log(`valid mark: ${number} for ${player.firstName} ${player.lastName} on card: ${card._id}`)
            const mark = {
                player: player._id,
                card: card._id,
                game: game._id,
                number: number,
                column: column,
                row: row
            }
            return PlayerMark.create(mark)
            // return PlayerMark.create(mark).then(() => {
            //         return PlayerMark.find({player: player._id, card: card._id, game: game._id})
            //                     .populate('player')
            //                     .populate('card')
            //                     .populate({
            //                         path: 'game',
            //                         model: 'Game',
            //                         populate: { 
            //                             path: 'gameTypeHistory',
            //                             populate: { path: 'gameType', 
            //                                         model: 'GameType'}
            //                         }
            //                     })

            //     })
            //     .catch(error => {return error});
        } else {
            //console.log(`invalid mark: ${number} for ${player.firstName} ${player.lastName} on card: ${card._id}`)
            return playersMarks;
            // return PlayerMark.find({player: player._id, card: card._id, game: game._id})
            //                     .populate('player')
            //                     .populate('card')
            //                     .populate({
            //                         path: 'game',
            //                         model: 'Game',
            //                         populate: { 
            //                             path: 'gameTypeHistory',
            //                             populate: { path: 'gameType', 
            //                                         model: 'GameType'}
            //                         }
            //                     })
        }
    }

};
