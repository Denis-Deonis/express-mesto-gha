const router = require('express').Router();
const { validationId } = require('../utils/validations');

const {
  getCards,
  createCard,
  deleteCard,
  toggleLike,
} = require('../controllers/cards');

router.get('/', getCards);
router.post('/', createCard);
router.delete('/:cardId', validationId(), deleteCard);
router.put('/:cardId/likes', validationId(), toggleLike);
router.delete('/:cardId/likes', validationId(), (req, res, next) => {
  toggleLike(req, res, next, false);
});

module.exports = router;
