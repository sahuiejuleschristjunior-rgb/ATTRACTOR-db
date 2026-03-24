const mongoose = require('mongoose');
const env = require('./env');
const logger = require('../utils/logger');

mongoose.set('strictQuery', true);

const connectDatabase = async () => {
  try {
    await mongoose.connect(env.mongoUri, {
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 10
    });

    logger.info('MongoDB connection established');
  } catch (error) {
    logger.error('MongoDB connection failed', { error: error.message });
    throw error;
  }
};

module.exports = connectDatabase;
