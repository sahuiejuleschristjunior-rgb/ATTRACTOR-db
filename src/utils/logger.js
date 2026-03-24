const formatPayload = (payload = {}) => {
  const data = { ...payload };

  if (data.error instanceof Error) {
    data.error = {
      message: data.error.message,
      stack: data.error.stack
    };
  }

  return Object.keys(data).length > 0 ? ` ${JSON.stringify(data)}` : '';
};

const log = (level, message, payload) => {
  const timestamp = new Date().toISOString();
  console[level](`[${timestamp}] ${level.toUpperCase()}: ${message}${formatPayload(payload)}`);
};

module.exports = {
  info: (message, payload) => log('info', message, payload),
  warn: (message, payload) => log('warn', message, payload),
  error: (message, payload) => log('error', message, payload)
};
