const AppError = require('../utils/appError');

const notFoundMiddleware = (req, _res, next) => {
  next(new AppError(`Route not found: ${req.originalUrl}`, 404));
};

module.exports = notFoundMiddleware;
