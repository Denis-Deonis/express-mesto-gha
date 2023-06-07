const router = require('express').Router()
const rateLimit = require('express-rate-limit')
const auth = require('../middlewares/auth')

const userRoutes = require('./users')
const cardRoutes = require('./cards')

const { NOT_FOUND } = require('../utils/errors')
const {validationLogin, validationCreateUser} = require('../utils/validations')
const { loginUser, createUser } = require('../controllers/users')

router.use('/users', userRoutes)
router.use('/cards', cardRoutes)
router.use('/*', (req, res) => {
  res.status(404).send({ message: '404: Страница не найдена.' })
})

module.exports = router
