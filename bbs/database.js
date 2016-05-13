'use strict';

const sqlite3 = require('sqlite3').verbose();

class Database {
  constructor() {
    this.db_ = new sqlite3.Database(':memory:');
  }

  initialize() {
    return Promise.resolve()
      .then(() => this.run('create table users(id integer primary key autoincrement, name, password)'))
      .then(() => this.run('create table posts(id integer primary key autoincrement, context)'))
      .then(() => this.run('insert into users(name, password) values(\'admin\', \'admin\')'))
      .then(() => this.run('insert into users(name, password) values(\'user1\', \'user1\')'))
      .then(() => this.run('insert into users(name, password) values(\'user2\', \'user2\')'))
      .then(() => this.run('insert into users(name, password) values(\'user3\', \'user3\')'));
  }

  run(sql) {
    return new Promise((resolve, reject) => {
      this.db_.run(sql, {}, function (error) {
        if (error) {
          reject(error);
          return;
        }

        resolve(this);
      });
    });
  }
  each(sql) {
    return new Promise((resolve, reject) => {
      const rows = [];

      this.db_.each(sql, (error, row) => {
        if (error) {
          reject(error);
          return;
        }
        rows.push(row);
      }, error => {
        if (error) {
          reject(error);
        } else {
          resolve(rows);
        }
      });
    });
  }
}

module.exports = Database;
