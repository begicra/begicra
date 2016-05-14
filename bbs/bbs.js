'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const router = express.Router(); // eslint-disable-line new-cap
const Authentication = require('./authentication');
const BoardManager = require('./board-manager');

function bbs(db) {
  const authentication = new Authentication(db);
  const boardManager = new BoardManager(db);

  function validateAuthentication(req, res, next) {
    if (req.session.user) {
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
      maxAge: 24 * 60 * 60 * 1000,
    },
  }));

  // ログイン/ログアウト
  router
    .get('/login', (req, res) => {
      const file = fs.readFileSync(path.join(__dirname, 'templates/login.html'), 'utf8');
      const template = _.template(file);
      res.send(template({
        loginId: '',
        password: '',
        errors: [],
      }));
    })
    .post('/login', (req, res) => {
      const input = {
        loginId: req.body.loginId,
        password: req.body.password,
        errors: [],
      };

      // ユーザー名とパスワードを確認
      authentication.validate(input.loginId, input.password)
        .then(() => {
          const session = req.session;
          session.user = {
            name: input.loginId,
          };

          res.redirect('/bbs');
        })
        .catch(() => {
          const errors = input.errors;
          errors.push('Login ID または Password が異なります');

          const file = fs.readFileSync(path.join(__dirname, 'templates/login.html'), 'utf8');
          const template = _.template(file);
          res.send(template(input));
        });
    });
  router.get('/logout', (req, res) => {
    const session = req.session;
    session.user = null;

    res.redirect('/bbs/login');
  });

  // 静的ファイル
  router.use('/', express.static(path.join(__dirname, 'static')));

  // 掲示板
  router
    .get('/', validateAuthentication, (req, res) => {
      boardManager.getAll()
        .then(rows => {
          const file = fs.readFileSync(path.join(__dirname, 'templates/bbs.html'), 'utf8');
          const template = _.template(file);
          res.send(template({
            owner: req.session.user.name,
            rows,
          }));
        });
    });
  router.post('/post', (req, res) => {
    const post = {
      title: req.body.title,
      body: req.body.body,
      owner: req.body.owner,
    };
    boardManager.add(post)
      .then(() => res.redirect('/bbs'));
  });

  return router;
}

module.exports = bbs;
