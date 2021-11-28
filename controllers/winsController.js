const { Win, Game, Card, Mark } = require('../models');
const checkForWin = require('../utils/checkForWin');
const { printCard } = require('../utils/CardGenerator');
const compare = require('../utils/Compare');

module.exports = {
    find: function(request, resonse){
        if(request.query){
            const findQuery = {};
            if(request.query.game){
                findQuery.game = request.query.game;
            }
            if(request.query.player){
                findQuery.player = request.query.player;
            }
            if(request.query.card){
                findQuery.card = request.query.card;
            }
            if(request.query.marks){
                findQuery.marks = request.query.marks;
            }
            Win.find(findQuery).then(wins => {
                if(wins && wins.length > 0){
                    response.json(wins);
                } else {
                    response.status(404).send('No results found');
                }
            })
        } else {
            response.status(404).send('No results');
        }
    },
    findById: function(request, response){
        Wins.findOne({_id: request.params.id}).then(win => {
            if(win){
                response.json(win)
            } else {
                response.status(404);
            }
        })
        .catch(error => response.status(422).json(error));
    },
    checkAndRecordIfWon: function(request, response){
        // checkForWin requires gameType, card, marks
        // Remember: a 200 is a valid response for 
        // a non-win state
        console.log("Checking for win...");
        if( request.body && 
            request.body.game && 
            request.body.marks && 
            request.body.marks.length > 0 && 
            request.body.card ){
            // get the game type...
            Game.findOne({_id: request.body.game, inGame: true})
                .populate({
                    path: 'settings',
                    model: 'GameSettings',
                    populate: {
                        path: 'currentGameType',
                        model: 'GameType'
                    }
                })
                .populate('numbers')
                .then(game => {
                    if(game){
                        // In game history settings
                        // get the current game type
                        //console.log(game);
                        //console.log(game.settings.currentGameType);
                        const gameType = game.settings.currentGameType;
                        const gameNumbers = game.numbers.map(numberObj => {
                            return numberObj.number;
                        })
                        if(gameType){
                            Card.findOne({_id: request.body.card}).then(card => {
                                if(card){
                                    Mark.find().where('_id').in(request.body.marks).exec((error, marks) => {
                                        if(error){
                                            console.log(error);
                                            response.status(422).json(error);
                                        } else if(!marks){
                                            response.status(400).send('No mark retrieved');
                                        } else {
                                            printCard(card, marks);
                                            try {
                                                const check = checkForWin(gameType, gameNumbers, card, marks);
                                                if(check.win){
                                                    console.log('Win!');
                                                    // record a unique win
                                                    // 
                                                    // search for a wins in this game with this user...
                                                    Win.find({game: game._id, player: request.user._id, card: card._id}).then(wins => {
                                                        let uniqueWin = false;
                                                        if(wins && wins.length > 0){
                                                            for(let i = 0; i < wins.length; i++){
                                                                console.log(wins[i].marks);
                                                                console.log(request.body.marks);
                                                                if(compare(wins[i].marks, request.body.marks)){
                                                                    response.send("Win already recorded");
                                                                } else {
                                                                    uniqueWin = true;
                                                                }
                                                            }
                                                        } else {
                                                            uniqueWin = true;
                                                        }
                                                        if(uniqueWin){
                                                            const newWin = {};
                                                            newWin.player = request.user._id;
                                                            newWin.marks = request.body.marks;
                                                            newWin.card = request.body.card;
                                                            newWin.game = request.body.game;
                                                            console.log(newWin);
                                                            Win.create(newWin).then(result => {
                                                                // TO DO: EMIT EVENT
                                                                // EMIT WIN
                                                                response.json(result);
                                                            })
                                                            .catch(error => {
                                                                console.log(error);
                                                                response.status(422).json(error.message);
                                                            })
                                                        }
                                                    })
                                                    .catch(error => {
                                                        console.log(error);
                                                        response.status(422).json(error);
                                                    })
                                                    
                                                } else {
                                                    console.log('not a win');
                                                    response.json(check);
                                                }
                                            } catch(error){
                                                console.log(error);
                                                response.status(400).json(error.message);
                                            }
                                        }
                                    })
                                } else {
                                    response.status(400).send('No card found.')
                                }
                            })
                            .catch(error => {
                                console.log(error);
                                response.status(422).json(error)
                            })
                            
                        } else {
                            response.status(400).send('Game has no active game type.');
                        }
                    } else {
                        response.status(400).send('Game not found');
                    }
                })
                .catch(error => {
                    console.log(error);
                    response.status(422).json(error)
                })
        } else {
            console.log(request.body);
            response.status(400).send('Bad request');
        }
    } 
}