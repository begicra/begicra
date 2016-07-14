'use strict';

function addInfos(users) {
  return users
    .map(user => {
      user.isAdmin = user.name === 'admin';
      return user;
    });
}

class UserManager {
  constructor(db) {
    this.db = db;
  }

  getAll() {
    const sql = 'select name from users';
    return this.db.each(sql)
      .then(users => addInfos(users));
  }
}

module.exports = UserManager;
