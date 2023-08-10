const Service = require('egg').Service;

class UserService extends Service {

  async createByEmail(payload) {
    const { ctx, app } = this;
    const { username, password } = payload;
    const hash = await ctx.genHash(password);
    return app.model.User.create({
      username,
      password: hash,
      email: username,
    });
  }

  async findById(id) {
    const { ctx } = this;
    return ctx.model.User.findById(id);
  }

  async findByUsername(username) {
    const { app } = this;
    return app.model.User.findOne({ username });
  }

  async findByPhoneNumber(phoneNumber) {
    const { app } = this;
    return app.model.User.findOne({ phoneNumber });
  }

  async createByPhoneNumber(phoneNumber) {
    const { app } = this;
    return app.model.User.create({
      phoneNumber,
      username: `lego-${phoneNumber.slice(-4)}`,
      type: 'phone',
    });
  }

}

module.exports = UserService;
