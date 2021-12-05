const { GameSettings } = require('../models');

module.exports = {
    findById: function(request, response){
        GameSettings.findOne({_id: request.params.id}).then(settings => {
            if(settings){
                response.json(settings);
            } else {
                response.status(404).send('No settings found');
            }
        })
        .catch(error => {
            console.log(error);
            response.status(422).json(error);
        })
    },
    update: function(request, response){
        GameSettings.updateOne({_id: request.params.id}, request.body).then(update => {
            response.json(update);
        })
        .catch(error => {
            console.log(error);
            response.status(422).json(error);
        })
    }
}