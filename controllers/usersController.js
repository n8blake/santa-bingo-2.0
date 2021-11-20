const { User } = require("../models");
const isEqual = require('lodash.isequal');

module.exports = {
    findAll: function (request, response){
        User.find({}, '-created -__v -password')
            .then(dbModel => {
                response.json(dbModel)
            })
            .catch(error => response.status(422).json(error));
    },
    findById: function(request, response){
        User.findOne({_id: request.params.id}, '-created -__v -password')
            .then(user => {
                if(user){
                    response.json(user);
                } else {
                    response.status(404).json("User not found");
                }
            })
            .catch(error => {
                response.status(400).send("Bad request");
        })
    },
    update: function (request, response) {
        User.findOne({ _id: request.params.id })
            .then(user => {
                console.log(request.user._id);
                console.log(user._id);
                console.log(isEqual(user._id, request.user._id));
                if(request.user.role === 'admin' || isEqual(user._id, request.user._id)){
                    User.updateOne({_id: request.params.id}, request.body)
                        .then(dbResult => response.json(dbResult))
                        .catch(error => response.status(422).json(error))
                } else {
                    response.status(403).send("unauthorize");
                }
            })
            .catch(error => response.status(422).json(error));
    }
}
