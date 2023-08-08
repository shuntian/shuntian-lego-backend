'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  router.get('/ping', controller.home.index);

  router.prefix('/api/v1');

  router.post('/users/create', controller.user.createByEmail);
  router.get('/users/:id', controller.user.show);
  router.post('/users/loginByEmail', controller.user.loginByEmail);

};
