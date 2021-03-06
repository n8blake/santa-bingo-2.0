const isEqual = require('lodash.isequal');

const gameTypes = {
    BINGO: 'bingo',
    X: 'x', 
    WINDOW: 'window',
    BLACKOUT: 'blackout'
}

const compare =  (op, arg1, arg2) => {
    if(op === 'OR'){
        return arg1 || arg2;
    } else {
        return arg1 && arg2;
    }
}
// Provided a GameType, a Card, and 
// an array of PlayerMarks, check to 
// see if there is a win.

const checkForWin = (gameType, gameNumbers, card, marks) => {
    console.log("check started...");
    const check = {
        win: false,
        type: gameType,
        playerMarks: marks
    }
    if(gameType.numberOfMarks !== marks.length){
        throw new Error('Incorrect number of marks for game type');
        
    }
    const marksNumbers = marks.map(mark => {
        if(!isEqual(card._id, mark.card._id)){
            // throw error?
            throw new Error('Mark Card mismatch.');
        } else if(gameNumbers.indexOf(mark.number) === -1){
            throw new Error(`${mark.number} not called in game.`);
        }
        return mark.number;
    })

    const columnFills = [true, true, true, true, true];
    const rowFills = [true, true, true, true, true];
    const diagonalFills = [true, true];
    
    for(let i = 0; i < 5; i++){
        let columnName = 'column_' + i;
        card[columnName].map(number => {
            if(marksNumbers.indexOf(number) === -1){
                columnFills[i] = false;
                rowFills[card[columnName].indexOf(number)] = false;
                if(card[columnName].indexOf(number) === i){
                    diagonalFills[0] = false;
                }
                if(card[columnName].indexOf(number) === (4 - i)){
                    diagonalFills[1] = false;
                }
            };
        });
    }

    const recursiveOR = function(test, arr){
        if(test){
            return test;
        } else if(arr.length === 0){
            return test;
        } else {
            const newTest = arr.pop();
            return recursiveOR(newTest, arr);
        }
    }

    const recursiveAND = function(test, arr){
        if(!test){
            return test;
        } else if(arr.length === 0){
            return test;
        } else {
            const newTest = arr.pop();
            return recursiveAND(newTest, arr);
        }
    }

    const cols = columnFills.map(v => {
        if(gameType.columns.indexOf(columnFills.indexOf(v)) > -1){
            return v
        }  
    });
    const rows = rowFills.map(v => {
        if(gameType.rows.indexOf(rowFills.indexOf(v)) > -1){
            return v
        }
    });
    const diags = diagonalFills.map(v => {
        if(gameType.diagonals.indexOf(diagonalFills.indexOf(v)) > -1){
            return v
        }  
    });

    let colWin;
    let rowWin;
    let diagsWin;

    let win;

    if(gameType.operator === 'OR'){
        colWin = recursiveOR(cols.pop(), cols);
        if(colWin){
            // put the marks in the check columns
            check.columns = columnFills;
        }
        rowWin = recursiveOR(rows.pop(), rows);
        if(rowWin){
            check.rows = rowFills;
        }
        diagsWin = recursiveOR(diags.pop(), diags);
        if(diagsWin){
            check.diagonals = diagonalFills;
        }
        win = (colWin || rowWin || diagsWin);
    } else {
        win = true;
        if(gameType.columns.length > 0){
            colWin = recursiveAND(cols.pop(), cols);
            win = win && colWin;
        }
        if(gameType.rows.length > 0){
            rowWin = recursiveAND(rows.pop(), rows);
            win = win && rowWin;
        }
        if(gameType.diagonals.length > 0){
            diagsWin = recursiveAND(diags.pop(), diags);
            win = win && diagsWin;
        }
        if(win && colWin){
            check.columns = columnFills;
        }
        if(win && rowWin){
            check.rows = rowFills;
        }
        if(win && diagsWin){
            check.diagonals = diagonalFills;
        }
    }

    // The check object should return 
    // columnWins: [[marks], [], [marks]...]

    if(colWin){
        //console.log('colWin. Getting marks')
        check.columnWinMarks = [];
        for(let i = 0; i < check.columns.length; i++) { 
            check.columnWinMarks[i] = [];
            if(check.columns[i]){
                //console.log(`Getting marks for column ${i}`);
                const cardNumbers = card[`column_${i}`];
                //console.log(cardNumbers);
                for(let n = 0; n < cardNumbers.length; n++){
                    //console.log(2);
                    //console.log(check.columnWinMarks[i]);
                    const number = cardNumbers[n];
                    //console.log(`Looking for mark number: ${number}`);
                    // // get mark by number
                    for(let m = 0; m < marks.length; m ++){
                        //console.log(3);
                        //console.log(check.columnWinMarks[i]);
                        const mark = marks[m];
                        if(mark.number === number){
                            //console.log(`mark: ${mark}`);
                            //console.log(check.columnWinMarks[i]);
                            check.columnWinMarks[i].push(mark);
                        }
                    }
                }
            } 
        }
    }

    if(rowWin){
        check.rowWinMarks = [];

    }

    if(diagsWin){
        check.diagonalWinMarks = [];
    }

    return {
        ...check, 
        win: win
    }
}

module.exports = checkForWin;