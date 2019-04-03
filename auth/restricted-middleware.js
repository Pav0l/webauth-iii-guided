const bcrypt = require('bcryptjs');
// import JWT lib
const jwt = require('jsonwebtoken');
const Users = require('../users/users-model.js');

module.exports = (req, res, next) => {
  // check header for authorization with a JWT
  const token = req.headers.authorization;

  if (token) {
    // this takes token, secret and a CB
    jwt.verify(token, 'secret-GET-IT-FROM-ENV-VARIABLE', (error, decodedToken) => {
      if (error) {
        res.status(401).json({ message: 'Not authorized' })
      } else {
        // put the token to the endpoint to the req object, so it can move to another middlewares as AUTHORIZED
        req.decodedToken = decodedToken;
        // move the request along
        next();
      }
    });
  } else {
    res.status(400).json({ message: 'No credentials provided' });
  }
  
  // dont need this any more
/*
  const { username, password } = req.headers;
  
  if (username && password) {
    Users.findBy({ username })
      .first()
      .then(user => {
        if (user && bcrypt.compareSync(password, user.password)) {
          next();
        } else {
          res.status(401).json({ message: 'Invalid Credentials' });
        }
      })
      .catch(error => {
        res.status(500).json({ message: 'Ran into an unexpected error' });
      });
  } else {
    res.status(400).json({ message: 'No credentials provided' });
  }
*/
};
