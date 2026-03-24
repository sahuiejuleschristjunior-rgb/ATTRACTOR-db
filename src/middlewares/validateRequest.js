const { validatePayload } = require('../utils/validators');

const validateRequest = (schema, options = {}) => (req, _res, next) => {
  req.validatedBody = validatePayload(req.body, schema, options);
  next();
};

module.exports = validateRequest;
