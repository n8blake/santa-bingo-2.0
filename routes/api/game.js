const router = require("express").Router();
const gameController = require("../../controllers/gameController");

// Matches with '/api/game/new/'
router.route('/new/')
    .post(gameController.startNewGame)

// Matches with '/api/game/:id'
router.route('/:id')
    .get(gameController.findById)
    .patch(gameController.update)

module.exports = router;