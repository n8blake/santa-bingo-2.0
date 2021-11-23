const router = require("express").Router();
const gameRoomController = require("../../controllers/gameRoomController");

// Matches with '/api/gamerooms/'
router.route('/')
    .get(gameRoomController.findAll)
    .post(gameRoomController.create)  

// Matches with '/api/gamerooms/:id
router.route("/:id")
    .get(gameRoomController.findById)
    .patch(gameRoomController.update)

module.exports = router;