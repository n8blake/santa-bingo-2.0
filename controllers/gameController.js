const { Game, GameRoom, StagedCards } = require('../models');
const isEqual = require('lodash.isequal');

module.exports = {
    findById: function(request, response){
        Game.findOne({_id: request.params.id}).then(game => {
            response.send(game);
        }).catch(error => response.status(422).json(error))
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
                    // const stagedCardsQuery = gameRoom.players.map((player) => {
                    //     return {
                    //         player: player,
                    //         gameRoom: gameRoom._id
                    //     }
                    // });
                    //console.log({$in: stagedCardsQuery});
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
    },
    callNextNumber: function(request, response){
        // call the next number in a game
    },

    
}