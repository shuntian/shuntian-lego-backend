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

  async getAccessToken(token) {
    const { ctx, app } = this;
    const { cid, secret, accessTokenURL } = app.config.githubOauthConfig;
    const res = await ctx.curl(accessTokenURL, {
      method: 'POST',
      contentType: 'json',
      dataType: 'json',
      data: {
        client_id: cid,
        client_secret: secret,
        code: token,
      },
      timeout: 10000,
    });
    return res.data;
  }

  async getUserInfo(tokenMessage) {
    const { ctx, app } = this;
    const { access_token, token_type } = tokenMessage;
    const { githubUserAPI } = app.config.githubOauthConfig;
    const res = await ctx.curl(githubUserAPI, {
      method: 'GET',
      dataType: 'json',
      headers: {
        authorization: `${token_type} ${access_token}`,
      },
    });
    return res.data;
  }

  async loginByGithub(code) {
    const { app } = this;
    const tokenMessage = await this.getAccessToken(code);
    const userMessage = await this.getUserInfo(tokenMessage);

    console.log(userMessage);
    const username = `github_${userMessage.id}}`;
    const user = await this.findByUsername(username);
    if (user) {
      const token = app.jwt.sign({ username: user.username }, app.config.jwt.secret, { expiresIn: 60 * 60 });
      return token;
    }

    const userData = {
      oauthID: userMessage.id + '',
      provider: 'github',
      username,
      nickName: userMessage.name,
      picture: userMessage.avatar_url,
      email: userMessage.email,
      type: 'oauth',
    };
    const newUser = await app.model.User.create(userData);
    const token = app.jwt.sign({ username: newUser.username }, app.config.jwt.secret, { expiresIn: 60 * 60 });
    return token;
  }

}

module.exports = UserService;
