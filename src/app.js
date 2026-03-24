const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const env = require('./config/env');
const routes = require('./routes');
const requestLogger = require('./middlewares/requestLogger');
const notFoundMiddleware = require('./middlewares/notFoundMiddleware');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

app.disable('x-powered-by');
app.use(helmet());
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === env.clientOrigin) {
        return callback(null, true);
      }

      const corsError = new Error('Origin not allowed by CORS policy');
      corsError.statusCode = 403;
      return callback(corsError);
    },
    credentials: true
  })
);
app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true, limit: '1mb' }));
app.use(requestLogger);

app.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: `${env.appName} is healthy`,
    environment: env.nodeEnv,
    uptime: process.uptime()
  });
});

app.use(env.apiPrefix, routes);
app.get('/', (req, res) => res.send('Attractor API is running 🚀'));
app.use(notFoundMiddleware);
app.use(errorHandler);

module.exports = app;
