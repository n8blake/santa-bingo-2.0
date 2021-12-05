//const { request, response } = require('express');
const router = require('express').Router();
const jwt = require('jsonwebtoken');
const usersController = require("../../controllers/usersController");
const loginController = require('../../controllers/loginController');
const passport = require('passport');
const makeToken = require('../../utils/TokenGenerator');

// Matches with '/api/login/'
    //authenticate with passport
router.route('/')
    .get(loginController.defaultLogin)
    .post(
        passport.authenticate('local', { session: true, failureFlash: 'Invalid username or password.' }),
        loginController.defaultLoginLocal
    )
// Matches with '/api/login/refresh/'
router.route('/refresh/')
    .get(loginController.refreshToken)

// Matches with '/api/login/reset/'
router.route('/reset/')
    .all(loginController.sendResetEmail)

// Matches with '/api/login/reset/:token'
router.route('/reset/:token')
    .post(loginController.resetPassword)

// Matches with '/api/login/new/'
router.route('/new/')
    .post(loginController.newUserAccount)
// Matches with '/api/login/old/'

router.route('/check/')
    .post(loginController.checkForAccount)

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