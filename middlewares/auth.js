const jwt = require('jsonwebtoken')

const { UNAUTHORIZED, StatusCodeError } = require('../utils/errors')
const { SECRET_SIGNING_KEY } = require('../utils/constants')

module.exports = (req, _, next) => {
  const { authorization } = req.headers

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new StatusCodeError(UNAUTHORIZED)
  }

  const token = authorization.replace('Bearer ', '')
  let payload

  try {
    payload = jwt.verify(token, SECRET_SIGNING_KEY)
  } catch (err) {
    throw new StatusCodeError(UNAUTHORIZED)
  }
  req.user = payload
  next()
}
