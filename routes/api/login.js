const { request } = require("express");
const router = require("express").Router();
const jwt = require("jsonwebtoken");

// Login Token Generator
// Generate token
const makeToken = (email) => {
    const expirationDate = new Date();
    expirationDate.setHours(new Date().getHours() + 1);
    // Be sure to configure .env with the JWT_SECRET_KEY
    return jwt.sign({ email, expirationDate }, process.env.JWT_SECRET_KEY);
  };

router.route("/")
  .get((request, response) => {
    if(request.session.token){
        response.send({token: request.session.token});
    } else {
        response.status(401).send({message:"Please log in."});
    }
  });

// Matches with '/api/login/'
router.route("/")
    .post((request, response) => {
        console.log(request.body);
        const email = request.body.email;
        // make sure what was sent is a vaild email address
        if(!email){
            response.status(403);
            response.send({
                message: "No email address provided.",
            })
        }
        if(email){
            //response.status(200).json("login not yet implemented");
            // Set up email
            console.log("creating token...");
            const token = makeToken(email);
            const data = {token: token};

            console.log("session data");
            console.log(request.session);
            if(!request.session.email){
                console.log("Setting session email");
                request.session.email = email;
            }
            if(!request.session.token){
                console.log("Setting session token");
                request.session.token = token;
            }
            response.send(data);
        } else {
            response.status(400).send({message: "Bad request"});
        }
        
    });

// Matches with '/api/login/validate'
router.route("/validate")
    .post((request, response) => {
        const token = request.body.token;
        if (!token) {
            response.status(403)
            response.send("Can't verify user.")
            return
        }
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        } catch {
            response.status(403)
            response.send("Invalid auth credentials.")
            return
        }
        if (!decoded.hasOwnProperty("email") || !decoded.hasOwnProperty("expirationDate")) {
            response.status(403)
            response.send("Invalid auth credentials.")
            return
        }
        const { expirationDate } = decoded
        if (expirationDate < new Date()) {
            res.status(403)
            res.send("Token has expired.")
            return
        }
        response.status(200)
        response.send("User has been validated.")
    });

module.exports = router;