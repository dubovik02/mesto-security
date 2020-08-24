const router = require('express').Router();

const { createUser } = require('../controllers/signup');

router.post('/', createUser);

module.exports = router;
