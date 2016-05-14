const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const router = express.Router();
const Database = require('./database');
const Authentication = require('./authentication');

const db = new Database();
db.initialize();

const authentication = new Authentication(db);

function validateAuthentication(req, res, next) {
  if(req.session.user) {
    next();
  } else {
    res.redirect('/bbs/login');
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
    authentication.validate(input.loginId, input.password)
      .then(() => {
        req.session.user = {
          name: input.loginId
        };

        res.redirect('/bbs');
      })
      .catch(error => {
        console.log(error);
        fs.writeFileSync('error.txt', error);

        input.errors.push('Login ID か Password が違います.');

        const file = fs.readFileSync(path.join(__dirname, 'templates/login.html'), 'utf8');
        const template = _.template(file);
        res.send(template(input));
      });
  });
router.use('/', express.static(path.join(__dirname, 'static')));
router.get('/', validateAuthentication, (req, res) => {
  res.send('BBS');
});
router.get('/error', (req, res) => {
  //res.send('error.txt');
  res.sendFile(__dirname + 'error.txt');
});


module.exports = router;
