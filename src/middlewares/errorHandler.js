const mongoose = require('mongoose');
const AppError = require('../utils/appError');
const logger = require('../utils/logger');
const env = require('../config/env');

const errorHandler = (error, req, res, _next) => {
  let normalizedError = error;

  if (error instanceof mongoose.Error.CastError) {
    normalizedError = new AppError(`Invalid identifier: ${error.value}`, 400);
  }

  if (error instanceof mongoose.Error.ValidationError) {
    normalizedError = new AppError(
      'Database validation failed',
      400,
      Object.values(error.errors).map((entry) => entry.message)
    );
  }

  if (error && error.code === 11000) {
    normalizedError = new AppError('Duplicate value violates a unique constraint', 409, error.keyValue);
  }

  const statusCode = normalizedError.statusCode || 500;
  const message = normalizedError.message || 'Internal server error';

  logger.error('Request failed', {
    method: req.method,
    path: req.originalUrl,
    statusCode,
    error: normalizedError
  });

  res.status(statusCode).json({
    success: false,
    message,
    details: normalizedError.details || null,
    ...(env.nodeEnv === 'development' ? { stack: normalizedError.stack } : {})
  });
};

module.exports = errorHandler;
