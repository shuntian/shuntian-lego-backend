#! /bin/bash
# shell 脚本中发生错误, 即命令返回值不等于0,则停止执行并推出 shell
set -e
mongosh << EOF
use admin
db.createUser({
  user: '$MONGO_INITDB_ROOT_USERNAME',
  pwd: '$MONGO_INITDB_ROOT_PASSWORD',
  roles: [{ role: 'userAdminAnyDatabase', db: 'admin' }],
})
db.auth('$MONGO_INITDB_ROOT_USERNAME', '$MONGO_INITDB_ROOT_PASSWORD')
use lego
db.createUser({
  user: '$MONGO_DB_USERNAME',
  pwd: '$MONGO_DB_PASSWORD',
  roles: [{ role: 'readWrite', db: 'lego' }],
})
db.createCollection('works')
db.works.insertMany([{
  id: 19,
  title: '1024 程序员日',
  desc: '1024 程序员日',
  author: '122****8721',
  coverImg: '',
  copiedCount: 123,
  isHot: true,
  isTemplate: true,
  createdAt: '2022-11-23T09:02:13:000Z',
}])
EOF
