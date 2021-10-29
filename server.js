require('dotenv').config();
const express = require("express");
const session = require('express-session');
const compression = require('compression');
const path = require("path");
//const { Server } = require("socket.io");

const mongoose = require("mongoose");
const routes = require("./routes");
const cors = require("cors");
//const { createServer } = require('http');
const MongoDBStore = require('connect-mongodb-session')(session);

const PORT = process.env.PORT || 3001;
const app = express();

const server = require("http").createServer(app);
const io = require('socket.io')(server);

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
  // app.set('trust proxy', 1) // trust first proxy
  // sess.cookie.secure = true // serve secure cookies
}

// Use session
const sessionMiddleware = session({
  secret: process.env.SESSION_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7 // 1 week
  },
  store: store,
  resave: true,
  saveUninitialized: true
});
app.use(sessionMiddleware);

// Serve up static assets (usually on heroku)
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}



// Connect to the Mongo DB
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/santa-bingo-n8blake"
);


io.use((socket, next) => {
  sessionMiddleware(socket.request, {}, next);
});

const registerSocketHandlers = require('./sockets');

io.on('connection', (socket) => {
  const session = socket.request.session;
  session.connections++;
  session.save();
  console.log('client connect');
  // register socket handlers
  registerSocketHandlers(io, socket);

});

// Make io accessible to our router
app.use(function(request, response, next){
  request.io = io;
  next();
});

// Add routes, both API and view
app.use(routes);

server.listen(PORT, () => {
  console.log(`🌎 ==> API server now on port ${PORT}!`);
})
// app.listen(PORT, () => {
//   console.log(`🌎 ==> API server now on port ${PORT}!`);
// });
