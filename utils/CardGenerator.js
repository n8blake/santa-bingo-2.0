const getRandomInt = require('./randomInt');
const chalk = require('chalk');
const isEqual = require('lodash.isequal');

module.exports = {
     generateCard: function(playerID) {
        const card = {
            player: playerID,
            active: true
        }
        // define col 0 'S'
        // 5 unique random numbers between 1 and 15
        card.column_0 = [];
        for(let j = 0; j < 5; j++){
            //card.column_0.push(j);
            let num;
            do {
                num = getRandomInt(1, 15);
                //console.log(num);
            } while(card.column_0.indexOf(num) > -1)
            card.column_0.push(num);
        }

        // define col 1 'a'
        // 5 unique random numbers between 16 and 30
        card.column_1 = [];
        for(let j = 0; j < 5; j++){
            let num;
            do {
                num = getRandomInt(16, 31) 
            } while(card.column_1.indexOf(num) > -1)
            card.column_1.push(num);
        }

        // define col 2 'n'
        // 5 unique random numbers between 31 and 45
        card.column_2 = [];
        for(let j = 0; j < 5; j++){
            let num;
            do {
                num = getRandomInt(31, 46); 
                //console.log(num);
            } while(card.column_2.indexOf(num) > -1)
            card.column_2.push(num);
            // Set index 2 to zero on every card for Col 2
            if(j === 2){
                card.column_2[j] = 0;
            }
        }

        // define col 3 't'
        // 5 unique random numbers between 46 and 60
        card.column_3 = [];
        for(let j = 0; j < 5; j++){
            let num;
            do {
                num = getRandomInt(46, 61); 
            } while(card.column_3.indexOf(num) > -1)
            card.column_3.push(num);
        }

        // define col 3 't'
        // 5 unique random numbers between 61 and 75
        card.column_4 = [];
        for(let j = 0; j < 5; j++){
            let num;
            do {
                num = getRandomInt(61, 76); 
            } while(card.column_4.indexOf(num) > -1)
            card.column_4.push(num);
        }

        return card;
    },
    printCard: function(card, marks){
        // take a card object and output it to the console
        const cardMarks = [];
        const _marks = marks.map(mark => {
            if(isEqual(card._id, mark.card._id)){
                cardMarks.push(mark.number);
            }
        });


        for(let i = 0; i < 5; i++){
            if(i === 0){
                console.log(chalk.underline('|  B |  I |  N |  G |  O |'));
            }
            const B = card.column_0[i];
            const I = card.column_1[i];
            const N = card.column_2[i];
            const G = card.column_3[i];
            const O = card.column_4[i];
            const rowArr = [B, I, N, G, O];
            let row = "| ";
            rowArr.map(number => {
                //console.log(number);
                let str = "";
                if(number < 10){
                    str = ' ';
                }
                str = str + "" + number;
                if(cardMarks.indexOf(number) > -1){
                    str = chalk.green(str);
                }
                str = str + ' | ';
                row = row + str;
            })
            //const row = `${B} | ${I} | ${N} | ${G} | ${O} |`;
            console.log(chalk.underline(row));
        }
    }
}