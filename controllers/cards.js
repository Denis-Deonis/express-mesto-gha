const Card = require('../models/card');

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => res.status(500).send({
      message: 'Произошла ошибка при запросе карточек',
      err: err.message,
      stack: err.stack,
    }));
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => {
      if (err.name === 'CastError' || err.name === 'ValidationError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при создании карточки',
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

module.exports.deleteCard = (req, res) => {
  const { cardId } = req.params;
  Card.findByIdAndRemove(cardId)
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({
          message: 'Карточка c указанным id не найдена',
          err: err.message,
          stack: err.stack,
        });
      }
      if (err.name === 'CastError') {
        res.status(400).send({
          message: 'Переданы некорректные данные при попытке удалении карточки',
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

module.exports.toggleLike = (req, res, isLiked = true) => {
  const { cardId } = req.params;
  Card.findByIdAndUpdate(
    cardId,
    isLiked
      ? { $addToSet: { likes: req.user._id } }
      : { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(404).send({
          message: 'Карточка c указанным id не найдена',
          err: err.message,
          stack: err.stack,
        });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({
          message:
            'Переданы некорректные данные при попытке лайкнуть или дизлайкнуть',
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
