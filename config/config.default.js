/* eslint valid-jsdoc: "off" */

'use strict';

const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1691020294104_261';

  // add your middleware config here
  config.middleware = [ 'customError' ];

  config.security = {
    csrf: {
      enable: false,
    },
  };

  config.redis = {
    client: {
      port: 6379,
      host: '127.0.0.1',
      password: '',
      db: 0,
    },
  };

  config.mongoose = {
    client: {
      url: 'mongodb://127.0.0.1:27017/lego',
      options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    },
  };

  config.jwt = {
    secret: '12345678',
  };

  // config.multipart = {
  //   mode: 'file',
  //   tmpdir: path.join(appInfo.baseDir, 'uploads'),
  // };

  config.static = {
    dir: [
      { prefix: '/public', dir: path.join(appInfo.baseDir, '/app/public') },
      { prefix: '/uploads', dir: path.join(appInfo.baseDir, '/uploads') },
    ],
  };

  config.oss = {
    client: {
      accessKeyId: process.env.ALC_ACCESS_KEY || '',
      accessKeySecret: process.env.ALC_SECRET_KEY || '',
      bucket: 'shuntian-lego',
      endpoint: 'oss-cn-beijing.aliyuncs.com',
    },
  };

  const githubOauthConfig = {
    cid: process.env.GITHUB_CLIENT_CID,
    secret: process.env.GITHUB_CLIENT_SECRETS,
    authURL: process.env.GITHUB_AUTHORIZE_URL,
    redirectURL: process.env.GITHUB_REDIRECT_URL,
    accessTokenURL: process.env.GITHUB_ACCESS_TOKEN_URL,
    githubUserAPI: process.env.GITHUB_USER_INFO_URL,
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
    githubOauthConfig,
  };

  return {
    ...config,
    ...userConfig,
  };
};
