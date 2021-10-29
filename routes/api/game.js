const router = require("express").Router();
const gameController = require("../../controllers/gameController");

// Matches with '/api/game/new/'
router.route('/new/')
    .post(gameController.create)

// Matches with '/api/game/list/'
router.route('/list/')
    .get(gameController.findAll)

// Matches with '/api/game/:id'
router.route('/:id')
    .get(gameController.find)
    .post(gameController.update)
module.exports = router;