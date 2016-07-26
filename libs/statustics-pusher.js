'use strict';

const Milkcocoa = require('milkcocoa');
const StatusticsManager = require('./statustics-manager');

class StatusticsPusher {
  constructor(dataStore, manager) {
    this.private = { manager, dataStore };
  }

  push() {
    this.private.manager.getData()
      .then(data => this.private.dataStore.push(data));
  }

  static create(Application, optMilkcocoaApp, optDataStoreName) {
    const milkcocoaApp = optMilkcocoaApp ||
      process.env['MILKCOCOA_APP_NAME']; // eslint-disable-line dot-notation
    const dataStoreName = optDataStoreName ||
      process.env['MILKCOCOA_DATASTORE_NAME']; // eslint-disable-line dot-notation

    if (!(milkcocoaApp && dataStoreName)) {
      return undefined;
    }

    const manager = new StatusticsManager(process.pid, Application);
    const milkcocoa = new Milkcocoa(milkcocoaApp);
    const dataStore = milkcocoa.dataStore(dataStoreName);

    return new StatusticsPusher(dataStore, manager);
  }
}

module.exports = StatusticsPusher;
