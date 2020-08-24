const router = require('express').Router();
const {
  readCards, createCard, deleteCardById, like, dislike,
} = require('../controllers/cards');

router.get('/', readCards);
router.post('/', createCard);
router.delete('/:id', deleteCardById);
router.put('/:cardId/likes', like);
router.delete('/:cardId/likes', dislike);

module.exports = router;
