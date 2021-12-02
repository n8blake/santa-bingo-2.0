const { GameRoom, GameSettings, GameType, Card, StagedCards } = require('../models');
const isEqual = require('lodash.isequal');
const addPlayerToRoom = require('../utils/addPlayerToRoom');

module.exports = {
    find: function(request, response){
        const findQuery = {
            active: true
        }
        if(request.body){
            if(request.body.creator){
                findQuery.creator  = request.query.creator
            }
            if(request.body.players){
                //console.log(request.body.players);
                findQuery.players = { $in: request.body.players};
            }
            if(request.body.notPlayers){
                findQuery.players = { $nin: request.body.notPlayers};
            }
        } else {
            findQuery.public = true;
        }
        //console.log(findQuery);
        GameRoom.find(findQuery)
            .populate({
                path: 'players',
                select: '-email -password -created -__v', 
                model: 'User' 
            })
            .populate({
                path: 'creator',
                select: '-email -password -created -__v', 
                model: 'User'
            })
            .populate({
                path:'settings',
                populate: [{
                    path: 'gameManagers',
                    populate: {
                        path: 'manager',
                        select: '-email -password -created -__v', 
                        model: 'User' 
                    }
                },
                {
                    path: 'prizeManagers',
                    populate: {
                        path: 'manager',
                        select: '-email -password -created -__v', 
                        model: 'User' 
                    }
                },
                {
                    path: 'gameTypeHistory',
                    populate: {
                        path: 'gameType',
                        select: 'type',
                        model: 'GameType'
                    }
                }
            ]
            })
            .then(rooms => {
                if(rooms && rooms.length > 0){
                    response.json(rooms);
                } else {
                    response.status(404).send("No rooms found");
                }
            })
            .catch(error => {
                console.log(error);
                response.status(422).json(error.message);
            })
    },
    findById: function(request, response){
        GameRoom.findOne({_id: request.params.id})
            .populate({
                path: 'creator',
                select: '-email -password -created -__v', 
                model: 'User'
            })
            .populate({
                path: 'players',
                select: '-email -password -created -__v', 
                model: 'User' 
            })
            .populate({
                path:'settings',
                populate: [{
                    path: 'gameManagers',
                    populate: {
                        path: 'manager',
                        select: '-email -password -created -__v', 
                        model: 'User' 
                    }
                },
                {
                    path: 'prizeManagers',
                    populate: {
                        path: 'manager',
                        select: '-email -password -created -__v', 
                        model: 'User' 
                    }
                },
                {
                    path: 'gameTypeHistory',
                    populate: {
                        path: 'gameType',
                        select: 'type',
                        model: 'GameType'
                    }
                }
            ]
            })
            .then(room => {
                if(room){
                    response.json(room);
                } else {
                    response.status(404).send("No room found");
                }
            })
            .catch(error => {
                response.status(422).json(error);
            })
    },
    create: async function(request, response){
        request.body.creator = request.user._id;
        if(request.user.role !== 'admin' || typeof request.body.creator === undefined){
            request.body.creator = request.user._id;
        }

        const bingoGameType = await GameType.findOne({type: 'bingo'});

        // set gameroom settings
        const defaultGameSettings = {
            currentGameType: bingoGameType._id,
            gameManagers: [{manager: request.user._id}],
            prizeManagers: [{manager: request.user._id}],
            gameTypeHistory: [{gameType: bingoGameType._id}]
        }

        const settings = await GameSettings.create(defaultGameSettings);
        if(settings._id){
            request.body.settings = settings._id;
            //request.body.players = [request.user._id];
        } else {
            reponse.status(400).send('default game settings not set');
        }

        GameRoom.create(request.body)
            .then(dbModel => {
                //console.log(dbModel);
                addPlayerToRoom(dbModel._id, request.user._id).then(result => {
                    response.json(dbModel);
                })
            })
            .catch(error => {
                console.log(error);
                response.status(422).json(error.message);
            })
    },
    update: function(request, response){
        GameRoom.findOne({_id: request.params.id}).then(gameroom => {
            if(gameroom){
                if(request.user.role === 'admin' || isEqual(gameroom.creator, request.user._id)){
                    GameRoom.updateOne({_id: request.params.id}, request.body)
                        .then(dbResult => response.json(dbResult))
                        .catch(error => {
                            console.log(error);
                            response.status(422).json(error.message)});
                } else {
                    response.status(403).send('You are not permitted to modify this resource.');
                }
            } else {   
                response.status(404).send("gameroom not found")
            }
        })
    },
    joinRoom: function(request, response){
        const gameRoomId = request.params.gameRoomId;
        const userId = request.params.userId;
        console.log(gameRoomId);
        addPlayerToRoom(gameRoomId, userId).then(result => {
            response.json(result);
        })
        .catch(error => {
            console.log(error);
            reponse.status(422).json(error.message);
        })
        // GameRoom.findOne({_id: gameRoomId}).populate('settings').then(room => {
        //     if(room){
        //         if(room.players.indexOf(userId) === -1){
        //             room.players.push(userId);
        //         } 
        //         const cardsAllowed = room.settings.numberOfCardsAllowed;
        //         room.save().then(dbSave => {
        //             // Stage cards
        //             StagedCards.findOne({player: userId, gameRoom: room._id}).then(stagedCards => {
        //                 // console.log(cardsAllowed);
        //                 // console.log(stagedCards);

        //                 if(stagedCards && isEqual(stagedCards.gameRoom, room._id) && stagedCards.cards && (stagedCards.cards.length === cardsAllowed)){
        //                     //console.log(stagedCards);
        //                     response.send('player already added. cards already staged');
        //                 } else {
        //                     Card.find({player: userId, active: true}).sort({'created': -1}).limit(cardsAllowed)
        //                         .then(cards => {
        //                             if(cards.length < cardsAllowed){
        //                                 // create new cards to make up 
        //                                 console.log('creating new cards');
        //                                 const newCardsArray = [];
        //                                 const newCardsNeeded = cardsAllowed - cards.length;
        //                                 for(let i = 0; i < newCardsNeeded; i++){
        //                                     const newCardCreationObj = Card.create({player: user._id});
        //                                     newCardsArray.push(newCardCreationObj);
        //                                 }
        //                                 Promise.all(newCardsArray).then(() => {
        //                                     const stagedCards = {};
        //                                     stagedCards.gameRoom = room._id;
        //                                     stagedCards.player = userId;
        //                                     stagedCards.cards = cards.map(card => {
        //                                         return card._id;
        //                                     });
        //                                     StagedCards.create(stagedCards).then(() => {
        //                                         response.send('User added to room. Cards staged.');
        //                                     }).catch(error => response.status(422).json(error));
        //                                 })
        //                             } else {
        //                                 const stagedCards = {};
        //                                 stagedCards.gameRoom = room._id;
        //                                 stagedCards.player = userId;
        //                                 stagedCards.cards = cards.map(card => {
        //                                     return card._id;
        //                                 });
        //                                 StagedCards.create(stagedCards).then(createdStagedCards => {
        //                                     response.send('User added to room. Cards staged.');
        //                                 }).catch(error => response.status(422).json(error));
        //                             }

        //                         })
        //                 }
        //             })
        //         })
        //         .catch(error => response.status(422).json(error));
                
        //     } else {
        //         response.status(404).send('room not found');
        //     }
        // })
        // .catch(error => response.status(422).json(error));
    },
    leaveRoom: function(request, response){
        const gameRoomId = request.params.gameRoomId;
        const userId = request.params.userId;
        GameRoom.findOne({_id: gameRoomId}).then(room => {
            if(room){
                const userIndex = room.players.indexOf(userId);
                if(userIndex !== -1){
                    console.log(room.players);
                    const newPlayers = [];
                    room.players.map(player => {
                        if(player === null){

                        } else if(player.toString() === userId){

                        } else {
                            newPlayers.push(player);
                        }

                    });
                    console.log(newPlayers);
                    room.players = newPlayers;
                    room.save().then(dbSave => {
                        StagedCards.deleteMany({player: userId, gameRoom: room._id}).then(dbResult => {
                            response.send('player removed from room');
                        })
                        .catch(error => response.status(422).json(error))
                    })
                    .catch(error => {
                        console.log(error);
                        response.status(422).json(error)
                    });
                } else {
                    console.log(room);
                    response.status(403).send('User not in room');
                }
            } else {
                response.status(404).send('room not found');
            }
        })
        .catch(error => {
            console.log(error);
            response.status(422).json(error)
        });
    }
}