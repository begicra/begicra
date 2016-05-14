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
    this.sendQuery(sql);

    return this.database.run(sql);
  }
  each(sql) {
    this.sendQuery(sql);

    return this.database.each(sql)
      .then(rows => {
        this.sendRows(rows);
        return rows;
      });
  }

  setInterceptor(interceptor) {
    this.interceptor = interceptor;
  }

  send(data) {
    debug(data);

    if (this.interceptor) {
      this.interceptor.send(JSON.stringify(data));
    }
  }

  sendQuery(sql) {
    this.send({
      type: 'sql/query',
      sql,
    });
  }
  sendRows(rows) {
    this.send({
      type: 'sql/result',
      rows,
    });
  }
}

module.exports = LoggingDatabase;
