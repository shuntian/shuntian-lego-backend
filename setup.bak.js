/* eslint-disable no-undef */
let db = connect('mongodb://admin:pass@localhost:27017/admin');

db = db.getSiblingDB('lego');
db.createUser({
  user: 'user',
  pwd: 'pass',
  roles: [{ role: 'readwrite', db: 'lego' }],
});
db.createCollection('works');
db.works.insertOne({
  id: 19,
  title: '1024 程序员日',
  desc: '1024 程序员日',
  author: '122****8721',
  coverImg: '',
  copiedCount: 123,
  isHot: true,
  isTemplate: true,
  createdAt: '2022-11-23T09:02:13/000Z',
});
