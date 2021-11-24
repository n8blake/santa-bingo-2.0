const { Mark, Game, Card } = require('../models');
const isEqual = require('lodash.isequal')
module.exports = {
    getMarks: function(request, response){
        // get marks from query string
        if(request.query){
            const findQuery = {}
            if(request.query.game){
                findQuery.game = request.query.game;
            }
            if(request.query.player){
                findQuery.player = request.query.player;
            }
            if(request.query.card){
                findQuery.card = request.query.card;
            }
            Mark.find(findQuery).then(marks => {
                if(marks && marks.length > 0){
                    response.json(marks);
                } else {
                    response.status(404).send('No marks found');
                }
            })
        } else {
            response.status(404).send('No results found.')
        }
    },
    createMark: function(request, response){
        if(request.body && request.body.card && request.body.player && request.body.game && request.body.number){
            Mark.findOne({game: request.body.game, player: request.body.player, card: request.body.card, number: request.body.number})
                .then(mark => {
                    if(mark && mark.number) {
                        response.status(200).json(mark);
                    } else {
                        Game.findOne({_id: request.body.game, inGame: true}).then(game => {
                            if(game && game.players){
                                if(game.players.length > 0){
                                    // player in game
                                    let playerInGame = false;
                                    let cardInGame = false;
                                    console.log(game.players);
                                    for(let i = 0; i < game.players.length; i++){
                                        //console.log(game.players[i].player.toString())
                                        //console.log(request.user._id)
                                        if(isEqual(game.players[i].player, request.user._id)){
                                            console.log('player indeed in game');
                                            playerInGame = true;
                                        }
                                        if(playerInGame){
                                            //console.log(game.players[i].cards)
                                            for(let j = 0; j < game.players[i].cards.length; j++){
                                                console.log(game.players[i].cards[j]);
                                                if(game.players[i].cards[j].toString() === request.body.card){
                                                    cardInGame = true;
                                                }
                                            }
                                        }
                                    }
                                    if(playerInGame && cardInGame){
                                        Card.findOne({_id: request.body.card}).then(card => {
                                            const newMark = {};
                                            newMark.game = request.body.game;
                                            newMark.player = request.body.player;
                                            newMark.card = request.body.card;
                                            newMark.number = request.body.number;
                                            for(let i = 0; i < 5; i ++) {
                                                const rowIndex = card[`column_${i}`].indexOf(newMark.number);
                                                if(rowIndex > -1){
                                                    newMark.row = rowIndex;
                                                    newMark.column = i;
                                                }
                                            }
                                            if(newMark.row && newMark.column){
                                                Mark.create(newMark).then(mark => {
                                                    response.json(mark);
                                                })
                                                .catch(error => response.status(422).json(error))
                                            } else {
                                                response.status(400).send('Number not on card');
                                            }
                                        })
                                    } else {
                                        response.status(403).send('Unauthorized. Player not in game.');
                                    }
                                }
                            } else {
                                response.status(400).json('No game found');
                            }
                        })
                        .catch(error => response.status(422).json(error))
                    }
                })
                .catch(error => {
                    console.log(error)
                    response.status(422).json(error)
                })
            
        } else {
            response.status(400).send('Bad request.');
        }
    }, 
    removeMark: function(request, response){
        Mark.findOne({_id: request.params.id, locked: false}).then(mark => {
            if(mark.player === request.user._id || request.user.role === 'admin'){
                Mark.deleteOne({_id: request.params.id}).then(dbResponse =>{
                    response.json(dbResponse);
                })
                .catch(error => response.status(422).json(error))
            } else {
                response.status(403).send('Unauthorized');
            }
        })
    }  
}