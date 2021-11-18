const router = require('express').Router();
const passport = require('passport');

const withAuth = passport.authenticate('jwt', { session: true, failureFlash: 'Invalid username or password.' });

// require routes files
const loginRoutes = require("./login");
const logoutRoute = require("./logout");
const usersRoutes = require("./users");
const cardsRoutes = require("./cards");
const gameRoutes = require('./game');

// use routes
router.use("/login", loginRoutes);
router.use("/logout", logoutRoute);
//passport.authenticate('local', { failureRedirect: '/login', flashFailure: true }),
router.use("/users", withAuth);
router.use("/users", usersRoutes);
router.use("/cards", withAuth, cardsRoutes);
router.use("/game", gameRoutes);

module.exports = router;