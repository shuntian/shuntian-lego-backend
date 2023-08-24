const uploadErrorMessage = require('./upload');
const userErrorMessages = require('./user');
const workErrorMessages = require('./work');

const globalErrorMessages = {
  ...userErrorMessages,
  ...workErrorMessages,
  ...uploadErrorMessage,
};

module.exports = {
  globalErrorMessages,
};
