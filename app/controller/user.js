'use strict';

const { Controller } = require('egg');
const { generateCode } = require('../utils/common');

const userCreateRules = {
  username: 'email',
  password: { type: 'password', min: 8 },
};

const sendCodeRules = {
  cellPhone: { type: 'string', format: /^1[3-9]\d{9}$/, message: '手机号码格式错误' },
};

class UserController extends Controller {

  validateUserInput(rules) {
    const { ctx, app } = this;
    const errors = app.validator.validate(rules, ctx.request.body);
    return errors;
  }

  async createByEmail() {
    const { ctx, service } = this;
    const errors = this.validateUserInput(userCreateRules);
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
    const { username } = ctx.state.user;
    const userData = await service.user.findByUsername(username);
    ctx.helper.success({ ctx, res: userData, message: '登陆成功' });
  }

  async loginByEmail() {
    const { ctx, service, app } = this;
    const errors = this.validateUserInput(userCreateRules);
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

    const { secret } = app.config.jwt;
    const token = app.jwt.sign({ username: user.username }, secret, { expiresIn: 60 * 60 });
    ctx.helper.success({ ctx, res: { token } });
  }

  async genVeriCode() {
    //
  }

  async sendVeriCode() {
    const { ctx, app } = this;
    // check user input
    const errors = this.validateUserInput(sendCodeRules);
    if (errors) {
      return ctx.helper.error({ ctx, error: errors, errorType: 'userValidateFail' });
    }
    const { cellPhone } = ctx.request.body;
    const key = `phoneVeriCode-${cellPhone}`;
    const preVeriCode = await app.redis.get(key);
    if (preVeriCode) {
      return ctx.helper.error({ ctx, errorType: 'sendVeriCodeFrequentlyFailInfo' });
    }
    const veriCode = generateCode();
    await app.redis.set(key, veriCode, 'ex', '60');
    ctx.helper.success({ ctx, res: { veriCode }, message: '请求成功' });
  }

  async loginByPhoneNumber() {
    const { ctx, app, service } = this;
    const errors = this.validateUserInput(sendCodeRules);
    if (errors) {
      return ctx.helper.error({ ctx, errorType: 'userValidateFail', error: errors });
    }
    const { cellPhone, veriCode } = ctx.request.body;
    const key = `phoneVeriCode-${cellPhone}`;
    const preVeriCode = await app.redis.get(key);

    if (veriCode !== preVeriCode) {
      return ctx.helper.error({ ctx, errorType: 'userValidateFail', error: errors });
    }

    let userData = await service.user.findByPhoneNumber(cellPhone);
    if (!userData) {
      userData = await service.user.createByPhoneNumber(cellPhone);
    }

    return ctx.helper.success({ ctx, res: { user: userData }, message: '登陆成功' });
  }

}

module.exports = UserController;
