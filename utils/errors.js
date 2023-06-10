const BAD_REQUEST = 400;
const UNAUTHORIZED = 401;
const FORBIDDEN = 403;
const NOT_FOUND = 404;
const CONFLICT = 409;
const SERVER_ERROR = 500;

class StatusCodeError extends Error {
  // eslint-disable-next-line constructor-super
  constructor(statusCode, errorText = '') {
    let message = errorText;
    if (errorText.length === 0) {
      switch (statusCode) {
        case BAD_REQUEST:
          message = 'Переданы некорректные данные';
          break;
        case UNAUTHORIZED:
          message = 'Требуется авторизация';
          break;
        case FORBIDDEN:
          message = 'Доступ запрещен';
          break;
        case NOT_FOUND:
          message = 'Cервер не может найти запрошенный ресурс';
          break;
        case CONFLICT:
          message = 'Пользователь с таким электронным адресом уже зарегистрирован';
          break;
        case SERVER_ERROR:
          message = 'Внутренняя ошибка сервера';
          return;
        default:
          break;
      }
    }
    super(message);
    this.statusCode = statusCode;
  }
}

const handleError = (err, next) => {
  switch (err.name) {
    case 'CastError':
    case 'ValidationError':
      next(new StatusCodeError(BAD_REQUEST));
      return;
    case 'DocumentNotFoundError':
      next(new StatusCodeError(NOT_FOUND, 'Пользователь с таким id не найден '));
      return;
    case 'MongoServerError':
      if (err.code === 11000) {
        next(
          new StatusCodeError(CONFLICT),
        );
      } else next(SERVER_ERROR, 'Внутренняя ошибка сервера Mongo');
      return;
    default:
      break;
  }
  next(err);
};

module.exports = {
  BAD_REQUEST,
  UNAUTHORIZED,
  FORBIDDEN,
  CONFLICT,
  NOT_FOUND,
  SERVER_ERROR,
  handleError,
  StatusCodeError,
};
