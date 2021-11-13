const { GameType } = require("../models");

const createGameTypes = async function() {
    return GameType.deleteMany({})
        .then(() => {
            //const gameTypes = ['bingo', 'x', 'window', 'blackout'];
            const gameTypes = [
                { 
                    type: 'bingo',
                    columns: [0, 1, 2, 3, 4],
                    rows: [0, 1, 2, 3, 4],
                    diagonals: [0, 1], 
                    operator: 'OR'
                },
                { 
                    type: 'x',
                    columns: [],
                    rows: [],
                    diagonals: [0, 1], 
                    operator: 'AND'
                },
                { 
                    type: 'window',
                    columns: [0, 4],
                    rows: [0, 4],
                    diagonals: [], 
                    operator: 'AND'
                },
                { 
                    type: 'blackout',
                    columns: [0, 1, 2, 3, 4],
                    rows: [0, 1, 2, 3, 4],
                    diagonals: [0, 1], 
                    operator: 'AND'
                },
            ]
            const gameTypesPromises = [];
            for(let i = 0; i < gameTypes.length; i++){
                const gameTypePromise = GameType.create(gameTypes[i]);
                gameTypesPromises.push(gameTypePromise);
            }
            return Promise.all(gameTypesPromises);
        })
        .catch(error => {
            return error;
        })
}

module.exports = createGameTypes;