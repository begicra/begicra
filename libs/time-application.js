'use strict';

const _ = require('underscore');
const Application = require('./application');

const applications = {};

class TimeApplication {
  constructor(id) {
    const application = Application.get(id);

    this.private = {
      application,
      bbs: (req, res, next) => {
        this.private.lastAccess = new Date().getTime();
        application.bbs(req, res, next);
      },
    };
  }

  get id() {
    return this.private.application.id;
  }

  get bbs() {
    return this.private.bbs;
  }

  get monitor() {
    return this.private.application.monitor;
  }

  get elapsedLastAccess() {
    return new Date().getTime() - this.private.lastAccess;
  }

  shutdown() {
    const application = this.private.application;
    applications[this.id] = null;
    this.private = null;

    return application.shutdown();
  }

  static get(id) {
    const app = applications[id] = applications[id] || new TimeApplication(id);
    return app;
  }

  static fromPathname(pathname) {
    return TimeApplication.get(TimeApplication.getId(pathname));
  }

  static getId(pathname) {
    return Application.getId(pathname);
  }

  static get count() {
    return Application.count;
  }

  static erase() {
    const available = _.values(applications)
      .filter(app => !!app)
      .filter(app => app.elapsedLastAccess >= 1000 * 60 * 60 * 24 * 3);
    available.forEach(app => app.shutdown());
  }
}

module.exports = TimeApplication;
