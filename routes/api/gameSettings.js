const router = require('express').Router();
const gameSettingsController = require('../../controllers/gameSettingsController');

router.route('/:id')
    .get(gameSettingsController.findById)
    .patch(gameSettingsController.update);

module.exports = router;
