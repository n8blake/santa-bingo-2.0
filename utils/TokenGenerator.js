const jwt = require('jsonwebtoken');

// Login Token Generator
// Generate token
const makeToken = (email, expiryTimeInHours) => {
    const expirationDate = new Date();
    expirationDate.setHours(new Date().getHours() + expiryTimeInHours);
    // Be sure to configure .env with the JWT_SECRET_KEY
    return jwt.sign({ email, expirationDate }, process.env.JWT_SECRET_KEY);
  };

module.exports = makeToken;