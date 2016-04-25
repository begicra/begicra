const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const express = require('express');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const router = express.Router();

function validateAuthentication(req, res, next) {
  if(req.session.user) {
    next();
  } else {
    res.redirect('login');
  }
}

router.use(cookieParser());
router.use(expressSession({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

router.use('/login', (req, res) => {
  const file = fs.readFileSync(path.join(__dirname, 'templates/login.html'), 'utf8');
  const template = _.template(file);
  res.send(template());
});
router.use('/', express.static(path.join(__dirname, 'static')));
router
  .get('/', validateAuthentication, (req, res) => {
    res.send('BBS');
  });

module.exports = router;
