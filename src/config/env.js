const dotenv = require('dotenv');

dotenv.config();

const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 4000),
  appName: process.env.APP_NAME || 'DB + Attractor',
  apiPrefix: process.env.API_PREFIX || '/api',
  mongoUri: process.env.MONGODB_URI,
  clientOrigin: process.env.CLIENT_ORIGIN,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1d',
  logLevel: process.env.LOG_LEVEL || 'info'
};

const missingVariables = ['MONGODB_URI', 'JWT_SECRET', 'CLIENT_ORIGIN'].filter((key) => !process.env[key]);

if (missingVariables.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVariables.join(', ')}`);
}

module.exports = env;
