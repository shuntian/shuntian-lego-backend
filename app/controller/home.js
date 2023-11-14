'use strict';

const { Controller } = require('egg');
const { version: appVersion } = require('../../package.json');

class HomeController extends Controller {
  async index() {
    const { ctx } = this;
    const { status } = ctx.app.redis;
    const { version } = ctx.app.mongoose.connection.db.command({ buildInfo: 1 });
    ctx.helper.success({ ctx, res: {
      dbVersion: version,
      redisStatus: status,
      appVersion,
    } });
  }
}

module.exports = HomeController;
