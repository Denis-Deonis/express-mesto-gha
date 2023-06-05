const { celebrate, Joi } = require('celebrate');
const { BAD_REQUEST, StatusCodeError } = require('./errors');

const isURL =  /^(https?:\/\/)(www\.)?(?!-)[-a-zA-Z0-9@:%._~#=]{1,249}(?<!-)\.[A-Za-z]{2,6}([-a-zA-Z0-9._~:/?#[\]@!$&'()*+,;=]*)#?$/;

const validationUrl = (url) => {
  if (isURL.test(url)) {
    return url
  }
  throw new StatusCodeError(BAD_REQUEST)
}

const validationLogin = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .email()
      .message('Поле email должно быть заполнено'),
    password: Joi.string()
      .required()
      .min(8)
      .message('Поле пароль должно быть заполнено'),
  }),
})

module.exports = {
  isURL,
  validationUrl,
  validationLogin,
}