const router = require("express").Router();
const cardController = require("../../controllers/cardController");

// Match with '/api/cards/player/'
router.route("/player/")
    .post(cardController.findCardsByPlayerID)

module.exports = router;