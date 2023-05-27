const User = require('../models/user');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch(() => res.status(500).send({ message: 'Внутренняя ошибка сервера' }));
};

module.exports.getUser = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при поиске пользователя',
          err: err.message,
          stack: err.stack,
        });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({
          message: 'Пользователь c указанным _id не найден',
          err: err.message,
          stack: err.stack,
        });
      }

      return res.status(500).send({
        message: 'Внутренняя ошибка сервера',
        err: err.message,
        stack: err.stack,
      });
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании пользователя.',
          err: err.message,
          stack: err.stack,
        });
      } else {
        res.status(500).send({
          message: 'Внутренняя ошибка сервера',
          err: err.message,
          stack: err.stack,
        });
      }
    });
};

module.exports.updateProfile = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при обновлении профиля',
          err: err.message,
          stack: err.stack,
        });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({
          message: 'Пользователь не найден',
          err: err.message,
          stack: err.stack,
        });
      }

      return res.status(500).send({
        message: 'Внутренняя ошибка сервера',
        err: err.message,
        stack: err.stack,
      });
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        return res.status(400).send({
          message: 'Переданы некорректные данные при обновлении аватара',
          err: err.message,
          stack: err.stack,
        });
      }

      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({
          message: 'Пользователь не найден',
          err: err.message,
          stack: err.stack,
        });
      }

      return res.status(500).send({
        message: 'Внутренняя ошибка сервера',
        err: err.message,
        stack: err.stack,
      });
    });
};
