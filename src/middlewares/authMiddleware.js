const AppError = require('../utils/appError');
const { verifyToken } = require('../utils/jwt');

const authenticate = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    req.user = verifyToken(token);
    return next();
  } catch (_error) {
    return next(new AppError('Invalid or expired token', 401));
  }
};

module.exports = {
  authenticate
};
