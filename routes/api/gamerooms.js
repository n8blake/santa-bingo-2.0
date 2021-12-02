const router = require("express").Router();
const gameRoomController = require("../../controllers/gameRoomController");

// Matches with '/api/gamerooms/'
router.route('/')
    .get(gameRoomController.find)
    .post(gameRoomController.create)  

router.route('/players/')
    .post(gameRoomController.find);

// Matches with '/api/gamerooms/:id
router.route("/:id")
    .get(gameRoomController.findById)
    .patch(gameRoomController.update)

router.route("/:gameRoomId/:userId")
    .put(gameRoomController.joinRoom)
    .delete(gameRoomController.leaveRoom)

module.exports = router;