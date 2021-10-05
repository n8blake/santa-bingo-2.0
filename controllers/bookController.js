const { Book } = require("../models");

module.exports = {
    findAll: function (request, response) {
        Book
            .find({})
            .then(dbModel => {
                response.json(dbModel)
            })
            .catch(error => response.status(422).json(error));
    },
    findById: function (request, response) {
        Book
            .findById(request.params.id)
            .then(dbModel => response.json(dbModel))
            .catch(error => response.status(422).json(error));
    },
    create: function (request, response) {
        Book
            .create(request.body)
            .then(dbModel => response.json(dbModel))
            .catch(error => response.status(422).json(error));
    },
    update: function (request, response) {
        Book
            .findOneAndUpdate({ _id: request.params.id }, request.body)
            .then(dbModel => response.json(dbModel))
            .catch(error => response.status(422).json(error));
    },
    remove: function (request, response) {
        Book
            .findById({ _id: request.params.id })
            .then(dbModel => dbModel.remove())
            .then(dbModel => response.json(dbModel))
            .catch(error => response.status(422).json(error));
    }
};