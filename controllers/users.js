const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { SECRET_SIGNING_KEY } = require('../utils/constants');
const { handleError } = require('../utils/errors');

const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => handleError(err, next));
};

const getUser = (req, res, next) => {
  const { userId } = req.params;
  return User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => handleError(err, next));
};

const createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  return bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(201).send({
      name: user.name,
      about: user.about,
      avatar: user.avatar,
      email: user.email,
    }))
    .catch((err) => handleError(err, next));
};

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => handleError(err, next));
};

const loginUser = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_SIGNING_KEY, { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      })
        .send({ message: `С возвращением, ${user.name}` });
    })
    .catch((err) => handleError(err, next));
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => handleError(err, next));
};

const updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    { new: true, runValidators: true },
  )
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => handleError(err, next));
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  getCurrentUser,
  loginUser,
  updateProfile,
  updateAvatar,
};
