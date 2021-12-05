const mongoose = require("mongoose");
const { User, Card, Game, GameRoom, GameSettings, StagedCards, Mark, Prize, } = require("../models");
const { generateCard } = require("../utils/CardGenerator");
const chalk = require("chalk");

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
    const playermarks = Mark.remove({});
    const prizes = Prize.remove({});
    
    const promiseArray = [cards, games, gamerooms, gamesettings, stagedcards, playermarks, prizes];
    USERS.map(user => {
        const userCreationObj = User.create(user);
        promiseArray.push(userCreationObj);
    });
    Promise.all(promiseArray).then(() => {
        console.log(chalk.keyword('orange')("db reset"));
        User.find({}).then((users) => {
            console.log(chalk.green(`${users.length} users created.`));
            // create 3 cards per user
            const cardCreationPromiseArray = [];
            users.map(user => {
                for(let i = 0; i < 3; i++){
                    const newCard = generateCard(user._id);
                    const cardCreationObject = Card.create(newCard);
                    cardCreationPromiseArray.push(cardCreationObject);
                }
            });
            Promise.all(cardCreationPromiseArray).then(dbModel => {
                Card.find({}).then(cards => {
                    console.log(chalk.green(`${cards.length} cards created.`));
                    process.exit(0);
                })
                .catch(error => {
                    console.log(chalk.red(error));
                })
            })
            .catch(error => {
                console.log(error);
                process.exit(1);
            })
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