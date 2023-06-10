const { SERVER_ERROR } = require('../utils/errors');

const errorHandler = (err, _, res, next) => {
  const { statusCode = SERVER_ERROR || err.statusCode, message } = err;
  res.status(statusCode).send({
    message:
      statusCode === SERVER_ERROR ? 'На сервере произошла ошибка' : message,
  });
  next();
};

module.exports = errorHandler;
