const router = require("express").Router();
const bookRoutes = require("./books");
const colorRoute = require("./color");

// books routes
router.use("/books", bookRoutes);

router.use("/color", colorRoute);

module.exports = router;