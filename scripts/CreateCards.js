const db = require("../models");
const Card = db.Card;
const { generateCard } = require("../utils/CardGenerator");

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

const createCards = async function(users){
    return Card.deleteMany({})
        .then(() => {
            return makeCards(users);
        })
        .catch(error => {
            console.log(error);
            return error;
        });
}

const makeCards = function(users) {
    const cardsPromises = [];
    users.map(user => {
        const numCards = getRandomInt(3, 5);
        for(let i = 0; i < numCards; i++){
            const card = generateCard(user._id);
            const cardPromise = Card.create(card);
            cardsPromises.push(cardPromise);
        }
    })
    return Promise.all(cardsPromises).then(() => {
        return Card.find({});
    });
}

module.exports = createCards;