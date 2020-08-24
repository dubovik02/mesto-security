const bcrypt = require('bcryptjs');
const User = require('../models/user');

const validationErrName = 'ValidationError';
const serverErrMessage = 'На сервере произошла ошибка';

const PASS_LENGTH = 8;

// Создание
// eslint-disable-next-line consistent-return
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  // если пароль не задан, пароль перед сохранением не захишируем -
  // создание не возможно.
  if (!password) {
    return res.status(400).send({ message: 'Пароль не задан' });
  }

  // пароль не может состоять из пробелов
  if (!password.split(' ').join('').length) {
    return res.status(400).send({ message: 'Пароль не может состоять только из пробелов' });
  }

  // проверка длины пароля
  if (password.length < PASS_LENGTH) {
    return res.status(400).send({ message: `Длина пароля должна быть не менее ${PASS_LENGTH} символов` });
  }

  User.findUserByEmail(email)
    .then((user) => {
      if (user) {
        res.status(409).send({ message: 'Пользователь с таким email уже существует' });
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name, about, avatar, email, password: hash,
          })
            .then((newUser) => {
              res.status(200).send({
                _id: newUser._id,
                name: newUser.name,
                about: newUser.about,
                avatar: newUser.avatar,
                email: newUser.email,
              });
            })
            .catch((err) => {
              if (err.name === validationErrName) {
                res.status(400).send({ error: err.message });
              } else {
                res.status(500).send({ message: serverErrMessage });
              }
            }));
      }
    })
    .catch(() => {
      res.status(500).send({ message: serverErrMessage });
    });
};
