'use strict';

const Application = require('./application');

const applications = {};

class TimeApplication {
  constructor(id) {
    const application = new Application(id);

    setTimeout(() => this.shutdown(), 1000 * 60 * 60 * 24 * 3);

    this.private = {
      application,
      bbs: (req, res, next) => application.bbs(req, res, next),
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

  shutdown() {
    const application = this.private.application;
    applications[this.id] = null;
    this.private = null;

    return application.shutdown();
  }

  static get(id) {
    console.log(applications);
    const app = applications[id] = applications[id] || new TimeApplication(id);
    return app;
  }

  static fromPathname(pathname) {
    return TimeApplication.get(TimeApplication.getId(pathname));
  }

  static getId(pathname) {
    return Application.getId(pathname);
  }
}

module.exports = TimeApplication;
