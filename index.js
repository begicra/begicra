const express = require('express');
const virtual = require('./libs/virtual-middleware');

const app = express();
require('express-ws')(app);

const Database = require('./database/database');
const LoggingDatabase = require('./database/logging-database');
const database = new LoggingDatabase(new Database());
database.initialize();

const dashboard = require('./dashbaord/dashboard');
const bbs = require('./bbs/bbs');
const monitor = require('./monitor/monitor');

const globalMonitor = monitor();
database.setInterceptor(globalMonitor.interceptor);

const environment = {
  databases: {},
  monitors: {},

  getDatabase(id) {
    let db = this.databases[id];
    if (!db) {
      this.databases[id] = db = new LoggingDatabase(new Database());
      db.initialize();
      db.setInterceptor(this.getMonitor(id).interceptor);
    }
    return db;
  },
  getMonitor(id) {
    const mon = this.monitors[id] = this.monitors[id] || monitor();
    return mon;
  },
  getId(pathname) {
    return pathname.replace(/^\/app\/([a-zA-Z0-9]+)\/[a-z]+/, '$1');
  },
};

// 環境ごと
app.use(/\/app\/[a-zA-Z0-9]+\/bbs/, virtual(pathname => {
  const db = environment.getDatabase(environment.getId(pathname));
  return bbs(db);
}));
app.use(/\/app\/[a-zA-Z0-9]+\/monitor/, virtual(pathname => {
  return environment.getMonitor(environment.getId(pathname));
}));

// ダッシュボード
app.use('/', dashboard);

app.listen(3000);

setInterval(() => globalMonitor.interceptor.send(JSON.stringify({ type: 'ping' })), 10000);
