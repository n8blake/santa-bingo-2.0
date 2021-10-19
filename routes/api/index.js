const router = require("express").Router();
// require routes files
const loginRoutes = require("./login");
const logoutRoute = require("./logout");
const usersRoutes = require("./users");
const cardsRoutes = require("./cards");
// use routes
router.use("/login", loginRoutes);
router.use("/logout", logoutRoute);
router.use("/users", usersRoutes);
router.use("/cards", cardsRoutes);

module.exports = router;