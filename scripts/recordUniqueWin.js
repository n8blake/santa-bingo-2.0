const db = require("../models");
const Game = db.Game;
const Card = db.Card;
const PlayerMark = db.PlayerMark;
const Win = db.Win;

const chalk = require('chalk');
const isEqual = require('lodash.isequal');
// provided a number and an array of marks, 
// return the mark that is associated with
// that number
const numberToMark = (number, marks) => {
    let _mark;
    marks.map(mark => {
        if(mark.number === number){
            _mark = mark;
        }
    })
    return _mark;
}


const recordUniqueWin = async function(check, card, player, game){

    if(!check.win){
        return new Promise((resolve, reject) => {
            resolve(false);
        });
    } else {
        
        const performCheck = new Promise((resolve, reject) => {
            try {
                let checkWins = 0;
        
                //
                //const allNumbers = [];
        
                const checkColumns = new Promise((resolve, reject) => {
                    try{if(check.columns){
                        let columnWinsMarks = [];
                        for(let i = 0; i < check.columns.length; i++){
                            if(check.columns[i]){
                                checkWins = checkWins + 1;
                                columnWinsMarks = card['column_' + i].map(number => {
                                    //allNumbers.push(number);
                                    return numberToMark(number, check.playerMarks);
                                });
                            }
                        }
                        //console.log("logging colWins");
                        //console.log(columnWinsMarks);
                        resolve(columnWinsMarks);
                    } else {
                        resolve();
                    }} catch(error){
                        reject(error)
                    }
                })
        
                const checkRows = new Promise((resolve, reject) => {
                    try{if(check.rows){
                        const rowWinsMarks = {};
                        for(let i = 0; i < check.rows.length; i++){
                            if(check.rows[i]){
                                checkWins = checkWins + 1;
                                //console.log(`on row: ${i}`);
                                rowWinsMarks[i] = [];
                                for(let j = 0; j < 5; j++){
                                    const number = card['column_' + j][i];
                                    //allNumbers.push(number);
                                    rowWinsMarks[i].push(numberToMark(number, check.playerMarks));
                                    if(j === 4){
                                        //console.log("logging row wins");
                                        //console.log(rowWinsMarks);
                                        resolve(rowWinsMarks);
                                    }
                                }
                            }
                        }
                        
                    } else {
                        resolve();
                    }} catch (error){
                        reject(error)
                    }
                })
        
                const checkDiagonals = new Promise((resolve, reject) => {
                    try{if(check.diagonals){
                        const diagonalWinsMarks = {};
                        for(let i = 0; i < check.diagonals.length; i++){
                            if(check.diagonals[i]){
                                
                                checkWins = checkWins + 1;
                                //console.log(`on diagonals: ${i}`);
                                diagonalWinsMarks[i] = [];
                                for(let j = 0; j < 5; j++){
                                    let number;
                                    if(i === 0){
                                        number = card['column_' + j][j];
                                        //console.log(number);
                                    } else {
                                        number = card['column_' + j][4 - j];
                                        //console.log(number);
                                    }
                                    //allNumbers.push(number);
                                    diagonalWinsMarks[i].push(numberToMark(number, check.playerMarks));
                                    if(i === check.diagonals.length - 1 && j === 4) {
                                        //console.log("logging diagonalWins");
                                        //console.log(diagonalWinsMarks);
                                        resolve(diagonalWinsMarks);
                                    }
                                }
                            }
                        }
                        
                    } else {
                        resolve();
                    }} catch (error) {
                        reject(error);
                    }
                });
                
                Promise.all([checkColumns, checkRows, checkDiagonals]).then((resolution) => {
                    //console.log('resolution of all promised checks:');
                    //console.log(resolution);
                    const _marks = [];
                    if(resolution.length){
                        resolution.map(block => {
                            if(typeof block !== 'undefined'){
                                for(const [index, array] of Object.entries(block)) {
                                    if(array.length){
                                        array.map(mark => {
                                            _marks.push(mark);
                                        })
                                    }
                                }
                            }
                        })
                    }
                    resolve(_marks);
                })
                .catch(error => {
                    reject(error);
                })

            } catch(error){
                reject(error);
            }
        });

        

        // if in the check, there exists a win that is not 
        // in the list of wins, record that win
        // else don't record anything and return something useful
        // that says you didn't actually win anything new
        return performCheck.then(async (result) => {
            // get a list of wins
            let oldWins = await Win.find({card:card._id, player:player._id, game:game._id})
                                    .populate({
                                        path: 'marks',
                                        model: 'PlayerMark'
                                    });
            
            let newWin = true;
            if(oldWins.length > 0){
                // go through each old win
                // check the marks and see if they are the same
                oldWins.map(oldWin => {
                    console.log(oldWin);
                    console.log('old marks:');
                    console.log(oldWin.marks);
                    console.log(result);
                    if(isEqual(oldWin.marks, result)){
                        newWin = false;
                    } else {

                    }
                })
            }
            if(newWin && result.length > 0){
                const newWin = {
                    player: player._id,
                    card: card._id,
                    marks: result,
                    game: game._id
                }
                //console.log(newWin);
                return Win.create(newWin);
            } else {
                return new Promise((resolve, reject) => {
                    resolve(false);
                })
            }
            
        })
        .catch(error => {
            console.error(chalk.red(error));
        })

        
    }


}

module.exports = recordUniqueWin;