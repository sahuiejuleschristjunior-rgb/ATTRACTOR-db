const AppError = require('../utils/appError');
const { verifyToken } = require('../utils/jwt');

const authenticate = (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Unauthorized', 401));
  }

  const token = authHeader.split(' ')[1];

  try {
    const user = verifyToken(token);

    if (!user?.companyId) {
      return next(new AppError('Invalid authentication payload', 401));
    }

    req.user = user;

    return next();
  } catch (_error) {
    return next(new AppError('Invalid or expired token', 401));
  }
};

module.exports = {
  authenticate
};
