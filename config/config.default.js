/* eslint valid-jsdoc: "off" */

'use strict';

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
      options: {},
    },
  };

  config.jwt = {
    secret: '12345678',
  };

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  };

  return {
    ...config,
    ...userConfig,
  };
};
