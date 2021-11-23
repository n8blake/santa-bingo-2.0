const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;
const CustomStrategy = require('passport-custom').Strategy;
const jwt = require('jsonwebtoken');


const configure = function(passport){
    //console.log('configuring');
    passport.serializeUser(function(user, done){
        done(null, user);
    });
    passport.deserializeUser(function(user, done){
        //console.log(`DeserializeUser called ${id}`);
        done(null, user);
        // User.findById(id, function(error, user){
        //     done(error, user);
        // })
    });

    // Local Strategy
    passport.use(new LocalStrategy({
        usernameField: 'email'
        },
        function(username, password, done) {
            console.log('authenticating...');
          User.findOne({ email: username }, function(err, user) {
              //console.log(user);
              try{
                if (err) { return done(err); }
                if (!user) {
                    console.log('bad email');
                  return done(null, false, { message: 'Incorrect email.' });
                }
                if (!user.validPassword(password)) {
                    console.log('bad password');
                  return done(null, false, { message: 'Incorrect password.' });
                }
                console.log(`authenticated ${user}`);
                return done(null, user);
              } catch (error) {
                  console.error(error);
                  return done(null, false);
              }
            
          });
        }
      ));

    // Custom Strategy
    passport.use('jwt', new CustomStrategy(
        function(request, done){
            if(request.headers.token){
                try {
                    const token = request.headers.token;
                    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
                    if (!decoded.hasOwnProperty("email") || !decoded.hasOwnProperty("expirationDate")) {
                        //response.status(403).send("Invalid auth credentials.")
                        return done(null, false, { message: 'Invalid auth credentials.' });
                    }
                    const { expirationDate } = decoded
                    if(process.env.NODE_ENV === 'development') console.log(expirationDate);
                    const expirationDateObject = new Date(expirationDate);
                    if (expirationDateObject < new Date()) {
                        //res.status(403).send("Token has expired.")
                        return done(null, false, { message: 'Token has expired.' });
                    }
                    User.findOne({ email: decoded.email }).then(user => {
                        if(!user) {
                            return done(null, false)
                        } else {
                            if(process.env.NODE_ENV === 'development') console.log(user.email);
                            return done(null, user);
                        }
                    })
                    .catch(error => {
                        return done(null, false);
                    })
                } catch (error) {
                    console.log(error);
                    return done(null, false);
                }
            } else {
                return done(null, false);
            }
        }
    ))
}

module.exports = configure;
