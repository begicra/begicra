'use strict';

const os = require('os');
const usage = require('usage');

class StatisticsManager {
  constructor(pid, Application) {
    this.private = { pid, Application };
  }

  getData() {
    return new Promise((resolve, reject) => {
      usage.lookup(this.private.pid, (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({
            applications: this.getApplications(),
            loadavg: this.getLoadavg(),
            memory: this.getMemory(result),
            cpu: this.getCpu(result),
          });
        }
      });
    });
  }

  getApplications() {
    return this.private.Application.count;
  }

  getLoadavg() {
    const la = os.loadavg();

    return {
      '1min': la[0],
      '5min': la[1],
      '15min': la[2],
    };
  }

  getMemory(result) {
    const total = os.totalmem();
    const free = os.freemem();

    return {
      total,
      free,
      use: total - free,
      process: result.memory,
    };
  }

  getCpu(result) {
    return result.cpu;
  }
}

module.exports = StatisticsManager;
