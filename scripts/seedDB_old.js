const mongoose = require("mongoose");
const db = require("../models");
const User = db.User;
const Card = db.Card;
const Game = db.Game;
const { v4: uuidv4 } = require('uuid');

mongoose.connect(
    process.env.MONGODB_URI ||
    "mongodb://localhost/santa-bingo-n8blake"
);

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

const USERS = [
	  {
          firstName: "Nate",
          lastName: "Blake",
          displayName: "N8",
          email: "n8blake@mac.com",
          color: 'red'
      },
      {
        firstName: "Spencer",
        lastName: "Blake",
        displayName: "SB",
        email: "spencer.blake@slcc.edu",
        color: 'blue'
    },
    {
        firstName: "Kristin",
        lastName: "Cooper",
        displayName: "KC",
        email: "katiedean@mac.com",
        color: 'yellow'
    },
];

const CARDS = [];

User
    .remove({})
    .then(() => {
        USERS.map(user => {
            User.create(user)
                .then((n) => {
                    console.log(`${n} user created`);
                    if(USERS.indexOf(user) == USERS.length -1 ){
                        makeCards();
                    }   
                    //
                    return;
                })
                .catch(error => {
                    console.log(error)
                    process.exit(1);
                })
        })
        //makeCards();
    })
    // .then(data => {
    //     console.log(data.result.n + " user records insterted!");
    //     //process.exit(0);
    // })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });

const makeCards = () => {
    User.find({}).then(users => {
        // Make cards for each user
        const players = [];
        users.map(user => {
            players.push(user.uuid);
        });
    
        Game.remove({}).then(() => { 
            users.map((user) => {
                const id = user.uuid;
                makeGame(id, user.firstName, players);
                //console.log(id);
                for(let i = 0; i < 4; i++){
                    const cardUUID = uuidv4();
                    const card = {
                        player: id,
                        active: true,
                        created: new Date(),
                        uuid: cardUUID
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
                            num = getRandomInt(16, 30) 
                        } while(card.column_1.indexOf(num) > -1)
                        card.column_1.push(num);
                    }
        
                    // define col 2 'n'
                    // 5 unique random numbers between 31 and 45
                    card.column_2 = [];
                    for(let j = 0; j < 5; j++){
                        let num;
                        do {
                            num = getRandomInt(31, 45); 
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
                            num = getRandomInt(46, 60); 
                        } while(card.column_3.indexOf(num) > -1)
                        card.column_3.push(num);
                    }
        
                    // define col 3 't'
                    // 5 unique random numbers between 61 and 75
                    card.column_4 = [];
                    for(let j = 0; j < 5; j++){
                        let num;
                        do {
                            num = getRandomInt(61, 75); 
                        } while(card.column_4.indexOf(num) > -1)
                        card.column_4.push(num);
                    }
                    //console.log(card);
                    CARDS.push(card);
                }
                Card.remove({})
                    .then(() => Card.collection.insertMany(CARDS))
                    .then(data => {
                        console.log(data.result.n + " card records insterted!");
                        process.exit(0);
                    })
                    .catch(error => {
                        console.error(error);
                        process.exit(1);
                    });
            })
        });
        
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
}


const makeGame = (creator_uuid, name, players) => {
    const GAME = 
        {
            start_time: new Date(),
            creator: creator_uuid,
            name: `${name}'s Game'`,
            players: players
        };
    Game.create(GAME).then(() => {
        console.log("game created");
        
    }).catch(error => {
        console.log(error);
        process.exit(1);
    })
}
