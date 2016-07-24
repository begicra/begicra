'use strict';

const Database = require('../database/database');
const LoggingDatabase = require('../database/logging-database');
const monitor = require('../monitor/monitor');

class Environment {
  constructor() {
    this.databases = {};
    this.monitors = {};
  }

  getDatabase(id) {
    let db = this.databases[id];
    if (!db) {
      this.databases[id] = db = new LoggingDatabase(new Database());
      db.initialize();
      db.setInterceptor(this.getMonitor(id).interceptor);
    }
    return db;
  }

  getMonitor(id) {
    const mon = this.monitors[id] = this.monitors[id] || monitor();
    return mon;
  }

  getId(pathname) {
    return pathname.replace(/^\/app\/([a-zA-Z0-9]+)\/[a-z]+/, '$1');
  }
}

module.exports = Environment;
