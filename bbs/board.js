'use strict';

class Board {
  constructor(db) {
    this.db_ = db;
  }
  readPosts(user) {
    // 管理者は全ての投稿を見ることができる
    if (user.name == 'admin') {
      return this.db_.each('select * from posts');
    }

    // 自分の秘密の投稿か公開投稿を見ることができる
    return this.db_.each(`select * from posts where userId = ${user.id} or private = false`);
  }
  writePost(user, post) {
    return this.db_.run(`insert into posts(title, content, userId, private, posted) values('${post.title}', ${post.content}', ${user.id}, ${!!post.private}, datetime('now')`);
  }
  readPost(postId) {
    return this.db_.each(`select * from posts where postId = ${postId}`)
      .then(rows => {
        return rows.length > 0 ? rows[0] : null;
      });
  }
  deletePost(postId) {
    return this.db_.run(`delete from posts where id = ${postId}`);
  }
}

module.exports = Board;
