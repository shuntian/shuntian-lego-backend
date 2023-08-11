const inputValidate = (rules, errorType) => {
  return function(prototype, key, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function(...args) {
      const that = this;
      const { ctx, app } = that;
      const errors = app.validator.validate(rules, ctx.request.body);
      if (errors) {
        return ctx.helper.error({ ctx, errorType, error: errors });
      }

      return originalMethod.apply(this, args);
    };
  };
};

module.exports = inputValidate;
