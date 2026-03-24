const AppError = require('./appError');

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

const normalizeString = (value) => (typeof value === 'string' ? value.trim() : value);

const validateEnum = (value, allowedValues) => allowedValues.includes(value);

const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const validatePhone = (value) => /^[0-9+()\-\s]{7,20}$/.test(value);

const validatePayload = (payload, schema, { allowPartial = false } = {}) => {
  const errors = [];
  const sanitized = {};

  if (allowPartial && Object.keys(payload || {}).length === 0) {
    throw new AppError('Validation failed', 400, ['Request body cannot be empty']);
  }

  for (const [field, rules] of Object.entries(schema)) {
    const value = payload[field];

    if ((value === undefined || value === null || value === '') && rules.required && !allowPartial) {
      errors.push(`${field} is required`);
      continue;
    }

    if (value === undefined) {
      continue;
    }

    const normalizedValue = normalizeString(value);

    if (rules.type === 'string' && !isNonEmptyString(normalizedValue)) {
      errors.push(`${field} must be a non-empty string`);
      continue;
    }

    if (rules.email && !validateEmail(normalizedValue)) {
      errors.push(`${field} must be a valid email address`);
      continue;
    }

    if (rules.phone && !validatePhone(normalizedValue)) {
      errors.push(`${field} must be a valid phone number`);
      continue;
    }

    if (rules.enum && !validateEnum(normalizedValue, rules.enum)) {
      errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
      continue;
    }

    sanitized[field] = normalizedValue;
  }

  if (errors.length > 0) {
    throw new AppError('Validation failed', 400, errors);
  }

  return sanitized;
};

module.exports = {
  validatePayload
};
