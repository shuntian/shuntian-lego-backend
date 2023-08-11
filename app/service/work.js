const { Service } = require('egg');
const { default: mongoose } = require('mongoose');
const { nanoid } = require('nanoid');

class WorkService extends Service {

  async createEmptyWork(payload) {
    const { app, ctx } = this;
    const { username, _id } = ctx.state.user;
    const uuid = nanoid(6);
    const workData = {
      ...payload,
      user: mongoose.Types.ObjectId(_id),
      author: username,
      uuid,
    };
    const work = await app.model.Work.create(workData);
    return work;
  }
}

module.exports = WorkService;
