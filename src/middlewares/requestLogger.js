const morgan = require('morgan');
const logger = require('../utils/logger');

morgan.token('body', (req) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return '';
  }

  return JSON.stringify(req.body);
});

const stream = {
  write: (message) => logger.info(message.trim())
};

module.exports = morgan(':method :url :status :response-time ms :body', { stream });
