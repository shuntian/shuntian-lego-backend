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

  async loginByCellPhone(phoneNumber) {
    const { app } = this;
    const user = await this.findByUsername(phoneNumber);
    if (user) {
      const token = app.jwt.sign({ username: user.username }, app.config.jwt.secret, { expiresIn: 60 * 60 });
      return token;
    }
    const userData = {
      phoneNumber,
      username: phoneNumber,
      nickName: `lego-${phoneNumber.slice(-4)}`,
      type: 'cellPhone',
    };

    const newUser = await app.model.User.create(userData);
    const token = app.jwt.sign({ username: newUser.username }, app.config.jwt.secret, { expiresIn: 60 * 60 });
    return token;
  }

}

module.exports = UserService;
