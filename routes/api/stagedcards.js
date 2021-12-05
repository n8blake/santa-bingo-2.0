const router = require("express").Router();
const cardController = require("../../controllers/stagedCardsController");

// Match with '/api/cards/'
router.route('/')
    .get(cardController.getStagedCards)
    .put(cardController.setStagedCards)
    .delete(cardController.removeStagedCards)

module.exports = router;