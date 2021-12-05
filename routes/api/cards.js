const router = require("express").Router();
const cardController = require("../../controllers/cardController");

// Match with '/api/cards/'
router.route('/')
    .get(cardController.getCards)
    .post(cardController.getCards);

router.route('/new/')
    .get(cardController.newCard);

router.route('/:id')
    .get(cardController.findCardById)
    .patch(cardController.activateCard);

module.exports = router;