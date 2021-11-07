const isEqual = require('lodash.isequal');

const gameTypes = {
    BINGO: 'bingo',
    X: 'x', 
    WINDOW: 'window',
    BLACKOUT: 'blackout'
}

// Provided a GameType, a Card, and 
// an array of PlayerMarks, check to 
// see if there is a win.

const checkForWin = (gameType, card, marks) => {
    const check = {
        win: false,
        type: gameType,
        playerMarks: marks
    }
    const marksNumbers = [];
    marks.map(mark => {
        if(!isEqual(card._id, mark.card._id)){
            // throw error?
            throw new Error('PlayerMark Card mismatch.');
        }
        marksNumbers.push(mark.number);
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

    check.columns = columnFills;
    check.rows = rowFills;
    check.diagonals = diagonalFills;

    switch (gameType){
        case gameTypes.BINGO:
            // bingo logic
            // For bingo, a win is when a player has
            // marked off any full column of a card,
            // any full row of a card, or any of the 
            // two diagonals of the card
            return {
                ...check,
                win: ( check.columns.indexOf(true) > -1 || 
                        check.rows.indexOf(true) > -1 || 
                        check.diagonals.indexOf(true) > -1 )
            };
        case gameTypes.X:
            // X logic
            return {
                ...check,
                win: (check.diagonals[0] && check.diagonals[1])
            };
        case gameTypes.WINDOW:
            // Window logic
            return {
                ...check,
                win: (check.row[0] && check.row[4] &&
                    check.columns[0] && check.columns[4])
            };
        case gameTypes.BLACKOUT:
            // Blackout logic
            return {
                ...check,
                win: ( win.columns.indexOf(false) === -1 )
            };
    }
    return check;
}

module.exports = checkForWin;