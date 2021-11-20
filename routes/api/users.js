const router = require("express").Router();
const usersController = require("../../controllers/usersController");

// Matches with 'api/users/'
router.route('/')
    .get(usersController.findAll)

// Match with '/api/users/me/'
router.route("/:id")
    .get(usersController.findById)
    .patch(usersController.update)
    
module.exports = router;