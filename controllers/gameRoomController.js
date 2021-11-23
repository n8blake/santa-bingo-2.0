const { GameRoom } = require('../models');

module.exports = {
    findAll: function(request, response){
        GameRoom.find({})
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
            .then(rooms => {
                if(rooms){
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
    create: function(request, response){
        if(request.user.role !== 'admin' || typeof request.body.creator === undefined){
            request.body.creator = request.user._id;
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
        // if(request.body.creator !== request.user._id || request.user.role !== 'admin'){
        //     response.status(403).send("Cannot create games on behalf of other users")
        // }
        response.status(404).send("route not yet supported")
    }
}