const { Card } = require("../models");
var ObjectId = require('mongoose').Types.ObjectId; 

module.exports = {
    findCardsByPlayerID: function (request, response) {
        if(!request.session.user) response.status(401).send()
        //if(!request.body.id) response.status(400).send();
        Card
            .find({player: request.session.user.email}).then(cards => {
                console.log(cards);
                response.json(cards);
            })
            .catch(error => response.status(422).json(error));
    }
}