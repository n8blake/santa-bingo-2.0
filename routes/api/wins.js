const router = require("express").Router();
const winsController = require("../../controllers/winsController");

// Matches with 'api/wins/'
router.route('/')
    .get(winsController.find)
    .post(winsController.checkAndRecordIfWon)

// Matches with '/api/wins/:id'
router.route("/:id")
    .get(winsController.findById)
    
module.exports = router;