const mongoose = require("mongoose");
const db = require("../models");
const User = db.User;

mongoose.connect(
    process.env.MONGODB_URI ||
    "mongodb://localhost/santa-bingo-n8blake"
);

const USERS = [
	  {
          firstName: "Nate",
          lastName: "Blake",
          displayName: "Nate",
          email: "n8blake@mac.com"
      },
      {
        firstName: "Spencer",
        lastName: "Blake",
        displayName: "Spencer",
        email: "spencer.blake@slcc.edu"
    },
    {
        firstName: "Kristin",
        lastName: "Cooper",
        displayName: "Kristin",
        email: "katiedean@mac.com"
    },
];

User
    .remove({})
    .then(() => User.collection.insertMany(USERS))
    .then(data => {
        console.log(data.result.n + " records insterted!");
        process.exit(0);
    })
    .catch(error => {
        console.error(error);
        process.exit(1);
    });