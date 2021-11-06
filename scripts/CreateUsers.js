// Create New Users
const USERS = require('./USERS');
//const mongoose = require("mongoose");
const db = require("../models");
const User = db.User;

const createUsers = async function(){
    return User.remove({})
        .then(() => {
            return new Promise((resolve, reject) => {
                const userPromises = [];
                USERS.map(user => {
                    const userPromise = User.create(user)
                        .then((n) => {
                            //console.log(`${n} user created`);
                            if(USERS.indexOf(user) == USERS.length -1 ){
                                return User.find({}).then( users => {
                                    resolve(users);
                                })
                                .catch(error => {
                                    reject(error);
                                })
                            }
                        })
                        .catch(error => {
                            console.log(error)
                            reject(error);
                            //process.exit(1);
                        });
                    userPromises.push(userPromise);
                });
                return Promise.all(userPromises);
            });
    })  
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
}


module.exports = createUsers;