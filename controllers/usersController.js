const { User } = require("../models");

module.exports = {
    findAll: function (request, response){
        if(!request.session.token) response.status(401).send();
        User
            .find({})
            .then(dbModel => {
                response.json(dbModel)
            })
            .catch(error => response.status(422).json(error));
    },
    findByEmail: function(request, response){
        if(!request.session.token || request.session.email) response.status(401).send();
        if(request.body.token !== request.session.token) response.status(401).send();
        User
            .find({email: request.body.email})
            .then(dbModel => {
                response.json(dbModel)
            })
            .catch(error => response.status(422).json(error));
    },
    findMe: function(request, response){
        if(!request.session.token || request.session.email) response.status(401).send();
        User
            .find({email: request.session.email})
            .then(dbModel => {
                response.json(dbModel)
            })
            .catch(error => response.status(422).json(error));
    }
}
