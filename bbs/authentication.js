'use strict';

class Authentication {
  constructor(db) {
    this.db_ = db;
  }
  validate(loginId, password) {
    return this.db_.each(`select * from users where name = '${loginId}' and password = '${password}'`)
      .then(rows => {
        console.log(rows);
        if (rows.length <= 0) {
          throw new Error('Login ID または Password が異なります');
        }

        return {
          id: rows[0].id,
          name: rows[0].name
        }
      });
  }
}

module.exports = Authentication;
