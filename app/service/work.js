const { Service } = require('egg');
const { default: mongoose } = require('mongoose');
const { nanoid } = require('nanoid');

const defaultIndexCondition = {
  pageIndex: 0,
  pageSize: 10,
  select: '',
  populate: '',
  customSort: { createAt: -1 },
  find: {},
};

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

  async getList(condition) {
    const fCondition = { ...defaultIndexCondition, ...condition };
    const { pageIndex, pageSize, select, populate, customSort, find } = fCondition;
    const skip = pageIndex * pageSize;

    const res = await this.ctx.model.Work
      .find(find)
      .select(select)
      .populate(populate)
      .skip(skip)
      .limit(pageSize)
      .sort(customSort)
      .lean();
    const count = await this.ctx.model.Work.find(find).count();

    return { count, list: res, pageSize, pageIndex };
  }
}

module.exports = WorkService;
