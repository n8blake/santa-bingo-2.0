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
        if(!request.session.token || !request.session.email) response.status(401).send();
        if(request.body.token !== request.session.token) response.status(401).send();
        User
            .find({email: request.body.email})
            .then(dbModel => {
                response.json(dbModel)
            })
            .catch(error => response.status(422).json(error));
    },
    findMe: function(request, response){
        console.log("session");
        console.log(request.session.token);
        if(!request.session.token || !request.session.email){
            response.status(401).send();
            return;
        } 
        User
            .find({email: request.session.email})
            .then(user => {
                response.json(user);
            })
            .catch(error => response.status(422).json(error));
    },
    findMePrivate: function(email){
        return User
            .findOne({email: email})
            .then(user => {
                return user;
            })
            .catch(error => {
                console.log(error)
            });
    },
    update: function (request, response) {
        if(!request.session.token) response.status(401).send();
        console.log("updating");
        console.log(request.body);
        User
            .updateOne({ _id: request.body.id }, request.body)
            .then(dbModel => response.json(dbModel))
            .catch(error => response.status(422).json(error));
    },
    create: function (request, response) {
        if(!request.session.token) response.status(401).send();
        console.log(request.body);
        if(request.session.email){
            const newUser = {
                firstName: request.body.firstName,
                lastName: request.body.lastName,
                color: request.body.color,
                displayName: request.body.displayName,
                email: request.session.email
            }
            User
                .create(newUser)
                .then(dbModel => response.json(dbModel))
                .catch(error => response.status(422).json(error));
        } else {
            response.status(422).json({message:"no email available"});
        }
        
    },
    createPrivate: function (user) {
        return User
            .create(user)
            .then(user => {
                return user;
            })
            .catch(error => console.log(error));
    }
}
