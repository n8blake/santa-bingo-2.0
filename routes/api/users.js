const router = require("express").Router();
const usersController = require("../../controllers/usersController");

// Match with '/api/users/me/'
router.route("/me/")
    .get(usersController.findMe)
    .post(usersController.update)
    .put(usersController.create)
    
module.exports = router;