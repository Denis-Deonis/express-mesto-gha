const router = require('express').Router();
const authLimiter = require('../middlewares/rateLimiter');
const auth = require('../middlewares/auth');

const userRoutes = require('./users');
const cardRoutes = require('./cards');

const {
  validationLogin,
  validationCreateUser,
} = require('../utils/validations');
const { loginUser, createUser } = require('../controllers/users');
const { NOT_FOUND } = require('../utils/errors');

router.post('/signin', [validationLogin, authLimiter], loginUser);
router.post('/signup', [validationCreateUser, authLimiter], createUser);

router.use(auth);
router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('/*', (req, res) => {
  res.status(NOT_FOUND).send({ message: '404: Страница не найдена.' });
});

module.exports = router;
