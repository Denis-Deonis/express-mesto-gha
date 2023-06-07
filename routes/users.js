const router = require('express').Router()
const {
  validationId,
  validationUpdateUser,
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
router.patch('/me', updateProfile)
router.patch('/me/avatar', updateAvatar)

module.exports = router
