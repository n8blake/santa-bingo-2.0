const mongoose = require("mongoose");
const { User, Card, Game, GameRoom, GameSettings, StagedCards, Mark, Prize, } = require("../models");

mongoose.connect(
    process.env.MONGODB_URI ||
    "mongodb://localhost/santa-bingo-n8blake"
);

const USERS = require('./USERS');

User.remove({}).then(() => {
    
    const cards = Card.remove({});
    const games = Game.remove({});
    const gamerooms = GameRoom.remove({});
    const gamesettings = GameSettings.remove({});
    const stagedcards = StagedCards.remove({});
    const playermarks = PlayerMark.remove({});
    const prizes = Prize.remove({});
    
    const promiseArray = [cards, games, gamerooms, gamesettings, stagedcards, playermarks, prizes];
    let n;
    USERS.map(user => {
        const userCreationObj = User.create(user);
        promiseArray.push(userCreationObj);
    });
    Promise.all(promiseArray).then(() => {
        User.find({}).then(users => {
            console.log(`${users.length} users created. DB reset.`)
            process.exit(0);
        }).catch(error => {
            console.log(error);
            process.exit(1)
        })
        
    })
    .catch(error => {
        console.log(error);
        process.exit(1);
    })

})