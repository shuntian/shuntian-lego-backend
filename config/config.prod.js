module.exports = () => {
  const config = {};
  config.baseUrl = 'prop.url';
  // 1. 给 mongoose 和 redis 添加密码
  config.mongoose = {
    url: 'mongodb://lego-mongo:27017/lego',
    options: {
      user: process.env.MONGO_DB_USERNAME,
      pass: process.env.MONGO_DB_PASSWORD,
      authSource: 'lego',
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
  };

  config.redis = {
    client: {
      port: 6379,
      host: 'lego-redis',
      password: process.env.REDIS_PASSWORD,
      db: 0,
    },
  };

  // 2 配置 cors 允许的域名
  config.security = {
    domainWhiteList: [ 'http://shuntiannotes.com', 'http://www.shuntiannotes.com' ],
  };

  // 3 配置 jwt 过期时间
  config.jwtExpires = '2 days';

  // 4 本地 url 替换
  config.githubOauthConfig = {
    redirectURL: 'http://api.shuntiannotes.com/api/users/passport/github/callack',
  };

  config.H5BaseURL = 'http://h5.shuntiannotes.com';
  return config;
};
