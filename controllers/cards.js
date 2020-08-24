const Cards = require('../models/card');

const validationErrName = 'ValidationError';
const castErrorName = 'CastError';
const serverErrMessage = 'На сервере произошла ошибка';

// Список карточек
module.exports.readCards = (req, res) => {
  Cards.find({})
    .then((cards) => {
      res.status(200).send(cards);
    })
    .catch(() => {
      res.status(500).send({ message: serverErrMessage });
    });
};
// Создание карточки
module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Cards.create({ name, link, owner })
    .then((card) => {
      res.status(200).send({ data: card });
    })
    .catch((err) => {
      if (err.name === validationErrName) {
        res.status(400).send({ error: err.message });
      } else {
        res.status(500).send({ message: serverErrMessage });
      }
    });
};
// Удаление карточки
module.exports.deleteCardById = (req, res) => {
  Cards.findById(req.params.id)
    .then((card) => {
      if (!card) {
        res.status(404).send({ message: `Карточка c ID ${req.params.id} не существует` });
      } else if (card.owner.toString() === req.user._id) {
        Cards.findByIdAndDelete(card._id)
          .then((removedCard) => {
            res.status(200).send({ data: removedCard });
          })
          .catch(() => {
            res.status(500).send({ message: serverErrMessage });
          });
      } else {
        res.status(403).send({ message: 'Нет прав на удаление' });
      }
    })
    .catch((err) => {
      if (err.name === castErrorName) {
        res.status(400).send({ message: 'Некорректный формат ID' });
      } else {
        res.status(500).send({ message: serverErrMessage });
      }
    });
};
// Like
module.exports.like = (req, res) => {
  // eslint-disable-next-line max-len
  Cards.findByIdAndUpdate({ _id: req.params.cardId }, { $addToSet: { likes: req.user._id } }, { new: true })
    .then((result) => {
      if (result) {
        res.status(200).send({ message: 'Like++', count: result.likes.length });
      } else {
        res.status(404).send({ message: `Карточка с ID ${req.params.cardId} не найдена.` });
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
// Dislike
module.exports.dislike = (req, res) => {
  // eslint-disable-next-line max-len
  Cards.findByIdAndUpdate({ _id: req.params.cardId }, { $pull: { likes: req.user._id } }, { new: true })
    .then((result) => {
      if (result) {
        res.status(200).send({ message: 'Like--', count: result.likes.length });
      } else {
        res.status(404).send({ message: `Карточка с ID ${req.params.cardId} не найдена.` });
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
