const { GameRoom, GameSettings, GameType } = require('../models');
const isEqual = require('lodash.isequal');

module.exports = {
    findAll: function(request, response){
        GameRoom.find({public: true})
            .populate({
                path: 'creator',
                select: '-email -password -created -__v', 
                model: 'User'
            })
            .populate({
                path: 'players',
                populate: { path: 'player',
                            select: '-email -created -__v', 
                            model: 'User' }
            })
            .populate({
                path:'settings',
                populate: [{
                    path: 'gameManagers',
                    populate: {
                        path: 'manager',
                        select: '-email -created -__v', 
                        model: 'User' 
                    }
                },
                {
                    path: 'prizeManagers',
                    populate: {
                        path: 'manager',
                        select: '-email -created -__v', 
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
                response.status(422).json(error);
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
                populate: { path: 'player',
                            select: '-email -created -__v', 
                            model: 'User' }
            })
            .populate({
                path:'settings',
                populate: [{
                    path: 'gameManagers',
                    populate: {
                        path: 'manager',
                        select: '-email -created -__v', 
                        model: 'User' 
                    }
                },
                {
                    path: 'prizeManagers',
                    populate: {
                        path: 'manager',
                        select: '-email -created -__v', 
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
            gameManagers: [{manager: request.user._id}],
            prizeManagers: [{manager: request.user._id}],
            gameTypeHistory: [{gameType: bingoGameType._id}]
        }

        const settings = await GameSettings.create(defaultGameSettings);
        if(settings._id){
            request.body.settings = settings._id;
        } else {
            reponse.status(400).send('default game settings not set');
        }

        GameRoom.create(request.body)
            .then(dbModel => {
                response.json(dbModel);
            })
            .catch(error => {
                response.status(422).json(error);
            })
    },
    update: function(request, response){
        GameRoom.findOne({_id: request.params.id}).then(gameroom => {
            if(gameroom){
                if(request.user.role === 'admin' || isEqual(gameroom.creator, request.user._id)){
                    GameRoom.updateOne({_id: request.params.id}, request.body)
                        .then(dbResult => response.json(dbResult))
                        .catch(error => response.status(422).json(error));
                } else {
                    response.status(403).send('You are not permitted to modify this resource.');
                }
            } else {   
                response.status(404).send("gameroom not found")
            }
        })
    }
}