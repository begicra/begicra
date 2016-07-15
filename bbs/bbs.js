'use strict';

const path = require('path');
const fs = require('fs');
const _ = require('underscore');
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const Authentication = require('./authentication');
const BoardManager = require('./board-manager');
const UserManager = require('./user-manager');

function bbs(db) {
  const authentication = new Authentication(db);
  const boardManager = new BoardManager(db);
  const userManager = new UserManager(db);

  function validateAuthentication(req, res, next) {
    if (req.session.user && req.session.user.name) {
      next();
    } else {
      res.redirect(path.join(req.baseUrl, 'login'));
    }
  }

  const router = express.Router(); // eslint-disable-line new-cap

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
            isAdmin: input.loginId === 'admin',
          };

          res.redirect('./');
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
    session.user = {};

    res.redirect('./login');
  });

  // 静的ファイル
  router.use('/', express.static(path.join(__dirname, 'static')));

  // 会員リスト
  router.get('/users', (req, res) => {
    userManager.getAll()
      .then(users => {
        const file = fs.readFileSync(path.join(__dirname, 'templates/users.html'), 'utf8');
        const template = _.template(file);
        res.send(template({ login: req.session.user, users }));
      });
  });

  // 掲示板
  router
    .get('/', validateAuthentication, (req, res) => {
      boardManager.getAll()
        .then(rows => {
          const file = fs.readFileSync(path.join(__dirname, 'templates/bbs.html'), 'utf8');
          const template = _.template(file);
          res.send(template({
            login: req.session.user,
            owner: req.session.user.name,
            rows,
          }));
        });
    });
  router
    .get('/new', (req, res) => {
      const file = fs.readFileSync(path.join(__dirname, 'templates/new.html'), 'utf8');
      const template = _.template(file);
      res.send(template({
        login: req.session.user,
        owner: req.session.user.name,
      }));
    });
  router.get('/:id', (req, res) => {
    const id = req.params.id;

    boardManager.getById(id)
      .then(row => {
        const file = fs.readFileSync(path.join(__dirname, 'templates/post.html'), 'utf8');
        const template = _.template(file);
        res.send(template({
          login: req.session.user,
          row: row || {},
        }));
      });
  });
  router.get('/:id/edit', (req, res) => {
    const id = req.params.id;

    boardManager.getById(id)
      .then(row => {
        const file = fs.readFileSync(path.join(__dirname, 'templates/edit.html'), 'utf8');
        const template = _.template(file);
        res.send(template({
          login: req.session.user,
          row: row || {},
        }));
      });
  });
  router.post('/:id/edit', (req, res) => {
    const post = {
      id: req.body.id,
      title: req.body.title,
      body: req.body.body,
      owner: req.body.owner,
    };

    boardManager.save(post)
      .then(() => res.redirect(`../${post.id}`));
  });
  router.get('/:id/delete', (req, res) => {
    const id = req.params.id;

    boardManager.remove(id)
      .then(() => res.redirect('../'));
  });
  router.post('/post', (req, res) => {
    const post = {
      title: req.body.title,
      body: req.body.body,
      owner: req.body.owner,
    };
    boardManager.add(post)
      .then(() => res.redirect('./'));
  });

  return router;
}

module.exports = bbs;
