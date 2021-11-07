const { GameType } = require("../models");

const createGameTypes = async function() {
    return GameType.deleteMany({})
        .then(() => {
            const gameTypes = ['bingo', 'x', 'window', 'blackout'];
            const gameTypesPromises = [];
            for(let i = 0; i < gameTypes.length; i++){
                const gameTypePromise = GameType.create({type: gameTypes[i]});
                gameTypesPromises.push(gameTypePromise);
            }
            return Promise.all(gameTypesPromises);
        })
        .catch(error => {
            return error;
        })
}

module.exports = createGameTypes;