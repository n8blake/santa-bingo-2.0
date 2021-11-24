const { Game, GameRoom, StagedCards } = require('../models');
const isEqual = require('lodash.isequal');
const randomInt = require('../utils/randomInt');

module.exports = {
    findById: function(request, response){
        Game.findOne({_id: request.params.id})
            .populate({
                path: 'players',
                populate: {
                    path: 'player',
                    select: '-email -password -created -__v', 
                    model: 'User' 
                } 
            })
            .populate({
                path: 'creator',
                select: '-email -password -created -__v', 
                model: 'User'
            })
            .populate({
                path:'settings',
                populate: [{
                    path: 'gameManagers',
                    populate: {
                        path: 'manager',
                        select: '-email -password -created -__v', 
                        model: 'User' 
                    }
                },
                {
                    path: 'prizeManagers',
                    populate: {
                        path: 'manager',
                        select: '-email -password -created -__v', 
                        model: 'User' 
                    }
                },
                {
                    path: 'gameTypeHistory',
                    populate: {
                        path: 'gameType',
                        select: 'type',
                        model: 'GameType'
                    }
                }
            ]
            })
            .then(game => {
                response.send(game);
            }).catch(error => {
                console.log(error);
                response.status(422).json(error)
            })
    },
    update: function(request, response){
        Game.findOne({_id: request.params.id}).then(game => {
            if(game){
                // TO DO: add method for checking if a user is a 'game manager' to allow access to update game.
                if(request.user.role === 'admin' || isEqual(game.creator, request.user._id)){
                    Game.updateOne({_id: request.params.id}, request.body)
                        .then(dbResult => response.json(dbResult))
                        .catch(error => response.status(422).json(error));
                } else {
                    response.status(403).send('You are not permitted to modify this resource.');
                }
            } else {   
                response.status(404).send("gameroom not found")
            }
        })
    },
    startNewGame: function(request, response){
        // start a new game
        if(request.body && request.body.gameRoom){
            GameRoom.findOne({_id: request.body.gameRoom}).then((gameRoom) => {
                if(gameRoom && gameRoom.players.length > 0){
                    console.log('starting game creation...')
                    // run preliminary checks
                    if(gameRoom.inGame){
                        response.status(403).send('Game already in progress');
                    } else {
                        Game.find({_id: { $in: gameRoom.game}}).then(games => {
                            games.map(game => {
                                if(!game.end_time){
                                    response.status(403).send('Game already in progress');
                                }
                            })
                            StagedCards.find({gameRoom: gameRoom._id}).then(stagedCardsArray => {
                                console.log(stagedCardsArray);
                                const newGame = {};
                                newGame.settings = gameRoom.settings;
                                newGame.numbers = [{number: 0}];
                                newGame.creator = request.user._id;
                                newGame.players = stagedCardsArray.map(stagedCards => {
                                    return {
                                        player: stagedCards.player,
                                        cards: stagedCards.cards
                                    }
                                });
                                Game.create(newGame).then(game => {
                                    console.log(game)
                                    gameRoom.inGame = true;
                                    if(gameRoom.games && gameRoom.games.length > 0){
                                        gameRoom.games.push(game._id);
                                    } else {
                                        gameRoom.games = [game._id];
                                    }
                                    gameRoom.save().then(saveResposne => {
                                        Game.findOne({_id: game._id}).then(populatedGame => {
                                            // TO DO:  EMIT EVENT
                                            // emit to room populatedGame
                                            if(populatedGame){
                                                response.json(populatedGame);
                                            } else {
                                                response.status(400).send('Error populating game');
                                            }
                                        })
                                    })  
                                    .catch(error => response.status(400).json(error))
                                })
                                .catch(error => response.status(422).json(error));
                            });
                        })
                        .catch(error => {
                            console.log(error);
                            response.status(422).json(error);
                        })
                    }
                } else {
                    response.status(400).send('Error creating game in gameroom');
                }
            })
            .catch(error => response.status(422).json(error));
        } else {
            response.status(400).send('Bad request');
        }
    },
    endGame: function(request, response){
        // end a game
        if(request.body.gameRoom){
            GameRoom.findOne({_id: request.body.gameRoom}).then(gameRoom => {
                if(gameRoom.games && gameRoom.games.length > 0) {
                    let gameInRoom = false;
                    for(let i = 0; i < gameRoom.games.length; i++){
                        if(isEqual(gameRoom.games[i].toString(), request.params.id)){
                            gameInRoom = true;
                        }
                    }
                    if(gameInRoom){
                        Game.findOne({_id: request.params.id}).then(game => {
                            game.end_time = new Date();
                            game.inGame = false;
                            game.save().then(() => {
                                gameRoom.inGame = false;
                                gameRoom.save().then(() => {
                                    response.status(200).send('game ended');
                                })
                                .catch(error => response.status(422).json(error))
                            })
                            .catch(error => response.status(422).json(error))
                        })
                    } else {
                        response.status(400).send('Game not in room');
                    }
                } else {
                    response.status(400).send('No games in room');
                }
            })
            .catch(error => {
                console.log(error);
                response.status(422).json(error);
            })
        } else {
            response.status(400).send('Bad request');
        }
        
    },
    callNextNumber: function(request, response){
        // call the next number in a game
        Game.findOne({_id: request.params.id}).then(game => {
            if(game && !game.inGame){
                response.status(403).send('Game is not active.');
            } else if(game && game.numbers){
                const calledNumbers = game.numbers.map(numberObject => {
                    return numberObject.number;
                })
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
                game.numbers.push(nextNumberObject);
                game.save().then(() => {
                    // TO DO: EMIT EVENT
                    // Emit new number called event
                    Game.findOne({_id: request.params.id})
                        .populate({
                            path: 'players',
                            populate: {
                                path: 'player',
                                select: '-email -password -created -__v', 
                                model: 'User' 
                            }
                        })
                        .populate({
                            path: 'creator',
                            select: '-email -password -created -__v', 
                            model: 'User'
                        })
                        .populate({
                            path:'settings',
                            populate: [{
                                path: 'gameManagers',
                                populate: {
                                    path: 'manager',
                                    select: '-email -password -created -__v', 
                                    model: 'User' 
                                }
                            },
                            {
                                path: 'prizeManagers',
                                populate: {
                                    path: 'manager',
                                    select: '-email -password -created -__v', 
                                    model: 'User' 
                                }
                            },
                            {
                                path: 'gameTypeHistory',
                                populate: {
                                    path: 'gameType',
                                    select: 'type',
                                    model: 'GameType'
                                }
                            }
                        ]
                        })
                        .then(game => {
                            response.send(game);
                        }).catch(error => {
                            console.log(error);
                            response.status(422).json(error)
                        })
                })
                .catch(error => {
                    console.log(error);
                    response.status(422).json(error)
                })
            } else {
                response.status(404).send('Game not found.')
            }
        })
        .catch(error => {
            response.status(422).json(error);
        })
    },

    
}