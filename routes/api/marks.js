const router = require("express").Router();
const marksController = require('../../controllers/marksController');

router.route('/')
    .get(marksController.getMarks)
    .post(marksController.createMark)

router.route('/:id')
    .delete(marksController.removeMark);

module.exports = router;