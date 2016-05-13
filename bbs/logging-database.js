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
    debug(sql);

    return this.database.run(sql);
  }
  each(sql) {
    debug(sql);

    return this.database.each(sql)
      .then(rows => {
        debug(rows);
        return rows;
      });
  }
}

module.exports = LoggingDatabase;
