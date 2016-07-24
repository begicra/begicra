'use strict';

const Database = require('../database/database');
const LoggingDatabase = require('../database/logging-database');
const monitor = require('../monitor/monitor');
const bbs = require('../bbs/bbs');

const applications = {};

class Application {
  constructor(id) {
    const mon = monitor();
    const database = new LoggingDatabase(new Database());
    database.setInterceptor(mon.interceptor);
    const app = bbs(database);

    database.initialize();
    this.private = {
      id,
      database,
      monitor: mon,
      bbs: app,
    };
  }

  get id() {
    return this.private.id;
  }

  get bbs() {
    return this.private.bbs;
  }

  get monitor() {
    return this.private.monitor;
  }

  static get(id) {
    const app = applications[id] = applications[id] || new Application(id);
    return app;
  }

  static fromPathname(pathname) {
    return Application.get(Application.getId(pathname));
  }

  static getId(pathname) {
    return pathname.replace(/^\/app\/([a-zA-Z0-9]+)\/[a-z]+/, '$1');
  }
}

module.exports = Application;
