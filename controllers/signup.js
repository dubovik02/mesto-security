const bcrypt = require('bcryptjs');
const User = require('../models/user');

const validationErrName = 'ValidationError';
const serverErrMessage = 'На сервере произошла ошибка';

const PASS_LENGTH = 8;

// Создание
module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  // если пароль не задан, пароль перед сохранением не захишируем -
  // создание не возможно.
  if (!password) {
    res.status(400).send({ message: 'Пароль не задан' });
  }
  // проверка длины пароля
  if (password.length < PASS_LENGTH) {
    res.status(400).send({ message: `Длина пароля должна быть не менее ${PASS_LENGTH} символов` });
  }

  User.findUserByEmail(email)
    .then((user) => {
      if (user) {
        res.status(400).send({ message: 'Пользователь с таким email уже существует' });
      } else {
        bcrypt.hash(password, 10)
          .then((hash) => User.create({
            name, about, avatar, email, password: hash,
          })
            .then((newUser) => {
              res.send({ data: newUser });
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
