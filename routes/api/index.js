const router = require("express").Router();
// require routes files
const loginRoutes = require("./login");
const logoutRoute = require("./logout");
const usersRoutes = require("./users");

// use routes
router.use("/login", loginRoutes);
router.use("/logout", logoutRoute);
routers.use("/users", usersRoutes);

module.exports = router;