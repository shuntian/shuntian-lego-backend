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

}

module.exports = WorkController;
