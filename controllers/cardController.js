const { Card } = require("../models");
//var ObjectId = require('mongoose').Types.ObjectId; 
const { generateCard } = require("../utils/CardGenerator");

module.exports = {
    findCardsByPlayerID: function (request, response) {
        if(!request.session.user) response.status(401).send();
        //if(!request.body.id) response.status(400).send();
        Card
            .find({player: request.session.user.uuid, active: true}).then(cards => {
                //console.log(request.session.user.uuid);
                //console.log(cards);
                response.json(cards);
            })
            .catch(error => response.status(422).json(error));
    },
    newCard: function(request, response){
        if(!request.session.user) response.status(401).send();
        const newCard = generateCard(request.session.user.uuid);
        newCard.player = request.session.user.uuid;
        console.log(newCard);
        Card
            .create(newCard)
            .then(dbModel => {
                console.log('success');
                Card
                    .find({player: request.session.user.uuid, active: true}).then(cards => {
                        //console.log(request.session.user.uuid);
                        //console.log(cards);
                        response.json(cards);
                    })
                    .catch(error => response.status(422).json(error));
            })
            .catch(error => {
                console.log(error);
                response.status(422).json(error)
            });

    },
    deactivateCard: function(request, response){
        if(!request.session.user) response.status(401).send();
        const cardUUID = request.params.uuid;
        console.log(cardUUID);
        Card
            .findOne({uuid: cardUUID})
            .then(card => {
                console.log(46);
                console.log(card);
                if(card && card.player === request.session.user.uuid){
                    card.active = false;
                    Card
                        .updateOne({uuid: card.uuid}, card)
                        .then(dbModel => {
                            Card
                                .find({player: request.session.user.uuid, active: true}).then(cards => {
                                    //console.log(request.session.user.uuid);
                                    //console.log(cards);
                                    response.json(cards);
                                })
                                .catch(error => {
                                    console.log(error);
                                    response.status(422).json(error)
                                });
                        })
                        .catch(error => {
                            console.log(error);
                            response.status(422).json(error)
                        })
                } else {
                    response.status(400).json({message:"bad request"});
                }
            })
            .catch(error =>{
                console.log(error);
                response.status(422).json(error);
            });
    }

}