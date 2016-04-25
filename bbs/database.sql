create table users(id integer primary key autoincrement, name, password);
create table posts(id integer primary key autoincrement, context);

insert into users(name, password) values('admin', 'admin');
insert into users(name, password) values('user1', 'user1');
insert into users(name, password) values('user2', 'user2');
insert into users(name, password) values('user3', 'user3');
