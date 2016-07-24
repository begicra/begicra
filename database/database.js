'use strict';

const sqlite3 = require('sqlite3').verbose();

class Database {
  constructor() {
    this.db = new sqlite3.Database(':memory:');
  }

  initialize() {
    const run = sql => () => this.run(sql);

    function initializeUsers() {
      return Promise.resolve()
        .then(run('create table users(id integer primary key autoincrement, name, password)'))
        .then(run('insert into users(name, password) values(\'admin\', \'admin\')'))
        .then(run('insert into users(name, password) values(\'user1\', \'user1\')'))
        .then(run('insert into users(name, password) values(\'user2\', \'user2\')'))
        .then(run('insert into users(name, password) values(\'user3\', \'user3\')'));
    }

    function initializeBoards() {
      return Promise.resolve()
        .then(run(`
create table boards(id integer primary key autoincrement, title, body, draft, owner, posted)
`))
        .then(run(`
insert into boards(title, body, draft, owner, posted)
values('テスト投稿', 'これはテスト投稿です。
今日はいい天気',
0,
'admin',
datetime('now'))
`));
    }

    return Promise.resolve()
      .then(() => initializeUsers())
      .then(() => initializeBoards());
  }

  run(sql) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, {}, error => {
        if (error) {
          reject(error);
        } else {
          resolve(this);
        }
      });
    });
  }
  each(sql) {
    return new Promise((resolve, reject) => {
      const rows = [];

      this.db.each(sql, (error, row) => {
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

  shutdown() {
    this.db.close();
    this.db = null;
  }
}

module.exports = Database;
