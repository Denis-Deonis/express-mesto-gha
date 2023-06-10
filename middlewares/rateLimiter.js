const rateLimit = require('express-rate-limit');

const { NODE_ENV = 'development', MAX_AUTH_ATTEMPTS = 5 } = process.env;

const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: NODE_ENV === 'production' ? MAX_AUTH_ATTEMPTS : 100,
  message:
  'В настоящий момент превышено количество запросов на сервер. Пожалуйста, попробуйте повторить позже',
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = authLimiter;
