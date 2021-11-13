const { GameRoom, User } = require('../models');

module.exports = {
    findAll: function(request, response){
        if(!request.session.token) response.status(401).send();
        GameRoom.find({})
            .then(dbModel => {
                response.json(dbModel);
            })
            .catch(error => {
                response.status(422).json(error);
            })
    },
    find: function(request, response){
        if(!request.session.token) response.status(401).send();
        GameRoom.findOne({uuid: request.params.id})
            .then(dbModel => {
                response.json(dbModel);
            })
            .catch(error => {
                response.status(422).json(error);
            })
    },
    create: function(request, response){
        GameRoom.create(request.body)
        .then(dbModel => {
            response.json(dbModel);
        })
        .catch(error => {
            response.status(422).json(error);
        })
    }
}