const router = require('express').Router()
const {
  validationId,
  validationUpdateProfile,
  validationUpdateAvatar,
} = require('../utils/validations')

const {
  getUsers,
  getUser,
  createUser,
  updateProfile,
  updateAvatar,
} = require('../controllers/users')

router.get('/', getUsers)
router.get('/:userId', validationId(), getUser)
router.post('/', createUser)
router.patch('/me', validationUpdateProfile(), updateProfile)
router.patch('/me/avatar', validationUpdateAvatar(), updateAvatar)

module.exports = router
