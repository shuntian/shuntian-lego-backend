const Mongoose = require('mongoose');
const path = require('path');

async function createMongoose(config, app) {
  Mongoose.connection.on('connected', () => {
    app.coreLogger.info(`[egg-mongoose] ${config.url} connected successfully`);
  });

  Mongoose.connection.on('reconnected', () => {
    app.coreLogger.info(`[egg-mongoose] ${config.url} reconnected successfully`);
  });

  try {
    Mongoose.set('strictQuery', false);
    await Mongoose.connect(config.url, config.options);
  } catch (err) {
    err.message = `[egg-mongoose] ${err.message}`;
    app.coreLogger.error(err);
  }

  Mongoose.connection.on('error', err => {
    err.message = `[egg-mongoose] ${err.message}`;
    app.coreLogger.error(err);
  });

  return Mongoose;
}

const loadModelToApp = app => {
  const dir = path.join(app.config.baseDir, 'app/model');
  app.loader.loadToApp(dir, 'model', {
    caseStyle: 'upper',
  });
};

module.exports = app => {
  app.addSingleton('mongoose', createMongoose);
  app.mongoose = Mongoose;
  loadModelToApp(app);
};
