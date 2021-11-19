const { request, response } = require('express');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const usersController = require("../../controllers/usersController");
const passport = require('passport');
// Login Token Generator
// Generate token
const makeToken = (email, expiryTimeInHours) => {
    const expirationDate = new Date();
    expirationDate.setHours(new Date().getHours() + expiryTimeInHours);
    // Be sure to configure .env with the JWT_SECRET_KEY
    return jwt.sign({ email, expirationDate }, process.env.JWT_SECRET_KEY);
  };


// Matches with '/api/login/'
    //authenticate with passport
router.route('/')
    .get((request, response) => {
        if(request.session.refreshToken){
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                if (!decoded.hasOwnProperty("email") || !decoded.hasOwnProperty("expirationDate")) {
                    response.status(401).send("Invalid auth credentials.");
                }
                const { expirationDate } = decoded;
                const expirationDateObject = new Date(expirationDate);
                if (expirationDateObject < new Date()) {
                    response.status(403).send("Token has expired. Login again.");
                } else {
                    const token = makeToken(decoded.email, 1);
                    response.status(200).json({token:token});
                }

            } catch (error) {
                response.status(400).json(error);
            }
        } else {
            response.status(401).send("Unknown user. Login and request refresh token.");
        }
    })
    .post(
        passport.authenticate('local', { session: true, failureFlash: 'Invalid username or password.' }),
        function(request, response){
            console.log(request.user.email);
            request.session.user = request.user;
            const token = makeToken(request.user.email, 1);
            response.status(200).json({token:token});
        }
    )
// Matches with '/api/login/refresh/'
router.route('/refresh/')
    .get((request, response) => {
        if(request.headers.token){
            try {
                const decoded = jwt.verify(request.headers.token, process.env.JWT_SECRET_KEY);
                if (!decoded.hasOwnProperty("email") || !decoded.hasOwnProperty("expirationDate")) {
                    response.status(401).send("Invalid auth credentials.");
                }
                const { expirationDate } = decoded;
                const expirationDateObject = new Date(expirationDate);
                if (expirationDateObject < new Date()) {
                    response.status(403).send("Token has expired. Login again.");
                } else {
                    const refreshToken = makeToken(decoded.email, 24 * 7); // Refresh token can stay in session for 1 week -- same as session length
                    const token = makeToken(request.user.email, 1);
                    response.status(200).json({token:token});
                }
            } catch (error) {
                console.log(error);
                response.status(401).send("Unknown user. Invalid token presented in header.");
            }
        } else {
            response.status(401).send("Unknown user. Authorization token not present in headers.");
        }
    })


// Matches with '/api/login/old/'

router.route("/old/")
    .get((request, response) => {
        if(request.session.user){
        usersController.findMePrivate(request.session.user.email).then(result => {
            console.log(result);
            const data = {};
            data.token = request.session.token;
            if(result.email){
                data.user = result;
            }
            console.log(data);
            response.send(data);
        }).catch(error => {
            console.log(error);
        })
        } else {
            response.status(401).json({message:"Please log in."});
        }
    })
    .post((request, response) => {
        console.log(request.body);
        const email = request.body.email;
        const name = request.body.name;
        // make sure what was sent is a vaild email address
        if(!email || !name){
            response.status(403).json({
                message: "Bad request.",
            })
        }
        if(email && name){
            //response.status(200).json("login not yet implemented");
            // Set up email

            // if we have an email and a name,
            // check if the user already has an account
            usersController.findMePrivate(email).then(user => {
                // if the user exists, log the user in
                console.log(user);
                if(user.email){
                    console.log("creating token...");
                    const token = makeToken(email);
                    const data = {token: token};
                    console.log("session data");
                    console.log(request.session);
                    if(!request.session.user){
                        console.log("Setting session email");
                        request.session.user = user;
                    }
                    if(!request.session.token){
                        console.log("Setting session token");
                        request.session.token = token;
                    }
                    response.send(data);
                } else {
                    // if the user does not exist,
                    // create a new user account with the name
                    // and email and then log the user in
                    console.log("Creating user...");
                    let firstName;
                    let lastName;
                    let displayName;
                    if(name.indexOf(' ') > 0){
                        const names = name.split(' ');
                        firstName = names[0];
                        displayName = firstName.charAt(0).toUpperCase();
                        if(names.length > 1) {
                            lastName = names[names.length - 1];
                            displayName = displayName + lastName.charAt(0).toUpperCase();
                        }
                    }
                    const newUser = {
                        email: request.body.email,
                        displayName: displayName,
                        firstName: firstName,
                        lastName: lastName,
                    }
                    usersController.createPrivate(newUser).then(user => {
                        const token = makeToken(user.email);
                        const data = {
                            user: user,
                            token: token
                        }
                        response.json(data);
                    })
                    .catch(error => {
                        console.log(error);
                        response.status(422).send();
                    })
                    
                }
            })
            .catch(error => {
                console.log(error)
                reponse.status(400).send();
            });
                

            
        } else {
            response.status(400).send({message: "Bad request"});
        }
        
    });

// Matches with '/api/login/validate'
router.route("/validate")
    .post((request, response) => {
        const token = request.body.token;
        if (!token) {
            response.status(403).send("Can't verify user.")
            return
        }
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        } catch {
            response.status(403).send("Invalid auth credentials.")
            return
        }
        if (!decoded.hasOwnProperty("email") || !decoded.hasOwnProperty("expirationDate")) {
            response.status(403).send("Invalid auth credentials.")
            return
        }
        const { expirationDate } = decoded
        if (expirationDate < new Date()) {
            res.status(403).send("Token has expired.")
            return
        }
        response.status(200).send("User has been validated.")
    });

module.exports = router;