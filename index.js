const express = require('express');
const virtual = require('./libs/virtual-middleware');
const Application = require('./libs/application');

const app = express();
require('express-ws')(app);

const dashboard = require('./dashbaord/dashboard');

// 環境ごと
app.use(/\/app\/[a-zA-Z0-9]+\/bbs/,
  virtual(pathname => Application.fromPathname(pathname).bbs));
app.use(/\/app\/[a-zA-Z0-9]+\/monitor/,
  virtual(pathname => Application.fromPathname(pathname).monitor));

// ダッシュボード
app.use('/', dashboard);

app.listen(3000);
