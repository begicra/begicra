'use strict';

const _ = require('underscore');

class BoardManager {
  constructor(db) {
    this.db = db;
  }

  getAll() {
    const sql = 'select * from boards order by posted desc';
    return this.db.each(sql);
  }
  getBoards() {
    const sql = `
select * from boards
where draft = 0
order by posted desc
`;
    return this.db.each(sql);
  }
  getDrafts(owner) {
    const sql = `
select * from boards
where draft != 0 and owner = '${owner}'
order by posted desc
`;
    return this.db.each(sql);
  }
  getById(id) {
    const sql = `select * from boards where id = ${id}`;
    return this.db.each(sql)
      .then(rows => _.first(rows));
  }
  add(post) {
    const sql = `
insert into boards(title, body, draft, owner, posted)
values('${post.title}', '${post.body}',  ${post.draft ? 1 : 0}, '${post.owner}', datetime('now'))
`;
    return this.db.run(sql);
  }
  save(post) {
    const sql = `
update boards set
  title = '${post.title}',
  body = '${post.body}',
  draft = ${post.draft ? 1 : 0},
  owner = '${post.owner}'
where id = ${post.id}
`;
    return this.db.run(sql);
  }
  remove(id) {
    const sql = `delete from boards where id = ${id}`;
    return this.db.run(sql);
  }
}

module.exports = BoardManager;
