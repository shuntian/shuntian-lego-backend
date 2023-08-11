const { Controller } = require('egg');

const workRules = {
  title: { type: 'string', require: true },
};

class WorkController extends Controller {

  validateInput(rules) {
    const { ctx, app } = this;
    console.log(ctx.request.body);
    const errors = app.validator.validate(rules, ctx.request.body);
    return errors;
  }

  async createWork() {
    const { ctx, service } = this;
    const errors = this.validateInput(workRules);
    if (errors) {
      return ctx.helper.error({ ctx, error: errors, errorType: 'workValidateFail' });
    }

    const work = await service.work.createEmptyWork(ctx.request.body);
    ctx.helper.success({ ctx, res: { work }, message: '创建成功' });
  }

  async myWoks() {
    const { ctx, service } = this;
    const userId = ctx.state.user._id;
    const { pageIndex, pageSize, isTemplate, title } = ctx.query;
    const findCondition = {
      user: userId,
      ...(title && { title: { $regex: title, $options: 'i' } }),
      ...(isTemplate && { isTemplate: !!parseInt(isTemplate) }),
    };
    const listCondition = {
      select: 'id author copiedCount coverImg desc title user isHot createAt',
      populate: { path: 'user', select: 'username nickName picture' },
      find: findCondition,
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
      ...(pageSize && { pageSize: parseInt(pageSize) }),
    };

    const res = await service.work.getList(listCondition);
    ctx.helper.success({ ctx, res });
  }

  async templateList() {
    const { ctx, service } = this;
    const { pageIndex, pageSize } = ctx.query;
    const listCondition = {
      select: 'id author copiedCount coverImg desc title user isHot createAt',
      populate: { path: 'user', select: 'username nickName picture' },
      find: { isTemplate: true, isPublic: true },
      ...(pageIndex && { pageIndex: parseInt(pageIndex) }),
      ...(pageSize && { pageSize: parseInt(pageSize) }),
    };

    const res = await service.work.getList(listCondition);
    ctx.helper.success({ ctx, res });
  }

  async checkPermission(id) {
    const { ctx } = this;
    const userId = ctx.state.user._id;
    const work = await this.ctx.model.Work.findOne({ id });
    if (!work) {
      return false;
    }
    console.log(userId);
    return work.user.toString() === userId;
  }

  async updateWork() {
    const { ctx } = this;
    const { id } = ctx.params;
    const permission = await this.checkPermission(id);
    if (!permission) {
      return ctx.helper.error({ ctx, errorType: 'workNotExist' });
    }
    const payload = ctx.request.body;
    console.log(id);
    const res = await this.ctx.model.Work.findOneAndUpdate({ id }, payload, { new: true }).lean();
    ctx.helper.success({ ctx, res });
  }

  async deleteWork() {
    const { ctx } = this;
    const { id } = ctx.params;
    const permission = await this.checkPermission(id);
    if (!permission) {
      return ctx.helper.error({ ctx, errorType: 'workNotExist' });
    }
    const res = await this.ctx.model.Work.findOneAndDelete({ id }).select('id _id title').lean();
    ctx.helper.success({ ctx, res });
  }

}

module.exports = WorkController;
