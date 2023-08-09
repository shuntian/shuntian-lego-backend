const { verify } = require('jsonwebtoken');

const getTokenValue = ctx => {
  const { authorization } = ctx.header;
  if (!ctx.header || !authorization) {
    return false;
  }
  if (typeof authorization === 'string') {
    const parts = authorization.trim().split(' ');
    if (parts.length === 2) {
      return parts[1];
    }
    return false;
  }

  return false;
};

module.exports = options => {
  return async (ctx, next) => {
    const token = getTokenValue(ctx);
    if (!token) {
      return ctx.helper.error({ ctx, errorType: 'loginValidateFail' });
    }
    const { secret } = options;
    if (!secret) {
      throw new Error('Secret not provider');
    }

    try {
      const decoded = verify(token, secret);
      ctx.state.user = decoded;
      await next();
    } catch (e) {
      return ctx.helper.error({ ctx, errorType: 'loginValidateFail' });
    }
  };
};

