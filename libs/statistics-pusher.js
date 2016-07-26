'use strict';

const Milkcocoa = require('milkcocoa');
const StatisticsManager = require('./statistics-manager');

class StatisticsPusher {
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

    const manager = new StatisticsManager(process.pid, Application);
    const milkcocoa = new Milkcocoa(milkcocoaApp);
    const dataStore = milkcocoa.dataStore(dataStoreName);

    return new StatisticsPusher(dataStore, manager);
  }
}

module.exports = StatisticsPusher;
