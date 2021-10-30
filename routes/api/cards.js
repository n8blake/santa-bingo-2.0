const router = require("express").Router();
const cardController = require("../../controllers/cardController");

// Match with '/api/cards/player/'
router.route("/player/")
    .post(cardController.findCardsByPlayerID)

router.route('/new/')
    .get(cardController.newCard);

router.route('/deactivate/:uuid')
    .delete(cardController.deactivateCard);

module.exports = router;