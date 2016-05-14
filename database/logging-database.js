'use strict';

const debug = require('debug')('express:sql');

class LoggingDatabase {
  constructor(database) {
    this.database = database;
  }

  initialize() {
    this.database.initialize();
  }

  run(sql) {
    this.send(sql);

    return this.database.run(sql);
  }
  each(sql) {
    this.send(sql);

    return this.database.each(sql)
      .then(rows => {
        this.send(rows);
        return rows;
      });
  }

  setInterceptor(interceptor) {
    this.interceptor = interceptor;
  }

  send(data) {
    debug(data);

    if (this.interceptor) {
      this.interceptor.send(data);
    }
  }
}

module.exports = LoggingDatabase;
