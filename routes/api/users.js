const router = require("express").Router();
const usersController = require("../../controllers/usersController");

// Match with '/api/users'
router.route("/")
    .get(usersController.findMe);

module.exports = router;
    