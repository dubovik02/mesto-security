const User = require('../models/user');

const validationErrName = 'ValidationError';
const castErrorName = 'CastError';
const serverErrMessage = 'На сервере произошла ошибка';

// Поиск по ИД
module.exports.findUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        res.status(404).send({ message: `Пользователь c ID ${req.params.id} не существует` });
      } else {
        res.status(200).send(user);
      }
    })
    .catch((err) => {
      if (err.name === castErrorName) {
        res.status(400).send({ message: 'Некорректный формат ID', error: err.message });
      } else {
        res.status(500).send({ message: serverErrMessage });
      }
    });
};
// Список
module.exports.readUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(() => {
      res.status(500).send({ message: serverErrMessage });
    });
};
// Обновление данных пользователя
module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const updateProp = { runValidators: true, new: true };
  User.updateOne({ _id: req.user._id }, { name, about }, updateProp)
    .then((result) => {
      if (result) {
        res.status(200).send({ message: `Данные пользователя c ID ${req.user._id} обновлены.` });
      } else {
        res.status(404).send({ message: `Пользователь c ID ${req.user._id} не найден.` });
      }
    })
    .catch((err) => {
      if (err.name === validationErrName) {
        res.status(400).send({ error: err.message });
      } else {
        res.status(500).send({ message: serverErrMessage });
      }
    });
};
// Обновление аватара
module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  const updateProp = { runValidators: true, new: true };
  User.updateOne({ _id: req.user._id }, { avatar }, updateProp)
    .then((result) => {
      if (result) {
        res.status(200).send({ message: `Аватар пользователя c ID ${req.user._id} обновлен.` });
      } else {
        res.status(404).send({ message: `Пользователь c ID ${req.user._id} не найден.` });
      }
    })
    .catch((err) => {
      if (err.name === validationErrName) {
        res.status(400).send({ error: err.message });
      } else {
        res.status(500).send({ message: serverErrMessage });
      }
    });
};
