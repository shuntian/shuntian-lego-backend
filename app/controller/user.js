'use strict';

const { Controller } = require('egg');

const userCreateRules = {
  username: 'email',
  password: { type: 'password', min: 8 },
};

class UserController extends Controller {

  async createByEmail() {
    const { ctx, service, app } = this;
    const { username } = ctx.request.body;
    const errors = app.validator.validate(userCreateRules, ctx.request.body);
    if (errors) {
      return ctx.helper.error({ ctx, errorType: 'userValidateFail', error: errors });
    }
    const user = await service.user.findByUsername(username);
    if (user) {
      return ctx.helper.error({ ctx, errorType: 'createUserAlreadyExists' });
    }
    const userData = await service.user.createByEmail(ctx.request.body);
    ctx.helper.success({ ctx, res: userData });
  }

  async show() {
    const { ctx, service } = this;
    const userData = await service.user.findById(ctx.params.id);
    ctx.helper.success({ ctx, res: userData });
  }

  async loginByEmail() {
    const { ctx, service } = this;
    const { username, password } = ctx.request.body;
    const user = await service.user.findByUsername(username);
    if (!user) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo' });
    }

    const verifyPwd = await ctx.compare(password, user.password);
    if (!verifyPwd) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo' });
    }

    ctx.helper.success({ ctx, res: user });
  }

  async genVeriCode() {
    //
  }

  async loginByPhoneNumber() {
    //
  }

}

module.exports = UserController;
