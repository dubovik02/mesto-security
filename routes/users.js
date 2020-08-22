const router = require('express').Router();

const {
  readUsers, findUserById, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.get('/', readUsers);
router.get('/:id', findUserById);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
