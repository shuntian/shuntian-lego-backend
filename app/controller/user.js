'use strict';

const { Controller } = require('egg');
const { sign } = require('jsonwebtoken');

const userCreateRules = {
  username: 'email',
  password: { type: 'password', min: 8 },
};

class UserController extends Controller {

  validateUserInput() {
    const { ctx, app } = this;
    const errors = app.validator.validate(userCreateRules, ctx.request.body);
    return errors;
  }

  async createByEmail() {
    const { ctx, service } = this;
    const errors = this.validateUserInput();
    if (errors) {
      return ctx.helper.error({ ctx, errorType: 'userValidateFail', error: errors });
    }
    const { username } = ctx.request.body;
    const user = await service.user.findByUsername(username);
    if (user) {
      return ctx.helper.error({ ctx, errorType: 'createUserAlreadyExists' });
    }
    const userData = await service.user.createByEmail(ctx.request.body);
    ctx.helper.success({ ctx, res: userData });
  }

  async show() {
    const { ctx, service } = this;
    const userData = await service.user.findByUsername(ctx.state.user.username);
    ctx.helper.success({ ctx, res: userData, message: '登陆成功' });
  }

  async loginByEmail() {
    const { ctx, service, app } = this;
    const errors = this.validateUserInput();
    if (errors) {
      return ctx.helper.error({ ctx, errorType: 'userValidateFail', error: errors });
    }
    const { username, password } = ctx.request.body;
    const user = await service.user.findByUsername(username);
    if (!user) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo' });
    }

    const verifyPwd = await ctx.compare(password, user.password);
    if (!verifyPwd) {
      return ctx.helper.error({ ctx, errorType: 'loginCheckFailInfo' });
    }

    const token = sign({ username: user.username }, app.config.secret, { expiresIn: 60 * 60 });
    ctx.helper.success({ ctx, res: { token } });
  }

  async genVeriCode() {
    //
  }

  async loginByPhoneNumber() {
    //
  }

}

module.exports = UserController;
