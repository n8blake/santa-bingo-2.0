if(!check.win){
    return new Promise((resolve, reject) => {
        resolve(false);
    });
}
console.log(`Recording win for ${player.firstName} ${player.lastName}`);

//const wins = await Win.find({player: player._id, card: card._id, game: game._id});

const performCheck = new Promise((resolve, reject) => {
    try {
        let checkWins = 0;

        const diagonalWinsMarks = {};
        //const allMarks = [];

        const checkColumns = new Promise((resolve, reject) => {
            if(check.columns){
                const columnWinsMarks = [];
                for(let i = 0; i < check.columns.length; i++){
                    if(check.columns[i]){
                        checkWins = checkWins + 1;
                        columnWinsMarks = card['column_' + i].map(number => {
                            //allMarks.push(number);
                            return number;
                        });
                    }
                }
                // console.log("logging colWins");
                // console.log(columnWinsMarks);
                resolve(columnWinsMarks);
            } else {
                resolve();
            }
        })

        const checkRows = new Promise((resolve, reject) => {
            if(check.rows){
                const rowWinsMarks = {};
                for(let i = 0; i < check.rows.length; i++){
                    if(check.rows[i]){
                        checkWins = checkWins + 1;
                        //console.log(`on row: ${i}`);
                        rowWinsMarks[i] = [];
                        for(let j = 0; j < 5; j++){
                            const number = card['column_' + j][i];
                            //allMarks.push(number);
                            rowWinsMarks[i].push(number);
                            if(j === 4){
                                console.log("logging row wins");
                                console.log(rowWinsMarks);
                                resolve(rowWinsMarks);
                            }
                        }
                    }
                }
                
            } else {
                resolve();
            }
        })

        const checkDiagonals = new Promise((resolve, reject) => {
            if(check.diagonals){
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
                            //allMarks.push(number);
                            diagonalWinsMarks[i].push(number);
                            if(i === check.diagonals.length - 1 && j === 4) {
                                console.log("logging diagonalWins");
                                console.log(diagonalWinsMarks);
                                resolve(diagonalWinsMarks);
                            }
                        }
                    }
                }
                
            } else {
                resolve();
            }
        });
        
        Promise.all([checkColumns, checkRows, checkDiagonals]).then((resolution) => {
            console.log('resolution of all promised checks:');
            console.log(resolution);
            resolve();
        })

        
        // PlayerMark.find({card: card._id, player: player._id, game: game._id}).then((marks) => {
        //     // get the marks that make up this
        //     // particular win
        //     const winData = {};
        //     const winMarks = [];
        //     console.log("marks");
        //     console.log(marks);
        //     console.log("check");
        //     console.log(check);
        //     if(check.columns){
        //         console.log('COLS:');
        //         console.log(columnWinsMarks);
        //         winData.columns = columnWinsMarks;

        //         // HERE YOU NEED TO FIX THIS 
        //         // WRITE A FOR-IN LOOP TO ITERATE OVER
        //         // THE KEYS IN THE winData.columns OBJECT
        //         // DO SAME FOR ROWS AND DIAGONALS

        //         const _cols = marks.map(mark => {
        //             //console.log(mark);
        //             // if(allMarks.indexOf(mark) > -1){
        //             //     return mark;
        //             // } 
        //         });
        //     }
        //     if(check.rows){
        //         console.log('ROWS:');
        //         console.log(rowWinsMarks);
        //         winData.rows = rowWinsMarks;
        //     }
        //     if(check.diagonals){
        //         console.log('DIAGS:');
        //         console.log(diagonalWinsMarks);
        //         winData.diagonals = diagonalWinsMarks;
        //     }
        //     console.log(107);
        //     console.log(winMarks);
        //     resolution = {
        //         winData: winData,
        //         marks: winMarks
        //     }
        //     resolve(resolution);
        // })
        // .catch(error => {
        //     console.log(error);
        //     return error;
        // })

        

    } catch(error){
        reject(error);
    }
});