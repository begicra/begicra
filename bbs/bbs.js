const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const router = express.Router();
const Database = require('./database');

const db = new Database();
db.initialize();

function validateAuthentication(req, res, next) {
  if(req.session.user) {
    next();
  } else {
    res.redirect('login');
  }
}

router.use(bodyParser());
router.use(cookieParser());
router.use(expressSession({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 24 * 60 * 60 * 1000
  }
}));

router
  .get('/login', (req, res) => {
    const file = fs.readFileSync(path.join(__dirname, 'templates/login.html'), 'utf8');
    const template = _.template(file);
    res.send(template({
      loginId: '',
      password: '',
      errors: []
    }));
  })
  .post('/login', (req, res) => {
    const input = {
      loginId: req.body.loginId,
      password: req.body.password,
      errors: []
    };

    // ユーザー名とパスワードを確認
    db.each(`select * from users where name = '${input.loginId}' and password = '${input.password}'`)
      .then(rows => {
        if (rows.length > 0) {
          req.session.user = {
            name: input.loginId
          };

          res.redirect('/bbs');
        } else {
          input.errors.push('Login ID または Password が異なります')

          const file = fs.readFileSync(path.join(__dirname, 'templates/login.html'), 'utf8');
          const template = _.template(file);
          res.send(template(input));
        }
      });
  });
router.use('/', express.static(path.join(__dirname, 'static')));
router
  .get('/', validateAuthentication, (req, res) => {
    res.send('BBS');
  });

module.exports = router;
