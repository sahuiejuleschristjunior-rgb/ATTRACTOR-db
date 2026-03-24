const http = require('http');
const app = require('./app');
const env = require('./config/env');
const connectDatabase = require('./config/database');
const logger = require('./utils/logger');

const server = http.createServer(app);

const startServer = async () => {
  try {
    await connectDatabase();

    server.listen(env.port, () => {
      logger.info(`${env.appName} listening on port ${env.port}`);
    });
  } catch (error) {
    logger.error('Server startup failed', { error });
    process.exit(1);
  }
};

const shutdown = (signal) => {
  logger.warn(`Received ${signal}. Closing HTTP server.`);
  server.close(() => {
    logger.info('HTTP server closed gracefully');
    process.exit(0);
  });
};

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('unhandledRejection', (reason) => {
  logger.error('Unhandled rejection detected', { error: reason });
});
process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception detected', { error });
  process.exit(1);
});

startServer();
