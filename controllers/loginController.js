const { User } = require("../models");
const cardController = require("./cardController");
const jwt = require('jsonwebtoken');
const nodeMailer = require("nodemailer");
const generateEmail = require('../utils/EmailGenerator');
const makeToken = require('../utils/TokenGenerator');

module.exports = {
    defaultLogin: function(request, response){
        if(request.session.refreshToken){
            try {
                //console.log('attempting decode...')
                const token = request.session.refreshToken;
                const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                //console.log(decoded);
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
                //console.log(request);
                response.status(400).json(error);
            }
        } else {
            response.status(401).send("Unknown user. Login and request refresh token.");
        }
    },
    defaultLoginLocal: function(request, response){
        console.log(request.user.email);
        request.session.user = request.user;
        const token = makeToken(request.user.email, 1);
        response.status(200).json({token:token});
    },
    refreshToken: function(request, response) {
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
                    request.session.refreshToken = refreshToken;
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
    },
    sendResetEmail: function(request, response){
        let userEmail;
        if(request.body.email){
            userEmail = request.body.email;
        } else if(request.session.token) {
            try {
                const decoded = jwt.verify(request.session.token, process.env.JWT_SECRET_KEY);
                userEmail = decoded.email;
            } catch (error) {
                console.log(error);
                response.status(400).json(error);
            }
        }
        if(userEmail){
            User.findOne({email: userEmail}).then(user => {
                if(user){
                    try{   // generate email with reset link
                        const email = userEmail;
                        console.log("creating email transport");
                        const transport = nodeMailer.createTransport({
                            host: process.env.EMAIL_HOST,
                            port: process.env.EMAIL_PORT,
                            secure: true,
                            auth: {
                                user: process.env.EMAIL_USER,
                                pass: process.env.EMAIL_PASSWORD
                            }
                        });
                        // Make email template for magic link
                        console.log("creating email template");
                       
                        console.log("creating token...");
                        const token = makeToken(email, 24);
                        const link = process.env.NODE_ENV === 'development' ? (`http://localhost:3001/login/${token}`) : (`https://santabingo.app/login/${token}`);
                        const emailHtml = generateEmail(link);
                        const mailOptions = {
                            from: "no-reply@santabingo.app",
                            html: emailHtml,
                            subject: "Password Reset",
                            to: email,
                        };
                        transport.sendMail(mailOptions, (error) => {
                            if (error) {
                                console.error(error);
                                response.status(400).json(error);
                            } else {
                                console.log(`Email sent to ${email}`);
                                response.status(200).send(`pw reset link sent to ${email}`);
                            }
                        });

                    } catch (error) {
                        console.log(error);
                        response.status(400).json(error);
                    }
                } else {
                    response.status(404).send("User not found. Create new user account.")
                }
            })
            .catch(error => {
                console.log(error);
                response.status(422).json(error);
            })
        } else {
            response.status(400).send("No email provided to reset.")
        }
    },
    resetPassword: function(request, response){
        if(request.params.token && request.body.password && request.body.passwordConfirmation){
            if(request.body.password !== request.body.passwordConfirmation){
                response.status(400).send("Password and password confirmation do not match.");
            } else {
                try { 
                    const token = request.params.token;
                    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                    const { email, expirationDate } = decoded;
                    const expirationDateObject = new Date(expirationDate);
                    if(expirationDateObject < new Date()){
                        response.status(403).send("Reset token no longer valid. Request new password reset token.");
                    } else {
                        User.findOne({email: email}).then(user => {
                            user.password = request.body.password;
                            user.save().then(updatedUser => {
                                if(user === updatedUser){
                                    response.status(200).send("password updated")
                                } else {
                                    response.status(422).send("error updating password");
                                }
                            })
                            .catch(error => {
                                console.log(error);
                                response.status(400).json(error);
                            })
                        })
                        .catch(error => {
                            console.log(error);
                            response.status(400).json(error);
                        })
                    }
                } catch (error) {
                    console.log(error);
                    response.status(400).json(error);
                }
            }
        } else {
            response.status(404).send("Not Found");
        }
    },
    newUserAccount: function(request, response){
        if(request.body.email){
            User.findOne({email: request.body.email}).then(dbResult => {
                if(!dbResult){
                    User.create(request.body).then(user => {
                        if(user){
                            // create 3 new cards for this user
                            cardController.createMany(user._id, 3).then(cards => {
                                const token = makeToken(user.email, 1);
                                if(!cards){
                                    console.log('no cards created');
                                }
                                response.status(200).json({token: token});
                            })
                            .catch(error => {
                                console.log(error);
                                response.status(422).json(error);
                            })                            
                        } else {
                            response.status(400).send("error creating user");
                        }
                    })
                    .catch(error => {
                        console.log(error);
                        response.status(422).json(error.message);
                    })
                } else {
                    response.status(409).send('Email address already registered.')
                }
            })
            .catch(error => {
                console.log(error);
                response.status(400).json(error);
            })
        }
        
    }
}