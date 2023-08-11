'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const jwt = app.middleware.jwt({ secret: app.config.jwt.secret });

  router.get('/ping', controller.home.index);

  router.prefix('/api/v1');

  router.post('/users/create', controller.user.createByEmail);
  router.get('/users/:id', jwt, controller.user.show);
  router.post('/users/loginByEmail', controller.user.loginByEmail);
  router.post('/users/sendVeriCode', controller.user.sendVeriCode);
  router.post('/users/loginByPhoneNumber', controller.user.loginByPhoneNumber);
  router.get('/users/passport/github', controller.user.oauth);
  router.get('/users/passport/github/callback', controller.user.oauthByGithub);

  // work
  router.post('/works/create', jwt, controller.work.createWork);
};
