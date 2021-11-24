const router = require('express').Router();
const passport = require('passport');

const withAuth = passport.authenticate('jwt', { session: false });

// require routes files
const loginRoutes = require("./login");
const logoutRoute = require("./logout");
const usersRoutes = require("./users");
const cardsRoutes = require("./cards");
const gameRoomRoutes = require("./gamerooms");
const stagedCardsRoutes = require("./stagedcards");
const gameRoutes = require('./game');

// use routes
router.use("/login", loginRoutes);
router.use("/logout", logoutRoute);

// protected routes
router.use("/users", withAuth, usersRoutes);
router.use("/cards", withAuth, cardsRoutes);
router.use("/gamerooms", withAuth, gameRoomRoutes);
router.use("/stagedcards", withAuth, stagedCardsRoutes);
router.use("/game", withAuth, gameRoutes);

module.exports = router;