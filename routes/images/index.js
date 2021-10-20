const router = require("express").Router();
const path = require("path");

router.use("/santa/:icon", function(req, res) {
    console.log("serving icon: " + req.params.icon)
    res.sendFile(path.join(__dirname, `../../client/src/assets/SVG/${req.params.icon}`));
});

module.exports = router;
