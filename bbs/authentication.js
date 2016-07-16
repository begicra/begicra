'use strict';

class Authentication {
  constructor(db) {
    this.db = db;
  }
  validate(loginId, password) {
    const sql = `select * from users where name = '${loginId}' and password = '${password}'`;
    return this.db.each(sql)
      .then(rows => {
        if (rows.length <= 0) {
          throw new Error('Login ID または Password が異なります');
        }
        return rows[0];
      });
  }
}

module.exports = Authentication;
