const router = require('express').Router();
// JWT library
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const Users = require('../users/users-model.js');

// for endpoints beginning with /api/auth
router.post('/register', (req, res) => {
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10); // 2 ^ n
  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

router.post('/login', (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        // create token
        const token = makeTokenFromUser(user)
        res.status(200).json({
          message: `Welcome ${user.username}!`,
          // send token back
          token,s
        });
      } else {
        res.status(401).json({ message: 'Invalid Credentials' });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

function makeTokenFromUser(user) {
  const payload = {
    subject: user.id,
    username: user.username,
    // and any data we want to send (but nothing sensitive !)
    roles: ['student']
  };

  const options = {
    expiresIn: '1h',
  };

  const token = jwt.sign(payload, 'secret-GET-IT-FROM-ENV-VARIABLE', options);
  return token;
}

module.exports = router;
