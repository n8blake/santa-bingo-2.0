const { Game, User } = require('../models');
module.exports = {
    findAll: function(request, response){
        if(!request.session.token) response.status(401).send();
        Game
            .find({})
            .then(dbModel => {
                response.json(dbModel);
            })
            .catch(error => {
                console.log(error);
                response.status(422).json(error);
            })       
    },
    // find by UUID
    find: function(request, response){
        if(request.params.id){
            Game
                .findOne({uuid: request.params.id})
                .then(game => {
                    // find players
                    const playerIds = game.players;
                    User.find({uuid: {$in: playerIds}})
                    .then(players => {
                        game.players = players;
                        response.json(game);
                    })
                    .catch(error => {
                        response.status(422).json(error);
                    })
                    //response.json(dbModel);
                })
                .catch(error => {
                    console.log(error);
                    response.status(422).json(error);
                })
        }
    },
    // create game
    create: function(request, response){
        if(!request.session.token) response.status(401).send();
        if(request.session.user){
            console.log("USER");
            console.log(request.session.user);
        }
        if(request.body.gameName){
            const newGame = {
                name: request.body.gameName,
                creator: request.session.user.uuid,
                players: [request.session.user.uuid],
                numbers: [0]
            }
            Game
                .create(newGame)
                .then(dbModel => {
                    console.log(dbModel);
                    response.json(dbModel);
                })
                .catch(error => response.status(422).json(error))
        }
    }
    // start game
    // end game
    // call a number
    // change game type ? 
    // check numbers agains card for win
    // 
}