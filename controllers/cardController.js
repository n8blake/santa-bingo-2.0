const { Card } = require("../models");
var ObjectId = require('mongoose').Types.ObjectId; 

module.exports = {
    findCardsByPlayerID: function (request, response) {
        if(!request.session.token) response.status(401).send();
        if(request.body.id == ''){
            console.log("bad request");
            response.status(400).send();
        }
        console.log(request.body);
        //if(!request.body.id) response.status(400).send();
        Card
            .find({player: new ObjectId(request.body.id)}).then(cards => {
                console.log(cards);
                response.json(cards);
            })
            .catch(error => response.status(422).json(error));
    }
}