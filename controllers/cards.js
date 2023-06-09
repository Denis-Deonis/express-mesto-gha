const Card = require('../models/card');
const { handleError, FORBIDDEN, StatusCodeError } = require('../utils/errors');

const getCards = (req, res, next) => {
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((err) => handleError(err, next));
};

const createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  return Card.create({ name, link, owner })
    .then((card) => res.status(201).send(card))
    .catch((err) => handleError(err, next));
};

const deleteCard = (req, res, next) => {
  const { cardId } = req.params;
  return Card.findById(cardId)
    .orFail()
    .then((card) => {
      if (card.owner.toString() === req.user._id) {
        Card.findByIdAndRemove(cardId)
          .orFail()
          .then((deletedCard) => res.send(deletedCard));
      } else throw new StatusCodeError(FORBIDDEN);
    })
    .catch((err) => handleError(err, next));
};

const toggleLike = (req, res, next, isLiked = true) => {
  const { cardId } = req.params;
  return Card.findByIdAndUpdate(
    cardId,
    isLiked
      ? { $addToSet: { likes: req.user._id } }
      : { $pull: { likes: req.user._id } },
    { new: true },
  )
    .orFail()
    .then((card) => res.send(card))
    .catch((err) => handleError(err, next));
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  toggleLike,
};
