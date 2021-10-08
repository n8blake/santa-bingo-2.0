require('dotenv').config();
const express = require("express");
const session = require('express-session');
const compression = require('compression');
const path = require("path");

const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
const MongoDBStore = require('connect-mongodb-session')(session);

const PORT = process.env.PORT || 3001;
const app = express();

// Define Session Store
const store = new MongoDBStore({
  uri: process.env.MONGODB_URI || "mongodb://localhost/santa-bingo-n8blake",
  collection: 'sessions'
});

// Define middleware here
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(compression());

if (process.env.NODE_ENV === 'development') {
  //app.set('trust proxy', 1) // trust first proxy
  //sess.cookie.secure = true // serve secure cookies
}

// Use session
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  resave: true,
  saveUninitialized: true
}));

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// Add routes, both API and view
app.use(routes);

// Connect to the Mongo DB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/santa-bingo-n8blake"
);

app.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
});
