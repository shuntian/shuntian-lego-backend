module.exports = () => {
  return async (ctx, next) => {
    try {
      await next();
    } catch (e) {
      const error = e;
      if (error && error.status === 401) {
        return ctx.helper.error({ ctx, errorType: 'loginValidateFail' });
      }
      throw error;
    }
  };
};
