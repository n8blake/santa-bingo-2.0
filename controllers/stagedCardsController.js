const { StagedCards } = require("../models");

module.exports = {
    getStagedCards: function(request, response){
        // return staged cards from GET request
        const findQuery = {};
        if(request.query && request.query.player && request.query.gameroom){
            if(request.query.player){
                findQuery.player = request.query.player;
            }
            if(request.query.gameroom){
                findQuery.gameRoom = request.query.gameroom;
            }
            StagedCards.findOne(findQuery)
                .populate('cards')
                .then(stagedCards => {
                if(stagedCards && stagedCards.cards.length > 0){
                    response.json(stagedCards);
                } else {
                    response.status(404).send('No cards staged')
                }
            })
            .catch(error => response.status(422).json(error))
        } else {
            response.status(400).send('Query parameters not set');
        }
    },
    setStagedCards: function(request, response){
        // set stagedCards for a given resource
        const findQuery = {};
        if(request.query && request.query.player && request.query.gameroom){
            let authorized;
            if(request.query.player === request.user._id || request.user.role === 'admin'){
                authorized = true;
            } else {
                authorized = false;
            }
            if(!authorized){
                response.status(403).send('Not authorized to modify this resource');
            }
            
            if(request.query.player){
                findQuery.player = request.query.player;
            }
            if(request.query.gameroom){
                findQuery.gameRoom = request.query.gameroom;
            }
            StagedCards.findOne(findQuery).then(stagedCards => {
                if(stagedCards && stagedCards.cards.length > 0){
                    stagedCards = request.body;
                    stagedCards.save().then(savedStagedCards => {
                        response.send(savedStagedCards)
                    })
                    .catch(error => response.status(422).json(error))
                } else {
                    response.status(404).send('No cards staged')
                }
            })
            .catch(error => response.status(422).json(error))
        } else {
            response.status(400).send('Query parameters not set')
        }
    },
    removeStagedCards: function(request, response){
        // remove stagedCards for a given resource
        const findQuery = {};
        if(request.query && request.query.player && request.query.gameroom){
            let authorized;
            if(request.query.player === request.user._id || request.user.role === 'admin'){
                authorized = true;
            } else {
                authorized = false;
            }
            if(!authorized){
                response.status(403).send('Not authorized to modify this resource');
            }
            if(request.query.player){
                findQuery.player = request.query.player;
            }
            if(request.query.gameroom){
                findQuery.gameRoom = request.query.gameroom;
            }
            StagedCards.deleteOne(findQuery).then(dbResult => {
                response.json(dbResult)
            })
            .catch(error => response.status(422).json(error))
        } else {
            response.status(400).send('Query parameters not set')
        }
    }
}