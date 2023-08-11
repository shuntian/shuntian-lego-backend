const userErrorMessages = require('./user');
const workErrorMessages = require('./work');

const globalErrorMessages = {
  ...userErrorMessages,
  ...workErrorMessages,
};

module.exports = {
  globalErrorMessages,
};
