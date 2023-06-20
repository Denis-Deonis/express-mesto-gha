const router = require('express').Router();

const {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users');

const {
  validationId,
  validationUpdateProfile,
  validationUpdateAvatar,
} = require('../utils/validations');

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:userId', validationId('cardId'), getUser);
router.patch('/me', validationUpdateProfile, updateProfile);
router.patch('/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = router;
