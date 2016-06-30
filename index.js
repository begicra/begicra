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

database.setInterceptor(monitor.interceptor);

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
    const m = this.monitors[id] = this.monitors[id] || monitor;
    return m;
  },
};

app.use('/bbs', bbs(database));
app.use(/\/app\/[a-zA-Z0-0]+\/bbs/, virtual(id => {
  const db = environment.getDatabase(id);
  return bbs(db);
}));
app.use('/monitor', monitor);
app.use('/', dashboard);

app.listen(3000);

setInterval(() => monitor.interceptor.send(JSON.stringify({ type: 'ping' })), 10000);
