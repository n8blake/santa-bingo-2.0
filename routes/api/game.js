const router = require("express").Router();
const gameController = require("../../controllers/gameController");
const gameRoomController = require("../../controllers/gameRoomController");

// Matches with '/api/game/new/'
router.route('/new/')
    .post(gameRoomController.create)

// Matches with '/api/game/list/'
router.route('/list/')
    .get(gameRoomController.findAll)

// Matches with '/api/game/:id'
router.route('/:id')
    .get(gameRoomController.find)
//     .post(gameRoomController.update)

module.exports = router;