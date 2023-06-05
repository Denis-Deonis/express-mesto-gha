const mongoose = require('mongoose')
const { isURL } = require('../utils/validations')
const bcrypt = require('bcryptjs')
const { UNAUTHORIZED, StatusCodeError } = require('../utils/errors')

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
      default: 'Жак-Ив Кусто',
    },
    about: {
      type: String,
      minlength: [2, 'Минимальная длина поля "about" - 2'],
      maxlength: [30, 'Максимальная длина поля "about" - 30'],
      default: 'Исследователь',
    },
    avatar: {
      type: String,
      validate: {
        validator: (url) => isURL.test(url),
        message: 'Некорректный адрес URL',
      },
      default:
        'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (email) => /.+@.+\..+/.test(email),
        message: 'Некорректый адрес электронной почты',
      },
    },

    password: {
      type: String,
      required: true,
      select: false,
      validate: {
        validator: ({ length }) => length >= 4,
        message: 'Пароль должен содержать более 4 символов',
      },
    },
  },
  {
    versionKey: false,
    statics: {
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select('+password')
          .then((user) => {
            if (!user) {
              return Promise.reject(
                new StatusCodeError(
                  UNAUTHORIZED,
                  'Неверный адрес электронной почты или пароль'
                )
              )
            }
            return bcrypt.compare(password, user.password).then((matched) => {
              if (!matched) {
                return Promise.reject(
                  new StatusCodeError(
                    UNAUTHORIZED,
                    'Неверный адрес электронной почты или пароль'
                  )
                )
              }
              return user
            })
          })
      },
    },
  }
)

module.exports = mongoose.model('user', userSchema)
