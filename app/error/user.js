const userErrorMessages = {
  userValidateFail: {
    errno: 101001,
    message: '输入信息验证失败',
  },
  createUserAlreadyExists: {
    errno: 101002,
    message: '改邮箱已经被注册,请直接登陆',
  },
  loginCheckFailInfo: {
    errno: 101003,
    message: '该用户不存在或者密码错误',
  },
  loginValidateFail: {
    errno: 101004,
    message: '登陆校验失败',
  },
  sendVeriCodeFrequentlyFailInfo: {
    errno: 101005,
    message: '请勿频繁获取短信验证码',
  },
  loginVeriCodeIncorrectFailInfo: {
    errno: '101006',
    message: '验证码不正确',
  },
  sendVeriCodeError: {
    errno: 101007,
    message: '验证码发送失败',
  },
  githubOauthError: {
    errno: 101008,
    message: 'github 授权失败',
  },
};

module.exports = userErrorMessages;
