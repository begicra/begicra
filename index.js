const express = require('express');
const virtual = require('./libs/virtual-middleware');
const Environment = require('./libs/environment');

const app = express();
require('express-ws')(app);

const environment = new Environment();
const dashboard = require('./dashbaord/dashboard');
const bbs = require('./bbs/bbs');

// 環境ごと
app.use(/\/app\/[a-zA-Z0-9]+\/bbs/, virtual(pathname => {
  const db = environment.getDatabase(environment.getId(pathname));
  return bbs(db);
}));
app.use(/\/app\/[a-zA-Z0-9]+\/monitor/,
  virtual(pathname => environment.getMonitor(environment.getId(pathname))));

// ダッシュボード
app.use('/', dashboard);

app.listen(3000);
