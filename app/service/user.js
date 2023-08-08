const Service = require('egg').Service;

class UserService extends Service {

  async createByEmail(payload) {
    const { app } = this;
    const { username, password } = payload;
    return app.model.User.create({
      username,
      password,
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

}

module.exports = UserService;
