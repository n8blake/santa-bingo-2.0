const { GameRoom, Card, StagedCards } = require('../models');

const addPlayerToRoom = (gameRoomId, userId) => {
    return GameRoom.findOne({_id: gameRoomId}).populate('settings').then(room => {
        if(room){
            if(room.players.indexOf(userId) === -1){
                room.players.push(userId);
            } 
            const cardsAllowed = room.settings.numberOfCardsAllowed;
            return room.save().then(dbSave => {
                // Stage cards
                return StagedCards.findOne({player: userId, gameRoom: room._id}).then(stagedCards => {
                    // console.log(cardsAllowed);
                    // console.log(stagedCards);
                    if(stagedCards && isEqual(stagedCards.gameRoom, room._id) && stagedCards.cards && (stagedCards.cards.length === cardsAllowed)){
                        //console.log(stagedCards);
                        return ('player already added. cards already staged');
                    } else {
                        return Card.find({player: userId, active: true}).sort({'created': -1}).limit(cardsAllowed)
                            .then(cards => {
                                if(cards.length < cardsAllowed){
                                    // create new cards to make up 
                                    console.log('creating new cards');
                                    const newCardsArray = [];
                                    const newCardsNeeded = cardsAllowed - cards.length;
                                    for(let i = 0; i < newCardsNeeded; i++){
                                        const newCardCreationObj = Card.create({player: user._id});
                                        newCardsArray.push(newCardCreationObj);
                                    }
                                    return Promise.all(newCardsArray).then(() => {
                                        const stagedCards = {};
                                        stagedCards.gameRoom = room._id;
                                        stagedCards.player = userId;
                                        stagedCards.cards = cards.map(card => {
                                            return card._id;
                                        });
                                        return StagedCards.create(stagedCards).then(() => {
                                            response.send('User added to room. Cards staged.');
                                        }).catch(error => {
                                            console.log(error);
                                            return error;
                                        });
                                    })
                                } else {
                                    const stagedCards = {};
                                    stagedCards.gameRoom = room._id;
                                    stagedCards.player = userId;
                                    stagedCards.cards = cards.map(card => {
                                        return card._id;
                                    });
                                    return StagedCards.create(stagedCards).then(createdStagedCards => {
                                        return ('User added to room. Cards staged.');
                                    }).catch(error => {
                                        console.log(error);
                                        return errror;
                                    });
                                }

                            })
                    }
                })
            })
            .catch(error => {
                console.log(error);
                return error;
            });
            
        } else {
            return ('room not found');
        }
    })
    .catch(error => {
        console.log(error);
        return error;
    });

}

module.exports = addPlayerToRoom;