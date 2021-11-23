const { Card } = require("../models");
const isEqual = require('lodash.isequal');

const { generateCard } = require("../utils/CardGenerator");

module.exports = {
    // start implementing jwt based authentication
    getCards: function(request, response) {
        const findQuery = {}
        if(request.query){
            if(request.query.player){
                findQuery.player = request.query.player;
            }
            if(!request.query.includeInactive){
                findQuery.active = true;
            }
        }
        console.log(findQuery);
        Card.find(findQuery)
            .populate({
                path: 'player',
                select: '-email -password -created -__v', 
                model: 'User'
            })
            .then(cards => {
                if(cards && cards.length > 0){
                    response.json(cards);
                } else {
                    response.status(404).send("no cards found matching request");
                }
            })
            .catch(error => response.status(422).json(error));
    },
    findCardById: function(request, response) {
        Card.findOne({_id: request.params.id})
            .populate({
                path: 'player',
                select: '-email -password -created -__v', 
                model: 'User'
            })
            .then(card => {
                if(card){
                    response.json(card);
                } else {
                    response.status(404).send("no card found")
                }
            })
            .catch(error => response.status(422).json(error));
    },
    newCard: function(request, response){
        const newCard = generateCard(request.user._id);
        //newCard.player = request.user._id;
        Card
            .create(newCard).then(card => {
               if(card){
                    Card.populate(card, {
                        path: 'player',
                        select: '-email -password -created -__v', 
                        model: 'User'
                    }, function(error, card){
                        if(error){
                            response.status(422).json(error);
                        } else if(!card){
                            response.status(422).json(card);
                        } else {
                            response.json(card);
                        }
                    })
               } else {
                   response.status(400).json("No new card created")
               }
            })
            .catch(error => {
                console.log(error);
                response.status(422).json(error)
            });
    },
    activateCard: function(request, response){
        if(typeof request.body.active === undefined || typeof request.body.active === 'boolean'){
            response.status(400).json('bad request');
        }
        Card
            .findOne({_id: request.params.id})
            .then(card => {
                if(card && (request.user.role === 'admin' || isEqual(card.player._id, request.user._id))){
                    card.active = request.body.active;
                    card.save().then(updatedCard => {
                        Card.populate(updatedCard, {
                            path: 'player',
                            select: '-email -password -created -__v', 
                            model: 'User'
                        }, function(error, card){
                            if(error){
                                response.status(422).json(error);
                            } else if(!card){
                                response.status(422).json(card);
                            } else {
                                response.json(card);
                            }
                        })
                    })
                    .catch(error => response.status(422).json(error));
                } else {
                    response.status(400).send("bad request");
                }
            })
            .catch(error =>{
                console.log(error);
                response.status(422).json(error);
            });
    },
    createMany: async function(userId, cardCount) {
        // create 3 cards
        const cards = [];
        for(let i = 0; i < cardCount; i++){
            cards.push(generateCard(userId));
        }
        return Card.insertMany(cards);
    }

}