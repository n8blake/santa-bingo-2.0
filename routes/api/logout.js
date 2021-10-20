const { request } = require("express");
const router = require("express").Router();

// Matches with '/api/logout/'
router.route("/")
    .get((request, response) => {
        request.session.destroy();
        response.send({message: "Logged Out."});
    });

module.exports = router;
