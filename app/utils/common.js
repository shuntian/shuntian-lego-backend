const generateCode = () => {
  return (Math.random() * 10000).toFixed(0);
};

module.exports = {
  generateCode,
};
